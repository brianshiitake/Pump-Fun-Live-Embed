import Viewer from "@/components/Viewer";
import { validateMintId } from "@/lib/pump";

export default async function EPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const raw = typeof sp?.mintId === "string" ? sp?.mintId : Array.isArray(sp?.mintId) ? sp?.mintId[0] : undefined;
  const embedId = typeof sp?.embedId === "string" ? sp?.embedId : Array.isArray(sp?.embedId) ? sp?.embedId[0] : undefined;
  const mintId = validateMintId(raw ?? null);

  if (!mintId) {
    return (
      <div className="w-screen h-screen bg-black text-white grid place-items-center">
        <div className="text-sm text-white/80">Missing or invalid mintId</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black">
      <Viewer
        mintId={mintId}
        embedId={embedId}
        showBorder={(sp?.border === "1")}
        showPumpButton={(sp?.pump === "1")}
        showControls={(sp?.controls === "1")}
      />
    </div>
  );
}
