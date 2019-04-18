declare function validate(value: any): {
    success: boolean;
    message: string;
};
declare var rule: {
    name: string;
    validateView: typeof validate;
    validateModel: typeof validate;
    priority: number;
};
export { rule };
//# sourceMappingURL=required.d.ts.map