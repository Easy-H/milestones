"use client";

import { useMemo, useState } from "react";
import { Achievement, CollectionMilestone, Portfolio, PortfolioLayout, UserPersona } from "@/lib/mockApi";
import { AchievementEditModal } from "../../../components/AchievementEditModal";
import { AppShell } from "../../../components/AppShell";
import { Modal } from "../../../components/Modal";
import { Button, ButtonLink } from "../../../components/Button";
import { PortfolioSectionConfig, PortfolioView } from "../PortfolioView";

type SectionAlign = "center" | "left" | "right";
type SectionItemLayout = "app-icon" | "card";
type SectionPlacement = "full" | "left" | "right";

export function PortfolioEditor({
  achievements,
  layouts,
  personas,
  portfolio,
}: {
  achievements: (Achievement | CollectionMilestone)[];
  layouts: PortfolioLayout[];
  personas: UserPersona[];
  portfolio: Portfolio;
}) {
  const [editing, setEditing] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<(Achievement | CollectionMilestone) | null>(null);
  const [showEditChrome, setShowEditChrome] = useState(true);
  const [name, setName] = useState(portfolio.name);
  const [displayName, setDisplayName] = useState(portfolio.displayName);
  const [personaId, setPersonaId] = useState(portfolio.personaId);
  const [includeTags, setIncludeTags] = useState<string[]>(portfolio.tags);
  const [layout, setLayout] = useState(portfolio.layout);
  const [sectionDraft, setSectionDraft] = useState("");
  const [sectionContentAlignDraft, setSectionContentAlignDraft] = useState<SectionAlign>("left");
  const [sectionItemLayoutDraft, setSectionItemLayoutDraft] = useState<SectionItemLayout>("card");
  const [sectionLayoutIdDraft, setSectionLayoutIdDraft] = useState("");
  const [sectionPlacementDraft, setSectionPlacementDraft] = useState<SectionPlacement>("full");
  const [sectionTitleAlignDraft, setSectionTitleAlignDraft] = useState<SectionAlign>("left");
  const [sectionTagsDraft, setSectionTagsDraft] = useState<string[]>([]);
  const [sectionTextDraft, setSectionTextDraft] = useState("");
  const [sectionTypeDraft, setSectionTypeDraft] = useState("전체");
  const [sectionEditor, setSectionEditor] = useState<string | null>(null);
  const [newSectionId, setNewSectionId] = useState<string | null>(null);
  const [sections, setSections] = useState<PortfolioSectionConfig[]>(() => {
    const types = Array.from(new Set(achievements.map((achievement) => achievement.type)));
    return types.map((type) => ({ align: "left" as const, id: type, includeTags: [], title: type, type }));
  });
  const ownedTags = useMemo(() => Array.from(new Set(achievements.flatMap((achievement) => achievement.tags))).sort(), [achievements]);
  const ownedTypes = useMemo(() => ["전체", "텍스트", ...Array.from(new Set(achievements.map((achievement) => achievement.type))).sort()], [achievements]);
  const activePersona = personas.find((persona) => persona.id === personaId) ?? personas[0];
  const availableSectionLayouts = useMemo(() => {
    if (sectionTypeDraft === "텍스트") return [];
    if (sectionTypeDraft === "전체") return layouts;

    return layouts.filter((item) => item.section === sectionTypeDraft || item.category === sectionTypeDraft);
  }, [layouts, sectionTypeDraft]);
  const visibleAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      return !includeTags.length || includeTags.some((tag) => achievement.tags.includes(tag));
    });
  }, [achievements, includeTags]);
  const previewSections = useMemo(() => {
    if (!sectionEditor) return sections;

    return sections.map((section) => section.id === sectionEditor ? {
      ...section,
      contentAlign: sectionContentAlignDraft,
      includeTags: sectionTagsDraft,
      itemLayout: sectionItemLayoutDraft,
      layoutId: sectionLayoutIdDraft,
      placement: sectionPlacementDraft,
      text: sectionTextDraft,
      title: sectionDraft.trim() || section.title,
      titleAlign: sectionTitleAlignDraft,
      type: sectionTypeDraft,
    } : section);
  }, [
    sectionContentAlignDraft,
    sectionDraft,
    sectionEditor,
    sectionItemLayoutDraft,
    sectionLayoutIdDraft,
    sectionPlacementDraft,
    sectionTagsDraft,
    sectionTextDraft,
    sectionTitleAlignDraft,
    sectionTypeDraft,
    sections,
  ]);
  const toggleIncludeTag = (tag: string) => {
    setIncludeTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  };
  const openEditor = () => {
    setShowEditChrome(true);
    setEditing(true);
  };
  const showPreview = () => {
    setEditing(false);
    setSectionEditor(null);
    setShowEditChrome(false);
  };
  const openSectionEditor = (type: string) => {
    const section = sections.find((item) => item.id === type);
    setShowEditChrome(true);
    setSectionDraft(section?.title ?? type);
    setSectionContentAlignDraft(section?.contentAlign ?? section?.align ?? "left");
    setSectionItemLayoutDraft(section?.itemLayout ?? "card");
    setSectionLayoutIdDraft(section?.layoutId ?? "");
    setSectionPlacementDraft(section?.placement ?? "full");
    setSectionTitleAlignDraft(section?.titleAlign ?? "left");
    setSectionTypeDraft(section?.type ?? "전체");
    setSectionTagsDraft(section?.includeTags ?? []);
    setSectionTextDraft(section?.text ?? "");
    setSectionEditor(type);
  };
  const saveSection = () => {
    if (sectionEditor && sectionDraft.trim()) {
      setSections((current) => current.map((section) => section.id === sectionEditor ? {
        ...section,
        contentAlign: sectionContentAlignDraft,
        includeTags: sectionTagsDraft,
        itemLayout: sectionItemLayoutDraft,
        layoutId: sectionLayoutIdDraft,
        placement: sectionPlacementDraft,
        text: sectionTextDraft,
        titleAlign: sectionTitleAlignDraft,
        title: sectionDraft.trim(),
        type: sectionTypeDraft,
      } : section));
    }
    setNewSectionId(null);
    setSectionEditor(null);
  };
  const closeSectionEditor = () => {
    if (newSectionId) {
      setSections((current) => current.filter((section) => section.id !== newSectionId));
      setNewSectionId(null);
    }
    setSectionEditor(null);
  };
  const addSection = () => {
    const id = `custom-section-${sections.length + 1}`;
    setSections((current) => [...current, { contentAlign: "left", id, includeTags: [], title: "새 섹션", titleAlign: "left", type: "전체" }]);
    setSectionDraft("새 섹션");
    setSectionContentAlignDraft("left");
    setSectionItemLayoutDraft("card");
    setSectionLayoutIdDraft("");
    setSectionPlacementDraft("full");
    setSectionTitleAlignDraft("left");
    setSectionTypeDraft("전체");
    setSectionTagsDraft([]);
    setSectionTextDraft("");
    setNewSectionId(id);
    setSectionEditor(id);
    setShowEditChrome(true);
  };
  const toggleSectionTag = (tag: string) => {
    setSectionTagsDraft((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  };

  return (
    <AppShell active="모음" contextTitle={name}>
      <section className="page-section public-portfolio portfolio-edit-view">
        <PortfolioView
          achievements={visibleAchievements}
          actions={showEditChrome ? (
            <>
              <ButtonLink href="/portfolio">닫기</ButtonLink>
              <Button onClick={openEditor} type="button">편집</Button>
              <Button onClick={showPreview} type="button">보기 모드</Button>
              <Button onClick={showPreview} type="button" variant="primary">저장</Button>
            </>
          ) : (
            <>
              <ButtonLink href="/portfolio">닫기</ButtonLink>
              <Button onClick={() => setShowEditChrome(true)} type="button" variant="primary">편집</Button>
            </>
          )}
          editControls={showEditChrome ? {
            achievements: (achievement) => (
              <Button
                className="achievement-card-edit"
                onClick={(event) => {
                  event.preventDefault();
                  setEditingAchievement(achievement);
                }}
                type="button"
              >
                편집
              </Button>
            ),
            afterSections: <Button className="section-add-button" onClick={addSection} type="button">+ 섹션</Button>,
            sections: (type) => <Button className="overlay-edit-button section-edit" onClick={() => openSectionEditor(type)} type="button">편집</Button>,
          } : undefined}
          sections={previewSections}
          persona={activePersona}
          portfolioId={portfolio.id}
          title={name}
        />

          {editing ? (
            <Modal
              actions={(
                <>
                  <Button onClick={() => setEditing(false)} type="button">취소</Button>
                  <Button onClick={() => setEditing(false)} type="button" variant="primary">저장</Button>
                </>
              )}
              className="metadata-modal"
            >
              <div className="metadata-form">
                <label>제목<input onChange={(event) => setName(event.target.value)} value={name} /></label>
                <label>식별 이름<input onChange={(event) => setDisplayName(event.target.value)} value={displayName} /></label>
                <div className="metadata-field">
                  <span>페르소나</span>
                  <div className="metadata-choice-picker persona-mode">
                    {personas.map((persona) => (
                      <button
                        className={personaId === persona.id ? "active" : ""}
                        key={persona.id}
                        onClick={() => setPersonaId(persona.id)}
                        type="button"
                      >
                        <strong>{persona.name}</strong>
                        <small>{persona.title}</small>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="metadata-tag-picker">
                  {ownedTags.map((tag) => (
                    <button
                      className={includeTags.includes(tag) ? "active" : ""}
                      key={tag}
                      onClick={() => toggleIncludeTag(tag)}
                      type="button"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                <label>레이아웃<input onChange={(event) => setLayout(event.target.value)} value={layout} /></label>
                <div className="section-choice-list">
                  {layouts.slice(0, 4).map((item) => (
                    <button key={item.id} onClick={() => setLayout(item.name)} type="button">
                      {item.section} · {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </Modal>
          ) : null}
          {sectionEditor ? (
            <Modal
              actions={(
                <>
                  <Button onClick={closeSectionEditor} type="button">취소</Button>
                  <Button onClick={saveSection} type="button" variant="primary">저장</Button>
                </>
              )}
              className="metadata-modal"
            >
              <div className="metadata-form">
                <label>섹션 제목<input autoFocus onChange={(event) => setSectionDraft(event.target.value)} value={sectionDraft} /></label>
                <div className="metadata-field">
                  <span>제목 정렬</span>
                  <AlignmentRadio value={sectionTitleAlignDraft} onChange={setSectionTitleAlignDraft} />
                </div>
                <div className="metadata-field">
                  <span>항목 정렬</span>
                  <AlignmentRadio value={sectionContentAlignDraft} onChange={setSectionContentAlignDraft} />
                </div>
                <div className="metadata-field">
                  <span>섹션 배치</span>
                  <PlacementRadio value={sectionPlacementDraft} onChange={setSectionPlacementDraft} />
                </div>
                {sectionTypeDraft !== "텍스트" ? (
                  <div className="metadata-field">
                    <span>레이아웃</span>
                    <div className="metadata-choice-picker layout-mode">
                      {availableSectionLayouts.map((item) => (
                        <button
                          className={sectionLayoutIdDraft === item.id ? "active" : ""}
                          key={item.id}
                          onClick={() => {
                            setSectionLayoutIdDraft(item.id);
                            setSectionItemLayoutDraft(item.display.includes("아이콘") ? "app-icon" : "card");
                          }}
                          type="button"
                        >
                          <strong>{item.name}</strong>
                          <small>{item.section} · {item.display}</small>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="metadata-field">
                  <span>Milestone 타입</span>
                  <div className="metadata-choice-picker">
                    {ownedTypes.map((type) => (
                      <button
                        className={sectionTypeDraft === type ? "active" : ""}
                        key={type}
                        onClick={() => {
                          setSectionTypeDraft(type);
                          if (type === "텍스트") setSectionTagsDraft([]);
                        }}
                        type="button"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                {sectionTypeDraft === "텍스트" ? (
                  <label>텍스트<textarea onChange={(event) => setSectionTextDraft(event.target.value)} value={sectionTextDraft} /></label>
                ) : (
                  <div className="metadata-field">
                    <span>포함할 Milestone</span>
                    <div className="metadata-choice-picker tag-mode">
                      {ownedTags.map((tag) => (
                        <button
                          className={sectionTagsDraft.includes(tag) ? "active" : ""}
                          key={tag}
                          onClick={() => toggleSectionTag(tag)}
                          type="button"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Modal>
          ) : null}
          {editingAchievement ? <AchievementEditModal achievement={editingAchievement} onClose={() => setEditingAchievement(null)} /> : null}
      </section>
    </AppShell>
  );
}

function AlignmentRadio({
  onChange,
  value,
}: {
  onChange: (value: SectionAlign) => void;
  value: SectionAlign;
}) {
  return (
    <div className="alignment-radio" role="radiogroup">
      <button
        aria-checked={value === "left"}
        className={value === "left" ? "active" : ""}
        onClick={() => onChange("left")}
        role="radio"
        type="button"
      >
        <span className="align-icon align-left" />
        왼쪽
      </button>
      <button
        aria-checked={value === "center"}
        className={value === "center" ? "active" : ""}
        onClick={() => onChange("center")}
        role="radio"
        type="button"
      >
        <span className="align-icon align-center" />
        가운데
      </button>
      <button
        aria-checked={value === "right"}
        className={value === "right" ? "active" : ""}
        onClick={() => onChange("right")}
        role="radio"
        type="button"
      >
        <span className="align-icon align-right" />
        오른쪽
      </button>
    </div>
  );
}

function PlacementRadio({
  onChange,
  value,
}: {
  onChange: (value: SectionPlacement) => void;
  value: SectionPlacement;
}) {
  return (
    <div className="alignment-radio" role="radiogroup">
      <button
        aria-checked={value === "full"}
        className={value === "full" ? "active" : ""}
        onClick={() => onChange("full")}
        role="radio"
        type="button"
      >
        <span className="placement-icon placement-full" />
        전체
      </button>
      <button
        aria-checked={value === "left"}
        className={value === "left" ? "active" : ""}
        onClick={() => onChange("left")}
        role="radio"
        type="button"
      >
        <span className="placement-icon placement-left" />
        왼쪽
      </button>
      <button
        aria-checked={value === "right"}
        className={value === "right" ? "active" : ""}
        onClick={() => onChange("right")}
        role="radio"
        type="button"
      >
        <span className="placement-icon placement-right" />
        오른쪽
      </button>
    </div>
  );
}
