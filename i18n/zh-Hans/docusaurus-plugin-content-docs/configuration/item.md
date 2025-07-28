---
title: 🗡️ Item
id: item
---

import UrlCard from '@site/src/components/UrlCard';
import Highlight from '@site/src/components/Highlight';

## Overview

**A complete item configuration contains the following sections:**

- **material** <Highlight color="#d64f1aff">**Required**</Highlight>

The `material` serves as the foundational template of the item, such as `paper` or `wooden_sword`.

- **client-bound-material** <Highlight color="#2E8B57">**Optional**</Highlight>

The `client-bound-material` used for this item. You can use this feature to assign completely different base material for items on the server/client side, thereby affecting their specific behaviors in server/client contexts.

- **custom-model-data** <Highlight color="#2E8B57">**Optional**</Highlight>

The `custom-model-data` is a positive integer, and custom items of the same material should possess distinct custom-model-data values. The custom-model-data determines the model displayed for the item and is crucial for the model section below.

- **item-model** (1.21.2+) <Highlight color="#2E8B57">**Optional**</Highlight>

Defines the item model resource location of this item. For instance `default:custom_book`

:::tip
Using custom model data has better version compatibility because it has been released since 1.14 while item_model requires at least 1.21.2

You can use `custom-model-data` and `item-model` at the same time
:::

:::caution
When configuring the model section, you must specify either `custom-model-data` or `item-model`. If your resource pack supports version 1.21.2 or later, the plugin will automatically use the item ID as the value for `item-model`.
:::

- **client-bound-model** <Highlight color="#2E8B57">**Optional**</Highlight> <Highlight color="#272ad8ff">**Default: the global value in config.yml**</Highlight>

- **oversized-in-gui** (1.21.6+) <Highlight color="#2E8B57">**Optional**</Highlight> <Highlight color="#272ad8ff">**Default: true**</Highlight>

- **hand-animation-on-swap** <Highlight color="#2E8B57">**Optional**</Highlight> <Highlight color="#272ad8ff">**Default: true**</Highlight>

- [**data / client-bound-data**](./item/data.md) <Highlight color="#2E8B57">**Optional**</Highlight>

- [**behavior(s)**](./item/behaviors.md) <Highlight color="#2E8B57">**Optional**</Highlight>

- [**settings**](./item/settings.md) <Highlight color="#2E8B57">**Optional**</Highlight>

- [**model / legacy-model**](./item/models.md) <Highlight color="#2E8B57">**Optional**</Highlight>

- [**events**](../reference/events.md) <Highlight color="#2E8B57">**Optional**</Highlight>

- [**category**](./category.md) <Highlight color="#2E8B57">**Optional**</Highlight>

<details>
  <summary>Full Config Overview</summary>

  ```yaml
  items:
    default:palm_log:
      material: paper
      custom-model-data: 1000
      item-model: default:palm_log
      settings:
        fuel-time: 300
        tags:
          - "default:palm_logs"
          - "minecraft:logs"
          - "minecraft:logs_that_burn"
      data:
        display-name: "<!i>Palm Log"
      model:
        type: "minecraft:model"
        path: "minecraft:item/custom/palm_log"
        generation:
          parent: "minecraft:block/custom/palm_log"
      oversized-in-gui: true
      hand-animation-on-swap: true
      client-bound-model: false
      behavior:
        type: block_item
        block: default:palm_log

  ```
</details>