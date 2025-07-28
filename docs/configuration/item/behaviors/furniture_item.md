---
title: 🪑 Furniture Item
id: furniture_item
---

## Introduction

**Furniture Item** is an item that is bound to a piece of furniture. You can configure its corresponding furniture ID here, or even the entire furniture configuration. When you bind this behavior to an item, you can place it by right-clicking.

```yaml
items:
  default:bench:
    behavior:
      type: furniture_item
      furniture: default:bench
furniture:
  default:bench:
    settings: ...
    placement: ...
    loot: ...
```

or

```yaml
items:
  default:bench:
    behavior:
      type: block_item
      block: 
        settings: ...
        placement: ...
        loot: ...
```

![](/img/furniture_item_1.png)