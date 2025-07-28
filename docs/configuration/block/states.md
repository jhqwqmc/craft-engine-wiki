---
title: 🔣 Block States
id: states
---

## Introduction

In Minecraft's block system, each block has one or more block states. For example, wood has a facing direction, and leaves have different distances. These states determine how the block behaves and appears in the game.


![](/img/block_states_1.png)

## Single-State Block

Most blocks only require a single state to function properly. The example below shows how to configure a single-state block.

```yaml
blocks:
  default:chinese_lantern:
    state:
      id: 15
      state: note_block:15
      model:
        path: "minecraft:block/custom/chinese_lantern"
        generation:
          parent: "minecraft:block/cube_column"
          textures:
            "end": "minecraft:block/custom/chinese_lantern_top"
            "side": "minecraft:block/custom/chinese_lantern"
```

### Internal Id

```yaml
blocks:
  default:chinese_lantern:
    state:
      id: 15
```

The **id** represents a unique identifier for blocks. For example, `15` in this case would correspond to `craftengine:note_block_15`. 

:::caution
The **15** in `id: 15` is completely unrelated to the **15** in `state: note_block:15`. I will explain it later.
:::

:::info

The maximum number of **id** is determined by the sum of two factors:

1. **Available Block Appearance States**: These are defined in the `mappings.yml` file. For a single block type, the more free block states you "release," the higher the number of available appearance states.
2. **Additionally Registered Real States**: These are added via the `additional-real-blocks.yml` file. This configuration allows you to manually register extra real serverside states for specific blocks, further increasing the total pool of internal IDs.

:::

### Visual State

```yaml
blocks:
  default:chinese_lantern:
    state: note_block:15
```
The `state` refers to the visual appearance seen by clients. These states are the vanilla block states we freed in the **mappings.yml** file. The maximum number of available states is determined by the Minecraft version and is strictly limited. `note_block:15` refers to the **16th** released note_block block state (zero-indexed).

![](/img/block_states_2.png)![](/img/block_states_3.png)

:::tip

You can configure state like this if you want to precisely control the appearance state in use.
```yaml
state: minecraft:note_block[instrument=hat,note=0,powered=false]
```
:::

### Model

```yaml
blocks:
  default:chinese_lantern:
    state:
      model:
        path: "minecraft:block/custom/chinese_lantern"
        generation:
          parent: "minecraft:block/cube_column"
          textures:
            "end": "minecraft:block/custom/chinese_lantern_top"
            "side": "minecraft:block/custom/chinese_lantern"
```

The `model` determines which 3D model will replace the released vanilla block state. In addition to standard block models, CraftEngine allows further configuration of randomized models and model rotation.

:::caution

If you are unsure how to configure properties like `path` and `generation`, you should complete [Tutorial](../../getting_start.md) firstly.

:::

#### Weighted Models

To achieve randomized models, just provide model paths in a list format:

```yaml
state:
  models: # model(s)
    - path: "minecraft:block/custom/fairy_flower_1"
      weight: 8
    - path: "minecraft:block/custom/fairy_flower_2"
      weight: 5
    - path: "minecraft:block/custom/fairy_flower_3"
      weight: 2
```

> weight: Sets the probability of the model for being used in the game, defaults to 1 (=100%). If more than one model is used for the same variant, the probability is calculated by dividing the individual model's weight by the sum of the weights of all models. (For example, if three models are used with weights 1, 1, and 2, then their combined weight would be 4 (1+1+2). The probability of each model being used would then be determined by dividing each weight by 4: 1/4, 1/4 and 2/4, or 25%, 25% and 50%, respectively.)

![](/img/block_states_4.png)

#### Rotation

If you need to create a piece of wood with three different orientations, all you need to do is specify the x and y properties. 

```yaml
model:
  path: "minecraft:block/custom/chinese_lantern"
  x: 90
  y: 180
  uvlock: false
```

> x: Rotation of the model on the x-axis in increments of 90 degrees.\
> y: Rotation of the model on the y-axis in increments of 90 degrees.\
> uvlock: Can be true or false (default). Locks the rotation of the texture of a block, if set to true. This way the texture does not rotate with the block when using the x and y-tags above.

