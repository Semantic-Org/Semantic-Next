import { createErrors } from '@semantic-ui/utils';

export const { throwError: refuse } = createErrors({ namespace: 'dates', ErrorClass: RangeError });
export const { throwError: refuseType } = createErrors({ namespace: 'dates', ErrorClass: TypeError });

// Temporal's own RangeErrors are precise but speak in spec terms. ours keep the code and echo the input
export const guard = (attempt, code, at, explanation) => {
  try {
    return attempt();
  }
  catch (error) {
    if (error?.code) {
      throw error;
    }
    return refuse(code, at, { explanation: explanation || error.message.replace(/^Temporal error: /, '') });
  }
};

// { loose: true } gives null for input that cannot be read, and only for that. a bad zone is a
// mistake in the code, not in the data, and still throws. a bad unit is data when it sits inside a
// duration string and code when it names a method's unit, so only the duration door forgives it
const point = new Set([
  'unreadableDateTime',
  'unreadableDate',
  'unreadableTime',
  'notADateTime',
  'notADate',
  'notATime',
  'notFinite',
]);
const length = new Set([
  'unreadableDuration',
  'notADuration',
  'unknownUnit',
  'mixedSigns',
  'notFinite',
  'fractionalMonth',
]);

export const unreadable = { point, length, range: new Set([...point, ...length]) };

export const isUnreadable = (error, codes = point) => codes.has(error?.code);

export const loosely = (build, codes = point) => {
  try {
    return build();
  }
  catch (error) {
    if (isUnreadable(error, codes)) {
      return null;
    }
    throw error;
  }
};
