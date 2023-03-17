import { useState } from "react";
import { MouseEventHandler } from "react";

type CounterButtonProps = {
  text: "+" | "-";
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const CounterButton = ({ text, onClick }: CounterButtonProps) => (
  <button className="h-12 w-12 rounded bg-sky-300" onClick={onClick}>
    {text}
  </button>
);

export const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div className="my-1 space-x-2">
      <CounterButton text="+" onClick={increment} />

      <input
        type="text"
        value={count}
        readOnly
        className="h-12 w-12 rounded text-center bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100"
      />

      <CounterButton text="-" onClick={decrement} />
    </div>
  );
};
