---
id: grafana-observability
title: Grafana Observability Dashboard
subtitle: Dynamic PromQL auto-discovery and real-time latency bottleneck detection
description: Real-time latency and traffic observability across Java mAPI backend services with dynamic PromQL auto-discovery and P99-sorted bottleneck detection.
category: work
tags: [Grafana, Prometheus, PromQL, JMX Exporter]
image: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&auto=format&fit=crop&q=80
featured: false
tile: 1x1
liveUrl: https://github.com/AayushmanKumar/grafana-observability
liveUrlLabel: View Dashboard
sourceUrl: https://github.com/AayushmanKumar/grafana-observability
sourceUrlLabel: View Source
completedAt: 2026-06-15
duration: 1 month
---

# Grafana Observability Dashboard

Real-time latency and traffic observability across Java mAPI backend services with dynamic PromQL auto-discovery and P99-sorted bottleneck detection.

## Overview

Unified, real-time latency and traffic observability across Java mAPI backend services and all onboarded downstream microservices.

## Engineering Highlights

- **Dynamic PromQL Queries**: Utilized `label_replace` and regular expressions to auto-discover newly registered downstream microservices without requiring manual dashboard reconfiguration.
- **Multi-Dimensional Metrics**: Visualized Mean, P50, P99, Max latency, and RPS using metrics exported via Prometheus JMX Exporter.
- **Noise Isolation**: Isolated successful request timers from transient network error spikes to prevent metric skewing.
- **Template Variables**: Configured dynamic Grafana variables for multi-environment (Prod vs Staging) filtering.

## Impact

Provided instant root-cause visibility for downstream bottlenecks via P99-sorted auto-aggregations, significantly reducing Mean Time to Detect (MTTD) for latency regressions.

