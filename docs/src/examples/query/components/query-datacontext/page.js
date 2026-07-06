import { $ } from '@semantic-ui/query';
import { reaction } from '@semantic-ui/reactivity';

// can only read data after component is rendered
// see <https://next.semantic-ui.com//components/lifecycle#dom-lifecycle-events>
$('ui-demo').on('rendered', () => {
  const data = $('ui-demo').dataContext();
  console.log('Data context is', data);

  // we can actually use internal signals to create reactions!
  reaction(() => {
    $('.counter').text(data.count.get());
  });
});
