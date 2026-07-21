"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  createClientRecord,
  fetchClients,
  updateClientArchiveStatus,
  updateClientDetails,
  updateClientsSortOrder,
  updateClientTasks,
} from "@/lib/clients";
import type { ArchiveStatus, Client, NewClientInput, Task } from "@/lib/types";
import type { ParsedLead } from "@/lib/parseLead";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Tabs from "@/components/Tabs";
import ClientCard from "@/components/ClientCard";
import ClientFormModal from "@/components/ClientFormModal";
import PasteLeadModal from "@/components/PasteLeadModal";
import DraggableClientList from "@/components/DraggableClientList";
import Fab from "@/components/Fab";

export default function HomePage() {
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<ArchiveStatus>("active");
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [prefillLead, setPrefillLead] = useState<ParsedLead | undefined>(
    undefined
  );
  const [editingClient, setEditingClient] = useState<Client | undefined>(
    undefined
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setUserEmail(data.user?.email ?? null);
    });
  }, [supabase]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchClients(tab)
      .then((data) => {
        if (!cancelled) setClients(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((client) =>
      [client.full_name, client.project_type, client.address, client.description]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(query))
    );
  }, [clients, search]);

  async function handleCreate(input: NewClientInput) {
    if (!userId) return;
    const created = await createClientRecord(input, userId);
    if (tab === "active") {
      setClients((prev) => [created, ...prev]);
    }
  }

  async function handleUpdateTasks(clientId: string, tasks: Task[]) {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, tasks } : c))
    );
    await updateClientTasks(clientId, tasks);
  }

  async function handleArchive(clientId: string, status: ArchiveStatus) {
    await updateClientArchiveStatus(clientId, status);
    setClients((prev) => prev.filter((c) => c.id !== clientId));
  }

  async function handleUpdateDetails(clientId: string, input: NewClientInput) {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...input } : c))
    );
    await updateClientDetails(clientId, input);
  }

  async function handleReorder(newOrder: Client[]) {
    setClients(newOrder);
    await updateClientsSortOrder(
      newOrder.map((c, index) => ({ id: c.id, sort_order: index }))
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="sticky top-0 z-20 bg-neutral-950/95 backdrop-blur">
        <Header email={userEmail} />
        <SearchBar value={search} onChange={setSearch} />
        <Tabs active={tab} onChange={setTab} />
      </div>

      <main className="px-4 py-4 flex flex-col gap-3 pb-28 safe-bottom">
        {loading && (
          <p className="text-neutral-500 text-sm text-center py-8">
            Loading...
          </p>
        )}
        {!loading && filteredClients.length === 0 && (
          <p className="text-neutral-500 text-sm text-center py-8">
            No clients to show
          </p>
        )}
        {!loading && filteredClients.length > 0 && (
          search.trim() ? (
            filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onUpdateTasks={(tasks) => handleUpdateTasks(client.id, tasks)}
                onArchive={(status) => handleArchive(client.id, status)}
                onEdit={() => setEditingClient(client)}
              />
            ))
          ) : (
            <DraggableClientList
              clients={filteredClients}
              onReorder={handleReorder}
              renderItem={(client, dragHandle) => (
                <ClientCard
                  client={client}
                  onUpdateTasks={(tasks) => handleUpdateTasks(client.id, tasks)}
                  onArchive={(status) => handleArchive(client.id, status)}
                  onEdit={() => setEditingClient(client)}
                  dragHandle={dragHandle}
                />
              )}
            />
          )
        )}
      </main>

      <Fab onClick={() => setPasteModalOpen(true)} />

      {pasteModalOpen && (
        <PasteLeadModal
          onClose={() => setPasteModalOpen(false)}
          onSkip={() => {
            setPrefillLead(undefined);
            setPasteModalOpen(false);
            setModalOpen(true);
          }}
          onParsed={(lead) => {
            setPrefillLead(lead);
            setPasteModalOpen(false);
            setModalOpen(true);
          }}
        />
      )}

      {modalOpen && (
        <ClientFormModal
          initial={prefillLead}
          onClose={() => setModalOpen(false)}
          onSave={handleCreate}
        />
      )}

      {editingClient && (
        <ClientFormModal
          client={editingClient}
          onClose={() => setEditingClient(undefined)}
          onSave={(input) => handleUpdateDetails(editingClient.id, input)}
        />
      )}
    </div>
  );
}
