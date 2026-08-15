"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Achievement, PortfolioLayout } from "@/lib/mockApi";
import { AppShell, Tag } from "../../components/AppShell";
import { Button } from "../../components/Button";
import { HeaderSearch } from "../../components/HeaderSearch";
import { Modal } from "../../components/Modal";

export function LayoutsClient({
  achievements,
  layouts,
}: {
  achievements: Achievement[];
  layouts: PortfolioLayout[];
}) {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const categories = ["전체", ...Array.from(new Set(layouts.map((layout) => layout.category)))];
  const normalizedQuery = query.trim().toLowerCase();
  const visibleLayouts = layouts.filter((layout) => {
    const matchesCategory = activeCategory === "전체" || layout.category === activeCategory;
    const matchesQuery = !normalizedQuery ||
      layout.name.toLowerCase().includes(normalizedQuery) ||
      layout.section.toLowerCase().includes(normalizedQuery) ||
      layout.display.toLowerCase().includes(normalizedQuery) ||
      layout.fields.some((field) => field.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesQuery;
  });
  const selected = layouts.find((layout) => layout.id === previewId) ?? visibleLayouts[0] ?? layouts[0];
  const isIconPreview = selected?.display.includes("아이콘") ?? false;
  const previewItems = useMemo(() => {
    if (!selected) return [];
    const scoped = achievements.filter((achievement) => achievement.type === selected.section);
    return scoped.length ? scoped : achievements.slice(0, 3);
  }, [achievements, selected]);

  return (
    <AppShell active="레이아웃">
      <section className="page-section">
        <div className="portfolio-toolbar">
          <h1>레이아웃</h1>
          <HeaderSearch onChange={setQuery} placeholder="레이아웃 검색" value={query} />
          <div className="tabs compact inline-tabs">
            {categories.map((category) => (
              <button className={activeCategory === category ? "pill active" : "pill"} key={category} onClick={() => setActiveCategory(category)} type="button">
                {category}
              </button>
            ))}
          </div>
          <div className="toolbar-right">
            <Button>CSS 수정</Button>
            <Button variant="primary">올리기</Button>
          </div>
        </div>

        <div className="theme-board">
          {visibleLayouts.map((layout) => (
            <button
              className="theme-tile"
              key={layout.id}
              onClick={() => setPreviewId(layout.id)}
              type="button"
            >
              <div className={layout.display.includes("아이콘") ? "theme-sample icon-sample" : "theme-sample"}>
                <span>{layout.section}</span>
                <div />
                <div />
                <div />
              </div>
              <div>
                <h3>{layout.name}</h3>
                <p>{layout.section} · {layout.display}</p>
                <div className="tags">{layout.fields.slice(0, 3).map((field) => <Tag key={field}>{field}</Tag>)}</div>
              </div>
            </button>
          ))}
          {!visibleLayouts.length ? <div className="empty-state">검색 결과 없음</div> : null}
        </div>

        {previewId && selected ? (
          <Modal
            actions={(
              <Button onClick={() => setPreviewId(null)}>닫기</Button>
            )}
            className="layout-preview-modal"
          >
            <div className="compact-head">
              <h2>{selected.name}</h2>
              <span>{selected.section} · {selected.display}</span>
            </div>
            <div className={isIconPreview ? "layout-achievement-preview app-mode" : "layout-achievement-preview"}>
              {previewItems.map((achievement) => (
                <Link className="layout-preview-item" href={`/achievements/${achievement.type}/${achievement.id}`} key={achievement.id}>
                  <div className="layout-preview-mark">{achievement.mark}</div>
                  <strong>{achievement.name}</strong>
                  {!isIconPreview ? (
                    <div>
                      <p>{achievement.details[0]}</p>
                      <div className="tags">{achievement.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          </Modal>
        ) : null}
      </section>
    </AppShell>
  );
}
