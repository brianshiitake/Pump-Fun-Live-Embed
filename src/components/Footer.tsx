"use client";
import { useCallback } from "react";
import { useToast } from "@/components/Toast";

const solAddress = "GBqPL7W6rVBnpbdfZ6dWqkkYef5LnaayUESBVWo1Afh8";

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path fillRule="evenodd" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.55v-2.1c-3.22.7-3.9-1.55-3.9-1.55-.53-1.35-1.28-1.71-1.28-1.71-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.97.11-.75.4-1.26.72-1.55-2.57-.29-5.28-1.29-5.28-5.75 0-1.27.45-2.31 1.2-3.13-.12-.29-.52-1.47.11-3.06 0 0 .98-.31 3.2 1.19a11.06 11.06 0 0 1 5.82 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.59.23 2.77.11 3.06.75.82 1.2 1.86 1.2 3.13 0 4.47-2.71 5.45-5.3 5.73.41.35.78 1.04.78 2.11v3.12c0 .31.21.67.8.55A11.5 11.5 0 0 0 12 .5Z" clipRule="evenodd"/>
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2H21.5l-7.5 8.57L23.5 22h-6.5l-5.09-6.1L5.9 22H2.64l8.04-9.17L1.5 2h6.64l4.57 5.39L18.244 2Zm-2.277 18h2.1L8.172 4h-2.1l9.895 16Z"/>
    </svg>
  );
}

export default function Footer() {
  const { show } = useToast();

  const copySol = useCallback(async () => {
    await navigator.clipboard.writeText(solAddress);
    show("SOL address copied");
  }, [show]);

  return (
    <footer className="mt-10 mb-8">
      <div className="card p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="text-sm text-foreground/80">Donate</div>
            <div className="font-mono text-xs sm:text-sm break-all">{solAddress}</div>
            <button onClick={copySol} className="btn-outline text-xs">Copy</button>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/brianshiitake/Pump-Fun-Live-Embed" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-sky-400 hover:underline">
              <GitHubIcon className="h-4 w-4" />
              <span>Source Code</span>
            </a>
            <a href="https://x.com/BrianShiitake" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-sky-400 hover:underline">
              <XIcon className="h-4 w-4" />
              <span>Brian's X</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
