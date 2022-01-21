import { writable } from 'svelte/store';

let prefix = 'svelteStore';

const get = (key) => {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return undefined;
    }
    const value = localStorage.getItem(key);
    return value === undefined ? "" : JSON.parse(value);
  } catch (e) {
    if (e.name == "SecurityError") return undefined;
    throw e;
  }
};

const set = (key, value) => {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return undefined;
    }

    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (e.name != "SecurityError") throw e;
  }
};

const syncValue = (key, observable) => {
  observable.subscribe(data => {
    set(key, data);
  });

  return observable;
};

export const setPrefix = (prefixName) => {
  prefix = prefixName;
};

export const syncable = (name, value, hydrate = true) => {
  const key = `${prefix}-${name}`;
  let lastValue = value;

  if (hydrate) {
    lastValue = get(key) || value;
  }

  return syncValue(key, writable(lastValue));
};
