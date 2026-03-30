import { useEffect } from 'react';

export function useScrollReveal(deps = []) {
  useEffect(() => {
    const elements = document.querySelectorAll('.fb-reveal:not(.is-visible)');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 400)}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, deps);
}
