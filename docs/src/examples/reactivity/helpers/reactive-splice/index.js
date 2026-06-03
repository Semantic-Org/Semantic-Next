// Helper: splice
import { flush, reaction, signal } from '@semantic-ui/reactivity';

const playlist = signal([
  'Track 1',
  'Track 2',
  'Track 3',
  'Track 4',
]);

reaction((computation) => {
  const tracks = playlist.get();
  if (!computation.firstRun) {
    console.log('Updated playlist:', tracks);
  }
});

// Replace one track
playlist.splice(1, 1, 'New Track');
flush();

// Insert multiple tracks without removing any
playlist.splice(2, 0, 'Bonus Track 1', 'Bonus Track 2');
