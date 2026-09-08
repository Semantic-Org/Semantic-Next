/**
 * The brands, keyed with `Symbol.for` so a value is recognised across bundles and realms without
 * importing the class. `value[IS_DATE_TIME]` is true for a DateTime from any copy of this package.
 * @see https://next.semantic-ui.com/docs/api/dates/helpers#brands
 */
export const IS_DATE_TIME: unique symbol;
/** @see https://next.semantic-ui.com/docs/api/dates/helpers#brands */
export const IS_CALENDAR_DATE: unique symbol;
/** @see https://next.semantic-ui.com/docs/api/dates/helpers#brands */
export const IS_TIME: unique symbol;
/** @see https://next.semantic-ui.com/docs/api/dates/helpers#brands */
export const IS_DURATION: unique symbol;
/**
 * Every range kind
 * @see https://next.semantic-ui.com/docs/api/dates/helpers#brands
 */
export const IS_RANGE: unique symbol;
/** @see https://next.semantic-ui.com/docs/api/dates/helpers#brands */
export const IS_DATE_RANGE: unique symbol;
/** @see https://next.semantic-ui.com/docs/api/dates/helpers#brands */
export const IS_DATE_TIME_RANGE: unique symbol;
/** @see https://next.semantic-ui.com/docs/api/dates/helpers#brands */
export const IS_TIME_RANGE: unique symbol;
