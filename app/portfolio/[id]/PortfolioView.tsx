import { ReactNode } from "react";
import Link from "next/link";
import { Achievement, UserPersona } from "@/lib/mockApi";
import { Tag } from "../../components/AppShell";

export type PortfolioSectionConfig = {
  align?: "center" | "left" | "right";
  contentAlign?: "center" | "left" | "right";
  id: string;
  includeTags: string[];
  itemLayout?: "app-icon" | "card";
  layoutId?: string;
  placement?: "full" | "left" | "right";
  text?: string;
  titleAlign?: "center" | "left" | "right";
  title: string;
  type: string;
};

export function PortfolioView({
  achievements,
  actions,
  editControls,
  persona,
  portfolioId,
  sections,
  title,
}: {
  achievements: Achievement[];
  actions?: ReactNode;
  editControls?: {
    afterSections?: ReactNode;
    cover?: ReactNode;
    achievements?: (achievement: Achievement) => ReactNode;
    sections?: (type: string) => ReactNode;
  };
  persona?: UserPersona;
  portfolioId?: string;
  sections?: PortfolioSectionConfig[];
  title: string;
}) {
  const sectionEntries = sections?.map((section) => [
    section.id,
    section,
    section.type === "텍스트" ? [] : achievements.filter((achievement) => {
      const matchesType = section.type === "전체" || achievement.type === section.type;
      const matchesTags = !section.includeTags.length || section.includeTags.some((tag) => achievement.tags.includes(tag));

      return matchesType && matchesTags;
    }),
  ] as const) ?? groupAchievementsByType(achievements).map(([type, items]) => [
    type,
    { align: "left", contentAlign: "left", id: type, includeTags: [], itemLayout: "card", placement: "full", text: "", title: type, titleAlign: "left", type },
    items,
  ] as const);
  const visibleSectionEntries = editControls?.sections
    ? sectionEntries
    : sectionEntries.filter(([, section, items]) => section.type === "텍스트" ? section.text?.trim() : items.length > 0);

  return (
    <>
      <div className="section-head">
        <div>
          <h1>{title}</h1>
          {persona ? (
            <div className="portfolio-persona-line">
              <strong>{persona.name}</strong>
              <span>{persona.title}</span>
            </div>
          ) : null}
        </div>
        {actions ? <div className="actions">{actions}</div> : null}
      </div>

      {persona ? (
        <div className="portfolio-persona-card">
          <p>{persona.bio}</p>
          <div className="tags">{persona.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
        </div>
      ) : null}

      <div className="portfolio-section-stack">
        {visibleSectionEntries.map(([id, section, items]) => (
          <section
            className={[
              "portfolio-content-section",
              (section.titleAlign ?? "left") === "center" ? "title-center" : "",
              (section.titleAlign ?? "left") === "right" ? "title-right" : "",
              (section.contentAlign ?? section.align ?? "left") === "center" ? "content-center" : "",
              (section.contentAlign ?? section.align ?? "left") === "right" ? "content-right" : "",
              section.placement === "left" ? "section-left" : "",
              section.placement === "right" ? "section-right" : "",
            ].filter(Boolean).join(" ")}
            key={id}
          >
            <div className={editControls?.sections ? "portfolio-section-head editable-region" : "portfolio-section-head"}>
              <div className="portfolio-section-title-group">
                <h2>{section.title}</h2>
                {section.type !== "텍스트" ? <span>{items.length}개</span> : null}
              </div>
              {editControls?.sections?.(id)}
            </div>
            {section.type === "텍스트" ? (
              <div className="portfolio-text-section">
                {section.text?.trim() ? section.text : "텍스트 없음"}
              </div>
            ) : (
              <div className={section.itemLayout === "app-icon" ? "achievement-grid public-achievements app-icon-layout" : "achievement-grid public-achievements"}>
                {items.length ? items.map((achievement) => (
                  <Link
                    className={section.itemLayout === "app-icon" ? "achievement-card linked-achievement-card portfolio-app-icon-card" : "achievement-card linked-achievement-card"}
                    href={portfolioId ? `/portfolio/${portfolioId}/achievements/${achievement.type}/${achievement.id}` : `/achievements/${achievement.type}/${achievement.id}`}
                    key={achievement.id}
                  >
                    {editControls?.achievements?.(achievement)}
                    <div className="thumb">{achievement.mark}</div>
                    {section.itemLayout === "app-icon" ? (
                      <h3>{achievement.name}</h3>
                    ) : (
                      <div>
                        <h3>{achievement.name}</h3>
                        <p>{achievement.achievedAt}</p>
                          <div className="tags">{achievement.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
                      </div>
                    )}
                  </Link>
                )) : <div className="portfolio-empty-section">조건에 맞는 성취 없음</div>}
              </div>
            )}
          </section>
        ))}
        {editControls?.afterSections}
      </div>
    </>
  );
}

function groupAchievementsByType(achievements: Achievement[]): [string, Achievement[]][] {
  const grouped = achievements.reduce<Record<string, Achievement[]>>((acc, achievement) => {
    acc[achievement.type] = [...(acc[achievement.type] ?? []), achievement];
    return acc;
  }, {});

  return Object.entries(grouped);
}
