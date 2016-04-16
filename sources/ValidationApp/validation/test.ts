
import {IRule} from "./IRule";

class RulesImpl implements IRules {
    private _rules: Array<any>;
    public getRules() : Array<any> { 
        return this._rules; 
    }
}
interface IRules {
    getRules: Function;
}

var Rules = new RulesImpl().getRules(); 

export { Rules };
