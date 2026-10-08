import { useCallback, useEffect, useState } from "react";
import { messageOf } from "./api";

export function useCollection<T extends { publicId: string }>(
  load: () => Promise<T[]>,
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      try {
        setItems(await load());
      } catch (caught) {
        setError(messageOf(caught));
      } finally {
        setLoading(false);
      }
    },
    [load],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  // adiciona o item novo ou troca o existente pelo que veio do servidor
  const upsert = useCallback((item: T) => {
    setItems((previous) =>
      previous.some((current) => current.publicId === item.publicId)
        ? previous.map((current) =>
            current.publicId === item.publicId ? item : current,
          )
        : [...previous, item],
    );
  }, []);

  const remove = useCallback((publicId: string) => {
    setItems((previous) =>
      previous.filter((current) => current.publicId !== publicId),
    );
  }, []);

  return { items, loading, error, setError, reload, upsert, remove };
}

// Guarda quais itens têm uma requisição em andamento, para desabilitar
// os botões deles e evitar cliques duplicados.
export function usePending() {
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set());

  const run = useCallback(async (id: string, action: () => Promise<void>) => {
    setPending((previous) => new Set(previous).add(id));

    try {
      await action();
    } finally {
      setPending((previous) => {
        const next = new Set(previous);
        next.delete(id);
        return next;
      });
    }
  }, []);

  return { pending, run };
}
