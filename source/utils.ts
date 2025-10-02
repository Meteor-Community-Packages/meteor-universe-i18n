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
    // Block prototype pollution keys
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return;
    }
    if (object[key] === undefined) {
      object[key] = {};
    }

    object = object[key] as UnknownRecord;
  }

  const lastKey = keys[keys.length - 1];
  // Block prototype pollution keys on leaf
  if (lastKey === '__proto__' || lastKey === 'constructor' || lastKey === 'prototype') {
    return;
  }
  object[lastKey] = value;
}
