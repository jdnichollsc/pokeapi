import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

const variantStyles = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  ghost: 'btn-ghost',
};

@Component({
  selector: 'todo-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
})
export class TodoButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'accent' | 'ghost' = 'primary';
  @Input() class = '';
  @Input() disabled: boolean | null = false;

  get variantStyle() {
    return variantStyles[this.variant];
  }
}
