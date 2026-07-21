export type TaskStatus = "grey" | "yellow" | "green";

export interface Task {
  id: string;
  text: string;
  status: TaskStatus;
}

export type ArchiveStatus = "active" | "completed" | "cancelled";

export type LeadStatus = "follow_up" | "sold";

export interface Client {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  project_type: string | null;
  estimated_cost: number | null;
  offered_price: number | null;
  has_mortgage: boolean;
  mortgage_balance: number | null;
  description: string | null;
  tasks: Task[];
  archive_status: ArchiveStatus;
  lead_status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export type NewClientInput = Omit<
  Client,
  | "id"
  | "user_id"
  | "tasks"
  | "archive_status"
  | "lead_status"
  | "created_at"
  | "updated_at"
> & {
  lead_status?: LeadStatus;
};
