// src/components/ClickableYamlFragment.js
import React from 'react';
import styles from './ClickableYamlFragment.module.css';
import CodeBlock from '@theme/CodeBlock';
// 引入 Docusaurus 的 useColorMode hook
import { useColorMode } from '@docusaurus/theme-common';

// 辅助函数：将十六进制颜色转换为 RGBA 字符串
function hexToRgba(hex, transparentValue) { // transparentValue 现在是必传的
  if (!hex || hex.length !== 7) {
    return `rgba(128, 128, 128, ${transparentValue})`;
  }
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${transparentValue})`;
}

function ClickableYamlFragment({ yamlContent, to, title, highlightColor }) {
  const hasLink = !!to;
  // 获取当前主题模式
  const { colorMode } = useColorMode(); 

  const handleClick = () => {
    if (hasLink) {
      window.location.href = to;
    }
  };

  const defaultColor = '#3498db'; // 默认颜色可以设置为 Docusaurus 主色调
  const colorToUse = highlightColor || defaultColor;

  // 根据颜色模式调整透明度，深色模式下通常需要更低的透明度以避免刺眼
  const isDarkTheme = colorMode === 'dark';
  const shadowLightAlpha = isDarkTheme ? 0.04 : 0.08; // 深色模式更淡
  const shadowMediumAlpha = isDarkTheme ? 0.15 : 0.2; // 深色模式更淡
  const shadowStrongAlpha = isDarkTheme ? 0.25 : 0.3; // 深色模式更淡
  const shadowFocusAlpha = isDarkTheme ? 0.4 : 0.5;   // 深色模式更淡
  const hoverBgAlpha = isDarkTheme ? 0.01 : 0.02;     // 深色模式更淡

  const inlineStyles = {
    '--yaml-fragment-outline-color': colorToUse, 
    
    '--yaml-fragment-shadow-light': hexToRgba(colorToUse, shadowLightAlpha),  
    '--yaml-fragment-shadow-medium': hexToRgba(colorToUse, shadowMediumAlpha), 
    '--yaml-fragment-shadow-strong': hexToRgba(colorToUse, shadowStrongAlpha), 
    '--yaml-fragment-shadow-focus': hexToRgba(colorToUse, shadowFocusAlpha),  

    '--yaml-fragment-hover-bg': hexToRgba(colorToUse, hoverBgAlpha),
  };

  return (
    <div
      className={`${styles.fragmentContainer} ${hasLink ? '' : styles.nonClickable}`}
      onClick={hasLink ? handleClick : undefined}
      role={hasLink ? "button" : undefined}
      tabIndex={hasLink ? 0 : undefined}
      onKeyPress={hasLink ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      } : undefined}
      style={inlineStyles}
    >
      {title && <h4 className={styles.fragmentTitle}>{title}</h4>}
      <CodeBlock language="yaml" className={styles.codeBlockOverride}>
        {yamlContent}
      </CodeBlock>
    </div>
  );
}

export default ClickableYamlFragment;