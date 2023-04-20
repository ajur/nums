import { Counter } from "./Counter";
import Playground from "./Playground";
import { ThemeSwitcher } from "./ThemeSwitcher";
import type { RouteObject } from "react-router-dom";
import { Link } from "react-router-dom";
import { VariableGridSize } from "./VariableGridSize";
import { GridWithEditableSize } from "./GridWithEditableSize";
import { GridWithMarkableCells } from "./GridWithMarkableCells";

export default {
  element: <Playground />,
  children: [
    {
      index: true,
      element: <Index />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
    {
      path: "counter",
      element: <Counter />,
    },
    {
      path: "grid/variable",
      element: <VariableGridSize />,
    },
    {
      path: "grid/editable",
      element: <GridWithEditableSize w={5} h={5} />,
    },
    {
      path: "mapEditor",
      element: <GridWithMarkableCells />,
    },
  ],
} satisfies RouteObject;

const menuItems = [
  {
    path: "counter",
    title: "Counter",
    description: "simple counter, react basics",
  },
  {
    path: "grid/variable",
    title: "Variable grid",
    description: "css grid with variable size using tailwind",
  },
  {
    path: "grid/editable",
    title: "Editable grid",
    description: "grid with dynamic size",
  },
  {
    path: "mapEditor",
    title: "Map editor",
    description: "grid with markable cells, basis for simple map editor",
  },
];

function Index() {
  return (
    <div>
      <h6 className="text-xs italic text-slate-400">
        react, typescript, and tailwind playground/testbed for use in nums game
      </h6>

      <ThemeSwitcher />

      <nav className="text-pink-500">
        <ul>
          {menuItems.map(({path, title, description}) => (
            <li key={path} className="group mb-2">
              <Link to={path} className="text-lg group-hover:underline">{title}</Link>
              <p className="text-xs italic text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">{description}</p>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function ErrorPage() {
  return (
    <div>
      <h2 className="text-2xl italic dark:text-slate-100">Page not found</h2>
      <h2 className="text-xs text-slate-400">404</h2>
    </div>
  );
}
