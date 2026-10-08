import { type FormEvent, useMemo, useState } from "react";
import { api, messageOf } from "../api";
import { formatDateTime, fromInputValue, isPast, toInputValue, tomorrowAtSix } from "../format";
import { useCollection, usePending } from "../hooks";
import type { Appointment } from "../types";
import { Dialog } from "./Dialog";

function compareAppointments(a: Appointment, b: Appointment): number {
  if (a.status !== b.status) {
    return a.status === "NEXT" ? -1 : 1;
  }

  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

export function AppointmentsPanel({ active }: { active: boolean }) {
  const { items, loading, error, setError, upsert, remove } =
    useCollection<Appointment>(api.appointments.list);
  const { pending, run } = usePending();
  const [editing, setEditing] = useState<Appointment | "new" | null>(null);

  const sorted = useMemo(() => [...items].sort(compareAppointments), [items]);
  const openCount = items.filter((item) => item.status === "NEXT").length;

  function toggle(appointment: Appointment) {
    setError(null);

    void run(appointment.publicId, async () => {
      try {
        const updated = await api.appointments.update(appointment.publicId, {
          status: appointment.status === "COMPLETED" ? "NEXT" : "COMPLETED",
        });
        upsert(updated);
      } catch (caught) {
        setError(messageOf(caught));
      }
    });
  }

  function handleDelete(appointment: Appointment) {
    if (!window.confirm(`Excluir o compromisso "${appointment.title}"?`)) {
      return;
    }

    setError(null);

    void run(appointment.publicId, async () => {
      try {
        await api.appointments.remove(appointment.publicId);
        remove(appointment.publicId);
      } catch (caught) {
        setError(messageOf(caught));
      }
    });
  }

  return (
    <section
      className="panel"
      data-theme="appointments"
      data-active={active}
      aria-labelledby="appointments-title"
    >
      <header className="panel-head">
        <div>
          <h2 id="appointments-title">Compromissos</h2>
          <p className="summary">
            {openCount === 1 ? "1 pela frente" : `${openCount} pela frente`}
          </p>
        </div>
        <button type="button" className="btn" onClick={() => setEditing("new")}>
          Novo compromisso
        </button>
      </header>

      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="empty">Carregando compromissos...</p>
      ) : sorted.length === 0 ? (
          error ? null : (
        <p className="empty">
          Agenda livre. Use "Novo compromisso" para marcar o primeiro.
        </p>
      )
        ) : (
        <ul className="list">
          {sorted.map((appointment) => {
            const done = appointment.status === "COMPLETED";
            const passed = !done && isPast(appointment.date);
            const busy = pending.has(appointment.publicId);

            return (
              <li key={appointment.publicId} className="item" data-done={done}>
                <label className="check-wrap">
                  <input
                    type="checkbox"
                    className="check"
                    checked={done}
                    disabled={busy}
                    onChange={() => toggle(appointment)}
                    aria-label={
                      done
                        ? `Reabrir o compromisso ${appointment.title}`
                        : `Marcar ${appointment.title} como realizado`
                    }
                  />
                </label>

                <div className="item-body">
                  <p className="item-title">{appointment.title}</p>
                  <p className="item-desc">{appointment.description}</p>
                  <p className="item-meta">
                    <span data-overdue={passed}>
                      {passed ? "Já passou: " : ""}
                      {formatDateTime(appointment.date)}
                    </span>
                    {appointment.local ? (
                      <span>Local: {appointment.local}</span>
                    ) : null}
                  </p>
                </div>

                <div className="item-actions">
                  <button
                    type="button"
                    className="btn btn-quiet"
                    disabled={busy}
                    onClick={() => setEditing(appointment)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-quiet"
                    disabled={busy}
                    onClick={() => handleDelete(appointment)}
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
        <AppointmentDialog
          appointment={editing === "new" ? null : editing}
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

interface AppointmentDialogProps {
  appointment: Appointment | null;
  onClose: () => void;
  onSaved: (appointment: Appointment) => void;
}

function AppointmentDialog({
  appointment,
  onClose,
  onSaved,
}: AppointmentDialogProps) {
  const [title, setTitle] = useState(appointment?.title ?? "");
  const [description, setDescription] = useState(appointment?.description ?? "");
  const [date, setDate] = useState(
    appointment ? toInputValue(appointment.date) : tomorrowAtSix(),
  );
  const [local, setLocal] = useState(appointment?.local ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const trimmedLocal = local.trim();

    try {
      const saved = appointment
        ? await api.appointments.update(appointment.publicId, {
            title: title.trim(),
            description: description.trim(),
            date: fromInputValue(date),
            local: trimmedLocal,
          })
        : await api.appointments.create({
            title: title.trim(),
            description: description.trim(),
            date: fromInputValue(date),
            ...(trimmedLocal ? { local: trimmedLocal } : {}),
          });
      onSaved(saved);
    } catch (caught) {
      setError(messageOf(caught));
      setSaving(false);
    }
  }

  return (
    <Dialog
      title={appointment ? "Editar compromisso" : "Novo compromisso"}
      theme="appointments"
      onClose={onClose}
    >
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="appointment-title">Título</label>
          <input
            id="appointment-title"
            maxLength={100}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="appointment-description">Descrição</label>
          <textarea
            id="appointment-description"
            rows={3}
            maxLength={1000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="appointment-date">Data e hora</label>
            <input
              id="appointment-date"
              type="datetime-local"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="appointment-local">Local (opcional)</label>
            <input
              id="appointment-local"
              value={local}
              onChange={(event) => setLocal(event.target.value)}
            />
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
            {saving ? "Salvando..." : "Salvar compromisso"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
