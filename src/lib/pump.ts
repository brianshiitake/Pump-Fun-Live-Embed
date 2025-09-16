export const PUMP = {
  mainFrontendUrl: "https://pump.fun",
  apiUrl: "https://livestream-api.pump.fun",
  livechatUrl: "wss://livechat.pump.fun",
  clientServerUrl: "https://frontend-api-v3.pump.fun",
  clipsCdnUrl: "https://clips.pump.fun",
  clipCdnUrl: "https://clip.pump.fun",
  livekitUrl: "wss://pump-prod-tg2x8veh.livekit.cloud",
} as const;

export type PumpJoinUpstreamRequest = {
  mintId: string;
  viewer: true;
};

export type PumpJoinUpstreamResponse = {
  token: string;
  role: string;
};

export type ApiJoinRequest = {
  mintId: string;
};

export type ApiJoinResponse = {
  livekitUrl: string;
  token: string;
  role?: string;
};

export function validateMintId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const s = value.trim();
  if (s.length < 10 || s.length > 100) return null;
  const base58 = /^[1-9A-HJ-NP-Za-km-z]+$/;
  if (!base58.test(s)) return null;
  return s;
}

export function getPublicBaseUrl(): string {
  const env = process.env.PUBLIC_BASE_URL;
  if (env && /^https?:\/\//i.test(env)) return env.replace(/\/$/, "");
  const fallback = "http://localhost:3000";
  return fallback;
}
