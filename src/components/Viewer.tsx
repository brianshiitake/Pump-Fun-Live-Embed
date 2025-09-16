"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Room, RoomEvent, RemoteTrack } from "livekit-client";

type Status = "idle" | "connecting" | "connected" | "waiting" | "error";

export default function Viewer({ mintId, embedId, showBorder, showPumpButton, showControls }: { mintId: string; embedId?: string; showBorder?: boolean; showPumpButton?: boolean; showControls?: boolean }) {
  const vref = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const roomRef = useRef<Room | null>(null);
  const aspectTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastDims = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string>("");
  const [muted, setMuted] = useState<boolean>(true);

  const backoffs = useMemo(() => [2000, 5000, 10000], []);
  const reconnectAttempt = useRef<number>(0);
  const stopped = useRef<boolean>(false);

  const cleanup = useCallback(() => {
    try {
      roomRef.current?.disconnect();
    } catch {}
    roomRef.current = null;
    if (aspectTimer.current) {
      clearInterval(aspectTimer.current as any);
      aspectTimer.current = null;
    }
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {}
      audioRef.current = null;
    }
  }, []);

  const postAspect = useCallback(() => {
    const v = vref.current;
    if (!v) return;
    const vw = v.videoWidth || 0;
    const vh = v.videoHeight || 0;
    if (vw > 0 && vh > 0) {
      const aspect = vw / vh;
      if (vw === lastDims.current.w && vh === lastDims.current.h) return;
      lastDims.current = { w: vw, h: vh };
      try {
        window.parent?.postMessage({ type: "pump-embed:aspect", embedId, vw, vh, aspect }, "*");
      } catch {}
    }
  }, [embedId]);

  const attachTrack = useCallback((track: RemoteTrack) => {
    if (track.kind === "video" && vref.current) {
      track.attach(vref.current);
      setStatus("connected");
      const v = vref.current;
      if (v) {
        const onLoaded = () => postAspect();
        v.addEventListener("loadedmetadata", onLoaded, { once: true });
        v.addEventListener("resize", postAspect as any);
        setTimeout(postAspect, 300);
        if (aspectTimer.current) clearInterval(aspectTimer.current as any);
        aspectTimer.current = setInterval(() => postAspect(), 1500);
      }
    }
    if (track.kind === "audio") {
      const a = new Audio();
      a.autoplay = true;
      a.muted = true;
      track.attach(a);
      audioRef.current = a;
      setMuted(true);
    }
  }, [postAspect]);

  const connect = useCallback(async () => {
    setErr("");
    setStatus("connecting");

    const res = await fetch("/api/pump/join", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mintId }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Join failed");
    const data = (await res.json()) as { livekitUrl: string; token: string };

    const room = new Room();
    roomRef.current = room;
    let gotVideo = false;

    room.on(RoomEvent.TrackSubscribed, (track) => {
      attachTrack(track as RemoteTrack);
      if (track.kind === "video") gotVideo = true;
    });

    room.on(RoomEvent.Disconnected, () => {
      if (stopped.current) return;
      setStatus("error");
      setErr("Disconnected");
      const attempt = reconnectAttempt.current++;
      const delay = backoffs[Math.min(attempt, backoffs.length - 1)];
      setTimeout(() => {
        if (!stopped.current) connect().catch(() => {});
      }, delay);
    });

    room.on(RoomEvent.ConnectionStateChanged, (state) => {
      if (state === "connected" && !gotVideo) setStatus("waiting");
    });

    await room.connect(data.livekitUrl, data.token);
  }, [attachTrack, backoffs, mintId]);

  useEffect(() => {
    stopped.current = false;
    reconnectAttempt.current = 0;
    connect().catch((e: any) => {
      setStatus("error");
      setErr(e?.message || "Error");
    });
    return () => {
      stopped.current = true;
      cleanup();
    };
  }, [connect, cleanup]);

  const toggleMute = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    try {
      const next = !a.muted;
      a.muted = next;
      if (!next) a.play().catch(() => {});
      setMuted(a.muted);
    } catch {}
  }, []);

  const borderCls = showBorder ? "border-2 border-[var(--primary)] rounded-xl overflow-hidden" : "";
  return (
    <div className={`w-full h-full bg-black relative grid place-items-center ${borderCls}`}>
      <video ref={vref} className="w-full h-full object-contain bg-black" autoPlay playsInline muted />
      {showPumpButton && (
        <a href={`https://pump.fun/coin/${encodeURIComponent(mintId)}`} target="_blank" rel="noopener noreferrer" className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--primary)] bg-black/60 text-[13px] text-white hover:bg-black/75">
          <span>Watch on</span>
          <img src="/logo.png" alt="Pump.fun" className="h-4 w-auto" />
        </a>
      )}
      {showControls && (
        <button onClick={toggleMute} className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full border border-[var(--border)] bg-white/10 text-white text-sm hover:bg-white/20">
          {muted ? "Unmute" : "Mute"}
        </button>
      )}
      {status !== "connected" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80 px-3 py-2 bg-black/60 rounded">
          {status === "waiting"
            ? "Waiting for host to go live…"
            : status === "connecting"
            ? "Connecting…"
            : status === "error"
            ? `Error: ${err}`
            : ""}
        </div>
      )}
    </div>
  );
}
