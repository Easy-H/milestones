import { AchievementFormSample } from "@/lib/mockApi";
import { Tag } from "../components/AppShell";
import { Goal } from "@/lib/mockApi";
import { Modal } from "../components/Modal";
import { Button } from "../components/Button";

export function AchievementFormsPreview({
  forms,
  goal,
  onClose,
}: {
  forms: AchievementFormSample[];
  goal: Goal;
  onClose: () => void;
}) {
  const activeForm = getFormForGoal(forms, goal);

  return (
    <Modal
      actions={(
        <>
          <Button onClick={onClose} type="button">취소</Button>
          <Button type="button" variant="primary">달성</Button>
        </>
      )}
      className="completion-panel"
    >
        <div className="completion-grid single">
          <form className="linear-form">
            <div className="form-title-row">
              <span className="status blue">{activeForm.type}</span>
              <input aria-label="성취명" defaultValue={activeForm.title} />
            </div>
            <div className="form-field-grid">
              {activeForm.fields.map((field) => (
                <label key={field.label}>{field.label}<input defaultValue={field.value} /></label>
              ))}
            </div>
            <div className="tag-editor">
              <strong>태그</strong>
              <div className="tags">{activeForm.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
            </div>
            <div className="description-stack">
              <div className="compact-head">
                <strong>설명 섹션</strong>
                <button type="button">+ 섹션</button>
              </div>
              {activeForm.descriptionSections.map((section) => (
                <article className="description-section" key={section.title}>
                  <div className="compact-head">
                    <input aria-label="섹션명" defaultValue={section.title} />
                    <button type="button">태그</button>
                  </div>
                  <div className="tags">{section.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
                  <textarea aria-label={`${section.title} 설명`} defaultValue={section.body} />
                </article>
              ))}
            </div>
            <div className="attachment-row">
              {activeForm.attachments.map((item) => <span key={item}>{item}</span>)}
            </div>
          </form>
        </div>
    </Modal>
  );
}

function getFormForGoal(forms: AchievementFormSample[], goal: Goal) {
  if (goal.type === "지역 방문") {
    return forms.find((form) => form.id === "form-place") ?? forms[0];
  }

  if (goal.type === "취미" || goal.type === "영화" || goal.type === "독서" || goal.type === "게임") {
    return forms.find((form) => form.id === "form-culture") ?? forms[0];
  }

  return forms.find((form) => form.id === "form-project") ?? forms[0];
}
