"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * False on the server and during hydration, true afterwards. Forms use it to
 * stay disabled until React owns the DOM, so text typed into the server-rendered
 * HTML can never get out of sync with React state.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

// In-memory only (never written to localStorage/sessionStorage/cookies).
// It survives client-side navigation and component remounts, and is lost on reload.
const drafts = new Map<string, string>();

export function useDraft(key: string): [string, (value: string) => void] {
  const [value, setValue] = useState(() => drafts.get(key) ?? "");
  const update = useCallback(
    (next: string) => {
      if (next) drafts.set(key, next);
      else drafts.delete(key);
      setValue(next);
    },
    [key],
  );
  return [value, update];
}

export function useDraftChoice(key: string, initial: string): [string, (value: string) => void] {
  const [value, setValue] = useState(() => drafts.get(key) ?? initial);
  const update = useCallback(
    (next: string) => {
      drafts.set(key, next);
      setValue(next);
    },
    [key],
  );
  return [value, update];
}

/** Development-only breadcrumb to help spot unexpected remounts. Never logs content. */
export function useLifecycleLog(name: string) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    console.debug(`[GlowUp] ${name} mounted`);
    return () => console.debug(`[GlowUp] ${name} unmounted`);
  }, [name]);
}
