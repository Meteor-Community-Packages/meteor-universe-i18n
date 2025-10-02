export type JSON = boolean | null | number | string | JSON[] | JSONObject;
export type JSONObject = { [key: string]: JSON };

type UnknownRecord = Record<string, unknown>;

export function get(object: UnknownRecord, path: string) {
  const keys = path.split('.');

  // Navigate through all keys except the last one
  for (let i = 0; i < keys.length - 1; i++) {
    if (typeof object !== 'object' || object === null) {
      return undefined;
    }
    object = object[keys[i]] as UnknownRecord;
  }

  return object?.[keys[keys.length - 1]];
}

export function isJSONObject(value: JSON | unknown): value is JSONObject {
  return !!value && typeof value === 'object';
}

export function set(object: UnknownRecord, path: string, value: unknown) {
  const keys = path.split('.');

  // Navigate through all keys except the last one
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (object[key] === undefined) {
      object[key] = {};
    }

    object = object[key] as UnknownRecord;
  }

  object[keys[keys.length - 1]] = value;
}
