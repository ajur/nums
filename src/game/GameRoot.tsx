import { Link } from "react-router-dom";

export default function GameRoot() {
  return (
    <div className="mx-auto max-w-screen-md p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-sky-500">Nums game</h1>
      </header>
      <section className="dark:text-slate-300">
        Currently only in a form of a <Link className="underline hover:" to={"playground"}>playground</Link> for tools I intend to use in the game.
      </section>
    </div>
  );
}
