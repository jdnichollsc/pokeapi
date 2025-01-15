import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { InfiniteScrollDirective } from './infinite-scroll.directive';
import { vi, beforeEach, describe, it, expect } from 'vitest';

@Component({
  template: `<div infiniteScroll [threshold]="threshold" [isLoading]="isLoading" (scrolled)="onScroll()"></div>`
})
class TestComponent {
  threshold = 100;
  isLoading = false;
  onScroll = vi.fn();
}

describe('InfiniteScrollDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;
  let directive: InfiniteScrollDirective;
  let windowMock: { innerHeight: number; scrollY: number };

  beforeEach(async () => {
    windowMock = {
      innerHeight: 500,
      scrollY: 0
    };

    vi.useFakeTimers();

    // Mock window properties
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: windowMock.innerHeight
    });

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: windowMock.scrollY
    });

    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [InfiniteScrollDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(InfiniteScrollDirective));
    directive = directiveElement.injector.get(InfiniteScrollDirective);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should create directive', () => {
    expect(directive).toBeTruthy();
  });

  it('should have default threshold value', () => {
    expect(directive.threshold).toBe(100);
  });

  it('should update threshold value from input', () => {
    component.threshold = 200;
    fixture.detectChanges();
    expect(directive.threshold).toBe(200);
  });

  it('should not emit when loading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();

    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(200);

    expect(component.onScroll).not.toHaveBeenCalled();
  });

  it('should emit when scroll reaches threshold', () => {
    // Mock document height
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 1000
    });

    // Simulate scroll near bottom
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 450 // 450 + 500(innerHeight) + 100(threshold) > 1000(total)
    });

    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(200);

    expect(component.onScroll).toHaveBeenCalledTimes(1);
  });

  it('should not emit when scroll is far from threshold', () => {
    // Mock document height
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 2000
    });

    // Simulate scroll far from bottom
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 100
    });

    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(200);

    expect(component.onScroll).not.toHaveBeenCalled();
  });

  it('should debounce scroll events', () => {
    // Mock document height for threshold check to pass
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 1000
    });

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 450
    });

    // Trigger multiple scroll events rapidly
    for (let i = 0; i < 5; i++) {
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(50);
    }

    vi.advanceTimersByTime(200);
    expect(component.onScroll).toHaveBeenCalledTimes(1);
  });

  it('should cleanup on destroy', () => {
    const completeSpy = vi.spyOn(directive['destroy$'], 'complete');
    directive.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
}); 