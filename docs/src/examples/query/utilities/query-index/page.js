import { $ } from '@semantic-ui/query';

// Find index of active/current elements among their siblings
const activeTabIndex = $('.tab.active').index();
const currentNavIndex = $('.nav-item.current').index();

$('.active-index').text(activeTabIndex);
$('.current-index').text(currentNavIndex);
