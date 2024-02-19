import axios from 'axios';
import decompress from 'decompress';

const githubToken = process.env.GITHUB_TOKEN;
const repoOwner = 'Semantic-Org';
const repoName = 'Semantic-Next';
const workflowId = 'ci.yml'; 
const branchName = 'main';

const artifactName = 'test-results-browser';

const cachedMinutes = 60;
let cachedJSON;
let cachedTimestamp;

const getJSON = async () => {
  
  const headers = {
    'Authorization': `Bearer ${githubToken}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  try {
    // Fetch the latest workflow run
    const branchURL = `https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/${workflowId}/runs?branch=${branchName}`;
    const runsResponse = await axios.get(branchURL, { headers });
    const lastRunID = runsResponse.data.workflow_runs[0].id;
    // Fetch artifacts for the latest workflow run
    const artifactURL = `https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs/${lastRunID}/artifacts`
    const artifactsResponse = await axios.get(artifactURL, { headers });

    const artifact = artifactsResponse.data.artifacts.find(artifact => artifact.name == artifactName);

    if(artifact && !artifact.expired) {
      const zip = await axios.get(artifact.archive_download_url, { headers, responseType: 'arraybuffer' });
      const files = await decompress(zip.data);
      const result = files.find(file => file.path == `${artifactName}.json`);
      const jsonString = Buffer.from(result.data).toString();
      const rawJSON = JSON.parse(jsonString);
      const passing = rawJSON.numPassedTests;
      const failed = rawJSON.numFailedTests;
      const total = rawJSON.numTotalTests;
      const passRatio = passing / total;
      const colorCutoffs = {
        1: 'green',
        0.9: 'yellow',
        0.85: 'orange',
        0.8: 'red'
      };
      const allPassing = (passRatio == 1);
      const color = Object.entries(colorCutoffs).find(([cutoff, color]) => passRatio >= cutoff)[1];
      const status = (allPassing)
          ? `${passing} of ${total} Passing`
          : `${failed} of ${total} Failing`
      ;
      const json = {
        subject: 'E2E Tests',
        icon: 'github',
        status: status,
        color: color,
      };
      return json;
    }
    // Code to find the specific artifact named 'test-results.json'
    return {
      icon: 'github',
      subject: 'E2E Tests',
      status: 'Indeterminate',
      color: 'grey'
    };
  } catch (error) {
    console.log(error);
    return {
      icon: 'github',
      subject: 'E2E Tests',
      status: 'Indeterminate',
      color: 'grey'
    };
  }
  
};
export const handler = async (event) => {
  const timestamp = new Date().getTime();
  const seconds = 60;
  const milliseconds = 1000;
  const expireTimestamp = cachedTimestamp + (seconds * milliseconds * cachedMinutes);
  let json;
  if(cachedJSON && !cachedJSON.status == 'Indeterminate' && timestamp < expireTimestamp) {
    json = cachedJSON;
    json.cached = true;
    json.cacheDate = cachedTimestamp;
  }
  else {
    json = await getJSON();
    cachedJSON = json;
    cachedTimestamp = timestamp;
    json.cached = false;
  }
  return json;
};
