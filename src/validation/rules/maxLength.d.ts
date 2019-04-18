declare var rule: {
    name: string;
    validateView: (value: any, params: any) => {
        success: boolean;
        message: string;
    };
    validateModel: (value: any, params: any) => {
        success: boolean;
        message: string;
    };
};
export { rule };
//# sourceMappingURL=maxLength.d.ts.map