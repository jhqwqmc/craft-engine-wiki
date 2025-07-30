---
title: 🅿️ 占位符
id: placeholderapi
---

## %image\_%

`image` 占位符用于根据给定的 ID 返回对应图像的原始 Unicode 字符及其关联字体。

:::caution
`row` 和 `column` 都是可选的，但如果使用其中一个，就必须同时使用另一个。
:::

### %image\_mm\_命名空间:路径\:\[行]:\[列]%

返回 `minimessage` 格式的图像。

![](/img/placeholderapi_1.png)

### %image\_md\_命名空间:路径\:\[行]:\[列]%

返回 `minedown` 格式的图像。

![](/img/placeholderapi_2.png)

### %image\_raw\_命名空间:路径\:\[行]:\[列]%

返回原始图像字符

![](/img/placeholderapi_3.png)

## %shift\_%

`shift`占位符用于获取**偏移字符**，常用于菜单标题对齐等操作。

### %shift\_mm\_数值%

返回 `minimessage` 格式的偏移字符  

### %shift\_md\_数值%

返回 `minedown` 格式的偏移字符  

### %shift\_raw\_数值%

返回原始偏移字符

:::tip

**如果你需要在其他插件中使用占位符显示图片，务必确保这些插件支持 MiniMessage 或 MineDown 格式，并能正确发送文本组件。**
(我之所以强调这一点，是因为有些设计不佳的插件会强制将富文本转换为旧版的颜色代码。)

另外，你也可以通过 CraftEngine 的数据包拦截功能来显示自定义图片。具体细节请参考[**此页面**](../configuration/image.md#compatibility-with-other-plugins)。

:::