import { describe, expect, test, it } from '@jest/globals';
import { squares } from 'squares-rng';
import { compare } from '../../helpers/compare.js';
import { LlRbTree } from '../../../src/ll-rb-tree/ll-rb-tree.js';
import { isBlackHeightCorrect, isNoRedEdge } from '../../helpers/constraints.js';
import { treeToStr } from '../../../src/ll-rb-tree/tree-to-string.js';
import { numberNodeToStr } from '../../../src/ll-rb-tree/number-node-to-str.js';


function expectTrue(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
    expect(condition).toBe(true);
}


describe('Full stress test', function() {
    it('it should pass a full stress test - part 1', 
    function() {
        const tree = new LlRbTree(compare);
        const arr: number[] = [];

        const N = 5_000;

        for (let i=0; i<N; i++) {
            tree.insert(squares(i));
            arr.push(squares(i));
        }

        let treeArr: number[];
        
        treeArr = tree.toArrayInOrder();
        arr.sort((a,b) => a - b);
        expect(treeArr).toEqual(arr);

        for (let i=0; i<N; i++) {
            const v = squares(i);
            if (v%3 === 0) {
                tree.remove(v, false);
                const idx = arr.findIndex(val => val === v);
                arr.splice(idx,1);
            }
        }

        treeArr = tree.toArrayInOrder();
        arr.sort((a,b) => a - b);
        expect(treeArr).toEqual(arr);

        expect(treeArr.length).toEqual(3325);
    });

    
    it('it should pass a full stress test - part 2', 
    function() {
        const tree = new LlRbTree(compare);
        const arr: number[] = [];

        const N = 985;
        
        for (let i=0; i<N; i++) {
            // ensure some duplicates
            const v = squares(i) % 5;
            tree.insert(v);
            arr.push(v);
        }

        // treeToString(numberNodeToStr)(tree);
        expectTrue(isBlackHeightCorrect(tree), 'tree does not pass black height constraint');
        expectTrue(isNoRedEdge(tree), 'tree does not pass no red edge constraint');

        let treeArr: number[];
        treeArr = tree.toArrayInOrder();
        arr.sort((a,b) => a - b);
        expect(treeArr).toEqual(arr);
    });

    it('it should pass a full stress test - part 3', 
    function() {
        const tree = new LlRbTree(compare);
        const arr: number[] = [];

        const N = 985;

        for (let i=0; i<N; i++) {
            const v = squares(i) % 20;  // ensure some duplicates
            tree.insert(v);
            arr.push(v);
        }

        for (let i=0; i<N; i++) {
            const v = squares(i) % 20;
            if (v%2 === 0) {
                tree.remove(v, false);
                const idx = arr.findIndex(val => val === v);
                if (idx !== -1) {
                    arr.splice(idx,1);
                }
            }
        }

        // treeToString(tree);//?
        expectTrue(isBlackHeightCorrect(tree), 'tree does not pass black height constraint');
        expectTrue(isNoRedEdge(tree), 'tree does not pass no red edge constraint');

        let treeArr: number[];
        treeArr = tree.toArrayInOrder();
        arr.sort((a,b) => a - b);
        expect(treeArr).toEqual(arr);

        expect(treeArr.length).toEqual(480);
    });


    it('it should pass a full stress test - part 4', 
    function() {
        const tree = new LlRbTree(compare, false);
        const arr: number[] = [];

        const N = 5_000;

        for (let i=0; i<N; i++) {
            tree.insert(squares(i));
            arr.push(squares(i));
        }

        let treeArr: number[];
        
        treeArr = tree.toArrayInOrder();
        arr.sort((a,b) => a - b);
        expect(treeArr).toEqual(arr);

        for (let i=0; i<N; i++) {
            const v = squares(i);
            if (v%3 === 0) {
                tree.remove(v, false);
                const idx = arr.findIndex(val => val === v);
                arr.splice(idx,1);
            }
        }

        treeArr = tree.toArrayInOrder();
        arr.sort((a,b) => a - b);
        expect(treeArr).toEqual(arr);

        expect(treeArr.length).toEqual(3325);
    });


    it('it should pass a full stress test - part 5', 
    function() {
        const tree = new LlRbTree(compare, false);

        const N = 985;
        
        for (let i=0; i<N; i++) {
            // ensure some duplicates
            const v = squares(i) % 5;
            tree.insert(v);
        }

        // treeToString(tree);//?
        expectTrue(isBlackHeightCorrect(tree), 'tree does not pass black height constraint');
        expectTrue(isNoRedEdge(tree), 'tree does not pass no red edge constraint');

        let treeArr: number[];
        treeArr = tree.toArrayInOrder();
        expect(treeArr).toEqual([0,1,2,3,4]);
    });

    it('it should pass a full stress test - part 6', 
    function() {
        const tree = new LlRbTree(compare, false);

        const N = 55;

        for (let i=0; i<N; i++) {
            const v = squares(i) % 20;  // ensure some duplicates
            tree.insert(v);
        }

        for (let i=0; i<N; i++) {
            const v = squares(i) % 20;
            if (v%2 === 0) {
                tree.remove(v, false);
            }
        }

        // treeToString(tree);//?
        expectTrue(isBlackHeightCorrect(tree), 'tree does not pass black height constraint');
        expectTrue(isNoRedEdge(tree), 'tree does not pass no red edge constraint');

        let treeArr: number[];
        treeArr = tree.toArrayInOrder();
        expect(treeArr).toEqual([1,3,5,7,9,11,13,15,17,19]);

        expect(treeArr.length).toEqual(10);
    });
});

