import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { TeamCard } from "@/components/TeamCard";
import { teamMembers } from "@/lib/team-data";
import { jsonLdString, breadcrumbSchema, teamSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Our Stylists",
  description:
    "Meet the design & color specialists at Barclay's Salon in Everett, WA — trained continuously on Redken's newest color and cutting techniques.",
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Our Stylists", path: "/team" },
];

export default function TeamPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema(crumbs)) }}
      />
      {teamSchema().map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(schema) }}
        />
      ))}
      <PageHero
        eyebrow="Who's Touching Your Hair"
        title="Meet the team behind the transformations."
        description="Every stylist at Barclay's trains continuously on Redken's newest color & cutting techniques."
        crumbs={crumbs}
      />
      <Section>
        <div className="grid grid-cols-1 gap-6.5 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <TeamCard key={member.slug} member={member} />
          ))}
        </div>
      </Section>
    </>
  );
}
