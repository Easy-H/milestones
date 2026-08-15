"use client";

import { CSSProperties, useState } from "react";
import { Achievement, GoalTodo } from "@/lib/mockApi";
import { Button } from "./Button";
import { Modal } from "./Modal";

export function AchievementEditModal({
  achievement,
  availableTags = achievement.tags,
  descriptionSections,
  onClose,
  sourceTodos = [],
}: {
  achievement: Achievement;
  availableTags?: string[];
  descriptionSections?: { body: string; id: string; tags: string[]; title: string }[];
  onClose: () => void;
  sourceTodos?: GoalTodo[];
}) {
  const selectableTags = Array.from(new Set(availableTags.map((tag) => tag.trim()).filter(Boolean)));
  const [sections, setSections] = useState(() => descriptionSections ?? buildDescriptionSections(achievement, selectableTags));
  const [links, setLinks] = useState(() => buildProjectLinks(achievement));
  const [previewHtml, setPreviewHtml] = useState("<iframe src=\"https://www.youtube.com/embed/demo\" />");
  const [showLinks, setShowLinks] = useState(achievement.type === "프로젝트");
  const [showPreview, setShowPreview] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState(achievement.type === "프로젝트" ? "연결" : "설명");
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");
  const currentSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];
  const currentSectionTags = currentSection?.tags ?? [];
  const addSection = () => {
    const nextSection = {
      body: "",
      id: `section-${Date.now()}`,
      tags: [],
      title: "새 섹션",
    };

    setSections((current) => [...current, nextSection]);
    setActiveSectionId(nextSection.id);
  };
  const updateSection = (sectionId: string, values: Partial<{ body: string; title: string }>) => {
    setSections((current) => current.map((section) => section.id === sectionId ? { ...section, ...values } : section));
  };
  const updateSectionTags = (sectionId: string, tag: string) => {
    setSections((current) => current.map((section) => {
      if (section.id !== sectionId) return section;
      const hasTag = section.tags.includes(tag);

      return {
        ...section,
        tags: hasTag ? section.tags.filter((item) => item !== tag) : [...section.tags, tag],
      };
    }));
  };

  return (
    <Modal
      actions={(
        <>
          <Button onClick={onClose} type="button">취소</Button>
          <Button onClick={onClose} type="button" variant="primary">저장</Button>
        </>
      )}
      className="completion-panel"
    >
      <div className="completion-grid single">
        <form className="linear-form">
          <div className="description-tabs editor-tabs">
            {["연결", "설명"].filter((tab) => achievement.type === "프로젝트" || tab === "설명").map((tab) => (
              <button
                className={activeEditorTab === tab ? "active" : ""}
                key={tab}
                onClick={() => setActiveEditorTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          {achievement.type === "프로젝트" && activeEditorTab === "연결" ? (
            <div className="project-extra-stack">
              <div className="project-extra-options">
                <label><input checked={showLinks} onChange={(event) => setShowLinks(event.currentTarget.checked)} type="checkbox" /> 링크</label>
                <label><input checked={showPreview} onChange={(event) => setShowPreview(event.currentTarget.checked)} type="checkbox" /> 미리보기</label>
              </div>

              {showLinks ? (
                <div className="project-link-stack">
                  <div className="compact-head">
                    <button
                      onClick={() => setLinks((current) => [...current, { icon: "", name: "", url: "" }])}
                      type="button"
                    >
                      + 링크
                    </button>
                  </div>
                  {links.map((link, index) => (
                    <div className="project-link-row" key={`${link.name}-${index}`}>
                      <input
                        aria-label="링크 아이콘"
                        defaultValue={link.icon}
                        onChange={(event) => setLinks((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, icon: event.target.value } : item))}
                        placeholder="GH"
                      />
                      <input
                        aria-label="링크 이름"
                        defaultValue={link.name}
                        onChange={(event) => setLinks((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))}
                        placeholder="GitHub"
                      />
                      <input
                        aria-label="링크 주소"
                        defaultValue={link.url}
                        onChange={(event) => setLinks((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item))}
                        placeholder="https://"
                      />
                      <button onClick={() => setLinks((current) => current.filter((_, itemIndex) => itemIndex !== index))} type="button">×</button>
                    </div>
                  ))}
                </div>
              ) : null}

              {showPreview ? (
                <div className="project-preview-editor">
                  <textarea
                    aria-label="미리보기 HTML"
                    onChange={(event) => setPreviewHtml(event.target.value)}
                    placeholder="<iframe ... />"
                    value={previewHtml}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {activeEditorTab === "설명" ? <div className="description-stack">
            {sourceTodos.length ? (
              <div className="completion-todo-preview">
                <div className="compact-head">
                  <strong>할 일</strong>
                </div>
                <CompletionTodoTree todos={sourceTodos} />
              </div>
            ) : null}
            <div className="description-tabs">
              {sections.map((section) => (
                <button
                  className={section.id === currentSection.id ? "active" : ""}
                  key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  type="button"
                >
                  {section.title || "이름 없음"}
                </button>
              ))}
              <button className="add-tab-button" onClick={addSection} type="button">+ 섹션</button>
            </div>
            {currentSection ? (
              <article className="description-section">
                <div className="compact-head">
                  <input
                    aria-label="섹션명"
                    onChange={(event) => updateSection(currentSection.id, { title: event.target.value })}
                    value={currentSection.title}
                  />
                  <div className="section-tag-picker">
                    {selectableTags.map((tag) => (
                      <button
                        aria-pressed={currentSectionTags.includes(tag)}
                        className={currentSectionTags.includes(tag) ? "active" : ""}
                        key={tag}
                        onClick={(event) => {
                          event.preventDefault();
                          updateSectionTags(currentSection.id, tag);
                        }}
                        type="button"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  aria-label={`${currentSection.title} 설명`}
                  onChange={(event) => updateSection(currentSection.id, { body: event.target.value })}
                  value={currentSection.body}
                />
              </article>
            ) : null}
          </div> : null}
        </form>
      </div>
    </Modal>
  );
}

function CompletionTodoTree({ todos, level = 0 }: { todos: GoalTodo[]; level?: number }) {
  return (
    <div className="completion-todo-tree">
      {todos.map((todo) => (
        <div className="completion-todo-node" key={todo.id}>
          <div className="completion-todo-row" style={{ "--level": level } as CSSProperties}>
            <span className={todo.done ? "done" : ""}>{todo.done ? "✓" : "○"}</span>
            <span>{todo.title}</span>
          </div>
          {todo.children?.length ? <CompletionTodoTree level={level + 1} todos={todo.children} /> : null}
        </div>
      ))}
    </div>
  );
}

function buildProjectLinks(achievement: Achievement) {
  if (achievement.type !== "프로젝트") {
    return [];
  }

  return [
    { icon: "GH", name: "GitHub", url: "github.com/easyh/studymate" },
    { icon: "▶", name: "Demo", url: achievement.details.find((detail) => detail.startsWith("링크"))?.replace("링크:", "").trim() ?? "" },
  ];
}

function buildDescriptionSections(achievement: Achievement, availableTags: string[]) {
  if (achievement.type === "프로젝트") {
    return [
      {
        id: "problem",
        title: "문제 정의",
        tags: availableTags.slice(0, 2),
        body: "사용자 문제, 목표, 제약 조건을 정리한다.",
      },
      {
        id: "implementation",
        title: "구현",
        tags: availableTags,
        body: "역할, 기술 선택, 구현 범위, 협업 방식을 기록한다.",
      },
      {
        id: "result",
        title: "결과",
        tags: availableTags.slice(0, 1),
        body: "성과 지표와 링크를 기록한다.",
      },
    ];
  }

  return [
    {
      id: "note",
      title: "기록",
      tags: availableTags,
      body: achievement.details.join("\n"),
    },
  ];
}
