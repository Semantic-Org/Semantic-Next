import { createComponent, getText } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { formatDate } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createInstance = ({tpl, reaction, dispatchEvent}) => ({

  today: new ReactiveVar(''),

  birthdayNames: new ReactiveVar(),

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
      let today = tpl.today.get();

      // find people whose birthday is today
      let birthdayNames = tpl.birthdayCalendar
        .filter(person => person.birthday == today)
        .map(person => person.name)
      ;
      if(birthdayNames.length) {
        tpl.birthdayNames.set(birthdayNames.join(', '));
      }
      else {
        tpl.birthdayNames.set(undefined);
      }
    });
  }
});

const onCreated = ({ tpl }) => {
  tpl.today.set( tpl.getDisplayDate() );
  tpl.checkBirthdays();
};

const events = {
  'change .date-picker'({tpl }) {
    const newDay = new Date(this.value);
    tpl.today.set( tpl.getDisplayDate(newDay) );
  },
  'click a.birthday'({tpl, data}) {
    tpl.today.set( data.birthday );
  }
};

createComponent({
  tagName: 'birthday-calendar',
  events,
  template,
  css,
  onCreated,
  createInstance
});
