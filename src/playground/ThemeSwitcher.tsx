export const ThemeSwitcher = () => (
  <div className="my-4 space-x-1 text-xs text-slate-500 dark:text-slate-400">
    <span>Set theme:</span>
    <ThemeSwitcherButton theme="light" />
    <ThemeSwitcherButton theme="dark" />
    <ThemeSwitcherButton theme="system" />
  </div>
);

const ThemeSwitcherButton = ({
  theme,
}: {
  theme: "light" | "dark" | "system";
}) => {
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
    <button
      type="button"
      onClick={callback}
      className="rounded bg-slate-200 px-1 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
    >
      {theme}
    </button>
  );
};
