import Link from "next/link";
import { ArrowLeft, Car } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-jp-bg dark:bg-jp-black">
      <div className="text-center px-4">
        <div className="w-20 h-20 bg-jp-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Car className="w-10 h-10 text-jp-gold" />
        </div>
        <h1 className="text-6xl font-black text-jp-text dark:text-white mb-2">404</h1>
        <h2 className="text-xl font-bold text-jp-text dark:text-white mb-3">Page Not Found</h2>
        <p className="text-jp-muted text-sm mb-8 max-w-xs mx-auto">
          This page doesn&apos;t exist. Try browsing our car inventory instead.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary px-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/cars" className="btn btn-secondary px-6">
            Browse Cars
          </Link>
        </div>
      </div>
    </div>
  );
}
