import { $ } from '@semantic-ui/query';

const updateOutput = (message) => {
  $('.output').text(message);
};

$('.get').on('click', () => {
  const element = $('.item').el();
  $('.item').removeClass('highlighted');
  $(element).addClass('highlighted');
  updateOutput(
    `Got first element: ${element.textContent}\nElement ID: ${element.id}\nElement type: ${element.tagName.toLowerCase()}`,
  );
});

$('.native').on('click', () => {
  const queryElements = $('.item');
  const nativeElement = queryElements[0]; // Native access
  $('.item').removeClass('highlighted');
  $(nativeElement).addClass('highlighted');
  updateOutput(`Native access: ${nativeElement.textContent}\nSame element: ${queryElements.el() === nativeElement}`);
});
