import { Reaction } from '../reaction.js';
import { Signal } from '../signal.js';

export const signal = (initialValue, options) => new Signal(initialValue, options);

export const reaction = (callback, options) => new Reaction(callback, options);
