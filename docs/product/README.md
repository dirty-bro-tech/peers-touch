---
layout: page
title: "{% t 'docs.product.title' %}"
description: "{% t 'docs.product.desc' %}"
permalink: /docs/product/
nav_order: 2
has_children: true
lang: en
created_date: 2024-01-15
updated_date: 2025-09-25
changelog: |
  - 2024-01-15: 初始版本创建
  - 2025-09-25: 添加编写日期、更新日期和更新日志字段
---

<div class="card-grid">
  <a href="product-feature-design.{{ page.lang }}.html" class="card-item">
    <div class="card-image">
      <img src="{{ '/assets/images/peers-logo.jpeg' | relative_url }}" alt="Product Feature Design">
    </div>
    <div class="card-content">
      <h3>{% t 'docs.product.feature_design.title' %}</h3>
      <p>{% t 'docs.product.feature_design.description' %}</p>
    </div>
  </a>
  <a href="product-main-architecture.{{ page.lang }}.html" class="card-item">
    <div class="card-image">
      <img src="{{ '/assets/images/peers-logo.jpeg' | relative_url }}" alt="Main Architecture">
    </div>
    <div class="card-content">
      <h3>{% t 'docs.product.main_architecture.title' %}</h3>
      <p>{% t 'docs.product.main_architecture.description' %}</p>
    </div>
  </a>
  <a href="product-main-design.{{ page.lang }}.html" class="card-item">
    <div class="card-image">
      <img src="{{ '/assets/images/peers-logo.jpeg' | relative_url }}" alt="Main Design">
    </div>
    <div class="card-content">
      <h3>{% t 'docs.product.main_design.title' %}</h3>
      <p>{% t 'docs.product.main_design.description' %}</p>
    </div>
  </a>
  <a href="product-main-hardware.{{ page.lang }}.html" class="card-item">
    <div class="card-image">
      <img src="{{ '/assets/images/peers-logo.jpeg' | relative_url }}" alt="Main Hardware">
    </div>
    <div class="card-content">
      <h3>{% t 'docs.product.main_hardware.title' %}</h3>
      <p>{% t 'docs.product.main_hardware.description' %}</p>
    </div>
  </a>
  <a href="../technical/" class="card-item">
    <div class="card-image">
      <img src="{{ '/assets/images/peers-logo.jpeg' | relative_url }}" alt="Technical">
    </div>
    <div class="card-content">
      <h3>{% t 'docs.technical.title' %}</h3>
      <p>{% t 'docs.technical.description' %}</p>
    </div>
  </a>
  <a href="../examples/" class="card-item">
    <div class="card-image">
      <img src="{{ '/assets/images/peers-logo.jpeg' | relative_url }}" alt="Examples">
    </div>
    <div class="card-content">
      <h3>{% t 'docs.examples.title' %}</h3>
      <p>{% t 'docs.examples.description' %}</p>
    </div>
  </a>
</div>