const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

// ISO (UTC) -> valor de <input type="datetime-local"> no fuso do usuário
export function toInputValue(iso: string): string {
  const date = new Date(iso);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// valor de <input type="datetime-local"> -> ISO (UTC) para enviar à API
export function fromInputValue(value: string): string {
  return new Date(value).toISOString();
}

export function tomorrowAtSix(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(18, 0, 0, 0);

  return toInputValue(date.toISOString());
}

export function isPast(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}
