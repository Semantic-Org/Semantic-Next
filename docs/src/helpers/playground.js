import { asyncEach, tokenize, inArray, get, camelToKebab, filterObject, isString, each } from '@semantic-ui/utils';

import { addPlaygroundInjections, errorJS, errorCSS, logJS, logCSS, isStaticBuild, foldMarkerStart, foldMarkerEnd } from './injections.js';

import { importMapJSON } from '../pages/examples/importmap.json.js';
import { packageJSON } from '../pages/examples/package.json.js';
import { makeBase64UrlSafe, fromBase64UrlSafe, encodeObject, decodeObject } from './link-encoder.js';

/*
  Helper to add code folding for import export statements
*/
export const hideComponentBoilerplate = (code) => {
  // Regex to match everything up to and including the last line with getText
  const getTextRegex = /^[\s\S]*(?:getText\([^)]*\)[;\s]*$)/m;

  // Regex to match from defineComponent to the end of the file
  const defineComponentRegex = /^defineComponent[\s\S]*$/m;

  // Apply the first fold
  let foldedCode = code.replace(getTextRegex, (match) => {
    return `// click ellipsus to show imports ${foldMarkerStart}\n${match.trim()}\n${foldMarkerEnd}\n`;
  });

  // Apply the second fold
  foldedCode = foldedCode.replace(defineComponentRegex, (match) => {
    return `// click ellipsus to show exports ${foldMarkerStart}\n${match}\n${foldMarkerEnd}\n`;
  });

  return foldedCode;
};

/*
  Gets example files from a folder for a given content id
  this is used in the learn and examples section to load
  examples
*/
export const getExampleFiles = async({
  contentID, // content id
  allFiles = {}, // import.meta.glob cannot be used here so you must pass in file collection
  basePath = '../../examples/', // base path to content collection from file location
  subFolder = '', // sub folder inside content collection that contains example
  hideBoilerplate = true, // whether import/export code should be collapsed
  includeFolder = false, // whether all files in folder should be included regardless of the filename
  includeError = true, // whether to intercept and display js errors,
  includeLog = false, // whether to include script to intercept console logs,
  includePlaygroundInjections = false, // whether to inject values to make repl work
  useTypescript = true, // convert js files to ts files
  emptyIfAllGenerated = false, // if all files are generated return an empty object
  includeImportMap = !isStaticBuild, // whether to map imports to node_modules
  includePackageJSON = true, // whether to include a package.json file defining project deps
} = {}) => {
  if(!contentID) {
    return;
  }
  let hasComponent = false;
  let exampleFiles = {};

  let deepPath = `${basePath}.*/${contentID}/${subFolder}`;
  let shallowPath = `${basePath}${contentID}/${subFolder}`;
  let pathRegExpString = `${deepPath}|${shallowPath}`;
  const pathRegExp = new RegExp(pathRegExpString);
  await asyncEach(allFiles, async (file, path) => {
    if (path.match(pathRegExp)) {
      const fileName = path.replace(pathRegExp, '').replace('/', '');

      const getContentType = (filename) => {
        const extension = filename.split('.').pop();
        const contentTypes = {
          html: 'text/html',
          css: 'text/css',
          js: 'text/javascript'
        };
        return get(contentTypes, extension) || 'text/html';
      };

      if(inArray(fileName, ['page.html'])) {
        const fileContent = await file();
        exampleFiles['page.html'] = {
          contentType: 'text/html',
          content: fileContent.default
        };
      }
      else if(inArray(fileName, ['page.css'])) {
        const fileContent = await file();
        exampleFiles['page.css'] = {
          contentType: 'text/css',
          content: fileContent.default
        };
      }
      else if(inArray(fileName, ['page.js'])) {
        const fileContent = await file();
        exampleFiles['page.js'] = {
          contentType: 'text/javascript',
          content: fileContent.default
        };
      }
      else if(inArray(fileName, ['component.js', `${contentID}.js`])) {
        const fileContent = await file();
        let fileText = fileContent.default;
        hasComponent = fileText.search('defineComponent') > -1;
        if(hideBoilerplate) {
          fileText = hideComponentBoilerplate(fileText);
        }
        exampleFiles['component.js'] = {
          contentType: 'text/javascript',
          content: fileText
        };
      }
      else if(includeFolder) {
        const fileContent = await file();
        exampleFiles[fileName] = {
          contentType: getContentType(fileName),
          content: fileContent.default
        };
        return;
      }
      else if(inArray(fileName, ['component.html', `${contentID}.html`])) {
        const fileContent = await file();
        exampleFiles['component.html'] = {
          contentType: 'text/html',
          content: fileContent.default
        };
      }
      else if(inArray(fileName, ['component.css', `${contentID}.css`])) {
        const fileContent = await file();
        exampleFiles['component.css'] = {
          contentType: 'text/css',
          content: fileContent.default
        };
      }
      if(includeLog && inArray(fileName, ['index.js', `${contentID}.js`])) {
        const fileContent = await file();
        exampleFiles['index.js'] = {
          contentType: 'text/javascript',
          content: fileContent.default
        };
      }
    }
  });
  // auto generate page.html if not specified for component
  if(!exampleFiles['page.html']?.content) {

    // get tag name from contents
    let tagName;
    if(hasComponent) {
      let matches = exampleFiles['component.js'].content.match(/tagName: '(.*)'/);
      if(matches?.length > 1) {
        tagName = matches[1];
      }
      else {
        tagName = camelToKebab(contentID);
      }
    }

    exampleFiles['page.html'] = {
      contentType: 'text/html',
      generated: true,
      content: (tagName)
        ? `<${tagName}></${tagName}>`
        : ``
    };
  }

  if(includeError) {
    exampleFiles['error.js'] = {
      contentType: 'text/javascript',
      generated: true,
      hidden: true,
      content: errorJS
    };
    exampleFiles['error.css'] = {
      contentType: 'text/css',
      generated: true,
      hidden: true,
      content: errorCSS
    };
  }

  if(includeLog) {
    exampleFiles['log.js'] = {
      contentType: 'text/javascript',
      generated: true,
      hidden: true,
      content: logJS
    };
    exampleFiles['log.css'] = {
      contentType: 'text/css',
      generated: true,
      hidden: true,
      content: logCSS
    };
  }

  // auto generate page.css/js if not specified for component
  if(!exampleFiles['page.css']?.content) {
    exampleFiles['page.css'] = {
      contentType: 'text/css',
      generated: true,
      content: ''
    };
  }
  if(!exampleFiles['component.js']?.content) {
    exampleFiles['component.js'] = {
      contentType: 'text/javascript',
      generated: true,
      content: ''
    };
  }
  if(!exampleFiles['page.js']?.content) {
    exampleFiles['page.js'] = {
      contentType: 'text/javascript',
      generated: true,
      content: ''
    };
  }


  if(includePlaygroundInjections) {
    addPlaygroundInjections(exampleFiles, { includeLog });
  }

  if(emptyIfAllGenerated) {
    let allGenerated = true;
    each(exampleFiles, (file, name) => {
      if(file.generated !== true) {
        allGenerated = false;
        return;
      }
    });
    if(allGenerated) {
      return {};
    }
  }
  if(!includeLog && exampleFiles['page.js'].generated && exampleFiles['page.css']) {
    exampleFiles['page.html'].generated = false;
  }
  if(includeLog) {
    exampleFiles['page.html'].hidden = true;
  }

  if(useTypescript) {
    const typescriptExampleFiles = {};
    each(exampleFiles, (content, filename) => {
      filename = filename.replace('.js', '.ts');
      typescriptExampleFiles[filename] = content;
    });
    exampleFiles = typescriptExampleFiles;
  }

  if(includeImportMap) {
    exampleFiles['import-map.js'] = getImportMap();
  }
  if(includePackageJSON) {
    exampleFiles['package.json'] = getPackageJSON();
  }

  return exampleFiles;

};

