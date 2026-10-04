"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  CheckCircle,
  Clock,
  TrendingDown,
  Sparkles,
  X,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Upload,
  Instagram,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Vehicle, FuelType, TransmissionType, BodyType, VehicleStatus } from "@/types";
import { formatPrice, formatKM } from "@/lib/utils";


const DEFAULT_FORM: Partial<Vehicle> = {
  brand: "Maruti Suzuki",
  model: "",
  variant: "",
  year: new Date().getFullYear(),
  registration_year: new Date().getFullYear(),
  price: 500000,
  kilometres: 25000,
  fuel_type: "Petrol",
  transmission: "Manual",
  body_type: "Hatchback",
  owners: 1,
  seating: 5,
  color: "White",
  engine: "1197 cc",
  mileage: "20.5 kmpl",
  insurance: "Comprehensive",
  service_history: true,
  condition: "Excellent",
  status: "available",
  is_featured: false,
  is_published: true,
  cover_image: "",
  description: "Well maintained, pristine condition, single owner verified.",
  instagram_link: "",
};

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fuelFilter, setFuelFilter] = useState<string>("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load vehicles from API
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      if (data.success && Array.isArray(data.vehicles)) {
        setVehicles(data.vehicles);
      }
    } catch (err) {
      console.error("Failed to load vehicles:", err);
      toast.error("Failed to load vehicles from server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch =
        search.trim() === "" ||
        `${v.brand} ${v.model} ${v.variant || ""} ${v.year}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || v.status === statusFilter;
      const matchFuel = fuelFilter === "all" || v.fuel_type === fuelFilter;

      return matchSearch && matchStatus && matchFuel;
    });
  }, [vehicles, search, statusFilter, fuelFilter]);

  // Counts
  const availableCount = vehicles.filter((v) => v.status === "available").length;
  const reservedCount = vehicles.filter((v) => v.status === "reserved").length;
  const soldCount = vehicles.filter((v) => v.status === "sold").length;

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingVehicle(null);
    setFormData({
      ...DEFAULT_FORM,
      year: new Date().getFullYear(),
      registration_year: new Date().getFullYear(),
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setFormData({ ...v });
    setIsModalOpen(true);
  };

  // Handle Form Change
  const handleChange = (
    field: keyof Vehicle,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be 10 MB or smaller.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      setUploadingImage(true);
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: uploadData,
      });
      const result = await response.json();
      if (!response.ok || !result.success || typeof result.url !== "string") {
        throw new Error(result.error || "Image upload failed.");
      }

      handleChange("cover_image", result.url);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Add or Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage) {
      toast.error("Wait for the image upload to finish.");
      return;
    }
    if (!formData.brand || !formData.model || !formData.price || !formData.year) {
      toast.error("Please fill in Brand, Model, Year, and Price");
      return;
    }

    try {
      setSubmitting(true);

      if (editingVehicle) {
        // Update existing vehicle
        const res = await fetch("/api/vehicles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, id: editingVehicle.id }),
        });
        const data = await res.json();
        if (data.success && data.vehicle) {
          setVehicles((prev) =>
            prev.map((item) => (item.id === editingVehicle.id ? data.vehicle : item))
          );
          toast.success(`${data.vehicle.brand} ${data.vehicle.model} updated successfully!`);
          setIsModalOpen(false);
        } else {
          toast.error(data.error || "Failed to update vehicle");
        }
      } else {
        // Add new vehicle
        const res = await fetch("/api/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.vehicle) {
          setVehicles((prev) => [data.vehicle, ...prev]);
          toast.success(`${data.vehicle.brand} ${data.vehicle.model} added to inventory!`);
          setIsModalOpen(false);
        } else {
          toast.error(data.error || "Failed to create vehicle");
        }
      }
    } catch (err) {
      console.error("Save vehicle error:", err);
      toast.error("Failed to save vehicle. Check server connection.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/vehicles?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id));
        toast.success(`${deleteTarget.brand} ${deleteTarget.model} deleted from inventory`);
        setDeleteTarget(null);
      } else {
        toast.error(data.error || "Failed to delete vehicle");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete vehicle");
    } finally {
      setDeleting(false);
    }
  };

  // Quick Status Toggle
  const handleQuickStatusChange = async (v: Vehicle, newStatus: VehicleStatus) => {
    try {
      const res = await fetch("/api/vehicles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: v.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.vehicle) {
        setVehicles((prev) =>
          prev.map((item) => (item.id === v.id ? data.vehicle : item))
        );
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-jp-text dark:text-white flex items-center gap-2">
            Vehicle Inventory
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-jp-gold/15 text-jp-gold font-semibold">
              Live CRUD
            </span>
          </h1>
          <p className="text-sm text-jp-muted mt-0.5">
            Add new cars, update specs and pricing, or delete sold vehicles in real-time.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn btn-primary text-sm flex items-center gap-2 shadow-lg shadow-black/10 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
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
          <div className="text-xs opacity-75 font-medium">All Vehicles</div>
          <div className="text-xl font-black mt-0.5">{vehicles.length}</div>
        </button>

        <button
          onClick={() => setStatusFilter("available")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "available"
              ? "bg-green-600 text-white border-green-600 shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-green-500/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Available
          </div>
          <div className="text-xl font-black mt-0.5 text-green-600 dark:text-green-400">
            {availableCount}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("reserved")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "reserved"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-amber-500/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Reserved
          </div>
          <div className="text-xl font-black mt-0.5 text-amber-600 dark:text-amber-400">
            {reservedCount}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("sold")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === "sold"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white dark:bg-jp-dark border-jp-border dark:border-jp-border-dark text-jp-text dark:text-white hover:border-red-500/50"
          }`}
        >
          <div className="text-xs opacity-75 font-medium flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-red-500" /> Sold
          </div>
          <div className="text-xl font-black mt-0.5 text-red-600 dark:text-red-400">
            {soldCount}
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-jp-muted" />
          <input
            type="text"
            placeholder="Search by brand, model, variant, year..."
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
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
          >
            <option value="all">All Fuels</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <button
            onClick={fetchVehicles}
            title="Refresh List"
            className="p-2.5 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-jp-muted hover:text-jp-text dark:hover:text-white transition-colors"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-jp-muted text-sm flex flex-col items-center gap-2">
            <RotateCcw className="w-6 h-6 animate-spin text-jp-gold" />
            Loading vehicles...
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-jp-muted text-sm">No vehicles found matching your criteria.</p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setFuelFilter("all");
              }}
              className="mt-3 text-xs text-jp-gold font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-jp-border dark:border-jp-border-dark bg-jp-bg/70 dark:bg-jp-black/40">
                <tr>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Year & Specs
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Kilometres
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-jp-muted uppercase tracking-wider">
                    Price
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
                {filteredVehicles.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-jp-bg/60 dark:hover:bg-jp-black/40 transition-colors group"
                  >
                    {/* Vehicle with Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 border border-black/5 dark:border-white/10">
                          {v.cover_image ? (
                            <img
                              src={v.cover_image}
                              alt={`${v.brand} ${v.model}`}
                              className="object-cover w-full h-full absolute inset-0"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-jp-muted">
                              No pic
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-jp-text dark:text-white text-sm flex items-center gap-1.5 truncate">
                            {v.brand} {v.model}
                            {v.is_featured && (
                              <span
                                title="Featured on Homepage"
                                className="inline-flex items-center text-amber-500"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-jp-muted truncate">
                            {v.variant || "Standard"} • {v.color || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Year & Specs */}
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-jp-text dark:text-white">
                        {v.year}
                      </div>
                      <div className="text-xs text-jp-muted">
                        {v.fuel_type} • {v.transmission}
                      </div>
                    </td>

                    {/* KM */}
                    <td className="px-4 py-3 text-sm text-jp-muted whitespace-nowrap">
                      <span className="font-medium text-jp-text dark:text-white">
                        {formatKM(v.kilometres)}
                      </span>
                      <div className="text-xs">{v.owners} Owner{v.owners > 1 ? "s" : ""}</div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 text-sm font-bold text-jp-text dark:text-white whitespace-nowrap">
                      {formatPrice(v.price)}
                    </td>

                    {/* Status with Quick Dropdown */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={v.status}
                        onChange={(e) =>
                          handleQuickStatusChange(v, e.target.value as VehicleStatus)
                        }
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-colors ${
                          v.status === "available"
                            ? "bg-green-50 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                            : v.status === "reserved"
                            ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                            : "bg-red-50 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/cars/${v.slug}`}
                          target="_blank"
                          title="View Live Listing"
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-jp-muted hover:text-jp-text dark:hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleOpenEdit(v)}
                          title="Edit Vehicle Details"
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-jp-muted hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(v)}
                          title="Delete Vehicle"
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-jp-muted hover:text-red-600 dark:hover:text-red-400 transition-colors"
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
      {/* ADD / EDIT VEHICLE MODAL                                  */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-jp-border dark:border-jp-border-dark bg-jp-bg/50 dark:bg-jp-black/40">
              <div>
                <h2 className="text-lg font-bold text-jp-text dark:text-white">
                  {editingVehicle ? "Edit Vehicle Details" : "Add New Vehicle to Inventory"}
                </h2>
                <p className="text-xs text-jp-muted">
                  {editingVehicle
                    ? `Updating ID: ${editingVehicle.id}`
                    : "Fill in the vehicle specifications to publish"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-jp-muted hover:text-jp-text dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
              {/* Row 1: Brand, Model, Variant */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maruti Suzuki, Hyundai"
                    value={formData.brand || ""}
                    onChange={(e) => handleChange("brand", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swift, Creta, City"
                    value={formData.model || ""}
                    onChange={(e) => handleChange("model", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Variant
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VXI, SX Diesel, ZX"
                    value={formData.variant || ""}
                    onChange={(e) => handleChange("variant", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
              </div>

              {/* Row 2: Year, Price, Kilometres */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Year of Make *
                  </label>
                  <input
                    type="number"
                    required
                    min={2000}
                    max={new Date().getFullYear() + 1}
                    value={formData.year || 2022}
                    onChange={(e) => handleChange("year", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    step={1000}
                    min={10000}
                    placeholder="e.g. 650000"
                    value={formData.price || ""}
                    onChange={(e) => handleChange("price", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Kilometres Driven *
                  </label>
                  <input
                    type="number"
                    required
                    step={500}
                    min={0}
                    placeholder="e.g. 24000"
                    value={formData.kilometres || ""}
                    onChange={(e) => handleChange("kilometres", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
              </div>

              {/* Row 3: Fuel, Transmission, Body Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={formData.fuel_type || "Petrol"}
                    onChange={(e) => handleChange("fuel_type", e.target.value as FuelType)}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Transmission
                  </label>
                  <select
                    value={formData.transmission || "Manual"}
                    onChange={(e) => handleChange("transmission", e.target.value as TransmissionType)}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="AMT">AMT</option>
                    <option value="CVT">CVT</option>
                    <option value="DCT">DCT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Body Type
                  </label>
                  <select
                    value={formData.body_type || "Hatchback"}
                    onChange={(e) => handleChange("body_type", e.target.value as BodyType)}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  >
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="MUV">MUV</option>
                    <option value="Coupe">Coupe</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Owners, Color, Seating, Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Owners
                  </label>
                  <select
                    value={formData.owners || 1}
                    onChange={(e) => handleChange("owners", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  >
                    <option value={1}>1st Owner</option>
                    <option value={2}>2nd Owner</option>
                    <option value={3}>3rd Owner</option>
                    <option value={4}>4+ Owners</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. White, Black, Red"
                    value={formData.color || ""}
                    onChange={(e) => handleChange("color", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Seating
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={9}
                    value={formData.seating || 5}
                    onChange={(e) => handleChange("seating", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || "available"}
                    onChange={(e) => handleChange("status", e.target.value as VehicleStatus)}
                    className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Cover Image – Upload Only */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-jp-text dark:text-white">
                  Cover Image
                </label>

                {/* Upload button */}
                <label
                  className={`flex flex-col items-center justify-center gap-2 w-full py-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                    uploadingImage
                      ? "opacity-60 cursor-wait border-jp-border dark:border-jp-border-dark"
                      : "border-jp-border dark:border-jp-border-dark hover:border-jp-gold hover:bg-jp-gold/5"
                  }`}
                >
                  <Upload className="w-6 h-6 text-jp-muted" />
                  <span className="text-sm font-medium text-jp-text dark:text-white">
                    {uploadingImage ? "Uploading..." : "Click to upload image"}
                  </span>
                  <span className="text-xs text-jp-muted">JPG, PNG or WebP · Max 10 MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    disabled={uploadingImage}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      void handleImageUpload(file);
                    }}
                  />
                </label>

                {/* Image Preview */}
                {formData.cover_image && (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-jp-border dark:border-jp-border-dark bg-black/5 dark:bg-white/5">
                    <img
                      src={formData.cover_image}
                      alt="Preview"
                      className="object-cover w-full h-full absolute inset-0"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-medium backdrop-blur-sm">
                      Cover Preview
                    </div>
                    {/* Remove image button */}
                    <button
                      type="button"
                      onClick={() => handleChange("cover_image", "")}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Row 6: Description */}
              <div>
                <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1">
                  Description / Features
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe car condition, special features, service history..."
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold resize-none"
                />
              </div>

              {/* Row 6b: Instagram Link */}
              <div>
                <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                  Instagram Reel / Post Link
                  <span className="text-jp-muted font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Instagram className="w-4 h-4 text-pink-400" />
                  </span>
                  <input
                    type="url"
                    placeholder="https://www.instagram.com/reel/..."
                    value={formData.instagram_link || ""}
                    onChange={(e) => handleChange("instagram_link", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>
                {formData.instagram_link && (
                  <a
                    href={formData.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs text-pink-500 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Preview link
                  </a>
                )}
              </div>

              {/* Row 7: Checkbox toggles */}
              <div className="flex flex-wrap gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.is_featured)}
                    onChange={(e) => handleChange("is_featured", e.target.checked)}
                    className="w-4 h-4 rounded text-jp-gold accent-amber-500"
                  />
                  <span className="text-xs font-medium text-jp-text dark:text-white">
                    ⭐ Feature on Homepage
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published !== false}
                    onChange={(e) => handleChange("is_published", e.target.checked)}
                    className="w-4 h-4 rounded text-jp-gold accent-amber-500"
                  />
                  <span className="text-xs font-medium text-jp-text dark:text-white">
                    👁️ Published (Visible to public)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.service_history !== false}
                    onChange={(e) => handleChange("service_history", e.target.checked)}
                    className="w-4 h-4 rounded text-jp-gold accent-amber-500"
                  />
                  <span className="text-xs font-medium text-jp-text dark:text-white">
                    Verified Service History
                  </span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-jp-border dark:border-jp-border-dark">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary text-sm px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary text-sm px-6 py-2 flex items-center gap-2"
                >
                  {submitting && <RotateCcw className="w-3.5 h-3.5 animate-spin" />}
                  {editingVehicle ? "Save Changes" : "Add Vehicle to Inventory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL                                */}
      {/* ======================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark rounded-2xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-jp-text dark:text-white">
                Delete Vehicle?
              </h3>
              <p className="text-sm text-jp-muted mt-1">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-jp-text dark:text-white">
                  {deleteTarget.brand} {deleteTarget.model} ({deleteTarget.year})
                </span>
                ? This will remove it from the website inventory immediately.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="btn btn-secondary flex-1 text-sm py-2.5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="btn bg-red-600 hover:bg-red-700 text-white flex-1 text-sm py-2.5 flex items-center justify-center gap-2"
              >
                {deleting && <RotateCcw className="w-3.5 h-3.5 animate-spin" />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
