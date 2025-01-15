import 'jest-preset-angular/setup-jest';
import 'zone.js';
import 'zone.js/testing';

// Mock window properties for tests
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true
  })
});
