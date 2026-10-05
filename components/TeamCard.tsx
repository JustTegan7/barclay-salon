import Image from "next/image";
import type { TeamMember } from "@/lib/team-data";
import { siteConfig } from "@/lib/site-config";

export function TeamCard({ member }: { member: TeamMember }) {
  const isPhoneLink = member.bookHref === siteConfig.phoneHref;

  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-white shadow-soft transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_26px_55px_-18px_rgba(36,31,27,0.32)]">
      <div className="relative aspect-[3/3.4] overflow-hidden bg-blush">
        <Image
          src={member.photo}
          alt={`${member.name}, ${member.role} at ${siteConfig.name}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="px-5 pt-5 pb-6">
        <h3 className="text-[1.15rem]">{member.name}</h3>
        <span className="mb-2.5 block text-[0.82rem] font-semibold uppercase tracking-[0.05em] text-terracotta-dark">
          {member.role}
        </span>
        <p className="mb-4 min-h-[60px] text-[0.88rem] text-charcoal-soft">
          {member.bio}
        </p>
        <a
          href={member.bookHref}
          target={isPhoneLink ? undefined : "_blank"}
          rel={isPhoneLink ? undefined : "noopener"}
          className="border-b-2 border-terracotta pb-0.5 text-[0.85rem] font-bold text-charcoal transition-colors hover:text-terracotta-dark"
        >
          {member.bookLabel} →
        </a>
      </div>
    </div>
  );
}
