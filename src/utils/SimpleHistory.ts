
/**
 * Simple immutable history class to keep track of the last values of a variable
 * and allow undo/redo.
 */
export class SimpleHistory<T> {

  private constructor(private history: T[] = [], private pointer = 0) {

  }

  static create<T>(initialValue: T) {
    return new SimpleHistory([initialValue]);
  }

  get() {
    return this.history[this.pointer];
  }

  set(value: T) {
    const prev = this.history.slice(0, this.pointer + 1);
    prev.push(value);
    return new SimpleHistory(prev, this.pointer + 1);
  }

  undo() {
    return new SimpleHistory(this.history, Math.max(0, this.pointer - 1));
  }

  redo() {
    return new SimpleHistory(this.history, Math.min(this.history.length - 1, this.pointer + 1));
  }

  canUndo() {
    return this.pointer > 0;
  }

  canRedo() {
    return this.pointer < this.history.length - 1;
  }

}


//
// =================================================================
// TESTS
// =================================================================
//

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('SimpleHistory', () => {
    it('should create a new history with initial value', () => {
      const history = SimpleHistory.create('initial');
      expect(history.get()).toBe('initial');
      expect(history.canUndo()).toBe(false);
      expect(history.canRedo()).toBe(false);
    });

    it('should set a new value', () => {
      const history = SimpleHistory.create('initial');
      const newHistory = history.set('new');
      expect(newHistory.get()).toBe('new');
      expect(newHistory.canUndo()).toBe(true);
      expect(newHistory.canRedo()).toBe(false);
    });

    it('should undo a change', () => {
      const history = SimpleHistory.create('initial');
      const newHistory = history.set('new');
      const undoHistory = newHistory.undo();
      expect(undoHistory.get()).toBe('initial');
      expect(undoHistory.canUndo()).toBe(false);
      expect(undoHistory.canRedo()).toBe(true);
    });

    it('should redo a change', () => {
      const history = SimpleHistory.create('initial');
      const newHistory = history.set('new');
      const undoHistory = newHistory.undo();
      const redoHistory = undoHistory.redo();
      expect(redoHistory.get()).toBe('new');
      expect(redoHistory.canUndo()).toBe(true);
      expect(redoHistory.canRedo()).toBe(false);
    });

    it('should not be able to redo if no more history', () => {
      const history = SimpleHistory.create('initial');
      const newHistory = history.set('new');
      const undoHistory = newHistory.undo();
      const redoHistory = undoHistory.redo();
      const redoAgainHistory = redoHistory.redo();
      expect(redoAgainHistory.get()).toBe('new');
      expect(redoAgainHistory.canUndo()).toBe(true);
      expect(redoAgainHistory.canRedo()).toBe(false);
    });

    it('should not be able to undo if no more history', () => {
      const history = SimpleHistory.create('initial');
      const newHistory = history.set('new');
      const undoHistory = newHistory.undo();
      const undoAgainHistory = undoHistory.undo();
      expect(undoAgainHistory.get()).toBe('initial');
      expect(undoAgainHistory.canUndo()).toBe(false);
      expect(undoAgainHistory.canRedo()).toBe(true);
    });

    it('should replace redo history when setting a new value', () => {
      const history = SimpleHistory.create('initial');
      const newHistory = history.set('new');
      const undoHistory = newHistory.undo();
      const newRedoHistory = undoHistory.set('newer');
      expect(newRedoHistory.get()).toBe('newer');
      expect(newRedoHistory.canUndo()).toBe(true);
      expect(newRedoHistory.canRedo()).toBe(false);
      const newUndoHistory = newRedoHistory.undo();
      expect(newUndoHistory.get()).toBe('initial');
      expect(newUndoHistory.canUndo()).toBe(false);
      expect(newUndoHistory.canRedo()).toBe(true);
    });
  });
}
