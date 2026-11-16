"use client";

import { useEffect, useRef, useState } from "react";
import { CreateOfferingForm } from "@/components/admin/create-offering-form";
import { ManageOfferings } from "@/components/admin/manage-offerings";
import type { Offering } from "@/components/admin/manage-offerings";
import Reveal from "@/components/animations/reveal";
import SiteHeader from "@/components/site-header";
import ManageTestimonials from "@/components/admin/manage-testimonials";
import { useUserRole } from "@/lib/hooks/use-user-role";
import Link from "next/link";

export default function AdminPage() {
  const [selectedOffering, setSelectedOffering] = useState<
    Offering | undefined
  >(undefined);

  const { isAdmin } = useUserRole();

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

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center mt-14">
        <h1 className="text-xl text-light5">
          اجازه دسترسی به این صفحه را ندارید
        </h1>
        <Link href="/" className="text-xl text-light3 cursor-pointer">
          <p>بازگشت به صفحه اصلی</p>
        </Link>
      </div>
    );
  }

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
