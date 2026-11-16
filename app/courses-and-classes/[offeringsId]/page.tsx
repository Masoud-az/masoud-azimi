import OfferingDetails from "@/components/offering-details";
import SiteHeader from "@/components/site-header";
import { db } from "@/lib/db";
import { offerings } from "@/lib/db/schema/offerings";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import z from "zod";

type PageProps = { params: Promise<{ offeringsId: string }> };

export default async function OfferingDetailsPage({ params }: PageProps) {
  const { offeringsId } = await params;

  console.log("id:", offeringsId);

  const idValidation = z.uuid().safeParse(offeringsId);

  console.log("validation:", idValidation.data);

  if (!idValidation.success) {
    return notFound();
  }

  const [offering] = await db
    .select()
    .from(offerings)
    .where(eq(offerings.id, idValidation.data))
    .limit(1);

  console.log("Offering from database:", offering);

  if (!offering || !offering.isVisible) {
    notFound();
  }

  return (
    <main className="bg-background p-3">
      <SiteHeader />
      <OfferingDetails offering={offering} />
    </main>
  );
}
