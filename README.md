Pump.fun Livestream Embed Generator

Overview
Generates embeddable Pump.fun livestream players for any token address (mintId). Provides an iframe embed and a script embed, with dynamic aspect handling and optional styling controls (green border, Pump button linking to pump.fun, mute/unmute control). A server-side proxy requests a LiveKit token from Pump and the client plays the stream.

How to run locally
1) Install dependencies
```
pnpm install
```
2) Start the dev server
```
pnpm dev
```
3) Open http://localhost:3000

How to use
1) Go to `/` and enter a Pump token address (mintId)
2) Use the toggles to enable Border, Pump button, and Mute/Unmute controls
3) Copy either the iframe embed or the script embed
4) Paste into your site or CMS. The script embed auto-resizes based on the stream aspect.

Set PUBLIC_BASE_URL to https://www.pumpembed.com
Create `.env.local` or configure your hosting environment:
```
PUBLIC_BASE_URL=https://www.pumpembed.com
```
This value is used when generating snippet URLs.

Donations
SOL: GBqPL7W6rVBnpbdfZ6dWqkkYef5LnaayUESBVWo1Afh8

Author credits
Brian — https://x.com/BrianShiitake
