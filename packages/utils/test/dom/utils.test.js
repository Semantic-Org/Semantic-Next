import { clone } from '@semantic-ui/utils';
import { describe, expect, it, vi } from 'vitest';

describe('clone', () => {
  it('should clone dom nodes', () => {
    const div = document.createElement('div');
    const clonedDiv = clone(div);
    expect(clonedDiv).not.toBe(div);
  });
});
