import { fatal, each, isString } from './utils.js';

export class GistFiddle {
  /*
    Stores a GitHub token for gist operations.
    Title|description are encoded in gist.description.
  */
  constructor(token) {
    if (!isString(token) || !token.trim()) {
      fatal('No valid GitHub token');
    }
    this.token = token.trim();
  }

  static endpoint = 'https://api.github.com/gists'

  /*
    Creates a new gist with title, description, files
  */
  async create({ title = '', description = '', files = {}, isPublic = false } = {}) {
    const gistBody = {
      description: this.#encodeTitleDesc(title, description),
      public: !!isPublic,
      files: {}
    };
    each(files, (contents, fileName) => {
      gistBody.files[fileName] = { content: contents };
    });
    const response = await this.#fetchWithHandling(GistFiddle.endpoint, {
      method: 'POST',
      headers: this.#headers(),
      body: JSON.stringify(gistBody)
    });
    return response.json();
  }

  /*
    Loads a gist. If version is set, fetch that commit.
  */
  async load(gistId, version) {
    if (!isString(gistId) || !gistId.trim()) {
      fatal('No gistId provided to load()');
    }
    if (!version) {
      return this.#fetchLatestGist(gistId);
    }
    const commits = await this.#fetchGistCommits(gistId);
    const oldestFirst = commits.slice().reverse();
    if (version > oldestFirst.length) {
      fatal(`Requested version #${version} but only ${oldestFirst.length} commits exist`);
    }
    const commitSha = oldestFirst[version - 1].version;
    return this.#fetchGistAtCommit(gistId, commitSha);
  }

  /*
    Updates a gist, creating a new commit => version++.
  */
  async update(gistId, { title, description, files = {} } = {}) {
    if (!isString(gistId) || !gistId.trim()) {
      fatal('No gistId provided to update()');
    }
    const current = await this.#fetchLatestGist(gistId);
    const { title: oldTitle, description: oldDesc } = this.#decodeTitleDesc(current.description || '');
    const newTitle = title !== undefined ? title : oldTitle;
    const newDesc = description !== undefined ? description : oldDesc;

    const patchBody = {
      description: this.#encodeTitleDesc(newTitle, newDesc),
      files: {}
    };
    each(files, (contents, fileName) => {
      patchBody.files[fileName] = contents === null ? null : { content: contents };
    });

    const response = await this.#fetchWithHandling(`${GistFiddle.endpoint}/${gistId}`, {
      method: 'PATCH',
      headers: this.#headers(),
      body: JSON.stringify(patchBody)
    });
    return response.json();
  }

  /* Internal Helpers */

  #headers() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github.v3+json'
    };
  }

  async #fetchWithHandling(url, options) {
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    }
    if (response.status === 403) {
      const remaining = response.headers.get('X-RateLimit-Remaining');
      if (remaining === '0') {
        const limit = response.headers.get('X-RateLimit-Limit');
        const reset = response.headers.get('X-RateLimit-Reset');
        const resetTime = new Date(parseInt(reset, 10) * 1000);
        fatal(`Rate limit exceeded (limit=${limit}, resets=${resetTime.toLocaleString()})`, {
          metadata: { status: response.status }
        });
      }
    }
    fatal(`Request failed: ${response.status}`, {
      metadata: { status: response.status, statusText: response.statusText }
    });
  }

  async #fetchLatestGist(gistId) {
    const response = await this.#fetchWithHandling(`${GistFiddle.endpoint}/${gistId}`, {
      headers: this.#headers()
    });
    return response.json();
  }

  async #fetchGistCommits(gistId) {
    const response = await this.#fetchWithHandling(`${GistFiddle.endpoint}/${gistId}/commits`, {
      headers: this.#headers()
    });
    return response.json();
  }

  async #fetchGistAtCommit(gistId, sha) {
    const response = await this.#fetchWithHandling(`${GistFiddle.endpoint}/${gistId}/${sha}`, {
      headers: this.#headers()
    });
    return response.json();
  }

  #encodeTitleDesc(title = '', description = '') {
    return `${(title || '').replace(/\r?\n/g, ' ')}|${(description || '').replace(/\r?\n/g, ' ')}`;
  }

  #decodeTitleDesc(str = '') {
    const separatorIndex = str.indexOf('|');
    if (separatorIndex === -1) {
      return { title: str, description: '' };
    }
    return {
      title: str.slice(0, separatorIndex),
      description: str.slice(separatorIndex + 1)
    };
  }
}
