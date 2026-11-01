/** Three-way merge: only edits since the acknowledged base are applied.
 * Deletion wins over a concurrent edit. Scalar conflicts use the last server
 * commit; independent fields and additions are preserved. No device clocks.
 */
type Obj = Record<string, unknown>;
const object = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);
const equal = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => equal(v, b[i]));
  if (object(a) && object(b)) {
    const keys = Object.keys(a).filter(k => a[k] !== undefined);
    return keys.length === Object.keys(b).filter(k => b[k] !== undefined).length && keys.every(k => equal(a[k], b[k]));
  }
  return false;
};
const safeKeys = (v: Obj) => Object.keys(v).filter(k => !["__proto__", "prototype", "constructor"].includes(k));
const identified = (v: unknown[]): boolean => v.every(x => object(x) && typeof x.id === "string");
export function mergeValue(base: unknown, local: unknown, remote: unknown): unknown {
  if (equal(base, local)) return remote;
  if (equal(base, remote)) return local;
  if (base !== undefined && (local === undefined || remote === undefined)) return undefined;
  if (Array.isArray(local) && Array.isArray(remote)) {
    const before = Array.isArray(base) ? base : [];
    if (identified(local) && identified(remote) && identified(before)) {
      const index = (a: unknown[]) => new Map(a.map(x => [(x as Obj).id, x]));
      const b = index(before), l = index(local), s = index(remote);
      return [...new Set([...s.keys(), ...l.keys()])].flatMap(id => {
        const value = mergeValue(b.get(id), l.get(id), s.get(id));
        return value === undefined ? [] : [value];
      });
    }
    if ([...before, ...local, ...remote].every(v => typeof v === "string")) {
      return [...new Set([...remote, ...local])].filter(v => !before.includes(v) || (local.includes(v) && remote.includes(v)));
    }
  }
  if (object(local) && object(remote)) {
    const b = object(base) ? base : {};
    const out: Obj = {};
    for (const k of new Set([...safeKeys(b), ...safeKeys(local), ...safeKeys(remote)])) {
      const value = mergeValue(b[k], local[k], remote[k]);
      if (value !== undefined) out[k] = value;
    }
    return out;
  }
  // No baseline (first upgraded device): preserve the account on conflicts.
  return base === undefined && remote !== undefined ? remote : local;
}
export function mergeSnapshots<T>(base: T | null, local: T, remote: T): T {
  return mergeValue(base ?? undefined, local, remote) as T;
}
export function sameSnapshot(a: unknown, b: unknown): boolean {
  if (!object(a) || !object(b)) return equal(a, b);
  const { updatedAt: _a, ...left } = a, { updatedAt: _b, ...right } = b;
  return equal(left, right);
}
