declare var rule: {
    name: string;
    validateView: (value: any, params?: any) => {
        success: boolean;
        message: string;
    };
    validateModel: (value: any, params?: any) => {
        success: boolean;
        message: string;
    };
    parser: (value: any) => any;
    formatter: (value: any) => string;
    priority: number;
};
export { rule };
//# sourceMappingURL=date.d.ts.map