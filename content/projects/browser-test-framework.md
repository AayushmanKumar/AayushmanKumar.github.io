---
id: browser-test-framework
title: AI Browser Test Automation Framework
subtitle: Natural-language-driven browser automation engine with Gemini Flash and Playwright
description: Natural-language-driven browser automation engine utilizing TreeWalker DOM serialization and Google Gemini Flash to eliminate flaky XPath/CSS selectors across e-commerce flows.
category: work
tags: [TypeScript, Playwright, Gemini Flash, Node.js]
image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80
featured: true
tile: 1x2
liveUrl: https://github.com/AayushmanKumar/browser-test-framework
liveUrlLabel: View Demo
sourceUrl: https://github.com/AayushmanKumar/browser-test-framework
sourceUrlLabel: View Source
completedAt: 2026-07-15
duration: 3 months
---

# AI Browser Test Automation Framework

Natural-language-driven browser automation engine utilizing TreeWalker DOM serialization and Google Gemini Flash to eliminate flaky XPath/CSS selectors across dynamic e-commerce flows.

## Overview

Traditional end-to-end browser tests break frequently due to dynamic CSS class names, shadow DOMs, and shifting layout hierarchies. This engine introduces an autonomous execution pipeline that observes page states, reasons about user intents expressed in plain English, and drives Playwright with high resilience against frontend redesigns.

## Objectives

- Eliminate high maintenance overhead and flakiness of hardcoded CSS/XPath selectors across dynamic e-commerce pages.
- Build an execution system capable of parsing unstructured test specifications into verifiable browser actions.
- Minimize token cost and inference latency when feeding rich DOM trees to multi-modal LLMs.

## Technical Approach

### DOM TreeWalker Serialization
Engineered a specialized DOM serialization engine utilizing native `document.createTreeWalker` to extract, deduplicate, and target the deepest text-bearing interactive elements, flattening LLM token overhead by over 70%.

```typescript
// Optimized DOM tree flattening using TreeWalker
const walker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT,
  {
    acceptNode(node: HTMLElement) {
      if (node.offsetParent === null) return NodeFilter.FILTER_REJECT;
      const isInteractive = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(node.tagName);
      return isInteractive ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  }
);
```

### Depth-Indexed Conditional Execution
Integrated Playwright with Google Gemini Flash using a custom depth-indexed stack to support arbitrarily nested `IF/THEN` conditional execution flows without requiring formal grammar parsers.

### Zero-Dependency Real-Time Dashboard
Built a lightweight, zero-dependency test execution dashboard using native Node.js `http` and Server-Sent Events (SSE) for live step-by-step telemetry streaming.

## Outcomes & Benchmarks

- **8-12x Faster Execution**: Validated across 10+ core end-to-end critical flows (Homepage, PDP, Cart, Checkout).
- **1.4x Lower Token Consumption**: Compared to screenshot-based vision automation agents.
- **Self-Healing Selectors**: Zero manual locator repairs required across dynamic frontend UI experiments.

