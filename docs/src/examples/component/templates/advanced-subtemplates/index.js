import { $ } from '@semantic-ui/query';
import { row } from './row.js';
import { row2 } from './row.js';

// use same row template across instances
$('dynamic-table').initialize({
  rowTemplate: row,
  headers: [
    'Name',
    'Age',
    'Gender',
  ]
});

console.log($('dynamic-table').length);
// use different data for each table
$('dynamic-table.one').initialize({
  rows: [
    { firstName: 'Buck', lastName: 'Pencilsworth', age: '42', gender: 'Male' },
    { firstName: 'Mildred', lastName: 'Staplegun', age: '67', gender: 'Female' },
    { firstName: 'Chip', lastName: 'Windowsill', age: '23', gender: 'Male' },
    { firstName: 'Peggy', lastName: 'Lunchroom', age: '51', gender: 'Female' },
    { firstName: 'Duke', lastName: 'Coffeebean', age: '38', gender: 'Male' },
    { firstName: 'Dot', lastName: 'Keyboarder', age: '29', gender: 'Female' },
    { firstName: 'Brick', lastName: 'Wallman', age: '45', gender: 'Male' },
    { firstName: 'Betty', lastName: 'Mouseclicks', age: '33', gender: 'Female' },
    { firstName: 'Rod', lastName: 'Sockdrawer', age: '58', gender: 'Male' },
    { firstName: 'Penny', lastName: 'Deskchair', age: '31', gender: 'Female' },
  ]
});
$('dynamic-table.two').initialize({
  rows: [
    { firstName: 'Chuck', lastName: 'Cheesewheel', age: '44', gender: 'Male' },
    { firstName: 'Dotty', lastName: 'Paperclips', age: '72', gender: 'Female' },
    { firstName: 'Biff', lastName: 'Strongarm', age: '39', gender: 'Male' },
    { firstName: 'Pearl', lastName: 'Teacup', age: '61', gender: 'Female' },
    { firstName: 'Skip', lastName: 'Lunchpack', age: '27', gender: 'Male' },
    { firstName: 'Mabel', lastName: 'Clockwise', age: '84', gender: 'Female' },
    { firstName: 'Tank', lastName: 'Steelbeam', age: '47', gender: 'Male' },
    { firstName: 'Pip', lastName: 'Kettlewood', age: '19', gender: 'Female' },
    { firstName: 'Buzz', lastName: 'Lampshade', age: '36', gender: 'Male' },
    { firstName: 'Flo', lastName: 'Watercooler', age: '55', gender: 'Female' }
  ]
});
