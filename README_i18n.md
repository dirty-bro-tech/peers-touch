# Jekyll 多语言文档实现指南

本文档详细介绍了在 Peers Touch 项目中如何实现 Jekyll 多语言文档系统。

## 项目中的多语言配置概述

Peers Touch 项目采用了基于数据文件的多语言实现方式，不依赖外部插件，通过简单的配置实现中英文双语支持。

## 核心配置文件

### 1. `_config.yml` 配置

在项目根目录的 `_config.yml` 文件中，包含了多语言的基础配置：

```yaml
# Internationalization
languages: ['en', 'zh']
default_lang: 'en'
exclude_from_localization: ['assets', 'images', 'css', 'js', '_site']

# Navigation (will be translated via i18n data)
navigation:
  - key: nav.overview
    url: /docs/overview/
  - key: nav.technical
    url: /docs/technical/
  - key: nav.product
    url: /docs/product/
  - key: nav.examples
    url: /docs/examples/
```

**配置说明**：
- `languages`: 定义支持的语言代码（英文和中文）
- `default_lang`: 设置默认语言为英文
- `exclude_from_localization`: 指定不需要本地化的目录
- 导航使用 `key` 而非直接写标题，便于翻译

### 2. `_data/i18n.yml` 翻译数据文件

所有翻译内容都存储在 `_data/i18n.yml` 文件中，按语言分组：

```yaml
en:
  site:
    title: "Peers Touch Documentation"
    description: "A comprehensive documentation site for Peers Touch"
    language: "English"
  nav:
    home: "Home"
    overview: "Project Overview"
    # 更多英文翻译...

zh:
  site:
    title: "Peers Touch 文档"
    description: "Peers Touch 的完整文档站点"
    language: "中文"
  nav:
    home: "首页"
    overview: "项目概览"
    # 更多中文翻译...
```

**结构特点**：
- 按语言代码（`en` 和 `zh`）组织翻译
- 采用层级结构，便于管理不同页面的翻译
- 包括站点标题、导航、首页内容、文档内容等的翻译

## 语言切换功能实现

### 语言切换器组件

在 `_includes/language_switcher.html` 中实现了语言切换功能：

```html
<div class="language-switcher">
  <div class="dropdown">
    <button class="dropdown-toggle" type="button" id="languageDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {% assign current_lang = page.lang | default: site.default_lang | default: 'en' %}
      {% if current_lang == 'en' %}
        🇺🇸 English
      {% elsif current_lang == 'zh' %}
        🇨🇳 中文
      {% endif %}
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="languageDropdown">
      {% assign languages = site.languages | default: site.data.languages %}
      {% for lang in languages %}
        {% assign lang_code = lang[0] | default: lang %}
        {% assign lang_name = lang[1].name | default: lang %}
        
        {% if lang_code != current_lang %}
          <li>
            {% if lang_code == site.default_lang %}
              {% assign target_url = page.url | remove_first: '/' | split: '/' | shift | join: '/' | prepend: '/' %}
              {% if target_url == '/' %}{% assign target_url = '/' %}{% endif %}
            {% else %}
              {% assign target_url = page.url | remove_first: '/' | split: '/' | shift | join: '/' | prepend: '/' | prepend: lang_code | prepend: '/' %}
            {% endif %}
            <a href="{{ target_url | relative_url }}" class="language-link" data-lang="{{ lang_code }}">
              {{ flag }} {{ display_name }}
            </a>
          </li>
        {% endif %}
      {% endfor %}
    </ul>
  </div>
</div>
```

**工作原理**：
- 通过 `page.lang` 获取当前页面语言，默认为 `default_lang`
- 显示当前语言和国旗标识
- 计算切换到其他语言时的目标URL
- 实现了简洁的下拉菜单界面

### 在头部集成语言切换器

在 `_includes/header.html` 中，将语言切换器集成到导航栏中：

```html
<header class="site-header" role="banner">
  <div class="wrapper">
    <a class="site-title" rel="author" href="{{ '/' | relative_url }}">
      {% t 'site.title' %}
    </a>

    <nav class="site-nav">
      <!-- 导航触发按钮代码 -->

      <div class="trigger">
        {% for item in site.navigation %}
          <a class="page-link" href="{{ item.url | relative_url }}">
            {% t item.key %}
          </a>
        {% endfor %}
        
        {% include language_switcher.html %}
      </div>
    </nav>
  </div>
</header>
```

## 页面中的翻译使用方法

### 1. 页面元数据翻译

在文档页面的 YAML 前置元数据中，使用翻译标签：

```yaml
---
layout: page
title: "{% t 'docs.overview.title' %}"
description: "{% t 'docs.overview.desc' %}"
permalink: /docs/overview/
nav_order: 1
has_children: true
lang: en
---
```

**注意**：
- 使用 `{% t 'key' %}` 语法引用翻译
- 通过 `lang` 指定当前页面语言

### 2. 页面内容翻译

在文档内容中，同样使用翻译标签：

```markdown
# {% t 'docs.overview.title' %}

{% t 'docs.overview.content' %}

## What is Peers Touch?

Peers Touch is a revolutionary peer-to-peer communication platform designed to create secure, direct connections between devices without relying on centralized servers.
```

## 文档组织方式

Peers Touch 项目采用了两种方式组织多语言文档：

### 1. 分离式文档（推荐）

将不同语言的文档放在不同目录下：

- 英文文档：直接放在 `docs/` 目录下
- 中文文档：放在 `zh/docs/` 目录下

这种方式保持了目录结构的清晰，但需要手动维护对应关系。

### 2. 文件名后缀方式

对于重要的文档，可以在文件名中添加语言后缀：

