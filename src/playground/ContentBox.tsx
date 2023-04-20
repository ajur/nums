import { PropsWithChildren, useState } from "react";

type ContentBoxType = PropsWithChildren<{
  description: string;
  className?: string;
  hide?: boolean;
}>;
export const ContentBox = ({
  description,
  className,
  children,
  hide = false,
}: ContentBoxType) => {
  const [hidden, setHidden] = useState(hide)
  return (
  <>
    <section className="my-6 mx-auto">
      <h4 className="m-1 text-xs text-slate-400">
        {description} <button onClick={() => setHidden(!hidden)} className="bg-slate-100 dark:bg-slate-900 px-1 rounded">{hidden ? "show" : "hide"}</button>
      </h4>
      <div className={`rounded-lg bg-slate-100 p-4 dark:bg-slate-700 ${hidden ? "hidden" : ""} ${className}`}>{children}</div>
    </section>
  </>
)};
