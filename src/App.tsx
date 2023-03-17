import { Counter } from "~/Counter";
import { getAbsoluteUrl } from "~/utils";

function App() {
  return (
    <div className="p-4">
      <header className="py-8">
        <h1 className="text-2xl font-bold text-sky-500">NUMs game </h1>
        <h6 className="text-xs italic text-slate-400">currently in a state of a react stub app :)</h6>
      </header>

      <Counter />

      <div className="text-xs text-slate-400 mt-10">
        Some debug info:
        <ul className="list-disc list-inside">
          <li>Root: {getAbsoluteUrl("/")}</li>
          <li>This app: {getAbsoluteUrl(import.meta.env.BASE_URL)}</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
