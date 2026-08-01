import React, { useState, useEffect, useRef } from "react";
import { roadmapData } from "./data";
import { apiUrl } from "./api";
import { loadStoredProgress, saveStoredProgress } from "./storage";
import { UserProgress, StoredProgress, PROGRESS_SCHEMA_VERSION, Step, PremiumTeaser } from "./types";
import RoadmapCard from "./components/RoadmapCard";
import StudyBuddy from "./components/StudyBuddy";
import {
  Sparkles, Search, Award, BookMarked,
  CheckCircle2, RefreshCw, ExternalLink, Lock, Download, Upload
} from "lucide-react";

const initialProgress: UserProgress = {
  completedTopicIds: [],
  bookmarkedUrls: [],
  quizScores: {}
};

// Parses and defensively validates a stored/imported progress blob. Accepts
// both legacy blobs (no schemaVersion — treated as version 1) and versioned
// ones. Drops malformed entries instead of crashing. Returns null if the
// blob can't be parsed, isn't shaped like progress data, or was written by
// a newer schema version than this app understands.
function parseStoredProgress(raw: string): UserProgress | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;
  const candidate = parsed as Partial<StoredProgress>;

  // An arbitrary JSON object (e.g. the wrong file picked at import) must not
  // pass validation as "empty progress" — require at least one progress field.
  if (
    candidate.completedTopicIds === undefined &&
    candidate.bookmarkedUrls === undefined &&
    candidate.quizScores === undefined
  ) {
    return null;
  }

  const schemaVersion = typeof candidate.schemaVersion === "number" ? candidate.schemaVersion : 1;
  if (schemaVersion > PROGRESS_SCHEMA_VERSION) {
    console.warn(
      `Stored progress uses schema version ${schemaVersion}, newer than this app's supported version ${PROGRESS_SCHEMA_VERSION}. Ignoring stored data.`
    );
    return null;
  }

  const completedTopicIds = Array.isArray(candidate.completedTopicIds)
    ? candidate.completedTopicIds.filter((id): id is string => typeof id === "string")
    : [];

  const bookmarkedUrls = Array.isArray(candidate.bookmarkedUrls)
    ? candidate.bookmarkedUrls.filter((url): url is string => typeof url === "string")
    : [];

  const quizScores: UserProgress["quizScores"] = {};
  if (candidate.quizScores && typeof candidate.quizScores === "object") {
    Object.entries(candidate.quizScores).forEach(([topicId, val]) => {
      const record = val as { score?: unknown; total?: unknown; date?: unknown } | null;
      if (
        record &&
        typeof record === "object" &&
        typeof record.score === "number" &&
        typeof record.total === "number" &&
        typeof record.date === "string" &&
        // Range checks, not just type checks. The history view renders
        // Math.round(score / total * 100), so a record that is well-typed but
        // out of range still reaches the UI as "NaN%", "Infinity%", "167%" or
        // "-33%" — and anything >= 80 picks up the green "passed" styling.
        // Drop such records the same way malformed ones above are dropped.
        Number.isFinite(record.score) &&
        Number.isFinite(record.total) &&
        record.total > 0 &&
        record.score >= 0 &&
        record.score <= record.total
      ) {
        quizScores[topicId] = {
          score: record.score,
          total: record.total,
          date: record.date,
        };
      }
    });
  }

  return { completedTopicIds, bookmarkedUrls, quizScores };
}

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  // False until stored progress has been read. Gates the first paint so the
  // dashboard never shows 0% and then jumps to the real figure.
  const [hydrated, setHydrated] = useState(false);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"curriculum" | "bookmarks" | "practice">("curriculum");
  const [resourceFilter, setResourceFilter] = useState<"all" | "video" | "course" | "tutorial" | "docs">("all");

  // AI Study Companion Drawer state
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<{ id: string; title: string; stepTitle: string; whenYouNeedThis?: string } | null>(null);

  // Premium teasers (locked previews), keyed by step id. Empty when no
  // premium service is configured — the UI simply doesn't render them.
  const [premiumTeasers, setPremiumTeasers] = useState<Record<number, PremiumTeaser>>({});

  useEffect(() => {
    fetch(apiUrl("/api/premium/teasers"))
      .then(res => (res.ok ? res.json() : { modules: [] }))
      .then((data: { modules?: PremiumTeaser[] }) => {
        const byStep: Record<number, PremiumTeaser> = {};
        (data.modules || []).forEach(t => { byStep[t.stepId] = t; });
        setPremiumTeasers(byStep);
      })
      .catch(() => { /* premium teasers are optional — stay hidden */ });
  }, []);

  // Load stored progress. Unlike localStorage this is async, so the first
  // paint is gated on it (see `hydrated` below) — otherwise a user with real
  // progress watches the dashboard read 0% and then correct itself on every
  // single launch, which reads as "my progress is gone".
  useEffect(() => {
    let cancelled = false;
    loadStoredProgress()
      .then(stored => {
        if (cancelled || !stored) return;
        const parsed = parseStoredProgress(stored);
        // If parsing fails (or the blob is from a future schema version)
        // parseStoredProgress already warned/handled it — stay on the
        // in-memory default and leave the stored value untouched.
        if (parsed) setProgress(parsed);
      })
      .catch(e => {
        console.error("Failed to load stored progress:", e);
      })
      .finally(() => {
        // Always release the gate. A storage failure must not leave the user
        // staring at a blank screen — defaults are a worse outcome than their
        // real progress, but an app that never renders is worse than both.
        if (!cancelled) setHydrated(true);
      });
    return () => { cancelled = true; };
  }, []);

  // Persist progress. Kept synchronous from the caller's point of view — the
  // write is fire-and-forget so every handler below stays unchanged.
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    const stored: StoredProgress = { schemaVersion: PROGRESS_SCHEMA_VERSION, ...newProgress };
    void saveStoredProgress(JSON.stringify(stored)).catch(e => {
      console.error("Failed to save progress:", e);
    });
  };

  // Export current progress as a downloadable, versioned JSON file
  const handleExportProgress = () => {
    const stored: StoredProgress = { schemaVersion: PROGRESS_SCHEMA_VERSION, ...progress };
    const blob = new Blob([JSON.stringify(stored, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `ai-engineer-guide-progress-${today}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  // Trigger the hidden file input used for import
  const handleImportClick = () => {
    importFileInputRef.current?.click();
  };

  // Handle a selected import file: validate, confirm, then apply
  const handleImportFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const parsed = parseStoredProgress(text);
      if (!parsed) {
        window.alert("This file is not a valid progress export.");
      } else if (window.confirm("Importing will replace your current progress, bookmarks, and quiz scores. Continue?")) {
        saveProgress(parsed);
      }
      input.value = "";
    };
    reader.onerror = () => {
      window.alert("This file is not a valid progress export.");
      input.value = "";
    };
    reader.readAsText(file);
  };

  // Toggle module/topic completion
  const handleToggleTopic = (topicId: string) => {
    const completed = [...progress.completedTopicIds];
    const idx = completed.indexOf(topicId);
    if (idx > -1) {
      completed.splice(idx, 1);
    } else {
      completed.push(topicId);
    }
    saveProgress({
      ...progress,
      completedTopicIds: completed
    });
  };

  // Toggle bookmark
  const handleToggleBookmark = (url: string) => {
    const bookmarks = [...progress.bookmarkedUrls];
    const idx = bookmarks.indexOf(url);
    if (idx > -1) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.push(url);
    }
    saveProgress({
      ...progress,
      bookmarkedUrls: bookmarks
    });
  };

  // Update Quiz Score from Study Companion callback
  const handleQuizCompleted = (score: number, total: number) => {
    if (!selectedTopic) return;
    const currentScores = { ...progress.quizScores };
    currentScores[selectedTopic.id] = {
      score,
      total,
      date: new Date().toLocaleDateString()
    };
    saveProgress({
      ...progress,
      quizScores: currentScores
    });
  };

  // Reset all progress
  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all of your progress, quiz scores, and bookmarks? This cannot be undone.")) {
      saveProgress(initialProgress);
    }
  };

  // Trigger Study Companion
  const handleOpenStudyBuddy = (topicId: string, topicTitle: string, stepTitle: string, whenYouNeedThis?: string) => {
    setSelectedTopic({ id: topicId, title: topicTitle, stepTitle, whenYouNeedThis });
    setIsCompanionOpen(true);
  };

  // Compute stats
  const totalTopicsCount = roadmapData.reduce((acc, step) => acc + step.topics.length, 0);
  const completedTopicsCount = progress.completedTopicIds.length;
  const overallCompletionPercentage = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;
  const totalBookmarksCount = progress.bookmarkedUrls.length;
  const totalQuizzesPassed = Object.keys(progress.quizScores).length;

  // Flattened resources list for bookmarks or quick search
  const allResources: { resource: typeof roadmapData[0]["topics"][0]["resources"][0]; topic: typeof roadmapData[0]["topics"][0]; step: Step }[] = [];
  roadmapData.forEach(step => {
    step.topics.forEach(topic => {
      topic.resources.forEach(res => {
        allResources.push({ resource: res, topic, step });
      });
    });
  });

  // Filter bookmarked resources
  const bookmarkedResources = allResources.filter(r => progress.bookmarkedUrls.includes(r.resource.url));

  // Filtration logic for curriculum search and category tabs
  const filteredSteps = roadmapData.map(step => {
    const filteredTopics = step.topics.filter(topic => {
      // Filter by Search Query (match topic title, resource titles, resource description)
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        topic.title.toLowerCase().includes(query) ||
        topic.resources.some(r => 
          r.title.toLowerCase().includes(query) || 
          r.description.toLowerCase().includes(query) ||
          r.platform.toLowerCase().includes(query)
        );

      if (!matchesSearch) return false;

      // Filter by format filter (video, course, tutorial, docs/repos)
      if (resourceFilter !== "all") {
        const matchesType = topic.resources.some(r => {
          if (resourceFilter === "docs") {
            return r.type === "docs" || r.type === "blog" || r.type === "repo";
          }
          return r.type === resourceFilter;
        });
        return matchesType;
      }

      return true;
    });

    return {
      ...step,
      topics: filteredTopics
    };
  }).filter(step => step.topics.length > 0);

  // Hold the first paint until stored progress has been read. Deliberately an
  // empty page in the app's own background colour rather than a spinner: the
  // read is a single key lookup, so anything more elaborate would flash on and
  // straight back off. On native the launch screen is still up at this point.
  if (!hydrated) {
    return <div className="min-h-screen bg-[#FDFCF8]" aria-busy="true" />;
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] pb-20 selection:bg-[#3E5C76]/20 selection:text-[#1A1A1A] font-sans">

      {/* Top Editorial Accent Bar */}
      <div className="h-2 w-full bg-[#1A1A1A]" />

      {/* Header Area */}
      <header className="max-w-6xl mx-auto px-6 pt-10 pb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1A1A1A] pb-8">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 text-[#3E5C76] font-bold text-xs tracking-[0.2em] uppercase">
              <Sparkles className="w-4 h-4 text-[#3E5C76]" />
              <span>Roadmap & Resource Guide // 2026 Edition</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight tracking-tight text-[#1A1A1A]">
              Become an AI Engineer <br className="hidden md:block" />
              <span className="italic font-light opacity-85 text-3xl md:text-5xl">for people who already code</span>
            </h1>
            <p className="text-sm md:text-base text-neutral-600 max-w-3xl leading-relaxed">
              Transition from writing code — as a developer, data scientist, or analyst — to production-style AI Engineering. Learn structured projects, prompt engineering, agent construction, production backends, robust RAG systems, evaluations, and mock-interview practices.
              The roadmap and <strong className="text-[#1A1A1A] font-bold underline underline-offset-4 decoration-[#3E5C76]">every featured resource are free</strong> — the handful of third-party membership-gated picks carry a paywall badge, each with a free alternative beside it. Optional guided capstone modules, marked <span className="inline-flex items-center px-1.5 py-0.5 bg-amber-100 border border-amber-800 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-none align-middle">Paid · Premium</span>, are a separate paid tier.
            </p>
          </div>

          {/* Reset actions and right meta badge */}
          <div className="flex flex-col items-start md:items-end gap-3.5 shrink-0 self-start md:self-end">
            <div className="text-left md:text-right">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 mb-1">Curated Resources</div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#1A1A1A] text-white text-[10px] font-bold tracking-wider">FREE ACCESS</span>
                <span className="px-3 py-1 border border-[#1A1A1A] text-[10px] font-bold italic">PAYWALLS FLAGGED</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportProgress}
                className="px-3.5 py-2 text-xs font-bold font-mono tracking-wider uppercase border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition flex items-center gap-1.5 text-[#1A1A1A]"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <button
                onClick={handleImportClick}
                className="px-3.5 py-2 text-xs font-bold font-mono tracking-wider uppercase border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition flex items-center gap-1.5 text-[#1A1A1A]"
              >
                <Upload className="w-3.5 h-3.5" />
                Import
              </button>
              <input
                ref={importFileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleImportFileSelected}
                className="hidden"
              />
              <button
                onClick={handleResetProgress}
                className="px-3.5 py-2 text-xs font-bold font-mono tracking-wider uppercase border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition flex items-center gap-1.5 text-[#1A1A1A]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Stats
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stat Widgets Block */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Stat 1: Roadmap Completion */}
          <div className="bg-[#F2EFE9] border border-[#1A1A1A] p-5 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#1A1A1A]/70 uppercase">Guide Completion</p>
              <p className="text-3xl font-serif italic text-[#1A1A1A] mt-2 font-semibold">{overallCompletionPercentage}%</p>
            </div>
            <div className="h-1.5 w-full bg-[#1A1A1A]/10 overflow-hidden">
              <div className="h-full bg-[#1A1A1A] transition-all duration-500" style={{ width: `${overallCompletionPercentage}%` }} />
            </div>
          </div>

          {/* Stat 2: Module Counters */}
          <div className="bg-[#F2EFE9] border border-[#1A1A1A] p-5 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#1A1A1A]/70 uppercase">Completed Modules</p>
              <p className="text-3xl font-serif italic text-[#1A1A1A] mt-2 font-semibold font-serif">
                {completedTopicsCount} <span className="text-sm font-normal text-neutral-500 font-sans italic">/ {totalTopicsCount}</span>
              </p>
            </div>
            <p className="text-[10px] text-neutral-600 font-semibold font-mono tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3E5C76] shrink-0" />
              Checked off by you
            </p>
          </div>

          {/* Stat 3: Bookmarks */}
          <div className="bg-[#F2EFE9] border border-[#1A1A1A] p-5 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#1A1A1A]/70 uppercase">Bookmarked Materials</p>
              <p className="text-3xl font-serif italic text-[#1A1A1A] mt-2 font-semibold">{totalBookmarksCount}</p>
            </div>
            <p className="text-[10px] text-neutral-600 font-semibold font-mono tracking-wider flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5 text-[#3E5C76] shrink-0" />
              Curated study queue
            </p>
          </div>

          {/* Stat 4: Quizzes */}
          <div className="bg-[#F2EFE9] border border-[#1A1A1A] p-5 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#1A1A1A]/70 uppercase">Completed Quizzes</p>
              <p className="text-3xl font-serif italic text-[#1A1A1A] mt-2 font-semibold">{totalQuizzesPassed}</p>
            </div>
            <p className="text-[10px] text-neutral-600 font-semibold font-mono tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              Model graded scores
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-[#1A1A1A] gap-8">
          <button
            onClick={() => setActiveTab("curriculum")}
            className={`py-3 px-1 font-bold text-xs tracking-widest uppercase border-b-2 transition relative ${
              activeTab === "curriculum" 
                ? "border-[#1A1A1A] text-[#1A1A1A]" 
                : "border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
            }`}
          >
            Full Curriculum
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`py-3 px-1 font-bold text-xs tracking-widest uppercase border-b-2 transition relative flex items-center gap-1.5 ${
              activeTab === "bookmarks" 
                ? "border-[#1A1A1A] text-[#1A1A1A]" 
                : "border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
            }`}
          >
            My Bookmarks
            {totalBookmarksCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-none bg-[#1A1A1A] text-[#FDFCF8]">
                {totalBookmarksCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("practice")}
            className={`py-3 px-1 font-bold text-xs tracking-widest uppercase border-b-2 transition relative ${
              activeTab === "practice" 
                ? "border-[#1A1A1A] text-[#1A1A1A]" 
                : "border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
            }`}
          >
            Quiz & Practice History
          </button>
        </div>

        {/* CURRICULUM VIEW */}
        {activeTab === "curriculum" && (
          <div className="space-y-6">
            
            {/* Search and Filters Controls */}
            <div className="bg-transparent border border-[#1A1A1A] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search roadmap topics, platforms, resources..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F2EFE9]/40 hover:bg-[#F2EFE9]/70 focus:bg-white border border-[#1A1A1A]/60 focus:border-[#1A1A1A] rounded-none text-sm transition focus:outline-none font-medium text-[#1A1A1A]"
                />
              </div>

              {/* Resource Format Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-bold text-[#1A1A1A]/60 font-mono uppercase mr-1 tracking-wider">Formats:</span>
                {[
                  { value: "all", label: "All Formats" },
                  { value: "video", label: "Videos" },
                  { value: "course", label: "Courses" },
                  { value: "tutorial", label: "Tutorials" },
                  { value: "docs", label: "Docs / Blogs / Repos" }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setResourceFilter(opt.value as any)}
                    className={`px-3 py-1.5 rounded-none text-[11px] tracking-wider uppercase font-bold border transition ${
                      resourceFilter === opt.value
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-[#FDFCF8]"
                        : "bg-transparent border-[#1A1A1A]/30 hover:border-[#1A1A1A] text-[#1A1A1A]/70 hover:text-[#1A1A1A]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Steps Vertical Timeline List */}
            <div className="space-y-8 relative">
              {filteredSteps.length > 0 ? (
                filteredSteps.map((step) => (
                  <RoadmapCard
                    key={step.id}
                    step={step as Step}
                    premiumTeaser={premiumTeasers[step.id]}
                    progress={progress}
                    onToggleTopic={handleToggleTopic}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenStudyBuddy={handleOpenStudyBuddy}
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-[#F2EFE9]/40 border border-[#1A1A1A] flex flex-col items-center justify-center space-y-4">
                  <Search className="w-12 h-12 stroke-1 text-[#1A1A1A]/40" />
                  <div className="space-y-1.5">
                    <p className="font-bold text-[#1A1A1A]">No matching steps or modules found</p>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto">Try adjusting your search criteria or formatting filters.</p>
                  </div>
                  <button
                    onClick={() => { setSearchQuery(""); setResourceFilter("all"); }}
                    className="px-4 py-2 text-xs font-bold border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* BOOKMARKS VIEW */}
        {activeTab === "bookmarks" && (
          <div className="space-y-6 animate-fade-in">
            {bookmarkedResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookmarkedResources.map(({ resource, topic, step }) => {
                  const isBookmarked = progress.bookmarkedUrls.includes(resource.url);

                  return (
                    <div 
                      key={resource.url}
                      className="bg-[#FDFCF8] border border-[#1A1A1A] p-6 flex flex-col justify-between gap-6 transition-all duration-300"
                    >
                      <div className="space-y-3.5">
                        
                        {/* Bookmark card step and topic reference headers */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A1A1A]/20 pb-3">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#F2EFE9] border border-[#1A1A1A]/40 text-[#1A1A1A]">
                            Step {step.id} • {topic.title}
                          </span>
                          
                          {/* Remove button */}
                          <button
                            onClick={() => handleToggleBookmark(resource.url)}
                            className="text-xs font-bold font-mono tracking-wider text-[#1A1A1A]/60 hover:text-red-600 px-2 py-1 border border-transparent hover:border-[#1A1A1A]/20 transition"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Resource meta details */}
                        <div className="space-y-2">
                          <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1A1A1A]/50 tracking-wider">
                            {resource.platform} ({resource.type})
                            {resource.paywall && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 border border-amber-800 text-amber-900 text-[9px] font-bold uppercase tracking-wider rounded-none">
                                <Lock className="w-2.5 h-2.5" />
                                Paywall
                              </span>
                            )}
                          </span>
                          <h4 className="text-lg font-serif font-bold text-[#1A1A1A] leading-snug">
                            {resource.title}
                          </h4>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {resource.description}
                          </p>
                        </div>

                      </div>

                      {/* Direct launch outbound link */}
                      <div className="flex items-center gap-3">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-between px-4 py-2.5 bg-[#1A1A1A] hover:bg-neutral-800 border border-[#1A1A1A] text-[#FDFCF8] text-xs font-bold transition"
                        >
                          <span>Launch Learning Resource</span>
                          <ExternalLink className="w-4 h-4 text-neutral-300" />
                        </a>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#F2EFE9]/40 border border-[#1A1A1A] flex flex-col items-center justify-center space-y-4">
                <BookMarked className="w-12 h-12 stroke-1 text-[#1A1A1A]/40" />
                <div className="space-y-1.5">
                  <p className="font-bold text-[#1A1A1A]">Your study queue is empty</p>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">Click the bookmark icon on any material card to build your customized quick-access list.</p>
                </div>
                <button
                  onClick={() => setActiveTab("curriculum")}
                  className="px-4 py-2 text-xs font-bold bg-[#1A1A1A] hover:bg-neutral-800 text-white transition"
                >
                  Explore Curriculum
                </button>
              </div>
            )}
          </div>
        )}

        {/* PRACTICE HISTORY VIEW */}
        {activeTab === "practice" && (
          <div className="space-y-6 animate-fade-in">
            {totalQuizzesPassed > 0 ? (
              <div className="bg-transparent border border-[#1A1A1A] overflow-hidden">
                
                {/* Table Header */}
                <div className="p-6 border-b border-[#1A1A1A] flex items-center justify-between bg-[#F2EFE9]">
                  <h3 className="font-serif font-bold text-[#1A1A1A] text-lg">Completed Modules Evaluations Log</h3>
                  <span className="text-xs font-bold font-mono text-[#1A1A1A]/60">{totalQuizzesPassed} Active quiz records</span>
                </div>

                {/* Grid Lists of quizzes completed */}
                <div className="divide-y divide-[#1A1A1A]/40">
                  {Object.entries(progress.quizScores).map(([topicId, val]) => {
                    const record = val as { score: number; total: number; date: string };
                    // Match topic detail
                    let stepRef = "Unknown Step";
                    let topicTitle = "Unknown Module";
                    roadmapData.forEach(step => {
                      const found = step.topics.find(t => t.id === topicId);
                      if (found) {
                        stepRef = `Step ${step.id}`;
                        topicTitle = found.title;
                      }
                    });

                    const percentage = Math.round((record.score / record.total) * 100);

                    return (
                      <div key={topicId} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#F2EFE9]/30 transition">
                        
                        {/* Topic Ref details */}
                        <div className="space-y-1.5 flex-1">
                          <span className="font-mono text-[10px] font-bold tracking-widest text-[#3E5C76] uppercase">{stepRef}</span>
                          <h4 className="text-lg font-serif font-bold text-[#1A1A1A] leading-snug">{topicTitle}</h4>
                          <p className="text-xs text-neutral-500 font-mono">Evaluation Date: {record.date}</p>
                        </div>

                        {/* Score badges */}
                        <div className="flex items-center gap-6 self-start md:self-center">
                          <div className="text-right">
                            <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-mono">Accuracy</p>
                            <p className={`text-xl font-bold font-mono mt-0.5 ${percentage >= 80 ? "text-emerald-700" : "text-[#3E5C76]"}`}>
                              {percentage}%
                            </p>
                          </div>

                          <div className="px-4 py-2.5 bg-[#F2EFE9] border border-[#1A1A1A] text-center shrink-0">
                            <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-widest font-mono">Grade</p>
                            <p className="text-base font-bold text-[#1A1A1A] font-mono mt-0.5">{record.score} / {record.total}</p>
                          </div>

                          {/* Trigger Re-evaluate */}
                          <button
                            onClick={() => {
                              // Find corresponding step title and topic hook to launch companion
                              let st = "";
                              let hook: string | undefined;
                              roadmapData.forEach(s => {
                                const t = s.topics.find(t => t.id === topicId);
                                if (t) {
                                  st = s.title;
                                  hook = t.whenYouNeedThis;
                                }
                              });
                              handleOpenStudyBuddy(topicId, topicTitle, st, hook);
                            }}
                            className="px-3.5 py-2 text-xs font-bold border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] bg-[#FDFCF8] transition"
                          >
                            Retake Quiz
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            ) : (
              <div className="text-center py-20 bg-[#F2EFE9]/40 border border-[#1A1A1A] flex flex-col items-center justify-center space-y-4">
                <Award className="w-12 h-12 stroke-1 text-[#1A1A1A]/40" />
                <div className="space-y-1.5">
                  <p className="font-bold text-[#1A1A1A]">No evaluations taken yet</p>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">Click "AI Study Buddy" on any curriculum module, navigate to the "Knowledge Quiz" tab, and test your retention!</p>
                </div>
                <button
                  onClick={() => setActiveTab("curriculum")}
                  className="px-4 py-2 text-xs font-bold bg-[#1A1A1A] hover:bg-neutral-800 text-white transition"
                >
                  Start Practicing
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* AI Study Companion Side Panel Drawer overlay */}
      <StudyBuddy
        isOpen={isCompanionOpen}
        onClose={() => setIsCompanionOpen(false)}
        topicId={selectedTopic?.id || ""}
        topicTitle={selectedTopic?.title || ""}
        stepTitle={selectedTopic?.stepTitle || ""}
        whenYouNeedThis={selectedTopic?.whenYouNeedThis}
        onQuizCompleted={handleQuizCompleted}
        currentQuizScore={selectedTopic ? progress.quizScores[selectedTopic.id] : undefined}
      />

    </div>
  );
}
