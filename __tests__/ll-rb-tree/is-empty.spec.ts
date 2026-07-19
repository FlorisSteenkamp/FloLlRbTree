import { describe, expect, test, it } from '@jest/globals';
import { compare } from '../helpers/compare.js';
import { LlRbTree } from '../../src/ll-rb-tree/ll-rb-tree.js';
import { insert1to7 } from '../helpers/insert-1-to-7.js';
import { vals1to7 } from '../helpers/vals-1-to-7.js';


describe('isEmpty', function() {
    it('it should check if the given tree is empty or not', 
    function() {
        {
            const tree = new LlRbTree(compare);
            expect(tree.isEmpty()).toEqual(true);
            insert1to7(tree);
            expect(tree.isEmpty()).toEqual(false);
        }
    });
});
