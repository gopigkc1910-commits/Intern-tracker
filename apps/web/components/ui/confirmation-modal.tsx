"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";

type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
};

export function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isPending = false
}: ConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm animate-slide-up"
      style={{ animationDuration: "200ms" }}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div 
        className="relative w-full max-w-sm rounded-[28px] border border-white/20 bg-mist p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-xl font-semibold text-ink">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate">
          {description}
        </p>
        
        <div className="mt-6 flex flex-row-reverse items-center justify-start gap-3">
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isPending}
            loading={isPending}
          >
            {confirmText}
          </Button>
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}
