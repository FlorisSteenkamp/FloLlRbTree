import { describe, expect, it } from '@jest/globals';
import { compare } from '../helpers/compare.js';
import { RbTree } from '../../src/rb-tree/rb-tree.js';
import { rbTreeToValues } from '../helpers/rb-tree-values.js';


describe('rb-tree stress', function() {
    it('it should survive a larger insert/remove sequence', function() {
        const tree = new RbTree(compare);
        const values: number[] = [];

        const n = 500;
        for (let i = 0; i < n; i++) {
            const value = (i * 37) % n;
            values.push(value);
            tree.insert(value);
        }

        expect(tree.getMinNode()?.datum).toBe(0);
        expect(tree.getMaxNode()?.datum).toBe(499);
        expect(tree.findBounds(250).map(node => node?.datum)).toEqual([250, 251]);

        for (let i = 0; i < n; i += 3) {
            tree.remove(i);
        }

        const remaining = values
            .filter(value => value % 3 !== 0)
            .filter((value, index, array) => array.indexOf(value) === index)
            .sort((a, b) => a - b);

        expect(rbTreeToValues(tree)).toEqual(remaining);
    });
});