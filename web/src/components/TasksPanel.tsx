import { type FormEvent, useMemo, useState } from "react";
import { api, messageOf } from "../api";
import { formatDateTime, fromInputValue, isPast, toInputValue, tomorrowAtSix } from "../format";
import { useCollection, usePending } from "../hooks";
import type { Priority, Task } from "../types";
import { Dialog } from "./Dialog";

const PRIORITY_LABEL: Record<Priority, string> = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
};

function compareTasks(a: Task, b: Task): number {
  if (a.status !== b.status) {
    return a.status === "NEXT" ? -1 : 1;
  }

  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
}

export function TasksPanel({ active }: { active: boolean }) {
  const { items, loading, error, setError, upsert, remove } =
    useCollection<Task>(api.tasks.list);
  const { pending, run } = usePending();
  const [editing, setEditing] = useState<Task | "new" | null>(null);

  const sorted = useMemo(() => [...items].sort(compareTasks), [items]);
  const openCount = items.filter((task) => task.status === "NEXT").length;

  function toggle(task: Task) {
    setError(null);

    void run(task.publicId, async () => {
      try {
        const updated = await api.tasks.update(task.publicId, {
          status: task.status === "COMPLETED" ? "NEXT" : "COMPLETED",
        });
        upsert(updated);
      } catch (caught) {
        setError(messageOf(caught));
      }
    });
  }

  function handleDelete(task: Task) {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) {
      return;
    }

    setError(null);

    void run(task.publicId, async () => {
      try {
        await api.tasks.remove(task.publicId);
        remove(task.publicId);
      } catch (caught) {
        setError(messageOf(caught));
      }
    });
  }

  return (
    <section
      className="panel"
      data-theme="tasks"
      data-active={active}
      aria-labelledby="tasks-title"
    >
      <header className="panel-head">
        <div>
          <h2 id="tasks-title">Tarefas</h2>
          <p className="summary">
            {openCount === 1 ? "1 pendente" : `${openCount} pendentes`}
          </p>
        </div>
        <button type="button" className="btn" onClick={() => setEditing("new")}>
          Nova tarefa
        </button>
      </header>

      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="empty">Carregando tarefas...</p>
      ) : sorted.length === 0 ? (
          error ? null : (
        <p className="empty">
          Nenhuma tarefa por aqui. Use "Nova tarefa" para registrar a primeira.
        </p>
      )
        ) : (
        <ul className="list">
          {sorted.map((task) => {
            const done = task.status === "COMPLETED";
            const overdue = !done && isPast(task.deadline);
            const busy = pending.has(task.publicId);

            return (
              <li key={task.publicId} className="item" data-done={done}>
                <label className="check-wrap">
                  <input
                    type="checkbox"
                    className="check"
                    checked={done}
                    disabled={busy}
                    onChange={() => toggle(task)}
                    aria-label={
                      done
                        ? `Reabrir a tarefa ${task.title}`
                        : `Concluir a tarefa ${task.title}`
                    }
                  />
                </label>

                <div className="item-body">
                  <p className="item-title">{task.title}</p>
                  <p className="item-desc">{task.description}</p>
                  <p className="item-meta">
                    <span className="chip" data-priority={task.priority}>
                      {PRIORITY_LABEL[task.priority]}
                    </span>
                    <span data-overdue={overdue}>
                      {overdue ? "Atrasada desde " : "Até "}
                      {formatDateTime(task.deadline)}
                    </span>
                  </p>
                </div>

                <div className="item-actions">
                  <button
                    type="button"
                    className="btn btn-quiet"
                    disabled={busy}
                    onClick={() => setEditing(task)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-quiet"
                    disabled={busy}
                    onClick={() => handleDelete(task)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing !== null && (
        <TaskDialog
          task={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            upsert(saved);
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

interface TaskDialogProps {
  task: Task | null;
  onClose: () => void;
  onSaved: (task: Task) => void;
}

function TaskDialog({ task, onClose, onSaved }: TaskDialogProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [deadline, setDeadline] = useState(
    task ? toInputValue(task.deadline) : tomorrowAtSix(),
  );
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "MEDIUM");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      deadline: fromInputValue(deadline),
      priority,
    };

    try {
      const saved = task
        ? await api.tasks.update(task.publicId, payload)
        : await api.tasks.create(payload);
      onSaved(saved);
    } catch (caught) {
      setError(messageOf(caught));
      setSaving(false);
    }
  }

  return (
    <Dialog
      title={task ? "Editar tarefa" : "Nova tarefa"}
      theme="tasks"
      onClose={onClose}
    >
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="task-title">Título</label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="task-description">Descrição</label>
          <textarea
            id="task-description"
            rows={3}
            maxLength={500}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="task-deadline">Prazo</label>
            <input
              id="task-deadline"
              type="datetime-local"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="task-priority">Prioridade</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
            >
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Média</option>
              <option value="LOW">Baixa</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-quiet" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Salvando..." : "Salvar tarefa"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
