"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

const BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1mV8njRH8XlO5IzuK9A1IZ5Wsbd4v9Djl9xbg9cDgel0iAd2wH7bLLPmrs4bPA4aULaCCCPOsK?gv=true";

export default function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Close on Escape + lock body scroll while open
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center bg-black/70 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Schedule a meeting"
      onClick={onClose}
    >
      <div
        className="relative flex w-full h-full sm:h-[85vh] sm:max-w-2xl flex-col overflow-hidden bg-card border border-border sm:rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border shrink-0">
          <h3 className="text-lg">Book a time</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-muted text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <iframe
          src={BOOKING_URL}
          title="Google Appointment Scheduling"
          className="flex-1 w-full border-0 bg-white"
          style={{ colorScheme: "only light" }}
        />
      </div>
    </div>
  );
}
