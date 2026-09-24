# Minecraft GUI assets

PNG assets are recompressed by `node scripts/optimize-minecraft-images.mjs`.
The script compares lossless compression with a 128-color palette (no dithering),
keeps only smaller files, and preserves dimensions and every alpha value so item
edges and enchantment masks remain unchanged. Palette compression may slightly
shift colors.

The GUI atlases, sprites and existing item icons are copied from
`sparrow-ui-wiki/static/img/mc`.
They originate from the Minecraft client and are used here to illustrate the
game's recipe interface. Minecraft assets belong to Mojang / Microsoft.

Additional recipe assets:

- `enchanted_glint_item.png`: original Minecraft 1.21.11 item glint texture.
  The component animates it through the item's alpha mask with `enchanted: true`.
- Recipe book background, tabs, single/grouped recipe buttons, expanded recipe
  overlays, glass bottle, stick, wooden pickaxe, torch, category icons and wheat:
  Minecraft 1.21.4 resources from
  `PatchedMinecraft/Client-1.21.4/assets/minecraft/textures`.
- Oak leaves, oak log, oak planks and bricks: those same client block textures projected
  onto the three shaded cube faces. Leaves use the vanilla default foliage tint.
  Palm planks and palm logs use CraftEngine's block textures with the same projection.
- Water bottle: vanilla `potion_overlay` tinted with the default water color
  `#385dc6`, composited below the vanilla `potion` bottle layer, matching the
  client's item model and `PotionContents` color.

- Topaz, sword, shovel, bow, crossbow and pickaxe: first animation frame from
  CraftEngine's `default_assets/resourcepack/assets/minecraft/textures/item/custom/`.
- Bow, crossbow, blaze rod and bolt smithing template: Minecraft 1.21.11 client
  item textures.
- Cobblestone, stone and the two topaz ores: block textures projected onto three
  shaded SVG faces and rasterized as transparent item icons. The vanilla textures
  come from the client; the ore textures come from CraftEngine's default assets.
- Chest, Chinese lantern and enchanted cobblestone: item regions from the existing
  Chinese `recipe_1`, `recipe_6` and `recipe_13` illustrations. Connected gray GUI
  background pixels at the image boundary have been made transparent.
