"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DirectMessageThread } from "@/lib/mockApi";
import { HeaderSearch } from "../components/HeaderSearch";

const filters = ["전체", "읽지 않음", "관심", "보관"];

export function DmClient({ threads }: { threads: DirectMessageThread[] }) {
  const [activeFilter, setActiveFilter] = useState("전체");
  const [activeThreadId, setActiveThreadId] = useState(threads[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleThreads = useMemo(() => {
    return threads.filter((thread) => {
      const matchesFilter =
        activeFilter === "전체" ||
        (activeFilter === "읽지 않음" && thread.unread > 0) ||
        thread.status === activeFilter;
      const matchesQuery = !normalizedQuery ||
        thread.name.toLowerCase().includes(normalizedQuery) ||
        thread.role.toLowerCase().includes(normalizedQuery) ||
        thread.company.toLowerCase().includes(normalizedQuery) ||
        thread.portfolioName.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, normalizedQuery, threads]);
  const activeThread = threads.find((thread) => thread.id === activeThreadId) ?? visibleThreads[0] ?? threads[0];

  return (
    <>
      <div className="portfolio-toolbar dm-toolbar">
        <h1>DM</h1>
        <HeaderSearch onChange={setQuery} placeholder="이름, 회사, 모음 검색" value={query} />
        <div className="toolbar-right">
          <div className="tabs compact-tabs">
            {filters.map((filter) => (
              <button
                className={activeFilter === filter ? "pill active" : "pill"}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dm-workspace">
        <aside className="dm-thread-list">
          {visibleThreads.map((thread) => (
            <button
              className={activeThread?.id === thread.id ? "dm-thread active" : "dm-thread"}
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              type="button"
            >
              <span className="dm-thread-head">
                <strong>{thread.name}</strong>
                <small>{thread.lastAt}</small>
              </span>
              <span>{thread.role} · {thread.company}</span>
              <span className="dm-thread-message">{thread.lastMessage}</span>
              <span className="dm-thread-foot">
                <i>{thread.portfolioName}</i>
                {thread.unread ? <em>{thread.unread}</em> : null}
              </span>
            </button>
          ))}
        </aside>

        {activeThread ? (
          <section className="dm-panel">
            <div className="dm-panel-head">
              <div>
                <h2>{activeThread.name}</h2>
                <span>{activeThread.role} · {activeThread.company}</span>
              </div>
              <div className="dm-panel-actions">
                <button className={activeThread.starred ? "favorite-button active" : "favorite-button"} type="button">
                  {activeThread.starred ? "★" : "☆"}
                </button>
                <Link className="edit-link-button visible" href={`/portfolio/${activeThread.portfolioId}`}>
                  모음
                </Link>
              </div>
            </div>

            <div className="dm-context-card">
              <span>모음</span>
              <strong>{activeThread.portfolioName}</strong>
              <small>{activeThread.status}</small>
            </div>

            <div className="dm-message-list">
              {activeThread.messages.map((message) => (
                <div className={message.sender === "me" ? "dm-message mine" : "dm-message"} key={message.id}>
                  <p>{message.body}</p>
                  <small>{message.sentAt}</small>
                </div>
              ))}
            </div>

            <div className="dm-compose">
              <textarea
                onChange={(event) => setDraft(event.currentTarget.value)}
                placeholder="메시지 입력"
                value={draft}
              />
              <button className="primary" onClick={() => setDraft("")} type="button">보내기</button>
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
