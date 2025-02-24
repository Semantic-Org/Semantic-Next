import { defineComponent, getText } from '@semantic-ui/component';
import { formatDate } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

// state is a reactive data store
const defaultState = {
  today: null,
  birthdayNames: []
};

const createComponent = ({ self, state, reaction }) => ({

  birthdayCalendar: [
    { name: 'Jack', birthday: 'August 10' },
    { name: 'Elliot', birthday: 'January 13' },
    { name: 'Stevie', birthday: 'January 16' },
    { name: 'Stew', birthday: 'April 4' },
    { name: 'Stew\'s Twin Brother', birthday: 'April 4' },
  ],

  getDisplayDate(date = new Date()) {
    return formatDate(date, 'MMMM DD');
  },

  getInputDate(date) {
    return formatDate(new Date(date), 'YYYY-MM-DD');
  },

  checkBirthdays() {
    reaction(() => {

      // setup reaction on today
      let today = state.today.get();

      // find people whose birthday is today
      let birthdayNames = self.birthdayCalendar
        .filter(person => person.birthday == today)
        .map(person => person.name)
      ;
      if(birthdayNames.length) {
        state.birthdayNames.set(birthdayNames.join(', '));
      }
      else {
        state.birthdayNames.set(undefined);
      }
    });
  }
});

const onCreated = ({ state, self }) => {
  state.today.set( self.getDisplayDate() );
  self.checkBirthdays();
};

const events = {
  'change .date-picker'({ self }) {
    const newDay = new Date(this.value);
    self.today.set( self.getDisplayDate(newDay) );
  },
  'click a.birthday'({ self, data }) {
    self.today.set( data.birthday );
  }
};

defineComponent({
  tagName: 'birthday-calendar',
  events,
  template,
  css,
  onCreated,
  defaultState,
  createComponent
});
