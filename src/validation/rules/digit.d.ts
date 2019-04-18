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
    parser: (value: any) => number;
    formatter: (value: any) => any;
    priority: number;
};
export { rule };
//# sourceMappingURL=digit.d.ts.map