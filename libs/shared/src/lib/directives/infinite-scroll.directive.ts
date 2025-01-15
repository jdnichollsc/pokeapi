import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output, inject, PLATFORM_ID } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[infiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Input() threshold = 100;
  @Input() isLoading = false;
  @Output() scrolled = new EventEmitter<void>();
  
  private destroy$ = new Subject<void>();
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'scroll')
        .pipe(
          debounceTime(200),
          filter(() => {
            if (this.isLoading) return false;
            
            const scrolled = window.scrollY;
            const viewportHeight = window.innerHeight;
            const totalHeight = document.documentElement.scrollHeight;
            
            return totalHeight - (scrolled + viewportHeight) < this.threshold;
          }),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.scrolled.emit());
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 