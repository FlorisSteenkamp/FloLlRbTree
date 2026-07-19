import { describe, expect, test, it } from '@jest/globals';
import { compareObjs } from '../helpers/compare-objs.js';
import { LlRbTree } from '../../src/ll-rb-tree/ll-rb-tree.js';
import { insert1to7Objs } from '../helpers/insert-1-to-7-objs.js';
import { type Obj } from '../helpers/obj.js';


describe('find', function() {
    it('it should find items in the tree based on value', 
    function() {
        {
            const tree = new LlRbTree(compareObjs);
            const itemNode = tree.find({ val: 2 });
            expect(itemNode).toEqual(undefined);
            insert1to7Objs(tree);
            const item1 = tree.find({ val: 2 })!.datum;
            expect((item1).val).toEqual(2);
            const item2 = tree.find({ val: 2, name: 'apple pear' })!.datum;
            expect((item2).val).toEqual(2);

            const item3 = tree.find({ val: 6, name: 'apple pear' })!.datum;
            expect((item3).val).toEqual(6);
            // treeToString(tree, nodeObjToString);//?
        }
    });
});
