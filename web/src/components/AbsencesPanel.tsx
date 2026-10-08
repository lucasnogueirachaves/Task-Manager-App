import { type FormEvent, useState } from "react";
import { api, messageOf } from "../api";
import { useCollection, usePending } from "../hooks";
import type { Subject } from "../types";

export function AbsencesPanel({ active }: { active: boolean }) {
  const { items, loading, error, setError, reload, upsert, remove } =
    useCollection<Subject>(api.subjects.list);
  const { pending, run } = usePending();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const total = items.reduce((sum, subject) => sum + subject.absences, 0);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const created = await api.subjects.create(name.trim());
      upsert(created);
      setName("");
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      setCreating(false);
    }
  }

  // Um único handler cuida do "+" e do "−": só muda qual endpoint é chamado.
  // O número exibido sempre vem da resposta do servidor (upsert), então a tela
  // nunca "inventa" um valor diferente do que está salvo no banco.
  function change(subject: Subject, direction: "increment" | "decrement") {
    setError(null);

    void run(subject.publicId, async () => {
      try {
        const updated =
          direction === "increment"
            ? await api.subjects.increment(subject.publicId)
            : await api.subjects.decrement(subject.publicId);
        upsert(updated);
      } catch (caught) {
        // Se der erro (ex.: o contador já estava em zero em outra aba),
        // recarrega a lista para a tela voltar a refletir o banco.
        await reload(true);
        setError(messageOf(caught));
      }
    });
  }

  function handleDelete(subject: Subject) {
    if (!window.confirm(`Excluir a matéria "${subject.subject}"?`)) {
      return;
    }

    setError(null);

    void run(subject.publicId, async () => {
      try {
        await api.subjects.remove(subject.publicId);
        remove(subject.publicId);
      } catch (caught) {
        setError(messageOf(caught));
      }
    });
  }

  return (
    <section
      className="panel"
      data-theme="absences"
      data-active={active}
      aria-labelledby="absences-title"
    >
      <header className="panel-head">
        <div>
          <h2 id="absences-title">Faltas</h2>
          <p className="summary">
            {total === 1 ? "1 falta no total" : `${total} faltas no total`}
          </p>
        </div>
      </header>

      <form className="inline-form" onSubmit={handleCreate}>
        <label className="visually-hidden" htmlFor="subject-name">
          Nome da matéria
        </label>
        <input
          id="subject-name"
          placeholder="Nome da matéria"
          maxLength={50}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <button type="submit" className="btn" disabled={creating}>
          {creating ? "Adicionando..." : "Adicionar matéria"}
        </button>
      </form>

      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="empty">Carregando matérias...</p>
      ) : items.length === 0 ? (
          error ? null : (
        <p className="empty">
          Nenhuma matéria cadastrada. Adicione uma para começar a contar as
          faltas.
        </p>
      )
        ) : (
        <ul className="tiles">
          {items.map((subject) => {
            const busy = pending.has(subject.publicId);

            return (
              <li key={subject.publicId} className="tile">
                <div className="tile-head">
                  <h3>{subject.subject}</h3>
                  <button
                    type="button"
                    className="link-button"
                    disabled={busy}
                    onClick={() => handleDelete(subject)}
                    aria-label={`Excluir a matéria ${subject.subject}`}
                  >
                    Excluir
                  </button>
                </div>

                <div className="counter">
                  <button
                    type="button"
                    className="step"
                    disabled={busy || subject.absences === 0}
                    onClick={() => change(subject, "decrement")}
                    aria-label={`Remover uma falta de ${subject.subject}`}
                  >
                    −
                  </button>

                  <div className="count-box">
                    <output className="count" aria-live="polite">
                      {subject.absences}
                    </output>
                    <span className="count-label">
                      {subject.absences === 1 ? "falta" : "faltas"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="step"
                    disabled={busy}
                    onClick={() => change(subject, "increment")}
                    aria-label={`Adicionar uma falta em ${subject.subject}`}
                  >
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
