import { expect, it } from "vitest";
import { ImageBusyError, withImageWork } from "./imageWork";
it("bounds pending uploads and runs one pipeline at a time", async () => {
 let release!: () => void;
 const order: number[] = [];
 const first = withImageWork(() => new Promise<void>(resolve => { release = resolve; }));
 const queued = [1, 2, 3, 4].map(n => withImageWork(async () => { order.push(n); }));
 await expect(withImageWork(async () => {})).rejects.toBeInstanceOf(ImageBusyError);
 expect(order).toEqual([]); release(); await first; await Promise.all(queued);
 expect(order).toEqual([1, 2, 3, 4]);
});
it("releases capacity after a failed decoder", async () => {
 await expect(withImageWork(async () => { throw new Error("invalid image"); })).rejects.toThrow("invalid image");
 await expect(withImageWork(async () => "next upload")).resolves.toBe("next upload");
});
