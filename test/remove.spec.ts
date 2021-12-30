import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { compareObjs } from './helpers/compare-objs.js';
import { LlRbTree } from '../src/index.js';
import { insert1to7Objs } from './helpers/insert-1-to-7-objs.js';
import { type Obj } from './helpers/obj.js';


describe('remove', function() {
    it('it should remove items in the tree based on value', 
	function() {
        {
            const tree = new LlRbTree(compareObjs);
            // const itemNode = expect((tree.remove( as Obj[]){ val: 2 } as Obj)).to.throw;
            insert1to7Objs(tree);
            tree.remove({ val: 2 } as Obj);
            expect((tree.toArrayInOrder() as Obj[]).map(o => o.val)).to.eql([1,/*2,*/3,4,5,6,7]);
            tree.remove({ val: 5, name: 'apple pear' });
            expect((tree.toArrayInOrder() as Obj[]).map(o => o.val)).to.eql([1,/*2,*/3,4/*,5*/,6,7]);

            tree.remove({ val: 1, name: 'apple pear' });
            tree.remove({ val: 3, name: 'apple pear' });
            tree.remove({ val: 4, name: 'apple pear' });
            tree.remove({ val: 6, name: 'apple pear' });
            expect((tree.toArrayInOrder() as Obj[]).map(o => o.val)).to.eql([7]);

            tree.remove({ val: 7, name: 'apple pear' });
            expect((tree.toArrayInOrder() as Obj[]).map(o => o.val)).to.eql([]);

            tree.insert({ val: 7, name: 'apple pear' });
            expect((tree.toArrayInOrder() as Obj[]).map(o => o.val)).to.eql([7]);

            tree.remove({ val: 7, name: 'pear apple' });
            expect((tree.toArrayInOrder() as Obj[]).map(o => o.val)).to.eql([]);

            expect(tree.root).to.be.null;
        }
    });
});
