// @ts-check
/**
 * @typedef {string | number | null | undefined | bigint | boolean | symbol} Primitive
 * @typedef {(...args: any[]) => any} AnyFunction
 */

class PrettyJSONError extends Error {
  /**
   *
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = "PrettyJSONError";
  }
}

class PrettyJSON extends HTMLElement {
  /**
   * @type {any}
   */
  #input;

  /**
   * @type {boolean}
   */
  #isExpanded;

  static get observedAttributes() {
    return ["expand", "key", "truncate-string"];
  }

  static styles = `/* css */
    :host {
      --arrow-color: #444444;
      --arrow-color-hover: #888888;
      --brace-color: #444444;
      --bracket-color: #444444;
      --null-color: #444444;
      --comma-color: #444444;
      --key-color: #C69FF1;
      --ellipsis-color: #444444;
      --ellipsis-color-hover: #58C1FE;
      --string-color: #58C1FE;
      --number-color: #58a6ff;
      --boolean-color: #656565;

      --indent: 18px;
    }
    button {
      border: none;
      background: transparent;
      cursor: pointer;
      font-family: inherit;
      font-size: 1rem;
      vertical-align: text-bottom;
    }
    .container {
      font-family: monospace;
      font-size: 1rem;
    }
    .key {
      color: var(--key-color);
      margin-right: 0.5rem;
      padding: 0;
    }
    .key .arrow {
      width: 10px;
      height: 7px;
      margin-left: -15px;
      padding-right: 6px;
      vertical-align: 2px;
    }
    .arrow .triangle {
      fill: var(--arrow-color);
      transition: all 0.3s ease;
    }
    .arrow:hover .triangle {
      fill: var(--arrow-color-hover);
    }
    .comma {
      color: var(--comma-color);
    }
    .brace {
      color: var(--brace-color);
    }
    .string,
    .url {
      color: var(--string-color);
    }
    .number,
    .bigint {
      color: var(--number-color);
    }
    .null {
      color: var(--null-color);
    }
    .boolean {
      color: var(--boolean-color);
    }

    .ellipsis {
      width: 1rem;
      padding: 0;
      font-size: 16px;
      color: var(--ellipsis-color);
    }
    .ellipsis:hover {
      color: var(--ellipsis-color-hover);
    }
    .ellipsis::after {
      content: "…";
    }
    .string .ellipsis::after {
      color: var(--string-color);
    }
    .triangle {
      fill: black;
      stroke: black;
      stroke-width: 0;
    }
    .row {
      padding-left: var(--indent);
    }
    .row .row {
      display: block;
    }
    .row > div,
    .row > span {
      display: inline-block;
    }
  `;

  constructor() {
    super();

    this.#isExpanded = true;
    this.attachShadow({ mode: "open" });
  }

