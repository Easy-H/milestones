"use client";

import Link from "next/link";
import { useState } from "react";
import { Achievement } from "@/lib/mockApi";
import { AchievementEditModal } from "../../../components/AchievementEditModal";
import { AppShell } from "../../../components/AppShell";
import { Button } from "../../../components/Button";

export function AchievementDetailClient({
  achievement,
  availableTags = achievement.tags,
}: {
  achievement: Achievement;
  availableTags?: string[];
}) {
  const [editing, setEditing] = useState(false);
  const links = buildProjectLinks(achievement);
  const sections = buildDisplaySections(achievement, availableTags);

  return (
    <AppShell active="성취">
      <section className="page-section achievement-detail-page">
        <div className="portfolio-toolbar">
          <h1>{achievement.name}</h1>
          <div className="toolbar-right">
            <Button onClick={() => setEditing(true)} type="button">편집</Button>
            <Link className="ui-button" href="/achievements">닫기</Link>
          </div>
        </div>

        <div className="achievement-detail-strip">
          <div className="detail-meta-row">
            <span>{achievement.achievedAt}</span>
            <span>{achievement.status}</span>
          </div>
          <div className="project-link-list">
            {links.map((link) => (
              <a className="project-link-card" href={`https://${link.url.replace(/^https?:\/\//, "")}`} key={link.name}>
                <span className="project-link-icon">{link.icon}</span>
                <strong>{link.name}</strong>
              </a>
            ))}
          </div>
        </div>

        <article className="achievement-description-view">
          {sections.map((section) => (
            <section className="achievement-description-section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </article>
        {editing ? <AchievementEditModal achievement={achievement} onClose={() => setEditing(false)} /> : null}
      </section>
    </AppShell>
  );
}

function buildProjectLinks(achievement: Achievement) {
  if (achievement.type !== "프로젝트") {
    return [];
  }

  return [
    { icon: "GH", name: "GitHub", url: "github.com/easyh/studymate" },
    { icon: "▶", name: "Demo", url: achievement.details.find((detail) => detail.startsWith("링크"))?.replace("링크:", "").trim() ?? "studymate.app" },
  ];
}

function buildDisplaySections(achievement: Achievement, availableTags: string[]) {
  if (achievement.type === "프로젝트") {
    return [
      { title: "문제 정의", tags: availableTags.slice(0, 2), body: "학습 파트너를 찾는 과정에서 목적, 시간대, 관심 기술이 맞지 않아 매칭 이후 이탈이 발생했다." },
      { title: "구현", tags: availableTags, body: "목표 입력, 매칭 카드, 진행 상태를 한 화면에서 조작할 수 있도록 컴포넌트를 분리하고 상태 업데이트 흐름을 정리했다." },
      { title: "결과", tags: availableTags.slice(0, 1), body: "성과 지표, 사용자 반응, 배포 이후 개선 내용을 정리했다." },
    ];
  }

  return [{ title: "기록", tags: availableTags, body: achievement.details.join("\n") }];
}