## Multi-State Block

:::warning

The following content may become difficult to understand. I will explain it in as much detail as possible. Please make sure to read it **word by word**.

:::

The first step in creating a multi-state block is to define the type of state **property** for that block. In this example, I've set an `axis` property.

```yaml
blocks:
  default:palm_log:
    states: # state(s)
      properties:
        axis:             # Property name
          type: axis      # Data type
          default: y      # Default value
```

### Property 

The property name is almost arbitrary, but I recommend using lowercase letters. However, the plugin hardcodes certain names for special placement behaviors. For example, when a property is named `axis`, the plugin will automatically align its orientation during placement. This entire process is fully automated.

In the following example, since the property is named `custom_axis`, the plugin will NOT apply rotation during placement. No matter how you place it, the block will always use the state `custom_axis=y` when placed.

```yaml
custom_axis:
  type: axis
  default: y 
```

:::tip

You can find detailed information about property types and the plugin's hardcoded property names on [ℹ️ Properties](./states/properties.md).

:::

### Appearance

In the second step, we need to configure the possible visual appearances for the custom block. For example, a log block requires three orientations, so we need to assign three vanilla states as its visual representations.

```yaml
blocks:
  default:palm_log:
    states:
      appearances:
        axisY:
          state: "note_block:0"
          model:
            path: "minecraft:block/custom/stripped_palm_log"
            generation:
              parent: "minecraft:block/cube_column"
              textures:
                "end": "minecraft:block/custom/palm_log_top"
                "side": "minecraft:block/custom/palm_log"
        axisX:
          state: "note_block:1"
          model:
            x: 90
            y: 90
            path: "minecraft:block/custom/stripped_palm_log_horizontal"
            generation:
              parent: "minecraft:block/cube_column_horizontal"
              textures:
                "end": "minecraft:block/custom/palm_log_top"
                "side": "minecraft:block/custom/palm_log"
        axisZ:
          state: "note_block:2"
          model:
            x: 90
            path: "minecraft:block/custom/stripped_palm_log_horizontal"
            generation:
              parent: "minecraft:block/cube_column_horizontal"
              textures:
                "end": "minecraft:block/custom/palm_log_top"
                "side": "minecraft:block/custom/palm_log"
```

:::info

In the configuration above, `axisX`, `axisZ`, and `axisY` are arbitrary names. You can use any descriptive terms that clearly represent the visual states, as long as they are unique.

The configuration of `state` and `model(s)` follows the same rules as single-state blocks. If you're unsure about any details, please refer back to the relevant documentation.

:::

### Variant

Now for the final step: We need to combine all custom properties, list all possible combinations, and assign internal block IDs to each. If you're unfamiliar with **internal ID**, please review the relevant documentation.

For properties and their values, use `=` to connect them (e.g., `axis=y`). When multiple properties appear together, separate them with commas (e.g., `axis=y,age=7`).

```yaml
blocks:
  default:palm_log:
    states:
      variants:
        axis=x:
          appearance: axisX # refers to the appearance name we just defined in the "appearances"
          id: 0
        axis=y:
          appearance: axisY
          id: 1
        axis=z:
          appearance: axisZ
          id: 2
```

<details>
  <summary>Full Config</summary>

```yml
blocks:
  default:palm_log:
    states:
      properties:
        axis:
          type: axis
          default: y
      appearances:
        axisY:
          state: "note_block:0"
          model:
            path: "minecraft:block/custom/stripped_palm_log"
            generation:
              parent: "minecraft:block/cube_column"
              textures:
                "end": "minecraft:block/custom/palm_log_top"
                "side": "minecraft:block/custom/palm_log"
        axisX:
          state: "note_block:1"
          model:
            x: 90
            y: 90
            path: "minecraft:block/custom/stripped_palm_log_horizontal"
            generation:
              parent: "minecraft:block/cube_column_horizontal"
              textures:
                "end": "minecraft:block/custom/palm_log_top"
                "side": "minecraft:block/custom/palm_log"
        axisZ:
          state: "note_block:2"
          model:
            x: 90
            path: "minecraft:block/custom/stripped_palm_log_horizontal"
            generation:
              parent: "minecraft:block/cube_column_horizontal"
              textures:
                "end": "minecraft:block/custom/palm_log_top"
                "side": "minecraft:block/custom/palm_log"
      variants:
        axis=x:
          appearance: axisX
          id: 0
        axis=y:
          appearance: axisY
          id: 1
        axis=z:
          appearance: axisZ
          id: 2
```

