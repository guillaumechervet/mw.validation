declare var rule: {
    name: string;
    priority: number;
    validateView: (value: any, params: any) => {
        success: boolean;
        message: string;
    };
    validateModel: (value: any, params: any) => {
        success: boolean;
        message: string;
    };
    parser: (value: any) => any;
    formatter: (value: any) => string;
};
export { rule };
//# sourceMappingURL=dateCompare.d.ts.map