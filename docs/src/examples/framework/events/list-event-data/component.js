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

  // data includes the template vars at the clicked row
  // i.e. {#each song in songs} provides data.song and data.index
  'click .play'({ state, data }) {
    state.nowPlaying.set(data.song.id);
  },
  'click .remove'({ state, data }) {
    state.songs.removeItem(data.song.id);
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
