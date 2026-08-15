"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Achievement, Portfolio, PublicProfile, UserPersona } from "@/lib/mockApi";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { HeaderSearch } from "../components/HeaderSearch";
import { Modal } from "../components/Modal";
import { PortfolioCard } from "./components/PortfolioCard";

const tabs = ["내 포트폴리오", "둘러보기", "관심"];

export function PortfolioClient({
  achievements,
  personas,
  portfolios,
  publicProfiles,
}: {
  achievements: Achievement[];
  personas: UserPersona[];
  portfolios: Portfolio[];
  publicProfiles: PublicProfile[];
}) {
  const [activeTab, setActiveTab] = useState("내 포트폴리오");
  const [dmProfile, setDmProfile] = useState<PublicProfile | null>(null);
  const [query, setQuery] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>(publicProfiles[0] ? [publicProfiles[0].id] : []);
  const normalizedQuery = query.trim().toLowerCase();
  const visiblePortfolios = useMemo(() => {
    return portfolios.filter((portfolio) => {
      if (!normalizedQuery) return true;

      return portfolio.name.toLowerCase().includes(normalizedQuery) ||
        portfolio.displayName.toLowerCase().includes(normalizedQuery) ||
        portfolio.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
    });
  }, [normalizedQuery, portfolios]);
  const visibleProfiles = useMemo(() => {
    return publicProfiles.filter((profile) => {
      const matchesTab = activeTab !== "관심" || savedIds.includes(profile.id);
      const matchesQuery = !normalizedQuery ||
        profile.name.toLowerCase().includes(normalizedQuery) ||
        profile.role.toLowerCase().includes(normalizedQuery) ||
        profile.area.toLowerCase().includes(normalizedQuery) ||
        profile.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesTab && matchesQuery;
    });
  }, [activeTab, normalizedQuery, publicProfiles, savedIds]);

  const toggleSaved = (profileId: string) => {
    setSavedIds((current) => current.includes(profileId) ? current.filter((id) => id !== profileId) : [...current, profileId]);
  };

  return (
    <AppShell active="포트폴리오">
      <section className="page-section">
        <div className="portfolio-toolbar">
          <h1>포트폴리오</h1>
          <HeaderSearch onChange={setQuery} value={query} />
          <div className="toolbar-right">
            <div className="tabs compact-tabs">
              {tabs.map((tab) => (
                <button className={activeTab === tab ? "pill active" : "pill"} key={tab} onClick={() => setActiveTab(tab)} type="button">
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="public-grid wide recruiter-grid portfolio-list-grid">
          {activeTab === "내 포트폴리오" ? visiblePortfolios.map((portfolio) => {
            const includedCount = portfolio.id === "portfolio-default"
              ? achievements.length
              : achievements.filter((achievement) => portfolio.tags.some((tag) => achievement.tags.includes(tag))).length;
            const persona = personas.find((item) => item.id === portfolio.personaId) ?? personas[0];

            return (
              <PortfolioCard
                activity={`활동 ${portfolio.updatedAt}`}
                cornerAction={(
                  <Link
                    className="edit-corner-button"
                    href={`/portfolio/${portfolio.id}/edit`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    편집
                  </Link>
                )}
                href={`/portfolio/${portfolio.id}`}
                key={portfolio.id}
                stat={`${includedCount}개`}
                subtitle={`${persona.name} · ${persona.title}`}
                tags={portfolio.tags.slice(0, 4)}
                title={portfolio.name}
              />
            );
          }) : visibleProfiles.map((profile) => {
            const isSaved = savedIds.includes(profile.id);

            return (
              <PortfolioCard
                active={isSaved}
                activity={`활동 ${profile.lastActive}`}
                cornerAction={(
                  <button
                    aria-label={isSaved ? `${profile.name} 관심 해제` : `${profile.name} 관심`}
                    className={isSaved ? "favorite-button active" : "favorite-button"}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleSaved(profile.id);
                    }}
                    type="button"
                  >
                    {isSaved ? "★" : "☆"}
                  </button>
                )}
                footer={(
                  <button
                    className="dm-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDmProfile(profile);
                    }}
                    type="button"
                  >
                    DM
                  </button>
                )}
                href={`/portfolio/${profile.portfolioId}`}
                key={profile.id}
                stat={profile.stats}
                subtitle={`${profile.role} · ${profile.area}`}
                tags={profile.tags}
                title={profile.name}
              />
            );
          })}
          {activeTab === "내 포트폴리오" ? <button className="public-card portfolio-create-card" type="button">
            <span>+</span>
            <strong>태그 조건 만들기</strong>
          </button> : null}
        </div>
        {dmProfile ? (
          <Modal
            actions={(
              <>
                <Button onClick={() => setDmProfile(null)} type="button">취소</Button>
                <Button onClick={() => setDmProfile(null)} type="button" variant="primary">보내기</Button>
              </>
            )}
            className="metadata-modal"
          >
            <div className="metadata-form dm-form">
              <label>받는 사람<input readOnly value={dmProfile.name} /></label>
              <label>포트폴리오<input readOnly value={dmProfile.role} /></label>
              <label>메시지<textarea defaultValue={`${dmProfile.name}님의 포트폴리오를 보고 연락드립니다.`} /></label>
            </div>
          </Modal>
        ) : null}
      </section>
    </AppShell>
  );
}
