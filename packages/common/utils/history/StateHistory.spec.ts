import { StateHistory } from './StateHistory';

describe('##StateHistory', () => {
  describe('Creation', () => {
    describe('#addHistorySet', () => {
      it('should do nothing for an empty key', () => {
        const history = new StateHistory<number>();

        const resultFirst = history.addHistorySet('');

        expect(resultFirst).toBeFalsy();
      });

      it('should do nothing for a key that already exists', () => {
        const history = new StateHistory<number>();

        const resultFirst = history.addHistorySet('A');

        expect(resultFirst).toBeTruthy();

        const resultRedundant = history.addHistorySet('A');

        expect(resultRedundant).toBeFalsy();
      });

      it('should add a new state history set with a placeholder state', () => {
        const history = new StateHistory<number>();

        const resultFirst = history.addHistorySet('A');

        expect(resultFirst).toBeTruthy();
      });
    });
  });

  describe('Querying', () => {
    describe('#numberOfStates', () => {
      it('should return 0 if the key is empty', () => {
        const history = new StateHistory<number>();

        const numberOfStates = history.numberOfStates('');

        expect(numberOfStates).toEqual(0);
      });

      it('should return 0 if the key does not exist', () => {
        const history = new StateHistory<number>();

        const numberOfStates = history.numberOfStates('A');

        expect(numberOfStates).toEqual(0);
      });

      it('should return the number of states available for the history associated with the provided key', () => {
        const key = 'A';
        const command = () => { };

        const history = new StateHistory<number>();
        expect(history.numberOfStates(key)).toEqual(0);

        history.addHistorySet(key);
        expect(history.numberOfStates(key)).toEqual(1);

        history.executeCmd(key, 1, command);
        expect(history.numberOfStates(key)).toEqual(2);

        history.executeCmd(key, 2, command);
        expect(history.numberOfStates(key)).toEqual(3);

        history.executeCmd(key, 3, command);
        expect(history.numberOfStates(key)).toEqual(4);
      });
    });

    describe('#hasUndo', () => {
      it('should return false if the key isEmpty', () => {
        const history = new StateHistory<number>();

        const result = history.hasUndo('');

        expect(result).toBeFalsy();
      });

      it('should return false if the key does not exist', () => {
        const history = new StateHistory<number>();

        const result = history.hasUndo('A');

        expect(result).toBeFalsy();
      });

      it('should return false if there are no prior states available', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const command2State = 3;
        const history = new StateHistory<number>();

        history.addHistorySet(key);
        expect(history.hasUndo(key)).toBeFalsy();

        history.executeCmd(key, initialState, command);
        history.executeCmd(key, command1State, command);
        history.undo(key, command2State);
        history.undo(key, command1State);

        expect(history.hasUndo(key)).toBeFalsy();
      });

      it('should return true if there are prior states available', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const command2State = 3;
        const history = new StateHistory<number>();

        history.addHistorySet(key);

        history.executeCmd(key, initialState, command);
        expect(history.hasUndo(key)).toBeTruthy();

        history.executeCmd(key, command1State, command);
        expect(history.hasUndo(key)).toBeTruthy();

        history.undo(key, command2State);
        expect(history.hasUndo(key)).toBeTruthy();
      });
    });

    describe('#hasRedo', () => {
      it('should return false if the key is empty', () => {
        const history = new StateHistory<number>();

        const result = history.hasRedo('');

        expect(result).toBeFalsy();
      });

      it('should return false if the key does not exist', () => {
        const history = new StateHistory<number>();

        const result = history.hasRedo('A');

        expect(result).toBeFalsy();
      });

      it('should return false if there are no further states available', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const command2State = 3;
        const history = new StateHistory<number>();

        // At tail of history as it accrues
        history.addHistorySet(key);
        expect(history.hasRedo(key)).toBeFalsy();

        history.executeCmd(key, initialState, command);
        expect(history.hasRedo(key)).toBeFalsy();

        history.executeCmd(key, command1State, command);
        expect(history.hasRedo(key)).toBeFalsy();

        // Working backward in history to head
        history.undo(key, command2State);
        history.undo(key, command1State);
        history.undo(key, initialState);
        history.undo(key, 0);

        // At head, working forward in history
        history.redo(key, initialState);
        history.redo(key, command1State);

        // Back at tail in history
        history.redo(key, command2State);
        expect(history.hasRedo(key)).toBeFalsy();
      });

      it('should return true if there are further states available', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const command2State = 3;
        const history = new StateHistory<number>();

        history.addHistorySet(key);
        history.executeCmd(key, initialState, command);
        history.executeCmd(key, command1State, command);

        history.undo(key, command2State);
        expect(history.hasRedo(key)).toBeTruthy();

        history.undo(key, command1State);
        expect(history.hasRedo(key)).toBeTruthy();

        history.undo(key, initialState);
        expect(history.hasRedo(key)).toBeTruthy();
      });
    });
  });

  describe('Updating', () => {
    describe('#executeCmd', () => {
      it('should do nothing if no key was provided', () => {
        const key = 'A';
        const initialState = 1;
        const command = () => { };
        const history = new StateHistory<number>();
        history.addHistorySet(key);

        const originalNumberOfStates = history.numberOfStates(key);
        expect(originalNumberOfStates).toEqual(1);

        history.executeCmd('', initialState, command)

        const resultingNumberOfStates = history.numberOfStates(key);
        expect(resultingNumberOfStates).toEqual(1);
      });

      // TODO: Create spy to validate that command was executed
      it(`should save the current state to the history of the associated key,
          execute the command & create a placeholder state for the command result`, () => {
        const key = 'A';
        const initialState = 1;
        const command = () => { };
        const history = new StateHistory<number>();

        history.addHistorySet(key);
        expect(history.numberOfStates(key)).toEqual(1);

        history.executeCmd(key, initialState, command)
        expect(history.numberOfStates(key)).toEqual(2);
      });

      it('should drop later states if the current state is not the latest state', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const command2State = 3;
        const command3State = 4;
        const history = new StateHistory<number>();

        history.addHistorySet(key);
        expect(history.numberOfStates(key)).toEqual(1);

        history.executeCmd(key, initialState, command);
        expect(history.numberOfStates(key)).toEqual(2);

        history.executeCmd(key, command1State, command);
        expect(history.numberOfStates(key)).toEqual(3);

        history.executeCmd(key, command2State, command);
        expect(history.numberOfStates(key)).toEqual(4);

        const state1 = history.undo(key, command2State);
        expect(history.numberOfStates(key)).toEqual(4);
        expect(state1).toEqual(command2State);

        const state2 = history.undo(key, command1State);
        expect(history.numberOfStates(key)).toEqual(4);
        expect(state2).toEqual(command1State);

        history.executeCmd(key, command3State, command);
        expect(history.numberOfStates(key)).toEqual(3);
      });

      it('should drop earlier states if a size limit was given & met', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const command2State = 3;
        const command3State = 4;
        const history = new StateHistory<number>(2);

        history.addHistorySet(key);
        expect(history.numberOfStates(key)).toEqual(1);

        history.executeCmd(key, initialState, command);
        expect(history.numberOfStates(key)).toEqual(2);

        history.executeCmd(key, command1State, command);
        expect(history.numberOfStates(key)).toEqual(2);

        history.executeCmd(key, command2State, command);
        expect(history.numberOfStates(key)).toEqual(2);

        const state1 = history.undo(key, command2State);
        expect(history.numberOfStates(key)).toEqual(2);
        expect(state1).toEqual(command2State);

        const state2 = history.undo(key, command1State);
        expect(history.numberOfStates(key)).toEqual(2);
        expect(state2).toEqual(command2State);

        history.executeCmd(key, command3State, command);
        expect(history.numberOfStates(key)).toEqual(2);
      });
    });

    describe('#undo', () => {
      it('should do nothing & return an undefined state if the key is empty', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const history = new StateHistory<number>();

        history.addHistorySet(key);

        history.executeCmd(key, initialState, command);

        const state = history.undo('', command1State);

        expect(state).toBeUndefined();
      });

      it('should do nothing & return an undefined state if the key does not exist', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const history = new StateHistory<number>();

        history.addHistorySet(key);

        history.executeCmd(key, initialState, command);

        const state = history.undo('B', command1State);

        expect(state).toBeUndefined();
      });

      it(`should save the current state, set the current state to the previous state if the current state is the latest state
        & return this previous state`, () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const history = new StateHistory<number>();

        history.addHistorySet(key);

        expect(history.numberOfStates(key)).toEqual(1);

        history.executeCmd(key, initialState, command);

        expect(history.numberOfStates(key)).toEqual(2);

        const state = history.undo(key, command1State);

        expect(state).toEqual(initialState);
        expect(history.numberOfStates(key)).toEqual(2);
      });

      it('should only set the current state to the previous state & return it if not the latest state', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const command2State = 3;
        const history = new StateHistory<number>();

        history.addHistorySet(key);

        expect(history.numberOfStates(key)).toEqual(1);

        history.executeCmd(key, initialState, command);

        expect(history.numberOfStates(key)).toEqual(2);

        history.executeCmd(key, command1State, command);

        expect(history.numberOfStates(key)).toEqual(3);

        const state1 = history.undo(key, command2State);
        expect(state1).toEqual(command1State);

        const state2 = history.undo(key, command1State);
        expect(state2).toEqual(initialState);

        expect(history.numberOfStates(key)).toEqual(3);
      });

      it('should do nothing & return the earliest state if history is at the earliest state', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const history = new StateHistory<number>();

        history.addHistorySet(key);

        history.executeCmd(key, initialState, command);

        const state1 = history.undo(key, command1State);

        expect(state1).toEqual(initialState);

        const state2 = history.undo(key, 2);

        expect(state2).toEqual(1);

        const state3 = history.undo(key, 1);

        expect(state3).toEqual(1);
      });
    });

    describe('#redo', () => {
      it('should do nothing & return an undefined state if the key is empty', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const history = new StateHistory<number>();

        history.addHistorySet(key);

        history.executeCmd(key, initialState, command);

        history.undo(key, command1State);

        const state = history.redo('', initialState);

        expect(state).toBeUndefined();
      });

      it('should do nothing & return an undefined state if the key does not exist ', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const history = new StateHistory<number>();

        history.addHistorySet(key);

        history.executeCmd(key, initialState, command);

        history.undo(key, command1State);

        const state = history.redo('B', initialState);

        expect(state).toBeUndefined();
      });

      it('should set the current state to the next state & return it', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const history = new StateHistory<number>();

        history.addHistorySet(key);

        history.executeCmd(key, initialState, command);

        history.undo(key, command1State);

        const state = history.redo(key, initialState);

        expect(state).toEqual(command1State);
      });

      it('should do nothing & return the latest state if history is at the latest state', () => {
        const key = 'A';
        const command = () => { };
        const initialState = 1;
        const command1State = 2;
        const history = new StateHistory<number>();

        history.addHistorySet(key);

        history.executeCmd(key, initialState, command);

        const state = history.redo(key, command1State);

        expect(state).toEqual(command1State);
      });
    });
  });

  describe('Redo/Undo Sequence', () => {
    it('should return the correct states & alter redo states if executing new commands at an intermediate state', () => {
      const key = 'A';
      const command = () => { };
      const initialState = 1;
      const command1State = 2;
      const command2State = 3;
      const command2AltState = 4;
      const history = new StateHistory<number>();

      // At single state
      history.addHistorySet(key);
      expect(history.hasRedo(key)).toBeFalsy();
      expect(history.hasUndo(key)).toBeFalsy();

      // At tail of history w/ multiple states
      history.executeCmd(key, initialState, command);
      expect(history.hasRedo(key)).toBeFalsy();
      expect(history.hasUndo(key)).toBeTruthy();

      history.executeCmd(key, command1State, command);
      expect(history.hasRedo(key)).toBeFalsy();
      expect(history.hasUndo(key)).toBeTruthy();

      // Working backward in history to head
      const state1 = history.undo(key, command2State);
      expect(state1).toEqual(command1State);
      expect(history.hasRedo(key)).toBeTruthy();
      expect(history.hasUndo(key)).toBeTruthy();

      const state2 = history.undo(key, command1State);
      expect(state2).toEqual(initialState);
      expect(history.hasRedo(key)).toBeTruthy();
      expect(history.hasUndo(key)).toBeFalsy();

      const state3 = history.undo(key, initialState);
      expect(state3).toEqual(initialState);
      expect(history.hasRedo(key)).toBeTruthy();
      expect(history.hasUndo(key)).toBeFalsy();

      const state4 = history.undo(key, 0);
      expect(state4).toEqual(initialState);
      expect(history.hasRedo(key)).toBeTruthy();
      expect(history.hasUndo(key)).toBeFalsy();

      // At head, working forward in history
      const state5 = history.redo(key, initialState);
      expect(state5).toEqual(command1State);
      expect(history.hasRedo(key)).toBeTruthy();
      expect(history.hasUndo(key)).toBeTruthy();

      const state6 = history.redo(key, command1State);
      expect(state6).toEqual(command2State);
      expect(history.hasRedo(key)).toBeFalsy();
      expect(history.hasUndo(key)).toBeTruthy();

      // Back at tail in history
      const state7 = history.redo(key, command2State);
      expect(state7).toEqual(command2State);
      expect(history.hasRedo(key)).toBeFalsy();
      expect(history.hasUndo(key)).toBeTruthy();

      // Work backward a few steps
      const state8 = history.undo(key, command2State);
      expect(state8).toEqual(command1State);
      expect(history.hasRedo(key)).toBeTruthy();
      expect(history.hasUndo(key)).toBeTruthy();

      // Execute a new command
      history.executeCmd(key, command1State, command);
      expect(history.hasRedo(key)).toBeFalsy();
      expect(history.hasUndo(key)).toBeTruthy();

      // Check forward & backward for prior state & new alternate states
      const state9 = history.redo(key, command2AltState);
      expect(state9).toEqual(command2AltState);
      expect(history.hasRedo(key)).toBeFalsy();
      expect(history.hasUndo(key)).toBeTruthy();

      const state10 = history.undo(key, command2AltState);
      expect(state10).toEqual(command1State);
      expect(history.hasRedo(key)).toBeTruthy();
      expect(history.hasUndo(key)).toBeTruthy();

      const state11 = history.redo(key, command1State);
      expect(state11).toEqual(command2AltState);
      expect(history.hasRedo(key)).toBeFalsy();
      expect(history.hasUndo(key)).toBeTruthy();
    });
  });
});