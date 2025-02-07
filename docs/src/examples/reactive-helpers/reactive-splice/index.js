// Helper: splice
import { Signal, Reaction } from '@semantic-ui/reactivity';

const playlist = new Signal([
  'Track 1',
  'Track 2',
  'Track 3',
  'Track 4'
]);

Reaction.create((reaction) => {
  const tracks = playlist.get();
  if(!reaction.firstRun) {
    console.log('Updated playlist:', tracks);
  }
});

// Replace one track
playlist.splice(1, 1, 'New Track');
Reaction.flush();
// Output: ['Track 1', 'New Track', 'Track 3', 'Track 4']

// Insert multiple tracks without removing any
playlist.splice(2, 0, 'Bonus Track 1', 'Bonus Track 2');
Reaction.flush();
// Output: ['Track 1', 'New Track', 'Bonus Track 1', 'Bonus Track 2', 'Track 3', 'Track 4']
