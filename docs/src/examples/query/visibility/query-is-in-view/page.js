import { $ } from '@semantic-ui/query';

const container = document.getElementById('container');
container.scrollTop = 0;
console.log($('#test').isInView());
container.scrollTop = 100;
console.log($('#test').isInView());
