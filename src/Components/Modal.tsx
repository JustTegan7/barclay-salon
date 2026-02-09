import React, { useEffect, useRef, useId } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleBg?: string;
  children?: React.ReactNode;
};

export default function Modal({
  open,
  onClose,
  title,
  titleBg = "#B7A08B",
  children,
}: ModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const labelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open && closeBtnRef.current) closeBtnRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    if (!el) return;
    const getFocusable = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (n) => !n.hasAttribute("disabled") && !n.getAttribute("aria-hidden")
      );
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = getFocusable();
      if (!nodes.length) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby={labelId}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(760px, 92vw)",
          background: "#FEFAF7",
          border: "2px solid #0f172a",
          borderRadius: 12,
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          overflow: "hidden",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "relative",
            background: titleBg,
            padding: "12px 48px",
          }}
        >
          <h3
            id={labelId}
            style={{ margin: 0, textAlign: "center", color: "#0f172a" }}
          >
            {title}
          </h3>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: "absolute",
              right: 10,
              top: 8,
              border: "2px solid #0f172a",
              borderRadius: 8,
              padding: "6px 10px",
              fontWeight: 600,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
        <div style={{ padding: 16, overflow: "auto" }}>{children}</div>
      </div>
    </div>
  );
}
