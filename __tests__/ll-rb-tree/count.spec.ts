import { describe, expect, test, it } from '@jest/globals';
import { squares } from 'squares-rng';
import { compare } from '../helpers/compare.js';
import { LlRbTree } from '../../src/ll-rb-tree/ll-rb-tree.js';
import { countValues } from '../helpers/count-values.js';
import { countNodes } from '../helpers/count-nodes.js';
import { numberNodeToStr } from '../../src/ll-rb-tree/number-node-to-str.js';
import { treeToStr } from '../../src/ll-rb-tree/tree-to-string.js';


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

            if (tree.remove(111, false) !== undefined) { removed++ };
            if (tree.remove(222, false) !== undefined) { removed++ };
            if (tree.remove(333, false) !== undefined) { removed++ };

            const mods = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67];
            for (let i=0; i<N; i++) {
                // const v = squares(i) % 20;
                const v = i;
                for (let mod of mods) {
                    if (v%mod === 0) { if (tree.remove(v, false) !== undefined) { removed++ }; }
                }
            }

            // treeToString(numberNodeToStr)(tree);


            let valueCount1: number;
            let valueCount2: number;
            let nodeCount: number;

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).toEqual(valueCount2);
            expect(valueCount1 + removed).toEqual(999);
            nodeCount = countNodes(tree);
            expect(nodeCount).toEqual(tree.nodeCount);

            for (let i=0; i<N; i++) {
                // const v = squares(i) % 20;
                const v = i;
                if (tree.remove(v, false) !== undefined) { removed++ };
            }

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).toEqual(valueCount2);
            expect(valueCount1 + removed).toEqual(999);
            nodeCount = countNodes(tree);
            expect(nodeCount).toEqual(tree.nodeCount);

            for (let i=0; i<10; i++) {
                const v = i;
                tree.insert(v);
            }

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).toEqual(valueCount2);
            expect(valueCount1 + removed).toEqual(999 + 10);
            nodeCount = countNodes(tree);
            expect(nodeCount).toEqual(tree.nodeCount);
        }


        {
            const N = 999;

            const tree = new LlRbTree(compare);
            let removed = 0;

            for (let i=N-1; i>=0; i--) {
                const v = squares(i) % 20;  // ensure some duplicates
                tree.insert(v);
            }

            if (tree.remove(111, false) !== undefined) { removed++ };
            if (tree.remove(222, false) !== undefined) { removed++ };
            if (tree.remove(333, false) !== undefined) { removed++ };

            const mods = [5,7,11];
            for (let i=0; i<N; i++) {
                const v = squares(i) % 20;
                for (let mod of mods) {
                    if (v%mod === 0) { if (tree.remove(v, false) !== undefined) { removed++ }; }
                }
            }

            let valueCount1: number;
            let valueCount2: number;
            let nodeCount: number;

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).toEqual(valueCount2);
            expect(valueCount1 + removed).toEqual(999);
            nodeCount = countNodes(tree);
            expect(nodeCount).toEqual(tree.nodeCount);

            // treeToString(numberNodeToStr)(tree);

            for (let i=0; i<N; i++) {
                const v = squares(i) % 20;
                if (tree.remove(v, false) !== undefined) { removed++ };
            }

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).toEqual(valueCount2);
            expect(valueCount1 + removed).toEqual(999);
            nodeCount = countNodes(tree);
            expect(nodeCount).toEqual(tree.nodeCount);

            for (let i=0; i<10; i++) {
                const v = i;
                tree.insert(v);
            }

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).toEqual(valueCount2);
            expect(valueCount1 + removed).toEqual(999 + 10);
            nodeCount = countNodes(tree);
            expect(nodeCount).toEqual(tree.nodeCount);
        }

        {
            let valueCount1: number;
            let valueCount2: number;
            let nodeCount: number;
            
            const tree = new LlRbTree(compare, false);
            tree.insertMulti([1,2,3,4,5,6,7,8]);
            treeToStr(numberNodeToStr)(tree);
            const v = tree.remove(6);
            expect(v).toEqual(6);
            tree.toArrayInOrder();

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).toEqual(valueCount2);

            nodeCount = countNodes(tree);
            expect(nodeCount).toEqual(tree.nodeCount);
        }


        {
            let valueCount1: number;
            let valueCount2: number;
            let nodeCount: number;
            
            const tree = new LlRbTree(compare, true);
            tree.insertMulti([1,2,3,3,3,3,3,4,5,6,7,8]);
            treeToStr(numberNodeToStr)(tree);
            const v = tree.remove(3,true);
            expect(v).toEqual(3);
            tree.toArrayInOrder();

            valueCount1 = countValues(tree);
            valueCount2 = tree.valueCount;
            expect(valueCount1).toEqual(valueCount2);

            nodeCount = countNodes(tree);
            expect(nodeCount).toEqual(tree.nodeCount);
        }
    });
});

