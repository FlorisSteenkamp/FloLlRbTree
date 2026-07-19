import { nodeToString } from "../../src/ll-rb-tree/ll-rb-tree.js";
import { Obj } from './obj.js';


const objNodeToStr = nodeToString<Obj>(t => t.toString());


export { objNodeToStr }
