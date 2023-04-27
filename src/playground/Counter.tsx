import { MouseEventHandler, useState } from "react";
import { ContentBox } from "./ContentBox";

type CounterButtonProps = {
  text: "+" | "-";
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const CounterButton = ({ text, onClick }: CounterButtonProps) => (
  <button className="h-12 w-12 rounded bg-sky-500" onClick={onClick}>
    {text}
  </button>
);

export const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <ContentBox description="Simple counter" className="space-x-2">
      <CounterButton text="-" onClick={decrement} />
      <input
        type="text"
        value={count}
        readOnly
        className="h-12 w-12 rounded bg-sky-200 text-center text-slate-700"
      />
      <CounterButton text="+" onClick={increment} />
    </ContentBox>
  );
};
