import { defineComponent, getText } from '@semantic-ui/component';
import { each, escapeRegExp, get, isString } from '@semantic-ui/utils';
import { card } from './card.js';
import { friends } from './data.js';

const css = await getText('./component.css');
const template = await getText('./component.html');


export const weightedObjectSearch = (query = '', objectArray = [], {
  returnMatches = false,
  matchAllWords = true,
  propertiesToMatch = []
} = {}) => {
  if(!query) {
    return objectArray;
  }
  query = query.trim();
  query = escapeRegExp(query);
  let
    words       = query.split(' '),
    wordRegexes = [],
    regexes     = {
      startsWith     : new RegExp(`^${query}`, 'i'),
      wordStartsWith : new RegExp(`\\s${query}`, 'i'),
      anywhere       : new RegExp(query, 'i')
    },
    weights = {
      startsWith     : 1,
      wordStartsWith : 2,
      anywhere       : 3,
      anyWord        : 4,
    },
    calculateWeight = (obj) => {
      let
        matchDetails = [],
        weight
      ;
      // do a weighted search across all fields
      each(propertiesToMatch, (field) => {
        let
          value = get(obj, field),
          fieldWeight
        ;
        if(value) {
          each(regexes, (regex, name) => {
            if(fieldWeight) {
              return;
            }
            if(String(value).search(regex) !== -1) {
              fieldWeight = weights[name];
              if(returnMatches) {
                matchDetails.push({
                  field,
                  query,
                  name,
                  value,
                  weight: fieldWeight,
                });
              }
            }
          });
          // match any word higher score for more words
          if(!weight && wordRegexes.length) {
            let wordsMatching = 0;
            each(wordRegexes, regex => {
              if(String(value).search(regex) !== -1) {
                wordsMatching++;
              }
            });
            if(wordsMatching > 0) {
              if(!matchAllWords || (matchAllWords && wordsMatching === wordRegexes.length)) {
                fieldWeight = weights['anyWord'] / wordsMatching;
                if(returnMatches) {
                  matchDetails.push({
                    field,
                    query,
                    name: 'anyWord',
                    value,
                    matchCount: wordsMatching
                  });
                }
              }
            }
          }
          if(fieldWeight && (!weight || fieldWeight < weight)) {
            weight = fieldWeight;
          }
        }
      });
      // flag for removal if not a match
      if(returnMatches) {
        obj.matches = matchDetails;
      }
      obj.remove = !weight;
      return weight;
    }
  ;
  if(objectArray.length == 1) {
    objectArray.push([]);
  }

  if(words.length > 1) {
    each(words, word => {
      wordRegexes.push(new RegExp(`(\W|^)${word}(\W|$)`, 'i'));
    });
  }

  each(objectArray, obj => {
    // clear previous remove flag and weight if present
    delete obj.remove;
    delete obj.weight;

    obj.weight = calculateWeight(obj);
  });

  let result = objectArray
    .filter(obj => !obj.remove)
    .sort((a, b) => {
      return a.weight - b.weight;
    })
  ;
  return result;
};

const state = {
  filter: 'all',
  searchTerm: '',
  friends
};

const createComponent = ({ state }) => ({

  filters: [
    { label: 'All', value: 'all' },
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
  ],

  getFilteredFriends() {
    const friends = state.friends.get();
    const filter = state.filter.get();
    const searchTerm = state.searchTerm.get();
    
    const filteredByGender = (filter === 'all') 
      ? friends 
      : friends.filter(friend => friend.gender === filter);

    const results = weightedObjectSearch(searchTerm, filteredByGender, {
      propertiesToMatch: ['name', 'location', 'role']
    });
    return results;
  }
});

const events = {
  'change ui-menu'({ state, data }) {
    state.filter.set(data.value);
  },
  
  'input .search'({ state, value }) {
    state.searchTerm.set(value);
  }
};

defineComponent({
  tagName: 'friend-directory',
  template,
  css,
  state,
  events,
  createComponent,
  subTemplates: {
    card
  }
});
