import { NextRequest, NextResponse } from "next/server";
import { PUMP, validateMintId, PumpJoinUpstreamRequest, PumpJoinUpstreamResponse } from "@/lib/pump";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const mintId = validateMintId(body?.mintId);
    if (!mintId) return NextResponse.json({ error: "Invalid mintId" }, { status: 400 });

    const upstreamReq: PumpJoinUpstreamRequest = { mintId, viewer: true };

    const joinRes = await fetch(`${PUMP.apiUrl}/livestream/join`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(upstreamReq),
      cache: "no-store",
    });

    if (!joinRes.ok) {
      return NextResponse.json({ error: "Join failed" }, { status: 502 });
    }

    const { token, role } = (await joinRes.json()) as PumpJoinUpstreamResponse;
    if (!token) return NextResponse.json({ error: "No token" }, { status: 502 });

    return NextResponse.json({ livekitUrl: PUMP.livekitUrl, token, role });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
