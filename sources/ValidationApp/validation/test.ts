
import {IRule} from './IRule';

class Rules implements IRules {
    private _rules: Array<IRule>;
    getRules() { return this._rules; }
}
interface IRules {
    getRules();
}
export = new Rules();
