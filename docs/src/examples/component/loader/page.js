import { $ } from '@semantic-ui/query';

// Get references to controls and dynamic loader
const $typeSelect = $('.type');
const $sizeSelect = $('.size');
const $textInput = $('.text');
const $toggleBtn = $('.toggle');
const $dynamicLoader = $('.dynamic');

// Update dynamic loader based on control values
function updateLoader() {
  const type = $typeSelect.val();
  const size = $sizeSelect.val();
  const text = $textInput.val() || 'LOADING';
  
  $dynamicLoader.settings({
    type: type,
    size: size,
    text: text
  });
}

// Set up event listeners
$typeSelect.on('change', updateLoader);
$sizeSelect.on('change', updateLoader);
$textInput.on('input', updateLoader);

$toggleBtn.on('click', () => {
  const loader = $dynamicLoader.eq(0).component();
  if (loader.isAnimating()) {
    loader.stop();
    $toggleBtn.text('Start Animation');
  } else {
    loader.start();
    $toggleBtn.text('Stop Animation');
  }
});

// Initialize
updateLoader();
