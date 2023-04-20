import { useState } from "react";
import { ContentBox } from "./ContentBox";

export const VariableGridSize = ({ hide }: { hide?: boolean }) => {
  const [gridSize, setGridSize] = useState(6);

  return (
    <ContentBox hide={hide} description="Variable grid size">
      <div className="mb-4 flex space-x-2 text-violet-300">
        <span>Grid size:</span>
        <input
          type="range"
          name="Grid size"
          min={3}
          max={25}
          step={1}
          value={gridSize}
          onChange={(evt) => setGridSize(+evt.target.value)}
        />
        <span>{gridSize}</span>
      </div>
      <div className={`grid gap-2 grid-cols-${gridSize}`}>
        {Array.from({ length: 30 }).map((_, idx) => (
          <div
            key={idx}
            className="grid aspect-square place-content-center rounded-full bg-violet-300"
          >
            {idx}
          </div>
        ))}
      </div>
    </ContentBox>
  );
};
