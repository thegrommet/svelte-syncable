import { writable } from "svelte/store";

let prefix = "svelteStore";

/**
 * @param {Storage} store
 * @param {string} key
 * @return {any}
 */
const get = (store, key) => {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return undefined;
    }
    const value = store.getItem(key);
    return value == null ? "" : JSON.parse(value);
  } catch (e) {
    if (e instanceof Error && e.name == "SecurityError") return undefined;
    throw e;
  }
};

/**
 * @template T
 * @param {Storage} store
 * @param {string} key
 * @param {T} value
 * @returns {void}
 */
const set = (store, key, value) => {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    store.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (!(e instanceof Error) || e.name != "SecurityError") throw e;
  }
};

/**
 * @template {import('svelte/store').Writable} T
 * @param {Storage} store
 * @param {string} key
 * @param {T} observable
 * @returns {T}
 */
function syncValue (store, key, observable) {
  observable.subscribe((data) => {
    set(store, key, data);
  });

  return observable;
};

/**
 * @param {string} prefixName
 */
export function setPrefix(prefixName) {
  prefix = prefixName;
};

/**
 * @template T
 * @param {string} name
 * @param {T} value
 * @param {boolean} [hydrate]
 * @returns {import('svelte/store').Writable<T>}
 */
export function syncable(name, value, hydrate = true) {
  if (typeof window == "undefined" || typeof localStorage == "undefined") {
    return writable(value);
  }
  const key = `${prefix}-${name}`;
  let lastValue = value;

  if (hydrate) {
    lastValue = get(localStorage, key) || value;
  }

  return syncValue(localStorage, key, writable(lastValue));
}

/**
 * @template T
 * @param {string} name
 * @param {T} value
 * @param {boolean} [hydrate]
 * @returns {import('svelte/store').Writable<T>}
 */
export function sessionSyncable(name, value, hydrate = true) {
  if (typeof window == "undefined" || typeof sessionStorage == "undefined") {
    return writable(value);
  }
  const key = `${prefix}-${name}`;
  let lastValue = value;

  if (hydrate) {
    lastValue = get(sessionStorage, key) || value;
  }

  return syncValue(sessionStorage, key, writable(lastValue));
}
