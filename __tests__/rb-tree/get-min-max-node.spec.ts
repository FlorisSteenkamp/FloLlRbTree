import { describe, expect, it } from '@jest/globals';
import { compare } from '../helpers/compare.js';
import { RbTree } from '../../src/rb-tree/rb-tree.js';


describe('rb-tree getMinNode and getMaxNode cache', function() {
    it('it should cache getMinNode and getMaxNode results and invalidate on mutators', function() {
        const tree = new RbTree(compare);

        // Empty tree
        expect(tree.getMinNode()).toBeUndefined();
        expect(tree.getMaxNode()).toBeUndefined();

        // Cached undefined for empty tree
        expect(tree.getMinNode()).toBeUndefined();
        expect(tree.getMaxNode()).toBeUndefined();

        // Insert should mark cache stale and update on next call
        tree.insert(5);
        const min1 = tree.getMinNode();
        const max1 = tree.getMaxNode();
        expect(min1?.datum).toBe(5);
        expect(max1?.datum).toBe(5);

        // Subsequent calls should return cached node reference
        expect(tree.getMinNode()).toBe(min1);
        expect(tree.getMaxNode()).toBe(max1);

        // Insert smaller value
        tree.insert(2);
        const min2 = tree.getMinNode();
        const max2 = tree.getMaxNode();
        expect(min2?.datum).toBe(2);
        expect(max2?.datum).toBe(5);
        expect(tree.getMinNode()).toBe(min2);
        expect(tree.getMaxNode()).toBe(max2);

        // Insert larger value
        tree.insert(8);
        const min3 = tree.getMinNode();
        const max3 = tree.getMaxNode();
        expect(min3?.datum).toBe(2);
        expect(max3?.datum).toBe(8);
        expect(tree.getMinNode()).toBe(min3);
        expect(tree.getMaxNode()).toBe(max3);

        // Whole-tree cache still intact
        expect(tree.getMinNode()).toBe(min3);
        expect(tree.getMaxNode()).toBe(max3);

        // Remove min value -> cache marked stale
        expect(tree.remove(2)).toBe(2);
        const min4 = tree.getMinNode();
        expect(min4?.datum).toBe(5);
        expect(tree.getMinNode()).toBe(min4);

        // Remove max value -> cache marked stale
        expect(tree.remove(8)).toBe(8);
        const max4 = tree.getMaxNode();
        expect(max4?.datum).toBe(5);
        expect(tree.getMaxNode()).toBe(max4);

        // Remove last value
        expect(tree.remove(5)).toBe(5);
        expect(tree.getMinNode()).toBeUndefined();
        expect(tree.getMaxNode()).toBeUndefined();
    });
});
