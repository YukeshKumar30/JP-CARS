import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DEMO_VEHICLES } from "@/lib/demo-data";
import { VehicleCard } from "@/components/cars/vehicle-card";
import { StaggerContainer, StaggerItem, Reveal } from "@/components/shared/animations";

export function FeaturedCarsSection() {
  const featured = DEMO_VEHICLES.filter((v) => v.is_featured && v.is_published).slice(0, 6);

  return (
    <section className="py-16 bg-jp-bg dark:bg-jp-black">
      <div className="jp-container">
        <div className="flex items-end justify-between mb-10">
          <Reveal>
            <div>
              <span className="section-tag">Featured Cars</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-jp-text dark:text-white">
                Hand-Picked for You
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/cars"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-jp-text dark:text-white hover:text-jp-gold dark:hover:text-jp-gold transition-colors group"
            >
              View All Cars
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((vehicle) => (
            <StaggerItem key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/cars" className="btn btn-secondary px-8">
            View All Cars
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
