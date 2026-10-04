"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  DollarSign,
  Search,
  Plus,
  RotateCcw,
  CheckCircle,
  Clock,
  FileText,
  Phone,
  MessageCircle,
  Trash2,
  X,
  Database,
  Building,
  Check,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import type { FinanceRequest } from "@/types";
import { formatPrice } from "@/lib/utils";

type StatusType = "new" | "contacted" | "processing" | "completed" | "closed";

export default function AdminFinancePage() {
  const [requests, setRequests] = useState<FinanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Detail / Create Modal states
  const [selectedRequest, setSelectedRequest] = useState<FinanceRequest | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle_title: "",
    loan_amount: 500000,
    tenure_months: 60,
    employment_type: "Salaried",
    message: "",
    status: "new" as StatusType,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FinanceRequest | null>(null);

  const fetchFinanceRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/finance");
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error("Failed to load finance requests:", err);
      toast.error("Failed to load finance data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinanceRequests();
  }, [fetchFinanceRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        search.trim() === "" ||
        `${r.name} ${r.phone} ${r.vehicle_title || ""} ${r.employment_type || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, search, statusFilter]);

  const countNew = requests.filter((r) => r.status === "new").length;
  const countProcessing = requests.filter((r) => r.status === "processing").length;
  const countCompleted = requests.filter((r) => r.status === "completed").length;

  const handleStatusChange = async (id: string, newStatus: StatusType) => {
    try {
      const res = await fetch("/api/finance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.request) {
        setRequests((prev) =>
          prev.map((item) => (item.id === id ? data.request : item))
        );
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (err) {
      toast.error("Network error while updating status");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Please enter applicant name and phone");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.request) {
        setRequests((prev) => [data.request, ...prev]);
        toast.success("Finance application created!");
        setIsCreateOpen(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          vehicle_title: "",
          loan_amount: 500000,
          tenure_months: 60,
          employment_type: "Salaried",
          message: "",
          status: "new",
        });
      } else {
        toast.error(data.error || "Failed to create application");
      }
    } catch (err) {
      toast.error("Network error while creating application");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/finance?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        toast.success("Record deleted");
        setDeleteTarget(null);
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (err) {
      toast.error("Network error deleting record");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-jp-text dark:text-white flex items-center gap-2">
            Finance & Loan Applications
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Database className="w-3 h-3" /> Live Database
            </span>
          </h1>
          <p className="text-sm text-jp-muted mt-0.5">
            Manage customer car loan enquiries, interest rate calculations, and bank processing.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn btn-primary text-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {/* Database Status Alert */}
      <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Database Ready:</strong> Persistent storage enabled. Records are securely saved and synced.
          </span>
        </div>
        <span className="text-xs opacity-75 font-medium">Auto-synced</span>
      </div>

      {/* Stats summary pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "all"
              ? "bg-jp-black text-white dark:bg-white dark:text-jp-black border-transparent shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-jp-gold/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium">All Enquiries</div>
          <div className="text-xl font-black mt-0.5">{requests.length}</div>
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
          onClick={() => setStatusFilter("processing")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "processing"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-amber-500/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-500" /> Bank Processing
          </div>
          <div className="text-xl font-black mt-0.5 text-amber-600 dark:text-amber-400">
            {countProcessing}
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
            <Check className="w-3.5 h-3.5 text-green-500" /> Disbursed / Approved
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
            placeholder="Search by applicant, phone, vehicle, employment..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="processing">In Processing</option>
            <option value="completed">Completed / Approved</option>
            <option value="closed">Closed / Rejected</option>
          </select>

          <button
            onClick={fetchFinanceRequests}
            title="Refresh List"
            className="p-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-jp-muted hover:text-jp-text dark:hover:text-white transition-colors"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Finance Table */}
      <div className="rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-jp-muted text-sm flex flex-col items-center gap-2">
            <RotateCcw className="w-6 h-6 animate-spin text-jp-gold" />
            Loading finance enquiries...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-20 text-center">
            <DollarSign className="w-10 h-10 text-jp-muted mx-auto mb-2 opacity-50" />
            <p className="text-jp-muted text-sm">No finance applications found.</p>
            {search || statusFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="mt-3 text-xs text-jp-gold font-medium hover:underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-jp-border dark:border-jp-border-dark bg-jp-bg/70 dark:bg-jp-black/40">
                <tr>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Tenure & Employment
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
                {filteredRequests.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-jp-bg/60 dark:hover:bg-jp-black/40 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-jp-text dark:text-white text-sm">
                        {r.name}
                      </div>
                      <div className="text-xs text-jp-muted">{r.phone}</div>
                      {r.email && <div className="text-xs text-jp-muted opacity-80">{r.email}</div>}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-jp-text dark:text-white">
                        {r.vehicle_title || "General Car Loan"}
                      </div>
                      <div className="text-xs text-jp-muted">
                        {new Date(r.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {r.loan_amount ? formatPrice(r.loan_amount) : "Not specified"}
                    </td>

                    <td className="px-4 py-3 text-sm text-jp-muted">
                      <div className="text-jp-text dark:text-white font-medium">
                        {r.tenure_months ? `${r.tenure_months} Months` : "Flexible"}
                      </div>
                      <div className="text-xs">{r.employment_type || "Salaried / Business"}</div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value as StatusType)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-colors ${
                          r.status === "completed"
                            ? "bg-green-50 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                            : r.status === "processing"
                            ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                            : r.status === "contacted"
                            ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                            : r.status === "closed"
                            ? "bg-neutral-100 text-neutral-600 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                            : "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="processing">In Processing</option>
                        <option value="completed">Completed / Disbursed</option>
                        <option value="closed">Closed / Rejected</option>
                      </select>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${r.phone.replace(/[^0-9+]/g, "")}`}
                          title="Call Applicant"
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-jp-muted hover:text-green-600 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        <a
                          href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${r.name}, this is regarding your car finance application for ${r.vehicle_title || "your vehicle"} at JP CARS Kallakurichi.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp Message"
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-jp-muted hover:text-[#25D366] transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => setSelectedRequest(r)}
                          title="View Full Application Details"
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-jp-muted hover:text-blue-600 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(r)}
                          title="Delete Application"
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

      {/* ======================================================== */}
      {/* VIEW DETAILS MODAL                                      */}
      {/* ======================================================== */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-jp-border dark:border-jp-border-dark">
              <h2 className="text-lg font-bold text-jp-text dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-jp-gold" />
                Finance Application Details
              </h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 rounded-lg text-jp-muted hover:text-jp-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-jp-muted block">Applicant Name</span>
                  <span className="font-semibold text-jp-text dark:text-white">{selectedRequest.name}</span>
                </div>
                <div>
                  <span className="text-xs text-jp-muted block">Phone</span>
                  <span className="font-semibold text-jp-text dark:text-white">{selectedRequest.phone}</span>
                </div>
              </div>

              {selectedRequest.email && (
                <div>
                  <span className="text-xs text-jp-muted block">Email</span>
                  <span className="text-jp-text dark:text-white">{selectedRequest.email}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-jp-muted block">Vehicle of Interest</span>
                  <span className="font-medium text-jp-text dark:text-white">{selectedRequest.vehicle_title || "General Enquiry"}</span>
                </div>
                <div>
                  <span className="text-xs text-jp-muted block">Requested Loan</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedRequest.loan_amount ? formatPrice(selectedRequest.loan_amount) : "N/A"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-jp-muted block">Tenure</span>
                  <span className="text-jp-text dark:text-white">{selectedRequest.tenure_months ? `${selectedRequest.tenure_months} Months` : "Flexible"}</span>
                </div>
                <div>
                  <span className="text-xs text-jp-muted block">Employment</span>
                  <span className="text-jp-text dark:text-white">{selectedRequest.employment_type || "Not specified"}</span>
                </div>
              </div>

              {selectedRequest.message && (
                <div>
                  <span className="text-xs text-jp-muted block mb-1">Customer Message / Notes</span>
                  <div className="p-3 rounded-xl bg-jp-bg dark:bg-jp-black text-xs text-jp-text dark:text-jp-muted leading-relaxed">
                    {selectedRequest.message}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-jp-muted">
                <span>Submitted: {new Date(selectedRequest.created_at).toLocaleString("en-IN")}</span>
                <span className="uppercase font-semibold px-2 py-0.5 rounded bg-jp-gold/10 text-jp-gold">
                  {selectedRequest.status}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href={`tel:${selectedRequest.phone.replace(/[^0-9+]/g, "")}`}
                className="btn btn-secondary flex-1 text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <a
                href={`https://wa.me/${selectedRequest.phone.replace(/[^0-9]/g, "")}`}
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

      {/* ======================================================== */}
      {/* ADD APPLICATION MODAL                                   */}
      {/* ======================================================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-jp-border dark:border-jp-border-dark">
              <h2 className="text-lg font-bold text-jp-text dark:text-white">
                Record New Finance Application
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
                    Applicant Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
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
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Vehicle of Interest
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2021 Hyundai Creta"
                    value={formData.vehicle_title}
                    onChange={(e) => setFormData((p) => ({ ...p, vehicle_title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Loan Amount (₹)
                  </label>
                  <input
                    type="number"
                    step={10000}
                    value={formData.loan_amount}
                    onChange={(e) => setFormData((p) => ({ ...p, loan_amount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Tenure (Months)
                  </label>
                  <select
                    value={formData.tenure_months}
                    onChange={(e) => setFormData((p) => ({ ...p, tenure_months: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  >
                    {[12, 24, 36, 48, 60, 72, 84].map((m) => (
                      <option key={m} value={m}>
                        {m} Months
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Employment
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Salaried, Business"
                    value={formData.employment_type}
                    onChange={(e) => setFormData((p) => ({ ...p, employment_type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                  Applicant Notes / Banker Info
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. CIBIL score, bank preference, down payment details..."
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
                  {submitting ? "Saving..." : "Save Application"}
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
            <h3 className="font-bold text-jp-text dark:text-white text-base">Confirm Delete</h3>
            <p className="text-xs text-jp-muted">
              Are you sure you want to delete the finance application for{" "}
              <strong>{deleteTarget.name}</strong>? This action cannot be undone.
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
