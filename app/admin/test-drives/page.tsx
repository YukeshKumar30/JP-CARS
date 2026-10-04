"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  CalendarDays,
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
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import type { TestDriveRequest } from "@/types";

type TestDriveStatus = "new" | "contacted" | "confirmed" | "completed" | "cancelled";

export default function AdminTestDrivesPage() {
  const [requests, setRequests] = useState<TestDriveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [selectedRequest, setSelectedRequest] = useState<TestDriveRequest | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle_title: "",
    preferred_date: new Date().toISOString().split("T")[0],
    preferred_time: "10:00 AM",
    message: "",
    status: "new" as TestDriveStatus,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TestDriveRequest | null>(null);

  const fetchTestDrives = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/test-drives");
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error("Failed to load test drives:", err);
      toast.error("Failed to load test drive requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestDrives();
  }, [fetchTestDrives]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        search.trim() === "" ||
        `${r.name} ${r.phone} ${r.vehicle_title || ""} ${r.preferred_date || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, search, statusFilter]);

  const countNew = requests.filter((r) => r.status === "new").length;
  const countConfirmed = requests.filter((r) => r.status === "confirmed").length;
  const countCompleted = requests.filter((r) => r.status === "completed").length;

  const handleStatusChange = async (id: string, newStatus: TestDriveStatus) => {
    try {
      const res = await fetch("/api/test-drives", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.request) {
        setRequests((prev) =>
          prev.map((item) => (item.id === id ? data.request : item))
        );
        toast.success(`Booking marked as ${newStatus}`);
      } else {
        toast.error(data.error || "Failed to update");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.preferred_date) {
      toast.error("Name, phone, and date are required");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/test-drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.request) {
        setRequests((prev) => [data.request, ...prev]);
        toast.success("Test drive booking scheduled!");
        setIsCreateOpen(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          vehicle_title: "",
          preferred_date: new Date().toISOString().split("T")[0],
          preferred_time: "10:00 AM",
          message: "",
          status: "new",
        });
      } else {
        toast.error(data.error || "Failed to save booking");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/test-drives?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        toast.success("Booking deleted");
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
            Test Drive Bookings
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Database className="w-3 h-3" /> Live Database
            </span>
          </h1>
          <p className="text-sm text-jp-muted mt-0.5">
            Manage scheduled test drives, slots, confirmations, and customer feedback.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn btn-primary text-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule Test Drive
        </button>
      </div>

      {/* Database Ready Banner */}
      <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Database Ready:</strong> Persistent storage enabled. Test drives booked through the website appear here.
          </span>
        </div>
        <span className="text-xs opacity-75 font-medium">Auto-synced</span>
      </div>

      {/* Stats pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "all"
              ? "bg-jp-black text-white dark:bg-white dark:text-jp-black border-transparent shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-jp-gold/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium">Total Bookings</div>
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
            <Clock className="w-3.5 h-3.5 text-blue-500" /> Pending Confirmation
          </div>
          <div className="text-xl font-black mt-0.5 text-blue-600 dark:text-blue-400">
            {countNew}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("confirmed")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "confirmed"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-amber-500/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Confirmed
          </div>
          <div className="text-xl font-black mt-0.5 text-amber-600 dark:text-amber-400">
            {countConfirmed}
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
            <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Completed
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
            placeholder="Search by customer, phone, car, date..."
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
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={fetchTestDrives}
            title="Refresh List"
            className="p-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-jp-muted hover:text-jp-text dark:hover:text-white transition-colors"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Test Drives Table */}
      <div className="rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-jp-muted text-sm flex flex-col items-center gap-2">
            <RotateCcw className="w-6 h-6 animate-spin text-jp-gold" />
            Loading test drive requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-20 text-center">
            <CalendarDays className="w-10 h-10 text-jp-muted mx-auto mb-2 opacity-50" />
            <p className="text-jp-muted text-sm">No test drive requests found.</p>
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
                    Vehicle
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Date & Time
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
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-jp-text dark:text-white">
                        {r.vehicle_title || "Any available car"}
                      </div>
                      {r.message && <div className="text-xs text-jp-muted truncate max-w-xs">{r.message}</div>}
                    </td>

                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <div className="font-semibold text-jp-text dark:text-white">
                        {r.preferred_date || "Flexible"}
                      </div>
                      <div className="text-xs text-jp-muted">{r.preferred_time || "Morning"}</div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value as TestDriveStatus)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-colors ${
                          r.status === "completed"
                            ? "bg-green-50 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                            : r.status === "confirmed"
                            ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                            : r.status === "contacted"
                            ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                            : r.status === "cancelled"
                            ? "bg-neutral-100 text-neutral-600 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                            : "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${r.phone.replace(/[^0-9+]/g, "")}`}
                          title="Call Customer"
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-jp-muted hover:text-green-600 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        <a
                          href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${r.name}, confirming your test drive for ${r.vehicle_title || "the vehicle"} on ${r.preferred_date} at ${r.preferred_time} at JP CARS Kallakurichi.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Confirm via WhatsApp"
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-jp-muted hover:text-[#25D366] transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => setDeleteTarget(r)}
                          title="Delete Booking"
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

      {/* Schedule Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-jp-border dark:border-jp-border-dark">
              <h2 className="text-lg font-bold text-jp-text dark:text-white">
                Schedule Test Drive
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

              <div>
                <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                  Car to Test Drive
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2021 Hyundai Creta SX"
                  value={formData.vehicle_title}
                  onChange={(e) => setFormData((p) => ({ ...p, vehicle_title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.preferred_date}
                    onChange={(e) => setFormData((p) => ({ ...p, preferred_date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={formData.preferred_time}
                    onChange={(e) => setFormData((p) => ({ ...p, preferred_time: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  >
                    {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Route preference, family accompanying..."
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
                  {submitting ? "Scheduling..." : "Confirm Booking"}
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
            <h3 className="font-bold text-jp-text dark:text-white text-base">Delete Booking</h3>
            <p className="text-xs text-jp-muted">
              Are you sure you want to delete test drive for <strong>{deleteTarget.name}</strong>?
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
