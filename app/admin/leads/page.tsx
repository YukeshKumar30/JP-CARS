"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  Search,
  Plus,
  RotateCcw,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  Trash2,
  X,
  Database,
  Car,
  FileText,
  User,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Lead } from "@/types";

type LeadStatus = "new" | "contacted" | "follow_up" | "completed" | "closed";
type LeadType = "vehicle_enquiry" | "general" | "test_drive" | "sell_car" | "finance";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "vehicle_enquiry" as LeadType,
    vehicle_title: "",
    message: "",
    status: "new" as LeadStatus,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Failed to load leads:", err);
      toast.error("Failed to load leads data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        search.trim() === "" ||
        `${l.name} ${l.phone} ${l.vehicle_title || ""} ${l.message || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      const matchType = typeFilter === "all" || l.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [leads, search, statusFilter, typeFilter]);

  const countNew = leads.filter((l) => l.status === "new").length;
  const countFollowUp = leads.filter((l) => l.status === "follow_up").length;
  const countCompleted = leads.filter((l) => l.status === "completed").length;

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setLeads((prev) =>
          prev.map((item) => (item.id === id ? data.lead : item))
        );
        toast.success(`Lead marked as ${newStatus}`);
      } else {
        toast.error(data.error || "Failed to update lead");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Name and Phone are required");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setLeads((prev) => [data.lead, ...prev]);
        toast.success("Lead created successfully!");
        setIsCreateOpen(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          type: "vehicle_enquiry",
          vehicle_title: "",
          message: "",
          status: "new",
        });
      } else {
        toast.error(data.error || "Failed to create lead");
      }
    } catch (err) {
      toast.error("Network error creating lead");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
        toast.success("Lead deleted");
        setDeleteTarget(null);
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-jp-text dark:text-white flex items-center gap-2">
            Customer Leads & Enquiries
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Database className="w-3 h-3" /> Live Database
            </span>
          </h1>
          <p className="text-sm text-jp-muted mt-0.5">
            Track inquiries, customer requests, follow-ups, and sales conversions.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn btn-primary text-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Database Status */}
      <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Database Ready:</strong> Persistent storage enabled. All incoming leads are automatically captured.
          </span>
        </div>
        <span className="text-xs opacity-75 font-medium">Auto-synced</span>
      </div>

      {/* Stats pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => {
            setStatusFilter("all");
            setTypeFilter("all");
          }}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "all" && typeFilter === "all"
              ? "bg-jp-black text-white dark:bg-white dark:text-jp-black border-transparent shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-jp-gold/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium">Total Leads</div>
          <div className="text-xl font-black mt-0.5">{leads.length}</div>
        </button>

        <button
          onClick={() => setStatusFilter("new")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "new"
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-blue-500/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" /> New Leads
          </div>
          <div className="text-xl font-black mt-0.5 text-blue-600 dark:text-blue-400">
            {countNew}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("follow_up")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "follow_up"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-amber-500/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Follow-Up
          </div>
          <div className="text-xl font-black mt-0.5 text-amber-600 dark:text-amber-400">
            {countFollowUp}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("completed")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "completed"
              ? "bg-green-600 text-white border-green-600 shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-green-500/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Closed Won
          </div>
          <div className="text-xl font-black mt-0.5 text-green-600 dark:text-green-400">
            {countCompleted}
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-jp-muted" />
          <input
            type="text"
            placeholder="Search by customer name, phone, car, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white placeholder-jp-muted focus:outline-none focus:border-jp-gold"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-jp-muted hover:text-jp-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
          >
            <option value="all">All Types</option>
            <option value="vehicle_enquiry">Car Enquiry</option>
            <option value="test_drive">Test Drive</option>
            <option value="finance">Finance</option>
            <option value="sell_car">Sell Car</option>
            <option value="general">General</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="follow_up">Follow Up</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>

          <button
            onClick={fetchLeads}
            title="Refresh Leads"
            className="p-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-jp-muted hover:text-jp-text dark:hover:text-white transition-colors"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-jp-muted text-sm flex flex-col items-center gap-2">
            <RotateCcw className="w-6 h-6 animate-spin text-jp-gold" />
            Loading leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-10 h-10 text-jp-muted mx-auto mb-2 opacity-50" />
            <p className="text-jp-muted text-sm">No customer leads found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-jp-border dark:border-jp-border-dark bg-jp-bg/70 dark:bg-jp-black/40">
                <tr>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Type & Vehicle
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Notes / Query
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jp-border dark:divide-jp-border-dark">
                {filteredLeads.map((l) => (
                  <tr
                    key={l.id}
                    className="hover:bg-jp-bg/60 dark:hover:bg-jp-black/40 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-jp-text dark:text-white text-sm">
                        {l.name}
                      </div>
                      <div className="text-xs text-jp-muted">{l.phone}</div>
                      {l.email && <div className="text-xs text-jp-muted opacity-75">{l.email}</div>}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 capitalize mb-1">
                        {l.type.replace("_", " ")}
                      </span>
                      <div className="font-medium text-jp-text dark:text-white text-xs">
                        {l.vehicle_title || "General"}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-jp-muted max-w-xs truncate">
                      {l.message || "No specific message provided."}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={l.status}
                        onChange={(e) => handleStatusChange(l.id, e.target.value as LeadStatus)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-colors ${
                          l.status === "completed"
                            ? "bg-green-50 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                            : l.status === "follow_up"
                            ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                            : l.status === "contacted"
                            ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                            : l.status === "closed"
                            ? "bg-neutral-100 text-neutral-600 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                            : "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="follow_up">Follow Up</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${l.phone.replace(/[^0-9+]/g, "")}`}
                          title="Call Lead"
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-jp-muted hover:text-green-600 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        <a
                          href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${l.name}, this is JP CARS Kallakurichi regarding your inquiry.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-jp-muted hover:text-[#25D366] transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => setSelectedLead(l)}
                          title="View Details"
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-jp-muted hover:text-blue-600 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(l)}
                          title="Delete Lead"
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-jp-muted hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-jp-border dark:border-jp-border-dark">
              <h2 className="text-lg font-bold text-jp-text dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-jp-gold" />
                Lead Information
              </h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-jp-muted hover:text-jp-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-jp-muted block">Customer Name</span>
                  <span className="font-semibold text-jp-text dark:text-white">{selectedLead.name}</span>
                </div>
                <div>
                  <span className="text-xs text-jp-muted block">Phone</span>
                  <span className="font-semibold text-jp-text dark:text-white">{selectedLead.phone}</span>
                </div>
              </div>

              {selectedLead.email && (
                <div>
                  <span className="text-xs text-jp-muted block">Email</span>
                  <span className="text-jp-text dark:text-white">{selectedLead.email}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-jp-muted block">Enquiry Type</span>
                  <span className="font-medium text-jp-text dark:text-white capitalize">
                    {selectedLead.type.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-jp-muted block">Vehicle of Interest</span>
                  <span className="text-jp-text dark:text-white font-medium">
                    {selectedLead.vehicle_title || "None specified"}
                  </span>
                </div>
              </div>

              {selectedLead.message && (
                <div>
                  <span className="text-xs text-jp-muted block mb-1">Customer Query / Message</span>
                  <div className="p-3 rounded-xl bg-jp-bg dark:bg-jp-black text-xs text-jp-text dark:text-jp-muted leading-relaxed whitespace-pre-wrap">
                    {selectedLead.message}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-jp-muted">
                <span>Received: {new Date(selectedLead.created_at).toLocaleString("en-IN")}</span>
                <span className="uppercase font-semibold px-2 py-0.5 rounded bg-jp-gold/10 text-jp-gold">
                  {selectedLead.status}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href={`tel:${selectedLead.phone.replace(/[^0-9+]/g, "")}`}
                className="btn btn-secondary flex-1 text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#25D366] text-white flex-1 text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-jp-border dark:border-jp-border-dark">
              <h2 className="text-lg font-bold text-jp-text dark:text-white">
                Record New Customer Lead
              </h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg text-jp-muted hover:text-jp-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Enquiry Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as LeadType }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  >
                    <option value="vehicle_enquiry">Vehicle Enquiry</option>
                    <option value="test_drive">Test Drive Booking</option>
                    <option value="finance">Finance / Loan</option>
                    <option value="sell_car">Sell Car Valuation</option>
                    <option value="general">General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Vehicle Model
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Swift, Creta, City"
                    value={formData.vehicle_title}
                    onChange={(e) => setFormData((p) => ({ ...p, vehicle_title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                  Customer Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Questions asked, budget, timeline, etc."
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="btn btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary text-sm flex items-center gap-2"
                >
                  {submitting ? "Saving..." : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark rounded-2xl shadow-2xl p-5 space-y-3">
            <h3 className="font-bold text-jp-text dark:text-white text-base">Delete Lead</h3>
            <p className="text-xs text-jp-muted">
              Are you sure you want to delete lead from <strong>{deleteTarget.name}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn bg-red-600 hover:bg-red-700 text-white text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
