"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import { Achievement, Goal, GoalTodo } from "@/lib/mockApi";
import { AchievementEditModal } from "../components/AchievementEditModal";
import { StatusDropdown } from "../components/StatusDropdown";

type CompletionDraft = {
  achievement: Achievement;
  sections: { body: string; id: string; tags: string[]; title: string }[];
  todos: GoalTodo[];
};

export function GoalsList({
  activeStatus,
  achievements = [],
  goals,
  query,
}: {
  activeStatus: string;
  achievements?: Achievement[];
  goals: Goal[];
  query: string;
}) {
  const listItems = useMemo(() => [
    ...goals,
    ...achievements.map(achievementToGoal),
  ], [achievements, goals]);
  const [visibleGoalIds, setVisibleGoalIds] = useState<string[]>(listItems.map((goal) => goal.id));
  const [openGoalId, setOpenGoalId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [completionDraft, setCompletionDraft] = useState<CompletionDraft | null>(null);
  const [statusMenuGoalId, setStatusMenuGoalId] = useState<string | null>(null);
  const [typeMenuGoalId, setTypeMenuGoalId] = useState<string | null>(null);
  const [dueMenuGoalId, setDueMenuGoalId] = useState<string | null>(null);
  const [tagInputGoalId, setTagInputGoalId] = useState<string | null>(null);
  const [addingChildTodoId, setAddingChildTodoId] = useState<string | null>(null);
  const [addingRootTodoGoalId, setAddingRootTodoGoalId] = useState<string | null>(null);
  const [goalTags, setGoalTags] = useState<Record<string, string[]>>(
    Object.fromEntries(listItems.map((goal) => [goal.id, goal.tags])),
  );
  const [goalTypes, setGoalTypes] = useState<Record<string, string>>(
    Object.fromEntries(listItems.map((goal) => [goal.id, goal.type])),
  );
  const [goalDueDates, setGoalDueDates] = useState<Record<string, string>>(
    Object.fromEntries(listItems.map((goal) => [goal.id, goal.due])),
  );
  const [goalStatuses, setGoalStatuses] = useState<Record<string, string>>(
    Object.fromEntries(listItems.map((goal) => [goal.id, goal.status])),
  );
  const [goalNames, setGoalNames] = useState<Record<string, string>>(
    Object.fromEntries(listItems.map((goal) => [goal.id, goal.name])),
  );
  const [goalTodos, setGoalTodos] = useState<Record<string, GoalTodo[]>>(
    Object.fromEntries(listItems.map((goal) => [goal.id, goal.todos])),
  );

  const addTag = (goalId: string, value: string) => {
    const tag = value.trim().replace(/^#/, "");
    if (!tag) {
      setTagInputGoalId(null);
      return;
    }

    setGoalTags((current) => {
      const tags = current[goalId] ?? [];
      return tags.includes(tag) ? current : { ...current, [goalId]: [...tags, tag] };
    });
    setTagInputGoalId(null);
  };

  const removeTag = (goalId: string, tag: string) => {
    setGoalTags((current) => ({
      ...current,
      [goalId]: (current[goalId] ?? []).filter((item) => item !== tag),
    }));
  };

  const updateGoalName = (goalId: string, value: string) => {
    const name = value.trim();
    if (name) {
      setGoalNames((current) => ({ ...current, [goalId]: name }));
    }
    setEditingGoalId(null);
  };

  useEffect(() => {
    const closeMenus = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(".status-cell, .type-cell, .due-cell")) return;

      setStatusMenuGoalId(null);
      setTypeMenuGoalId(null);
      setDueMenuGoalId(null);
    };

    document.addEventListener("pointerdown", closeMenus);
    return () => document.removeEventListener("pointerdown", closeMenus);
  }, []);

  return (
    <>
      <div className="table-card goal-list">
        <div className="table-row table-head">
          <span>이름</span><span>타입</span><span>태그</span><span>목표일</span>
        </div>
        {listItems.filter((goal) => {
          if (!visibleGoalIds.includes(goal.id)) return false;
          const currentStatus = goalStatuses[goal.id] ?? goal.status;
          const currentName = goalNames[goal.id] ?? goal.name;
          const currentTags = goalTags[goal.id] ?? [];
          const normalizedQuery = query.trim().toLowerCase();
          const matchesStatus = activeStatus === "모두보기" || normalizeGoalStatus(currentStatus) === activeStatus;
          const matchesQuery = !normalizedQuery || currentName.toLowerCase().includes(normalizedQuery) || currentTags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
          return matchesStatus && matchesQuery;
        }).map((goal) => {
          const isOpen = openGoalId === goal.id;
          const todos = goalTodos[goal.id] ?? [];
          const hasTodos = todos.length > 0;
          const progress = getTodoProgress(todos);
          const currentType = goalTypes[goal.id] ?? goal.type;
          const currentDue = goalDueDates[goal.id] ?? "";
          const currentStatus = goalStatuses[goal.id] ?? goal.status;
          const currentStatusLabel = normalizeGoalStatus(currentStatus);
          const currentName = goalNames[goal.id] ?? goal.name;
          const currentTags = goalTags[goal.id] ?? [];
          const currentGoal = { ...goal, due: currentDue, name: currentName, status: currentStatus, tags: currentTags, todos, type: currentType };
          const selectStatus = (nextStatus: string) => {
            setGoalStatuses((current) => ({ ...current, [goal.id]: nextStatus }));
            if (normalizeGoalStatus(nextStatus) === "성취") {
              setCompletionDraft(buildCompletionDraft({ ...currentGoal, status: "성취" }));
            }
          };
          const toggleTodo = (todoId: string, done: boolean) => {
            setGoalTodos((current) => ({
              ...current,
              [goal.id]: updateTodoDone(current[goal.id] ?? [], todoId, done),
            }));
          };
          const addTodo = (parentId: string | null, title: string) => {
            const nextTitle = title.trim();
            if (!nextTitle) return;

            setGoalTodos((current) => ({
              ...current,
              [goal.id]: addTodoItem(current[goal.id] ?? [], parentId, {
                done: false,
                id: `todo-${Date.now()}`,
                title: nextTitle,
              }),
            }));
            setAddingChildTodoId(null);
            setAddingRootTodoGoalId(null);
          };
          const deleteTodo = (todoId: string) => {
            setGoalTodos((current) => ({
              ...current,
              [goal.id]: removeTodoItem(current[goal.id] ?? [], todoId),
            }));
          };

          return (
            <article className={isOpen ? "goal-item open" : "goal-item"} key={goal.id}>
              <div className="table-row goal-summary">
                <span className="goal-title-cell">
                  {hasTodos ? (
                    <span className="progress-disclosure">
                      <span
                        aria-label={`${currentName} 진행률 ${progress}%`}
                        className="progress-dot"
                        style={{ "--progress": `${progress}%` } as CSSProperties}
                      />
                      <button
                        aria-expanded={isOpen}
                        aria-label={`${currentName} 하위 할 일`}
                        className="disclosure-button"
                        onClick={() => setOpenGoalId(isOpen ? null : goal.id)}
                        type="button"
                      >
                        ▸
                      </button>
                    </span>
                  ) : <span className="disclosure-spacer" />}
                  {editingGoalId === goal.id ? (
                    <input
                      autoFocus
                      className="goal-title-input"
                      defaultValue={currentName}
                      onBlur={(event) => updateGoalName(goal.id, event.currentTarget.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          updateGoalName(goal.id, event.currentTarget.value);
                        }
                        if (event.key === "Escape") {
                          setEditingGoalId(null);
                        }
                      }}
                    />
                  ) : (
                    <strong className="goal-title-text">{currentName}</strong>
                  )}
                  <StatusDropdown
                    active={currentStatusLabel === "진행중"}
                    id={goal.id}
                    isOpen={statusMenuGoalId === goal.id}
                    onOpenChange={setStatusMenuGoalId}
                    onSelect={selectStatus}
                    options={["진행중", "성취", "하고싶은일"]}
                    value={currentStatusLabel}
                  >
                    <button
                      className="danger-menu-item"
                      onClick={() => {
                        setVisibleGoalIds((current) => current.filter((id) => id !== goal.id));
                        setStatusMenuGoalId(null);
                      }}
                      type="button"
                    >
                      삭제
                    </button>
                  </StatusDropdown>
                  <button className="edit-link-button" onClick={() => setEditingGoalId(editingGoalId === goal.id ? null : goal.id)} type="button">
                    {editingGoalId === goal.id ? "완료" : "편집"}
                  </button>
                  <button
                    aria-label={`${goal.name} 할 일 추가`}
                    className="edit-link-button add-todo-link"
                    onClick={() => {
                      setOpenGoalId(goal.id);
                      setAddingRootTodoGoalId(goal.id);
                    }}
                    type="button"
                  >
                    +
                  </button>
                </span>
                <span className="type-cell">
                  <button
                    className="type-trigger"
                    onClick={() => setTypeMenuGoalId(typeMenuGoalId === goal.id ? null : goal.id)}
                    type="button"
                  >
                    {currentType}
                  </button>
                  {typeMenuGoalId === goal.id ? (
                    <div className="status-menu type-menu">
                      {["프로젝트", "대회 / 수상", "자격 / 인증", "운동 / 도전", "독서", "영화", "게임", "문화생활", "지역 방문", "여행", "기타"].map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setGoalTypes((current) => ({ ...current, [goal.id]: type }));
                            setTypeMenuGoalId(null);
                          }}
                          type="button"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </span>
                <span className="tag-cell">
                  {tagInputGoalId === goal.id ? (
                    <input
                      autoFocus
                      className="tag-inline-input"
                      onBlur={(event) => addTag(goal.id, event.currentTarget.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addTag(goal.id, event.currentTarget.value);
                        }
                        if (event.key === "Escape") {
                          setTagInputGoalId(null);
                        }
                      }}
                      placeholder="#태그"
                    />
                  ) : (
                    <button className="tag-add-button" onClick={() => setTagInputGoalId(goal.id)} type="button">+</button>
                  )}
                  <span className="tags">
                    {currentTags.map((tag) => (
                      <span className="removable-tag" key={tag}>
                        <button aria-label={`${tag} 제거`} onClick={() => removeTag(goal.id, tag)} type="button" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </span>
                </span>
                <span className="due-cell">
                  <button className={currentDue ? "due-trigger" : "due-trigger empty"} onClick={() => setDueMenuGoalId(dueMenuGoalId === goal.id ? null : goal.id)} type="button">
                    {currentDue || "없음"}
                  </button>
                  {dueMenuGoalId === goal.id ? (
                    <div className="status-menu due-menu">
                      <input
                        defaultValue={currentDue}
                        onChange={(event) => setGoalDueDates((current) => ({ ...current, [goal.id]: event.target.value }))}
                        placeholder="YYYY.MM.DD"
                      />
                      <button
                        onClick={() => {
                          setGoalDueDates((current) => ({ ...current, [goal.id]: "" }));
                          setDueMenuGoalId(null);
                        }}
                        type="button"
                      >
                        목표일 제거
                      </button>
                    </div>
                  ) : null}
                </span>
              </div>

              {isOpen ? (
                <div className="goal-detail-row">
                  <div className="subtask-list">
                    {hasTodos ? todos.map((todo) => (
                      <TodoNode
                        addingChildTodoId={addingChildTodoId}
                        key={todo.id}
                        onAdd={addTodo}
                        onDelete={deleteTodo}
                        onSetAddingChild={setAddingChildTodoId}
                        onToggle={toggleTodo}
                        todo={todo}
                      />
                    )) : null}
                    {addingRootTodoGoalId === goal.id ? (
                      <TodoInputRow
                        onAdd={(title) => addTodo(null, title)}
                        onCancel={() => setAddingRootTodoGoalId(null)}
                        placeholder="새 할 일 입력"
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}

            </article>
          );
        })}
      </div>

      {completionDraft ? (
        <AchievementEditModal
          achievement={completionDraft.achievement}
          descriptionSections={completionDraft.sections}
          onClose={() => setCompletionDraft(null)}
          sourceTodos={completionDraft.todos}
        />
      ) : null}
    </>
  );
}

function buildCompletionDraft(goal: Goal): CompletionDraft {
  const achievement: Achievement = {
    achievedAt: formatToday(),
    area: "온라인",
    details: [
      `기간: ${goal.achievementDraft.period}`,
      `역할: ${goal.achievementDraft.role}`,
      `기술: ${goal.achievementDraft.tech}`,
      `결과: ${goal.achievementDraft.result}`,
    ],
    id: `ach-${goal.id}`,
    mark: goal.name.slice(0, 2).toUpperCase(),
    name: goal.achievementDraft.projectName || goal.name,
    status: "성취",
    tags: goal.tags,
    type: goal.type === "자유 목표" ? "프로젝트" : goal.type,
  };

  return {
    achievement,
    sections: buildGoalTodoSections(goal),
    todos: goal.todos,
  };
}

function achievementToGoal(achievement: Achievement): Goal {
  return {
    achievementDraft: {
      period: getDetailValue(achievement.details, "기간") || achievement.achievedAt,
      projectName: achievement.name,
      result: achievement.details.join("\n"),
      role: getDetailValue(achievement.details, "역할") || "기록",
      tech: getDetailValue(achievement.details, "기술") || achievement.type,
    },
    due: achievement.achievedAt,
    id: achievement.id,
    name: achievement.name,
    progress: 100,
    status: normalizeAchievementStatus(achievement.status),
    tags: achievement.tags,
    todos: [],
    type: achievement.type,
  };
}

function getDetailValue(details: string[], key: string) {
  return details.find((detail) => detail.startsWith(`${key}:`))?.replace(`${key}:`, "").trim() ?? "";
}

function normalizeAchievementStatus(status: string) {
  if (status === "활성" || status === "달성" || status === "성취한일" || status === "성취한 일") return "성취";
  if (status === "숨김" || status === "진행중" || status === "진행 중" || status === "해야할일" || status === "해야할 일" || status === "목표" || status === "in_progress") return "진행중";
  if (status === "paused" || status === "보류") return "보류";
  if (status === "wishlist" || status === "하고 싶음" || status === "하고싶은 일") return "하고싶은일";

  return status;
}

function buildGoalTodoSections(goal: Goal): CompletionDraft["sections"] {
  const doneTodos = flattenTodos(goal.todos).filter((todo) => todo.done);
  const openTodos = flattenTodos(goal.todos).filter((todo) => !todo.done);
  const sections = [
    {
      body: goal.achievementDraft.result,
      id: "result",
      tags: goal.tags,
      title: "결과",
    },
  ];

  if (doneTodos.length) {
    sections.unshift({
      body: doneTodos.map((todo) => `- ${todo.title}`).join("\n"),
      id: "completed-work",
      tags: goal.tags,
      title: "한 일",
    });
  }

  if (openTodos.length) {
    sections.push({
      body: openTodos.map((todo) => `- ${todo.title}`).join("\n"),
      id: "remaining-work",
      tags: goal.tags,
      title: "남은 일",
    });
  }

  return sections;
}


function normalizeGoalStatus(status: string) {
  if (status === "진행중" || status === "진행 중" || status === "해야할 일" || status === "해야할일" || status === "목표" || status === "in_progress") return "진행중";
  if (status === "paused" || status === "보류") return "보류";
  if (status === "wishlist" || status === "하고 싶음" || status === "하고싶은 일" || status === "하고싶은일") return "하고싶은일";
  if (status === "달성" || status === "성취한 일" || status === "성취한일" || status === "성취") return "성취";

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

function TodoNode({
  addingChildTodoId,
  level = 0,
  onAdd,
  onDelete,
  onSetAddingChild,
  onToggle,
  todo,
}: {
  addingChildTodoId: string | null;
  level?: number;
  onAdd: (parentId: string | null, title: string) => void;
  onDelete: (todoId: string) => void;
  onSetAddingChild: (todoId: string | null) => void;
  onToggle: (todoId: string, done: boolean) => void;
  todo: GoalTodo;
}) {
  const hasIncompleteChildren = todo.children?.some(hasOpenTodo) ?? false;

  return (
    <div className="todo-node">
      <div className="subtask-row" style={{ "--level": level } as CSSProperties}>
        <input
          checked={todo.done}
          disabled={hasIncompleteChildren}
          onChange={(event) => onToggle(todo.id, event.currentTarget.checked)}
          type="checkbox"
        />
        <span className="subtask-title">
          {todo.title}
          <button aria-label={`${todo.title} 하위 할 일 추가`} onClick={() => onSetAddingChild(addingChildTodoId === todo.id ? null : todo.id)} type="button">+</button>
          <button aria-label={`${todo.title} 삭제`} onClick={() => onDelete(todo.id)} type="button">×</button>
        </span>
        <span className="subtask-actions">
          <small>{todo.done ? "완료" : "대기"}</small>
        </span>
      </div>
      {addingChildTodoId === todo.id ? (
        <TodoInputRow
          level={level + 1}
          onAdd={(title) => onAdd(todo.id, title)}
          onCancel={() => onSetAddingChild(null)}
          placeholder="하위 할 일 입력"
        />
      ) : null}
      {todo.children?.map((child) => (
        <TodoNode
          addingChildTodoId={addingChildTodoId}
          key={child.id}
          level={level + 1}
          onAdd={onAdd}
          onDelete={onDelete}
          onSetAddingChild={onSetAddingChild}
          onToggle={onToggle}
          todo={child}
        />
      ))}
    </div>
  );
}

function TodoInputRow({
  level = 0,
  onAdd,
  onCancel,
  placeholder,
}: {
  level?: number;
  onAdd: (title: string) => void;
  onCancel: () => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    setValue("");
  };

  return (
    <div className="subtask-input-row" style={{ "--level": level } as CSSProperties}>
      <input
        autoFocus
        onChange={(event) => setValue(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submit();
          }
          if (event.key === "Escape") {
            onCancel();
          }
        }}
        placeholder={placeholder}
        size={Math.max(value.length + 8, 18)}
        value={value}
      />
      <button onClick={submit} type="button">추가</button>
      <button onClick={onCancel} type="button">삭제</button>
    </div>
  );
}

function updateTodoDone(todos: GoalTodo[], todoId: string, done: boolean): GoalTodo[] {
  return todos.map((todo) => normalizeTodoParents(setTodoDone(todo, todoId, done)));
}

function setTodoDone(todo: GoalTodo, todoId: string, done: boolean): GoalTodo {
  if (todo.id === todoId) {
    return { ...todo, done };
  }

  if (!todo.children?.length) {
    return todo;
  }

  return {
    ...todo,
    children: todo.children.map((child) => setTodoDone(child, todoId, done)),
  };
}

function normalizeTodoParents(todo: GoalTodo): GoalTodo {
  if (!todo.children?.length) {
    return todo;
  }

  const children = todo.children.map(normalizeTodoParents);
  const hasIncompleteChildren = children.some(hasOpenTodo);

  return {
    ...todo,
    children,
    done: hasIncompleteChildren ? false : todo.done,
  };
}

function addTodoItem(todos: GoalTodo[], parentId: string | null, nextTodo: GoalTodo): GoalTodo[] {
  if (!parentId) {
    return [...todos, nextTodo];
  }

  return todos.map((todo) => {
    if (todo.id === parentId) {
      return { ...todo, children: [...(todo.children ?? []), nextTodo] };
    }

    return { ...todo, children: todo.children ? addTodoItem(todo.children, parentId, nextTodo) : todo.children };
  });
}

function removeTodoItem(todos: GoalTodo[], todoId: string): GoalTodo[] {
  return todos
    .filter((todo) => todo.id !== todoId)
    .map((todo) => ({ ...todo, children: todo.children ? removeTodoItem(todo.children, todoId) : todo.children }));
}

function hasOpenTodo(todo: GoalTodo): boolean {
  return !todo.done || Boolean(todo.children?.some(hasOpenTodo));
}

function getTodoProgress(todos: GoalTodo[]): number {
  const flatTodos = flattenTodos(todos);

  if (!flatTodos.length) {
    return 0;
  }

  return Math.round((flatTodos.filter((todo) => todo.done).length / flatTodos.length) * 100);
}

function flattenTodos(todos: GoalTodo[]): GoalTodo[] {
  return todos.flatMap((todo) => [todo, ...flattenTodos(todo.children ?? [])]);
}
