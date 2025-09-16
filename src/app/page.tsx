import Generator from "@/components/Generator";
import Footer from "@/components/Footer";
import { getPublicBaseUrl } from "@/lib/pump";
import { headers } from "next/headers";

export default async function Home() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const inferred = host ? `${proto}://${host}` : null;
  const baseUrl = inferred || getPublicBaseUrl();
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-3xl p-6 sm:p-8">
        <div className="mb-5 promo-banner px-4 py-2 text-sm flex items-center gap-3" role="banner">
          <span className="promo-dot" aria-hidden />
          <em>
            Ad: Fund wallets from CEX for launches using WenSwap 🌱 Seed Mode. -
            <a className="ml-1 promo-link" href="https://link.wen.bot/pumpembed" target="_blank" rel="noopener noreferrer">Click here to try</a>
          </em>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight"><span className="brand-text">Pump.fun</span> Livestream Embed Generator</h1>
        <p className="mt-2 text-sm text-foreground/70">Enter a Pump token address (mintId) to generate embeddable snippets and preview the player.</p>
        <div className="mt-6">
          <Generator baseUrl={baseUrl} />
        </div>
        <Footer />
      </div>
    </div>
  );
}
