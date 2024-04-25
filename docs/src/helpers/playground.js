export const htmlBefore = `<!-- playground-hide -->
<html>
<head>
<link href="./index.css" rel="stylesheet">
<script src="./index.js" type="module"></script>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
</head>
<body>
<!-- playground-hide-end -->
`;

export const htmlAfter = `<!-- playground-hide --></body></html><!-- playground-hide-end -->`;

export const cssBefore = `/* playground-hide */ body { padding 1rem; font-family: Lato; } /* playground-hide-end */`;

export const jsBefore = ``;

const baseURL = `https://semantic-next.vercel.app`;
const packageBase = `${baseURL}/playground/packages/@semantic-ui`;

export const importMap = {
  imports: {
    '@semantic-ui/component': `${packageBase}/component/`,
    '@semantic-ui/component/': `${packageBase}/component/src/`,
    '@semantic-ui/core': `${packageBase}/core/`,
    '@semantic-ui/core/': `${packageBase}/core/src/`,
    '@semantic-ui/query': `${packageBase}/query/`,
    '@semantic-ui/query/': `${packageBase}/query/src/`,
    '@semantic-ui/reactivity': `${packageBase}/reactivity/`,
    '@semantic-ui/reactivity/': `${packageBase}/reactivity/src/`,
    '@semantic-ui/specs': `${packageBase}/specs/`,
    '@semantic-ui/specs/': `${packageBase}/specs/src/`,
    '@semantic-ui/templating': `${packageBase}/templating/`,
    '@semantic-ui/templating/': `${packageBase}/templating/src/`,
    '@semantic-ui/utils': `${packageBase}/utils/src/utils.js`,
    '@semantic-ui/utils/': `${packageBase}/utils/src/`,
  }
};
