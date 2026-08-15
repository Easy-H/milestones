"use client";

import Link from "next/link";
import { useState } from "react";
import { Achievement, Goal, Portfolio } from "@/lib/mockApi";
import { HeaderSearch } from "../components/HeaderSearch";
import { GoalsList } from "./GoalsList";

export function GoalsClient({
  achievements = [],
  goals,
  portfolios = [],
  status = "모두보기",
  title = "대시보드",
}: {
  achievements?: Achievement[];
  goals: Goal[];
  portfolios?: Portfolio[];
  status?: string;
  title?: string;
}) {
  const [query, setQuery] = useState("");
  const isDashboard = status === "모두보기";

  return (
    <>
      <div className="goal-toolbar">
        <h1>{title}</h1>
        <HeaderSearch onChange={setQuery} placeholder="목표, 태그 검색" value={query} />
        <div className="toolbar-right">
          <button className="primary">+ 새 목표</button>
        </div>
      </div>
      {isDashboard && portfolios.length ? (
        <section className="dashboard-portfolio-strip">
          <div className="dashboard-strip-head">
            <h2>포트폴리오</h2>
            <Link className="edit-link-button visible" href="/portfolio">보기</Link>
          </div>
          <div className="dashboard-portfolio-grid">
            {portfolios.slice(0, 3).map((portfolio) => {
              const includedCount = portfolio.id === "portfolio-default"
                ? achievements.length
                : achievements.filter((achievement) => portfolio.tags.some((tag) => achievement.tags.includes(tag))).length;

              return (
                <Link className="public-card dashboard-portfolio-card" href={`/portfolio/${portfolio.id}`} key={portfolio.id}>
                  <h3>{portfolio.name}</h3>
                  <div className="tags">{portfolio.tags.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                  <span>{includedCount}개</span>
                </Link>
              );
            })}
            <Link className="public-card portfolio-create-card dashboard-plus-card" href="/portfolio">
              <span>+</span>
              <strong>포트폴리오</strong>
            </Link>
          </div>
        </section>
      ) : null}
      <GoalsList achievements={achievements} activeStatus={status} goals={goals} query={query} />
    </>
  );
}
