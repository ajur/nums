import { Counter } from "./Counter";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { VariableGridSize } from "./VariableGridSize";
import { GridWithEditableSize } from "./GridWithEditableSize";
import { GridWithMarkableCells } from "./GridWithMarkableCells";
import { Outlet } from "react-router-dom";


export default function Playground() {
  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-sky-500">Playground</h1>  
      </header>

      <Outlet />
    </div>
  );
}