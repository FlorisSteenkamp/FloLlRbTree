import { describe, expect, test, it } from '@jest/globals';
import { compare } from '../helpers/compare.js';
import { LlRbTree } from '../../src/ll-rb-tree/ll-rb-tree.js';
import { insert1to7 } from '../helpers/insert-1-to-7.js';


describe('getMaxNode', function() {
    it('it should find the maximum node in the tree', 
    function() {
        {
            const tree = new LlRbTree(compare);
            expect(tree.getMaxNode()).toEqual(undefined);
            insert1to7(tree);
            expect(tree.getMaxNode()!.datum).toEqual(7);
        }
    });
});
