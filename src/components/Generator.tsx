"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPublicBaseUrl, validateMintId } from "@/lib/pump";

type Props = { baseUrl?: string };

type AspectMessage = {
  type: "pump-embed:aspect";
  embedId?: string;
  vw: number;
  vh: number;
  aspect: number;
};

export default function Generator({ baseUrl }: Props) {
  const [input, setInput] = useState<string>("");
  const [mintId, setMintId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const previewRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [aspect, setAspect] = useState<number | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);
  const embedIdRef = useRef<string>(Math.random().toString(36).slice(2) + Date.now().toString(36));
  const host = useMemo(() => (baseUrl && /^https?:\/\//.test(baseUrl) ? baseUrl : getPublicBaseUrl()), [baseUrl]);
  const [optBorder, setOptBorder] = useState<boolean>(true);
  const [optPump, setOptPump] = useState<boolean>(true);
  const [optControls, setOptControls] = useState<boolean>(true);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const v = validateMintId(input);
      if (!v) {
        setError("Invalid or missing mintId");
        setMintId(null);
        return;
      }
      setError("");
      setMintId(v);
    },
    [input]
  );

  useEffect(() => {
    function onMsg(ev: MessageEvent) {
      const raw = ev.data as unknown;
      if (!raw || typeof raw !== "object") return;
      const d = raw as Partial<AspectMessage>;
      if (d.type !== "pump-embed:aspect") return;
      if (d.embedId && d.embedId !== embedIdRef.current) return;
      if (typeof d.aspect !== "number" || !isFinite(d.aspect) || d.aspect <= 0) return;
      setAspect(d.aspect);
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (!aspect) return;
      const w = el.clientWidth || 0;
      if (!w) return;
      const h = Math.round(w / aspect);
      setPreviewHeight(h);
      if (iframeRef.current) iframeRef.current.style.height = `${h}px`;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [aspect]);

  const iframeSnippet = useMemo(() => {
    const base = `${host}/e?mintId=REPLACE_WITH_MINT`;
    const qs = [optBorder ? "border=1" : "", optPump ? "pump=1" : "", optControls ? "controls=1" : ""].filter(Boolean).join("&");
    const url = base + (qs ? `&${qs}` : "");
    const templ = `<iframe\n  src="${url}"\n  width="560"\n  height="315"\n  style="border:0;overflow:hidden"\n  allow="autoplay; fullscreen; picture-in-picture"\n  referrerpolicy="strict-origin-when-cross-origin">\n</iframe>`;
    if (!mintId) return templ;
    return templ.replace("REPLACE_WITH_MINT", mintId);
  }, [host, mintId, optBorder, optPump, optControls]);

  const scriptSnippet = useMemo(() => {
    const attrs = [
      `async`,
      `src="${host}/embed.js"`,
      `data-mint-id="REPLACE_WITH_MINT"`,
      `data-width="100%"`,
      `data-height="315"`,
      `data-allow="autoplay; fullscreen; picture-in-picture"`,
      `data-style="border:0;overflow:hidden"`,
      `data-referrerpolicy="strict-origin-when-cross-origin"`,
      optBorder ? `data-border="1"` : "",
      optPump ? `data-pump="1"` : "",
      optControls ? `data-controls="1"` : "",
    ].filter(Boolean).join(" ");
    const templ = `<script ${attrs}></script>`;
    if (!mintId) return templ;
    return templ.replace("REPLACE_WITH_MINT", mintId);
  }, [host, mintId, optBorder, optPump, optControls]);

  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="grid gap-6">
      <div className="card p-4 sm:p-5">
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            inputMode="text"
            placeholder="Enter mintId"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 input-pill px-4 py-2 text-sm text-foreground placeholder:text-foreground/40"
            aria-label="mintId"
          />
          <button type="submit" className="btn-green text-sm">
            Generate
          </button>
        </form>
        {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
      </div>

      {mintId && (
        <>
          <div className="card p-4 sm:p-5">
            <div className="text-sm font-medium mb-2">Live preview</div>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 text-sm text-foreground/80"><input type="checkbox" checked={optBorder} onChange={(e) => setOptBorder(e.target.checked)} className="accent-[var(--primary)]" /> Green border</label>
              <label className="flex items-center gap-2 text-sm text-foreground/80"><input type="checkbox" checked={optPump} onChange={(e) => setOptPump(e.target.checked)} className="accent-[var(--primary)]" /> Pump button</label>
              <label className="flex items-center gap-2 text-sm text-foreground/80"><input type="checkbox" checked={optControls} onChange={(e) => setOptControls(e.target.checked)} className="accent-[var(--primary)]" /> Mute/Unmute controls</label>
            </div>
            <div ref={previewRef} className="w-full rounded-lg overflow-hidden bg-black">
              <iframe
                ref={iframeRef}
                src={`/e?mintId=${encodeURIComponent(mintId)}&embedId=${encodeURIComponent(embedIdRef.current)}${optBorder ? "&border=1" : ""}${optPump ? "&pump=1" : ""}${optControls ? "&controls=1" : ""}`}
                className="w-full"
                style={{ height: previewHeight ? `${previewHeight}px` : undefined }}
                allow="autoplay; fullscreen; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          <div className="card p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium">Iframe embed</div>
                <div className="code-panel">
                  <button onClick={() => copy(iframeSnippet)} className="copy-btn absolute top-2 right-2 btn-outline text-xs">Copy</button>
                  <textarea readOnly value={iframeSnippet} className="h-48 w-full bg-transparent border-none outline-none resize-none p-3 pr-14 font-mono text-xs text-foreground/90" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium">Script embed</div>
                <div className="code-panel">
                  <button onClick={() => copy(scriptSnippet)} className="copy-btn absolute top-2 right-2 btn-outline text-xs">Copy</button>
                  <textarea readOnly value={scriptSnippet} className="h-48 w-full bg-transparent border-none outline-none resize-none p-3 pr-14 font-mono text-xs text-foreground/90" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
