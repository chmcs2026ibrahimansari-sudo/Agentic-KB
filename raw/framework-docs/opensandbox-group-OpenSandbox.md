---
title: "opensandbox-group/OpenSandbox"
source_url: "https://github.com/opensandbox-group/OpenSandbox"
captured: 2026-08-18T23:09:03-0700
captured_by: hermes-agentic-kb-scout
word_count: 11831
status: unprocessed
---

Source note: Apple Notes 2026-08-16: agent sandbox/runtime; evaluate for MissionControl safe execution and worker isolation patterns.
Extraction method: github-api-readme-docs
Extraction attempts: repo-api:200; readme-api:200; llms.txt:miss; docs/llms.txt:miss; docs/LLMS.txt:miss; docs/README.md:hit; docs/readme.md:miss; docs/index.md:hit; docs/overview.md:miss; docs/guides/credential-vault.md:hit; docs/guides/secure-container.md:hit; docs/community/release-verification.md:hit; docs/examples/code-interpreter.md:hit; docs/examples/aio-sandbox.md:hit; docs/examples/agent-sandbox.md:hit; docs/examples/docker-pvc-volume-mount.md:hit; docs/examples/docker-ossfs-volume-mount.md:hit

# GitHub Repository: opensandbox-group/OpenSandbox

Source: https://github.com/opensandbox-group/OpenSandbox
Description: Secure, Fast, and Extensible Sandbox runtime for AI agents.
Default branch: main
Stars: 14290
Forks: 1260
License: Apache-2.0


# README

<div align="center">
  <img src="docs/public/images/logo.svg" alt="OpenSandbox logo" width="150" />

  <h1>OpenSandbox</h1>

  <p align="center">
    <a href="https://trendshift.io/repositories/21828" target="_blank"><img src="https://trendshift.io/api/badge/repositories/21828" alt="opensandbox-group%2FOpenSandbox | Trendshift" style="width: 320px; height: 70px;" width="320" height="70" /></a>
  </p>

<p align="center">
  <a href="https://github.com/opensandbox-group/OpenSandbox"><img src="https://img.shields.io/github/stars/opensandbox-group/OpenSandbox?style=flat-square&logo=github&logoColor=white&label=Stars&color=181717" alt="Stars" /></a>
  <a href="https://www.bestpractices.dev/projects/12588"><img src="https://img.shields.io/badge/OpenSSF-Best-4C566A?style=flat-square" alt="OpenSSF Best Practices" /></a>
  <a href="https://landscape.cncf.io/?item=orchestration-management--scheduling-orchestration--opensandbox"><img src="https://img.shields.io/badge/CNCF-Landscape-0C66E4?style=flat-square" alt="CNCF Landscape" /></a>
  <a href="https://discord.gg/g7FuPs8YeD"><img src="https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Discord" /></a>
  <a href="https://qr.dingtalk.com/action/joingroup?code=v1,k1,A4Bgl5q1I1eNU/r33D18YFNrMY108aFF38V+r19RJOM=&_dt_no_comment=1&origin=11"><img src="https://img.shields.io/badge/DingTalk-Join-0089FF?style=flat-square" alt="DingTalk" /></a>
  <a href="https://github.com/opensandbox-group/OpenSandbox/actions"><img src="https://img.shields.io/github/actions/workflow/status/opensandbox-group/OpenSandbox/real-e2e.yml?branch=main&label=TEST&style=flat-square&logo=github&logoColor=white" alt="E2E Status" /></a>
  <a href="https://github.com/opensandbox-group/OpenSandbox/actions"><img src="https://img.shields.io/github/actions/workflow/status/opensandbox-group/OpenSandbox/kubernetes-nightly-build.yml?branch=main&label=K8S&style=flat-square&logo=kubernetes&logoColor=white" alt="Kubernetes nightly build status" /></a>
</p>

  <hr />
</div>

OpenSandbox is a **general-purpose sandbox platform** for AI applications, offering multi-language SDKs, unified sandbox APIs, and Docker/Kubernetes runtimes for scenarios like Coding Agents, GUI Agents, Agent Evaluation, AI Code Execution, and RL Training.

## Features

