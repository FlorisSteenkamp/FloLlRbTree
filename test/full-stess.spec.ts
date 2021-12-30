import { assert, expect } from 'chai';
import { describe } from 'mocha';
import { squares } from 'squares-rng';
import { compare } from './helpers/compare.js';
import { LlRbTree } from '../src/index.js';


describe('Full stress test', function() {
    it('it should pass a full stress test', 
	function() {
        const tree = new LlRbTree(compare);
        const arr: number[] = [];

        const N = 10_000;

        for (let i=0; i<N; i++) {
            tree.insert(squares(i));
            arr.push(squares(i));
        }

        let treeArr: number[];
        
        treeArr = tree.toArrayInOrder() as number[];
        arr.sort((a,b) => a - b);
        expect(treeArr).to.eql(arr);

        for (let i=0; i<N; i++) {
            const v = squares(i);
            if (v%3 === 0) {
                tree.remove(v);
                const idx = arr.findIndex(val => val === v);
                arr.splice(idx,1);
            }
        }

        treeArr = tree.toArrayInOrder() as number[];
        arr.sort((a,b) => a - b);
        expect(treeArr).to.eql(arr);

        expect(treeArr.length).to.eql(6678);
    });
});

