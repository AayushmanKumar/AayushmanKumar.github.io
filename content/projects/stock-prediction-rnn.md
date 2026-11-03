---
id: stock-prediction-rnn
title: Stock Prediction using Hybrid RNNs
subtitle: Time-series forecasting with ARIMA-LSTM and SARIMAX-LSTM hybrid models
description: Predictive forecasting engine leveraging LSTM networks (64-32-16 units) and hybrid ARIMA-LSTM architectures achieving 92% directional accuracy.
category: experiments
tags: [PyTorch, LSTM, ARIMA, Time Series, SARIMAX]
image: https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=700&auto=format&fit=crop&q=80
featured: false
tile: 1x1
liveUrl: https://github.com/AayushmanKumar/stock-prediction-rnn
liveUrlLabel: View Models
sourceUrl: https://github.com/AayushmanKumar/stock-prediction-rnn
sourceUrlLabel: View Source
completedAt: 2025-03-30
duration: 3 months
---

# Stock Prediction using Hybrid RNNs

Predictive forecasting engine leveraging LSTM networks (64-32-16 units) and hybrid ARIMA-LSTM architectures achieving 92% directional accuracy.

## Architecture & Methodology

Financial time series exhibit strong non-stationarity, regime shifts, and noisy price fluctuations. This project combines classical statistical econometrics with recurrent deep learning architectures:

- **Statistical Pre-filtering**: Augmented Dickey-Fuller (ADF) tests for stationarity; ACF/PACF plots for order selection.
- **ARIMA / SARIMAX Baseline**: Models linear seasonal trends and auto-regressive properties.
- **Multi-layer LSTM**: Stacked LSTM (64 -> 32 -> 16 hidden units) trained on residual error vectors from ARIMA.

## Results

- **92% Directional Accuracy**: Correctly anticipated price movement sign over next-day trading intervals.
- **15% MAPE Improvement**: Mean Absolute Percentage Error superior to standalone LSTM and classical ARIMA models.

