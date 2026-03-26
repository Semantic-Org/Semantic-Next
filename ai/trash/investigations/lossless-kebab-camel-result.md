Stage 3: Final Council Answer

Lossless kebab-case ↔ camelCase Round-Trip
The Problem
Standard kebab↔camel conversions are lossy because camelCase has no natural way to encode:

Digit-leading segments: grid-2x2 → grid2x2 (the hyphen before 2 is lost because digits can't be uppercased)
Consecutive single-letter segments: arrow-down-a-z → arrowDownAZ (potentially ambiguous on the way back, depending on the algorithm)
The Key Insight
The digit-boundary problem is the primary source of data loss. Single-letter segments actually survive the round-trip naturally if camelToKebab inserts a hyphen before every uppercase letter (not just at lowercase→uppercase transitions):

arrow-down-a-z → arrowDownAZ → arrow-down-a-z ✓ (each uppercase letter gets its own hyphen)
a-large-small → aLargeSmall → a-large-small ✓
The fix for digits: use _ (underscore) in the camelCase form to mark where a hyphen preceded a digit-starting segment. Underscore is:

Valid in JavaScript identifiers (no bracket notation needed)
Visually obvious and conventional in JS
Not used in standard HTML attribute names
Design
Rules for kebabToCamel (lossless mode)
Split on -. For each segment after the first:

Starts with a letter → standard camelCase (capitalize first letter)
Starts with a digit → prefix with _, keep segment as-is
Rules for camelToKebab (lossless mode)
Insert - before every uppercase letter (lowercase it)
Replace _ immediately before a digit with -
API
kebabToCamel(str, { lossless: true })
camelToKebab(str, { lossless: true })
Default behavior (without options) remains unchanged for backward compatibility.

Implementation
/**
 * Convert kebab-case to camelCase.
 * @param {string} str
 * @param {{ lossless?: boolean }} [options]
 * @returns {string}
 */
function kebabToCamel(str, options) {
  if (!options || !options.lossless) {
    // Backward-compatible default
    return str.replace(/-([a-z0-9])/gi, (_, c) => c.toUpperCase());
  }

  const parts = str.split('-');
  let out = parts[0];

  for (let i = 1; i < parts.length; i++) {
    const seg = parts[i];
    if (seg === '') {
      out += '-'; // consecutive hyphens (edge case)
    } else if (/^[0-9]/.test(seg)) {
      out += '_' + seg; // digit-leading: encode boundary with _
    } else {
      out += seg[0].toUpperCase() + seg.slice(1); // standard camelCase
    }
  }

  return out;
}

/**
 * Convert camelCase to kebab-case.
 * @param {string} str
 * @param {{ lossless?: boolean }} [options]
 * @returns {string}
 */
function camelToKebab(str, options) {
  if (!options || !options.lossless) {
    // Backward-compatible default
    return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
  }

  // 1. Insert hyphen before every uppercase letter
  let out = str.replace(/[A-Z]/g, m => '-' + m.toLowerCase());

  // 2. Decode _digit → -digit (reverse the digit-boundary encoding)
  out = out.replace(/_(?=[0-9])/g, '-');

  return out;
}
Why This Works
Digit segments are the only source of true ambiguity. Without the _ marker, grid2x2 and grid-2x2 both produce grid2x2 in camelCase — there's no way to recover the original.

Single-letter segments work naturally because the lossless camelToKebab inserts a hyphen before every uppercase letter. So arrowDownAZ → arrow-down-a-z (three hyphens, three uppercase letters). Going back, each single-letter segment after a hyphen gets capitalized: arrowDownAZ. No special encoding needed.

The _ convention is minimal: it only appears when a kebab segment starts with a digit. Most property names remain pure camelCase. A developer seeing el.grid_2x2 or el.heading_1 immediately understands what it represents.

Round-Trip Verification
Kebab → Camel → Kebab (attribute is source of truth)
| Kebab (attribute) | Camel (property) | Back to Kebab | ✓ | |---|---|---|---| | Standard multi-word |||| | arrow-down | arrowDown | arrow-down | ✓ | | text-cursor-input | textCursorInput | text-cursor-input | ✓ | | wifi-off | wifiOff | wifi-off | ✓ | | background-color | backgroundColor | background-color | ✓ | | border-radius | borderRadius | border-radius | ✓ | | font-size | fontSize | font-size | ✓ | | max-width | maxWidth | max-width | ✓ | | tab-index | tabIndex | tab-index | ✓ | | placeholder-text | placeholderText | placeholder-text | ✓ | | is-disabled | isDisabled | is-disabled | ✓ | | content-editable | contentEditable | content-editable | ✓ | | auto-focus | autoFocus | auto-focus | ✓ | | read-only | readOnly | read-only | ✓ | | min-length | minLength | min-length | ✓ | | max-length | maxLength | max-length | ✓ | | row-span | rowSpan | row-span | ✓ | | col-span | colSpan | col-span | ✓ | | error-message | errorMessage | error-message | ✓ | | default-value | defaultValue | default-value | ✓ | | on-change | onChange | on-change | ✓ | | Single word |||| | hidden | hidden | hidden | ✓ | | disabled | disabled | disabled | ✓ | | checked | checked | checked | ✓ | | value | value | value | ✓ | | open | open | open | ✓ | | Single-letter segments |||| | arrow-down-a-z | arrowDownAZ | arrow-down-a-z | ✓ | | sort-a-z | sortAZ | sort-a-z | ✓ | | sort-z-a | sortZA | sort-z-a | ✓ | | a-large-small | aLargeSmall | a-large-small | ✓ | | a-z | aZ | a-z | ✓ | | a-arrow-up | aArrowUp | a-arrow-up | ✓ | | x-data | xData | x-data | ✓ | | v-if | vIf | v-if | ✓ | | v-model | vModel | v-model | ✓ | | Digit-starting segments |||| | grid-2x2 | grid_2x2 | grid-2x2 | ✓ | | grid-3x3 | grid_3x3 | grid-3x3 | ✓ | | heading-1 | heading_1 | heading-1 | ✓ | | heading-2 | heading_2 | heading-2 | ✓ | | heading-6 | heading_6 | heading-6 | ✓ | | volume-2 | volume_2 | volume-2 | ✓ | | columns-3 | columns_3 | columns-3 | ✓ | | rows-4 | rows_4 | rows-4 | ✓ | | step-1 | step_1 | step-1 | ✓ | | level-5 | level_5 | level-5 | ✓ | | Mixed digit and letter segments |||| | step-1-of-3 | step_1Of_3 | step-1-of-3 | ✓ | | layer-2-opacity | layer_2Opacity | layer-2-opacity | ✓ | | item-3-color | item_3Color | item-3-color | ✓ | | page-10-title | page_10Title | page-10-title | ✓ | | flex-row-2 | flexRow_2 | flex-row-2 | ✓ | | gap-x-4 | gapX_4 | gap-x-4 | ✓ | | icon-rotate-3d | iconRotate_3d | icon-rotate-3d | ✓ | | icon-h-1 | iconH_1 | icon-h-1 | ✓ | | icon-arrow-up-1-0 | iconArrowUp_1_0 | icon-arrow-up-1-0 | ✓ | | ARIA / data patterns |||| | aria-label | ariaLabel | aria-label | ✓ | | aria-hidden | ariaHidden | aria-hidden | ✓ | | aria-level-3 | ariaLevel_3 | aria-level-3 | ✓ | | data-test-id | dataTestId | data-test-id | ✓ | | slot-name | slotName | slot-name | ✓ |

Camel → Kebab → Camel (property is source of truth)
| Camel (property) | Kebab (attribute) | Back to Camel | ✓ | |---|---|---|---| | Standard properties |||| | arrowDown | arrow-down | arrowDown | ✓ | | backgroundColor | background-color | backgroundColor | ✓ | | textCursorInput | text-cursor-input | textCursorInput | ✓ | | wifiOff | wifi-off | wifiOff | ✓ | | fontSize | font-size | fontSize | ✓ | | borderRadius | border-radius | borderRadius | ✓ | | maxWidth | max-width | maxWidth | ✓ | | tabIndex | tab-index | tabIndex | ✓ | | isDisabled | is-disabled | isDisabled | ✓ | | labelText | label-text | labelText | ✓ | | errorMessage | error-message | errorMessage | ✓ | | showHeader | show-header | showHeader | ✓ | | itemCount | item-count | itemCount | ✓ | | pageSize | page-size | pageSize | ✓ | | defaultValue | default-value | defaultValue | ✓ | | onChange | on-change | onChange | ✓ | | Single word |||| | hidden | hidden | hidden | ✓ | | disabled | disabled | disabled | ✓ | | value | value | value | ✓ | | Properties with embedded digits |||| | item2Count | item2-count | item2Count | ✓ | | h2Content | h2-content | h2Content | ✓ | | grid2x2 | grid2x2 | grid2x2 | ✓ | | layer3 | layer3 | layer3 | ✓ | | v2Api | v2-api | v2Api | ✓ | | _digit properties (from kebab-source) |||| | grid_2x2 | grid-2x2 | grid_2x2 | ✓ | | heading_1 | heading-1 | heading_1 | ✓ | | columns_3 | columns-3 | columns_3 | ✓ | | volume_2 | volume-2 | volume_2 | ✓ | | step_1Of_3 | step-1-of-3 | step_1Of_3 | ✓ | | layer_2Opacity | layer-2-opacity | layer_2Opacity | ✓ | | Consecutive uppercase (acronyms) |||| | innerHTML | inner-h-t-m-l | innerHTML | ✓ | | parseHTML | parse-h-t-m-l | parseHTML | ✓ | | xmlHTTPRequest | xml-h-t-t-p-request | xmlHTTPRequest | ✓ | | apiURL | api-u-r-l | apiURL | ✓ | | cssText | css-text | cssText | ✓ | | htmlContent | html-content | htmlContent | ✓ | | svgIcon | svg-icon | svgIcon | ✓ | | jsonData | json-data | jsonData | ✓ |

Detailed Trace for Tricky Cases
arrow-down-a-z (kebab → camel → kebab):

Split: ['arrow', 'down', 'a', 'z']
arrow (first, keep) + Down + A + Z = arrowDownAZ
camelToKebab('arrowDownAZ'): insert - before D,A,Z → arrow-down-a-z ✓
step-1-of-3 (kebab → camel → kebab):

Split: ['step', '1', 'of', '3']
step + _1 + Of + _3 = step_1Of_3
camelToKebab('step_1Of_3'): - before O → step_1-of_3, then _→- before digits → step-1-of-3 ✓
innerHTML (camel → kebab → camel):

Insert - before H,T,M,L → inner-h-t-m-l
kebabToCamel('inner-h-t-m-l'): inner + H + T + M + L = innerHTML ✓
xmlHTTPRequest (camel → kebab → camel):

Insert - before H,T,T,P,R → xml-h-t-t-p-request (the R merges with equest)
kebabToCamel('xml-h-t-t-p-request'): xml + H + T + T + P + Request = xmlHTTPRequest ✓
Ergonomics Assessment
When kebab is source (the 90% case — writing HTML attributes):

| HTML attribute | JS property | Verdict | |---|---|---| | grid-2x2 | grid_2x2 | Clear — underscore is natural JS | | heading-1 | heading_1 | Clear — reads well | | arrow-down-a-z | arrowDownAZ | Good — standard camelCase | | step-1-of-3 | step_1Of_3 | Acceptable — mixed but obvious | | background-color | backgroundColor | Perfect — standard |

When camel is source (writing JS properties):

| JS property | HTML attribute | Verdict | |---|---|---| | backgroundColor | background-color | Perfect | | isDisabled | is-disabled | Perfect | | innerHTML | inner-h-t-m-l | Ugly, but innerHTML is a built-in — not a custom component property | | itemCount | item-count | Perfect |

Recommendation for component authors: When camelCase is the source, use standard camelCase conventions — innerHtml not innerHTML, apiUrl not apiURL. This produces clean kebab attributes and is the more conventional camelCase style anyway.

Constraints & Tradeoffs
_ before digits is semantically meaningful in lossless mode. Underscores not followed by digits pass through unchanged, so my_thing → my_thing round-trips fine in both directions.

Underscores before digits in original kebab attributes (e.g., my_2thing) are extremely rare in HTML and would be treated as our encoding. This is an acceptable constraint.

PascalCase (leading uppercase, e.g., XMLParser) is not supported as a camelCase source — this matches the convention that JS properties are camelCase, not PascalCase.

No exotic escape sequences — only _ is used, and only before digit-starting segments. Most names remain completely standard.
