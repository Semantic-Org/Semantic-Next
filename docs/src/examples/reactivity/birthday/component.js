import { defineComponent, getText } from '@semantic-ui/component';
import { formatDate } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createComponent = ({ self, signal, reaction, dispatchEvent }) => ({

  today: signal(),

  birthdayNames: signal(),

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
      let today = self.today.get();

      // find people whose birthday is today
      let birthdayNames = self.birthdayCalendar
        .filter(person => person.birthday == today)
        .map(person => person.name)
      ;
      if(birthdayNames.length) {
        self.birthdayNames.set(birthdayNames.join(', '));
      }
      else {
        self.birthdayNames.set(undefined);
      }
    });
  }
});

const onCreated = ({ self }) => {
  self.today.set( self.getDisplayDate() );
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
  createComponent
});
