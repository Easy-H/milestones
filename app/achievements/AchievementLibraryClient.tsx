"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Achievement } from "@/lib/mockApi";
import { AchievementEditModal } from "../components/AchievementEditModal";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { HeaderSearch } from "../components/HeaderSearch";
import { StatusDropdown } from "../components/StatusDropdown";

const achievementTypeOptions = ["프로젝트", "대회 / 수상", "자격 / 인증", "운동 / 도전", "독서", "영화", "게임", "문화생활", "지역 방문", "여행", "기타"];

export function AchievementLibraryClient({ achievements }: { achievements: Achievement[] }) {
  const [query, setQuery] = useState("");
  const [registeringAchievement, setRegisteringAchievement] = useState<Achievement | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [visibleAchievementIds, setVisibleAchievementIds] = useState<string[]>(achievements.map((achievement) => achievement.id));
  const [statusMenuId, setStatusMenuId] = useState<string | null>(null);
  const [typeMenuId, setTypeMenuId] = useState<string | null>(null);
  const [tagInputId, setTagInputId] = useState<string | null>(null);
  const [achievementNames, setAchievementNames] = useState<Record<string, string>>(
    Object.fromEntries(achievements.map((achievement) => [achievement.id, achievement.name])),
  );
  const [achievementTypes, setAchievementTypes] = useState<Record<string, string>>(
    Object.fromEntries(achievements.map((achievement) => [achievement.id, achievement.type])),
  );
  const [achievementStatuses, setAchievementStatuses] = useState<Record<string, string>>(
    Object.fromEntries(achievements.map((achievement) => [achievement.id, achievement.status])),
  );
  const [achievementTags, setAchievementTags] = useState<Record<string, string[]>>(
    Object.fromEntries(achievements.map((achievement) => [achievement.id, achievement.tags])),
  );
  const normalizedQuery = query.trim().toLowerCase();
  const visibleAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      if (!visibleAchievementIds.includes(achievement.id)) return false;
      const name = achievementNames[achievement.id] ?? achievement.name;
      const type = achievementTypes[achievement.id] ?? achievement.type;
      const tags = achievementTags[achievement.id] ?? achievement.tags;

      if (!normalizedQuery) return true;

      return name.toLowerCase().includes(normalizedQuery) ||
        type.toLowerCase().includes(normalizedQuery) ||
        tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
    });
  }, [achievementNames, achievementTags, achievementTypes, achievements, normalizedQuery, visibleAchievementIds]);

  const updateText = (setter: (updater: (current: Record<string, string>) => Record<string, string>) => void, id: string, value: string) => {
    const nextValue = value.trim();
    if (nextValue) {
      setter((current) => ({ ...current, [id]: nextValue }));
    }
    setEditingCell(null);
  };

  const addTag = (id: string, value: string) => {
    const tag = value.trim().replace(/^#/, "");
    if (tag) {
      setAchievementTags((current) => {
        const tags = current[id] ?? [];
        return tags.includes(tag) ? current : { ...current, [id]: [tag, ...tags] };
      });
    }
    setTagInputId(null);
  };

  const removeTag = (id: string, tag: string) => {
    setAchievementTags((current) => ({
      ...current,
      [id]: (current[id] ?? []).filter((item) => item !== tag),
    }));
  };

  useEffect(() => {
    const closeMenus = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(".status-cell, .type-cell")) return;

      setStatusMenuId(null);
      setTypeMenuId(null);
    };

    document.addEventListener("pointerdown", closeMenus);
    return () => document.removeEventListener("pointerdown", closeMenus);
  }, []);

  return (
    <AppShell active="성취">
      <section className="page-section">
        <div className="portfolio-toolbar">
          <h1>성취</h1>
          <HeaderSearch onChange={setQuery} value={query} />
          <div className="toolbar-right">
            <Button onClick={() => setRegisteringAchievement(buildNewAchievement())} type="button" variant="primary">+ 성취 등록</Button>
          </div>
        </div>

        <div className="achievement-table-card">
          <div className="achievement-row achievement-head">
            <span>성취</span>
            <span>타입</span>
            <span>태그</span>
            <span>달성일</span>
            <span>상태</span>
          </div>
          {visibleAchievements.map((achievement) => (
            <article className="achievement-row" key={achievement.id}>
              <div className="achievement-title-cell">
                <button
                  aria-label={`${achievement.name} 편집`}
                  className="edit-inline-button"
                  onClick={() => setEditingAchievement(achievement)}
                  type="button"
                >
                  편집
                </button>
                {editingCell === `${achievement.id}:name` ? (
                  <input
                    autoFocus
                    className="goal-title-input"
                    defaultValue={achievementNames[achievement.id] ?? achievement.name}
                    onBlur={(event) => updateText(setAchievementNames, achievement.id, event.currentTarget.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") updateText(setAchievementNames, achievement.id, event.currentTarget.value);
                      if (event.key === "Escape") setEditingCell(null);
                    }}
                  />
                ) : (
                  <>
                    <strong className="goal-title-text">{achievementNames[achievement.id] ?? achievement.name}</strong>
                    <button className="edit-link-button" onClick={() => setEditingCell(`${achievement.id}:name`)} type="button">
                      편집
                    </button>
                    <Link className="edit-link-button visible" href={`/achievements/${achievement.type}/${achievement.id}`}>
                      보기
                    </Link>
                  </>
                )}
              </div>
              <div className="type-cell">
                <button
                  className="type-trigger"
                  onClick={() => setTypeMenuId(typeMenuId === achievement.id ? null : achievement.id)}
                  type="button"
                >
                  {achievementTypes[achievement.id] ?? achievement.type}
                </button>
                {typeMenuId === achievement.id ? (
                  <div className="status-menu type-menu">
                    {achievementTypeOptions.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setAchievementTypes((current) => ({ ...current, [achievement.id]: type }));
                          setTypeMenuId(null);
                        }}
                        type="button"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="tag-cell achievement-tag-cell">
                {tagInputId === achievement.id ? (
                  <input
                    autoFocus
                    className="tag-inline-input"
                    onBlur={(event) => addTag(achievement.id, event.currentTarget.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addTag(achievement.id, event.currentTarget.value);
                      }
                      if (event.key === "Escape") setTagInputId(null);
                    }}
                    placeholder="#태그"
                  />
                ) : (
                  <button className="tag-add-button" onClick={() => setTagInputId(achievement.id)} type="button">+</button>
                )}
                <span className="tags">
                  {(achievementTags[achievement.id] ?? achievement.tags).map((tag) => (
                    <span className="removable-tag" key={tag}>
                      <button aria-label={`${tag} 제거`} onClick={() => removeTag(achievement.id, tag)} type="button" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </span>
              </div>
              <span className="fixed-date-cell">{achievement.achievedAt}</span>
              <StatusDropdown
                active={normalizeAchievementStatus(achievementStatuses[achievement.id] ?? achievement.status) === "성취"}
                id={achievement.id}
                isOpen={statusMenuId === achievement.id}
                onOpenChange={setStatusMenuId}
                onSelect={(status) => setAchievementStatuses((current) => ({ ...current, [achievement.id]: status }))}
                options={["성취", "진행 중", "하고싶은일", "보류"]}
                value={normalizeAchievementStatus(achievementStatuses[achievement.id] ?? achievement.status)}
              >
                <button
                  className="danger-menu-item"
                  onClick={() => {
                    setVisibleAchievementIds((current) => current.filter((id) => id !== achievement.id));
                    setStatusMenuId(null);
                  }}
                  type="button"
                >
                  삭제
                </button>
              </StatusDropdown>
            </article>
          ))}
        </div>
        {editingAchievement ? <AchievementEditModal achievement={editingAchievement} onClose={() => setEditingAchievement(null)} /> : null}
        {registeringAchievement ? <AchievementEditModal achievement={registeringAchievement} onClose={() => setRegisteringAchievement(null)} /> : null}
      </section>
    </AppShell>
  );
}

function buildNewAchievement(): Achievement {
  return {
    achievedAt: formatToday(),
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

function normalizeAchievementStatus(status: string) {
  if (status === "활성" || status === "달성" || status === "성취한일" || status === "성취한 일") return "성취";
  if (status === "숨김" || status === "진행 중" || status === "해야할일" || status === "해야할 일" || status === "목표") return "진행 중";
  if (status === "보류" || status === "하고 싶음" || status === "하고싶은 일") return "하고싶은일";

  return status;
}

function formatToday() {
  return new Intl.DateTimeFormat("ko-KR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Seoul",
    year: "numeric",
  }).format(new Date()).replace(/\. /g, ".").replace(/\.$/, "");
}
