import Link from "next/link";
import { getStoredVehicles } from "@/lib/vehicles-store";
import { getLeads } from "@/lib/leads-store";
import { getTestDriveRequests } from "@/lib/test-drives-store";
import { getSellCarRequests } from "@/lib/sell-requests-store";
import { getFinanceRequests } from "@/lib/finance-store";
import {
  Car,
  CheckCircle,
  Clock,
  TrendingDown,
  Users,
  CalendarDays,
  DollarSign,
  Star,
  ArrowRight,
  Plus,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const vehicles = getStoredVehicles();
  const available = vehicles.filter((v) => v.status === "available").length;
  const reserved = vehicles.filter((v) => v.status === "reserved").length;
  const sold = vehicles.filter((v) => v.status === "sold").length;
  const total = vehicles.length;
  const featured = vehicles.filter((v) => v.is_featured && v.is_published);

  const leadsCount = getLeads().length;
  const testDrivesCount = getTestDriveRequests().length;
  const sellRequestsCount = getSellCarRequests().length;
  const financeCount = getFinanceRequests().length;

  const stats = [
    {
      label: "Total Vehicles",
      value: total,
      icon: Car,
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      href: "/admin/vehicles",
    },
    {
      label: "Available",
      value: available,
      icon: CheckCircle,
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      href: "/admin/vehicles?status=available",
    },
    {
      label: "Reserved",
      value: reserved,
      icon: Clock,
      color: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
      href: "/admin/vehicles?status=reserved",
    },
    {
      label: "Sold",
      value: sold,
      icon: TrendingDown,
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
      href: "/admin/vehicles?status=sold",
    },
    {
      label: "Enquiries",
      value: leadsCount,
      icon: Users,
      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      href: "/admin/leads",
    },
    {
      label: "Test Drives",
      value: testDrivesCount,
      icon: CalendarDays,
      color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
      href: "/admin/test-drives",
    },
    {
      label: "Sell Requests",
      value: sellRequestsCount,
      icon: TrendingDown,
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      href: "/admin/sell-requests",
    },
    {
      label: "Finance Requests",
      value: financeCount,
      icon: DollarSign,
      color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
      href: "/admin/finance",
    },
  ];

  const quickActions = [
    { label: "Manage / Add Vehicles", href: "/admin/vehicles", icon: Plus },
    { label: "View Leads", href: "/admin/leads", icon: Users },
    { label: "Test Drive Bookings", href: "/admin/test-drives", icon: CalendarDays },
    { label: "Customer Reviews", href: "/admin/reviews", icon: Star },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-jp-text dark:text-white">Dashboard</h1>
          <p className="text-sm text-jp-muted mt-0.5">Welcome to JP CARS admin panel</p>
        </div>
        <Link href="/admin/vehicles" className="btn btn-primary text-sm flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Link>
      </div>

      {/* Live Inventory Banner */}
      <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-700 dark:text-amber-300 flex items-center justify-between flex-wrap gap-2">
        <div>
          <strong>Live Inventory:</strong> Currently managing <strong>{total} vehicles</strong> ({available} available, {reserved} reserved, {sold} sold).
        </div>
        <Link href="/admin/vehicles" className="text-xs font-semibold text-jp-gold hover:underline">
          Open Vehicle Manager →
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-4 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark hover:shadow-md transition-all duration-200 group"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-jp-text dark:text-white group-hover:text-jp-gold transition-colors">
              {stat.value}
            </div>
            <div className="text-xs text-jp-muted mt-0.5">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold text-jp-text dark:text-white mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-sm font-medium text-jp-text dark:text-white hover:border-jp-gold/40 hover:shadow-sm transition-all"
            >
              <action.icon className="w-4 h-4 text-jp-gold" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent vehicles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-jp-text dark:text-white">Featured Inventory</h2>
          <Link href="/admin/vehicles" className="text-xs text-jp-blue-light hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-jp-border dark:border-jp-border-dark bg-jp-bg/50 dark:bg-jp-black/50">
                <tr>
                  {["Vehicle", "Year", "Price", "KM", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-jp-muted uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-jp-border dark:divide-jp-border-dark">
                {featured.slice(0, 6).map((v) => (
                  <tr key={v.id} className="hover:bg-jp-bg dark:hover:bg-jp-black/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-jp-text dark:text-white text-sm">
                        {v.brand} {v.model}
                      </div>
                      <div className="text-xs text-jp-muted">{v.variant || "Standard"}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-jp-muted">{v.year}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-jp-text dark:text-white">
                      {formatPrice(v.price)}
                    </td>
                    <td className="px-4 py-3 text-sm text-jp-muted">
                      {v.kilometres.toLocaleString("en-IN")} km
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          v.status === "available"
                            ? "badge-available"
                            : v.status === "reserved"
                            ? "badge-reserved"
                            : "badge-sold"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
