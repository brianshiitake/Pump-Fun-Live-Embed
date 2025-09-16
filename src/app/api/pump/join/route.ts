import { NextRequest, NextResponse } from "next/server";
import { PUMP, validateMintId, PumpJoinUpstreamRequest, PumpJoinUpstreamResponse } from "@/lib/pump";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const mintId = validateMintId(body?.mintId);
    if (!mintId) return NextResponse.json({ error: "Invalid mintId" }, { status: 400 });

    const upstreamReq: PumpJoinUpstreamRequest = { mintId, viewer: true };

    async function tryJoin(base: string): Promise<PumpJoinUpstreamResponse | null> {
      try {
        const r = await fetch(`${base}/livestream/join`, {
          method: "POST",
          headers: { "content-type": "application/json", accept: "application/json" },
          body: JSON.stringify(upstreamReq),
          cache: "no-store",
        });
        if (!r.ok) return null;
        const j = (await r.json()) as PumpJoinUpstreamResponse;
        if (!j?.token) return null;
        return j;
      } catch {
        return null;
      }
    }

    const primary = await tryJoin(PUMP.apiUrl);
    const chosen = primary ?? (await tryJoin(PUMP.clientServerUrl));
    if (!chosen) return NextResponse.json({ error: "Join failed" }, { status: 502 });

    const { token, role } = chosen;
    if (!token) return NextResponse.json({ error: "No token" }, { status: 502 });

    return NextResponse.json({ livekitUrl: PUMP.livekitUrl, token, role });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
