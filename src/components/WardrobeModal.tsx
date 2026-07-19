"use client";

import { useMemo } from "react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { BODIES } from "@/lib/characters";
import { useUserStore, selectLevel } from "@/store/useUserStore";
import { useUiStore } from "@/store/useUiStore";

export default function WardrobeModal() {
  const { wardrobeOpen, closeWardrobe } = useUiStore();
  const tasks = useUserStore((s) => s.tasks);
  const skins = useUserStore((s) => s.skins);
  const setSkin = useUserStore((s) => s.setSkin);

  const level = useMemo(() => selectLevel(tasks), [tasks]);

  return (
    <Modal open={wardrobeOpen} onClose={closeWardrobe} title="Гардероб">
      <div className="max-h-[68vh] space-y-6 overflow-y-auto pr-1">
        {BODIES.map((body) => {
          const unlocked = level >= body.minLevel;
          return (
            <section key={body.id}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">{body.label}</h3>
                {unlocked ? (
                  <span className="text-[11px] text-[var(--color-muted)]">
                    образов: {body.skins.length}
                  </span>
                ) : (
                  <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[11px] text-[var(--color-muted)]">
                    🔒 с ур. {body.minLevel}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {body.skins.map((skin) => {
                  const equipped = skins?.[body.id] === skin.id;
                  return (
                    <button
                      key={skin.id}
                      disabled={!unlocked}
                      onClick={() => setSkin(body.id, skin.id)}
                      className={cn(
                        "group relative flex flex-col items-center overflow-hidden rounded-xl border bg-[var(--color-surface-2)] p-2 transition",
                        equipped
                          ? "border-[var(--color-fg)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-fg-dim)]",
                        !unlocked && "opacity-40",
                      )}
                    >
                      <div className="flex h-24 w-full items-end justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={skin.src}
                          alt={skin.label}
                          className={cn(
                            "h-full w-auto object-contain",
                            !unlocked && "grayscale",
                          )}
                          draggable={false}
                        />
                      </div>
                      <span className="mt-1 text-[10px] text-[var(--color-fg-dim)]">
                        {skin.label}
                      </span>
                      {equipped && (
                        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-fg)] text-[10px] text-[var(--color-bg)]">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </Modal>
  );
}
