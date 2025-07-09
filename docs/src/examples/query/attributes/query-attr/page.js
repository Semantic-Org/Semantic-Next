import { $ } from '@semantic-ui/query';

const updateOutput = (message) => {
  $('.output').text(message);
};

$('.get').on('click', () => {
  const imgSrc = $('.image').attr('src');
  const imgAlt = $('.image').attr('alt');
  const linkHref = $('.link').attr('href');
  const linkTarget = $('.link').attr('target');

  updateOutput(`Image src: "${imgSrc || ''}"
Image alt: "${imgAlt || ''}"
Link href: "${linkHref || ''}"
Link target: "${linkTarget || ''}"`);
});

$('.set').on('click', () => {
  $('.image')
    .attr('src', '/images/avatar/jenny.jpg')
    .attr('alt', 'Updated placeholder image');

  $('.link')
    .attr('href', 'https://example.com')
    .attr('target', '_self');

  updateOutput('Attributes updated successfully');
});
