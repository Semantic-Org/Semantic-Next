import { isDevelopment, throwError } from '@semantic-ui/utils';

// the throwing form: same options as error, thrown synchronously — for the
// refusal that must stop the caller where it stands
try {
  throwError('missingType', 'fields.title', {
    namespace: 'schema',
    explanation: isDevelopment ? 'every field declares a type' : 0,
    detail: { field: 'title' },
  });
}
catch (refusal) {
  console.log(refusal.message);
  console.log(refusal.code, refusal.detail);
}

// ErrorClass rides the options bag, so a refusal can throw the class it means
try {
  throwError('badIndex', 'rows.at(-9)', { namespace: 'schema', ErrorClass: RangeError });
}
catch (refusal) {
  console.log(refusal instanceof RangeError, refusal.message);
}

// without a namespace the line composes clean, no leading token
try {
  throwError('unknownField', 'select()');
}
catch (refusal) {
  console.log(refusal.message);
}
