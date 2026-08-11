import { NextRequest, NextResponse } from 'next/server'
import { pinMatches } from '@/lib/pin'

const PRIVATE_PIN = process.env.PRIVATE_PIN || ''

const PLIST = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.jaywest.agentic-kb-ingest</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/curl</string>
    <string>-s</string>
    <string>-X</string>
    <string>POST</string>{PIN_ARGS}
    <string>http://localhost:3002/api/process/run-all</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>2</integer>
    <key>Minute</key>
    <integer>0</integer>
  </dict>
  <key>StandardOutPath</key>
  <string>/tmp/agentic-kb-ingest.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/agentic-kb-ingest-error.log</string>
</dict>
</plist>`

const INSTALL_SCRIPT = `#!/bin/bash
set -e
PLIST_PATH="$HOME/Library/LaunchAgents/com.jaywest.agentic-kb-ingest.plist"
cat > "$PLIST_PATH" << 'PLIST'
${PLIST}
PLIST
launchctl load "$PLIST_PATH"
echo "✓ Nightly ingest installed - runs at 2:00 AM"
echo "  Plist: $PLIST_PATH"
echo "  Log:   /tmp/agentic-kb-ingest.log"`

export async function GET(request: NextRequest): Promise<NextResponse> {
  // When a PIN is configured the generated plist embeds it (run-all needs it),
  // so this endpoint must itself require the PIN or it would leak the secret
  // to any unauthenticated GET.
  const pin = request.headers.get('x-private-pin') || request.nextUrl.searchParams.get('pin') || ''
  if (PRIVATE_PIN && !pinMatches(pin, PRIVATE_PIN)) {
    return new NextResponse('echo "🔒 PIN required: curl -H \'x-private-pin: <pin>\' .../api/process/schedule/install | bash"; exit 1', {
      status: 401,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
  const pinArgs = PRIVATE_PIN
    ? `\n    <string>-H</string>\n    <string>x-private-pin: ${PRIVATE_PIN}</string>`
    : ''
  return new NextResponse(INSTALL_SCRIPT.replace('{PIN_ARGS}', pinArgs), {
    headers: { 'Content-Type': 'text/plain' },
  })
}
