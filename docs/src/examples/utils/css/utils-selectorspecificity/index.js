import { selectorSpecificity } from '@semantic-ui/utils';

// ids, classes, elements
console.log(selectorSpecificity('li'));
console.log(selectorSpecificity('.nav .item'));
console.log(selectorSpecificity('#header .nav a:hover'));

// :is() counts its most specific argument, :where() counts nothing
console.log(selectorSpecificity(':is(#a, .b) span'));
console.log(selectorSpecificity(':where(.reset) *'));

// higher wins, compared left to right
const byPrecedence = (a, b) => {
  const [aIds, aClasses, aElements] = selectorSpecificity(a);
  const [bIds, bClasses, bElements] = selectorSpecificity(b);
  return aIds - bIds || aClasses - bClasses || aElements - bElements;
};
console.log(['a', '.link', '#main a', 'nav a.link'].sort(byPrecedence));
