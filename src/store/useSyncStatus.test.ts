import { expect, it } from "vitest";
import { useSyncStatus } from "./useSyncStatus";
it("marks local changes pending until acknowledged and tracks offline/storage separately", () => {
 const s = useSyncStatus.getState(); s.markSynced(); s.queue();
 expect(useSyncStatus.getState().state).toBe("queued");
 s.setOnline(false); expect(useSyncStatus.getState().online).toBe(false);
 s.setStorageError(true); expect(useSyncStatus.getState().storageError).toBe(true);
 s.setOnline(true); s.begin(); s.fail(); expect(useSyncStatus.getState().state).toBe("error");
 s.markSynced(); expect(useSyncStatus.getState().lastSyncedAt).toBeGreaterThan(0);
});

it("keeps a failed parallel write visible until a new batch is retried", () => {
 const s = useSyncStatus.getState();
 s.beginWrite(); s.beginWrite(); s.endWrite(false); s.beginWrite(); s.endWrite(true); s.endWrite(true);
 expect(useSyncStatus.getState().writes).toBe(0);
 expect(useSyncStatus.getState().writeError).toBe(true);
 s.beginWrite(); s.endWrite(true);
 expect(useSyncStatus.getState().writeError).toBe(false);
});
