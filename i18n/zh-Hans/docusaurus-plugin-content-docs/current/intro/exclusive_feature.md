---
title: ☄️ 独家功能
id: exclusive_feature
---

import ColoredLink from '@site/src/components/ColoredLink';
import Highlight from '@site/src/components/Highlight';

## 不破坏原版方块行为

CraftEngine 允许您将闲置的音符盒、绊线等方块重新定义为自定义方块状态——且完全不影响其原有的服务端机制。  
无需为定制内容牺牲原版特性，鱼与熊掌兼得！🎮✨

![](/img/preserve_vanilla_block_behavior.png)

## 使用任意空闲的原版方块状态作为自定义方块模型

CraftEngine 不会硬编码音符盒或绊线——你说了算！想用任何原版方块状态作为自定义方块？只需在 mappings.yml 中映射，砰的一声，它就是你的了。完全的创作自由，零遗漏。🛠️✨

![](/img/use_any_block.png)

## 无缝集成数据包/Iris/Terra

CraftEngine 注册真实方块，因此您可以直接在数据包中使用它们！🌳✨ 想生成自定义树木，甚至重新设计末地？现在就可以。完全兼容原版，无限可能。

![](/img/datapack_tree.png)

:::caution
说实话 —— CraftEngine 是唯一真正支持数据包的插件。其他一些插件会让你**直接使用等效的原版方块**来替代自定义方块，这种做法是完全错误的！

数据包中的旋转和镜像等转换操作会直接破坏这些替代方案，最终生成的方块与你预期的完全不同。而使用 CraftEngine，你设计的内容就是实际生成的内容 —— 没有任何意外。✅
:::

## 资源包保护

<Highlight color="#f2184eff">**付费版专属**</Highlight>

CraftEngine 采用高级混淆技术保护您的资源——我们确保它们只能被 Minecraft 客户端读取。任何提取尝试（Bandizip、JD-GUI 等）都将彻底失败。

我们的保护措施还包括：
- 永久更改文件结构的安全混淆技术
- 专有的纹理图集算法，将所有模型纹理合并为超大纹理
→ 减少资源包大小，并使资源盗窃变得更加困难

![](/img/pack_obfuscation.png)

## 客户端侧物品组件

CraftEngine 允许你通过客户端组件动态自定义物品名称、描述和外观。这意味着你可以实时更新物品纹理，甚至为不同玩家展示不同的物品效果。

![](/img/i18n/zh-Hans/clientbound_data.png)


