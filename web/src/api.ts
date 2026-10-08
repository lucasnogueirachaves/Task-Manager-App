import type {
  Appointment,
  AppointmentInput,
  Status,
  Subject,
  Task,
  TaskInput,
} from "./types";

// O Vite repassa /api para o backend (veja vite.config.ts).
const BASE = "/api";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function messageOf(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Algo deu errado. Tente novamente.";
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

async function request<T>(
  path: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};

  // O Fastify recusa Content-Type JSON com corpo vazio, então só enviamos
  // o cabeçalho quando existe corpo (os PATCH de faltas não têm).
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;

  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : null,
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique se a API está rodando.",
      0,
    );
  }

  if (!response.ok) {
    let message = "Algo deu errado. Tente novamente.";

    try {
      const data = (await response.json()) as { message?: string };
      if (data.message) {
        message = data.message;
      }
    } catch {
      // resposta sem JSON: mantém a mensagem padrão
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export const api = {
  tasks: {
    list: async () => (await request<{ tasks: Task[] }>("/tasks")).tasks,
    create: (data: TaskInput) =>
      request<Task>("/tasks", { method: "POST", body: data }),
    update: (
      publicId: string,
      data: Partial<TaskInput> & { status?: Status },
    ) => request<Task>(`/tasks/${publicId}`, { method: "PATCH", body: data }),
    remove: async (publicId: string) => {
      await request<unknown>(`/tasks/${publicId}`, { method: "DELETE" });
    },
  },

  appointments: {
    list: async () =>
      (await request<{ appointments: Appointment[] }>("/appointments"))
        .appointments,
    create: (data: AppointmentInput) =>
      request<Appointment>("/appointments", { method: "POST", body: data }),
    update: (
      publicId: string,
      data: Partial<AppointmentInput> & { status?: Status },
    ) =>
      request<Appointment>(`/appointments/${publicId}`, {
        method: "PATCH",
        body: data,
      }),
    remove: async (publicId: string) => {
      await request<unknown>(`/appointments/${publicId}`, {
        method: "DELETE",
      });
    },
  },

  subjects: {
    list: async () =>
      (await request<{ subjects: Subject[] }>("/subjects")).subjects,
    create: (subjectName: string) =>
      request<Subject>("/subjects", { method: "POST", body: { subjectName } }),
    increment: (publicId: string) =>
      request<Subject>(`/subjects/${publicId}/absences/increment`, {
        method: "PATCH",
      }),
    decrement: (publicId: string) =>
      request<Subject>(`/subjects/${publicId}/absences/decrement`, {
        method: "PATCH",
      }),
    remove: async (publicId: string) => {
      await request<unknown>(`/subjects/${publicId}`, { method: "DELETE" });
    },
  },
};
