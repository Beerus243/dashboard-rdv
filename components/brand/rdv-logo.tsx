import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export const RDV_LOGO_SRC = "/assets/icon.png";

const SIZES = {
  sm: { px: 32, className: "h-8 w-8" },
  md: { px: 40, className: "h-10 w-10" },
  lg: { px: 48, className: "h-12 w-12" },
  xl: { px: 64, className: "h-16 w-16" },
} as const;

type RdvLogoProps = {
  size?: keyof typeof SIZES;
  showText?: boolean;
  title?: string;
  subtitle?: string;
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function RdvLogo({
  size = "md",
  showText = false,
  title = "RDV",
  subtitle,
  href,
  className,
  imageClassName,
  priority = false,
}: RdvLogoProps) {
  const { px, className: sizeClass } = SIZES[size];

  const inner = (
    <>
      <Image
        src={RDV_LOGO_SRC}
        alt={title}
        width={px}
        height={px}
        priority={priority}
        className={cn(
          "shrink-0 rounded-[var(--rdv-radius-input)] object-contain",
          sizeClass,
          imageClassName,
        )}
      />
      {showText ? (
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-rdv-text">{title}</p>
          {subtitle ? (
            <p className="truncate text-xs text-rdv-muted">{subtitle}</p>
          ) : null}
        </div>
      ) : null}
    </>
  );

  const wrapperClass = cn(
    "flex items-center gap-3",
    href && "transition-opacity hover:opacity-90",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        {inner}
      </Link>
    );
  }

  return <div className={wrapperClass}>{inner}</div>;
}
