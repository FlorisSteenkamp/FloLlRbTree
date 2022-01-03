import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { squares } from 'squares-rng';
import { compare } from './helpers/compare.js';
import { LlRbTree } from '../src/index.js';
import { isBlackHeightCorrect, isNoRedEdge } from './helpers/constraints.js';
import { treeToString } from '../src/tree-to-string.js';
import { countValues } from './helpers/count-values.js';
import { countNodes } from './helpers/count-nodes.js';
import { nodeObjToString } from './helpers/node-obj-to-string.js';
import { nodeToString } from '../src/node-to-string.js';


describe('Full stress test', function() {
    it('it should count nodes and values correctly', 
	function() {
        {
            const N = 999;

            const tree = new LlRbTree(compare);
            let removed = 0;

            for (let i=N-1; i>=0; i--) {
                // const v = squares(i) % 20;  // ensure some duplicates
                const v = i;
                tree.insert(v);
            }

            if (tree.remove(111, false)) { removed++ };
            if (tree.remove(222, false)) { removed++ };
            if (tree.remove(333, false)) { removed++ };

            const mods = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67];
            for (let i=0; i<N; i++) {
                // const v = squares(i) % 20;
                const v = i;
                for (let mod of mods) {
                    if (v%mod === 0) { if (tree.remove(v, false)) { removed++ }; }
                }
            }

            // tree.toArrayInOrder();//?

            let valueCount1: number;
            let valueCount2: number;
            let nodeCount: number;

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).to.eql(valueCount2);
            expect(valueCount1 + removed).to.eql(999);
            nodeCount = countNodes(tree);
            expect(nodeCount).to.eql(tree.nodeCount);

            for (let i=0; i<N; i++) {
                // const v = squares(i) % 20;
                const v = i;
                if (tree.remove(v, false)) { removed++ };
            }

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).to.eql(valueCount2);
            expect(valueCount1 + removed).to.eql(999);
            nodeCount = countNodes(tree);
            expect(nodeCount).to.eql(tree.nodeCount);

            for (let i=0; i<10; i++) {
                const v = i;
                tree.insert(v);
            }

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).to.eql(valueCount2);
            expect(valueCount1 + removed).to.eql(999 + 10);
            nodeCount = countNodes(tree);
            expect(nodeCount).to.eql(tree.nodeCount);
        }


        {
            const N = 999;

            const tree = new LlRbTree(compare);
            let removed = 0;

            for (let i=N-1; i>=0; i--) {
                const v = squares(i) % 20;  // ensure some duplicates
                tree.insert(v);
            }

            if (tree.remove(111, false)) { removed++ };
            if (tree.remove(222, false)) { removed++ };
            if (tree.remove(333, false)) { removed++ };

            const mods = [5,7,11];
            for (let i=0; i<N; i++) {
                const v = squares(i) % 20;
                for (let mod of mods) {
                    if (v%mod === 0) { if (tree.remove(v, false)) { removed++ }; }
                }
            }

            let valueCount1: number;
            let valueCount2: number;
            let nodeCount: number;

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).to.eql(valueCount2);
            expect(valueCount1 + removed).to.eql(999);
            nodeCount = countNodes(tree);
            expect(nodeCount).to.eql(tree.nodeCount);

            // treeToString(tree, nodeToString);//?

            for (let i=0; i<N; i++) {
                const v = squares(i) % 20;
                if (tree.remove(v, false)) { removed++ };
            }

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).to.eql(valueCount2);
            expect(valueCount1 + removed).to.eql(999);
            nodeCount = countNodes(tree);
            expect(nodeCount).to.eql(tree.nodeCount);

            for (let i=0; i<10; i++) {
                const v = i;
                tree.insert(v);
            }

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).to.eql(valueCount2);
            expect(valueCount1 + removed).to.eql(999 + 10);
            nodeCount = countNodes(tree);
            expect(nodeCount).to.eql(tree.nodeCount);
        }
    });
});

