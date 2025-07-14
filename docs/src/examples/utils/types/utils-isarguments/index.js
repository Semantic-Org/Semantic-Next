import { isArguments } from '@semantic-ui/utils';

function testFunction() {
  console.log(isArguments(arguments));
  console.log(isArguments([1, 2, 3]));
  console.log(isArguments({ 0: 'a', 1: 'b', length: 2 }));
}

testFunction('arg1', 'arg2');