</details>

:::tip

To customize block settings for specific states, add configuration like this:

```yaml
variants:
  "distance=7,persistent=false,waterlogged=false":
    appearance: "default"
    id: 6
    settings:
      is-randomly-ticking: true
```

:::

## Feeling confused?

However, you might also be confused about the relationship between `id` and `state` — why do I need to configure two parameters? Aside from making the configuration more complicated, what’s the actual purpose of this? 

To understand why, you need to look at how CraftEngine implements custom blocks at a fundamental level. Let’s start by discussing the principles behind the plugin.

### Unused States

First, let me ask you a simple question: How many different appearances does a vanilla leaves block have? I believe you’ll quickly figure out the answer: two states — waterlogged and non-waterlogged.

But do you know how many block states a single type of leaves block needs to maintain on the server side?

<details>
  <summary>Answer</summary>

  The correct number is **28**. Did you get it right?

  But how is this number calculated? Let's enable debug mode (F3) and hover the cursor over a leaves block. You'll notice several key-value pairs listed under the block ID - these represent the block's properties. Alternatively, you could use a debug stick to examine these.

  ![](/img/block_states_6.png)
  
  - waterlogged: 2 states (true/false).
  - persistent: 2 states (true/false).
  - distance: 7 states (values 1 to 7).

  Therefore, the total number of possible leaves block states is `2 × 2 × 7 = 28`.

  ![](/img/block_states_5.png)

</details>

Then you'll realize - wow! With so many leaves block states but only two visual variants, couldn't we repurpose those extra states for custom block appearances? Exactly! This is where the `mappings.yml` file comes into play. Through `mappings.yml`, we can **map seemingly identical block states to share the same visual representation**. This clever approach frees up those redundant states for our custom block implementations.

### mappings.yml

Below is an excerpt from the default mappings.yml configuration. It maps all oak leaves with distance=1-7 to distance=7 and persistent=true. This means every vanilla leaves block in the world is technically converted to distance=7, persistent=true leaves by the plugin - yet you can't visually tell the difference because they appear identical.

```yml
"minecraft:oak_leaves[distance=1,persistent=false,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
"minecraft:oak_leaves[distance=2,persistent=false,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
"minecraft:oak_leaves[distance=3,persistent=false,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
"minecraft:oak_leaves[distance=4,persistent=false,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
"minecraft:oak_leaves[distance=5,persistent=false,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
"minecraft:oak_leaves[distance=6,persistent=false,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
"minecraft:oak_leaves[distance=7,persistent=false,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
"minecraft:oak_leaves[distance=1,persistent=true,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
"minecraft:oak_leaves[distance=2,persistent=true,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
"minecraft:oak_leaves[distance=3,persistent=true,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
"minecraft:oak_leaves[distance=4,persistent=true,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
"minecraft:oak_leaves[distance=5,persistent=true,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
"minecraft:oak_leaves[distance=6,persistent=true,waterlogged=false]": minecraft:oak_leaves[distance=7,persistent=true,waterlogged=false]
```

### Id & State

Now, let's return to the **id** and **state** we just discussed. The state refers to the "unused" block states we released in mappings.yml, while the **id** represents the actual block states existing on the server side. We need to establish a bridge between these two parameters with **packet magics**, so that the new blocks actually existing on the server will be mapped to those freed vanilla states, thereby appearing as custom blocks.

### Not Enough Real Block States

By default, the plugin generates and releases a number of real block states equal to the available freed visual states. However, in some cases, we may need special mechanics that require more real block states but fewer visual states. In such scenarios, multiple real states will be mapped to the same visual state, resulting in the issue mentioned in the title: "Not Enough Real Blocks".

To resolve this, you will need to use the `additional-real-blocks.yml` file to register additional real blocks.