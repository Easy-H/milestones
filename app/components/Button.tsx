import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  children,
  className = "",
  variant = "default",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary";
}) {
  return (
    <button className={`${variant === "primary" ? "ui-button primary" : "ui-button"} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "default",
}: {
  children: ReactNode;
  href: string;
  variant?: "default" | "primary";
}) {
  return (
    <Link className={variant === "primary" ? "ui-button primary" : "ui-button"} href={href}>
      {children}
    </Link>
  );
}
