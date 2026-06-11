import { defineComponent, getText } from '@semantic-ui/component';
import { formatDate } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const birthdayCalendar = [
  { name: 'Jack', birthday: 'August 10' },
  { name: 'Elliot', birthday: 'January 13' },
  { name: 'Stevie', birthday: 'January 16' },
  { name: 'Stew', birthday: 'April 4' },
  { name: "Stew's Twin Brother", birthday: 'April 4' },
];

const defaultState = {
  today: null,
};

const createComponent = ({ state }) => ({
  birthdayCalendar,

  getDisplayDate(date = new Date()) {
    return formatDate(date, 'MMMM DD');
  },

  getInputDate(date) {
    return formatDate(new Date(date), 'YYYY-MM-DD');
  },

  birthdayNames: state.today.derive(today => {
    const names = birthdayCalendar
      .filter(person => person.birthday === today)
      .map(person => person.name);
    return names.length ? names.join(', ') : undefined;
  }),
});

const onCreated = ({ state, self }) => {
  state.today.set(self.getDisplayDate());
};

const events = {
  'change .date-picker'({ state, self }) {
    const newDay = new Date(this.value);
    state.today.set(self.getDisplayDate(newDay));
  },
  'click a.birthday'({ state, data }) {
    state.today.set(data.friend.birthday);
  },
};

defineComponent({
  tagName: 'birthday-calendar',
  events,
  template,
  css,
  onCreated,
  defaultState,
  createComponent,
});
