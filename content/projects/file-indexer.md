---
id: file-indexer
title: Versioned File Indexer
subtitle: High-throughput C++20 multithreaded UNIX indexer with POSIX mmap I/O
description: High-throughput C++ UNIX indexer with producer-consumer multithreading, POSIX mmap I/O, achieving 1.33 GiB/s parallel throughput across worker threads.
category: experiments
tags: [C++20, POSIX, Multithreading, mmap, Systems]
image: https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&auto=format&fit=crop&q=80
featured: false
tile: 1x1
liveUrl: https://github.com/AayushmanKumar/versioned-file-indexer
liveUrlLabel: View GitHub
sourceUrl: https://github.com/AayushmanKumar/versioned-file-indexer
sourceUrlLabel: View Source
completedAt: 2026-09-15
duration: 2 months
---

# Versioned File Indexer

High-throughput C++ UNIX indexer with producer-consumer multithreading, POSIX mmap I/O, achieving 1.33 GiB/s parallel throughput across worker threads.

## System Architecture

Designed to process massive code repositories and versioned text files using fixed-size buffers and bounded memory overhead.

### Key Capabilities

- **Word-Frequency & Top-K Queries**: Real-time ranking with min-heap accumulators and hash tables.
- **Version Diffs**: Instant AST and token-based version comparison across file revisions.
- **Producer-Consumer Pipeline**: Bounded task queues, condition variables, and worker-local indexes preventing lock contention.
- **Durable Linux Persistence**: File and directory `fsync`, atomic file renames, and fork/exec pipe IPC indexing.

## Benchmark Results

- **POSIX I/O vs mmap**: Measured `282.77 MiB/s` single-core throughput with `mmap`, outperforming standard buffered `read()` by 6.6%.
- **Parallel Scalability**: Achieved **4.80x parallel speedup**, scaling total throughput from `284 MiB/s` to **1.33 GiB/s** across 8 worker threads.

