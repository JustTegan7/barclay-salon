import { siteConfig } from "./site-config";

export type FaqItem = {
  question: string;
  answer: string;
  /** True when the answer contains a placeholder that needs salon confirmation before launch. */
  needsConfirmation?: boolean;
  defaultOpen?: boolean;
};

export const faqItems: FaqItem[] = [
  {
    question: "Do I need an appointment, or can I walk in?",
    answer:
      "Walk-ins are always welcome, but booking online guarantees your preferred stylist and time, especially on Fridays and Saturdays, our busiest days.",
    defaultOpen: true,
  },
  {
    question: "What's your cancellation policy?",
    answer:
      "We ask for at least 48 hours' notice to cancel or reschedule. Cancellations inside 48 hours may be charged up to 50% of the service, and no-shows are charged in full. A valid card is required to hold all appointments.",
  },
  {
    question: "I'm a new client — where do I start?",
    answer: `Not sure which service to book? Call us at ${siteConfig.phone} or book a complimentary consultation online. We'll help map out the right plan for your hair goals before anything is charged.`,
  },
  {
    question: "Is there parking near the salon?",
    answer:
      "Free parking is available right outside the salon — no permit or validation needed.",
    // Dev note (not rendered): confirm exact lot details with the salon
    // before treating this as final.
    needsConfirmation: true,
  },
];
