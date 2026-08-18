"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useState } from "react";

const primaryNavItems = [
  { href: "/goals", label: "대시보드" },
  { href: "/goals/todo", label: "진행 중" },
  { href: "/goals/wishlist", label: "하고 싶은 일" },
  { href: "/achievements", label: "성취" },
  { href: "/portfolio", label: "모음" },
  { href: "/portfolio/explore", label: "둘러보기" },
  { href: "/dm", label: "메시지" },
];

const secondaryNavItems = [
  { href: "/profile", label: "프로필" },
  { href: "/profile?settings=1", label: "설정" },
];

export function AppShell({
  active,
  children,
  contextTitle,
}: {
  active: string;
  children: ReactNode;
  contextTitle?: string;
}) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("milestones-sidebar-collapsed") === "true";
  });

  const toggleSidebar = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("milestones-sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <main className={collapsed ? "app-shell sidebar-collapsed" : "app-shell"}>
      <aside className="sidebar">
        <div className="sidebar-head">
          <Link className="brand" href="/goals">
            <div className="brand-mark">M</div>
            <strong>Milestones</strong>
          </Link>
        </div>
        {contextTitle ? <div className="sidebar-context-title">{contextTitle}</div> : null}
        <nav className="nav">
          {primaryNavItems.map((item) => (
            <Link className={active === item.label ? "nav-item active" : "nav-item"} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <nav className="nav nav-bottom">
          {secondaryNavItems.map((item) => (
            <Link className={active === item.label ? "nav-item active" : "nav-item"} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-panel">
          <span>이번 달</span>
          <strong>성취 4</strong>
          <small>진행 중 8 · 성취 3</small>
        </div>
        <button aria-label={collapsed ? "네비게이션 열기" : "네비게이션 닫기"} className="sidebar-toggle" onClick={toggleSidebar} type="button">
          {collapsed ? "›" : "‹"}
        </button>
      </aside>

      <section className="workspace">
        {children}
      </section>
    </main>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}

export function Pill({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return <button className={active ? "pill active" : "pill"}>{children}</button>;
}
