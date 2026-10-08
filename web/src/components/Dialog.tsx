import { type ReactNode, useEffect, useId, useRef } from "react";

interface DialogProps {
  title: string;
  theme: "tasks" | "appointments" | "absences";
  onClose: () => void;
  children: ReactNode;
}

// Usa o <dialog> nativo: o navegador já cuida do foco, da tecla Esc e do fundo.
export function Dialog({ title, theme, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const element = ref.current;

    if (element && !element.open) {
      element.showModal();
    }
  }, []);

  return (
    <dialog
      ref={ref}
      className="dialog"
      data-theme={theme}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // clique no fundo escurecido (o próprio <dialog>) fecha
        if (event.target === ref.current) {
          ref.current?.close();
        }
      }}
    >
      <div className="dialog-body">
        <h2 id={titleId} className="dialog-title">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
