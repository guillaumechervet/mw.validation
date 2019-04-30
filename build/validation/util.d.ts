declare class Util {
    isEmptyVal(val: any): Boolean;
    isDate(val: any): boolean;
    toDate(val: string): Date;
    formatDate(date: Date): string;
    sortHashTable(hashTable: Array<any>, key: string, removeKey?: boolean): Array<any>;
    formatNumberLength(num: number, length: number): string;
}
declare var util: Util;
export { util };
//# sourceMappingURL=util.d.ts.map