  get #expandAttributeValue() {
    const expandAttribute = this.getAttribute("expand");
    if (expandAttribute === null) {
      return 1;
    }
    const expandValue = Number.parseInt(expandAttribute);
    return isNaN(expandValue) || expandValue < 0 ? 0 : expandValue;
  }

  get #truncateStringAttributeValue() {
    const DEFAULT_TRUNCATE_STRING = 500;
    const truncateStringAttribute = this.getAttribute("truncate-string");
    if (truncateStringAttribute === null) {
      return DEFAULT_TRUNCATE_STRING;
    }
    const truncateStringValue = Number.parseInt(truncateStringAttribute);
    return isNaN(truncateStringValue) || truncateStringValue < 0
      ? 0
      : truncateStringValue;
  }

  #toggle() {
    this.#isExpanded = !this.#isExpanded;
    this.setAttribute(
      "expand",
      this.#isExpanded ? String(this.#expandAttributeValue + 1) : "0"
    );
    this.#render();
  }

  /**
   * @param {Record<any, any> | any[] | Primitive | AnyFunction} input
   * @param {number} expand
   * @param {string} [key]
   * @returns {HTMLElement}
   */
  #createChild(input, expand, key) {
    if (this.#isPrimitiveValue(input)) {
      const container = this.#createContainer();
      container.appendChild(this.#createPrimitiveValueElement(input));
      return container;
    }
    return this.#createObjectOrArray(input);
  }

  /**
   * @param {any} input
   * @returns {input is Primitive}
   */
  #isPrimitiveValue(input) {
    return typeof input !== "object" || input === null;
  }

  #isValidStringURL() {
    try {
      new URL(this.#input);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * @param {Primitive} input
   * @returns {HTMLElement}
   */
  #createPrimitiveValueElement(input) {
    const container = document.createElement("div");
    const type = typeof input === "object" ? "null" : typeof input;
    container.className = `primitive value ${type}`;
    if (typeof input === "string") {
      if (this.#isValidStringURL()) {
        const anchor = document.createElement("a");
        anchor.className = "url";
        anchor.href = this.#input;
        anchor.target = "_blank";
        anchor.textContent = input;
        container.append('"', anchor, '"');
      } else if (input.length > this.#truncateStringAttributeValue) {
        container.appendChild(this.#createTruncatedStringElement(input));
      } else {
        container.textContent = JSON.stringify(input);
      }
    } else {
      container.textContent = JSON.stringify(input);
    }
    return container;
  }

  /**
   * @param {string} input
   */
  #createTruncatedStringElement(input) {
    const container = document.createElement("div");
    container.dataset.expandedTimes = "1";
    container.className = "truncated string";
    const ellipsis = document.createElement("button");
    ellipsis.className = "ellipsis";

    ellipsis.addEventListener("click", () => {
      const expandedTimes = Number.parseInt(
        container.dataset.expandedTimes ?? "1"
      );
      container.dataset.expandedTimes = String(expandedTimes + 1);
      const expandedString = input.slice(
        0,
        (expandedTimes + 1) * this.#truncateStringAttributeValue
      );
      const textChild = container.childNodes[1];
      container.replaceChild(
        document.createTextNode(expandedString),
        textChild
      );
    });

    container.append(
      '"',
      input.slice(0, this.#truncateStringAttributeValue),
      ellipsis,
      '"'
    );
    return container;
  }

  /**
   * @returns {HTMLElement}
   */
  #createContainer() {
    const container = document.createElement("div");
    container.className = "container";
    return container;
  }

  /**
   * @param {Record<any, any> | any[]} object
   * @returns {HTMLElement}
   */
  #createObjectOrArray(object) {
    const isArray = Array.isArray(object);
    const objectKeyName = this.getAttribute("key");
    const expand = this.#expandAttributeValue;

    const container = this.#createContainer();
    container.classList.add(isArray ? "array" : "object");

    if (objectKeyName) {
      // if objectKeyName is provided, then it is a row
      container.classList.add("row");
      const keyElement = this.#createKeyElement(objectKeyName, {
        withArrow: true,
        expanded: this.#isExpanded,
      });
      keyElement.addEventListener("click", this.#toggle.bind(this));
      container.appendChild(keyElement);
    }

    const openingBrace = document.createElement("span");
    openingBrace.className = "open brace";
    openingBrace.textContent = isArray ? "[" : "{";
    container.appendChild(openingBrace);

    const closingBrace = document.createElement("span");
    closingBrace.className = "close brace";
    closingBrace.textContent = isArray ? "]" : "}";

    if (!this.#isExpanded) {
      const ellipsis = document.createElement("button");
      ellipsis.className = "ellipsis";
      container.appendChild(ellipsis);
      ellipsis.addEventListener("click", this.#toggle.bind(this));
      container.appendChild(closingBrace);
      return container;
    }

    Object.entries(object).forEach(([key, value], index) => {
      // for primitives we make a row here
      if (this.#isPrimitiveValue(value)) {
        const rowContainer = document.createElement("div");
        rowContainer.className = "row";
        if (!isArray) {
          const keyElement = this.#createKeyElement(key);
          rowContainer.appendChild(keyElement);
        }
        rowContainer.appendChild(this.#createPrimitiveValueElement(value));
        container.appendChild(rowContainer);
        const isLast = index === Object.keys(object).length - 1;
        if (!isLast) {
          const comma = document.createElement("span");
          comma.className = "comma";
          comma.textContent = ",";
          rowContainer.appendChild(comma);
        }
        return;
      }

      // for objects and arrays we make a "container row"
      const prettyJsonElement = document.createElement("pretty-json");
      prettyJsonElement.textContent = JSON.stringify(value);
      prettyJsonElement.setAttribute("expand", String(expand - 1));
      prettyJsonElement.setAttribute("key", key);
      container.appendChild(prettyJsonElement);
    });

    container.appendChild(closingBrace);
    return container;
  }

  /**
   * @param {{ expanded?: boolean }} [options]
   * @returns {SVGElement}
   */
  #createArrowElement({ expanded = false } = {}) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("class", "arrow");
    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );

    polygon.setAttribute("class", "triangle");
    polygon.setAttribute("points", "0,0 100,50 0,100");

    if (expanded) {
      polygon.setAttribute("transform", "rotate(90 50 50)");
    }

    svg.appendChild(polygon);

    return svg;
  }

  /**
   * @param {string} key
   * @param {{ withArrow?: boolean, expanded?: boolean }} [options]
   * @returns {HTMLElement}
   */
  #createKeyElement(key, { withArrow = false, expanded = false } = {}) {
    const keyElement = document.createElement(withArrow ? "button" : "span");
    keyElement.className = "key";
    if (withArrow) {
      const arrow = this.#createArrowElement({ expanded });
      keyElement.appendChild(arrow);
    }
    const keyName = document.createElement("span");
    keyName.className = "key-name";
    keyName.textContent = JSON.stringify(key);
    keyElement.appendChild(keyName);
    const colon = document.createElement("span");
    colon.className = "colon";
    colon.textContent = ":";
    keyElement.appendChild(colon);
    return keyElement;
  }

  #render() {
    if (!this.shadowRoot) {
      throw new PrettyJSONError("Shadow root not available");
    }
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(
      this.#createChild(this.#input, this.#expandAttributeValue)
    );

    if (this.shadowRoot.querySelector("[data-pretty-json]")) {
      return;
    }

    const styles = document.createElement("style");
    styles.setAttribute("data-pretty-json", "");
    styles.textContent = PrettyJSON.styles;
    this.shadowRoot.appendChild(styles);
  }

  /**
   * Handle when attributes change
   * @param {string} name
   * @param {string} _oldValue
   * @param {string | null} newValue
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "expand") {
      if (newValue === null) {
        this.#isExpanded = false;
      } else {
        const expandValue = Number.parseInt(newValue);
        this.#isExpanded = !isNaN(expandValue) && expandValue > 0;
      }
      this.#render();
    }
  }

  connectedCallback() {
    try {
      this.#input = JSON.parse(this.textContent ?? "");
    } catch (jsonParseError) {
      const message = `Error parsing JSON: ${jsonParseError instanceof Error ? jsonParseError.message : "Unknown error"}`;
      throw new PrettyJSONError(message);
    }
    this.#render();
  }
}

// Define pretty-json custom element
customElements.define("pretty-json", PrettyJSON);
