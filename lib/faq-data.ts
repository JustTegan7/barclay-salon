import { siteConfig } from "./site-config";

export type FaqItem = {
  question: string;
  answer: string;
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
    answer: `Not sure which service to book? Give us a call at ${siteConfig.phone} and we'll match you with the right stylist and service for your hair goals. Your stylist will always walk through the plan and pricing with you before getting started.`,
  },
  {
    question: "Is there parking near the salon?",
    answer:
      "Yes. Free parking is available in the lot right outside the salon.",
  },
];
