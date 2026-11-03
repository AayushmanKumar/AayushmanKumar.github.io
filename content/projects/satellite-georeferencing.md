---
id: satellite-georeferencing
title: Satellite Image Georeferencing
subtitle: Automated SIFT feature matching and RANSAC polynomial geo-coding
description: Automated geo-coding framework using SIFT feature matching, RANSAC outlier rejection, and custom least-squares polynomial transformation.
category: work
tags: [SIFT, RANSAC, Computer Vision, GIS, Python]
image: https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=700&auto=format&fit=crop&q=80
featured: false
tile: 1x1
liveUrl: https://github.com/AayushmanKumar/satellite-georeferencing
liveUrlLabel: View Tool
sourceUrl: https://github.com/AayushmanKumar/satellite-georeferencing
sourceUrlLabel: View Source
completedAt: 2025-01-25
duration: 1 month
---

# Satellite Image Georeferencing

Automated geo-coding framework using SIFT feature matching, RANSAC outlier rejection, and custom least-squares polynomial transformation.

## Algorithmic Pipeline

1. **Ground Control Point (GCP) Acquisition**: Keypoint detection using Scale-Invariant Feature Transform (SIFT).
2. **Outlier Filtering**: Random Sample Consensus (RANSAC) rejecting false-positive geographic correspondences.
3. **N-th Order Polynomial Fitting**: Custom Least-Squares solver computing spatial transformation matrices.
4. **Resampling**: Support for Nearest-Neighbor, Bilinear, and Bicubic interpolation warping.

## Precision

- Sub-pixel registration accuracy (RMSE ~ 0.7 px) achieved across multi-sensor satellite passes.
- Generates automated quality control reports with spatial displacement vectors.

