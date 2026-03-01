import { $ } from '@semantic-ui/query';
import { RowTemplate } from './row.js';

$('dynamic-table').settings({
  headers: ['Name', 'Role', 'Started'],
  rows: [
    { firstName: 'Alice', lastName: 'Chen', role: 'Engineer', startDate: new Date('2022-03-15') },
    { firstName: 'Bob', lastName: 'Smith', role: 'Designer', startDate: new Date('2023-07-01') },
    { firstName: 'Carol', lastName: 'Davis', role: 'PM', startDate: new Date('2024-01-10') },
  ],
  rowTemplate: RowTemplate,
});
