import Image from "next/image";
import { getSellCarRequests } from "@/lib/sell-requests-store";

export const dynamic = "force-dynamic";

export default function AdminSellRequestsPage() {
  const requests = getSellCarRequests();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-jp-text dark:text-white">Sell Requests</h1>
        <p className="text-sm text-jp-muted">Customer vehicle evaluations and submitted photos</p>
      </div>
      {requests.length === 0 ? (
        <div className="text-center py-20 rounded-lg bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
          <p className="text-jp-muted text-sm">No sell requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <article key={request.id} className="rounded-lg bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-jp-text dark:text-white">{request.year} {request.brand} {request.model} {request.variant}</h2>
                  <p className="mt-1 text-sm text-jp-muted">{request.name} · {request.phone}{request.email ? ` · ${request.email}` : ""}</p>
                  <p className="mt-1 text-xs text-jp-muted">{request.city || "City not provided"} · {request.kilometres.toLocaleString()} km · {request.owners} owner(s) · {request.fuel_type} · {request.transmission}</p>
                  {request.expected_price ? <p className="mt-1 text-sm text-jp-text dark:text-white">Expected price: ₹{request.expected_price.toLocaleString("en-IN")}</p> : null}
                </div>
                <div className="text-xs text-jp-muted sm:text-right">
                  <span className="inline-block rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 font-medium text-amber-800 dark:text-amber-300">{request.status}</span>
                  <p className="mt-2">{new Date(request.created_at).toLocaleString("en-IN")}</p>
                </div>
              </div>
              {request.message && <p className="mt-3 whitespace-pre-wrap text-sm text-jp-muted">{request.message}</p>}
              {request.image_urls?.length ? (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {request.image_urls.map((url) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="relative aspect-[4/3] overflow-hidden rounded-md bg-jp-bg dark:bg-jp-black">
                      <Image src={url} alt={`${request.brand} ${request.model}`} fill sizes="(max-width: 640px) 45vw, 180px" className="object-cover" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-jp-muted">No photos attached.</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
