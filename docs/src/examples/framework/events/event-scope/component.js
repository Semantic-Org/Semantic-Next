import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  nowPlaying: null,
  songs: [
    { id: 1, title: 'Pink Moon' },
    { id: 2, title: 'Harvest' },
    { id: 3, title: 'Karma Police' },
    { id: 4, title: 'Holocene' },
  ],
};

const createComponent = ({ state }) => ({

  playingClass(id) {
    return state.nowPlaying.get() === id ? 'playing' : '';
  },

});

const events = {

  // scope holds the template vars at the clicked row
  // i.e. {#each song in songs} provides scope.song and scope.index
  'click .play'({ state, scope }) {
    state.nowPlaying.set(scope.song.id);
  },
  'click .remove'({ state, scope }) {
    state.songs.removeItem(scope.song.id);
  },
};

defineComponent({
  tagName: 'play-list',
  template,
  css,
  defaultState,
  events,
  createComponent,
});
