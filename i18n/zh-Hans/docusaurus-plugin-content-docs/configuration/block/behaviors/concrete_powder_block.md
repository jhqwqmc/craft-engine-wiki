---
title: 💦 Concrete Powder Block
id: concrete_powder_block
---

**Concrete Powder Block** is a type of block that hardens when it comes into contact with water.

```yml
blocks:
  default:gunpowder_block:
    behavior:
      type: concrete_powder_block
      solid-block: default:solid_gunpowder_block
```

![](/img/concrete_powder_block.png)

:::warning

Currently, powder cannot turn into solid blocks upon contacting water while in a falling entity state. This is because this piece of code is hardcoded in Minecraft, and we cannot modify its behavioral logic.

:::