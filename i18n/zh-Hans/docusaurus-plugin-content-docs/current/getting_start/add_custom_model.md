---
title: 🌌 添加自定义模型
id: add_custom_model
---

import PluginFileTree from '@site/src/components/PluginFileTree';
import Highlight from '@site/src/components/Highlight';
import DiffViewer from '@site/src/components/DiffViewer';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

在开始之前，请确保您的资源包托管已完全设置好。记住——每次模型编辑都需要更新资源包才能生效。否则，运行 `/ce reload all` 时，您不会立即看到变化。


## 准备工作

### 什么是命名空间ID

> 命名空间ID 是 Minecraft 中用于声明和指定游戏对象的一种方式，可以无歧义或冲突地识别内置和用户定义的对象。

在设置物品 ID、模型路径或纹理路径时，您需要遵循以下命名规则：https://zh.minecraft.wiki/w/%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4ID#%E5%90%88%E6%B3%95%E5%AD%97%E7%AC%A6

:::tip

让我们来做一个快问快答！以下这五个命名空间ID中，哪些是实际有效的呢？

1. `MyFirst:golden_sword`
2. `minecraft:steel furnace`
3. `abcd-efgh:1122.3344`
4. `craftengine:happy$crafting`
5. `test:tutorial_book`

<details>
  <summary>答案</summary>
  1. ❌️ 不允许使用大写字母
  2. ❌️ 不允许使用空格
  3. ✔️
  4. ❌️ `$` 不是有效字符
  5. ✔️
</details>

:::

### 什么是模型？

> 模型是 Minecraft 中用于显示游戏中遇到的物体的几何结构。

