import { $ } from '@semantic-ui/query';

/*
  This attaches an event to list that will run whenever an '.item' is clicked
  As long as list is in the DOM this event will fire on all child '.item'
*/

const addLog = (text) => $('.log').text(text);

$('.list')
  .on('click', '.item', function() {
    const $item = $(this);

    $item.addClass('clicked');
    setTimeout(() => $item.removeClass('clicked'), 200);

    addLog(`Clicked: "${$item.text()}"`);
  });

// Add new task button
$('ui-button.add')
  .on('click', function() {
    const taskCount = $('.list .item').count();
    const $newItem = $(`<div class="item">Task ${taskCount + 1}</div>`);
    $('.list').append($newItem);

    addLog(`Added new task - click it! (delegation works automatically)`);
  });
