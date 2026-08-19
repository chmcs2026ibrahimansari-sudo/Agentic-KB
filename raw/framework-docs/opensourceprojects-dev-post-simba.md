---
title: "Simba: an open-source customer service assistant built around evaluation | Open-source Projects | Open-source Projects"
source_url: "https://www.opensourceprojects.dev/post/simba"
captured: 2026-08-18T23:09:03-0700
captured_by: hermes-agentic-kb-scout
word_count: 942
status: unprocessed
---

Source note: Apple Notes 2026-08-15 via @GithubProjects: Simba project writeup; verify npm/package/repo and extract eval/retrieval/generation/latency metric design.
Extraction method: direct-html
Extraction attempts: jina:401; direct:200:text/html; charset=utf-8

## Project Description

A-AA+

[View on GitHub](https://github.com/GitHamza0206/simba?utm_source=opensourceprojects.dev&ref=opensourceprojects.dev)

# Stop Guessing Whether Your AI Customer Service Actually Works

You've probably built a chatbot, or at least tried to. And if you have, you know the sinking feeling of deploying something that seems fine in testing but quietly falls apart in production. Generic answers, hallucinated facts, slow responses—and no real way to measure any of it. That's the problem [Simba](https://github.com/GitHamza0206/simba) sets out to solve: an open-source customer service assistant that puts evaluation at the center of everything, so you're never flying blind.

## What It Does

Simba is a self-hosted customer service assistant built around a RAG (retrieval-augmented generation) pipeline. Instead of being a black box you plug in and hope for the best, it's designed to give you full visibility into how well it's actually performing.

The architecture is modular. You bring your own data, and Simba handles the retrieval and generation around it. The core pieces include a Python backend (`simba-core`), a Next.js dashboard for managing documents and monitoring conversations, and an npm package (`simba-chat-widget`) that drops a chat widget onto your website with a single install.

The key design philosophy here is evaluation-first. Simba tracks retrieval accuracy, generation quality, and latency out of the box. You're not just getting a chatbot—you're getting a system that tells you how well that chatbot is doing, where it's struggling, and whether your changes are actually helping or hurting.

## Why It's Cool

Most customer service AI tools are a trade-off: you get convenience but lose control. Simba flips that. Here's what stands out:

- **Evaluation built in, not bolted on.** This is the big one. Most projects treat evaluation as an afterthought—something you hack together after the fact. Simba has retrieval and generation metrics from day one. That means you can actually iterate with confidence, knowing whether a change to your chunking strategy or embedding model improved things or broke them.
- **Every component is swappable.** Embedding models, LLMs, vector stores, chunking strategies, rerankers—you can swap any of them. That's a level of flexibility that's rare in this space. If you want to test Llama against GPT-4, or try a different vector database, you don't need to rip out the whole system. You just change a component.
- **The npm widget is genuinely drop-in.** Integration is the part that kills most projects, and Simba handles it with a single package. The README shows a GIF of the integration process, and the pitch is one command to get a working chat widget on your site. That's the kind of friction removal that makes adoption actually feasible.
- **It's production-ready, not a demo.** Streaming responses, async processing, and a scalable architecture. The Docker setup supports both CPU and NVIDIA GPU, which tells you it's built for real workloads, not just toy examples.
- **No vendor lock-in.** Because it's open-source and self-hosted, you own the whole stack. If a component stops working for you, you replace it. If you want to fork it and modify the dashboard, you can. That's a rare level of agency in the AI assistant space.

## How to Try It

The fastest path is Docker. Clone the repo, set up your environment file, and you're running:

```
git clone https://github.com/GitHamza0206/simba.git
cd simba
```

Create a `.env` file with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key
```

Then build and start with make:

```
# CPU
DEVICE=cpu make build && make up

# NVIDIA GPU
DEVICE=cuda make build && make up
```

Once it's up, visit `http://localhost:3000` to access the dashboard.

If you'd rather skip Docker, you can install the Python package directly:

```
pip install simba-core
```

Then start the server and frontend:

```
simba server
simba front
```

For the website widget, you'd install the npm package:

```
npm install simba-chat-widget
```

There's also a neat touch for anyone using Claude Code: the repo supports a `/setup --all` command that installs all dependencies and starts infrastructure services automatically. You can also scope it down with `/setup --backend`, `/setup --frontend`, or `/setup --services` depending on what you need.

Head over to the [GitHub repository](https://github.com/GitHamza0206/simba) for the full README and details.

## Final Thoughts

Simba is for teams that have been burned by the "just use this AI tool" approach and want something they can actually inspect, measure, and tune. It's not the easiest option out there—you're running your own infrastructure and managing your own pipeline—but for anyone who needs visibility into their AI's performance, that trade-off is worth it. The evaluation-first design is the kind of thinking that separates hobby projects from systems you can trust in production. If you're building customer service tooling and you're tired of guessing, Simba is worth a serious look.

---

*Follow @githubprojects for more developer tools and open source projects.*

📧

**Did you like this read?** Join our newsletter and you will get weekly top stories like this delivered to your inbox. No spam etc.

#### Join our weekly newsletter

Subscribe to our newsletter to get the latest updates on open-source projects.

### Love discovering amazing projects?

Help us showcase more incredible open-source projects by sponsoring a featured spot. Your project could be the next big discovery for thousands of developers.

Premium visibilityDeveloper audienceBoost engagement

[Sponsor a Spot](/sponsor-us)

### Contributors

@githubprojects

2

Total PostsPosts

1

ContributorsUsers

August 12

CreatedDate
