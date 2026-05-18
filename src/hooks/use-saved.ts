import { useEffect, useState } from "react";

const KEY = "athlink:saved";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useSaved() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read());
    const onStorage = () => setIds(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("athlink:saved-changed", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("athlink:saved-changed", onStorage);
    };
  }, []);

  const toggle = (id: string) => {
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    setIds(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("athlink:saved-changed"));
  };

  return { ids, isSaved: (id: string) => ids.includes(id), toggle };
}
