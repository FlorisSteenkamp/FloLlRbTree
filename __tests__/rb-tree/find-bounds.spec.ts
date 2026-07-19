import { describe, expect, it } from '@jest/globals';
import { compare } from '../helpers/compare.js';
import { RbTree } from '../../src/rb-tree/rb-tree.js';


describe('rb-tree findBounds', function() {
    it('it should find neighboring nodes around a value', function() {
        const tree = new RbTree(compare);

        expect(tree.findBounds(4).map(node => node?.datum)).toEqual([undefined, undefined]);

        for (let value of [1, 2, 3, 4, 5, 6, 7]) {
            tree.insert(value);
        }

        expect(tree.findBounds(4).map(node => node?.datum)).toEqual([4, 5]);
        expect(tree.findBounds(1).map(node => node?.datum)).toEqual([1, 2]);
        expect(tree.findBounds(2.5).map(node => node?.datum)).toEqual([2, 3]);

        tree.remove(7);
        expect(tree.findBounds(5.99).map(node => node?.datum)).toEqual([5, 6]);

        tree.insert(7);
        expect(tree.findBounds(6.999).map(node => node?.datum)).toEqual([6, 7]);
        expect(tree.findBounds(7).map(node => node?.datum)).toEqual([7, undefined]);
        expect(tree.findBounds(8).map(node => node?.datum)).toEqual([7, undefined]);
        expect(tree.findBounds(0.99).map(node => node?.datum)).toEqual([undefined, 1]);
    });
});