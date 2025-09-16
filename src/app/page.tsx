import Generator from "@/components/Generator";
import { getPublicBaseUrl } from "@/lib/pump";

export default function Home() {
  const baseUrl = getPublicBaseUrl();
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-3xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight"><span className="brand-text">Pump.fun</span> Livestream Embed Generator</h1>
        <p className="mt-2 text-sm text-foreground/70">Enter a Pump token address (mintId) to generate embeddable snippets and preview the player.</p>
        <div className="mt-6">
          <Generator baseUrl={baseUrl} />
        </div>
      </div>
    </div>
  );
}
