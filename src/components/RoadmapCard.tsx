import React, { useState } from "react";
import { Step, Topic, Resource, UserProgress, PremiumTeaser } from "../types";
import {
  CheckCircle2, Bookmark, BookmarkCheck, ExternalLink,
  Sparkles, Video, BookOpen, GraduationCap, Code,
  FileText, Award, Lock, ChevronDown, ChevronUp
} from "lucide-react";

interface RoadmapCardProps {
  step: Step;
  /** Locked preview of this step's premium guided module, when a premium service is configured. */
  premiumTeaser?: PremiumTeaser;
  progress: UserProgress;
  onToggleTopic: (topicId: string) => void;
  onToggleBookmark: (url: string) => void;
  onOpenStudyBuddy: (topicId: string, topicTitle: string, stepTitle: string, whenYouNeedThis?: string) => void;
}

export default function RoadmapCard({
  step,
  premiumTeaser,
  progress,
  onToggleTopic,
  onToggleBookmark,
  onOpenStudyBuddy
}: RoadmapCardProps) {

  // Topics whose full resource list is shown despite having a "start here" primary resource
  const [expandedTopicIds, setExpandedTopicIds] = useState<string[]>([]);

  const toggleExpanded = (topicId: string) => {
    setExpandedTopicIds(prev =>
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
  };

  // Calculate completion percentage for this step
  const totalTopics = step.topics.length;
  const completedTopicsInStep = step.topics.filter(t => progress.completedTopicIds.includes(t.id)).length;
  const completionPercentage = totalTopics > 0 ? Math.round((completedTopicsInStep / totalTopics) * 100) : 0;

  // Helper to choose corresponding icons for resource type
  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4 text-rose-500" />;
      case "course":
        return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      case "docs":
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case "repo":
        return <Code className="w-4 h-4 text-violet-500" />;
      case "blog":
        return <FileText className="w-4 h-4 text-amber-500" />;
      default:
        return <FileText className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <div className="bg-[#FDFCF8] border border-[#1A1A1A] rounded-none overflow-hidden transition-all duration-300">
      
      {/* Step Header Block */}
      <div className="p-6 md:p-8 bg-[#F2EFE9] border-b border-[#1A1A1A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[10px] font-bold px-2.5 py-1 bg-[#1A1A1A] text-[#FDFCF8] border border-[#1A1A1A] tracking-wider uppercase rounded-none">
              Step {step.id}
            </span>
            <span className="text-xs font-semibold text-[#1A1A1A]/70 font-mono">
              {completedTopicsInStep}/{totalTopics} Modules Completed
            </span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">{step.title}</h3>
          <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">{step.description}</p>

          {/* Capstone thread: the learner's evolving project at this step */}
          {step.capstone && (
            <div className="mt-3 p-3.5 bg-[#FDFCF8] border border-[#1A1A1A]/60 max-w-2xl">
              <p className="text-[10px] font-bold font-mono text-[#3E5C76] uppercase tracking-widest mb-1">Your Project This Step</p>
              <p className="text-sm text-neutral-700 leading-relaxed">{step.capstone}</p>

              {/* Locked premium teaser: marketing data only, hidden when no premium service is configured */}
              {premiumTeaser && (
                <div className="mt-2.5 pt-2.5 border-t border-[#1A1A1A]/15 flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 mr-1.5 bg-amber-100 border border-amber-800 text-amber-900 text-[9px] font-bold uppercase tracking-wider rounded-none align-middle">
                      Paid · Premium
                    </span>
                    Guided module: <span className="font-semibold text-[#1A1A1A]">{premiumTeaser.title}</span> — {premiumTeaser.milestoneCount} milestones, ~{premiumTeaser.estimatedHours}h. Part of the paid Premium tier (coming soon); this roadmap and all its resources stay free.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step Progress indicators */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <div className="text-right">
            <p className="text-[10px] font-bold font-mono text-[#1A1A1A]/60 uppercase tracking-widest">Progress</p>
            <p className="text-2xl font-bold text-[#1A1A1A] font-mono leading-none mt-1">{completionPercentage}%</p>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-[#1A1A1A]/10 fill-none stroke-3"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-[#1A1A1A] fill-none stroke-3 transition-all duration-500"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - completionPercentage / 100)}`}
              />
            </svg>
            <CheckCircle2 className={`absolute w-5 h-5 ${completionPercentage === 100 ? "text-[#1A1A1A] scale-100" : "text-neutral-300 scale-90"} transition-all`} />
          </div>
        </div>
      </div>

      {/* Step Topics List */}
      <div className="divide-y divide-[#1A1A1A]/30">
        {step.topics.map((topic, tIdx) => {
          const isTopicCompleted = progress.completedTopicIds.includes(topic.id);
          const currentQuizScore = progress.quizScores[topic.id];

          // "Start here" resource first; without one, the topic shows all resources uncollapsed
          const primaryResource = topic.resources.find(r => r.primary);
          const orderedResources = primaryResource
            ? [primaryResource, ...topic.resources.filter(r => r !== primaryResource)]
            : topic.resources;
          const isExpanded = !primaryResource || expandedTopicIds.includes(topic.id);
          const visibleResources = isExpanded ? orderedResources : [primaryResource!];
          const hiddenCount = orderedResources.length - visibleResources.length;

          return (
            <div key={topic.id} className="p-6 md:p-8 space-y-5 hover:bg-[#F2EFE9]/20 transition-colors">
              
              {/* Topic Title with Toggle & Companion Trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5 flex-1">
                  <button 
                    onClick={() => onToggleTopic(topic.id)}
                    className="mt-1 shrink-0 group focus:outline-none"
                    aria-label={`Toggle completion of ${topic.title}`}
                  >
                    <CheckCircle2 
                      className={`w-6 h-6 transition ${
                        isTopicCompleted 
                          ? "text-[#3E5C76] fill-[#3E5C76]/5" 
                          : "text-neutral-300 hover:text-[#1A1A1A]"
                      }`} 
                    />
                  </button>
                  <div className="space-y-1.5">
                    <h4 className={`text-lg font-serif font-bold leading-snug transition-colors ${
                      isTopicCompleted ? "text-neutral-400 line-through decoration-neutral-300" : "text-[#1A1A1A]"
                    }`}>
                      {topic.title}
                    </h4>

                    {/* Pull motivation: the pain point that makes this topic necessary */}
                    {topic.whenYouNeedThis && (
                      <p className="text-sm text-neutral-600 leading-relaxed italic border-l-2 border-[#3E5C76] pl-3 max-w-2xl">
                        {topic.whenYouNeedThis}
                      </p>
                    )}

                    {/* Scores and indicators */}
                    {currentQuizScore && (
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold font-mono text-[#FDFCF8] bg-emerald-800 border border-emerald-800 px-2.5 py-0.5 rounded-none shadow-none uppercase tracking-wider">
                        <Award className="w-3.5 h-3.5" />
                        Quiz Score: {currentQuizScore.score}/{currentQuizScore.total}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Study Companion Button */}
                <button
                  onClick={() => onOpenStudyBuddy(topic.id, topic.title, step.title, topic.whenYouNeedThis)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-none text-[11px] font-bold uppercase tracking-wider text-[#FDFCF8] bg-[#1A1A1A] border border-[#1A1A1A] hover:bg-neutral-800 hover:border-neutral-800 active:scale-95 transition self-start sm:self-center"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Study Buddy
                </button>
              </div>

              {/* Topic Resource Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleResources.map((resource, rIdx) => {
                  const isBookmarked = progress.bookmarkedUrls.includes(resource.url);

                  return (
                    <div 
                      key={resource.url}
                      className="group/res p-4 bg-[#F2EFE9]/30 border border-[#1A1A1A]/60 hover:border-[#1A1A1A] rounded-none transition-all duration-300 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        {/* Resource Top Meta */}
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A]/60 font-mono">
                            {getResourceIcon(resource.type)}
                            {resource.platform}
                            {resource.primary && (
                              <span className="inline-flex items-center px-1.5 py-0.5 bg-[#3E5C76] text-[#FDFCF8] text-[9px] font-bold uppercase tracking-wider rounded-none">
                                Start here
                              </span>
                            )}
                            {resource.paywall && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 border border-amber-800 text-amber-900 text-[9px] font-bold uppercase tracking-wider rounded-none">
                                <Lock className="w-2.5 h-2.5" />
                                Paywall
                              </span>
                            )}
                          </span>
                          
                          {/* Bookmark Toggle Button */}
                          <button
                            onClick={() => onToggleBookmark(resource.url)}
                            className={`p-1 rounded-md text-neutral-400 hover:text-[#3E5C76] hover:bg-[#1A1A1A]/5 transition ${isBookmarked ? "text-[#3E5C76]" : ""}`}
                            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark resource"}
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="w-4 h-4 text-[#3E5C76] fill-[#3E5C76]/20" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Title and description */}
                        <div className="space-y-1">
                          <h5 className="font-serif font-bold text-[#1A1A1A] text-base leading-snug line-clamp-2 hover:text-[#3E5C76] transition-colors">
                            {resource.title}
                          </h5>
                          <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                            {resource.description}
                          </p>
                        </div>
                      </div>

                      {/* Launch resource */}
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between px-3 py-2 bg-transparent border border-[#1A1A1A]/40 group-hover/res:border-[#1A1A1A] rounded-none text-xs font-bold text-[#1A1A1A] hover:bg-[#F2EFE9]/60 transition"
                      >
                        <span className="flex items-center gap-1">
                          Open Learning Resource
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-400 transition group-hover/res:translate-x-0.5" />
                      </a>

                    </div>
                  );
                })}
              </div>

              {/* Go deeper toggle for topics with a "start here" resource */}
              {primaryResource && topic.resources.length > 1 && (
                <button
                  onClick={() => toggleExpanded(topic.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold font-mono uppercase tracking-wider border border-[#1A1A1A]/40 hover:border-[#1A1A1A] text-[#1A1A1A]/70 hover:text-[#1A1A1A] rounded-none transition"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      Show fewer resources
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      Go deeper — {hiddenCount} more {hiddenCount === 1 ? "resource" : "resources"}
                    </>
                  )}
                </button>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
