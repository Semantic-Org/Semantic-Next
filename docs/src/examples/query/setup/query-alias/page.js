import { useAlias } from '@semantic-ui/query';

// some other $ function
window.$ = (selector, html, className) => {
  const el = document.querySelector(selector);
  el.innerHTML = html;
  el.classList.add(className);
};

// query bound to Query
window.Query = useAlias();

// original $ preserved
$('.original.status', '$ functions preserved', 'loaded');

// alias functions with alias
Query('.query.status').html('Query alias available').addClass('loaded');
