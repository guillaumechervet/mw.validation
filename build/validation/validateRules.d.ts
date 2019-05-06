import * as rules from "./rules";
declare function validateDependencies(ruleDefinitions: any): void;
declare function validateView(value: any, ruleDefinition: any): any[];
declare function validateModel(value: any, ruleDefinition: any): any[];
declare var add: typeof rules.add;
declare function firstError(validationResults: any): any;
export { add, validateView, validateModel, validateDependencies, firstError };
//# sourceMappingURL=validateRules.d.ts.map