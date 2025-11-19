import { $ } from '@semantic-ui/query';

const getBadge = () => $('ui-badge').component();

$('.update-badge').on('click', () => {
  const badge = getBadge();
  badge.setStatus('error');
  badge.setSize('small');
  badge.setLabel('Updated!');
});

$('.reset-badge').on('click', () => {
  const badge = getBadge();
  badge.setStatus('success');
  badge.setSize('large');
  badge.setLabel('Success');
});

$('.show-settings').on('click', () => {
  const el = $('ui-badge').el();
  const settings = {
    status: el.status,
    size: el.size,
    label: el.label,
  };

  const rows = Object.entries(settings)
    .map(([key, value]) => `<tr><td>${key}</td><td>${value || '(not set)'}</td></tr>`)
    .join('');

  $('.settings-output').html(rows);
});
