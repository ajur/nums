import { useEffect, useState } from "react";
import { ContentBox } from "./ContentBox";
import { useParams } from "react-router-dom";
import { BoardMap } from "./boardMap";

const DEFAULT_MAP = "bU3Y1-U____-___f-0vwf0";

export const BoardConcept = () => {
  const { boardMapString } = useParams();
  const boardMap = BoardMap.decode(boardMapString || DEFAULT_MAP);
  
  const pointerStarted = (x: number, y: number): void => {
    // TODO: implement
  };

  const pointerMove = (x: number, y: number): void => {
    // TODO: implement
  };

  const onPointerLeave = (): void => {
    // TODO: implement
  };

  const onPointerUp = (): void => {
    // TODO: implement
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
    <ContentBox description="Playable board concept for nums game">
      <div className={`grid grid-cols-${boardMap.size}`}>
        {
          boardMap.mapToArray((val, x, y) => (
            <BoardCell
              key={`${x}x${y}`}
              x={x}
              y={y}
              value={val}
              onPointerDown={pointerStarted}
              onPointerMove={pointerMove}
            />
          ))
        }
      </div>
    </ContentBox>
  );
};

type BoardCellProps = {
  x: number;
  y: number;
  value: boolean;
  onPointerDown: (x: number, y: number) => void;
  onPointerMove: (x: number, y: number) => void;
};

const BoardCell = ({
  x,
  y,
  value,
  onPointerDown,
  onPointerMove,
}: BoardCellProps) => {
  return (
    <div
      key={`${x}x${y}`}
      onPointerDown={(evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        evt.currentTarget.releasePointerCapture(evt.pointerId);
        onPointerDown(x, y);
      }}
      onPointerMove={(evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        onPointerMove(x, y);
      }}
      className={
        "grid aspect-square place-content-center rounded-md " +
        (value ? "bg-sky-500" : "bg-white dark:bg-slate-800")
      }
    >

    </div>
  );
};
