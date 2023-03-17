import { Counter } from "~/Counter";
import { getAbsoluteUrl } from "~/utils";

const ThemeSwitcherButton = ({theme}: {theme: "light" | "dark" | "system"}) => {
  const callback =
    theme === "system"
      ? () => {
          localStorage.removeItem("theme");
          window.reloadTheme();
        }
      : () => {
          localStorage.theme = theme;
          window.reloadTheme();
        };

  return (
    <button type="button" onClick={callback} className="px-1 rounded text-slate-500 bg-slate-200 dark:bg-slate-700 dark:text-slate-400">
      {theme}
    </button>
  );
};

const ThemeSwitcher = () => (
    <div className="my-4 text-xs space-x-1 text-slate-500 dark:text-slate-400">
      <span>Set theme:</span>
      <ThemeSwitcherButton theme="light" />
      <ThemeSwitcherButton theme="dark" />
      <ThemeSwitcherButton theme="system" />
    </div>
  );

const DebugInfo = () => (
  <div className="mt-10 text-xs text-slate-400">
    Some debug info:
    <ul className="list-inside list-disc">
      <li>Root: {getAbsoluteUrl("/")}</li>
      <li>This app: {getAbsoluteUrl(import.meta.env.BASE_URL)}</li>
    </ul>
  </div>
);

function App() {
  return (
    <div className="p-4">
      <header className="py-8">
        <h1 className="text-2xl font-bold text-sky-500">NUMs game </h1>
        <h6 className="text-xs italic text-slate-400">
          currently in a state of a react stub app :)
        </h6>
      </header>

      <Counter />

      <DebugInfo />

      <ThemeSwitcher />
    </div>
  );
}

export default App;
