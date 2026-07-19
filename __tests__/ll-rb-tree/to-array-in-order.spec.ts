import { describe, expect, test, it } from '@jest/globals';
import { insert1to7 } from '../helpers/insert-1-to-7.js';
import { LlRbTree } from '../../src/ll-rb-tree/ll-rb-tree.js';
import { compare } from '../helpers/compare.js';


describe('toArrayInOrder', function() {
    it('it should return the ordered data at the tree nodes', 
    function() {
        {
            const tree = new LlRbTree(compare);
            expect(tree.toArrayInOrder()).toEqual([]);
        }
        {
            const tree = new LlRbTree(compare, true, [7,6,5,4,3,1,2]);
            expect(tree.toArrayInOrder()).toEqual([1,2,3,4,5,6,7]);
        }
    });
});
