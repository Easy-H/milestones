"use client";

import { useState } from "react";
import { Achievement } from "@/lib/mockApi";
import { AppShell, Tag } from "../components/AppShell";
import { AchievementEditModal } from "../components/AchievementEditModal";

const views = ["카드", "리스트", "타임라인", "타입 보드", "지역", "이미지"];

export function AchievementsClient({
  achievements,
  selectedAchievement,
}: {
  achievements: Achievement[];
  selectedAchievement: Achievement;
}) {
  const [registeringAchievement, setRegisteringAchievement] = useState<Achievement | null>(null);
  const [activeView, setActiveView] = useState("카드");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  return (
    <AppShell active="성취">
      <section className="page-section">
        <div className="achievement-toolbar">
          <h1>성취</h1>
          {["2026", "타입", "태그", "지역"].map((item) => (
            <button
              className={activeFilters.includes(item) ? "active-filter" : ""}
              key={item}
              onClick={() => setActiveFilters((current) => current.includes(item) ? current.filter((filter) => filter !== item) : [...current, item])}
              type="button"
            >
              {item}
            </button>
          ))}
          <input placeholder="검색" />
          <select aria-label="보기 방식" onChange={(event) => setActiveView(event.target.value)} value={activeView}>
            {views.map((view) => <option key={view}>{view}</option>)}
          </select>
          <button className="primary" onClick={() => setRegisteringAchievement(buildNewAchievement())} type="button">+ 성취 등록</button>
        </div>

        <div className={`achievement-grid view-${activeView.replaceAll(" ", "-")}`}>
          {achievements.map((item) => (
            <article className="achievement-card" key={item.id}>
              <div className="thumb">{item.mark}</div>
              <div>
                <h3>{item.name}</h3>
                <p>{item.type} · {item.achievedAt} · {item.status}</p>
                <div className="tags">{item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
              </div>
            </article>
          ))}
        </div>
        {activeView !== "카드" ? <div className="active-view-note">{activeView}</div> : null}
        <div className="record-panel">
          <h2>{selectedAchievement.name}</h2>
          <div className="record-grid">
            {selectedAchievement.details.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
        {registeringAchievement ? <AchievementEditModal achievement={registeringAchievement} onClose={() => setRegisteringAchievement(null)} /> : null}
      </section>
    </AppShell>
  );
}

function buildNewAchievement(): Achievement {
  return {
    achievedAt: new Intl.DateTimeFormat("ko-KR", {
      day: "2-digit",
      month: "2-digit",
      timeZone: "Asia/Seoul",
      year: "numeric",
    }).format(new Date()).replace(/\. /g, ".").replace(/\.$/, ""),
    area: "온라인",
    details: ["기간:", "역할:", "기술:", "결과:"],
    id: `ach-new-${Date.now()}`,
    mark: "NEW",
    name: "새 프로젝트 출시",
    status: "성취",
    tags: ["React", "Frontend"],
    type: "프로젝트",
  };
}
