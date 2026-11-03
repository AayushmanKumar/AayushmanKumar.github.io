---
id: neuralphy-pinn
title: NeuralPHY Physics-Informed NNs
subtitle: Solving nonlinear partial differential equations using PyTorch and Autograd
description: Solving partial differential equations (PDEs) for harmonic oscillators, fluid flow, and heat equations using Autograd and PyTorch PINNs.
category: experiments
tags: [PyTorch, PINNs, Scientific ML, Autograd, PDE]
image: https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=700&auto=format&fit=crop&q=80
featured: false
tile: 1x1
liveUrl: https://github.com/AayushmanKumar/neuralphy-pinn
liveUrlLabel: View Code
sourceUrl: https://github.com/AayushmanKumar/neuralphy-pinn
sourceUrlLabel: View Source
completedAt: 2025-07-20
duration: 3 months
---

# NeuralPHY Physics-Informed Neural Networks

Solving partial differential equations (PDEs) for harmonic oscillators, fluid flow, and heat equations using Autograd and PyTorch PINNs.

## Physics-Informed Loss Function

Unlike black-box neural networks, PINNs incorporate physical conservation laws directly into the loss function via automatic differentiation:

$$\mathcal{L}_{total} = \mathcal{L}_{data} + \lambda \mathcal{L}_{physics}$$

Where $\mathcal{L}_{physics}$ enforces the differential operator residual across collocation points in the domain.

## Solved Systems

1. **Damped Harmonic Oscillator**: Verification of kinematic energy dissipation.
2. **1D & 2D Heat Equation**: Heat conduction across anisotropic continuous media.
3. **Navier-Stokes Fluid Dynamics**: Incompressible viscous fluid simulation in closed cavities.

