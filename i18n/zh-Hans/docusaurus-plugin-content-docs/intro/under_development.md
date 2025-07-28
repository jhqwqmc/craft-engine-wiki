---
title: 🚧 Under Development
id: under_development
---

## Block Entities

A block entity is this weird hybrid thing—it’s not quite a block, not quite an entity, but somewhere in between. On the outside, it looks like any other block, but under the hood, it stores data like an entity. That means you can pack it with unlimited data, which is perfect for building stuff like industrial machines, custom containers, or interactive work blocks.

## Entity-based block rendering

The client side only allows so many block variations, so when we need custom blocks with unique hitboxes, we have to get creative. We use block states with hidden textures (like barriers or invisible buttons) just for collision, while the actual visual look comes from display entities.

But here's the trick – even though they look like barriers or invisible blocks to the player, on the server side, they're still fully functional custom blocks with their own behavior.

So we can still tweak stuff like hardness and light emission—perfect for making glowing furniture.

## Advancements

The reason CraftEngine had to create custom advancements is because vanilla Minecraft tightly couples progressions with recipes. In the base game, certain recipes are literally locked behind advancements - like how you only get the boat recipe after entering water for the first time.

## Built-in Simple Terrain Generator

:::tip

Look, some plugins try to do simple ore/feature generation using Bukkit's ChunkLoadEvent. But here's the problem - not only does this kill performance, it creates this ridiculous situation where you get massive ore piles crammed into single chunks instead of proper, natural-looking veins that span across multiple chunks.

You've got options for terrain/ore/structure generation - stuff like Iris, Terra, or data packs will work. Since CraftEngine injects real serverside blocks, technically all terrain plugins should be compatible. But if you want, you could also wait for CraftEngine to roll out its own solution down the road.

:::
