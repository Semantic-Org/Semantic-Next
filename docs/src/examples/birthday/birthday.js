// Array to store friends' birthdays
const friendsBirthdays = [
  { name: 'Alice', birthday: 'August 10' },
  { name: 'Bob', birthday: 'March 15' },
  { name: 'Charlie', birthday: 'November 30' }
];

// Function to calculate the zero-indexed day of the year
function dayOfYear(dateString) {
  const [month, day] = dateString.split(' ');
  const date = new Date(`2023 ${month} ${day}`);
  const startOfYear = new Date('2023-01-01');
  const timeDiff = date - startOfYear;
  const dayOfYear = Math.floor(timeDiff / (1000 * 3600 * 24));
  return dayOfYear;
}

// Function to check if today is a friend's birthday
function isTodayFriendsBirthday() {
  const today = new Date();
  const currentDayOfYear = dayOfYear(`${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}`);

  for (const friend of friendsBirthdays) {
    const friendDayOfYear = dayOfYear(friend.birthday);
    if (friendDayOfYear === currentDayOfYear) {
      console.log(`Today is ${friend.name}'s birthday!`);
      return true;
    }
  }

  console.log("Today is not any friend's birthday.");
  return false;
}

// Example usage
isTodayFriendsBirthday();
