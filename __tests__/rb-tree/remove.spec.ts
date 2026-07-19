import { describe, expect, it } from '@jest/globals';
import { compare } from '../helpers/compare.js';
import { RbTree } from '../../src/rb-tree/rb-tree.js';
import { rbTreeToValues } from '../helpers/rb-tree-values.js';


describe('rb-tree remove', function() {
    it('it should remove values from the tree based on value', function() {
        const tree = new RbTree(compare);

        expect(tree.remove(112)).toBeUndefined();

        for (let value of [1, 2, 3, 4, 5, 6, 7]) {
            tree.insert(value);
        }

        expect(tree.remove(2)).toBe(2);
        expect(tree.find(2)).toBeUndefined();
        expect(tree.remove(5)).toBe(5);
        expect(tree.remove(112)).toBeUndefined();

        expect(tree.remove(1)).toBe(1);
        expect(tree.remove(3)).toBe(3);
        expect(tree.remove(4)).toBe(4);
        expect(tree.remove(6)).toBe(6);
        expect(tree.remove(7)).toBe(7);

        expect(tree.isEmpty()).toBe(true);
        expect(tree.getMinNode()).toBeUndefined();
        expect(tree.getMaxNode()).toBeUndefined();
        expect(rbTreeToValues(tree)).toEqual([]);
    });

    it('it should remove the root repeatedly and keep ordering intact', function() {
        const tree = new RbTree(compare);

        for (let value of [10, 4, 14, 2, 6, 12, 16, 1, 3, 5, 7, 11, 13, 15, 17]) {
            tree.insert(value);
        }

        expect(tree.remove(10)).toBe(10);
        expect(tree.remove(14)).toBe(14);
        expect(tree.remove(4)).toBe(4);

        expect(tree.getMinNode()?.datum).toBe(1);
        expect(tree.getMaxNode()?.datum).toBe(17);
        expect(rbTreeToValues(tree)).toEqual([1, 2, 3, 5, 6, 7, 11, 12, 13, 15, 16, 17]);
    });
});