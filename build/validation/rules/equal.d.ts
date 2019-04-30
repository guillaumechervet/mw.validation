declare function validate(value: any, params: any): {
    success: boolean;
    message: string;
};
declare var rule: {
    name: string;
    validateView: typeof validate;
    validateModel: typeof validate;
};
export { rule };
//# sourceMappingURL=equal.d.ts.map