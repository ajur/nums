import { useState } from "react";
import { Array2D } from "~/utils/Array2D";
import { ContentBox } from "./ContentBox";

const EditButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button className="h-8 w-8 rounded bg-sky-500" onClick={onClick}>
    {label}
  </button>
);

export const GridWithEditableSize = ({ w, h, hide }: { w: number; h: number, hide?: boolean }) => {
  const [grid, setGrid] = useState(Array2D.from(w, h, 1));

  return (
    <ContentBox hide={hide} description="Grid with editable size" className="flex gap-2">
      <div className="flex flex-col justify-center  gap-2 ">
        {/* grid left */}
        <EditButton label="+" onClick={() => setGrid(grid.addCols(0, 1, 0))} />
        <EditButton label="-" onClick={() => setGrid(grid.removeCols(0, 1))} />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex justify-center gap-2">
          {/* grid top */}
          <EditButton label="+" onClick={() => setGrid(grid.addRows(0, 1, 0))} />
          <EditButton label="-" onClick={() => setGrid(grid.removeRows(0, 1))} />
        </div>
        <div className={`grid flex-1 gap-2  grid-cols-${grid.width}`}>
          {grid.data.map((val, idx) => (
            <div
              key={idx}
              className="grid aspect-square place-content-center rounded-full bg-violet-300"
            >
              {val}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 ">
          {/* grid bottom */}
          <EditButton label="+" onClick={() => setGrid(grid.addRows(Infinity, 1, 0))} />
          <EditButton label="-" onClick={() => setGrid(grid.removeRows(-1, 1))} />
        </div>
      </div>

      <div className="flex flex-col justify-center gap-2 ">
        {/* grid right */}
        <EditButton label="+" onClick={() => setGrid(grid.addCols(Infinity, 1, 0))} />
        <EditButton label="-" onClick={() => setGrid(grid.removeCols(-1, 1))} />
      </div>
    </ContentBox>
  );
};
