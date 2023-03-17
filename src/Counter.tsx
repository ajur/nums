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
        className="h-12 w-12 rounded border-2 text-center"
      />

      <CounterButton text="-" onClick={decrement} />
    </div>
  );
};
