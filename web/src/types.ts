export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type Status = "COMPLETED" | "NEXT";

export interface Task {
  publicId: string;
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  publicId: string;
  title: string;
  description: string;
  date: string;
  local: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  publicId: string;
  subject: string;
  absences: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
}

export interface AppointmentInput {
  title: string;
  description: string;
  date: string;
  local?: string;
}
