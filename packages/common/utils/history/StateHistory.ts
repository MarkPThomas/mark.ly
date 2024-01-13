import { LinkedListDouble, NodeDouble } from ".."

interface IStateHistory<T> {
  [key: string]: {
    states: LinkedListDouble<T>,
    currentState: NodeDouble<T>,
    currentIndex: number
  }
}

export class StateHistory<T> {
  private _stateLimit = 0;
  private _histories: IStateHistory<T> = {};

  constructor(stateLimit: number = 0) {
    this._stateLimit = Math.max(stateLimit, 0);
  }

  getState(key: string): T {
    console.log('getState: ', this._histories[key]?.currentState)
    return this._histories[key]?.currentState?.val;
  }

  hasUndo(key: string): boolean {
    if (key) {
      const currentState = this._histories[key]?.currentState;

      return !!currentState && !!currentState.prev;
    }
    return false;
  }

  hasRedo(key: string): boolean {
    if (key) {
      const currentState = this._histories[key]?.currentState;

      return !!currentState && !!currentState.next;
    }
    return false;
  }

  executeCmd(key: string, state: T, command: () => void) {
    if (command) {
      command();
      if (!this.dropLaterStates(key)) {
        this.saveState(key, state);
      }
    }
  }

  undo(key: string, state: T) {
    console.log('Undo!')
    const history = this._histories[key];

    this.saveState(key, state, true);
    const currentState = history.currentState?.prev as NodeDouble<T>;

    if (currentState) {
      const currentIndex = history.currentIndex - 1;

      this.updateCurrentState(key, currentState, currentIndex);
    }
  }

  redo(key: string) {
    console.log('Redo!')
    const history = this._histories[key];

    if (history) {
      const currentState = history.currentState?.next as NodeDouble<T>;
      if (currentState) {
        const currentIndex = history.currentIndex + 1;

        this.updateCurrentState(key, currentState, currentIndex);
      }
    }
  }

  protected saveState(key: string, state: T, isUndo: boolean = false) {
    if (key && state) {
      const history = this._histories[key];

      if (history) {
        const states = history.states;
        if (!(isUndo && history.currentIndex !== states.size() - 1)) {
          states.append(state);

          const currentState = history.currentState.next as NodeDouble<T>;
          let currentIndex = history.currentIndex + 1;

          if (states.size() > this._stateLimit) {
            states.removeHead();
            currentIndex -= 1;
          }

          this._histories[key] = {
            states,
            currentState,
            currentIndex
          };
        }
      } else if (!isUndo) {
        const states = new LinkedListDouble<T>();
        states.append(state);

        const currentState = states.head!;
        const currentIndex = 0;

        this._histories[key] = {
          states,
          currentState,
          currentIndex
        };
      }
    }
  };

  protected updateCurrentState(
    key: string,
    state: NodeDouble<T> | null,
    index: number
  ) {
    const history = this._histories[key];
    if (history && state) {
      history.currentState = state;
      history.currentIndex = index;
    }
  }

  protected dropLaterStates(key: string): boolean {
    const history = this._histories[key];
    if (history.currentIndex < history.states.size() - 1) {
      const states = history.states;
      states.trim(states.head, history.currentState);
      return true;
    } else {
      return false;
    }
  }
}