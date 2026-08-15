export type Goal = {
  id: string;
  name: string;
  type: string;
  tags: string[];
  progress: number;
  due: string;
  status: string;
  todos: GoalTodo[];
  achievementDraft: {
    projectName: string;
    period: string;
    role: string;
    tech: string;
    result: string;
  };
};

export type GoalTodo = {
  id: string;
  title: string;
  done: boolean;
  children?: GoalTodo[];
};

export type Achievement = {
  id: string;
  name: string;
  type: string;
  achievedAt: string;
  status: string;
  tags: string[];
  area: string;
  mark: string;
  details: string[];
};

export type Portfolio = {
  id: string;
  name: string;
  displayName: string;
  personaId: string;
  visibility: string;
  layout: string;
  achievementCount: number;
  tags: string[];
  area: string;
  updatedAt: string;
};

export type PublicProfile = {
  id: string;
  name: string;
  role: string;
  area: string;
  tags: string[];
  stats: string;
  portfolioId: string;
  lastActive: string;
};

export type DirectMessageThread = {
  id: string;
  profileId: string;
  name: string;
  role: string;
  portfolioName: string;
  portfolioId: string;
  company: string;
  status: string;
  starred: boolean;
  unread: number;
  lastMessage: string;
  lastAt: string;
  messages: {
    id: string;
    sender: "me" | "them";
    body: string;
    sentAt: string;
  }[];
};

export type MyProfile = {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatarInitials: string;
  bio: string;
  area: string;
  email: string;
  website: string;
  onlineAvailable: boolean;
  publicScope: string;
  tags: string[];
  interests: string[];
  personas: UserPersona[];
  notificationSettings: {
    dm: boolean;
    star: boolean;
    portfolioView: boolean;
  };
};

export type UserPersona = {
  id: string;
  name: string;
  title: string;
  bio: string;
  tags: string[];
  defaultPortfolioId: string;
};

export type PortfolioLayout = {
  id: string;
  name: string;
  maker: string;
  uses: string;
  likes: string;
  category: string;
  section: string;
  display: string;
  fields: string[];
};

export type AchievementFormSample = {
  id: string;
  type: string;
  title: string;
  fields: { label: string; value: string }[];
  tags: string[];
  descriptionSections: { title: string; tags: string[]; body: string }[];
  attachments: string[];
};

const goals: Goal[] = [
  {
    id: "goal-studymate",
    name: "StudyMate 출시",
    type: "프로젝트",
    tags: ["React", "Frontend", "AI"],
    progress: 72,
    due: "2026.09.15",
    status: "목표",
    todos: [
      {
        id: "todo-planning",
        title: "서비스 기획",
        done: true,
        children: [
          { id: "todo-planning-persona", title: "사용자 시나리오 정리", done: true },
          { id: "todo-planning-scope", title: "MVP 범위 확정", done: true },
        ],
      },
      {
        id: "todo-design",
        title: "UI 디자인",
        done: true,
        children: [
          { id: "todo-design-flow", title: "매칭 플로우", done: true },
          { id: "todo-design-dashboard", title: "대시보드 시안", done: false },
        ],
      },
      {
        id: "todo-frontend",
        title: "프론트엔드 개발",
        done: false,
        children: [
          { id: "todo-frontend-auth", title: "온보딩 화면", done: true },
          { id: "todo-frontend-match", title: "매칭 카드 컴포넌트", done: false },
        ],
      },
      { id: "todo-deploy", title: "배포", done: false },
    ],
    achievementDraft: {
      projectName: "StudyMate 베타 출시",
      period: "2026.06 - 2026.08",
      role: "Frontend",
      tech: "React, TypeScript, Next.js",
      result: "베타 사용자 120명 모집\n학습 매칭 완료율 64%",
    },
  },
  {
    id: "goal-certificate",
    name: "정보처리기사 실기 합격",
    type: "자격 / 인증",
    tags: ["자격증", "CS"],
    progress: 44,
    due: "2026.10.04",
    status: "목표",
    todos: [],
    achievementDraft: {
      projectName: "정보처리기사 취득",
      period: "2026.09 - 2026.10",
      role: "응시자",
      tech: "Database, Network, Software Engineering",
      result: "실기 합격 후 자격 번호 등록",
    },
  },
  {
    id: "goal-jeju",
    name: "제주 동쪽 코스 기록",
    type: "지역 방문",
    tags: ["제주", "사진", "여행"],
    progress: 18,
    due: "2026.11.02",
    status: "하고싶은일",
    todos: [],
    achievementDraft: {
      projectName: "제주 동쪽 코스 기록",
      period: "2026.10 - 2026.11",
      role: "기록",
      tech: "Photo, Map",
      result: "방문 사진과 이동 경로 정리",
    },
  },
  {
    id: "goal-movies",
    name: "SF 영화 30편 감상",
    type: "취미",
    tags: ["영화", "SF"],
    progress: 60,
    due: "2026.12.31",
    status: "목표",
    todos: [],
    achievementDraft: {
      projectName: "SF 영화 30편 감상",
      period: "2026.01 - 2026.12",
      role: "기록",
      tech: "Movie Log",
      result: "감상 기록과 평점 아카이브",
    },
  },
];