- 英文：`Product-main-architecture.md`
- 中文：`Product-main-architecture.zh.md`

## 添加新语言或翻译的步骤

### 添加新翻译条目

1. 打开 `_data/i18n.yml` 文件
2. 在相应语言下添加新的翻译键值对
3. 确保翻译键在不同语言中保持一致

### 添加新页面

1. 创建新的 Markdown 文件
2. 在 YAML 前置元数据中设置 `lang` 属性
3. 使用 `{% t 'key' %}` 语法引用翻译
4. 如果是分离式文档，放在对应语言的目录下

### 为现有页面添加翻译

1. 复制原语言页面
2. 重命名文件（使用语言后缀或放在对应语言目录）
3. 修改 YAML 前置元数据中的 `lang` 属性
4. 翻译页面内容（或使用翻译标签）

## 多语言开发最佳实践

1. **统一翻译键命名**：采用一致的命名规则，如 `page.section.item`
2. **避免硬编码文本**：尽量使用 `{% t 'key' %}` 语法，便于统一管理
3. **保持目录结构一致**：不同语言的文档目录结构应保持同步
4. **定期检查缺失翻译**：确保所有语言版本都有完整的翻译
5. **使用语言代码**：在 URL 和文件名中使用标准语言代码

## 常见问题与解决方案

### 问题：语言切换后内容没有变化

**解决方法**：
- 检查页面的 `lang` 属性是否正确设置
- 确认翻译数据中是否存在对应的翻译键
- 验证 `language_switcher.html` 中的 URL 计算逻辑

### 问题：某些元素没有被翻译

**解决方法**：
- 确认这些元素是否使用了 `{% t 'key' %}` 语法
- 检查翻译数据文件中是否包含了这些元素的翻译
- 检查 `exclude_from_localization` 配置是否正确

### 问题：添加新语言后页面无法正常显示

**解决方法**：
- 确保 `_config.yml` 中 `languages` 数组包含了新语言
- 在 `_data/i18n.yml` 中为新语言创建完整的翻译数据
- 更新 `language_switcher.html` 中的语言标识和显示逻辑

## 实际示例：创建多语言文档页面

下面通过一个实际例子，演示如何创建一个新的多语言文档页面。

### 步骤 1: 在 _data/i18n.yml 中添加翻译

```yaml
en:
  docs:
    new_page:
      title: "New Feature Documentation"
      description: "Comprehensive guide for the new feature"
      content: "This is the content of the new feature documentation page."

zh:
  docs:
    new_page:
      title: "新功能文档"
      description: "新功能的综合指南"
      content: "这是新功能文档页面的内容。"
```

### 步骤 2: 创建英文文档页面

在 `docs/` 目录下创建 `new-feature.md` 文件：

```markdown
---
layout: page
title: "{% t 'docs.new_page.title' %}"
description: "{% t 'docs.new_page.description' %}"
permalink: /docs/new-feature/
nav_order: 5
lang: en
---

# {% t 'docs.new_page.title' %}

{% t 'docs.new_page.content' %}

## Features

- Feature 1 description
- Feature 2 description
- Feature 3 description

## How to Use

1. Step 1 instructions
2. Step 2 instructions
3. Step 3 instructions
```

### 步骤 3: 创建中文文档页面

在 `zh/docs/` 目录下创建 `new-feature.md` 文件：

```markdown
---
layout: page
title: "{% t 'docs.new_page.title' %}"
description: "{% t 'docs.new_page.description' %}"
permalink: /zh/docs/new-feature/
nav_order: 5
lang: zh
---

# {% t 'docs.new_page.title' %}

{% t 'docs.new_page.content' %}

## 功能特点

- 功能1描述
- 功能2描述
- 功能3描述

## 使用方法

1. 步骤1说明
2. 步骤2说明
3. 步骤3说明
```

### 步骤 4: 更新导航配置

如果需要在导航菜单中添加新页面，修改 `_config.yml`：

```yaml
navigation:
  - key: nav.overview
    url: /docs/overview/
  - key: nav.technical
    url: /docs/technical/
  - key: nav.product
    url: /docs/product/
  - key: nav.examples
    url: /docs/examples/
  - key: nav.new_feature
    url: /docs/new-feature/
```

然后在 `_data/i18n.yml` 中添加导航翻译：

```yaml
en:
  nav:
    # 其他导航项
    new_feature: "New Feature"

zh:
  nav:
    # 其他导航项
    new_feature: "新功能"
```

## 多语言文档快速参考指南

### 翻译引用语法

```liquid
{% t 'key' %}
```

### 获取当前语言

```liquid
{% assign current_lang = page.lang | default: site.default_lang | default: 'en' %}
```

### 语言条件判断

```liquid
{% if current_lang == 'en' %}
  English content
{% elsif current_lang == 'zh' %}
  中文内容
{% endif %}
```

### 生成其他语言链接

```liquid
{% if lang_code == site.default_lang %}
  {% assign target_url = page.url | remove_first: '/' | split: '/' | shift | join: '/' | prepend: '/' %}
{% else %}
  {% assign target_url = page.url | remove_first: '/' | split: '/' | shift | join: '/' | prepend: '/' | prepend: lang_code | prepend: '/' %}
{% endif %}
```

### 排除特定文件不进行本地化

在 `_config.yml` 中设置：

```yaml
exclude_from_localization: ['assets', 'images', 'css', 'js', '_site']
```

在页面前置元数据中设置：

```yaml
exclude_from_i18n: true
```

---

通过以上配置和实践，Peers Touch 项目成功实现了 Jekyll 多语言文档系统，为不同语言的用户提供了良好的阅读体验。通过本指南，您可以轻松地为项目添加新的语言支持或更新现有翻译内容。