import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('web package.json dev port defaults to 3002', () => {
  const pkgPath = path.resolve(__dirname, '../web/package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  assert.match(pkg.scripts.dev, /-p 3002/, 'dev script should use port 3002');
});

test('daily-lint default port matches 3002', () => {
  const scriptPath = path.resolve(__dirname, '../scripts/daily-lint.sh');
  const script = fs.readFileSync(scriptPath, 'utf8');
  assert.match(script, /KB_PORT:-3002/, 'daily-lint.sh should default to port 3002');
});

test('refusal message contains override guidance in CLI and MCP', () => {
  const cliPath = path.resolve(__dirname, '../cli/kb.js');
  const cliContent = fs.readFileSync(cliPath, 'utf8');
  assert.ok(
    cliContent.includes('Set KB_API_URL to override.'),
    'CLI error message should guide user to set KB_API_URL'
  );

  const mcpPath = path.resolve(__dirname, '../mcp/server.js');
  if (fs.existsSync(mcpPath)) {
    const mcpContent = fs.readFileSync(mcpPath, 'utf8');
    assert.ok(
      mcpContent.includes('Set KB_API_URL to override.'),
      'MCP error message should guide user to set KB_API_URL'
    );
  }
});

