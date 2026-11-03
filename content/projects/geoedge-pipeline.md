---
id: geoedge-pipeline
title: GeoEdge CV Pipeline
subtitle: High-throughput geospatial boundary delineation with SIMD vectorization
description: High-throughput boundary delineation pipeline with separable Gaussian filters and C++20 SIMD vectorization processing 100M+ pixels in under 12 seconds.
category: work
tags: [C++20, OpenCV, GDAL, SIMD, Computer Vision]
image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&auto=format&fit=crop&q=80
featured: false
tile: 1x1
liveUrl: https://github.com/AayushmanKumar/geoedge-pipeline
liveUrlLabel: View Repository
sourceUrl: https://github.com/AayushmanKumar/geoedge-pipeline
sourceUrlLabel: View Source
completedAt: 2025-08-01
duration: 3 months
---

# GeoEdge Computer Vision Pipeline

High-throughput boundary delineation pipeline with separable Gaussian filters and C++20 SIMD vectorization processing 100M+ pixels in under 12 seconds.

## Overview

Processing massive satellite raster files (GeoTIFF) requires efficient memory management and CPU cache utilization. GeoEdge implements a high-throughput edge detection and segmentation engine tailored for geospatial terrain boundaries.

## Technical Innovations

- **Separable Convolutions**: Replaced 2D kernel convolutions with 1D horizontal and vertical passes, reducing arithmetic complexity from $O(K^2)$ to $O(2K)$.
- **AVX2 / SIMD Vectorization**: Vectorized pixel intensity gradient calculations across 8-wide float registers.
- **GDAL Memory Mapping**: Direct tile streaming directly from disk, preventing Out-Of-Memory (OOM) crashes on multi-gigabyte images.

## Performance Metrics

- Processed over 100,000,000 multi-band pixels in under 12 seconds.
- 78% reduction in memory footprint compared to naive OpenCV raster loading.