const myProfile: MyProfile = {
  id: "me-easyh",
  name: "이지현",
  handle: "easyh",
  role: "Frontend Developer",
  avatarInitials: "EH",
  bio: "프론트엔드 제품 경험과 개인 성취 기록을 포트폴리오로 연결한다.",
  area: "서울",
  email: "easyh@example.com",
  website: "easyh.dev",
  onlineAvailable: true,
  publicScope: "전체 공개",
  tags: ["React", "TypeScript", "Frontend", "AI", "Fintech"],
  interests: ["사이드프로젝트", "채용 제안", "오픈소스"],
  personas: [
    {
      id: "persona-career",
      name: "프론트엔드 지원자",
      title: "Frontend Developer",
      bio: "제품 경험, 구현 범위, 성과 지표를 중심으로 성취를 보여준다.",
      tags: ["React", "TypeScript", "Frontend", "Fintech"],
      defaultPortfolioId: "portfolio-toss",
    },
    {
      id: "persona-club",
      name: "러닝 모임 멤버",
      title: "Running Crew",
      bio: "운동 기록과 꾸준함을 모임 활동 맥락으로 정리한다.",
      tags: ["러닝", "서울", "운동"],
      defaultPortfolioId: "portfolio-running",
    },
    {
      id: "persona-archive",
      name: "문화 기록자",
      title: "Culture Archive",
      bio: "영화, 독서, 여행 성취를 취향과 기록 중심으로 묶는다.",
      tags: ["영화", "독서", "여행", "사진"],
      defaultPortfolioId: "portfolio-movie",
    },
  ],
  notificationSettings: {
    dm: true,
    portfolioView: false,
    star: true,
  },
};

