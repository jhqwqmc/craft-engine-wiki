import React, {useEffect, useRef, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import MinecraftWindow from './MinecraftWindow';
import {parseRow} from '../utils/parseStructure';
import styles from './MinecraftRecipeBook.module.css';
import windowStyles from './MinecraftWindow.module.css';
import useNearViewport from '../utils/useNearViewport';

const CATEGORIES = [
  {id: 'all', name: '全部', icons: ['compass']},
  {id: 'equipment', name: '装备', icons: ['iron_axe', 'golden_sword']},
  {id: 'building', name: '建筑', icons: ['bricks']},
  {id: 'misc', name: '杂项', icons: ['lava_bucket', 'apple']},
  {id: 'redstone', name: '红石', icons: ['redstone']},
];

// 单页配方书示例：同一 category 内的相同 group 合并；没有 group 的配方各占一格。
export default function MinecraftRecipeBook({recipes, initialCategory = 'all', label = '配方书'}) {
  const [ref, ready] = useNearViewport();
  return (
    <section ref={ref} className={styles.wrapper} aria-label={label}>
      {ready ? <RecipeBookContent recipes={recipes} initialCategory={initialCategory} label={label} /> : (
        <div className={styles.workspace} aria-hidden="true">
          <div className={styles.book} />
          <div className={`${styles.preview} ${styles.placeholder}`}>
            <div className={windowStyles.wrapper}>
              <div className={windowStyles.stage}><div style={{width: 352, height: 180}} /></div>
            </div>
            <div className={styles.details}>
              <strong>&nbsp;</strong>
              <span>category: <code>&nbsp;</code></span>
              <span>group: <code>&nbsp;</code></span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function RecipeBookContent({recipes, initialCategory, label}) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [cycle, setCycle] = useState(0);
  const [openGroup, setOpenGroup] = useState(null);
  const overlayRef = useRef(null);
  const triggerRef = useRef(null);
  const workspaceRef = useRef(null);
  useEffect(() => {
    let visible = false;
    let timer;
    const update = () => {
      window.clearInterval(timer);
      if (visible && !document.hidden) {
        timer = window.setInterval(() => setCycle(value => value + 1), 1500);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(workspaceRef.current);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  useEffect(() => {
    if (!openGroup) return;
    overlayRef.current.querySelector('button').focus();
    const dismiss = event => {
      if (!overlayRef.current.contains(event.target)) setOpenGroup(null);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [openGroup]);
  const base = useBaseUrl('/img/mc/');
  const groups = new Map();
  const search = query.trim().toLowerCase();
  for (const recipe of recipes) {
    if (category !== 'all' && recipe.category !== category) continue;
    if (search && !`${recipe.result.name} ${recipe.id} ${recipe.group ?? ''}`.toLowerCase().includes(search)) continue;
    const key = `${recipe.category}:${recipe.group || recipe.id}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(recipe);
  }
  const entries = [...groups.values()];
  const activeGroup = entries.find(group => group.some(recipe => recipe.id === selectedId)) ?? entries[0];
  const active = activeGroup?.find(recipe => recipe.id === selectedId) ?? activeGroup?.[0];
  const expandedGroup = entries.find(group => `${group[0].category}:${group[0].group || group[0].id}` === openGroup);
  const expandedIndex = entries.indexOf(expandedGroup);
  const columns = Math.min(4, expandedGroup?.length ?? 0);
  const icon = item => `${base}item/${item.icon}.png`;

  const expand = (event, group) => {
    event.preventDefault();
    triggerRef.current = event.currentTarget;
    setOpenGroup(`${group[0].category}:${group[0].group || group[0].id}`);
  };

  return (
    <div ref={workspaceRef} className={styles.workspace} onKeyDown={event => {
      if (openGroup && event.key === 'Escape') {
        event.preventDefault();
        setOpenGroup(null);
        triggerRef.current.focus();
      }
    }}>
        <div className={styles.book}>
          <div className={styles.page}>
            <input
              type="search"
              className={styles.search}
              aria-label={`${label}搜索配方`}
              placeholder="搜索…"
              value={query}
              onChange={event => {setQuery(event.target.value); setSelectedId(null); setOpenGroup(null);}}
            />
            <div className={styles.recipes} aria-label="配方分组">
              {entries.map(group => {
                const recipe = group[0];
                const selected = group === activeGroup;
                const displayed = group[cycle % group.length];
                return (
                  <button
                    key={`${recipe.category}:${recipe.group || recipe.id}`}
                    type="button"
                    className={styles.recipe}
                    style={{backgroundImage: `url(${base}sprites/recipe_book/slot_${group.length > 1 ? 'many_' : ''}craftable.png)`}}
                    aria-label={group.length > 1 ? `${recipe.group} 分组，${group.length} 个配方` : recipe.result.name}
                    aria-pressed={selected}
                    aria-expanded={group.length > 1 ? expandedGroup === group : undefined}
                    title={group.length > 1 ? `${displayed.result.name}\n右键查看更多配方` : recipe.result.name}
                    onClick={event => {
                      if (group.length > 1 && event.nativeEvent.pointerType === 'touch') {
                        expand(event, group);
                      } else {
                        setSelectedId(displayed.id);
                        setOpenGroup(null);
                      }
                    }}
                    onContextMenu={event => {if (group.length > 1) expand(event, group);}}
                    onKeyDown={event => {
                      if (group.length > 1 && (event.key === 'ArrowDown' || (event.shiftKey && event.key === 'F10'))) expand(event, group);
                    }}
                  >
                    <img className="no-zoom" src={icon(displayed.result)} alt="" draggable={false} />
                  </button>
                );
              })}
            </div>
            {entries.length === 0 && <span className={styles.empty}>没有匹配的配方</span>}
            {expandedGroup && (
              <div ref={overlayRef} className={styles.variants} role="group" aria-label={`${expandedGroup[0].group} 中的配方`} style={{
                '--variant-columns': columns,
                left: `calc(${Math.min(11 + expandedIndex % 5 * 25, 144 - (columns * 25 + 8))}px * var(--book-scale))`,
                top: `calc(${31 + Math.floor(expandedIndex / 5) * 25}px * var(--book-scale))`,
              }}>
                <div className={styles.variantRow}>
                  {expandedGroup.map(recipe => {
                    const cells = recipe.pattern.flatMap(parseRow);
                    const ingredients = recipe.shapeless ? cells.filter(cell => recipe.ingredients[cell]) : cells;
                    return (
                    <button
                      key={recipe.id}
                      type="button"
                      className={styles.variantButton}
                      aria-label={`选择${recipe.result.name}配方`}
                      aria-pressed={recipe === active}
                      title={recipe.result.name}
                      onClick={() => {setSelectedId(recipe.id); setOpenGroup(null); triggerRef.current.focus();}}
                    >
                      {ingredients.map((identifier, index) => recipe.ingredients[identifier] && (
                        <img key={index} className="no-zoom" src={icon(recipe.ingredients[identifier])} alt="" draggable={false} style={{
                          left: `calc(${2 + index % 3 * 7}px * var(--book-scale))`,
                          top: `calc(${2 + Math.floor(index / 3) * 7}px * var(--book-scale))`,
                        }} />
                      ))}
                    </button>
                  );})}
                </div>
              </div>
            )}
            <span className={styles.total}>{entries.length} 个配方格</span>
          </div>
          <div className={styles.tabs} role="group" aria-label="配方分类">
            {CATEGORIES.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tab} ${category === tab.id ? styles.activeTab : ''}`}
                aria-label={`${tab.name}（${tab.id}）`}
                aria-pressed={category === tab.id}
                title={`${tab.name}（${tab.id}）`}
                onClick={() => {setCategory(tab.id); setSelectedId(null); setOpenGroup(null);}}
              >
                {tab.icons.map((name, index) => <img key={name} className="no-zoom" src={`${base}item/${name}.png`} alt="" draggable={false} style={{left: `calc(${tab.icons.length === 1 ? 9 : 3 + index * 11}px * var(--book-scale))`}} />)}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.preview} aria-live="polite">
          {active && <>
            <MinecraftWindow
              type="crafting"
              title="合成"
              layout={[...active.pattern, '`recipe:result`']}
              items={{...active.ingredients, 'recipe:result': active.result}}
              empty={[' ']}
            />
            <div className={styles.details}>
              <strong>{active.result.name}</strong>
              <span>category: <code>{active.category}</code></span>
              <span>group: <code>{active.group || '未设置'}</code></span>
            </div>
          </>}
        </div>
    </div>
  );
}
