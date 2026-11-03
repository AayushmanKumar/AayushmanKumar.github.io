---
id: api-triage-agent
title: Production API Triage Agent
subtitle: Asynchronous multi-modal incident triage pipeline for mAPI microservices
description: Asynchronous pipeline using Python asyncio to concurrently fetch Prometheus metrics, pod logs, and Jira context, slashing incident triage time from 20 minutes to under 30 seconds.
category: work
tags: [Python, asyncio, LiteLLM, Kubernetes, Prometheus]
image: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=700&auto=format&fit=crop&q=80
featured: false
tile: 1x1
liveUrl: https://github.com/AayushmanKumar/api-triage-agent
liveUrlLabel: View Architecture
sourceUrl: https://github.com/AayushmanKumar/api-triage-agent
sourceUrlLabel: View Source
completedAt: 2026-06-30
duration: 2 months
---

# Production API Triage Agent

Asynchronous pipeline using Python `asyncio` to concurrently fetch Prometheus metrics, pod logs, and Jira context, slashing incident triage time from 20 minutes to under 30 seconds.

## Overview

When critical microservices trigger PagerDuty alerts, on-call engineers spend precious minutes manually correlating Grafana dashboards, querying Kubernetes pod logs, and hunting through past incident post-mortems. This autonomous agent collects telemetry in parallel, isolates root causes, and recommends remediation steps in seconds.

## Key Features

- **Concurrent Diagnostics**: Leverages `asyncio.gather()` to fetch Prometheus metrics, Loki logs, and deployment diffs simultaneously.
- **3-Mode Resilient Execution**: Supports Deterministic Rule-based, Hybrid Evidence-gathering + LLM Synthesis, and Full Agentic execution via LiteLLM.
- **Bring-Your-Own-Key (BYOK)**: Multi-provider support across OpenAI, Anthropic, and local Ollama models.
- **Model Context Protocol (MCP)**: Ported TypeScript MCP servers to Python for direct debug proxy calls, resolving upstream transport protocol mismatches.

## Incident Resolution Flow

1. **Alert Ingestion**: Webhook payload triggers agent with service name and error signature.
2. **Telemetry Harvesting**: Parallel queries to Prometheus (P99 latency, error rates) and Kubernetes pod logs.
3. **Synthesis & Root Cause Analysis**: LLM synthesizes logs against historical Jira postmortems.
4. **Actionable Output**: Posts structured summary with confidence score to Slack/Teams triage channel.

## Performance Impact

- Slashed production incident triage time from 15-20 minutes to under 30 seconds.
- 100% deterministic pipeline uptime in fallback mode during external LLM API outages.

