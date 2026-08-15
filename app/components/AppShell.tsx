"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/goals", label: "대시보드" },
  { href: "/goals/todo", label: "목표" },
  { href: "/goals/wishlist", label: "하고싶은일" },
  { href: "/achievements", label: "성취" },
  { href: "/portfolio", label: "포트폴리오" },
  { href: "/dm", label: "DM" },
  { href: "/profile", label: "프로필" },
  { href: "/portfolio/layouts", label: "레이아웃" },
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
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("milestones-sidebar-collapsed") === "true");
  }, []);

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
          {navItems.map((item) => (
            <Link className={active === item.label ? "nav-item active" : "nav-item"} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-panel">
          <span>이번 달</span>
          <strong>성취 4</strong>
          <small>목표 8 · 성취 3</small>
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
