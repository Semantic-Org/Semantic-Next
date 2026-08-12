import { createErrors, isDevelopment } from '@semantic-ui/utils';

// one binding per layer, and every refusal it builds is stamped with that name
const { error, throwError } = createErrors({ layer: 'component', ErrorClass: TypeError });

// error() reports asynchronously through globalThis.onError when an app installs
// one, and throws when none is installed, so a report is never lost
globalThis.onError = (reported) => console.log(`onError: ${reported.message}`);

// production ships one greppable line: <layer> refused [<code>] <at>
console.log(error.line('engineNotRegistered', 'lit'));

// development ships the explanation in its place, and both carry code and detail
const reported = error('engineNotRegistered', 'lit', {
  explanation: 'the lit engine was never imported, so nothing registered it',
  detail: { engine: 'lit', registered: ['native'] },
});
console.log(reported.message);
console.log(reported.code, reported.detail);

// how a real callsite writes it: a bundler define folds branches, never
// arguments, so the ternary lives here and the teaching text leaves production
try {
  throwError('parentRequired', 'attachEvents', {
    explanation: isDevelopment ? 'set a parent before attaching events' : 0,
    detail: { template: 'invoice-row' },
  });
}
catch (refusal) {
  console.log(refusal.message);
  console.log(refusal.code, refusal.detail);
  console.log(refusal instanceof TypeError);
}
