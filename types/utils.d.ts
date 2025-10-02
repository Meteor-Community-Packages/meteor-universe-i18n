export type JSON = boolean | null | number | string | JSON[] | JSONObject;
export type JSONObject = {
    [key: string]: JSON;
};
type UnknownRecord = Record<string, unknown>;
export declare function get(object: UnknownRecord, path: string): unknown;
export declare function isJSONObject(value: JSON | unknown): value is JSONObject;
export declare function set(object: UnknownRecord, path: string, value: unknown): void;
export {};
//# sourceMappingURL=utils.d.ts.map