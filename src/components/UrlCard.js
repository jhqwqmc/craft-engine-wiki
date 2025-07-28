import React from 'react';
import styles from './UrlCard.module.css';

export default function UrlCard({ url = '', title = '', subtitle = '' }) {
  let displayLink = url; // 实际用于链接的地址
  let displayDomainOrPath = ''; // 用于显示域名或路径的部分

  // 判断是否为完整的 URL
  const isFullUrl = url.startsWith('http://') || url.startsWith('https://');

  if (isFullUrl) {
    try {
      const urlObject = new URL(url);
      displayDomainOrPath = urlObject.hostname.replace('www.', '');
    } catch (error) {
      console.error("Invalid URL provided to UrlCard:", url, error);
      displayDomainOrPath = '无效链接'; // 错误时的备用显示
    }
  } else {
    // 处理相对路径
    // 如果是相对路径，我们可能需要根据实际需求调整其显示方式
    // 例如，如果是一个指向 Markdown 文件的路径，可以直接显示该路径
    displayDomainOrPath = url; // 直接显示相对路径
    // 如果需要更复杂的相对路径处理（例如，加上一个基础路径），可以在这里进行
    // 举例：如果你所有的 Markdown 文件都在 /docs 目录下
    // displayLink = `/docs/${url}`;
  }

  // 优先显示传入的 title，如果没有则显示域名或路径
  const displayTitle = title || displayDomainOrPath || '链接';

  return (
    <div className={styles.cardWrapper}>
      {url ? (
        <a
          href={displayLink} // 使用 displayLink 作为 href
          className={styles.cardLink}
          // 对于相对路径，通常不需要 target="_blank" 或 rel="noopener noreferrer"
          // 但如果你希望相对路径也在新标签页打开，可以保留
          target={isFullUrl ? "_blank" : "_self"}
          rel={isFullUrl ? "noopener noreferrer" : ""}
        >
          <div className={styles.cardContent}>
            <span className={styles.cardTitle}>{displayTitle}</span>
            <span className={styles.cardUrl}>{subtitle || url}</span> {/* 显示完整的 URL 或相对路径 */}
          </div>
        </a>
      ) : (
        <div className={styles.cardLink + ' ' + styles.disabledCard}>
          <div className={styles.cardContent}>
            <span className={styles.cardTitle}>{displayTitle}</span>
            <span className={styles.cardUrl}>{subtitle || url || '无效链接'}</span>
          </div>
        </div>
      )}
    </div>
  );
}