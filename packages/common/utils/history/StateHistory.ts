import { LinkedListDouble, NodeDouble } from ".."

interface IStateHistory<T> {
  [key: string]: {
    states: LinkedListDouble<T>,
    currentState: NodeDouble<T>
  }
}

export class StateHistory<T> {
  private _history: IStateHistory<T> = {};

  constructor(key: string, initialState: T) {
    this.saveState(key, initialState);
    // TODO: Add optional limit of how many states are saved in the LRU-like cache
  }

  getState(key: string): T {
    console.log('getState: ', this._history[key]?.currentState)
    return this._history[key]?.currentState?.val;
  }

  hasUndo(key: string): boolean {
    if (key) {
      const currentState = this._history[key]?.currentState;

      return !!currentState && !!currentState.prev;
    }
    return false;
  }

  hasRedo(key: string): boolean {
    if (key) {
      const currentState = this._history[key]?.currentState;

      return !!currentState && !!currentState.next;
    }
    return false;
  }

  executeCmd(key: string, state: T, command: () => void) {
    if (command) {
      command();
      this.saveState(key, state);
      // TODO: Handle case of this being called after some 'undos', as this should drop the remaining states
    }
  }

  undo(key: string, state: T) {
    console.log('Undo!')

    // this.saveState(key, state);

    const currentState = this._history[key]?.currentState?.prev;
    this.updateCurrentState(key, currentState);
  }

  redo(key: string) {
    console.log('Redo!')
    const currentState = this._history[key]?.currentState?.next as NodeDouble<T>;
    this.updateCurrentState(key, currentState);
  }

  protected saveState(key: string, state: T) {
    if (key && state) {
      const states = this._history[key]
        ? this._history[key].states
        : new LinkedListDouble<T>();

      states.append(state);

      const currentState = this._history[key]
        ? this._history[key].currentState.next as NodeDouble<T>
        : states.head;

      if (states && currentState) {
        this._history[key] = { states, currentState };
      }
    }
  };

  protected updateCurrentState(
    key: string,
    state: NodeDouble<T> | null
  ) {
    if (this._history[key] && state) {
      this._history[key].currentState = state;
    }
  }
}