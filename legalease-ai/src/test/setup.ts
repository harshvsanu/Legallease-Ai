import '@testing-library/jest-dom';

// Polyfill window.scrollTo if not in jsdom
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}

// Polyfill matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
