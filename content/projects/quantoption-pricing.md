---
id: quantoption-pricing
title: QuantOption Pricing Platform
subtitle: Multi-model options pricing platform with Black-Scholes, Monte Carlo, and ML regressors
description: Real-time option pricing platform with Black-Scholes-Merton, Monte Carlo simulations, and XGBoost regressors achieving <2% deviation on market data.
category: experiments
tags: [Python, Monte Carlo, XGBoost, Streamlit, Black-Scholes]
image: https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=700&auto=format&fit=crop&q=80
featured: false
tile: 1x1
liveUrl: https://github.com/AayushmanKumar/quantoption-pricing
liveUrlLabel: Live App
sourceUrl: https://github.com/AayushmanKumar/quantoption-pricing
sourceUrlLabel: View Source
completedAt: 2025-06-15
duration: 2 months
---

# QuantOption Pricing Platform

Real-time option pricing platform with Black-Scholes-Merton, Monte Carlo simulations, and XGBoost regressors achieving <2% deviation on market data.

## Mathematical Models

- **Black-Scholes-Merton (BSM)**: Closed-form analytical solution for European call and put options with Greeks derivation (Delta, Gamma, Vega, Theta, Rho).
- **Monte Carlo Simulations**: Geometric Brownian Motion (GBM) path simulations with antithetic variate variance reduction over 100,000 runs.
- **Binomial Tree (CRR)**: Lattice modeling for American options handling early exercise conditions.
- **Machine Learning Regressors**: XGBoost and Random Forest models trained on historical implied volatility surfaces.

## Accuracy & Speed

- Achieved **95%+ accuracy** across Apple (AAPL) and index options, with Monte Carlo and BSM within a 2% margin of live exchange quotes.
- Reduced pricing computation from hours of offline calculation to under 200 milliseconds per surface.

