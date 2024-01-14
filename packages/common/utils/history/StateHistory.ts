import { LinkedListDouble, NodeDouble } from ".."

interface IStateHistorySet<T> {
  states: LinkedListDouble<T | null>;
  currentState: NodeDouble<T | null>;
}

interface IStateHistories<T> {
  [key: string]: IStateHistorySet<T>
}

export interface IStateHistory<T> {
  addHistorySet(key: string): boolean;
  numberOfStates(key: string): number;
  hasUndo(key: string): boolean;
  hasRedo(key: string): boolean;
  undo(key: string, state: T): T | null;
  redo(key: string, state: T): T | null;
  executeCmd(key: string, state: T, command: () => void): void;
}

export class StateHistory<T> {
  private _stateLimit = 0;
  private _histories: IStateHistories<T> = {};

  constructor(stateLimit: number = 0) {
    this._stateLimit = Math.max(stateLimit, 0);
  }

  addNewStateHistory(key: string): boolean {
    if (key && !this._histories[key]) {
      const states = new LinkedListDouble<T | null>();
      states.append(new NodeDouble<T | null>(null));

      const currentState = states.head;

      if (currentState) {
        this._histories[key] = {
          states,
          currentState
        };
        return true;
      }
    }
    return false;
  }

  numberOfStates(key: string): number {
    if (key) {
      const history = this._histories[key];
      if (history) {
        return history.states.size();
      }
    }
    return 0;
  }

  hasUndo(key: string): boolean {
    if (key) {
      const history = this._histories[key];
      const currentState = history?.currentState;

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

  undo(key: string, state: T) {
    if (key) {
      const history = this._histories[key];

      if (history) {
        let currentState: NodeDouble<T> = history.currentState as NodeDouble<T>;

        if (currentState.val === null) {
          currentState.val = state;
        }

        if (currentState.prev) {
          history.currentState = currentState.prev as NodeDouble<T>;
        }
      }
    }

    return this.getState(key);
  }

  redo(key: string, state: T) {
    if (key) {
      const history = this._histories[key];

      if (history) {
        let currentState: NodeDouble<T> = history.currentState as NodeDouble<T>;
        if (currentState.next) {
          currentState = currentState.next as NodeDouble<T>;
        }

        if (currentState.val === null) {
          currentState.val = state;
        }

        history.currentState = currentState;
      }
    }

    return this.getState(key);
  }

  executeCmd(key: string, state: T, command: () => void) {
    if (key && command) {
      command();

      const history = this._histories[key];

      if (history) {
        let currentState: NodeDouble<T> = history.currentState as NodeDouble<T>;

        if (currentState.val === null) {
          currentState.val = state;
        }

        const states = history.states;
        if (currentState.next) {
          states.trim(states.head, history.currentState);
        }

        if (!currentState.next) {
          states.append(new NodeDouble<T | null>(null));
        }

        history.currentState = currentState.next as NodeDouble<T>;

        while (this._stateLimit && states.size() > this._stateLimit) {
          states.removeHead();
        }
      }
    }
  }

  private getState(key: string): T | null {
    return this._histories[key]?.currentState?.val;
  }
}