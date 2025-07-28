---
title: 🔢 Number Format
id: number_format
---

:::caution

These number formats work in most places, except for the early-developed item-data stuff. We'll try to redesign the number support during the next item system refactor, to better handle randomized items.

:::

### constant

Provide a fixed numerical value.

```yaml
type: constant
value: 1
```

:::tip
In most cases, you can use the following abbreviated notation.

```yaml
count:
  type: constant
  value: 1
```

->

```yaml
count: 1
```
:::

### uniform

Provide a random number within the given range.

```yaml
type: uniform
min: 1
max: 3
```

:::tip
In most cases, you can use the following abbreviated notation.

```yaml
count:
  type: uniform
  min: 1
  max: 3
```

->

```yaml
count: 1~3
```

Both `min` and `max` also support the nested use of `number provider`.&#x20;

```yaml
count:
  type: uniform
  min:
    type: uniform
    min: 2
    max: 7
  max: "<papi:skilllevel_farming>*5~<papi:skilllevel_farming>*10"
```
:::

### expression

[https://ezylang.github.io/EvalEx/references/references.html](https://ezylang.github.io/EvalEx/references/references.html)

```yaml
type: expression
expression: "20 + 70 / 2"
```

:::tip
In most cases, you can use the following abbreviated notation.

```yaml
count:
  type: expression
  expression: "<papi:skilllevel_farming> / 20 + 5"
```

->

```yaml
count: "<papi:skilllevel_farming> / 20 + 5"
```

:::
