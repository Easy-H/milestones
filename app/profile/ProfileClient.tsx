"use client";

import { useState } from "react";
import { MyProfile } from "@/lib/mockApi";
import { Button } from "../components/Button";

export function ProfileClient({ profile }: { profile: MyProfile }) {
  const [tags, setTags] = useState(profile.tags);
  const [interests, setInterests] = useState(profile.interests);
  const [tagInput, setTagInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [settings, setSettings] = useState(profile.notificationSettings);

  const addItem = (value: string, items: string[], setter: (items: string[]) => void, reset: () => void) => {
    const next = value.trim().replace(/^#/, "");
    if (next && !items.includes(next)) {
      setter([next, ...items]);
    }
    reset();
  };

  return (
    <>
      <div className="portfolio-toolbar">
        <h1>프로필</h1>
        <div className="toolbar-right">
          <Button type="button">미리보기</Button>
          <Button type="button" variant="primary">저장</Button>
        </div>
      </div>

      <div className="profile-settings-grid">
        <section className="profile-preview-card">
          <div className="profile-avatar">{profile.avatarInitials}</div>
          <strong>{profile.name}</strong>
          <span>@{profile.handle}</span>
          <p>{profile.bio}</p>
          <div className="tags">
            {tags.slice(0, 5).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
          </div>
        </section>

        <section className="profile-settings-panel">
          <div className="metadata-form">
            <div className="profile-form-grid">
              <label>이름<input defaultValue={profile.name} /></label>
              <label>식별 이름<input defaultValue={profile.handle} /></label>
              <label>직무<input defaultValue={profile.role} /></label>
              <label>활동 지역<input defaultValue={profile.area} /></label>
              <label>이메일<input defaultValue={profile.email} /></label>
              <label>웹사이트<input defaultValue={profile.website} /></label>
            </div>
            <label>소개<textarea defaultValue={profile.bio} /></label>
            <div className="profile-form-grid">
              <label>공개 범위<select defaultValue={profile.publicScope}>
                <option>전체 공개</option>
                <option>링크 공개</option>
                <option>비공개</option>
              </select></label>
              <label>온라인 활동<select defaultValue={profile.onlineAvailable ? "가능" : "불가"}>
                <option>가능</option>
                <option>불가</option>
              </select></label>
            </div>
          </div>
        </section>

        <section className="profile-settings-panel">
          <div className="profile-section-head">
            <h2>태그</h2>
          </div>
          <InlineTokenEditor
            input={tagInput}
            items={tags}
            onAdd={() => addItem(tagInput, tags, setTags, () => setTagInput(""))}
            onInputChange={setTagInput}
            onRemove={(tag) => setTags((current) => current.filter((item) => item !== tag))}
            placeholder="#태그"
          />
        </section>

        <section className="profile-settings-panel">
          <div className="profile-section-head">
            <h2>관심</h2>
          </div>
          <InlineTokenEditor
            input={interestInput}
            items={interests}
            onAdd={() => addItem(interestInput, interests, setInterests, () => setInterestInput(""))}
            onInputChange={setInterestInput}
            onRemove={(interest) => setInterests((current) => current.filter((item) => item !== interest))}
            placeholder="관심사"
          />
        </section>

        <section className="profile-settings-panel span-wide">
          <div className="profile-section-head">
            <h2>페르소나</h2>
            <button className="edit-link-button visible" type="button">+ 추가</button>
          </div>
          <div className="persona-card-grid">
            {profile.personas.map((persona) => (
              <article className="persona-card" key={persona.id}>
                <div>
                  <strong>{persona.name}</strong>
                  <span>{persona.title}</span>
                </div>
                <p>{persona.bio}</p>
                <div className="tags">
                  {persona.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                </div>
                <small>대표 {persona.defaultPortfolioId.replace("portfolio-", "")}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-settings-panel span-wide">
          <div className="profile-section-head">
            <h2>알림</h2>
          </div>
          <div className="profile-toggle-grid">
            <ToggleRow checked={settings.dm} label="DM" onChange={(checked) => setSettings((current) => ({ ...current, dm: checked }))} />
            <ToggleRow checked={settings.star} label="관심" onChange={(checked) => setSettings((current) => ({ ...current, star: checked }))} />
            <ToggleRow checked={settings.portfolioView} label="모음 조회" onChange={(checked) => setSettings((current) => ({ ...current, portfolioView: checked }))} />
          </div>
        </section>
      </div>
    </>
  );
}

function InlineTokenEditor({
  input,
  items,
  onAdd,
  onInputChange,
  onRemove,
  placeholder,
}: {
  input: string;
  items: string[];
  onAdd: () => void;
  onInputChange: (value: string) => void;
  onRemove: (item: string) => void;
  placeholder: string;
}) {
  return (
    <div className="profile-token-editor">
      <div className="tag-cell">
        <input
          className="tag-inline-input visible"
          onChange={(event) => onInputChange(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
          value={input}
        />
        <button className="tag-add-button" onClick={onAdd} type="button">+</button>
        <span className="tags">
          {items.map((item) => (
            <span className="removable-tag" key={item}>
              <button aria-label={`${item} 제거`} onClick={() => onRemove(item)} type="button" />
              <span>{item}</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

function ToggleRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="profile-toggle-row">
      <span>{label}</span>
      <input checked={checked} onChange={(event) => onChange(event.currentTarget.checked)} type="checkbox" />
    </label>
  );
}
