import { LinkedListDouble, NodeDouble } from "@markpthomas/data-structures"

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @interface IStateHistorySet
 * @typedef {IStateHistorySet}
 * @template T
 */
interface IStateHistorySet<T> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @type {LinkedListDouble<T | null>}
 */
  states: LinkedListDouble<T | null>;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @type {NodeDouble<T | null>}
 */
  currentState: NodeDouble<T | null>;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @interface IStateHistories
 * @typedef {IStateHistories}
 * @template T
 */
interface IStateHistories<T> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 */
  [key: string]: IStateHistorySet<T>
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @export
 * @interface IStateHistory
 * @typedef {IStateHistory}
 * @template T
 */
export interface IStateHistory<T> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @returns {boolean}
 */
  addHistorySet(key: string): boolean;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @returns {number}
 */
  numberOfStates(key: string): number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @returns {boolean}
 */
  hasUndo(key: string): boolean;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @returns {boolean}
 */
  hasRedo(key: string): boolean;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @param {T} state
 * @returns {(T | null)}
 */
  undo(key: string, state: T): T | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @param {T} state
 * @returns {(T | null)}
 */
  redo(key: string, state: T): T | null;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @param {T} state
 * @param {() => void} command
 */
  executeCmd(key: string, state: T, command: () => void): void;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @export
 * @class StateHistory
 * @typedef {StateHistory}
 * @template T
 * @implements {IStateHistory<T>}
 */
export class StateHistory<T> implements IStateHistory<T> {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @private
 * @type {number}
 */
  private _stateLimit = 0;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @private
 * @type {IStateHistories<T>}
 */
  private _histories: IStateHistories<T> = {};

  /**
 * Creates an instance of StateHistory.
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @constructor
 * @param {number} [stateLimit=0]
 */
  constructor(stateLimit: number = 0) {
    this._stateLimit = Math.max(stateLimit, 0);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @returns {boolean}
 */
  addHistorySet(key: string): boolean {
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @returns {number}
 */
  numberOfStates(key: string): number {
    if (key) {
      const history = this._histories[key];
      if (history) {
        return history.states.size();
      }
    }
    return 0;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @returns {boolean}
 */
  hasUndo(key: string): boolean {
    if (key) {
      const history = this._histories[key];
      const currentState = history?.currentState;

      return !!currentState && !!currentState.prev;
    }
    return false;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @returns {boolean}
 */
  hasRedo(key: string): boolean {
    if (key) {
      const currentState = this._histories[key]?.currentState;

      return !!currentState && !!currentState.next;
    }
    return false;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @param {T} state
 * @returns {T}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @param {T} state
 * @returns {T}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @param {string} key
 * @param {T} state
 * @param {() => void} command
 * @returns {void) => void}
 */
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

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:41 PM
 *
 * @private
 * @param {string} key
 * @returns {(T | null)}
 */
  private getState(key: string): T | null {
    return this._histories[key]?.currentState?.val;
  }
}