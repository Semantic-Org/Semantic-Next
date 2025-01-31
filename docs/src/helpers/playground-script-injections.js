import { each } from '@semantic-ui/utils';

/* These are top level to make it easier to format */
export const componentJSBefore = ``;
export const componentJSAfter = ``;

export const componentHTMLBefore = ``;
export const componentHTMLAfter = ``;

export const componentCSSBefore = ``;
export const componentCSSAfter = ``;


export const indexHTMLBeforeStandard = `<!-- playground-hide -->
<html>
<head>
<!-- This defines the component tag and makes it available on your page !-->
<script src="./component.js" type="module"></script>
<link href="./index.css" rel="stylesheet">
</head>
<body>
<!-- playground-hide-end -->
`;
export const indexHTMLBeforeUI = `<!-- playground-hide -->
<html>
<head>
<!-- This defines the component tag and makes it available on your page !-->
<script src="/node_modules/@semantic-ui/core/src/semantic-ui.js" type="module"></script>
<link rel="stylesheet" href="/node_modules/@semantic-ui/core/dist/semantic-ui.css"></link>
<link rel="stylesheet" href="/node_modules/@semantic-ui/core/dist/theme/base.css"></link>
<script src="./component.js" type="module"></script>
<link href="./index.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
</head>
<body>
<!-- playground-hide-end -->
`;

export const indexHTMLAfter = `<!-- playground-hide --></body></html><!-- playground-hide-end -->`;

export const indexJSBefore = `/* playground-fold */ body { padding 1rem; font-family: Lato; } /* playground-fold-end */`;
export const indexJSAfter = ``;

export const indexCSSBefore = `/* playground-fold */ body { padding 1rem; font-family: Lato; } /* playground-fold-end */`;
export const indexCSSAfter = ``;


export const getPlaygroundInjections = (type) => {
  const indexHTMLBefore = (type == 'ui')
    ? indexHTMLBeforeUI
    : indexHTMLBeforeStandard
  ;
  return {
    'component.js': {
      before: componentJSBefore,
      after: componentJSAfter,
    },
    'component.html': {
      before: componentHTMLBefore,
      after: componentHTMLAfter
    },
    'component.css': {
      before: componentCSSBefore,
      after: componentCSSAfter,
    },
    'index.js': {
      before: indexJSBefore,
      after: indexJSAfter,
    },
    'index.html': {
      before: indexHTMLBefore,
      after: indexHTMLAfter
    },
    'index.css': {
      before: indexCSSBefore,
      after: indexCSSAfter,
    },
  };
};
export const addPlaygroundInjections = (files, type) => {
  const fileInjections = getPlaygroundInjections(type);
  each(files, (file, name) => {
    if(fileInjections[name]) {
      const { before, after } = fileInjections[name];
      file[name].content = before + file[name].content + after;
    }
  });
  return files;
};

