import React from 'react';
import MinecraftWindow from './MinecraftWindow';
import McSprite from './McSprite';
import styles from './MinecraftRecipe.module.css';

const TITLES = {crafting: '合成', furnace: '熔炉', smithing: '升级装备', stonecutter: '切石机'};

export function MinecraftRecipeRow({children}) {
  return <div className={styles.row}>{children}</div>;
}

// 酿造会原地替换下方容器中的物品，因此分开展示加工中和完成后的同一组槽位。
export function MinecraftBrewingRecipe({ingredient, container, result}) {
  return (
    <MinecraftRecipeRow>
      {[false, true].map(finished => (
        <figure key={String(finished)} className={styles.recipe}>
          <MinecraftWindow
            type="brewing"
            title="酿造台"
            layout={[finished ? 'CCC F' : 'CCCIF']}
            empty={[' ']}
            items={{
              C: finished ? result : container,
              I: ingredient,
              F: {icon: 'blaze_powder', name: '烈焰粉', id: 'minecraft:blaze_powder'},
            }}
          >
            <McSprite name="brewing_stand/fuel_length" x={60} y={44} width={18} height={4} />
            {!finished && <>
              <McSprite name="brewing_stand/brew_progress" x={97} y={16} width={9} height={28} clip="inset(0 0 50% 0)" />
              <McSprite name="brewing_stand/bubbles" x={63} y={14} width={12} height={29} clip="inset(35% 0 0 0)" />
            </>}
          </MinecraftWindow>
          <figcaption className={styles.caption}>{finished ? '酿造完成' : '酿造中'}</figcaption>
        </figure>
      ))}
    </MinecraftRecipeRow>
  );
}

// 按对应窗口的槽位顺序提供原料，结果追加到最后一个槽位。
export default function MinecraftRecipe({type = 'crafting', pattern, ingredients, result, caption, title = TITLES[type], children}) {
  return (
    <figure className={styles.recipe}>
      <MinecraftWindow
        type={type}
        title={title}
        layout={[...pattern, '`recipe:result`']}
        items={{...ingredients, 'recipe:result': result}}
        empty={[' ']}
      >
        {children}
      </MinecraftWindow>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
