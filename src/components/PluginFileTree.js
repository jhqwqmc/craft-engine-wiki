// src/components/PluginFileTree.js
import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  FaFolder,
  FaFolderOpen,
  FaFile,
  FaChevronRight,
  FaChevronDown,
  FaQuestionCircle,
} from 'react-icons/fa';
import ReactDOM from 'react-dom';

/* ==============================
   节点渲染组件（新增滚动关闭）
   ============================== */
function TreeNode({ node, depth, currentTheme, selectedId, onSelect, scrollContainerRef }) {
  const [showCard, setShowCard] = useState(false);
  const [cardStyle, setCardStyle] = useState({});
  const cardRef = useRef(null);
  const questionIconRef = useRef(null);
  const measureTimeout = useRef(null);

  const isFolder = !!node.children;
  const isOpen = node.isOpen;
  const isSelected = node.id === selectedId;

  const handleClick = useCallback(
      (e) => {
        if (questionIconRef.current && questionIconRef.current.contains(e.target)) {
          return;
        }
        if (isFolder) node.toggle();
        onSelect(node.id);
      },
      [isFolder, node, onSelect]
  );

  const handleQuestionClick = useCallback((e) => {
    e.stopPropagation();
    setShowCard((prev) => !prev);
  }, []);

  // 卡片位置计算（保持不变）
  const updateCardPosition = useCallback(() => {
    if (!questionIconRef.current || !cardRef.current) return;
    const iconRect = questionIconRef.current.getBoundingClientRect();
    const cardEl = cardRef.current;

    cardEl.style.visibility = 'hidden';
    cardEl.style.display = 'block';
    const cardRect = cardEl.getBoundingClientRect();
    cardEl.style.display = '';
    cardEl.style.visibility = '';

    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;
    const margin = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = iconRect.right + margin;
    if (left + cardWidth > vw) {
      left = iconRect.left - cardWidth - margin;
      if (left < margin) left = vw - cardWidth - margin;
    }

    let top = iconRect.top;
    if (top + cardHeight > vh) top = vh - cardHeight - margin;
    if (top < margin) top = margin;

    setCardStyle({
      position: 'fixed',
      top,
      left,
      visibility: 'visible',
    });
  }, []);

  useLayoutEffect(() => {
    if (showCard) {
      measureTimeout.current = setTimeout(updateCardPosition, 0);
    } else {
      setCardStyle({});
    }
    return () => clearTimeout(measureTimeout.current);
  }, [showCard, updateCardPosition]);

  // 监听窗口 resize 重新定位
  useEffect(() => {
    if (showCard) {
      window.addEventListener('resize', updateCardPosition);
      return () => window.removeEventListener('resize', updateCardPosition);
    }
  }, [showCard, updateCardPosition]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
          cardRef.current &&
          !cardRef.current.contains(e.target) &&
          questionIconRef.current &&
          !questionIconRef.current.contains(e.target)
      ) {
        setShowCard(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🆕 滚动时自动关闭提示卡片
  useEffect(() => {
    if (!showCard) return;

    const handleScroll = () => {
      setShowCard(false);
    };

    // 监听全局滚动（捕获阶段更全面）
    window.addEventListener('scroll', handleScroll, true);
    // 监听文件树容器自身的滚动
    const container = scrollContainerRef?.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [showCard, scrollContainerRef]);

  // --- 配色优化后的主题颜色映射 ---
  const getColor = (light, dark) => (currentTheme === 'dark' ? dark : light);

  const textColor = getColor('#333', '#e2e8f0');
  const arrowColor = getColor('#666', '#94a3b8');
  const folderColor = getColor('#f59e0b', '#fbbf24');
  const fileColor = getColor('#6b7280', '#cbd5e1');
  const questionIconColor = getColor('#a0aec0', '#94a3b8');
  const selectedBg = getColor('#e0f2fe', '#3c404a');
  const hoverBg = getColor('#f1f5f9', '#2a2d37');
  const cardBgColor = getColor('#ffffff', '#2b2d35');
  const cardBorderColor = getColor('#e2e8f0', '#4b5563');
  const cardShadow = getColor(
      '0 4px 12px rgba(0,0,0,0.1)',
      '0 4px 12px rgba(0,0,0,0.4)'
  );

  const Icon = isFolder ? (isOpen ? FaFolderOpen : FaFolder) : FaFile;
  const ArrowIcon = isFolder ? (isOpen ? FaChevronDown : FaChevronRight) : null;
  const MAX_INDENT = 200;
  const indent = Math.min(depth * 20, MAX_INDENT);

  const cardDynamicStyle = {
    ...cardStyle,
    maxWidth: 'min(90vw, 400px)',
    padding: '12px',
    backgroundColor: cardBgColor,
    border: `1px solid ${cardBorderColor}`,
    borderRadius: '6px',
    boxShadow: cardShadow,
    zIndex: 1000,
    fontSize: '0.9em',
    color: textColor,
    lineHeight: '1.5',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
  };

  return (
      <div>
        <div
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: `${indent}px`,
              paddingRight: '8px',
              height: '32px',
              cursor: 'default',
              backgroundColor: isSelected ? selectedBg : 'transparent',
              transition: 'background-color 0.1s',
              color: textColor,
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
              whiteSpace: 'nowrap',
              minWidth: 'fit-content',
            }}
            onClick={handleClick}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.backgroundColor = hoverBg;
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
            }}
        >
          <div
              style={{
                width: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
          >
            {ArrowIcon && <ArrowIcon style={{ fontSize: '0.75em', color: arrowColor }} />}
          </div>
          <div
              style={{
                marginLeft: '4px',
                marginRight: '8px',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
          >
            <Icon color={isFolder ? folderColor : fileColor} />
          </div>
          <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
          {node.name}
        </span>
          {node.hoverText && (
              <div
                  ref={questionIconRef}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 1,
                    marginLeft: '8px',
                    flexShrink: 0,
                  }}
                  onClick={handleQuestionClick}
              >
                <FaQuestionCircle style={{ fontSize: '0.8em', color: questionIconColor }} />
              </div>
          )}
        </div>

        {showCard &&
            ReactDOM.createPortal(
                <div ref={cardRef} style={cardDynamicStyle}>
                  {node.hoverText}
                </div>,
                document.body
            )}
      </div>
  );
}

/* ==============================
   主文件树组件（传递容器 ref）
   ============================== */
export default function PluginFileTree({ initialTreeData }) {
  const [treeData, setTreeData] = useState(() => {
    const addState = (nodes) =>
        nodes.map((node) => ({
          ...node,
          isOpen: node.isOpen || false,
          children: node.children ? addState(node.children) : undefined,
        }));
    return addState(initialTreeData);
  });

  const [selectedId, setSelectedId] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef(null); // 文件树容器 ref

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.dataset.theme || 'light';
      setCurrentTheme(theme);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    setCurrentTheme(document.documentElement.dataset.theme || 'light');
    return () => observer.disconnect();
  }, []);

  const toggleNode = useCallback((targetId) => {
    const update = (nodes) =>
        nodes.map((node) => {
          if (node.id === targetId) return { ...node, isOpen: !node.isOpen };
          if (node.children) return { ...node, children: update(node.children) };
          return node;
        });
    setTreeData((prev) => update(prev));
  }, []);

  const flatten = (nodes, depth = 0) => {
    let result = [];
    for (const node of nodes) {
      result.push({ ...node, depth });
      if (node.children && node.isOpen) {
        result = result.concat(flatten(node.children, depth + 1));
      }
    }
    return result;
  };

  const visibleNodes = flatten(treeData);

  const ROW_HEIGHT = 32;
  const PADDING_VERTICAL = 16 * 2;
  const MIN_HEIGHT = 32;
  const MAX_HEIGHT = 500;
  const totalHeight = Math.min(
      MAX_HEIGHT,
      Math.max(MIN_HEIGHT, visibleNodes.length * ROW_HEIGHT + PADDING_VERTICAL)
  );

  const containerBg = currentTheme === 'dark' ? '#1e1f29' : '#f8fafc';
  const containerHoverBg = currentTheme === 'dark' ? '#252830' : '#ecedf0';
  const borderColor = currentTheme === 'dark' ? '#3f3f46' : '#eeeeee';

  return (
      <div
          ref={containerRef}
          style={{
            boxSizing: 'border-box',
            width: '100%',
            borderRadius: '8px',
            padding: '16px',
            overflowX: 'auto',
            overflowY: 'auto',
            transition: 'height 0.3s ease, background-color 0.2s',
            height: `${totalHeight}px`,
            border: `2px solid ${borderColor}`,
            backgroundColor: hovered ? containerHoverBg : containerBg,
            userSelect: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
      >
        {visibleNodes.map((node) => (
            <TreeNode
                key={node.id}
                node={{ ...node, toggle: () => toggleNode(node.id) }}
                depth={node.depth}
                currentTheme={currentTheme}
                selectedId={selectedId}
                onSelect={setSelectedId}
                scrollContainerRef={containerRef}
            />
        ))}
      </div>
  );
}