const achievements: Achievement[] = [
  {
    id: "ach-studymate",
    name: "StudyMate 베타 출시",
    type: "프로젝트",
    achievedAt: "2026.08.14",
    status: "성취",
    tags: ["React", "Frontend", "사이드프로젝트"],
    area: "온라인",
    mark: "SM",
    details: ["기간: 2026.06 - 2026.08", "역할: Frontend", "기술: React, TypeScript, Next.js", "결과: 베타 사용자 120명", "링크: studymate.app", "이미지: 4"],
  },
  {
    id: "ach-running",
    name: "서울 러닝 10K 완주",
    type: "운동 / 도전",
    achievedAt: "2026.07.21",
    status: "성취",
    tags: ["러닝", "서울"],
    area: "서울",
    mark: "10K",
    details: ["기간: 2026.07", "기록: 57분 12초", "지역: 서울", "사진: 3"],
  },
  {
    id: "ach-award",
    name: "UX 개선 공모전 우수상",
    type: "대회 / 수상",
    achievedAt: "2026.06.11",
    status: "성취",
    tags: ["UX", "Fintech", "기획"],
    area: "경기",
    mark: "AW",
    details: ["대회명: UX 개선 공모전", "주최 기관: Fintech Lab", "수상 결과: 우수상", "증빙: 상장 PDF"],
  },
  {
    id: "ach-book",
    name: "클린 코드 완독",
    type: "취미",
    achievedAt: "2026.05.18",
    status: "성취",
    tags: ["독서", "개발"],
    area: "온라인",
    mark: "BK",
    details: ["책: 클린 코드", "저자: Robert C. Martin", "완독일: 2026.05.18", "평점: 4.5"],
  },
  {
    id: "ach-game",
    name: "인디 게임 프로토타입 공개",
    type: "취미",
    achievedAt: "2026.04.22",
    status: "성취",
    tags: ["게임", "Unity", "Prototype"],
    area: "온라인",
    mark: "GM",
    details: ["엔진: Unity", "장르: Puzzle", "공개일: 2026.04.22", "피드백: 38건"],
  },
  {
    id: "ach-movie-dune",
    name: "듄: 파트 2 관람 기록",
    type: "취미",
    achievedAt: "2026.08.04",
    status: "성취",
    tags: ["영화", "SF", "문화생활"],
    area: "서울",
    mark: "DV",
    details: ["작품: 듄: 파트 2", "장르: SF", "관람일: 2026.08.04", "평점: 4.5", "기록: 세계관, 음악, 미장센"],
  },
  {
    id: "ach-jeju-east",
    name: "제주 동쪽 코스 기록",
    type: "지역 방문",
    achievedAt: "2026.08.09",
    status: "성취",
    tags: ["제주", "여행", "사진"],
    area: "제주",
    mark: "JJ",
    details: ["지역: 제주 구좌읍", "방문 날짜: 2026.08.09", "사진: 18장", "기록: 세화 - 월정 - 평대"],
  },
  {
    id: "ach-certificate-sql",
    name: "SQLD 자격 취득",
    type: "자격 / 인증",
    achievedAt: "2026.03.29",
    status: "목표",
    tags: ["자격증", "Database", "SQL"],
    area: "온라인",
    mark: "SQL",
    details: ["자격: SQLD", "발급 기관: 한국데이터산업진흥원", "취득일: 2026.03.29", "증빙: 자격 확인서"],
  },
  {
    id: "ach-open-source",
    name: "오픈소스 PR 12건 병합",
    type: "프로젝트",
    achievedAt: "2026.02.16",
    status: "성취",
    tags: ["OpenSource", "TypeScript", "문서화"],
    area: "온라인",
    mark: "OS",
    details: ["기간: 2026.01 - 2026.02", "역할: Contributor", "기술: TypeScript, Docs", "결과: PR 12건 병합", "링크: github.com/easyh"],
  },
];

const portfolios: Portfolio[] = [
  { id: "portfolio-default", name: "기본 포트폴리오", displayName: "이지현", personaId: "persona-career", visibility: "전체 공개", layout: "Developer", achievementCount: 12, tags: ["React", "AI"], area: "서울", updatedAt: "2026.08.12" },
  { id: "portfolio-toss", name: "토스 지원용", displayName: "이지현", personaId: "persona-career", visibility: "링크 공개", layout: "Resume", achievementCount: 7, tags: ["Frontend", "Fintech"], area: "서울", updatedAt: "2026.08.10" },
  { id: "portfolio-team", name: "사이드 프로젝트 팀원 모집", displayName: "Hana Lee", personaId: "persona-career", visibility: "전체 공개", layout: "Project Focus", achievementCount: 9, tags: ["협업", "MVP"], area: "온라인", updatedAt: "2026.08.03" },
  { id: "portfolio-running", name: "러닝 모임 활동", displayName: "이지현", personaId: "persona-club", visibility: "전체 공개", layout: "Timeline", achievementCount: 5, tags: ["러닝", "서울", "운동"], area: "서울", updatedAt: "2026.08.06" },
  { id: "portfolio-movie", name: "영화 기록", displayName: "easyh.archive", personaId: "persona-archive", visibility: "비공개", layout: "Visual Grid", achievementCount: 26, tags: ["영화", "SF"], area: "온라인", updatedAt: "2026.07.28" },
  { id: "portfolio-game", name: "게임 기록", displayName: "easyh.play", personaId: "persona-archive", visibility: "비공개", layout: "Project Focus", achievementCount: 4, tags: ["게임"], area: "온라인", updatedAt: "2026.07.18" },
];

const publicProfiles: PublicProfile[] = [
  {
    id: "profile-minseo",
    name: "김민서",
    role: "Frontend Developer",
    area: "서울",
    tags: ["React", "TypeScript", "Fintech"],
    stats: "프로젝트 8 · 수상 2 · 자격 1",
    portfolioId: "portfolio-toss",
    lastActive: "2026.08.12",
  },
  {
    id: "profile-hajun",
    name: "이하준",
    role: "Product Designer",
    area: "부산",
    tags: ["UX", "Design System", "Mobile"],
    stats: "프로젝트 6 · 수상 1 · 활동 4",
    portfolioId: "portfolio-team",
    lastActive: "2026.08.09",
  },
  {
    id: "profile-seoyeon",
    name: "박서연",
    role: "Creator",
    area: "제주",
    tags: ["Travel", "Photo", "Writing"],
    stats: "여행 18 · 독서 12 · 영화 31",
    portfolioId: "portfolio-movie",
    lastActive: "2026.08.01",
  },
];

