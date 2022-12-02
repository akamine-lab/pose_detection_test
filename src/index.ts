import * as DOM from './DOM';

const text = DOM.make('h1',"hello world!");
DOM.id('main').append(text);