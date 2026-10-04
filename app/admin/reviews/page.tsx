"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Star,
  Search,
  Plus,
  RotateCcw,
  CheckCircle,
  Trash2,
  X,
  Database,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Review } from "@/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    rating: 5,
    comment: "",
    vehicle_title: "",
    is_published: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchSearch =
        search.trim() === "" ||
        `${r.customer_name} ${r.vehicle_title || ""} ${r.comment}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchRating =
        ratingFilter === "all" || String(r.rating) === ratingFilter;
      return matchSearch && matchRating;
    });
  }, [reviews, search, ratingFilter]);

  const count5Star = reviews.filter((r) => r.rating === 5).length;
  const countPublished = reviews.filter((r) => r.is_published).length;

  const handleTogglePublish = async (r: Review) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: r.id, is_published: !r.is_published }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) =>
          prev.map((item) => (item.id === r.id ? data.review : item))
        );
        toast.success(
          data.review.is_published ? "Review published" : "Review hidden"
        );
      } else {
        toast.error("Failed to toggle status");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.comment) {
      toast.error("Please enter customer name and review comment");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) => [data.review, ...prev]);
        toast.success("Customer review added!");
        setIsCreateOpen(false);
        setFormData({
          customer_name: "",
          rating: 5,
          comment: "",
          vehicle_title: "",
          is_published: true,
        });
      } else {
        toast.error(data.error || "Failed to add review");
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
      const res = await fetch(`/api/reviews?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        toast.success("Review deleted");
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
            Customer Reviews & Ratings
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Database className="w-3 h-3" /> Live Database
            </span>
          </h1>
          <p className="text-sm text-jp-muted mt-0.5">
            Manage genuine customer testimonials, ratings, and website showcase.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="btn btn-primary text-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Customer Review
        </button>
      </div>

      {/* Database Ready Banner */}
      <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Database Ready:</strong> Persistent storage enabled. Reviews are stored and can be displayed on your homepage.
          </span>
        </div>
        <span className="text-xs opacity-75 font-medium">Auto-synced</span>
      </div>

      {/* Stats pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setRatingFilter("all")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            ratingFilter === "all"
              ? "bg-jp-black text-white dark:bg-white dark:text-jp-black border-transparent shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-jp-gold/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium">Total Reviews</div>
          <div className="text-xl font-black mt-0.5">{reviews.length}</div>
        </button>

        <button
          onClick={() => setRatingFilter("5")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            ratingFilter === "5"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-amber-500/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 5-Star Reviews
          </div>
          <div className="text-xl font-black mt-0.5 text-amber-600 dark:text-amber-400">
            {count5Star}
          </div>
        </button>

        <div className="p-3.5 rounded-xl border bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-left">
          <div className="text-xs text-jp-muted font-medium flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-green-500" /> Published
          </div>
          <div className="text-xl font-black mt-0.5 text-green-600 dark:text-green-400">
            {countPublished}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-left">
          <div className="text-xs text-jp-muted font-medium flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-jp-gold" /> Average Rating
          </div>
          <div className="text-xl font-black mt-0.5 text-jp-gold">
            {reviews.length
              ? (
                  reviews.reduce((acc, curr) => acc + curr.rating, 0) /
                  reviews.length
                ).toFixed(1)
              : "5.0"}
            / 5.0
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-jp-muted" />
          <input
            type="text"
            placeholder="Search by customer name, vehicle, comments..."
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
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
          </select>

          <button
            onClick={fetchReviews}
            title="Refresh List"
            className="p-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-jp-muted hover:text-jp-text dark:hover:text-white transition-colors"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="py-20 text-center text-jp-muted text-sm flex flex-col items-center gap-2">
          <RotateCcw className="w-6 h-6 animate-spin text-jp-gold" />
          Loading customer reviews...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
          <Star className="w-10 h-10 text-jp-muted mx-auto mb-2 opacity-50" />
          <p className="text-jp-muted text-sm">No reviews found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark flex flex-col justify-between space-y-4 hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-jp-text dark:text-white text-base">
                      {r.customer_name}
                    </h3>
                    <p className="text-xs text-jp-muted">
                      {r.vehicle_title || "Verified Customer"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-sm text-jp-text dark:text-jp-muted leading-relaxed italic">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-jp-border dark:border-jp-border-dark text-xs">
                <span className="text-jp-muted">
                  {new Date(r.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(r)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                      r.is_published
                        ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {r.is_published ? (
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
                    onClick={() => setDeleteTarget(r)}
                    title="Delete Review"
                    className="p-1 rounded text-jp-muted hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-jp-border dark:border-jp-border-dark">
              <h2 className="text-lg font-bold text-jp-text dark:text-white">
                Add Customer Review
              </h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg text-jp-muted hover:text-jp-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.customer_name}
                  onChange={(e) => setFormData((p) => ({ ...p, customer_name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Rating
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData((p) => ({ ...p, rating: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Great Experience</option>
                    <option value={3}>3 Stars - Good</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Vehicle Purchased / Reviewed
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

              <div>
                <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                  Review Comment *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Customer feedback on their purchase, RC transfer, showroom experience..."
                  value={formData.comment}
                  onChange={(e) => setFormData((p) => ({ ...p, comment: e.target.value }))}
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
                  {submitting ? "Saving..." : "Publish Review"}
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
            <h3 className="font-bold text-jp-text dark:text-white text-base">Delete Review</h3>
            <p className="text-xs text-jp-muted">
              Are you sure you want to delete this review by <strong>{deleteTarget.customer_name}</strong>?
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
