import {useEffect, useRef, useState} from 'react';

// 提前一小段距离挂载，并在首次挂载后保留交互状态。
export default function useNearViewport() {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReady(true);
        observer.disconnect();
      }
    }, {rootMargin: '300px'});
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, ready];
}
