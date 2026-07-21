import { createClient } from "@/lib/supabase/client";
import type { ArchiveStatus, Client, NewClientInput, Task } from "@/lib/types";

export async function fetchClients(
  archiveStatus: ArchiveStatus
): Promise<Client[]> {
  const supabase = createClient();
  const query = supabase
    .from("clients")
    .select("*")
    .eq("archive_status", archiveStatus)
    .order("sort_order", { ascending: true, nullsFirst: false });

  const { data, error } =
    archiveStatus === "active"
      ? await query.order("updated_at", { ascending: false })
      : await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data as Client[];
}

export async function createClientRecord(
  input: NewClientInput,
  userId: string
): Promise<Client> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert({ ...input, user_id: userId, lead_status: input.lead_status ?? "follow_up" })
    .select()
    .single();

  if (error) throw error;
  return data as Client;
}

export async function updateClientDetails(
  clientId: string,
  input: NewClientInput
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("clients")
    .update(input)
    .eq("id", clientId);

  if (error) throw error;
}

export async function updateClientTasks(
  clientId: string,
  tasks: Task[]
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("clients")
    .update({ tasks })
    .eq("id", clientId);

  if (error) throw error;
}

export async function updateClientsSortOrder(
  updates: { id: string; sort_order: number }[]
): Promise<void> {
  const supabase = createClient();
  const results = await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from("clients").update({ sort_order }).eq("id", id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}

export async function updateClientArchiveStatus(
  clientId: string,
  archiveStatus: ArchiveStatus
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("clients")
    .update({ archive_status: archiveStatus })
    .eq("id", clientId);

  if (error) throw error;
}
