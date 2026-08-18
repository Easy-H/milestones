"use client";

import Link from "next/link";
import { useState } from "react";
import { Achievement, getCollectionMilestones, Goal, Portfolio } from "@/lib/mockApi";
import { HeaderSearch } from "../components/HeaderSearch";
import { GoalsList } from "./GoalsList";

const dashboardStatusFilters = [
  { label: "전체", value: "모두보기" },
  { label: "성취", value: "성취" },
  { label: "하고싶은일", value: "하고싶은일" },
  { label: "진행중", value: "진행중" },
];

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
  const [goalQuery, setGoalQuery] = useState("");
  const [collectionQuery, setCollectionQuery] = useState("");
  const [dashboardStatus, setDashboardStatus] = useState("모두보기");
  const isDashboard = status === "모두보기";
  const activeStatus = isDashboard ? dashboardStatus : status;
  const normalizedCollectionQuery = collectionQuery.trim().toLowerCase();
  const visiblePortfolios = portfolios.filter((portfolio) => {
    if (!normalizedCollectionQuery) return true;

    return portfolio.name.toLowerCase().includes(normalizedCollectionQuery) ||
      portfolio.displayName.toLowerCase().includes(normalizedCollectionQuery) ||
      portfolio.tags.some((tag) => tag.toLowerCase().includes(normalizedCollectionQuery));
  });

  return (
    <>
      <div className="goal-toolbar">
        <h1>{title}</h1>
        {!isDashboard ? <HeaderSearch onChange={setGoalQuery} placeholder="목표, 태그 검색" value={goalQuery} /> : null}
        <div className="toolbar-right">
          <button className="primary">+ 새 Milestone</button>
        </div>
      </div>
      {isDashboard && portfolios.length ? (
        <section className="dashboard-portfolio-strip">
          <div className="dashboard-strip-head">
            <h2>모음</h2>
            <HeaderSearch onChange={setCollectionQuery} placeholder="모음 검색" value={collectionQuery} />
            <Link className="edit-link-button visible" href="/portfolio">보기</Link>
          </div>
          <div className="dashboard-portfolio-grid">
            {visiblePortfolios.slice(0, 3).map((portfolio) => {
              const includedCount = getCollectionMilestones(portfolio, goals, achievements).length;

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
              <strong>모음</strong>
            </Link>
          </div>
        </section>
      ) : null}
      {isDashboard ? (
        <div className="goal-list-header">
          <h2>목표</h2>
          <HeaderSearch onChange={setGoalQuery} placeholder="목표, 태그 검색" value={goalQuery} />
          <div aria-label="목표 상태 필터" className="tabs compact-tabs status-radio-group" role="radiogroup">
            {dashboardStatusFilters.map((filter) => (
              <button
                aria-checked={dashboardStatus === filter.value}
                className={dashboardStatus === filter.value ? "pill active" : "pill"}
                key={filter.value}
                onClick={() => setDashboardStatus(filter.value)}
                role="radio"
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <GoalsList achievements={achievements} activeStatus={activeStatus} goals={goals} query={goalQuery} />
    </>
  );
}