const dmThreads: DirectMessageThread[] = [
  {
    id: "dm-minseo",
    profileId: "profile-minseo",
    name: "김민서",
    role: "Frontend Developer",
    portfolioName: "토스 지원용",
    portfolioId: "portfolio-toss",
    company: "Wave Labs",
    status: "대화중",
    starred: true,
    unread: 2,
    lastMessage: "포트폴리오의 결제 플로우 프로젝트를 더 보고 싶습니다.",
    lastAt: "10:42",
    messages: [
      { id: "msg-1", sender: "them", body: "안녕하세요. 토스 지원용 포트폴리오를 보고 연락드립니다.", sentAt: "10:31" },
      { id: "msg-2", sender: "them", body: "결제 플로우 프로젝트에서 맡은 범위와 성과를 조금 더 확인할 수 있을까요?", sentAt: "10:42" },
    ],
  },
  {
    id: "dm-hajun",
    profileId: "profile-hajun",
    name: "이하준",
    role: "Product Designer",
    portfolioName: "사이드 프로젝트 팀원 모집",
    portfolioId: "portfolio-team",
    company: "Side Sprint",
    status: "관심",
    starred: false,
    unread: 0,
    lastMessage: "팀 모집 포트폴리오에 관심을 남겼습니다.",
    lastAt: "어제",
    messages: [
      { id: "msg-3", sender: "them", body: "팀 모집 포트폴리오에 관심을 남겼습니다.", sentAt: "어제" },
      { id: "msg-4", sender: "me", body: "확인했습니다. 프로젝트 일정 공유드릴게요.", sentAt: "어제" },
    ],
  },
  {
    id: "dm-seoyeon",
    profileId: "profile-seoyeon",
    name: "박서연",
    role: "Creator",
    portfolioName: "영화 기록",
    portfolioId: "portfolio-movie",
    company: "Archive Club",
    status: "보관",
    starred: true,
    unread: 0,
    lastMessage: "SF 영화 기록 포트폴리오를 북마크했습니다.",
    lastAt: "08.12",
    messages: [
      { id: "msg-5", sender: "them", body: "SF 영화 기록 포트폴리오를 북마크했습니다.", sentAt: "08.12" },
    ],
  },
];

const layouts: PortfolioLayout[] = [
  { id: "layout-app-icons", name: "App Icon Grid", maker: "김민서", uses: "1,284", likes: "342", category: "프로젝트", section: "프로젝트", display: "앱 아이콘", fields: ["대표 이미지", "프로젝트명", "한 줄 결과", "태그"] },
  { id: "layout-case-study", name: "Case Study Paragraph", maker: "Milestones", uses: "842", likes: "198", category: "프로젝트", section: "프로젝트", display: "문단형", fields: ["문제 정의", "역할", "기술", "결과"] },
  { id: "layout-award-list", name: "Award Compact", maker: "윤지호", uses: "2,103", likes: "511", category: "수상", section: "수상", display: "텍스트 리스트", fields: ["대회명", "주최 기관", "수상 결과", "날짜"] },
  { id: "layout-travel", name: "Place Photo Strip", maker: "오하늘", uses: "420", likes: "87", category: "장소", section: "장소", display: "사진 스트립", fields: ["지역", "방문 날짜", "사진", "기록"] },
  { id: "layout-book-note", name: "Reading Notes", maker: "정유진", uses: "318", likes: "76", category: "취미", section: "취미", display: "기록 카드", fields: ["작품", "저자/제작자", "평점", "기록"] },
  { id: "layout-game-build", name: "Prototype Build", maker: "이도윤", uses: "265", likes: "61", category: "취미", section: "취미", display: "빌드 리스트", fields: ["엔진", "장르", "공개일", "피드백"] },
];