/*
  Returns empty versions of essential files for use with playground
*/
export const getEmptyProjectFiles = ({
  withInjections = false,
} = {}) => {
  let emptyFiles = {
    'component.js': {
      contentType: 'text/javascript',
      content: '',
    },
    'component.html': {
      contentType: 'text/html',
      content: '',
    },
    'component.css': {
      contentType: 'text/css',
      content: '',
    },
    'page.js': {
      contentType: 'text/javascript',
      content: '',
    },
    'page.html': {
      contentType: 'text/html',
      content: '',
    },
    'page.css': {
      contentType: 'text/css',
      content: '',
    },
  };
  if(withInjections) {
    emptyFiles = addPlaygroundInjections(emptyFiles);
  }
  return emptyFiles;
};


/*
  Returns default horizontal panel index for file types
  in panel layout of playground
*/
export const getPanelIndexes = (files = {}, { type } = {}) => {
  let indexes;
  if(type == 'log') {
    indexes = {
      'page.js': 0,
      'page.ts': 0,
      'index.js': 0,
      'index.ts': 0,
    };
  }
  else {
    indexes = {
      'index.js': 0,
      'index.ts': 0,
      'component.js': 0,
      'component.ts': 0,
      'component.html': 0,
      'component.css': 0,
      'page.html': 1,
      'page.css': 1,
      'page.js': 1,
      'page.ts': 1,
    };
  }
  // filter out generated and absent files
  indexes = filterObject(indexes, (value, key) => {
    if(!files[key] || files[key]?.generated) {
      return false;
    }
    return true;
  });
  // use right pane for css if no index files
  if(!indexes['page.html'] && !indexes['page.css'] && !indexes['page.js']) {
    indexes['component.css'] = 1;
  }
  return indexes;
};

export const getSandboxURL = () => {
  return `/sandbox/`;
};

export const getExampleID = (example) => {
  if(isString(example)) {
    return example;
  }
  if(example.data) {
    example = example.data;
  }
  const exampleID = example?.id || tokenize(example?.title);
  return exampleID;
};


export const getPackageJSON = () => {
  return {
    contentType: 'text/json',
    hidden: true,
    generated: true,
    content: packageJSON
  };
};

export const getImportMap = () => {
  return {
    contentType: 'text/importmap',
    hidden: true,
    generated: true,
    content: importMapJSON
  };
};

// Create a playground link from an object of parameters.
// If a key is 'files', its value is encoded using encodeObject.
// Other values are handled by URLSearchParams, which takes care of URL encoding.
export const getPlaygroundLink = (params, baseUrl = '/playground') => {
  const queryParams = new URLSearchParams();
  each(params, (value, key) => {
    if (key === 'files') {
      queryParams.set(key, encodeObject(value));
    }
    else {
      // URLSearchParams encodes the value automatically
      queryParams.set(key, String(value));
    }
  });
  return `${baseUrl}?${queryParams.toString()}`;
};

export const getCodePlaygroundLink = (code, baseUrl = '/playground') => {
  const params = {
    files: {
      'page.html': code
    }
  };
  return getPlaygroundLink(params);
};


// Read the query string and return the decoded parameters.
// The 'files' parameter is decoded using decodeFiles.
export const readPlaygroundLink = queryString => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params.entries()) {
    if (key === 'files') {
      try {
        result[key] = decodeObject(value);
      }
      catch (err) {
        console.error('Error decoding files:', err);
        result[key] = null;
      }
    }
    else {
      result[key] = value;
    }
  }
  return result;
};
