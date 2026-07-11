import { Reaction } from '../reaction.js';
import { ReactiveObject } from '../reactive-object.js';
import { Resource } from '../resource.js';
import { Signal } from '../signal.js';

export const signal = (initialValue, options) => new Signal(initialValue, options);

export const reaction = (callback, options) => new Reaction(callback, options);

export const reactiveObject = (initialValue, options) => new ReactiveObject(initialValue, options);

export const resource = (fetcher, options) => new Resource(fetcher, options);
