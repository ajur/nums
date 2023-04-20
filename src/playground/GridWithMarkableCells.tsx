import { useEffect, useState } from "react";
import { Array2D } from "~/utils/Array2D";
import { SimpleHistory } from "~/utils/SimpleHistory";
import { ContentBox } from "./ContentBox";

type PointerState = {
  value: boolean;
  startPos: [number, number];
  startGrid: Array2D<boolean>;
}

type NumberPickerProps = {
  value: number,
  numbers: number[];
  onChange: (val: number) => void;
};

const NumberPicker = ({ value, numbers, onChange }: NumberPickerProps) => {
  return (
    <select
      value={value}
      onChange={(evt) => onChange(parseInt(evt.target.value))}
      className="rounded px-1 text-center dark:bg-slate-800 dark:text-slate-100"
    >
      {numbers.map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );
};

type ToggleSwitchProps = {
  on: boolean;
  onChange: (val: boolean) => void;
};

const ToggleSwitch = ({ on, onChange }: ToggleSwitchProps) => {
  return (
    <label className="inline-flex align-top items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={on}
          onChange={() => onChange(!on)}
        />
        <div className="block bg-white dark:bg-slate-800 w-10 h-6 rounded-full"></div>
        <div
          className={
            "dot absolute left-1 top-1 bg-slate-800 dark:bg-slate-100 w-4 h-4 rounded-full transition " +
            (on ? "transform translate-x-full" : "")
          }
        ></div>
      </div>
    </label>
  );
};


type UndoRedoButtonsProps = {
  history: SimpleHistory<Array2D<boolean>>;
  onUndo: () => void;
  onRedo: () => void;
};
const UndoRedoButtons = ({history, onUndo, onRedo}: UndoRedoButtonsProps) => (
  <span className="mx-2 dark:text-slate-100">
    <button
      className="mr-1 bg-white dark:bg-slate-800 px-2 rounded disabled:text-slate-400"
      onClick={onUndo}
      disabled={!history.canUndo()}
    >
      <svg
          className="inline-block w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M 4 15 l 7 0 a 1 1 90 0 0 0 -12 l -5 0 l 0 -2 l -5 3 l 5 3 l 0 -2 l 5 0 a 1 1 90 0 1 0 8 l -7 0 z"
            clipRule="evenodd"
          />
        </svg>
    </button>
    <button
      className="bg-white dark:bg-slate-800 px-2 rounded disabled:text-slate-400"
      onClick={onRedo}
      disabled={!history.canRedo()}
    >
      <svg
          className="inline-block w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M 15 15 l -7 0 a 1 1 90 0 1 0 -12 l 5 0 l 0 -2 l 5 3 l -5 3 l 0 -2 l -5 0 a 1 1 90 0 0 0 8 l 7 0 z"
            clipRule="evenodd"
          />
        </svg>
    </button>
  </span>
)


export const GridWithMarkableCells = ({
  sizes = [5, 7, 11, 19],
  defaultSize = 11,
  hide = false,
}) => {
  const [grid, setGrid] = useState(Array2D.from(defaultSize, defaultSize, false));
  const [isMarkArea, setIsMarkArea] = useState(false);
  
  const [isMarking, setIsMarking] = useState(false);
  const [pointerState, setPointerState] = useState<PointerState | null>(null);
  const [editHistory, setEditHistory] = useState(SimpleHistory.create(grid));

  const setGridWithHistory = (newGrid: Array2D<boolean>) => {
    setGrid(newGrid);
    setEditHistory(editHistory.set(newGrid));
  };

  const handleUndo = () => {
    const undone = editHistory.undo();
    setGrid(undone.get());
    setEditHistory(undone);
  };

  const handleRedo = () => {
    const redone = editHistory.redo();
    setGrid(redone.get());
    setEditHistory(redone);
  };

  const handleSizeChange = (newSize: number): void => {
    setGridWithHistory(grid.resize(newSize, newSize, false));
  };

  const pointerStarted = (x: number, y: number): void => {
    setIsMarking(true);
    const value = !grid.get(x, y);
    setPointerState({
      value,
      startPos: [x, y],
      startGrid: grid,
    });
    setGrid(grid.with(x, y, value));
  };

  const pointerMove = (x: number, y: number): void => {
    if (isMarking && pointerState !== null) {
      if (!isMarkArea) {
        setGrid(grid.with(x, y, pointerState.value));
      } else {
        // mark rectangular area
        const { startPos, startGrid } = pointerState;
        const [x0, y0] = startPos;
        const xMin = Math.min(x0, x);
        const xMax = Math.max(x0, x);
        const yMin = Math.min(y0, y);
        const yMax = Math.max(y0, y);
        const newGrid = startGrid.map((v, x, y) => {
          if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
            return pointerState.value;
          }
          return v;
        });
        setGrid(newGrid);
      }
    }
  };

  const onPointerLeave = (): void => {
    if (isMarking) {
      setIsMarking(false);
      if (pointerState !== null && pointerState.startGrid !== null) {
        setGrid(pointerState.startGrid);
      } else {
        setGrid(editHistory.get());
      }
    }
  }

  const onPointerUp = (): void => {
    if (isMarking) {
      setIsMarking(false);
      setGridWithHistory(grid);
    }
  };

  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  });

  return (
    <ContentBox hide={hide} description="Game board editor">
      <div className="mb-2">
        <svg
          className="inline mr-1 w-4 h-4 text-slate-800 dark:text-slate-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="m 4 15 l 0 2 l 0 0 l 2 0 l 0 -2 l 8 0 l 0 2 l 4 -3 l -4 -3 l 0 2 l -8 0 l 0 -8 l 2 0 l -3 -4 l -3 4 l 2 0 l 0 8 l -2 0 l 0 2 l 2 0 z"
            clipRule="evenodd"
          />
        </svg>
        <NumberPicker value={grid.width} numbers={sizes} onChange={handleSizeChange} />
      </div>
      <div className="mb-2">
        <button onClick={() => setGridWithHistory(grid.map(() => false))} className="dark:text-slate-100 dark:bg-slate-800 px-2 rounded">Clear</button>
        <button onClick={() => setGridWithHistory(grid.map(() => true))} className="dark:text-slate-100 dark:bg-slate-800 px-2 rounded ml-2">Fill</button>
        <span className="mx-2">
          <svg
            className=" mr-1 inline w-4 h-4 text-slate-800 dark:text-slate-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M 5 5 a 2 2 0 1 0 0 -4 a 2 2 0 0 0 0 4 z m 0 6 a 2 2 0 1 0 0 -4 a 2 2 0 0 0 0 4 z m 6 0 a 2 2 0 1 0 0 -4 a 2 2 0 0 0 0 4 z m 6 0 a 2 2 0 1 0 0 -4 a 2 2 0 0 0 0 4 z m 0 6 a 2 2 0 1 0 0 -4 a 2 2 0 0 0 0 4 z"
              clipRule="evenodd"
            />
          </svg>
          
          <ToggleSwitch on={isMarkArea} onChange={setIsMarkArea} />
          <svg
            className="ml-1 inline w-4 h-4 text-slate-800 dark:text-slate-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 5a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4zm6-12a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4zm6-12a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <UndoRedoButtons history={editHistory} onUndo={handleUndo} onRedo={handleRedo} />
      </div>
      <div
        
        className={`grid flex-1 touch-none gap-0.5 grid-cols-${grid.width}`}
      >
        {
          grid.map((val, x, y) => (
            <div
              key={`${x}x${y}`}
              onPointerDown={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                evt.currentTarget.releasePointerCapture(evt.pointerId);
                pointerStarted(x, y);
              }}
              onPointerMove={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                pointerMove(x, y);
              }}
              className={
                "grid aspect-square place-content-center rounded-md " +
                (val ? "bg-sky-500" : "dark:bg-slate-800 bg-white")
              }
            ></div>
          )).data
        }
      </div>
    </ContentBox>
  );
};
