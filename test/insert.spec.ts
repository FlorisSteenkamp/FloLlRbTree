import { type Obj } from './helpers/obj.js';
import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { insert1to7Objs } from './helpers/insert-1-to-7-objs.js';
import { vals1to7Objs } from './helpers/vals-1-to-7-objs.js';
import { compareObjs } from './helpers/compare-objs.js';
import { LlRbTree } from '../src/index.js';


describe('new', function() {
    it('it should insert nodes into the tree', 
	function() {
        {
            const tree = new LlRbTree(compareObjs, vals1to7Objs);
            expect((tree.toArrayInOrder() as Obj[]).map(o => o.val)).to.eql([1,2,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compareObjs);
            insert1to7Objs(tree);
            expect((tree.toArrayInOrder() as Obj[]).map(o => o.val)).to.eql([1,2,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compareObjs, []);
            insert1to7Objs(tree);
            expect((tree.toArrayInOrder() as Obj[]).map(o => o.val)).to.eql([1,2,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compareObjs, [], false);
            insert1to7Objs(tree);
            expect((tree.toArrayInOrder() as Obj[][]).map(o => o[0].val)).to.eql([1,2,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compareObjs, [], true);
            insert1to7Objs(tree);
            expect((tree.toArrayInOrder() as Obj[]).map(o => o.val)).to.eql([1,2,3,4,5,6,7]);
        }
        {
            const tree = new LlRbTree(compareObjs, undefined, true);
            insert1to7Objs(tree);
            expect((tree.toArrayInOrder() as Obj[]).map(o => o.val)).to.eql([1,2,3,4,5,6,7]);
        }
    });
});
