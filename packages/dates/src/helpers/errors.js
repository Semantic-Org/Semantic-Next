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
    return refuse(code, at, { explanation: explanation ?? error.message.replace(/^Temporal error: /, '') });
  }
};

// { loose: true } gives null for input that cannot be read, and only for that. a bad zone or a bad
// unit is a mistake in the code, not in the data, and still throws
const unreadable = new Set([
  'unreadableDateTime',
  'unreadableDate',
  'unreadableTime',
  'notADateTime',
  'notADate',
  'notATime',
  'notFinite',
]);

export const isUnreadable = (error) => unreadable.has(error?.code);

export const loosely = (build) => {
  try {
    return build();
  }
  catch (error) {
    if (isUnreadable(error)) {
      return null;
    }
    throw error;
  }
};
