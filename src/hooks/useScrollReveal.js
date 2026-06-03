import { useEffect, useRef } from 'react';

export function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const targets = container.querySelectorAll('.reveal');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = entry.target.style.getPropertyValue('--delay') || '0s';
            const ms = parseFloat(delay) * 1000;
            setTimeout(() => entry.target.classList.add('visible'), ms);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    targets.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
