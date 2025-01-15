import type { Meta, StoryObj } from '@storybook/angular';
import { TodoButtonComponent } from './button.component';

const meta: Meta<TodoButtonComponent> = {
  component: TodoButtonComponent,
  title: 'ButtonComponent',
};
export default meta;
type Story = StoryObj<TodoButtonComponent>;

export const Primary: Story = {
  args: {
    variant: 'ghost',
  },
  render: (args) => ({
    props: args,
    template: `<todo-button [variant]="variant">
        <span>Click me</span>
    </todo-button>`,
  }),
};
