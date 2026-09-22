import type { Review } from "@/lib/reviews-data";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="relative rounded-[14px] border border-line bg-white p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1.5">
      <span className="absolute top-2.5 right-5 font-display text-[3rem] leading-none text-blush">
        &ldquo;
      </span>
      <p className="relative z-10 text-[0.95rem] text-charcoal-soft">
        {review.quote}
      </p>
      <span className="block text-[0.88rem] font-bold text-charcoal">
        — {review.who}
      </span>
      {review.isSample ? (
        <span className="mt-2.5 inline-block rounded-full bg-blush px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.06em] text-terracotta-dark">
          Sample quote — swap for real review
        </span>
      ) : null}
    </div>
  );
}
