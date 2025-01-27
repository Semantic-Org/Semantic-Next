import { $ } from '@semantic-ui/query';
import { Row } from './row.js';
import { Row2 } from './row2.js';
import { Users } from './users.js';

// initialize with some sample data

const setTableData = function() {
  $('dynamic-table.one').settings({
    rows: Users.slice(0, 5)
  });
  $('dynamic-table.two').settings({
    rows: Users.slice(5, 10)
  });
};

const setSummaryView = function() {
  $('dynamic-table').settings({
    headers: ['Name', 'ID', 'Age', 'Gender' ],
    rowTemplate: Row,
  });
  $('.summary').addClass('disabled');
  $('.stats').removeClass('disabled');
};
const setStatsView = function() {
  $('dynamic-table').settings({
    headers: ['Name', 'Occupation', 'Hobby'],
    rowTemplate: Row2, // we are specifying an entirely different row template
  });
  $('.summary').removeClass('disabled');
  $('.stats').addClass('disabled');
};

setTableData();
setSummaryView();

$('.summary').on('click', setSummaryView);
$('.stats').on('click', setStatsView);
