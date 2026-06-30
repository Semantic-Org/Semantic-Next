import { humanize } from '@semantic-ui/utils';

console.log(humanize('first_name'));
console.log(humanize('user-profile'));
console.log(humanize('createdAt'));
console.log(humanize('getHTTPResponse'));
console.log(humanize('user_id'));
console.log(humanize('order_id', { dropId: false }));
console.log(humanize('employee_salary', { titleCase: true }));
console.log(humanize('terms_of_service', { titleCase: true }));

console.log(humanize('getURLsFromPage'));
console.log(humanize('IN_PROGRESS', { constantCase: true }));
console.log(humanize('café_résumé'));
