import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "link";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-brand-teal text-white hover:bg-brand-teal/90 focus-visible:outline-2 focus-visible:outline-brand-coral",
  secondary:
    "bg-transparent text-brand-teal border border-brand-teal hover:bg-brand-teal/5 focus-visible:outline-2 focus-visible:outline-brand-coral",
  link: "text-brand-teal underline-offset-4 hover:underline focus-visible:underline",
};

const SIZE: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded",
  md: "text-base px-4 py-2 rounded-md",
  lg: "text-lg px-6 py-3 rounded-lg",
};

const BASE =
  "inline-flex items-center justify-center font-sans font-medium transition-colors focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

function classes(variant: Variant, size: Size, extra?: string) {
  const sizeCls = variant === "link" ? "" : SIZE[size];
  return `${BASE} ${VARIANT[variant]} ${sizeCls} ${extra ?? ""}`.trim();
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const cls = classes(variant, size, className);

  if ("href" in props && typeof props.href === "string") {
    const { variant: _v, size: _s, className: _c, children: _ch, href, ...rest } =
      props;
    void _v;
    void _s;
    void _c;
    void _ch;
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  void _v;
  void _s;
  void _c;
  void _ch;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
