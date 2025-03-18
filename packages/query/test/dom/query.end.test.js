import { $ } from '@semantic-ui/query';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Query.end() method', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should return to the previous selection after a traversal method', () => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    div.appendChild(span);
    document.body.appendChild(div);

    const $div = $('div');
    const $span = $div.find('span');
    const $back = $span.end();
    
    expect($back[0]).toBe(div);
    expect($back.length).toBe(1);
  });

  it('should return the same Query instance if there is no previous selection', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const $div = $('div');
    const $same = $div.end();
    
    expect($same).toBe($div);
  });

  it('should allow chaining back up multiple levels', () => {
    const div = document.createElement('div');
    const ul = document.createElement('ul');
    const li1 = document.createElement('li');
    const li2 = document.createElement('li');
    const span = document.createElement('span');
    
    div.appendChild(ul);
    ul.appendChild(li1);
    ul.appendChild(li2);
    li1.appendChild(span);
    document.body.appendChild(div);

    const result = $('div')
      .find('ul')
      .find('li')
      .find('span')
      .end()     // back to li
      .end()     // back to ul
      .end();    // back to div
    
    expect(result[0]).toBe(div);
  });

  it('should work with multiple chain traversal methods in between', () => {
    const div = document.createElement('div');
    div.classList.add('container');
    
    const p1 = document.createElement('p');
    p1.classList.add('paragraph');
    p1.textContent = 'First paragraph';
    
    const p2 = document.createElement('p');
    p2.classList.add('paragraph');
    p2.textContent = 'Second paragraph';
    
    div.appendChild(p1);
    div.appendChild(p2);
    document.body.appendChild(div);

    const $div = $('.container');
    const $filtered = $div
      .find('p')
      .addClass('highlighted')
      .css('color', 'blue')
      .end();
    
    expect($filtered[0]).toBe(div);
  });

  it('should match the example from documentation', () => {
    // Create elements as in the documentation example
    const card = document.createElement('div');
    card.classList.add('card');
    
    const title = document.createElement('div');
    title.classList.add('title');
    
    const content = document.createElement('div');
    content.classList.add('content');
    
    card.appendChild(title);
    card.appendChild(content);
    document.body.appendChild(card);

    // Create the example chain from the docs
    $('.card')
      .addClass('highlighted')         // Add class to cards
      .find('.title')                  // Switch to titles within cards
      .css('font-weight', 'bold')      // Bold the titles
      .end()                           // Go back to the card selection
      .find('.content')                // Now find content within cards
      .html('<p>New content</p>');     // Change the HTML

    // Verify the operations worked as expected
    expect(card.classList.contains('highlighted')).toBe(true);
    expect(title.style.fontWeight).toBe('bold');
    expect(content.innerHTML).toBe('<p>New content</p>');
  });

  it('should handle complex nested chains with multiple end() calls', () => {
    const outer = document.createElement('div');
    outer.classList.add('outer');
    
    const middle = document.createElement('div');
    middle.classList.add('middle');
    
    const inner = document.createElement('div');
    inner.classList.add('inner');
    
    outer.appendChild(middle);
    middle.appendChild(inner);
    document.body.appendChild(outer);

    const result = $('.outer')
      .find('.middle')
      .addClass('middle-class')
      .find('.inner')
      .addClass('inner-class')
      .end()   // Back to middle
      .end()   // Back to outer
      .addClass('outer-modified');
    
    expect(outer.classList.contains('outer-modified')).toBe(true);
    expect(middle.classList.contains('middle-class')).toBe(true);
    expect(inner.classList.contains('inner-class')).toBe(true);
    expect(result[0]).toBe(outer);
  });
});