无论是**方块**还是**物品**，它们都需要一个模型。即使某些东西看起来只是简单的纹理，它仍然需要一个基本模型。这些模型文件都以 `.json` 结尾，您可以在 [BlockBench](https://www.blockbench.net/) 中打开/编辑大多数模型文件。

以下是一个快速展示模型存放位置的文件结构：

<PluginFileTree
    initialTreeData={[
        {
        id: "assets",
        name: "assets",
        children: [
            {
            id: "minecraft",
            name: "minecraft",
            hoverText: "原版 Minecraft 资源使用 'minecraft' 命名空间。你可以使用这个命名空间，也可以使用自己的命名空间，但请避免与原版模型发生命名冲突。",
            children: [
                {
                id: "models",
                name: "models",
                children: [
                    {
                    id: "item",
                    name: "item",
                    children: [
                        {
                            id: "acacia_boat.json",
                            name: "acacia_boat.json",
                            isLeaf: true,
                        },
                        {
                            id: "my_custom_item_model.json",
                            name: "my_custom_item_model.json",
                            isLeaf: true,
                        }
                    ]
                    },
                    {
                    id: "block",
                    name: "block",
                    children: [
                        {
                            id: "acacia_button.json",
                            name: "acacia_button.json",
                            isLeaf: true,
                        },
                        {
                            id: "my_custom_block_model.json",
                            name: "my_custom_block_model.json",
                            isLeaf: true,
                        }
                    ]
                    },
                ]
                }
            ]
            }
        ]
        }
    ]}
/>

<div style={{ marginBottom: "32px" }}></div>

:::info

在制作资源包时，我强烈建议遵循 Minecraft 的结构：

- 将物品模型放在 `/models/item/` 中
- 将方块模型放在 `/models/block/` 中

保持这种组织结构能让你的资源包更加标准化且更容易管理！

为了避免与 Minecraft 的默认资源发生冲突，你有两个很好的选择：

- 创建子文件夹，如 /models/item/custom/
- 或者更好的是，使用你自己的命名空间（例如 mypack:item/sword）

:::

### What is Texture / Atlas?

Models define shapes, but textures bring color! Textures refer to image files specifically in PNG format (with the .png file extension). The use of alternative image formats such as JPG/JPEG or GIF is not permitted.

 Here's where they go:

<PluginFileTree
    initialTreeData={[
        {
        id: "assets",
        name: "assets",
        children: [
            {
            id: "minecraft",
            name: "minecraft",
            hoverText: "Default Minecraft assets use the 'minecraft' namespace. You may use either this or your own namespace, but avoid naming conflicts with vanilla models.",
            children: [
                {
                id: "textures",
                name: "textures",
                children: [
                    {
                        id: "item",
                        name: "item",
                        children: [
                        {
                            id: "acacia_boat.png",
                            name: "acacia_boat.png",
                            isLeaf: true,
                        },
                        {
                            id: "my_custom_item_texture.png",
                            name: "my_custom_item_texture.png",
                            isLeaf: true,
                        }
                        ]
                    },
                    {
                        id: "block",
                        name: "block",
                        children: [
                        {
                            id: "allium.png",
                            name: "allium.png",
                            isLeaf: true,
                        },
                        {
                            id: "my_custom_block_texture.png",
                            name: "my_custom_block_texture.png",
                            isLeaf: true,
                        }
                        ]
                    }
                ]
                }
            ]
            }
        ]
        }
    ]}
/>

<div style={{ marginBottom: "32px" }}></div>

:::caution

**Texture paths are stricter than model paths!**

While models might work even if you misplace their JSON files (e.g., outside /item/ or /block/), textures must be in the correct folder due to Minecraft’s texture atlas system.

Let me simplify how textures work in Minecraft:

Minecraft combines multiple textures into one giant image (called an atlas) to boost performance. However, not all textures are model textures (e.g., pumpkin head masks, rain/snow environment textures, etc.). Therefore, an atlas file must be used to define which textures are eligible for loading.

![](/img/minecraft_textures_atlas_blocks.png_0.png)

By default, Minecraft uses the following texture atlases `(minecraft/atlases/blocks.json)`: 

```json
{
    "sources": [
        { "type": "directory", "source": "block", "prefix": "block/" }, 
        { "type": "directory", "source": "item", "prefix": "item/" },
        ...more
    ]
}
```

This is why Minecraft can only load textures located within the block and item directories by default. If you attempt to reference textures from an unsupported path (e.g., `textures/custom`), the engine will fail to load them, resulting in the purple-and-black checkered pattern.

![](/img/out_of_atlas.png)

<details>
  <summary>Custom Atlas Tutorial</summary>

To create an atlas path, you simply need to add a file to your resource pack at the following path: `resourcepack/assets/minecraft/atlases/blocks.json`. Below is a simple example that adds the custom path to the atlas:

```json
{
    "sources": [
        { "type": "directory", "source": "custom", "prefix": "custom/" }
    ]
}
```

</details>

:::

:::warning

**Model Texture Size Requirements for Minecraft**

For model textures only, the width and height must be powers of 2 (e.g., 16, 32, 64, 128) to ensure correct rendering. This restriction does not apply to font textures (e.g., rank.png, GUI elements, HUD icons, etc.), which can use arbitrary dimensions.

Valid Examples: \
✅ 16×16 (Vanilla default) \
✅ 32×32 (Common for HD textures) \
✅ 64×64, 64×128 (Higher-resolution packs)

Invalid Examples: \
❌ 7×7, 13×13, 19×19 (Non-power-of-2 dimensions) \
❌ 17×32 (Mixed valid/invalid dimensions)

**Never place font/GUI textures (e.g., rank.png, HUD elements) in the same directory as model textures (e.g., block/, item/).** Even if these textures are not directly used in models, Minecraft's texture atlas system will automatically include them when generating combined sprite sheets. This can lead to unintended visual degradation(mipmap-level):

<details>
  <summary>Mipmap Level 4 VS Mimap Level 0</summary>

    ![Mipmap Level 4](/img/mipmap_4.png)

    ![Mipmap Level 0](/img/mipmap_0.png)

</details>

:::

## Create Model File

Let's now create the first model file! You can create models either through [BlockBench](https://www.blockbench.net/) or by configuring them in CraftEngine. I'll divide this section into two separate tutorials. I highly recommend trying both approaches to gain a deeper understanding of how the model system works.

<a href={require('/img/toxic_sword.png').default} download>Download Tutorial Sword Texture</a>

Place the downloaded PNG image into the folder structure shown below. Then, we'll proceed to create the model.

<PluginFileTree
    initialTreeData={[
        {
        id: "resourcepack",
        name: "resourcepack",
        children: [
        {
        id: "assets",
        name: "assets",
        children: [
            {
            id: "tutorial",
            name: "tutorial",
            children: [
                {
                id: "textures",
                name: "textures",
                children: [
                    {
                        id: "item",
                        name: "item",
                        children: [
                        {
                            id: "toxic_sword.png",
                            name: "toxic_sword.png",
                            isLeaf: true,
                        }
                        ]
                    }
                ]
                }
            ]
            }
        ]
        }
        ]
        }
    ]}
/>

### Create Model with BlockBench

As a server developer, you don't need advanced modeling skills. You only need to master basic model editing and importing! Treat the following tutorial as a playground and experiment freely.

![](/img/blockbench_1.png)

![](/img/blockbench_2.png)

:::tip

First, save the model using Ctrl+S to your resource pack folder before proceeding with any edits. In this tutorial, I saved the JSON file to:
`/resources/tutorial/resourcepack/assets/tutorial/models/item/`

:::

![](/img/blockbench_3.png)


:::tip

Create a basic cube and apply the toxic_sword texture `resourcepack/assets/tutorial/textures/item/toxic_sword.png`. Experiment with simple adjustments—treat this as a casual practice session. In the following example, I created an unconventional sword-shaped block. While unusual, the key takeaway is that this represents a fully custom model.

:::

![](/img/blockbench_4.png)

![](/img/blockbench_5.png)

Now let's open the model JSON file we just created using a professional text editor. Your JSON structure should generally match mine.

:::caution

Always save model JSON files within a complete resource pack structure. Otherwise, BlockBench cannot infer the correct resource pack hierarchy, resulting in texture paths that Minecraft cannot resolve. If your `textures` entry differs significantly from mine, this is likely the cause.

:::

```json
{
  "format_version": "1.21.6",
  "credit": "Made with Blockbench",
  "textures": {
    "0": "tutorial:item/toxic_sword",
    "particle": "tutorial:item/toxic_sword" // refers to visual effects for block destruction, eating, etc.
  },
  "elements": [
    {
      "from": [0, 0, 0],
      "to": [16, 16, 16],
      "faces": {
        "north": {"uv": [0, 0, 16, 16], "texture": "#0"},
        "east": {"uv": [0, 0, 16, 16], "texture": "#0"},
        "south": {"uv": [0, 0, 16, 16], "texture": "#0"},
        "west": {"uv": [0, 0, 16, 16], "texture": "#0"},
        "up": {"uv": [0, 0, 16, 16], "texture": "#0"},
        "down": {"uv": [0, 0, 16, 16], "texture": "#0"}
      }
    }
  ]
}
```

:::info

When using third-party resource packs, modifying model texture paths may cause missing texture errors. In such cases, open the model in BlockBench and reconfigure the texture paths. Otherwise, the model will appear as a purple-black error block.

Alternatively, you can directly modify the `textures` entry in the JSON file using a text editor. Note that resource locations automatically ignore prefixes like `models & textures`. Here, `tutorial:item/toxic_sword` corresponds to the actual texture path: `assets/tutorial/textures/item/toxic_sword.png`.

:::

Now let's return to CraftEngine's configuration and assign our newly created model to the sword item. To ensure consistency with the expected results, I've uploaded my configuration file <a href={require('/file/tutorial_1.zip').default} download>here</a> for your reference. Please cross-check if your result differs.

```yaml
items:
  tutorial:toxic_sword:
    material: diamond_sword
    data:
      item-name: "<#3CB371>Toxic Sword"
    model:
      type: minecraft:model # Don't focus too much on the type here as we'll explain it in detail later.
      path: tutorial:item/toxic_sword
    # If you are running on a server below 1.21.2, add custom-model-data here for backwards compatibility
    custom-model-data: 1000
```

![](/img/toxic_sword_looks.png)

:::tip

Don't forget to run `/ce reload all` to apply the resource pack changes.

:::

<details>
  <summary>What is CustomModelData?</summary>

    CustomModelData is a data component that enables unique model variations for items sharing the same base material. For items with identical base materials, you must assign distinct CustomModelData values to differentiate their models. Example:

    ```yaml
    items:
      tutorial:toxic_sword:
        material: diamond_sword
        custom-model-data: 1000
      tutorial:flame_sword:
        material: diamond_sword
        custom-model-data: 1001
    ```

    However, this restriction does not apply to items with different base materials. For example:

    ```yaml
    items:
      tutorial:toxic_sword:
        material: diamond_sword
        custom-model-data: 1000
      tutorial:flame_sword:
        material: wooden_sword
        custom-model-data: 1000
    ```

</details>

<details>
  <summary>What is ItemModel?</summary>

  ItemModel, introduced in 1.21.2, is a data component with better rendering efficiency than CustomModelData, reducing client-side performance overhead. Normally, you don’t need to manually specify the model path (item-model), as the plugin auto-generates it.

  However, if your server requires broad version compatibility (e.g., 1.20–1.21.8) and optimal rendering for newer clients, configure both:

  ```yaml
  items:
    tutorial:toxic_sword:
      material: diamond_sword
      item-model: tutorial:toxic_sword
      custom-model-data: 1000
  ```

</details>

### Generate Model with CraftEngine

Now let's try CraftEngine's model generation feature. Note: If you've completed the previous BlockBench tutorial, delete the model JSON file created earlier. As the title "Generate" indicates, we won't be using BlockBench-created models for this section.

<DiffViewer>
{`
items:
    tutorial:toxic_sword:
      material: diamond_sword
      data:
        item-name: "<#3CB371>Toxic Sword"
      model:
        path: tutorial:item/toxic_sword
+     generation:
+       parent: minecraft:item/handheld
+       textures:
+         layer0: tutorial:item/toxic_sword
`}
</DiffViewer>

:::tip

When using the generation configuration within a path-defined section, the plugin switches from read mode to write mode. This will generate the corresponding JSON model file at the specified path.

:::

Let me explain the purpose of each parameter and where to obtain them:

<Tabs>
  <TabItem value="parent" label="👨‍🦱 parent" default>
    > Loads a different model from the given path, in form of a resource location

    The parent field can not only reference the default models provided by vanilla Minecraft but can also point to your custom models. You can view all available Minecraft models on this [website](https://misode.github.io/assets/model/)

    In Minecraft, most models (items, tools, and even blocks) utilize parent-based generation rather than independent modeling. You'll likely use this model generation approach in at least 80% of your configurations.

    **Think of a parent model as a prebuilt 3D template** — you only need to supply texture parameters to make it functional.

    ```yaml
    generation:
      parent: minecraft:item/handheld
      textures:
        layer0: tutorial:item/toxic_sword
    ```

    ![](/img/model_generation_1.png)

    ```yaml
    generation:
      parent: minecraft:item/generated
      textures:
        layer0: tutorial:item/toxic_sword
    ```

    ![](/img/model_generation_2.png)

    ```yml
    generation:
      parent: minecraft:block/cube_all
      textures:
        all: tutorial:item/toxic_sword
    ```

    ![](/img/model_generation_3.png)

    You may wonder why the first two models use `layer0` while the third uses `all`.

    **To explore further, press 🖼️ textures to continue the tutorial.**

  </TabItem>
  <TabItem value="textures" label="🖼️ textures">
    > Holds the textures of the model, in form of a resource location or can be another texture variable.

    To determine the exact texture parameters:

    1. Inspect the parent model’s JSON structure.
    2. If the parent itself inherits another model (e.g., minecraft:item/generated extends a base template), recursively check all upstream textures.

    **All vanilla Minecraft models are available on [GitHub](https://github.com/InventivetalentDev/minecraft-assets/tree/1.21.8/assets/minecraft/models).**

    Let's examine this example to understand texture overriding. For this scenario, you have two approaches to assign textures:

    ![](/img/model_generation_textures.png)

    Use cube_all’s shorthand
    ```yaml
    generation:
      parent: "minecraft:block/cube_all"
      textures:
        "all": "minecraft:block/custom/block_texture"
    ```

    Override cube (parent of cube_all) \
    This is actually an inappropriate example. A better approach would be to directly set the parent as `cube` rather than `cube_all`.

    ```yaml
    generation:
      parent: "minecraft:block/cube_all"
      textures:
        "particle": "minecraft:block/custom/block_particle"
        "down": "minecraft:block/custom/block_down"
        "up": "minecraft:block/custom/block_up"
        "north": "minecraft:block/custom/block_north"
        "east": "minecraft:block/custom/block_east"
        "south": "minecraft:block/custom/block_south"
        "west": "minecraft:block/custom/block_west"
    ```

  </TabItem>
  <TabItem value="display" label="🎨 display">
    > Holds the different places where item models are displayed.
    > - rotation: Specifies the rotation of the model according to the scheme [x, y, z].
    > - translation: Specifies the position of the model according to the scheme [x, y, z]. If the value is greater than 80, it is displayed as 80. If the value is less than -80, it is displayed as -80.
    > - scale: Specifies the scale of the model according to the scheme [x, y, z]. If the value is greater than 4, it is displayed as 4.
  
    Available values: `thirdperson_righthand`, `thirdperson_lefthand`, `firstperson_righthand`, `firstperson_lefthand`, `gui`, `head`, `ground`, or `fixed`. 
    
    This configuration is rarely used, as in most cases you can more intuitively adjust the model display mode directly in Blockbench.

    ```yaml
    items:
      default:big_apple:
        material: apple
        custom-model-data: 1000
        model:
          type: minecraft:model
          path: "minecraft:item/custom/big_apple"
          generation:
            parent: "minecraft:item/apple" # inherits apple's model
            # displays a big apple in gui
            display:
              gui:
                scale: 2,2,2
    ```

  </TabItem>

  <TabItem value="gui-light" label="💡 gui-light">
    Can be `front` or `side`. If set to `side`, the model is rendered like a block. If set to `front`, model is shaded like a flat item. Defaults to `side`.

    ![](/img/gui_light.png)

    ```yaml
    items:
      default:gui_head_size_1:
        material: player_head
        custom-model-data: 1000
        model:
          type: minecraft:special
          # The model here is a parameter required for minecraft:special models
          # and is unrelated to the outer model. We will cover special models in detail in future tutorials.
          model:
            type: minecraft:player_head
          path: minecraft:item/custom/gui_head_size_1
          generation:
            parent: minecraft:item/template_skull
            gui-light: front
            display:
              gui:
                translation: 0,8,0
                scale: 2,2,2
    ```

  </TabItem>
</Tabs>


## Debugging

If your model appears as a purple-black cube or fails to render properly, first check your server console—CraftEngine will log most potential errors there. Alternatively, inspect the client logs to diagnose resource pack loading issues.