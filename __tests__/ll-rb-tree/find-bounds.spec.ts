import { describe, expect, test, it } from '@jest/globals';
import { compare } from '../helpers/compare.js';
import { LlRbTree } from '../../src/ll-rb-tree/ll-rb-tree.js';
import { insert1to7 } from '../helpers/insert-1-to-7.js';
import { toDatum } from '../helpers/to-datum.js';


describe('findBounds', function() {
    it('it should find bounds for some items in the tree', 
    function() {
        const tree = new LlRbTree(compare);
        {
            const bounds = tree.findBounds(4).map(toDatum);
            expect(bounds).toEqual([undefined,undefined]);
        }
        insert1to7(tree);
        {
            const bounds = tree.findBounds(4).map(toDatum);
            expect(bounds).toEqual([4,5]);
        }
        {
            const bounds = tree.findBounds(1).map(toDatum);
            expect(bounds).toEqual([1,2]);
        }
        {
            const bounds = tree.findBounds(2.5).map(toDatum);
            expect(bounds).toEqual([2,3]);
        }
        {
            tree.remove(7);
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6]
            const bounds = tree.findBounds(5.99).map(toDatum);
            expect(bounds).toEqual([5,6]);
        }
        {
            tree.insert(7);
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6, 7]
            const bounds = tree.findBounds(6.999).map(toDatum);
            expect(bounds).toEqual([6,7]);
        }
        {
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6, 7]
            const bounds = tree.findBounds(7).map(toDatum);
            expect(bounds).toEqual([7,undefined]);
        }
        {
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6, 7]
            const bounds = tree.findBounds(8).map(toDatum);
            expect(bounds).toEqual([7,undefined]);
        }
        {
            // tree.toArrayInOrder();  //=> [1, 2, 3, 4, 5, 6, 7]
            const bounds = tree.findBounds(0.99).map(toDatum);
            expect(bounds).toEqual([undefined,1]);
        }
    });
});
