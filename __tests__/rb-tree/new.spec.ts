import { describe, expect, it } from '@jest/globals';
import { compare } from '../helpers/compare.js';
import { compareObjs } from '../helpers/compare-objs.js';
import { RbTree } from '../../src/rb-tree/rb-tree.js';
import { rbTreeToValues } from '../helpers/rb-tree-values.js';


describe('rb-tree new', function() {
    it('it should construct trees and expose the basic query APIs', function() {
        {
            const tree = new RbTree(compare);

            expect(tree.isEmpty()).toBe(true);
            expect(tree.find(4)).toBeUndefined();
            expect(tree.getMinNode()).toBeUndefined();
            expect(tree.getMaxNode()).toBeUndefined();
            expect(tree.findBounds(4)).toEqual([undefined, undefined]);
        }

        {
            const tree = new RbTree(compare);

            for (let value of [4, 2, 6, 1, 3, 5, 7]) {
                tree.insert(value);
            }

            expect(tree.isEmpty()).toBe(false);
            expect(tree.find(4)?.datum).toBe(4);
            expect(tree.find(1)?.datum).toBe(1);
            expect(tree.find(7)?.datum).toBe(7);
            expect(tree.getMinNode()?.datum).toBe(1);
            expect(tree.getMaxNode()?.datum).toBe(7);
            expect(tree.findBounds(4).map(node => node?.datum)).toEqual([4, 5]);
            expect(tree.findBounds(0.5).map(node => node?.datum)).toEqual([undefined, 1]);
            expect(tree.findBounds(8).map(node => node?.datum)).toEqual([7, undefined]);
            expect(rbTreeToValues(tree)).toEqual([1, 2, 3, 4, 5, 6, 7]);
        }

        {
            const tree = new RbTree(compareObjs);

            tree.insert({ val: 3, name: 'apple' });
            tree.insert({ val: 3, name: 'pear' });

            expect(tree.find({ val: 3 })?.datum).toEqual({ val: 3, name: 'pear' });
            expect(rbTreeToValues(tree).map(o => o.name)).toEqual(['pear']);
        }
    });
});