"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "../../components/AppShell";

export function PortfolioCard({
  active = false,
  activity,
  cornerAction,
  footer,
  href,
  onHover,
  stat,
  subtitle,
  tags,
  title,
}: {
  active?: boolean;
  activity: string;
  cornerAction: ReactNode;
  footer?: ReactNode;
  href: string;
  onHover?: () => void;
  stat: string;
  subtitle: string;
  tags: string[];
  title: string;
}) {
  const router = useRouter();

  return (
    <article
      className={active ? "public-card saved clickable-card" : "public-card clickable-card"}
      onClick={() => router.push(href)}
      onMouseEnter={onHover}
    >
      {cornerAction}
      <div className="compact-head">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="tags">{tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
      <span>{stat}</span>
      <small>{activity}</small>
      {footer}
    </article>
  );
}
