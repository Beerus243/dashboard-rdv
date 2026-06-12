"use client";

import { Heart, RotateCcw, Star, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ActionButtonsProps = {
  busy?: boolean;
  showRewind?: boolean;
  rewindEnabled?: boolean;
  onPass: () => void;
  onLike: () => void;
  onSuperLike?: () => void;
  onRewind?: () => void;
};

function ActionChip({
  label,
  accentClass,
  disabled,
  busy,
  onClick,
  children,
}: {
  label: string;
  accentClass: string;
  disabled?: boolean;
  busy?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled || busy}
      onClick={onClick}
      className="group flex min-w-[72px] flex-1 flex-col items-center gap-1.5 disabled:opacity-45"
    >
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition-transform duration-150 group-active:scale-95",
          accentClass,
        )}
      >
        {busy ? (
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </span>
      <span className="text-[11px] font-extrabold text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.42)]">
        {label}
      </span>
    </button>
  );
}

export function ActionButtons({
  busy,
  showRewind,
  rewindEnabled,
  onPass,
  onLike,
  onSuperLike,
  onRewind,
}: ActionButtonsProps) {
  return (
    <div className="mx-auto flex max-w-[460px] items-end justify-center gap-2.5 px-2">
      {showRewind ? (
        <ActionChip
          label="Retour"
          accentClass="text-rdv-rewind"
          disabled={!rewindEnabled}
          busy={busy}
          onClick={onRewind}
        >
          <RotateCcw className="h-7 w-7" />
        </ActionChip>
      ) : null}

      <ActionChip
        label="Passer"
        accentClass="text-rdv-nope"
        disabled={busy}
        onClick={onPass}
      >
        <X className="h-8 w-8 stroke-[2.5]" />
      </ActionChip>

      <ActionChip
        label="Like"
        accentClass="text-rdv-like"
        disabled={busy}
        onClick={onLike}
      >
        <Heart className="h-8 w-8 fill-rdv-like stroke-rdv-like" />
      </ActionChip>

      <ActionChip
        label="Super Like"
        accentClass="text-rdv-superlike"
        disabled={busy}
        onClick={onSuperLike ?? onLike}
      >
        <Star className="h-7 w-7 fill-rdv-superlike text-rdv-superlike" />
      </ActionChip>
    </div>
  );
}
