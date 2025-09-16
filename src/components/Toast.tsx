"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastContextValue = {
  show: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastItem = { id: number; message: string };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((t) => [...t, { id, message }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 1800);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto select-none rounded-lg bg-black/80 text-white border border-border px-3 py-2 text-sm shadow-xl">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("ToastProvider missing");
  return ctx;
}
