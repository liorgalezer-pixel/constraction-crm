"use client";

import { useState } from "react";
import type { Client, LeadStatus, NewClientInput } from "@/lib/types";
import type { ParsedLead } from "@/lib/parseLead";

const PROJECT_TYPES = ["Renovation", "Roof", "Addition", "New Build", "Flooring", "Other"];

function toFormValues(source?: ParsedLead | Client) {
  return {
    fullName: (source && "full_name" in source && source.full_name) || "",
    phone: (source && "phone" in source && source.phone) || "",
    email: (source && "email" in source && source.email) || "",
    address: source?.address ?? "",
    projectType: source?.project_type || PROJECT_TYPES[0],
    estimatedCost:
      source && "estimated_cost" in source && source.estimated_cost !== null
        ? String(source.estimated_cost)
        : "",
    offeredPrice:
      source && "offered_price" in source && source.offered_price !== null
        ? String(source.offered_price)
        : "",
    hasMortgage: (source && "has_mortgage" in source && source.has_mortgage) || false,
    mortgageBalance:
      source && "mortgage_balance" in source && source.mortgage_balance !== null
        ? String(source.mortgage_balance)
        : "",
    description: source?.description ?? "",
  };
}

export default function ClientFormModal({
  onClose,
  onSave,
  initial,
  client,
}: {
  onClose: () => void;
  onSave: (input: NewClientInput) => Promise<void>;
  initial?: ParsedLead;
  client?: Client;
}) {
  const defaults = toFormValues(client ?? initial);
  const isEditMode = Boolean(client);

  const [fullName, setFullName] = useState(defaults.fullName);
  const [phone, setPhone] = useState(defaults.phone);
  const [email, setEmail] = useState(defaults.email);
  const [address, setAddress] = useState(defaults.address);
  const [projectType, setProjectType] = useState(defaults.projectType);
  const [estimatedCost, setEstimatedCost] = useState(defaults.estimatedCost);
  const [offeredPrice, setOfferedPrice] = useState(defaults.offeredPrice);
  const [hasMortgage, setHasMortgage] = useState(defaults.hasMortgage);
  const [mortgageBalance, setMortgageBalance] = useState(defaults.mortgageBalance);
  const [description, setDescription] = useState(defaults.description);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>(
    client?.lead_status ?? "follow_up"
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        full_name: fullName,
        phone: phone || null,
        email: email || null,
        address: address || null,
        project_type: projectType || null,
        estimated_cost: estimatedCost ? Number(estimatedCost) : null,
        offered_price: offeredPrice ? Number(offeredPrice) : null,
        has_mortgage: hasMortgage,
        mortgage_balance:
          hasMortgage && mortgageBalance ? Number(mortgageBalance) : null,
        description: description || null,
        lead_status: leadStatus,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 bg-black/60 flex items-end sm:items-center justify-center">
      <div className="bg-neutral-900 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto border border-neutral-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 sticky top-0 bg-neutral-900">
          <h2 className="text-white font-bold text-lg">
            {isEditMode ? "Edit Client" : "New Client"}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-800 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <input
            required
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            list="project-types"
            placeholder="Project type"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="bg-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <datalist id="project-types">
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type} />
            ))}
          </datalist>

          <select
            value={leadStatus}
            onChange={(e) => setLeadStatus(e.target.value as LeadStatus)}
            className="bg-neutral-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="follow_up">Follow Up</option>
            <option value="sold">Sold</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Estimated cost"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              className="bg-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="number"
              placeholder="Offered price"
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(e.target.value)}
              className="bg-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <label className="flex items-center gap-2 text-neutral-300 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={hasMortgage}
              onChange={(e) => setHasMortgage(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            Has mortgage?
          </label>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              hasMortgage ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <input
              type="number"
              placeholder="Mortgage balance"
              value={mortgageBalance}
              onChange={(e) => setMortgageBalance(e.target.value)}
              className="w-full bg-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <textarea
            placeholder="Description / meeting notes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="bg-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition"
          >
            {saving ? "Saving..." : isEditMode ? "Save Changes" : "Add Client"}
          </button>
        </form>
      </div>
    </div>
  );
}
