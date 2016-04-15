//module mw.validation {
  
    export interface IRule {
        validateView: Function;
        validateModel: Function;
        priority: number;
        name:string;
    }
//}