---
id: elb-diff-console
title: ELB Response Diff Console
subtitle: Semantic JSON diff proxy and regression console for staging vs production verification
description: Secure Java reverse proxy equipped with an order-agnostic semantic JSON diff algorithm matching objects by key and arrays by identity to eliminate false-positive diffs.
category: work
tags: [Java, Dropwizard, JAX-RS, Vanilla JS, Handlebars]
image: https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=700&auto=format&fit=crop&q=80
featured: false
tile: 1x1
liveUrl: https://github.com/AayushmanKumar/elb-diff-console
liveUrlLabel: View Demo
sourceUrl: https://github.com/AayushmanKumar/elb-diff-console
sourceUrlLabel: View Source
completedAt: 2026-05-30
duration: 1 month
---

# ELB Response Diff Console

Secure Java reverse proxy equipped with an order-agnostic semantic JSON diff algorithm matching objects by key and arrays by identity to eliminate false-positive diffs.

## Overview

Pre-release deployment verification across staging and production backend targets often suffers from subtle structural regressions. Traditional text-based diff tools produce dozens of false positives due to harmless JSON key reordering and timestamp variations.

## Key Features

- **Reverse Proxy Core**: Built with Java (Dropwizard, JAX-RS, Apache HttpClient) featuring a raw cURL parser and dynamic URL transformer to bypass browser CORS and IP restrictions.
- **Semantic Diff Algorithm**: Order-agnostic JSON diff matching objects by key and arrays by identity, eliminating false positives caused by key/array reordering.
- **Lazy-Evaluated Multi-Tab UI**: Minimalist Vanilla JS and Handlebars frontend rendering sub-second visual diffs across UI slots, downstream microservice calls, and raw JSON payloads.
- **UUID Snapshot Reports**: Automated report generation service saving self-contained diff snapshots with a 30-day TTL lifecycle and daily cleanup jobs.

## Results

- Reduced release validation time from 15-20 minutes to under 30 seconds.
- Completely eliminated false-positive diffs and external copy-paste friction across engineering teams.