const achievementFormSamples: AchievementFormSample[] = [
  {
    id: "form-project",
    type: "프로젝트",
    title: "StudyMate 베타 출시",
    fields: [
      { label: "기간", value: "2026.06 - 2026.08" },
      { label: "역할", value: "Frontend" },
      { label: "팀 / 개인", value: "팀 3명" },
      { label: "결과 링크", value: "studymate.app" },
      { label: "GitHub", value: "github.com/easyh/studymate" },
      { label: "성과", value: "베타 사용자 120명" },
    ],
    tags: ["React", "TypeScript", "Frontend", "AI", "협업"],
    descriptionSections: [
      {
        title: "문제 정의",
        tags: ["기획", "문제해결"],
        body: "학습 파트너를 찾는 과정에서 목적, 시간대, 관심 기술이 맞지 않아 매칭 이후 이탈이 발생했다.",
      },
      {
        title: "프론트엔드 구현",
        tags: ["React", "TypeScript", "Frontend"],
        body: "목표 입력, 매칭 카드, 진행 상태를 한 화면에서 조작할 수 있도록 컴포넌트를 분리하고 낙관적 상태 업데이트를 적용했다.",
      },
      {
        title: "AI 매칭",
        tags: ["AI", "추천"],
        body: "프로필 태그와 학습 목표를 기반으로 추천 점수를 계산하고 사용자에게 상위 후보를 노출했다.",
      },
    ],
    attachments: ["런칭 화면 4장", "성과 캡처 2장", "배포 링크"],
  },
  {
    id: "form-culture",
    type: "취미",
    title: "듄: 파트 2 관람",
    fields: [
      { label: "작품", value: "듄: 파트 2" },
      { label: "장르", value: "SF" },
      { label: "관람일", value: "2026.08.04" },
      { label: "평점", value: "4.5" },
      { label: "장소", value: "CGV 용산" },
      { label: "기록", value: "세계관, 음악, 미장센" },
    ],
    tags: ["영화", "SF", "문화생활"],
    descriptionSections: [
      {
        title: "감상 기록",
        tags: ["영화", "기록"],
        body: "큰 스케일의 이미지보다 인물의 선택과 균형감이 오래 남았다.",
      },
      {
        title: "포트폴리오 노출",
        tags: ["문화생활"],
        body: "영화 기록 포트폴리오에는 평점과 짧은 감상 위주로 표시한다.",
      },
    ],
    attachments: ["티켓 이미지", "포스터"],
  },
  {
    id: "form-place",
    type: "장소",
    title: "제주 동쪽 코스 기록",
    fields: [
      { label: "지역", value: "제주 구좌읍" },
      { label: "방문 날짜", value: "2026.08.09" },
      { label: "방문 기간", value: "2일" },
      { label: "동행", value: "개인" },
      { label: "사진", value: "18장" },
      { label: "지도", value: "세화 - 월정 - 평대" },
    ],
    tags: ["제주", "여행", "사진"],
    descriptionSections: [
      {
        title: "방문 기록",
        tags: ["여행", "장소"],
        body: "해안도로와 작은 책방을 중심으로 이동했고, 사진 포트폴리오에는 장소별 컷을 묶어 보여준다.",
      },
      {
        title: "지역 메모",
        tags: ["제주", "로컬"],
        body: "오전에는 세화 해변, 오후에는 평대리 카페 구간의 동선이 가장 좋았다.",
      },
    ],
    attachments: ["사진 18장", "이동 경로", "메모 3개"],
  },
];

export async function getGoals() {
  return goals;
}

export async function getMyProfile() {
  return myProfile;
}

export function getPersonaById(id: string) {
  return myProfile.personas.find((persona) => persona.id === id) ?? myProfile.personas[0];
}

export async function getGoalDetail(id = "goal-studymate") {
  return goals.find((goal) => goal.id === id) ?? goals[0];
}

export async function getAchievements() {
  return achievements;
}

export async function getAchievementDetail(id = "ach-studymate") {
  return achievements.find((achievement) => achievement.id === id) ?? achievements[0];
}

export async function getPortfolios() {
  return portfolios;
}

export async function getFeaturedPortfolio() {
  return portfolios[1];
}

export async function getPortfolioDetail(id = "portfolio-toss") {
  return portfolios.find((portfolio) => portfolio.id === id) ?? portfolios[0];
}

export async function getPublicProfiles() {
  return publicProfiles;
}

export async function getDmThreads() {
  return dmThreads;
}

export async function getLayouts() {
  return layouts;
}

export async function getAchievementFormSamples() {
  return achievementFormSamples;
}
