import { ActionCreator, ActionType, on } from '@ngrx/store';
import { Draft, produce } from 'immer';

export const produceOn = <C1 extends ActionCreator, S>(
  action: C1,
  fn: (draft: Draft<S>, action: ActionType<C1>) => void
) =>
  on(action, (state: S, action: ActionType<C1>) =>
    produce(state, (draft: Draft<S>) => fn(draft, action))
  );