- 🧩 **SDKs, CLI, and MCP**: Provides multi-language SDKs, the osb CLI, and MCP server integration for sandbox creation, command execution, and file operations. See [SDKs](#sdks), [CLI](#cli), and [MCP](#mcp).
- 📜 **Sandbox Protocol**: Defines sandbox lifecycle management APIs and sandbox execution APIs so you can extend custom sandbox runtimes. See [API specs](specs/README.md).
- 🚀 **Sandbox Runtime**: Built-in lifecycle management supporting Docker and high-performance Kubernetes runtime, enabling both local runs and large-scale distributed scheduling. See [Kubernetes runtime](./kubernetes).
- 🖥️ **Sandbox Environments**: Built-in Command, Filesystem, and Code Interpreter implementations. Examples cover Coding Agents (e.g., Claude Code), browser automation (Chrome, Playwright), and desktop environments (VNC, VS Code).
- 🚦 **Network Policy**: Unified ingress gateway with multiple routing strategies plus per-sandbox egress controls. See [Ingress Gateway](components/ingress) and [egress controls](components/egress).
- 🔑 **Credential Vault**: Secure credential injection for sandbox outbound requests without exposing real secrets to workloads. See [Credential Vault](docs/guides/credential-vault.md).
- 🏰 **Strong Isolation**: Supports secure container runtimes like gVisor, Kata Containers, and Firecracker microVM for enhanced isolation between sandbox workloads and the host. See [Secure Container Runtime Guide](docs/guides/secure-container.md) for details.

## Official Container Images

OpenSandbox release images are published under the same component name in
three official registries:

- Docker Hub: `docker.io/opensandbox/<component>`
- GitHub Container Registry: `ghcr.io/opensandbox-group/opensandbox/<component>`
- Alibaba Cloud Container Registry: `sandbox-registry.cn-zhangjiakou.cr.aliyuncs.com/opensandbox/<component>`

Tagged release images are signed keylessly with Cosign and include provenance
attestations. Pin production images by digest and follow the
[release verification guide](docs/community/release-verification.md) to verify
the image against the OpenSandbox GitHub Actions identity before deployment.

## SDKs

Python:

```bash
pip install opensandbox
```

Java/Kotlin (Gradle Kotlin DSL):

```kotlin
dependencies {
    implementation("com.alibaba.opensandbox:sandbox:{latest_version}")
}
```

Java/Kotlin (Maven):

```xml
<dependency>
    <groupId>com.alibaba.opensandbox</groupId>
    <artifactId>sandbox</artifactId>
    <version>{latest_version}</version>
</dependency>
```

JavaScript/TypeScript:

```bash
npm install @alibaba-group/opensandbox
```

C#/.NET:

```bash
dotnet add package Alibaba.OpenSandbox
```

Go:

```bash
go get github.com/alibaba/OpenSandbox/sdks/sandbox/go
```

## CLI

OpenSandbox also provides `osb`, a terminal CLI for the common sandbox workflow: create sandboxes, run commands, move files, inspect diagnostics, and manage runtime egress policy.

Install:

```bash
pip install opensandbox-cli
# or
uv tool install opensandbox-cli
```

Quick start:

```bash
osb config init
osb config set connection.domain localhost:8080
osb config set connection.protocol http
osb config set connection.api_key <your-api-key>
osb sandbox create --image python:3.12 --timeout 30m -o json
osb command run <sandbox-id> -o raw -- python -c "print(1 + 1)"
```

See the [CLI README](cli/README.md) for the full command reference.

## MCP

The OpenSandbox MCP server exposes sandbox creation, command execution, and text file operations to MCP-capable clients such as Claude Code and Cursor.

Install and run:

```bash
pip install opensandbox-mcp
opensandbox-mcp --domain localhost:8080 --protocol http
```

Minimal stdio config:

```json
{
  "mcpServers": {
    "opensandbox": {
      "command": "opensandbox-mcp",
      "args": ["--domain", "localhost:8080", "--protocol", "http"]
    }
  }
}
```

See the [MCP README](sdks/mcp/sandbox/python/README.md) for client-specific setup.

## Getting Started

Requirements:

- Docker (required for local execution)
- Python 3.10+ (required for examples and local runtime)

### Install and Configure the Sandbox Server

```bash
uvx opensandbox-server init-config ~/.sandbox.toml --example docker

uvx opensandbox-server

# Show help
# uvx opensandbox-server -h
```

### Create a Code Interpreter and Execute Commands/Codes

Install the Code Interpreter SDK

```bash
uv pip install opensandbox-code-interpreter
```

Create a sandbox and execute commands and codes.

```python
import asyncio
from datetime import timedelta

from code_interpreter import CodeInterpreter, SupportedLanguage
from opensandbox import Sandbox
from opensandbox.models import WriteEntry

async def main() -> None:
    # 1. Create a sandbox
    sandbox = await Sandbox.create(
        "opensandbox/code-interpreter:v1.1.0",
        entrypoint=["/opt/code-interpreter/code-interpreter.sh"],
        env={"PYTHON_VERSION": "3.11"},
        timeout=timedelta(minutes=10),
    )

    async with sandbox:

        # 2. Execute a shell command
        execution = await sandbox.commands.run("echo 'Hello OpenSandbox!'")
        print(execution.logs.stdout[0].text)

        # 3. Write a file
        await sandbox.files.write_files([
            WriteEntry(path="/tmp/hello.txt", data="Hello World", mode=644)
        ])

        # 4. Read a file
        content = await sandbox.files.read_file("/tmp/hello.txt")
        print(f"Content: {content}") # Content: Hello World

        # 5. Create a code interpreter
        interpreter = await CodeInterpreter.create(sandbox)

        # 6. Execute Python code (single-run, pass language directly)
        result = await interpreter.codes.run(
              """
                  import sys
                  print(sys.version)
                  result = 2 + 2
                  result
              """,
              language=SupportedLanguage.PYTHON,
        )

        print(result.result[0].text) # 4
        print(result.logs.stdout[0].text) # 3.11.14

        # 7. Cleanup the sandbox
        await sandbox.kill()

if __name__ == "__main__":
    asyncio.run(main())
```

### More Examples

OpenSandbox provides examples covering SDK usage, agent integrations, browser automation, and training workloads. All example code is located in the `examples/` directory.

#### 🎯 Basic Examples

- **[code-interpreter](docs/examples/code-interpreter.md)** - End-to-end Code Interpreter SDK workflow in a sandbox.
- **[aio-sandbox](docs/examples/aio-sandbox.md)** - All-in-One sandbox setup using the OpenSandbox SDK.
- **[agent-sandbox](docs/examples/agent-sandbox.md)** - Example integration for running OpenSandbox workloads on Kubernetes with [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox).
- **Volumes** — [Docker PVC / named volumes](docs/examples/docker-pvc-volume-mount.md), [Docker OSSFS](docs/examples/docker-ossfs-volume-mount.md), [Kubernetes PVC](docs/examples/kubernetes-pvc-volume-mount.md): persistent and shared storage patterns.

#### 🤖 Coding Agent Integrations

- **Coding CLIs** — [Claude Code](docs/examples/claude-code.md), [Gemini CLI](docs/examples/gemini-cli.md), [OpenAI Codex CLI](docs/examples/codex-cli.md), [OpenCode](docs/examples/opencode.md), [Qwen Code](docs/examples/qwen-code.md), [Kimi CLI](docs/examples/kimi-cli.md): run each CLI inside OpenSandbox.
- **[langgraph](docs/examples/langgraph.md)** - LangGraph state-machine workflow that creates/runs a sandbox job with fallback retry.
- **[google-adk](docs/examples/google-adk.md)** - Google ADK agent using OpenSandbox tools to write/read files and run commands.
- **[openclaw](docs/examples/openclaw.md)** - Launch an OpenClaw Gateway inside a sandbox.

#### 🌐 Browser and Desktop Environments

- **[chrome](docs/examples/chrome.md)** - Chromium sandbox with VNC and DevTools access for automation and debugging.
- **[playwright](docs/examples/playwright.md)** - Playwright + Chromium headless scraping and testing example.
- **[desktop](docs/examples/desktop.md)** - Full desktop environment in a sandbox with VNC access.
- **[vscode](docs/examples/vscode.md)** - code-server (VS Code Web) running inside a sandbox for remote dev.

#### 🧠 Training and Evaluation

- **[harbor-evaluation](docs/examples/harbor-evaluation.md)** - Run a [Harbor](https://github.com/harbor-framework/harbor) agent evaluation on OpenSandbox, one sandbox per trial.

For more details, please refer to the [examples documentation](docs/examples/index.md).

## Project Structure

| Directory | Description                                                      |
|-----------|------------------------------------------------------------------|
| [`sdks/`](sdks/) | Multi-language SDKs (Python, Java/Kotlin, TypeScript/JavaScript, C#/.NET) |
| [`specs/`](specs/README.md) | OpenAPI specs and lifecycle specifications                      |
| [`server/`](server/README.md) | Python FastAPI sandbox lifecycle server                          |
| [`cli/`](cli/README.md) | OpenSandbox command-line interface                               |
| [`kubernetes/`](kubernetes/README.md) | Kubernetes deployment and examples                               |
| [`components/execd/`](components/execd/README.md) | Sandbox execution daemon (commands and file operations)          |
| [`components/ingress/`](components/ingress/README.md) | Sandbox traffic ingress proxy                                    |
| [`components/egress/`](components/egress/README.md) | Sandbox network egress control                                   |
| [`sandboxes/`](sandboxes/) | Runtime sandbox implementations                                   |
| [`examples/`](examples/) | Runnable example code                                            |
| [`docs/examples/`](docs/examples/index.md) | Example documentation and use cases                              |
| [`oseps/`](oseps/README.md) | OpenSandbox Enhancement Proposals                                |
| [`docs/`](docs/) | Architecture and design documentation                            |
| [`tests/`](tests/) | Cross-component E2E tests                                        |
| [`scripts/`](scripts/) | Development and maintenance scripts                              |

For detailed architecture, see [Architecture](docs/architecture/).

## Documentation

- [Architecture](docs/architecture/) – Overall architecture & design philosophy
- [Credential Vault](docs/guides/credential-vault.md) - Credential Vault credential injection guide
- [Release Verification](docs/community/release-verification.md) - Release signing and artifact verification
- [oseps/README.md](oseps/README.md) – OpenSandbox Enhancement Proposals
- SDK
  - Sandbox base SDK ([Java/Kotlin SDK](sdks/sandbox/kotlin/README.md), [Python SDK](sdks/sandbox/python/README.md), [JavaScript/TypeScript SDK](sdks/sandbox/javascript/README.md), [C#/.NET SDK](sdks/sandbox/csharp/README.md)), [Go SDK](sdks/sandbox/go/README.md) - includes sandbox lifecycle, command execution, file operations
  - Code Interpreter SDK ([Java/Kotlin SDK](sdks/sandbox/kotlin/code-interpreter/README.md), [Python SDK](sdks/code-interpreter/python/README.md), [JavaScript/TypeScript SDK](sdks/code-interpreter/javascript/README.md), [C#/.NET SDK](sdks/code-interpreter/csharp/README.md)) - code interpreter
- [cli/README.md](cli/README.md) - OpenSandbox CLI installation and command reference
- [sdks/mcp/sandbox/python/README.md](sdks/mcp/sandbox/python/README.md) - MCP server installation and client setup
- [specs/README.md](specs/README.md) - OpenAPI definitions for sandbox lifecycle API and sandbox execution API
- [server/README.md](server/README.md) - Sandbox server startup and configuration; supports Docker and Kubernetes runtimes
- [ROADMAP.md](ROADMAP.md) - Lightweight project roadmap and planning process

## License

This project is open source under the [Apache 2.0 License](LICENSE).

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the current project roadmap, planning scope,
and how roadmap items are managed.

## Contact and Discussion

- Issues: Submit bugs, feature requests, or design discussions through GitHub Issues
- Discord: Join the [OpenSandbox Discord community](https://discord.gg/g7FuPs8YeD)
- DingTalk: Join the [OpenSandbox technical discussion group](https://qr.dingtalk.com/action/joingroup?code=v1,k1,A4Bgl5q1I1eNU/r33D18YFNrMY108aFF38V+r19RJOM=&_dt_no_comment=1&origin=11)

## Star History

[![Star History Chart](https://star-history.dera.page/svg?repos=opensandbox-group/OpenSandbox&type=date&legend=top-left)](https://star-history.dera.page/#opensandbox-group/OpenSandbox&type=date&legend=top-left)

# docs/README.md

# OpenSandbox Docs Site

This directory hosts the VitePress site for OpenSandbox.

## Local development

```bash
nvm use 22
cd docs
pnpm install
pnpm docs:dev
```

## Build

```bash
nvm use 22
cd docs
pnpm install
pnpm docs:build
```

## Notes

- Site content is maintained directly under `docs/` — not auto-generated from monorepo READMEs.
- See `AGENTS.md` → "Documentation Rules" for content ownership and conventions.

# docs/index.md

---
layout: home

hero:
  name: OpenSandbox
  text: Universal Sandbox Infrastructure for AI Applications
  tagline: Securely run commands, code interpreters, browsers, and developer tools in isolated environments with multi-language SDKs.
  actions:
    - theme: brand
      text: Quick Start
      link: /getting-started/
    - theme: alt
      text: Architecture
      link: /architecture/
    - theme: alt
      text: SDKs
      link: /sdks/

features:
  - title: Sandbox Lifecycle Management
    details: Provision, monitor, renew, pause/resume, and terminate sandbox instances with Docker and Kubernetes runtimes.
  - title: Multi-Language SDKs
    details: Build with Python, Java/Kotlin, JavaScript/TypeScript, C#/.NET, and Go SDKs on top of standardized lifecycle and execution protocols.
  - title: In-Sandbox Execution
    details: Execute shell commands, manage files, run multi-language code interpreters, expose ports, and stream logs and metrics.
  - title: Built for AI Workloads
    details: Supports coding agents, browser automation, remote development, code execution, and reinforcement learning scenarios.
---

## Typical Scenarios

OpenSandbox is listed in the [CNCF Landscape](https://landscape.cncf.io/?item=orchestration-management--scheduling-orchestration--opensandbox).

<div class="scenario-grid">
  <a class="scenario-card" href="/examples/claude-code">
    <h3>Coding Agents</h3>
    <p>Run Claude Code, Gemini CLI, Codex, and other coding agents in isolated sandboxes.</p>
  </a>
  <a class="scenario-card" href="/examples/playwright">
    <h3>Browser Automation</h3>
    <p>Execute Chrome and Playwright workloads with controlled runtime, filesystem, and networking.</p>
  </a>
  <a class="scenario-card" href="/examples/vscode">
    <h3>Remote Development</h3>
    <p>Host VS Code Web and desktop-like environments for secure cloud development workflows.</p>
  </a>
  <a class="scenario-card" href="/examples/code-interpreter">
    <h3>AI Code Execution</h3>
    <p>Run model-generated code safely, stream outputs, and iterate quickly with reproducible environments.</p>
  </a>
</div>

Explore all examples in [Examples](/examples/).

## Quick Install

::: code-group

```bash [Python SDK]
pip install opensandbox
```

```bash [JavaScript SDK]
npm install @alibaba-group/opensandbox
```

```kotlin [Kotlin (Gradle)]
dependencies {
    implementation("com.alibaba.opensandbox:sandbox:{latest_version}")
}
```

```bash [Go SDK]
go get github.com/alibaba/OpenSandbox/sdks/sandbox/go
```

```bash [C# SDK]
dotnet add package Alibaba.OpenSandbox
```

:::

See [Getting Started](/getting-started/) for the full setup guide.

# docs/guides/credential-vault.md

---
title: Credential Vault
description: Secure credential injection for sandbox outbound requests without exposing secrets to workloads.
---

# Credential Vault

Credential Vault is OpenSandbox's outbound credential broker for sandboxed agents and developer tools. Real credentials are written to the egress sidecar by the host-side SDK, while the sandbox process only receives fake or empty credential values. When tools such as Claude Code, Git, curl, package managers, or model API clients make allowed outbound HTTPS requests, the sidecar matches the request against Credential Vault bindings and injects the required authentication headers on the way out. This lets existing tools keep their normal workflows while keeping real secrets out of the sandbox environment, command line, filesystem, and logs, reducing credential exfiltration risk from prompt injection or untrusted code.

## Requirements

- `opensandbox-server` >= 0.2.0
- `egress` >= 1.1.1
- Python SDK >= 0.1.11
- JavaScript/TypeScript SDK >= 0.1.9
- Kotlin SDK >= 1.0.13
- Go SDK >= 1.0.3
- C# SDK >= 0.1.3
- Server config sets `[egress].image`.
- Server config sets `[egress].mode = "dns+nft"`. Credential Vault refuses to
  activate in DNS-only mode because direct-IP connections can bypass DNS policy.
- Sandbox create request includes an outbound network policy.
- The outbound network policy should use `defaultAction="deny"` and explicitly
  allow every host referenced by a credential binding. Default-allow remains
  temporarily supported for backward compatibility but emits a security warning.
- Sandbox create request enables Credential Proxy.
- Sandbox pods are not running with an additional transparent service-mesh sidecar (for example Istio/Envoy injection) in the same network namespace. Credential Vault currently assumes the OpenSandbox egress sidecar is the only transparent outbound interception layer in the pod.
- The sandbox image has the tools you want to run. For Claude Code, use an image
  with Node.js and npm, such as the OpenSandbox code-interpreter image.

::: warning Migration notice
Credential Proxy still requires server `[egress].mode = "dns+nft"`; deployments
that cannot provide nft enforcement cannot safely enable credential injection.
Default-allow policies remain accepted during the compatibility period, but emit
a security warning and should migrate to `defaultAction="deny"` before enforcement
is tightened in a future release.
:::

## How It Works

![Credential Vault request flow](../public/images/credential-vault.png)

Credential Vault is implemented by the egress sidecar. A sandbox must be created
with both an outbound `network_policy` / `networkPolicy` and Credential Proxy
enabled. The lifecycle API field name is `credentialProxy.enabled`; SDKs expose
that field using their language-specific naming conventions.

At a high level:

1. The lifecycle server attaches the egress sidecar to the sandbox.
2. The SDK writes credentials and bindings to the sidecar Credential Vault API.
3. The sandbox process runs with fake or empty credential environment variables.
4. When the sandbox makes an HTTPS request, transparent MITM in the sidecar
   inspects the request metadata.
5. If exactly one binding matches the request scheme, host, port, method, and
   path, the sidecar injects the configured auth header and scoped placeholder
   substitutions.
6. Secret values are redacted from vault responses and response headers.

Requests that do not match any credential binding are forwarded unchanged.
Credential path-safety checks apply only after a binding matches and the request
would otherwise receive credentials.

The active vault used by the MITM process is served over a local Unix domain
socket inside the sidecar. The sandbox workload cannot fetch this active state
over the normal server proxy path.

## Persistence Across Pause and Resume

::: warning In-memory state
Credential Vault entries are process-local memory in the egress sidecar; they
are not part of the sandbox root filesystem or the `BatchSandbox` Pod template.
Kubernetes pause deletes the Pod after snapshotting, so the fresh egress
sidecar created by resume starts with an empty vault. Credential injection does
not resume until a trusted client creates the credentials and bindings again.

Keep the original vault request or an equivalent secret-manager reference in a
trusted control plane outside the sandbox. After the sandbox returns to
`Running`, call the Credential Vault create API again before allowing work that
depends on those credentials. Do not persist real credential values in sandbox
metadata, environment variables, snapshots, or logs.

Docker pause/unpause retains the existing container processes, but any egress
sidecar replacement or restart also creates a new in-memory vault and requires
the same re-injection procedure.
:::

## Service Mesh Compatibility

Credential Vault depends on the egress sidecar's transparent redirect and MITM path. If the sandbox pod is also injected with a transparent service-mesh sidecar such as Istio/Envoy, both layers will try to intercept outbound traffic in the same network namespace. OpenSandbox does not currently support that combination for Credential Vault.

Use one of these operator patterns instead:

- disable mesh sidecar injection for sandbox pods that need Credential Vault
- keep mesh injection enabled, but do not enable `credentialProxy` / Credential Vault for those pods
- move outbound policy and credential handling to a platform mechanism outside the sandbox pod if mesh injection is mandatory

For the underlying egress-sidecar limitation, see [Egress](/components/egress#service-mesh-compatibility).

Credential bindings are intentionally precise. A default-deny egress policy is
required. Use a narrow path match, for example `/v1/*` for Anthropic API calls.

## Auth Types

Each binding uses an `auth` rule to describe how the referenced credential is
rendered into the outbound request:

- `bearer`: injects `Authorization: Bearer <credential>`.
- `basic`: injects `Authorization: Basic <credential>`. The credential value
  must already be base64-encoded `username:password`.
- `apiKey`: injects the credential value into the configured header name.
- `customHeaders`: injects multiple configured headers, each backed by its own
  credential.
- `passthrough`: does not inject an auth header. Use it with `substitutions`
  when the upstream API requires a credential in a path, query string, or body
  placeholder instead of a header.

Simple examples:

```python
auth={"type": "bearer", "credential": "github-token"}
```

```http
Authorization: Bearer <github-token>
```

```python
auth={"type": "basic", "credential": "registry-basic"}
```

```http
Authorization: Basic <base64(username:password)>
```

```python
auth={"type": "apiKey", "name": "x-api-key", "credential": "anthropic-api-key"}
```

```http
x-api-key: <anthropic-api-key>
```

```python
auth={
    "type": "customHeaders",
    "headers": [
        {"name": "X-Client-Id", "credential": "client-id"},
        {"name": "X-Client-Secret", "credential": "client-secret"},
    ],
}
```

```http
X-Client-Id: <client-id>
X-Client-Secret: <client-secret>
```

### Scoped Placeholder Substitutions

Some upstream APIs require credentials in a request URL or body instead of a
dedicated auth header. Credential Vault can handle those APIs without placing the
real credential in the sandbox process. All auth types accept an optional
`substitutions` list. Each substitution names a credential, a literal
placeholder, and the request surfaces where replacement is allowed:

```python
auth={
    "type": "passthrough",
    "substitutions": [
        {
            "credential": "client-secret",
            "placeholder": "__client_secret__",
            "in": ["body", "query"],
        }
    ],
}
```

Use `type="passthrough"` when the binding only performs substitutions and should
not inject an auth header. You can also combine substitutions with `bearer`,
`basic`, `apiKey`, or `customHeaders` when the same upstream request needs both
header injection and placeholder replacement.

Substitution is disabled by default and is exact, literal, and case-sensitive.
Only the configured surfaces are rewritten:

| Surface | Behavior |
| --- | --- |
| `path` | Replaces placeholders in the request path and URL-encodes the credential value. If the rewritten path contains ambiguous path segments, encoded separators, or traversal-like content, the sidecar rejects the request instead of forwarding a secret-bearing URL outside the matched scope. |
| `query` | Replaces placeholders in the query string and URL-encodes the credential value. |
| `header` | Replaces placeholders in the original request headers, excluding hop-by-hop and security-sensitive headers such as `Host`, `Content-Length`, and forwarding headers. Substitutions run before Credential Vault injects auth headers, so the sidecar does not rewrite the credential headers it creates. |
| `body` | Replaces placeholders in UTF-8 request bodies. For `application/json`, the replacement is encoded as JSON string contents, so put the placeholder inside a quoted JSON string. For `application/x-www-form-urlencoded`, the replacement is form-encoded. Compressed and multipart bodies are skipped. |

The sidecar applies all replacements for a surface against the original request
text in one pass. Inserted credential values are not scanned again for later
placeholders, which prevents one secret from accidentally rewriting another
secret. When a body is rewritten, the sidecar updates `Content-Length` and
removes `Transfer-Encoding` because the forwarded request now has a fixed-size
buffered body.

The placeholder, raw credential value, URL-encoded value, form-encoded value,
and JSON-escaped values are added to the active redaction set. A binding with
substitutions that matched the request but did not find any placeholder emits a
substitution-miss log without exposing credential values.

Example configuration:

```python
await sandbox.credential_vault.create(
    credentials=[
        Credential(name="tenant-id", source={"value": "tenant 42"}),
        Credential(name="api-key", source={"value": "query secret+value"}),
        Credential(name="client-secret", source={"value": 'body "secret" value'}),
    ],
    bindings=[
        CredentialBinding(
            name="token-request",
            match={
                "schemes": ["https"],
                "hosts": ["api.example.com"],
                "methods": ["POST"],
                "paths": ["/tenants/__tenant_id__/token"],
            },
            auth={
                "type": "passthrough",
                "substitutions": [
                    {
                        "credential": "tenant-id",
                        "placeholder": "__tenant_id__",
                        "in": ["path"],
                    },
                    {
                        "credential": "api-key",
                        "placeholder": "__api_key__",
                        "in": ["query"],
                    },
                    {
                        "credential": "client-secret",
                        "placeholder": "__client_secret__",
                        "in": ["body"],
                    },
                ],
            },
        )
    ],
)
```

The sandbox can use placeholders instead of real secrets:

```bash
curl -X POST \
  "https://api.example.com/tenants/__tenant_id__/token?api_key=__api_key__" \
  -H "content-type: application/json" \
  --data '{"client_secret":"__client_secret__"}'
```

The upstream receives the rewritten request:

```http
POST /tenants/tenant%2042/token?api_key=query%20secret%2Bvalue HTTP/1.1
content-type: application/json

{"client_secret":"body \"secret\" value"}
```

## Egress Sidecar Configuration

| Environment variable | Default | Description |
| --- | --- | --- |
| `OPENSANDBOX_EGRESS_CREDENTIAL_VAULT_REQUIRE_TLS` | off | When enabled (`true`/`1`/`on`), credential vault write operations (create, patch, delete) require TLS, loopback transport, or `X-Forwarded-Proto: https` from a configured trusted proxy. When disabled (default), any authenticated request is accepted regardless of transport. Enable this in deployments where the egress sidecar is directly reachable from untrusted networks without a TLS-terminating reverse proxy. |
| `OPENSANDBOX_EGRESS_CREDENTIAL_VAULT_TRUSTED_PROXY_CIDRS` | empty | Comma-separated IP addresses or CIDRs allowed to assert `X-Forwarded-Proto: https`. Forwarded transport headers from all other peers are ignored. Configure this when TLS terminates at a reverse proxy before the egress sidecar. |


## SDK Quick Reference

All sandbox SDKs use the same wire contract. The main differences are naming and
language style:

| SDK | Enable proxy on sandbox create | Vault entry point | Create / patch methods |
| --- | --- | --- | --- |
| Python | `credential_proxy=CredentialProxyConfig(enabled=True)` | `sandbox.credential_vault` | `create(...)`, `patch(...)` |
| Go | `CredentialProxy: &opensandbox.CredentialProxyConfig{Enabled: true}` | `sandbox.CredentialVault(ctx)` or sandbox helpers | `CreateCredentialVault(ctx, req)`, `PatchCredentialVault(ctx, req)` |
| JavaScript/TypeScript | `credentialProxy: { enabled: true }` | `sandbox.credentialVault` | `create(request)`, `patch(request)` |
| Kotlin/JVM | `.credentialProxyEnabled(true)` or `.credentialProxy { enabled(true) }` | `sandbox.credentialVault()` | `create(request)`, `patch(request)` |
| C#/.NET | `CredentialProxy = new CredentialProxyConfig { Enabled = true }` | `sandbox.CredentialVault` or sandbox helpers | `CreateCredentialVaultAsync(...)`, `PatchCredentialVaultAsync(...)` |

The vault APIs return sanitized metadata. Plaintext credential values are
write-only and are not returned by `get`, `list`, or patch responses.

## Claude Code With Anthropic

This example installs Claude Code in the sandbox and calls the official
Anthropic API endpoint. The real API key is read on the host and written to
Credential Vault. The sandbox only sees a fake `ANTHROPIC_API_KEY`.

Before running the script:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
# Optional: export ANTHROPIC_MODEL="<a Claude Code supported Anthropic model>"
```

Run:

```python
import os
from datetime import timedelta

from opensandbox import SandboxSync
from opensandbox.models.sandboxes import (
    Credential,
    CredentialBinding,
    CredentialProxyConfig,
    NetworkPolicy,
    NetworkRule,
    SandboxImageSpec,
)


ANTHROPIC_HOST = "api.anthropic.com"
ANTHROPIC_BASE_URL = "https://api.anthropic.com"
REAL_API_KEY = os.environ["ANTHROPIC_API_KEY"]


sandbox_env = {
    "ANTHROPIC_BASE_URL": ANTHROPIC_BASE_URL,
    "ANTHROPIC_API_KEY": "fake-key-inside-sandbox",
}
if os.getenv("ANTHROPIC_MODEL"):
    sandbox_env["ANTHROPIC_MODEL"] = os.environ["ANTHROPIC_MODEL"]


sandbox = SandboxSync.create(
    image=SandboxImageSpec(
        os.getenv("SANDBOX_IMAGE", "opensandbox/code-interpreter:latest")
    ),
    timeout=timedelta(minutes=15),
    env=sandbox_env,
    network_policy=NetworkPolicy(
        defaultAction="deny",
        egress=[
            NetworkRule(action="allow", target=ANTHROPIC_HOST),
            NetworkRule(action="allow", target="registry.npmjs.org"),
        ],
    ),
    credential_proxy=CredentialProxyConfig(enabled=True),
)

try:
    sandbox.credential_vault.create(
        credentials=[
            Credential(
                name="anthropic-api-key",
                source={"value": REAL_API_KEY},
            )
        ],
        bindings=[
            CredentialBinding(
                name="anthropic-api",
                match={
                    "schemes": ["https"],
                    "hosts": [ANTHROPIC_HOST],
                    "methods": ["GET", "POST"],
                    "paths": ["/v1/*"],
                },
                auth={
                    "type": "apiKey",
                    "name": "x-api-key",
                    "credential": "anthropic-api-key",
                },
            )
        ],
    )

    sandbox.commands.run(
        "npm install -g @anthropic-ai/claude-code --no-audit --no-fund"
    )
    result = sandbox.commands.run("claude -p '1+1'")
    output = "".join(part.text for part in result.logs.stdout)
    print(output)
finally:
    sandbox.kill()
    sandbox.close()
```

The Claude Code process reads the fake key from `ANTHROPIC_API_KEY`, but the
outbound HTTPS request to `api.anthropic.com/v1/*` receives the real `x-api-key`
header from Credential Vault. If your environment uses a private npm mirror,
replace `registry.npmjs.org` in the network policy and the `npm install`
command with that mirror host.

## Git And Curl With Vault-Injected Credentials

Credential Vault can also protect credentials used by command-line tools such as
`git` and `curl`. Keep the command free of real secrets and bind the request
shape to the credential in Vault instead.

For a private Git repository, store a base64-encoded `username:token` value and
bind it with `basic` auth:

```python
Credential(name="git-basic", source={"value": "<base64(username:token)>"})

CredentialBinding(
    name="git-basic",
    match={
        "schemes": ["https"],
        "hosts": ["git.example.com"],
        "paths": ["/org/private-repo.git*"],
    },
    auth={"type": "basic", "credential": "git-basic"},
)
```

Then run the normal URL without embedding credentials:

```bash
GIT_TERMINAL_PROMPT=0 git clone https://git.example.com/org/private-repo.git
```

For an API request that expects a token header, bind the path and method to an
`apiKey` auth rule:

```python
Credential(name="api-token", source={"value": "<token>"})

CredentialBinding(
    name="api-token",
    match={
        "schemes": ["https"],
        "hosts": ["api.example.com"],
        "methods": ["GET"],
        "paths": ["/v1/projects/123/variables"],
    },
    auth={"type": "apiKey", "name": "PRIVATE-TOKEN", "credential": "api-token"},
)
```

The sandbox command stays secret-free:

```bash
curl -fsS https://api.example.com/v1/projects/123/variables
```

## Binding Guidance

- Use `defaultAction="deny"` and only allow the service hosts required by the
  tool. Default-allow policies are deprecated because they may allow credential
  destination bypass and will emit a security warning.
- Scope bindings by path whenever possible, for example `/v1/*`.
- Avoid overlapping bindings at the same precedence; ambiguous matches are
  rejected.
- Rejected requests (ambiguous paths, encoded separators crossing a binding
  boundary) return `403` when the request body is small and fully known.
  Requests with bodies above the mitmproxy streaming threshold (~1 MiB) or
  with unknown length (chunked) cannot be answered with a `403` while the
  body is being streamed, so the sidecar drops the connection instead —
  either way the request is never forwarded upstream.
- Do not put real secrets in sandbox `env`, command arguments, files, or
  metadata.
- Keep fake environment variables when a CLI refuses to start without a key; the
  vault-injected header is what authenticates the outbound request.

## Migrating From `ports`

The `match.ports` field is deprecated. Port is now derived from scheme (`https`→443, `http`→80). Only ports 80 and 443 are supported; non-standard values are rejected with a validation error.

If you have existing bindings that use `ports` to narrow scope, migrate them to the equivalent `schemes` restriction:

| Before | After |
|--------|-------|
| `schemes: ["http", "https"], ports: [443]` | `schemes: ["https"]` |
| `schemes: ["http", "https"], ports: [80]` | `schemes: ["http"]` |
| `schemes: ["https"], ports: [443]` | `schemes: ["https"]` (remove `ports`) |

# docs/guides/secure-container.md

---
title: Secure Container Runtime
description: Use gVisor, Kata Containers, and Firecracker microVMs for hardware-level sandbox isolation.
---

# Secure Container Runtime Guide

This guide explains how to use secure container runtimes with OpenSandbox to provide hardware-level isolation for executing untrusted AI-generated code.

## Table of Contents

- [Overview](#overview)
- [Server Configuration](#server-configuration)
- [Docker Mode](#docker-mode)
- [Kubernetes Mode](#kubernetes-mode)
- [User Guide](#user-guide)
- [Administrator Guide](#administrator-guide)
- [Troubleshooting and Best Practices](#troubleshooting-and-best-practices)

---

## Overview

### What are Secure Container Runtimes?

Secure container runtimes provide stronger isolation than the standard runc runtime used by Docker and containerd. They add additional security layers through different mechanisms:

| Runtime | Isolation Mechanism | Startup Overhead | Memory Overhead | Best For |
|---------|---------------------|------------------|-----------------|----------|
| **runc** (default) | Process-level cgroups | ~0ms | Minimal | Trusted workloads, local development |
| **gVisor** | User-space kernel (syscall interception) | ~10-50ms | ~50MB | General workloads with low overhead |
| **Kata (QEMU)** | Full VM with QEMU hypervisor | ~500ms | ~20-50MB | Maximum compatibility and isolation |
| **Kata (Firecracker)** | MicroVM with Firecracker hypervisor | ~125ms | ~5MB | High density, minimal footprint |
| **Kata (CLH)** | Cloud Hypervisor | ~200ms | ~10-20MB | Balanced performance and isolation |

### Why Use Secure Runtimes?

OpenSandbox is designed to execute untrusted code generated by AI models (Claude, GPT-4, Gemini, etc.). Secure runtimes provide:

1. **Container Escape Protection**: Prevents malicious code from breaking out of the container
2. **Kernel-Level Isolation**: Each sandbox gets its own kernel context
3. **Multi-Tenant Safety**: Different users' sandboxes are strongly isolated
4. **Compliance**: Meets security requirements for regulated industries

### Supported Runtime Types

OpenSandbox supports the following secure runtime types through server-level configuration:

- `"gvisor"` - Google gVisor with runsc
- `"kata"` - Kata Containers with QEMU hypervisor (default)
- `"firecracker"` - Kata Containers with Firecracker hypervisor
- `""` (empty) - Standard runc (default, no secure runtime)

### Key Design Principle

**Server-Level Configuration**: The secure runtime is configured once at the server level by administrators. All sandboxes on that server transparently use the configured runtime. SDK users and API callers require **no code changes**.

---

## Server Configuration

Secure runtimes are configured through the `~/.sandbox.toml` configuration file. The server validates the configured runtime at startup and will refuse to start if the runtime is unavailable.

### Configuration File

Edit `~/.sandbox.toml`:

```toml
[runtime]
type = "docker"  # or "kubernetes"
execd_image = "opensandbox/execd:latest"

# Secure container runtime configuration
# When enabled, ALL sandboxes on this server use the specified runtime
[secure_runtime]
# Runtime type: "", "gvisor", "kata", "firecracker"
type = ""

# Docker mode: OCI runtime name (e.g., "runsc" for gVisor, "kata-runtime" for Kata)
# Required when runtime.type = "docker" and type is not empty
docker_runtime = "runsc"

# Kubernetes mode: RuntimeClass name (e.g., "gvisor", "kata-qemu", "kata-fc")
# Required when runtime.type = "kubernetes" and type is not empty
k8s_runtime_class = "gvisor"
```

### Configuration Examples

#### Example 1: gVisor on Docker

```toml
[runtime]
type = "docker"
execd_image = "opensandbox/execd:latest"

[secure_runtime]
type = "gvisor"
docker_runtime = "runsc"
k8s_runtime_class = "gvisor"
```

#### Example 2: Kata Containers on Kubernetes

```toml
[runtime]
type = "kubernetes"
execd_image = "opensandbox/execd:latest"

[secure_runtime]
type = "kata"
docker_runtime = "kata-runtime"
k8s_runtime_class = "kata-qemu"
```

#### Example 3: Kata + Firecracker on Kubernetes

```toml
[runtime]
type = "kubernetes"
execd_image = "opensandbox/execd:latest"

[secure_runtime]
type = "firecracker"
docker_runtime = ""  # Not supported in Docker mode
k8s_runtime_class = "kata-fc"
```

### Startup Validation

When the server starts, it automatically validates that the configured secure runtime is available:

```bash
$ opensandbox-server
INFO     Validating secure runtime for Docker backend
INFO     Docker OCI runtime 'runsc' is available: {...}
INFO     Application startup complete.
```

If the runtime is not available, the server will refuse to start with a clear error message:

```
ERROR    Configured Docker runtime 'runsc' is not available.
        Available runtimes: runc.
        Please install and configure it in /etc/docker/daemon.json.
```

---

## Docker Mode

Docker mode is fully supported for secure container runtimes.

### Prerequisites

- Docker daemon installed and running
- Secure runtime installed on the host

### gVisor Setup for Docker

#### Step 1: Install gVisor runsc

For Docker mode, you only need to install the **runsc** OCI runtime:

```bash
# Ubuntu/Debian
curl -fsSL https://gvisor.dev/archive.key | sudo gpg --dearmor -o /usr/share/keyrings/gvisor-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/gvisor-archive-keyring.gpg] https://storage.googleapis.com/gvisor/releases release main" | \
  sudo tee /etc/apt/sources.list.d/gvisor.list
sudo apt-get update && sudo apt-get install -y runsc

# Verify installation
runsc --version
```

> **Note**: For Docker mode, only `runsc` is required. The `containerd-shim-runsc-v1` is only needed for Kubernetes/containerd.
>
> **Reference**: See [gVisor Installation Guide](https://gvisor.dev/docs/user_guide/install/) for other distributions and installation methods.

#### Step 2: Configure Docker daemon

Use the `runsc install` command to automatically configure Docker daemon:

```bash
sudo runsc install
```

Or manually edit `/etc/docker/daemon.json`:

```json
{
  "runtimes": {
    "runsc": {
      "path": "/usr/bin/runsc",
      "runtimeArgs": [
        "--platform=systrap",
        "--network=host"
      ]
    }
  }
}
```

Restart Docker:

```bash
sudo systemctl restart docker
```

> **Reference**: See [gVisor Docker Quick Start](https://gvisor.dev/docs/user_guide/quick_start/docker/) for more details.

#### Step 3: Configure OpenSandbox Server

Edit `~/.sandbox.toml`:

```toml
[runtime]
type = "docker"
execd_image = "opensandbox/execd:latest"

[secure_runtime]
type = "gvisor"
docker_runtime = "runsc"
```

#### Step 4: Start Server and Verify

```bash
opensandbox-server
```

Create a test sandbox:

```bash
curl -X POST http://localhost:8080/v1/sandboxes \
  -H "Content-Type: application/json" \
  -d '{
    "image": {"uri": "python:3.11"},
    "timeout": 3600,
    "resourceLimits": {"cpu": "500m", "memory": "512Mi"},
    "entrypoint": ["python", "-u", "-c", "import time\nwhile True: print('hello from gVisor!'); time.sleep(1)"],
    "metadata": {
      "name": "gvisor-docker-sandbox"
    }
  }'
```

Verify the runtime:

```bash
docker ps --format "{{.ID}}\t{{.Image}}\t{{.Names}}"
docker inspect <container_id> | grep -A2 Runtime
# Expected output:
# "Runtime": "runsc",
```

### Kata Containers Setup for Docker

#### System Requirements

Kata Containers requires hardware virtualization support. Verify your system meets the following requirements:

**Hardware Virtualization Support:**
```bash
# Check if CPU supports hardware virtualization (VT-x for Intel, AMD-V for AMD)
lscpu | grep Virtualization
# Expected output: Virtualization: VT-x (Intel) or AMD-V (AMD)

# Alternatively on Intel
grep -E --color=auto 'vmx|svm' /proc/cpuinfo
# Expected: vmx (Intel) or svm (AMD) flags present
```

**KVM Module:**
```bash
# Check if KVM module is loaded
lsmod | grep kvm
# Expected: kvm_intel (Intel) or kvm_amd (AMD)

# If not loaded, load KVM module
sudo modprobe kvm_intel  # For Intel
# or
sudo modprobe kvm_amd    # For AMD
```

**Kernel Requirements:**
- Linux kernel 5.10 or later recommended
- KVM enabled in kernel config

**Docker Requirements:**
- Docker 20.10 or later
- `/etc/docker/daemon.json` configured for Kata runtime

#### Installation

Download and install Kata Containers static binaries from GitHub releases:

```bash
# Find the latest release at https://github.com/kata-containers/kata-containers/releases
KATA_VERSION="3.27.0"
wget https://github.com/kata-containers/kata-containers/releases/download/${KATA_VERSION}/kata-static-${KATA_VERSION}-amd64.tar.zst

# Extract to root directory - Kata will be installed in /opt/kata
zstd -d kata-static-${KATA_VERSION}-amd64.tar.zst
tar -xvf kata-static-${KATA_VERSION}-amd64.tar -C /

# Create symbolic links for PATH access
sudo ln -sf /opt/kata/bin/kata-runtime /usr/local/bin/kata-runtime
sudo ln -sf /opt/kata/bin/containerd-shim-kata-v2 /usr/local/bin/containerd-shim-kata-v2

# Verify installation
kata-runtime --version
```

#### Configure Docker Daemon

Edit `/etc/docker/daemon.json` to register Kata as a runtime:

```json
{
  "default-runtime": "runc",
  "runtimes": {
    "kata": {
      "runtimeType": "io.containerd.kata.v2"
    }
  }
}
```

Restart Docker to apply changes:

```bash
sudo systemctl restart docker

# Verify Kata is available in Docker
docker info | grep -A5 Runtimes
# Expected output should include "io.containerd.runc.v2 kata"
```

#### Configure OpenSandbox Server

Edit `~/.sandbox.toml`:

```toml
[runtime]
type = "docker"
execd_image = "opensandbox/execd:latest"

[secure_runtime]
type = "kata"
docker_runtime = "kata"
```

#### Verify Installation

**Test with OpenSandbox API**

Create a sandbox and verify it's running in a VM by checking the kernel:

```bash
# Create a test sandbox
curl --location 'http://127.0.0.1:8080/v1/sandboxes' \
  --header 'Content-Type: application/json' \
  --data '{
    "image": {"uri": "ubuntu:latest"},
    "timeout": 3600,
    "resourceLimits": {"cpu": "500m", "memory": "512Mi"},
    "entrypoint": ["/bin/bash", "-c", "while true; do uname -a; sleep 1; done"],
    "metadata": {
      "name": "kata-sandbox"
    }
  }'
```

Check the container's kernel to verify VM isolation:

```bash
# Get the container ID
docker ps | grep kata-sandbox

# Check the kernel inside the container (should be different from host)
docker exec <container_id> uname -a
# Expected output: Linux <hostname> 5.10.x-generic #x86_64 ... (Kata VM kernel)

# Compare with host kernel
uname -a
# Host kernel might be different version or have different hostname
```

**Key Indicators of Kata VM:**
- Container runs in a separate kernel with different hostname
- Kernel version is typically `5.10.x` (Kata's guest kernel)
- Host process list shows `qemu-system-x86_64` or similar hypervisor process
---

## Kubernetes Mode

Kubernetes mode supports secure runtimes through RuntimeClass resources.

### Prerequisites

- Kubernetes cluster with containerd runtime
- Secure runtime installed on all nodes
- RuntimeClass CRDs created

### gVisor Setup for Kubernetes

#### Step 1: Install gVisor Components on All Nodes

For Kubernetes with containerd, you need to install **two** components:

1. **runsc** - the gVisor OCI runtime
2. **containerd-shim-runsc-v1** - the containerd shim for gVisor

```bash
# On each node - Ubuntu/Debian
curl -fsSL https://gvisor.dev/archive.key | sudo gpg --dearmor -o /usr/share/keyrings/gvisor-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/gvisor-archive-keyring.gpg] https://storage.googleapis.com/gvisor/releases release main" | \
  sudo tee /etc/apt/sources.list.d/gvisor.list
sudo apt-get update

# Install both gVisor components
sudo apt-get install -y runsc containerd-shim-runsc-v1

# Verify installation
runsc --version
containerd-shim-runsc-v1 --version
```
> **Reference**: See [gVisor Installation Guide](https://gvisor.dev/docs/user_guide/containerd/configuration/) for complete installation instructions and other distributions.

#### Step 2: Configure containerd

Edit `/etc/containerd/config.toml`:

```toml
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runsc]
          runtime_type = "io.containerd.runsc.v1"
          [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runsc.options]
            TypeUrl = "io.containerd.runsc.v1.options"
            ConfigPath = "/etc/containerd/runsc.toml"
```

```bash
sudo tee /etc/containerd/runsc.toml > /dev/null <<'EOF'
[runsc]
  platform = "ptrace"
EOF
```

Restart containerd:

```bash
sudo systemctl restart containerd
```

#### Step 3: Create RuntimeClass CRD

```yaml
# gvisor-runtimeclass.yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: gvisor
handler: runsc
scheduling:
  nodeSelector:
    kubernetes.io/arch: amd64
```

```bash
kubectl apply -f gvisor-runtimeclass.yaml
```

#### Step 4: Configure OpenSandbox Server

Edit `~/.sandbox.toml`:

```toml
[runtime]
type = "kubernetes"
execd_image = "opensandbox/execd:latest"

[secure_runtime]
type = "gvisor"
k8s_runtime_class = "gvisor"
```

#### Step 5: Verify Installation

```bash
# Test the RuntimeClass
kubectl run test-gvisor --restart=Never --image=hello-world --runtime-class=gvisor
kubectl logs test-gvisor
kubectl delete pod test-gvisor
```

### Kata Containers Setup for Kubernetes

#### Step 1: Install Kata Containers

Follow the [official Kata Containers installation guide](https://github.com/kata-containers/kata-containers/blob/main/tools/packaging/kata-deploy/helm-chart/README.md).

Quick installation using Helm:

```bash
# Install kata-deploy which will set up Kata Containers via DaemonSet
helm install kata-deploy "oci://ghcr.io/kata-containers/kata-deploy-charts/kata-deploy" --version "3.27.0" --namespace kube-system --create-namespace

# Wait for kata-deploy pods to be ready
kubectl wait --for=condition=ready pod -l name=kata-deploy -n kube-system --timeout=300s
```

> **Note**: The `kata-deploy` DaemonSet will automatically configure containerd on all nodes. Manual containerd configuration is not required when using kata-deploy.

#### Step 2: Verify Installation

Check that Kata Containers is installed and RuntimeClasses are created:

```bash
# Check RuntimeClasses
kubectl get runtimeclass

# Expected output:
# NAME         HANDLER     AGE
# kata         kata-qemu   10m
# kata-qemu    kata-qemu   10m
# kata-clh     kata-clh    10m
# kata-fc      kata-fc     10m

# Test Kata with a simple pod
kubectl run test-kata --restart=Never --image=hello-world --runtime-class=kata-qemu
kubectl logs test-kata
kubectl delete pod test-kata
```

### Creating Pools for Different Runtimes (Optional)

When using Pool CRDs for pre-warmed sandboxes, create separate pools for each runtime type:

```yaml
# gvisor-pool.yaml
apiVersion: sandbox.opensandbox.io/v1alpha1
kind: Pool
metadata:
  name: gvisor-pool
  labels:
    runtime: gvisor
spec:
  template:
    spec:
      runtimeClassName: gvisor
      containers:
        - name: sandbox-container
          image: opensandbox/code-interpreter:v1.1.0
  capacitySpec:
    bufferMax: 10
    bufferMin: 2
    poolMax: 20
    poolMin: 5
```

---

## User Guide

This section is for AI application developers using OpenSandbox.

### No Code Changes Required

**Important**: The secure runtime is configured at the server level. Your code does not need to change.

Simply create a sandbox using the OpenSandbox Lifecycle API - the server automatically applies the configured secure runtime:

**Create a test sandbox:**

```bash
curl -X POST http://localhost:8080/v1/sandboxes \
  -H "Content-Type: application/json" \
  -d '{
    "image": {"uri": "python:3.11"},
    "timeout": 3600,
    "resourceLimits": {"cpu": "500m", "memory": "512Mi"},
    "entrypoint": ["python", "-u", "-c", "import time\nwhile True: print(\"hello from secure sandbox!\"); time.sleep(1)"],
    "metadata": {
      "name": "my-secure-sandbox"
    }
  }'
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "running"
}
```

The sandbox will automatically use the secure runtime configured on the server (gVisor, Kata, or runc).

### How It Works

1. **Administrator** configures the secure runtime in `~/.sandbox.toml`
2. **Server** validates the runtime at startup
3. **Server** automatically injects the runtime into each sandbox:
   - Docker mode: Adds `runtime` to HostConfig
   - Kubernetes mode: Adds `runtimeClassName` to Pod spec
4. **User** creates sandboxes via API - no runtime parameter needed

### Verifying Runtime Isolation

After creating a sandbox, verify the runtime being used:

**Docker mode:**
```bash
docker ps --format "{{.ID}}\t{{.Image}}\t{{.Names}}"
docker inspect <container_id> | grep -A2 Runtime
# Expected output for gVisor:
# "Runtime": "runsc",
```

**Kubernetes mode:**
```bash
kubectl get pod <pod-name> -o jsonpath='{.spec.runtimeClassName}'
# Expected output for gVisor:
# gvisor
```

---

## Administrator Guide

This section is for platform operators and SREs managing secure runtime infrastructure.

### Prerequisites

Secure runtimes must be installed and configured on your infrastructure **before** configuring OpenSandbox. OpenSandbox does not install runtimes automatically.

### Installation Summary

| Runtime | Docker | Kubernetes |
|---------|--------|------------|
| gVisor | Install runsc → Configure daemon.json | Install runsc → Configure containerd → Create RuntimeClass |
| Kata (QEMU) | Install kata-runtime → Configure daemon.json | Install Kata → Configure containerd → Create RuntimeClass |
| Kata (Firecracker) | Not supported | Install Kata → Configure containerd → Create RuntimeClass |

### Configuration Validation

The server validates secure runtime configuration at startup:

1. **Docker mode**: Checks if the runtime exists in Docker daemon's runtime list
2. **Kubernetes mode**: Checks if the RuntimeClass exists in the cluster

If validation fails, the server refuses to start with a clear error message.

### Security Best Practices

1. **Default to gVisor**: Provides good security with acceptable performance for most workloads
2. **Use Kata for Untrusted Code**: Maximum isolation for completely unknown code
3. **Regular Updates**: Keep runtimes updated for security patches
4. **Test Compatibility**: Validate your workloads with the chosen runtime before production
5. **Monitor Resources**: Secure runtimes have higher memory overhead

### Runtime Selection Guidelines

| Use Case | Recommended Runtime | Reasoning |
|----------|---------------------|-----------|
| Development/Testing | runc (default) | Fastest startup, lowest overhead |
| Production AI Code Execution | gVisor | Good balance of security and performance |
| High-Security Requirements | Kata (QEMU) | Maximum isolation, full compatibility |
| High-Density Multi-Tenant | Kata (Firecracker) | Minimal memory overhead per sandbox |
| Untrusted Network Code | gVisor or Kata | Syscall filtering prevents network attacks |

---

## Troubleshooting and Best Practices

### Common Issues

#### 1. Runtime Not Found (Docker)

**Error**: `Configured Docker runtime 'runsc' is not available.`

**Solution**: Ensure the runtime is configured in `/etc/docker/daemon.json` and Docker has been restarted:

```bash
sudo systemctl restart docker
docker info | grep -A5 Runtimes
```

#### 2. RuntimeClass Not Found (Kubernetes)

**Error**: `RuntimeClass 'gvisor' does not exist.`

**Solution**: Create the RuntimeClass CRD:

```bash
kubectl get runtimeclass
kubectl apply -f gvisor-runtimeclass.yaml
```

#### 3. Syscall Compatibility Issues

**Error**: Container exits with code 1, no logs

**Cause**: gVisor doesn't implement all syscalls. Some applications may not be compatible.

**Solution**: Check the [gVisor compatibility guide](https://gvisor.dev/docs/user_guide/compatibility/). Try using Kata (QEMU) which has better compatibility.

#### 4. Pod Stuck in ContainerCreating

**Cause**: RuntimeClass handler not configured on the node.

**Solution**: Verify containerd configuration:

```bash
# On the node
sudo containerd config dump
sudo systemctl restart containerd
```

#### 5. Egress Sidecar Incompatible with gVisor

**Error**: Sandbox pods CrashLoopBackOff with egress container log:
```
iptables: Failed to initialize nft: Protocol not supported
```
Or with iptables-legacy:
```
iptables v1.8.9 (legacy): can't initialize iptables table 'nat': Table does not exist (do you need to insmod?)
```

**Cause**: gVisor's netstack implements the `filter` and `mangle` iptables tables but does not implement the `nat` table. The egress sidecar uses a REDIRECT rule in the `nat` table to intercept DNS queries (port 53 → 15353), so it cannot start under gVisor. This is an upstream gVisor limitation ([gvisor#170](https://github.com/google/gvisor/issues/170)).

**Solution**:
- Use `secure_runtime.type = "kata"` with `k8s_runtime_class = "kata-qemu"` — Kata provides a full Linux kernel per pod, so the `nat` table is available and the egress sidecar works unchanged.
- Use a CNI-level FQDN policy (e.g., Cilium `toFQDNs`) instead of the egress sidecar for network isolation under gVisor.
- Remove `network_policy` from sandbox creation requests if egress control is not required.

> **Note**: The server validates this combination at request time and returns HTTP 400 with a clear error message when `secure_runtime.type = "gvisor"` and `network_policy` are used together.

### Compatibility Matrix

| Feature | runc | gVisor | Kata (QEMU) | Kata (CLH) | Kata (FC) |
|---------|------|--------|-------------|------------|-----------|
| Syscall Compatibility | Full | Partial | Full | Full | Limited |
| GPU Support | Yes | No | Yes | Yes | No |
| IPv6 | Yes | Yes | Yes | Yes | Yes |
| Privileged Mode | Yes | No | Yes | Yes | No |
| Docker Volume | Yes | Yes | Yes | Yes | Yes |
| Systemd | Yes | No | Yes | Yes | No |
| iptables `nat` table (egress sidecar) | Yes | **No** | Yes | Yes | Yes |

### Getting Help

- **Documentation**: [OpenSandbox GitHub](https://github.com/opensandbox-group/OpenSandbox)
- **Issues**: Report bugs via [GitHub Issues](https://github.com/opensandbox-group/OpenSandbox/issues)
- **Design Document**: See [OSEP-0004](https://github.com/opensandbox-group/OpenSandbox/blob/main/oseps/0004-secure-container-runtime.md) for complete design details

# docs/community/release-verification.md

---
title: Release Verification
description: Verify signed OpenSandbox releases for source archives, container images, packages, and Helm charts.
---

# Release Verification

OpenSandbox signs public release outputs without changing the normal install
commands. Verification is optional for day-to-day use, but supported for users
who need supply chain integrity checks.

This process applies to releases produced after the signing workflows were
introduced. Older releases may not have attestations or signatures.

## Signing Model

OpenSandbox uses these signing paths:

- Source code releases: the Generic Release workflow uploads an explicit
  `opensandbox-<tag>.tar.gz` source archive and `SHA256SUMS` file to the GitHub
  Release, then creates GitHub/Sigstore provenance attestations for both files.
- Container images: the component and server image workflows sign Docker Hub,
  GitHub Container Registry (GHCR), and Alibaba Cloud Container Registry (ACR)
  image digests with `cosign` keyless signing, and publish provenance
  attestations to all three registries.
- Python and CLI packages: wheels and source distributions are attested before
  `uv publish`.
- JavaScript packages: the workflow runs `pnpm pack`, attests the generated npm
  tarball, and publishes that same tarball.
- C# packages: NuGet `.nupkg` files are attested before publication.
- Go SDK modules: the `sdks/sandbox/go/v<version>` source release archive is
  attested by the Generic Release workflow.
- Helm charts: packaged chart `.tgz` files are attested before upload to the
  GitHub Release.
- Java/Kotlin packages: Maven Central publications are signed by the Gradle
  Maven publish signing configuration. Download the `.asc` signature next to
  the Maven artifact and verify it with OpenPGP tooling.

Release tags may also be signed with `scripts/release/create-release.sh
--sign-tag` when the release operator has a local git signing key configured.
Do not rely on signed tags alone for generated deliverables; verify the
artifact you are installing.

## Trust Roots and Keys

Most OpenSandbox release signatures are keyless Sigstore signatures created by
GitHub Actions OpenID Connect (OIDC). There is no long-lived OpenSandbox private
key for these signatures, so there is no project public key file to download.
The public certificates and signed bundles are retrieved by `gh` or `cosign`
from GitHub's attestation service, OCI registries, and Sigstore transparency
infrastructure.

Expected identity values:

- Repository: `opensandbox-group/OpenSandbox`
- OIDC issuer: `https://token.actions.githubusercontent.com`
- Source release workflow: `opensandbox-group/OpenSandbox/.github/workflows/release-generic.yml`
- Component image workflow: `opensandbox-group/OpenSandbox/.github/workflows/publish-components.yml`
- Server image workflow: `opensandbox-group/OpenSandbox/.github/workflows/publish-server.yml`
- CLI package workflow: `opensandbox-group/OpenSandbox/.github/workflows/publish-cli.yml`
- Python package workflow: `opensandbox-group/OpenSandbox/.github/workflows/publish-python-sdks.yml`
- JavaScript package workflow: `opensandbox-group/OpenSandbox/.github/workflows/publish-js-sdks.yml`
- C# package workflow: `opensandbox-group/OpenSandbox/.github/workflows/publish-csharp-sdks.yml`
- Helm chart workflow: `opensandbox-group/OpenSandbox/.github/workflows/publish-helm-chart.yml`

Set the repository identity for the release you are verifying:

```bash
REPOSITORY="opensandbox-group/OpenSandbox"
WORKFLOW_REPOSITORY="${REPOSITORY}"
WORKFLOW_REPOSITORY_URL="https://github.com/${WORKFLOW_REPOSITORY}"
```

For releases produced before the GitHub organization migration, use the
historical identity instead:

```bash
REPOSITORY="alibaba/OpenSandbox"
WORKFLOW_REPOSITORY="${REPOSITORY}"
WORKFLOW_REPOSITORY_URL="https://github.com/${WORKFLOW_REPOSITORY}"
```

If you run the release workflows from a downstream fork, replace
`opensandbox-group/OpenSandbox` in the verification commands with that fork's
`owner/repository` identity.

Private signing material is not stored in GitHub Releases, Docker Hub, GHCR,
ACR, PyPI, npm, Maven Central, NuGet, or Helm chart downloads. Java/Kotlin
Maven Central signing keys are held only in GitHub Actions secrets.

## Verify Source Releases

Set the release tag first:

```bash
TAG="server/v0.1.13"
SAFE_TAG="${TAG//\//-}"
```

Download the signed source archive and checksum file:

```bash
gh release download "$TAG" \
  --repo "$REPOSITORY" \
  --pattern "opensandbox-${SAFE_TAG}.tar.gz" \
  --pattern "SHA256SUMS"
```

Check the archive digest:

```bash
sha256sum -c SHA256SUMS
```

Verify the source archive attestation:

```bash
gh attestation verify "opensandbox-${SAFE_TAG}.tar.gz" \
  --repo "$REPOSITORY" \
  --signer-workflow "${WORKFLOW_REPOSITORY}/.github/workflows/release-generic.yml"
```

Verify the checksum file attestation:

```bash
gh attestation verify SHA256SUMS \
  --repo "$REPOSITORY" \
  --signer-workflow "${WORKFLOW_REPOSITORY}/.github/workflows/release-generic.yml"
```

The Generic Release workflow is started with `workflow_dispatch`, so its
provenance `source-ref` is the ref selected when the workflow was dispatched
(normally `refs/heads/main`), not the release tag created by the job.

## Verify Container Images

Install `cosign` and `gh`, then resolve the image digest. Always verify by
digest, not by mutable tag alone.

Release images are published with the same component name and digest in all
three official registries:

| Registry | Image name pattern |
| --- | --- |
| Docker Hub | `docker.io/opensandbox/<component>` |
| GitHub Container Registry | `ghcr.io/opensandbox-group/opensandbox/<component>` |
| Alibaba Cloud Container Registry | `sandbox-registry.cn-zhangjiakou.cr.aliyuncs.com/opensandbox/<component>` |

The component can be `execd`, `code-interpreter`, `ingress`, `egress`,
`controller`, `task-executor`, `image-committer`, or `nodeagent`. The server
image uses the component name `server`.

```bash
IMAGE="docker.io/opensandbox/execd"
TAG="v1.0.15"
DIGEST="$(docker buildx imagetools inspect "${IMAGE}:${TAG}" --format '{{.Manifest.Digest}}')"
IMAGE_REF="${IMAGE}@${DIGEST}"
```

Verify the cosign keyless signature:

```bash
cosign verify "$IMAGE_REF" \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  --certificate-identity-regexp "^${WORKFLOW_REPOSITORY_URL}/.github/workflows/publish-components.yml@refs/tags/(docker|k8s)/[^/]+/v?[0-9].*$"
```

Verify the registry provenance attestation:

```bash
gh attestation verify "oci://${IMAGE_REF}" \
  --repo "$REPOSITORY" \
  --bundle-from-oci \
  --signer-workflow "${WORKFLOW_REPOSITORY}/.github/workflows/publish-components.yml"
```

For the server image, use `docker.io/opensandbox/server` and the server workflow:

```bash
IMAGE="docker.io/opensandbox/server"
TAG="v0.1.13"
DIGEST="$(docker buildx imagetools inspect "${IMAGE}:${TAG}" --format '{{.Manifest.Digest}}')"
IMAGE_REF="${IMAGE}@${DIGEST}"

cosign verify "$IMAGE_REF" \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  --certificate-identity-regexp "^${WORKFLOW_REPOSITORY_URL}/.github/workflows/publish-server.yml@refs/tags/server/v[0-9].*$"
```

GHCR and ACR images use the same digest and identity checks with their
respective image names, for example:

```bash
IMAGE="ghcr.io/opensandbox-group/opensandbox/execd"
# or
IMAGE="sandbox-registry.cn-zhangjiakou.cr.aliyuncs.com/opensandbox/execd"
```

## Verify Packages

Download the package file from its normal package registry, then verify the
attestation against the OpenSandbox repository and the expected release tag.

Python and CLI packages:

```bash
python -m pip download opensandbox-server==0.1.13 --no-deps
gh attestation verify opensandbox_server-0.1.13*.whl \
  --repo "$REPOSITORY" \
  --signer-workflow "${WORKFLOW_REPOSITORY}/.github/workflows/publish-server.yml" \
  --source-ref refs/tags/server/v0.1.13
```

JavaScript packages:

```bash
npm pack @alibaba-group/opensandbox@0.1.7
gh attestation verify alibaba-group-opensandbox-0.1.7.tgz \
  --repo "$REPOSITORY" \
  --signer-workflow "${WORKFLOW_REPOSITORY}/.github/workflows/publish-js-sdks.yml" \
  --source-ref refs/tags/js/sandbox/v0.1.7
```

C# packages:

```bash
gh attestation verify Alibaba.OpenSandbox.1.0.0.nupkg \
  --repo "$REPOSITORY" \
  --signer-workflow "${WORKFLOW_REPOSITORY}/.github/workflows/publish-csharp-sdks.yml" \
  --source-ref refs/tags/csharp/sandbox/v1.0.0
```

Helm charts:

```bash
gh release download helm/opensandbox/0.1.0 \
  --repo "$REPOSITORY" \
  --pattern 'opensandbox-*.tgz'
gh attestation verify opensandbox-*.tgz \
  --repo "$REPOSITORY" \
  --signer-workflow "${WORKFLOW_REPOSITORY}/.github/workflows/publish-helm-chart.yml"
```

When Helm charts are released through `workflow_dispatch`, their provenance
`source-ref` is the selected dispatch ref. Tag-triggered Helm releases have a
tag `source-ref`.

Java/Kotlin Maven artifacts:

```bash
curl -O https://repo1.maven.org/maven2/com/alibaba/opensandbox/sandbox/1.0.10/sandbox-1.0.10.jar
curl -O https://repo1.maven.org/maven2/com/alibaba/opensandbox/sandbox/1.0.10/sandbox-1.0.10.jar.asc
KEY_ID="$(gpg --list-packets sandbox-1.0.10.jar.asc | awk '/keyid/ { print $NF; exit }')"
gpg --keyserver hkps://keys.openpgp.org --recv-keys "$KEY_ID"
gpg --verify sandbox-1.0.10.jar.asc sandbox-1.0.10.jar
```

If verification cannot find an attestation for a release that predates this
process, use a newer release as the signed release evidence.

# docs/examples/code-interpreter.md

---
title: Code Interpreter
description: Complete demonstration of running Python code using the Code Interpreter SDK with OpenSandbox.
---

# Code Interpreter Sandbox

Complete demonstration of running Python code using the Code Interpreter SDK.

## Getting Code Interpreter image

Pull the prebuilt image from a registry:

```shell
docker pull sandbox-registry.cn-zhangjiakou.cr.aliyuncs.com/opensandbox/code-interpreter:v1.1.0

# use docker hub
# docker pull opensandbox/code-interpreter:v1.1.0
```

## Start OpenSandbox server [local]

Start the local OpenSandbox server:

```shell
uv pip install opensandbox-server
opensandbox-server init-config ~/.sandbox.toml --example docker
opensandbox-server
```

## Create and access the Code Interpreter Sandbox

```shell
# Install OpenSandbox packages
uv pip install opensandbox opensandbox-code-interpreter

# Run the example (requires SANDBOX_DOMAIN / SANDBOX_API_KEY)
uv run python examples/code-interpreter/main.py
```

The script creates a Sandbox + CodeInterpreter, runs a Python code snippet and prints stdout/result, then terminates the remote instance.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SANDBOX_DOMAIN` | `localhost:8080` | Sandbox service address |
| `SANDBOX_API_KEY` | _(optional)_ | API key if your server requires authentication |
| `SANDBOX_IMAGE` | `sandbox-registry.cn-zhangjiakou.cr.aliyuncs.com/opensandbox/code-interpreter:v1.1.0` | Sandbox image to use |

## Example output

```text
=== Python example ===
[Python stdout] Hello from Python!

[Python result] {'py': '3.14.2', 'sum': 4}

=== Java example ===
[Java stdout] Hello from Java!

[Java stdout] 2 + 3 = 5

[Java result] 5

=== Go example ===
[Go stdout] Hello from Go!
3 + 4 = 7


=== TypeScript example ===
[TypeScript stdout] Hello from TypeScript!

[TypeScript stdout] sum = 6
```

## Code Interpreter Sandbox from pool

### Start OpenSandbox server [k8s]

Install the k8s OpenSandbox operator, and create a pool:

```yaml
apiVersion: sandbox.opensandbox.io/v1alpha1
kind: Pool
metadata:
  labels:
    app.kubernetes.io/name: sandbox-k8s
    app.kubernetes.io/managed-by: kustomize
  name: pool-sample
  namespace: opensandbox
spec:
  template:
    metadata:
      labels:
        app: example
    spec:
      volumes:
        - name: sandbox-storage
          emptyDir: { }
        - name: opensandbox-bin
          emptyDir: { }
      initContainers:
        - name: task-executor-installer
          image: sandbox-registry.cn-zhangjiakou.cr.aliyuncs.com/opensandbox/task-executor:v0.1.0
          command: [ "/bin/sh", "-c" ]
          args:
            - |
              cp /workspace/server /opt/opensandbox/task-executor && 
              chmod +x /opt/opensandbox/task-executor
          volumeMounts:
            - name: opensandbox-bin
              mountPath: /opt/opensandbox
        - name: execd-installer
          image: sandbox-registry.cn-zhangjiakou.cr.aliyuncs.com/opensandbox/execd:v1.0.22
          command: [ "/bin/sh", "-c" ]
          args:
            - |
              cp ./execd /opt/opensandbox/execd && 
              cp ./bootstrap.sh /opt/opensandbox/bootstrap.sh &&
              chmod +x /opt/opensandbox/execd &&
              chmod +x /opt/opensandbox/bootstrap.sh
          volumeMounts:
            - name: opensandbox-bin
              mountPath: /opt/opensandbox
      containers:
        - name: sandbox
          image: sandbox-registry.cn-zhangjiakou.cr.aliyuncs.com/opensandbox/code-interpreter:v1.1.0
          command:
          - "/bin/sh"
          - "-c"
          - |
            /opt/opensandbox/task-executor \
              -listen-addr=0.0.0.0:5758 \
              -log-dir=/tmp
          env:
          - name: SANDBOX_MAIN_CONTAINER
            value: main
          - name: EXECD_ENVS
            value: /opt/opensandbox/.env
          - name: EXECD
            value: /opt/opensandbox/execd
          volumeMounts:
            - name: sandbox-storage
              mountPath: /var/lib/sandbox
            - name: opensandbox-bin
              mountPath: /opt/opensandbox
      tolerations:
        - operator: "Exists"
  capacitySpec:
    bufferMax: 3
    bufferMin: 1
    poolMax: 5
    poolMin: 0
```

#### How Pool entrypoint injection works

The lifecycle API allocates an already-running Pod from the Pool, so it does not replace that Pod's `command`, `args`, or `env`. When a create request supplies an `entrypoint` or environment variables, the server records them in `BatchSandbox.spec.taskTemplate`. The controller then sends the task to the allocated Pod's IP on port `5758`.

The Pool template must provide all parts of that execution path:

- Install and run task-executor, listening on `0.0.0.0:5758`. Set its
  `-log-dir` explicitly so the troubleshooting path is deterministic; the
  example writes `/tmp/task-executor.log`.
- Install execd and `bootstrap.sh` into the shared volume before the Pod starts.
- Keep `bootstrap.sh` at `/opt/opensandbox/bootstrap.sh`. The server-generated task invokes that exact path. The execd binary can use another path only when the task-executor environment sets `EXECD` accordingly.
- Start execd through `bootstrap.sh` after allocation so request-specific values such as `EXECD_ACCESS_TOKEN` are available. The example above leaves task-executor as the warm Pod's foreground process for this reason.

The Pod YAML continuing to show the Pool template is therefore expected. Inspect the `BatchSandbox` resource and task-executor instead:

```shell
# Confirm that the server injected the requested process and environment.
kubectl get batchsandbox <sandbox-name> -n <namespace> \
  -o jsonpath='{.spec.taskTemplate}{"\n"}'

# Find the allocated Pod. The annotation value contains a JSON `pods` array.
kubectl get batchsandbox <sandbox-name> -n <namespace> \
  -o jsonpath='{.metadata.annotations.sandbox\.opensandbox\.io/alloc-status}{"\n"}'

# Replace <pool-pod> with the first Pod name from that array.
kubectl exec <pool-pod> -n <namespace> -- \
  sh -c 'test -x /opt/opensandbox/task-executor && test -x /opt/opensandbox/bootstrap.sh'
kubectl exec <pool-pod> -n <namespace> -- \
  tail -n 100 /tmp/task-executor.log

# Check the executor health endpoint from a second terminal while this runs.
kubectl port-forward pod/<pool-pod> -n <namespace> 5758:5758
curl http://127.0.0.1:5758/health
curl http://127.0.0.1:5758/getTasks

# The lifecycle server uses <sandbox-name>-0 as the task name. Check the task's
# captured output (adjust the path if task-executor uses a custom data directory).
kubectl exec <pool-pod> -n <namespace> -- \
  sh -c 'tail -n 100 /var/lib/sandbox/tasks/<sandbox-name>-0/stdout.log; tail -n 100 /var/lib/sandbox/tasks/<sandbox-name>-0/stderr.log'

# Check controller logs for delivery failures between the controller and port 5758.
kubectl logs -n opensandbox-system -l control-plane=controller-manager --tail=100
```

If `taskTemplate` exists but the health check cannot reach port `5758`, verify that task-executor is installed and remains running. The generated task intentionally starts `bootstrap.sh` in the background, so its wrapper can report success even when `bootstrap.sh` is missing or the requested entrypoint later fails. Do not rely on `taskFailed` or `taskLastErrorMessage` alone for these failures; inspect the task's captured `stderr.log` and `stdout.log`, then verify the execd or application process directly.

Start the k8s OpenSandbox server:

```shell
uv pip install opensandbox-server

# replace with your k8s cluster config, kubeconfig etc.
opensandbox-server init-config ~/.sandbox.toml --example k8s
curl -o ~/batchsandbox-template.yaml https://raw.githubusercontent.com/opensandbox-group/OpenSandbox/main/server/opensandbox_server/examples/example.batchsandbox-template.yaml

opensandbox-server
```

### Create and access the Code Interpreter Sandbox (pool)

```shell
# Install OpenSandbox packages
uv pip install opensandbox opensandbox-code-interpreter

# Run the example (requires SANDBOX_DOMAIN / SANDBOX_API_KEY)
uv run python examples/code-interpreter/main_use_pool.py
```

### Pool example output

```text
=== Verify Environment Variable ===
[ENV Check] TEST_ENV value: test

[ENV Result] 'test'

=== Java example ===
[Java stdout] Hello from Java!

[Java stdout] 2 + 3 = 5

[Java result] 5

=== Go example ===
[Go stdout] Hello from Go!
3 + 4 = 7


=== TypeScript example ===
[TypeScript stdout] Hello from TypeScript!

[TypeScript stdout] sum = 6
```

## References

- [Source code on GitHub](https://github.com/opensandbox-group/OpenSandbox/tree/main/examples/code-interpreter)

# docs/examples/aio-sandbox.md

---
title: AIO Sandbox
description: Create and access an All-in-One (AIO) Sandbox via OpenSandbox.
---

# All-in-One (AIO) Sandbox Example

This example demonstrates how to create and access an [All-in-One (AIO) Sandbox](https://github.com/agent-infra/sandbox) via OpenSandbox.

## Start OpenSandbox server [local]

You can find the latest version [here](https://github.com/agent-infra/sandbox/pkgs/container/sandbox).

You can pre-pull the target image which is used in the example.

::: info Docker runtime requirement
The server is configured with `runtime.type = "docker"` by default, so it **must** be able to connect to a running Docker daemon.

- **Docker Desktop**: ensure Docker Desktop is running, then verify with `docker version`.
- **Colima (macOS)**: start it first (`colima start`) and export the socket before starting the server:

```shell
export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"
```
:::

```shell
# pre-pull target image
docker pull ghcr.io/agent-infra/sandbox:latest
```

Then, start the OpenSandbox server, you can obtain stdout log from terminal.

```shell
uv pip install opensandbox-server
opensandbox-server init-config ~/.sandbox.toml --example docker
opensandbox-server
```

::: tip
`opensandbox-server` runs in the foreground and will keep the current terminal session busy. The example code lives in this repository -- clone it and, in a new terminal window/tab, `cd` into the project root before running the AIO sandbox creation steps below.

If you see errors like `FileNotFoundError: [Errno 2] No such file or directory` from `docker/transport/unixconn.py`, it usually means the Docker unix socket is missing / Docker daemon is not running.
:::

## Create and Access the AIO Sandbox Instance

This example uses a fixed configuration for quick start:
- OpenSandbox server: `http://localhost:8080`
- Image: `ghcr.io/agent-infra/sandbox:latest`
- AIO port: `8080`
- Timeout: `300s`

Install dependencies with uv under project root:

```shell
uv pip install opensandbox agent-sandbox==0.0.18
```

Run the example (it will create a sandbox via OpenSandbox, wait until it's Running, then connect to it via agent-sandbox):

```shell
uv run python examples/aio-sandbox/main.py
```

Subsequently, you will instantiate an AIO sandbox, navigate to Google, capture a screenshot, and download it to your local environment.

```text
Creating AIO sandbox with image=ghcr.io/agent-infra/sandbox:latest on OpenSandbox server http://localhost:8080...
[check] sandbox ready after 7.1s
AIO portal endpoint: 127.0.0.1:56123
...
Screenshot saved to sandbox_screenshot.png
```

![AIO Sandbox screenshot](../public/images/aio-sandbox-screenshot.png)

## More examples

For more examples of using the AIO Sandbox, refer to agent-infra/sandbox [examples](https://github.com/agent-infra/sandbox/tree/main/examples).

## References

- [AIO Sandbox](https://github.com/agent-infra/sandbox/tree/main)
- [AIO Sandbox Python SDK](https://github.com/agent-infra/sandbox/tree/main/sdk/python)
- [Source code on GitHub](https://github.com/opensandbox-group/OpenSandbox/tree/main/examples/aio-sandbox)

# docs/examples/agent-sandbox.md

---
title: Agent Sandbox
description: Create a kubernetes-sigs/agent-sandbox instance and run a command using the OpenSandbox Python SDK.
---

# Agent-Sandbox Example

This example creates a sandbox backed by `kubernetes-sigs/agent-sandbox` and
executes `echo hello world` via the OpenSandbox Python SDK.

## Prerequisites

- A Kubernetes cluster with the agent-sandbox controller and CRDs installed.
- OpenSandbox server configured with Kubernetes runtime and `workload_provider = "agent-sandbox"`.
- Sandbox image should include `bash` (default example uses `ubuntu:22.04`).

## Start OpenSandbox server

1. Install the server package and fetch the example config for agent-sandbox:

```shell
uv pip install opensandbox-server
opensandbox-server init-config ~/.sandbox.toml --example docker
```

2. Update `~/.sandbox.toml` with the following sections:

```toml
[runtime]
type = "kubernetes"
execd_image = "opensandbox/execd:v1.0.22"

[kubernetes]
namespace = "default"
# kubeconfig_path = "/absolute/path/to/kubeconfig"  # optional if running in-cluster
workload_provider = "agent-sandbox"

[agent_sandbox]
shutdown_policy = "Delete"
```

3. Start the server:

```shell
opensandbox-server
```

## Run the example

```shell
uv pip install opensandbox
uv run python examples/agent-sandbox/main.py
```

## Expected output

```text
command output: hello world
```

## References

- [Source code on GitHub](https://github.com/opensandbox-group/OpenSandbox/tree/main/examples/agent-sandbox)

# docs/examples/docker-pvc-volume-mount.md

---
title: Docker PVC Volume
description: Mount Docker named volumes into sandbox containers using the OpenSandbox pvc backend.
---

# Docker PVC (Named Volume) Mount Example

This example demonstrates how to mount Docker named volumes into sandbox containers using the OpenSandbox `pvc` backend. In Docker runtime, `pvc.claimName` maps to a Docker named volume -- providing a more convenient and secure alternative to host-path bind mounts for sharing data across sandboxes.

::: info What is `pvc`?
The `pvc` backend is a runtime-neutral abstraction. In Kubernetes it maps to a PersistentVolumeClaim; in Docker it maps to a named volume. The same API request works on both runtimes. See [OSEP-0003](https://github.com/opensandbox-group/OpenSandbox/blob/main/oseps/0003-volume-and-volumebinding-support.md) for the design.
:::

## Why Named Volumes over Host Paths?

| | Host path (`host` backend) | Named volume (`pvc` backend) |
|---|---|---|
| **Security** | Exposes host filesystem paths | Docker manages storage location; no host path exposed |
| **Setup** | Requires `allowed_host_paths` allowlist | No allowlist needed |
| **Cross-sandbox sharing** | All containers must agree on a host path | Reference the same volume name |
| **Portability** | Tied to host directory structure | Works on any Docker host |
| **Lifecycle** | User manages host directories | `docker volume create/rm` |

## Scenarios

| # | Scenario | Description |
|---|----------|-------------|
| 1 | **Read-write mount** | Mount a named volume for bidirectional file I/O |
| 2 | **Read-only mount** | Mount a named volume that sandboxes cannot modify |
| 3 | **Cross-sandbox sharing** | Two sandboxes share data through the same named volume |
| 4 | **SubPath mount** | Mount only a subdirectory of a named volume (consistent with K8s PVC subPath) |

## Prerequisites

### 1. Start OpenSandbox Server

```shell
uv pip install opensandbox-server
opensandbox-server init-config ~/.sandbox.toml --example docker
opensandbox-server
```

### 2. Create a Docker Named Volume

```shell
# Create the named volume
docker volume create opensandbox-pvc-demo

# Seed it with a marker file via a temporary container
docker run --rm -v opensandbox-pvc-demo:/data alpine \
  sh -c "echo 'hello-from-named-volume' > /data/marker.txt"
```

### 3. Install Python SDK

```shell
uv pip install opensandbox
```

### 4. Pull the Sandbox Image

```shell
docker pull ubuntu:latest
```

## Run

```shell
uv run python examples/docker-pvc-volume-mount/main.py
```

The script automatically creates the named volume and seeds it with test data. You can also specify a custom volume name or image:

```shell
SANDBOX_IMAGE=ubuntu SANDBOX_DOMAIN=localhost:8080 uv run python examples/docker-pvc-volume-mount/main.py
```

## Expected Output

```text
OpenSandbox server : localhost:8080
Sandbox image      : ubuntu
Docker volume      : opensandbox-pvc-demo
  Ensuring Docker named volume 'opensandbox-pvc-demo' exists...
  Created volume 'opensandbox-pvc-demo' with marker.txt

============================================================
Scenario 1: Read-Write PVC (Named Volume) Mount
============================================================
  ...

============================================================
Scenario 2: Read-Only PVC (Named Volume) Mount
============================================================
  ...

============================================================
Scenario 3: Cross-Sandbox Sharing via PVC (Named Volume)
============================================================
  ...

============================================================
Scenario 4: SubPath PVC (Named Volume) Mount
============================================================
  ...

============================================================
All scenarios completed successfully!
============================================================
```

## SDK Usage Quick Reference

### Python (async)

```python
from opensandbox import Sandbox
from opensandbox.models.sandboxes import PVC, Volume

sandbox = await Sandbox.create(
    image="ubuntu",
    volumes=[
        Volume(
            name="my-data",
            pvc=PVC(claimName="my-named-volume"),
            mountPath="/mnt/data",
            readOnly=False,       # optional, default is False
            subPath="datasets/train",  # optional, mount a subdirectory
        ),
    ],
)
```

### Python (sync)

```python
from opensandbox import SandboxSync
from opensandbox.models.sandboxes import PVC, Volume

sandbox = SandboxSync.create(
    image="ubuntu",
    volumes=[
        Volume(
            name="my-data",
            pvc=PVC(claimName="my-named-volume"),
            mountPath="/mnt/data",
            subPath="datasets/train",  # optional
        ),
    ],
)
```

### JavaScript / TypeScript

```typescript
import { Sandbox } from "@alibaba-group/opensandbox";

const sandbox = await Sandbox.create({
  image: "ubuntu",
  volumes: [
    {
      name: "my-data",
      pvc: { claimName: "my-named-volume" },
      mountPath: "/mnt/data",
      readOnly: false,
      subPath: "datasets/train",  // optional
    },
  ],
});
```

### Java / Kotlin

```java
Volume volume = Volume.builder()
    .name("my-data")
    .pvc(PVC.of("my-named-volume"))
    .mountPath("/mnt/data")
    .readOnly(false)
    .subPath("datasets/train")  // optional
    .build();

Sandbox sandbox = Sandbox.builder()
    .image("ubuntu")
    .volume(volume)
    .build();
```

## Cleanup

```shell
docker volume rm opensandbox-pvc-demo
```

## References

- [OSEP-0003: Volume and VolumeBinding Support](https://github.com/opensandbox-group/OpenSandbox/blob/main/oseps/0003-volume-and-volumebinding-support.md) -- Design proposal
- [Sandbox Lifecycle API Spec](https://github.com/opensandbox-group/OpenSandbox/blob/main/specs/sandbox-lifecycle.yml) -- OpenAPI schema for volume definitions
- [Host Volume Mount Example](/examples/host-volume-mount) -- Host path bind mount example (alternative approach)
- [Source code on GitHub](https://github.com/opensandbox-group/OpenSandbox/tree/main/examples/docker-pvc-volume-mount)

# docs/examples/docker-ossfs-volume-mount.md

---
title: Docker OSSFS Volume
description: Mount Alibaba Cloud OSS into sandboxes on Docker runtime using the OSSFS volume model.
---

# Docker OSSFS Volume Mount Example

This example demonstrates how to use the SDK `ossfs` volume model to mount Alibaba Cloud OSS into sandboxes on Docker runtime.

## What this example covers

1. **Basic read-write mount** on an OSSFS backend.
2. **Cross-sandbox sharing** on the same OSSFS backend path.
3. **Two mounts, different OSS prefixes via `subPath`**.

## Prerequisites

### 1. Start OpenSandbox server (Docker runtime)

Make sure your server host has:

- Linux host OS (OSSFS backend is not supported when OpenSandbox Server runs on Windows)
- `ossfs` installed
- FUSE support enabled
- writable local mount root for OSSFS (default `storage.ossfs_mount_root=/mnt/ossfs`)

`storage.ossfs_mount_root` is **optional** if you use the default `/mnt/ossfs`.
Even with on-demand mounting, the runtime still needs a deterministic host-side
base directory to place dynamic mounts (`<mount_root>/<bucket>/<subPath?>`).

Optional config example:

```toml
[runtime]
type = "docker"

[storage]
ossfs_mount_root = "/mnt/ossfs"
```

Then start the server:

```bash
opensandbox-server
```

### 2. Install Python SDK

```bash
uv pip install opensandbox
```

If your PyPI version does not include OSSFS volume models yet, install from source:

```bash
pip install -e sdks/sandbox/python
```

### 3. Prepare OSS credentials and target path

```bash
export SANDBOX_DOMAIN=localhost:8080
export SANDBOX_API_KEY=your-api-key
export SANDBOX_IMAGE=ubuntu

export OSS_BUCKET=your-bucket
export OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com
export OSS_ACCESS_KEY_ID=your-ak
export OSS_ACCESS_KEY_SECRET=your-sk
```

## Run

```bash
uv run python examples/docker-ossfs-volume-mount/main.py
```

## Minimal SDK usage snippet

```python
from opensandbox import Sandbox
from opensandbox.models.sandboxes import OSSFS, Volume

sandbox = await Sandbox.create(
    image="ubuntu",
    volumes=[
        Volume(
            name="oss-data",
            ossfs=OSSFS(
                bucket="your-bucket",
                endpoint="oss-cn-hangzhou.aliyuncs.com",
                # version="2.0",   # optional, default is "2.0"
                accessKeyId="your-ak",
                accessKeySecret="your-sk",
            ),
            mountPath="/mnt/data",
            subPath="train",      # optional
            readOnly=False,       # optional
        )
    ],
)
```

## Notes

::: info Implementation details
- Current implementation supports **inline credentials only** (`accessKeyId`/`accessKeySecret`).
- Mounting is **on-demand** in Docker runtime (mount-or-reuse), not pre-mounted for all buckets.
- `ossfs.version` exists in API/SDK with enum `"1.0" | "2.0"`, and defaults to `"2.0"` when omitted.
- Docker runtime now applies **version-specific mount argument encoding**:
  - `1.0`: mounts via `ossfs ... -o <option>`.
  - `2.0`: mounts via `ossfs2 mount ... -c <config-file>` where options are written as `--<option>` config lines.
- `options` values must be **raw payloads** without leading `-` (for example: `allow_other`, `umask=0022`).
:::

## References

- [OSEP-0003: Volume and VolumeBinding Support](https://github.com/opensandbox-group/OpenSandbox/blob/main/oseps/0003-volume-and-volumebinding-support.md)
- [Sandbox Lifecycle API Spec](https://github.com/opensandbox-group/OpenSandbox/blob/main/specs/sandbox-lifecycle.yml)
- [Source code on GitHub](https://github.com/opensandbox-group/OpenSandbox/tree/main/examples/docker-ossfs-volume-mount)
