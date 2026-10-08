import { useState } from "react";
import { AbsencesPanel } from "./components/AbsencesPanel";
import { AppointmentsPanel } from "./components/AppointmentsPanel";
import { TasksPanel } from "./components/TasksPanel";

type Tab = "tasks" | "appointments" | "absences";

const TABS: { id: Tab; label: string }[] = [
  { id: "tasks", label: "Tarefas" },
  { id: "appointments", label: "Compromissos" },
  { id: "absences", label: "Faltas" },
];

const today = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());

export default function App() {
  // No celular só uma seção aparece por vez; a partir de 760px todas ficam visíveis.
  const [tab, setTab] = useState<Tab>("tasks");

  return (
    <div className="app">
      <header className="topbar">
        <h1>Painel do semestre</h1>
        <p>{today}</p>
      </header>

      <nav className="tabs" aria-label="Seções">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="tab"
            aria-current={tab === id ? "true" : undefined}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="board">
        <TasksPanel active={tab === "tasks"} />
        <AppointmentsPanel active={tab === "appointments"} />
        <AbsencesPanel active={tab === "absences"} />
      </main>
    </div>
  );
}
