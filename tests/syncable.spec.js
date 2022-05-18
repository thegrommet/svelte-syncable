import { syncable, sessionSyncable, setPrefix } from "../index";
import { get } from "svelte/store";
import { vi } from "vitest";

let app = null;

describe("syncable", () => {
  beforeEach(() => {
    setPrefix("svelteStore");
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("syncable stores in localStorage", () => {
    const spy = vi.spyOn(localStorage, "setItem");

    syncable("count", 0);

    expect(spy).toHaveBeenLastCalledWith("svelteStore-count", "0");
  });

  test("syncable has a new prefix", () => {
    const spy = vi.spyOn(localStorage, "setItem");

    setPrefix("foobar");
    syncable("count", 0);

    expect(spy).toHaveBeenLastCalledWith("foobar-count", "0");
  });

  test("syncable returns a SvelteObservable", () => {
    const count = syncable("count", 0);

    expect(count.subscribe).toBeInstanceOf(Function);
    expect(count.set).toBeInstanceOf(Function);
    expect(count.update).toBeInstanceOf(Function);
  });

  test("syncable is hydrated from the stored value", () => {
    localStorage.setItem("svelteStore-count", 42);

    const countObservable = syncable("count", 0);

    expect(get(countObservable)).toBe(42);
  });

  test("syncable is not hydrated from the stored value", () => {
    localStorage.setItem("svelteStore-count", 42);

    const countObservable = syncable("count", 0, false);

    expect(get(countObservable)).toBe(0);
  });
});

describe("sessionSyncable", () => {
  beforeEach(() => {
    setPrefix("svelteStore");
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("syncable stores in sessionStorage", () => {
    const spy = vi.spyOn(sessionStorage, "setItem");

    sessionSyncable("count", 0);

    expect(spy).toHaveBeenLastCalledWith("svelteStore-count", "0");
  });

  test("syncable has a new prefix", () => {
    const spy = vi.spyOn(sessionStorage, "setItem");

    setPrefix("foobar");
    sessionSyncable("count", 0);

    expect(spy).toHaveBeenLastCalledWith("foobar-count", "0");
  });

  test("sessionSyncable returns a SvelteObservable", () => {
    const count = sessionSyncable("count", 0);

    expect(count.subscribe).toBeInstanceOf(Function);
    expect(count.set).toBeInstanceOf(Function);
    expect(count.update).toBeInstanceOf(Function);
  });

  test("syncable is hydrated from the stored value", () => {
    sessionStorage.setItem("svelteStore-count", "42");

    const countObservable = sessionSyncable("count", 0);

    expect(get(countObservable)).toBe(42);
  });

  test("syncable is not hydrated from the stored value", () => {
    sessionStorage.setItem("svelteStore-count", 42);

    const countObservable = sessionSyncable("count", 0, false);

    expect(get(countObservable)).toBe(0);
  });
});
