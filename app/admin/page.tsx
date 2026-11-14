"use client";

import { useEffect, useRef, useState } from "react";
import { CreateOfferingForm } from "@/components/admin/create-offering-form";
import { ManageOfferings } from "@/components/admin/manage-offerings";
import type { Offering } from "@/components/admin/manage-offerings";
import Reveal from "@/components/animations/reveal";
import SiteHeader from "@/components/site-header";
import ManageTestimonials from "@/components/admin/manage-testimonials";

export default function AdminPage() {
  const [selectedOffering, setSelectedOffering] = useState<
    Offering | undefined
  >(undefined);

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshOfferings = () => setRefreshKey((current) => current + 1);

  function handleSuccess() {
    setSelectedOffering(undefined);
    refreshOfferings();
  }

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedOffering) {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedOffering]);

  return (
    <main className="bg-background p-3 lg:pt-32">
      <SiteHeader />

      <div ref={formRef} className="scroll-mt-32">
        <Reveal>
          <CreateOfferingForm
            offering={selectedOffering}
            onSuccess={handleSuccess}
          />
        </Reveal>
      </div>

      <Reveal>
        <ManageOfferings
          onEdit={setSelectedOffering}
          refreshKey={refreshKey}
          onRefresh={refreshOfferings}
        />
      </Reveal>

      <Reveal>
        <ManageTestimonials />
      </Reveal>
    </main>
  );
}
