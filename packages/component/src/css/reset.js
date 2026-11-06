// wrapped in @layer global.reset so unlayered component css and primitive layers always win
// :host sets border-box so inherit works inside shadow roots even when the host page has no reset
// form and input rules normalize UA font inheritance and Safari / iOS WebKit appearance quirks
export default `@layer global.reset {
  :host {
    box-sizing: border-box;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  input[type="text"],
  input[type="email"],
  input[type="search"],
  input[type="password"] {
    -webkit-appearance: none;
    -moz-appearance: none;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }
  button,
  [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: button;
  }
  [type="search"] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }
  [type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }
}`;
