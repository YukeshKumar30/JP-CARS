"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  HelpCircle,
  Search,
  Plus,
  RotateCcw,
  CheckCircle,
  Trash2,
  X,
  Database,
  Edit2,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import type { FAQ } from "@/types";

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
    sort_order: 1,
    is_published: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FAQ | null>(null);

  const fetchFaqs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/faqs");
      const data = await res.json();
      if (data.success && Array.isArray(data.faqs)) {
        setFaqs(data.faqs);
      }
    } catch (err) {
      console.error("Failed to load FAQs:", err);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set);
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchSearch =
        search.trim() === "" ||
        `${f.question} ${f.answer} ${f.category || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchCat =
        categoryFilter === "all" || f.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [faqs, search, categoryFilter]);

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setFormData({
      question: "",
      answer: "",
      category: "Buying",
      sort_order: faqs.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f: FAQ) => {
    setEditingFaq(f);
    setFormData({
      question: f.question,
      answer: f.answer,
      category: f.category || "General",
      sort_order: f.sort_order,
      is_published: f.is_published,
    });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (f: FAQ) => {
    try {
      const res = await fetch("/api/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: f.id, is_published: !f.is_published }),
      });
      const data = await res.json();
      if (data.success && data.faq) {
        setFaqs((prev) =>
          prev.map((item) => (item.id === f.id ? data.faq : item))
        );
        toast.success(
          data.faq.is_published ? "FAQ published" : "FAQ unpublished"
        );
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      toast.error("Question and Answer are required");
      return;
    }

    try {
      setSubmitting(true);
      if (editingFaq) {
        const res = await fetch("/api/faqs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, id: editingFaq.id }),
        });
        const data = await res.json();
        if (data.success && data.faq) {
          setFaqs((prev) =>
            prev.map((item) => (item.id === editingFaq.id ? data.faq : item))
          );
          toast.success("FAQ updated!");
          setIsModalOpen(false);
        } else {
          toast.error(data.error || "Failed to update FAQ");
        }
      } else {
        const res = await fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.faq) {
          setFaqs((prev) => [...prev, data.faq]);
          toast.success("FAQ created!");
          setIsModalOpen(false);
        } else {
          toast.error(data.error || "Failed to create FAQ");
        }
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
      const res = await fetch(`/api/faqs?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFaqs((prev) => prev.filter((f) => f.id !== deleteTarget.id));
        toast.success("FAQ deleted");
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
            Frequently Asked Questions
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Database className="w-3 h-3" /> Live Database
            </span>
          </h1>
          <p className="text-sm text-jp-muted mt-0.5">
            Manage buyer and seller questions shown across your website.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn btn-primary text-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {/* Database Ready Banner */}
      <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Database Ready:</strong> Persistent storage enabled. Questions edited here are displayed on your homepage.
          </span>
        </div>
        <span className="text-xs opacity-75 font-medium">Auto-synced</span>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-jp-muted" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer..."
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={fetchFaqs}
            title="Refresh List"
            className="p-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-jp-muted hover:text-jp-text dark:hover:text-white transition-colors"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* FAQs List */}
      {loading ? (
        <div className="py-20 text-center text-jp-muted text-sm flex flex-col items-center gap-2">
          <RotateCcw className="w-6 h-6 animate-spin text-jp-gold" />
          Loading FAQs...
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
          <HelpCircle className="w-10 h-10 text-jp-muted mx-auto mb-2 opacity-50" />
          <p className="text-jp-muted text-sm">No FAQs found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((f) => (
            <div
              key={f.id}
              className="p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:shadow-sm transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {f.category && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-jp-gold/15 text-jp-gold">
                      {f.category}
                    </span>
                  )}
                  <span className="text-xs text-jp-muted">Order: #{f.sort_order}</span>
                </div>
                <h3 className="font-semibold text-jp-text dark:text-white text-base">
                  {f.question}
                </h3>
                <p className="text-sm text-jp-muted leading-relaxed">
                  {f.answer}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0">
                <button
                  onClick={() => handleTogglePublish(f)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                    f.is_published
                      ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  {f.is_published ? (
                    <>
                      <Eye className="w-3 h-3" /> Published
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" /> Hidden
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenEdit(f)}
                  title="Edit FAQ"
                  className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-jp-muted hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setDeleteTarget(f)}
                  title="Delete FAQ"
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-jp-muted hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-jp-border dark:border-jp-border-dark">
              <h2 className="text-lg font-bold text-jp-text dark:text-white">
                {editingFaq ? "Edit FAQ" : "Add New FAQ"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-jp-muted hover:text-jp-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Do you offer finance or EMI options?"
                  value={formData.question}
                  onChange={(e) => setFormData((p) => ({ ...p, question: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Buying, Finance, Quality"
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.sort_order}
                    onChange={(e) => setFormData((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed answer for customers..."
                  value={formData.answer}
                  onChange={(e) => setFormData((p) => ({ ...p, answer: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary text-sm flex items-center gap-2"
                >
                  {submitting ? "Saving..." : editingFaq ? "Update FAQ" : "Create FAQ"}
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
            <h3 className="font-bold text-jp-text dark:text-white text-base">Delete FAQ</h3>
            <p className="text-xs text-jp-muted">
              Are you sure you want to delete this FAQ: <strong>&ldquo;{deleteTarget.question}&rdquo;</strong>?
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
