import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Sparkles, BookOpen, HelpCircle, Briefcase, 
  Send, Copy, Check, RotateCcw, Award, ChevronRight,
  Loader2, Terminal, AlertCircle
} from "lucide-react";
import { Quiz, QuizQuestion } from "../types";

interface StudyBuddyProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  topicTitle: string;
  stepTitle: string;
  onQuizCompleted: (score: number, total: number) => void;
  currentQuizScore?: { score: number; total: number; date: string };
}

type Mode = "explain" | "quiz" | "interview";

export default function StudyBuddy({
  isOpen,
  onClose,
  topicId,
  topicTitle,
  stepTitle,
  onQuizCompleted,
  currentQuizScore
}: StudyBuddyProps) {
  const [mode, setMode] = useState<Mode>("explain");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Explain Mode State
  const [explanation, setExplanation] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Quiz Mode State
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Interview Mode State
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Encouraging loading messages
  const [loadingMessage, setLoadingMessage] = useState("");
  const loadingMessages = {
    explain: [
      "Consulting your AI Study Companion...",
      `Structuring modular lessons on ${topicTitle}...`,
      "Drafting real-world AI Engineering use cases...",
      "Formulating standard Python code templates..."
    ],
    quiz: [
      "Drafting specialized evaluation items...",
      "Setting up high-quality cognitive distractors...",
      "Establishing validation rules...",
      "Assembling interactive multiple-choice cards..."
    ],
    interview: [
      "Booting mock Lead AI Engineer interviewer model...",
      "Reviewing interview rubric for candidate evaluation...",
      "Analyzing baseline competencies..."
    ]
  };

  // Rotate loading messages
  useEffect(() => {
    if (!loading) return;
    const messagesList = loadingMessages[mode];
    let idx = 0;
    setLoadingMessage(messagesList[0]);
    
    const interval = setInterval(() => {
      idx = (idx + 1) % messagesList.length;
      setLoadingMessage(messagesList[idx]);
    }, 2500);

    return () => clearInterval(interval);
  }, [loading, mode, topicId]);

  // Scroll interview chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset states when topic changes or drawer opens
  useEffect(() => {
    if (isOpen) {
      setMode("explain");
      setExplanation("");
      setQuiz(null);
      setError(null);
      
      // Initialize Interview messages
      setMessages([
        {
          role: "assistant",
          content: `### Welcome to the Mock Interview!
I am your **Lead AI Engineer** interviewer today. Let's explore your understanding of **${topicTitle}**.

To start, how would you define **${topicTitle}** to a data scientist who is transitioning to production systems? What architectural considerations should we keep in mind?`
        }
      ]);

      // Trigger explanation load automatically
      loadExplanation();
    }
  }, [isOpen, topicId]);

  // API Call: Fetch Explanation
  const loadExplanation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicTitle, stepTitle })
      });
      if (!response.ok) throw new Error("Failed to load explanation. Please check your network or GEMINI_API_KEY.");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setExplanation(data.content || "");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // API Call: Fetch Quiz
  const loadQuiz = async () => {
    setLoading(true);
    setError(null);
    setQuiz(null);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);

    try {
      const response = await fetch("/api/gemini/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicTitle, topicId })
      });
      if (!response.ok) throw new Error("Failed to load quiz. Please check your network or GEMINI_API_KEY.");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setQuiz(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Send Message: Interview Practice
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setError(null);

    const updatedMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicTitle,
          messages: updatedMessages
        })
      });
      if (!response.ok) throw new Error("Failed to communicate with interviewer. Check your API configuration.");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setMessages([...updatedMessages, { role: "assistant" as const, content: data.content || "" }]);
    } catch (err: any) {
      setError(err.message || "Interviewer model failed to respond.");
    } finally {
      setLoading(false);
    }
  };

  // Quiz Option Selector
  const handleOptionSelect = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOptionIdx(idx);
  };

  // Submit Quiz Question Answer
  const handleSubmitAnswer = () => {
    if (selectedOptionIdx === null || quizSubmitted) return;
    
    const currentQuestion = quiz?.questions[currentQuestionIdx];
    const isCorrect = selectedOptionIdx === currentQuestion?.correctAnswerIndex;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    setQuizSubmitted(true);
  };

  // Advance Quiz Question
  const handleNextQuestion = () => {
    if (!quiz) return;
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOptionIdx(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
      onQuizCompleted(quizScore, quiz.questions.length);
    }
  };

  // Copy Code to Clipboard Helper
  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Custom Light-weight Markdown Parser & Formatter Component
  const MarkdownView = ({ text }: { text: string }) => {
    if (!text) return null;

    // Helper to extract code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);

    return (
      <div className="space-y-4 text-neutral-800 leading-relaxed text-sm">
        {parts.map((part, index) => {
          if (part.startsWith("```")) {
            // It's a code block
            const match = part.match(/```(\w*)\n([\s\S]*?)```/);
            const language = match ? match[1] : "python";
            const code = match ? match[2] : part.slice(3, -3);
            
            return (
              <div key={index} className="rounded-none border border-[#1A1A1A] bg-[#1A1A1A] overflow-hidden my-3 shadow-none">
                <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-[#1A1A1A]">
                  <span className="text-xs text-neutral-300 font-mono tracking-wider uppercase flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#3E5C76]" />
                    {language || "code"}
                  </span>
                  <button 
                    onClick={() => handleCopyCode(code.trim(), index)}
                    className="p-1 rounded-none text-neutral-400 hover:text-white transition"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs font-mono text-neutral-200 bg-[#1A1A1A]">
                  <code>{code.trim()}</code>
                </pre>
              </div>
            );
          }

          // Format normal paragraph markdown (headers, bolding, inline code, bullets)
          const lines = part.split("\n");
          return (
            <div key={index} className="space-y-3">
              {lines.map((line, lIdx) => {
                const trimmed = line.trim();
                if (!trimmed) return null;

                // Headers
                if (line.startsWith("### ")) {
                  return <h4 key={lIdx} className="text-base font-serif font-bold text-[#1A1A1A] mt-5 mb-2">{line.replace("### ", "")}</h4>;
                }
                if (line.startsWith("## ")) {
                  return <h3 key={lIdx} className="text-lg font-serif font-bold text-[#1A1A1A] mt-6 mb-3">{line.replace("## ", "")}</h3>;
                }
                if (line.startsWith("# ")) {
                  return <h2 key={lIdx} className="text-xl font-serif font-bold text-[#1A1A1A] mt-7 mb-4">{line.replace("# ", "")}</h2>;
                }

                // Bullet Lists
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  const content = trimmed.substring(2);
                  return (
                    <div key={lIdx} className="flex items-start gap-2.5 pl-2 my-1">
                      <span className="mt-1.5 shrink-0 block w-1.5 h-1.5 bg-[#1A1A1A]"></span>
                      <span className="text-neutral-700">{parseInlineFormatting(content)}</span>
                    </div>
                  );
                }

                // Numbered Lists
                const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
                if (numMatch) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-2 my-1">
                      <span className="font-mono text-[#1A1A1A] font-bold shrink-0 text-xs mt-0.5">{numMatch[1]}.</span>
                      <span className="text-neutral-700">{parseInlineFormatting(numMatch[2])}</span>
                    </div>
                  );
                }

                // Regular Paragraph
                return <p key={lIdx} className="text-neutral-700">{parseInlineFormatting(line)}</p>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper to parse bold (**text**) and inline code (`code`)
  const parseInlineFormatting = (text: string) => {
    // Regex split for bold and inline code
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-neutral-950">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} className="px-1.5 py-0.5 rounded-none bg-[#F2EFE9] border border-[#1A1A1A]/30 font-mono text-xs text-[#3E5C76]">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Container */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-2xl h-full bg-[#FDFCF8] border-l-2 border-[#1A1A1A] shadow-2xl flex flex-col z-10 animate-fade-in"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#1A1A1A] flex items-center justify-between bg-[#F2EFE9]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#1A1A1A] text-[#FDFCF8] rounded-none">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#1A1A1A] text-lg">{topicTitle}</h3>
                  <p className="text-xs text-[#1A1A1A]/70 font-medium font-mono uppercase tracking-widest">AI Companion • {stepTitle}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-none hover:bg-[#1A1A1A]/10 text-[#1A1A1A] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Navigation Tabs */}
            <div className="flex px-6 border-b border-[#1A1A1A] bg-[#FDFCF8]">
              <button
                onClick={() => { setMode("explain"); if (!explanation && !loading) loadExplanation(); }}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs uppercase tracking-wider transition relative ${
                  mode === "explain" 
                    ? "border-[#1A1A1A] text-[#1A1A1A]" 
                    : "border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Concept Explainer
              </button>
              <button
                onClick={() => { setMode("quiz"); if (!quiz && !loading) loadQuiz(); }}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs uppercase tracking-wider transition relative ${
                  mode === "quiz" 
                    ? "border-[#1A1A1A] text-[#1A1A1A]" 
                    : "border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Knowledge Quiz
                {currentQuizScore && (
                  <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-none bg-[#1A1A1A] text-[#FDFCF8]">
                    {currentQuizScore.score}/{currentQuizScore.total}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMode("interview")}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs uppercase tracking-wider transition relative ${
                  mode === "interview" 
                    ? "border-[#1A1A1A] text-[#1A1A1A]" 
                    : "border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Mock Interview
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {error && (
                <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-red-700 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold">Failed to load AI response</p>
                    <p className="opacity-90">{error}</p>
                    <button 
                      onClick={() => mode === "explain" ? loadExplanation() : mode === "quiz" ? loadQuiz() : handleSendMessage()}
                      className="mt-3 px-3 py-1 bg-red-100 hover:bg-red-200 border border-red-200 rounded-lg text-xs font-semibold text-red-800 transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retry Request
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <Loader2 className="w-10 h-10 text-[#1A1A1A] animate-spin" />
                  <div className="space-y-1">
                    <p className="font-bold text-[#1A1A1A] text-sm">Please Wait...</p>
                    <p className="text-xs text-neutral-500 max-w-sm font-mono">{loadingMessage}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* EXPLAIN MODE */}
                  {mode === "explain" && !error && (
                    <div className="space-y-4 animate-fade-in">
                      {explanation ? (
                        <div className="p-6 bg-[#FDFCF8] border border-[#1A1A1A] rounded-none shadow-none">
                          <MarkdownView text={explanation} />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                          <BookOpen className="w-12 h-12 stroke-1 opacity-50 mb-3" />
                          <p className="text-sm">No explanation loaded yet.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* QUIZ MODE */}
                  {mode === "quiz" && !error && (
                    <div className="space-y-4">
                      {!quiz ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                          <HelpCircle className="w-12 h-12 text-[#1A1A1A]/20 stroke-1" />
                          <div className="space-y-1">
                            <p className="font-serif font-bold text-lg text-[#1A1A1A]">Ready to test your knowledge?</p>
                            <p className="text-xs text-neutral-500 max-w-xs">Generate a specialized, model-graded multiple-choice quiz specifically for {topicTitle}.</p>
                          </div>
                          <button 
                            onClick={loadQuiz}
                            className="px-4 py-2 bg-[#1A1A1A] hover:bg-neutral-800 text-[#FDFCF8] rounded-none text-xs font-bold transition flex items-center gap-1.5 uppercase tracking-wider"
                          >
                            <Sparkles className="w-4 h-4" />
                            Generate Custom Quiz
                          </button>
                        </div>
                      ) : quizFinished ? (
                        /* Quiz Finished Summary */
                        <div className="p-8 bg-[#F2EFE9] border border-[#1A1A1A] rounded-none text-center space-y-6 shadow-none">
                          <div className="relative inline-flex items-center justify-center p-4 bg-[#1A1A1A] text-[#FDFCF8] rounded-none">
                            <Award className="w-12 h-12" />
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-2xl font-serif font-bold text-[#1A1A1A]">Quiz Completed!</h4>
                            <p className="text-sm text-neutral-600 max-w-md mx-auto">
                              Excellent effort! You have concluded the module evaluation for <strong className="text-[#1A1A1A]">{topicTitle}</strong>.
                            </p>
                          </div>

                          <div className="p-4 bg-[#FDFCF8] rounded-none max-w-xs mx-auto border border-[#1A1A1A] flex items-center justify-around">
                            <div>
                              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider font-mono">Score</p>
                              <p className="text-2xl font-bold text-[#3E5C76] font-mono">{quizScore} / {quiz.questions.length}</p>
                            </div>
                            <div className="h-8 w-px bg-[#1A1A1A]/30" />
                            <div>
                              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider font-mono">Accuracy</p>
                              <p className="text-2xl font-bold text-[#1A1A1A] font-mono">{Math.round((quizScore / quiz.questions.length) * 100)}%</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-center gap-3 pt-3">
                            <button 
                              onClick={loadQuiz}
                              className="px-4 py-2 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FDFCF8] bg-transparent text-[#1A1A1A] rounded-none text-xs font-bold transition flex items-center gap-1.5 uppercase tracking-wider"
                            >
                              <RotateCcw className="w-4 h-4" /> Retake Quiz
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Active Quiz Question Card */
                        <div className="space-y-6">
                          {/* Progress Line */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#1A1A1A]/60 uppercase tracking-widest">Question {currentQuestionIdx + 1} of {quiz.questions.length}</span>
                            <span className="text-xs font-semibold text-[#1A1A1A] bg-[#F2EFE9] border border-[#1A1A1A]/30 px-2.5 py-0.5 rounded-none font-mono">Current Score: {quizScore}</span>
                          </div>
                          
                          <div className="h-1.5 w-full bg-[#1A1A1A]/10 rounded-none overflow-hidden">
                            <div 
                              className="h-full bg-[#1A1A1A] transition-all duration-300"
                              style={{ width: `${((currentQuestionIdx) / quiz.questions.length) * 100}%` }}
                            />
                          </div>

                          {/* Question details */}
                          <div className="p-6 bg-[#FDFCF8] border border-[#1A1A1A] rounded-none space-y-5">
                            <h4 className="font-serif font-bold text-[#1A1A1A] text-lg leading-snug">{quiz.questions[currentQuestionIdx].question}</h4>

                            {/* Option list */}
                            <div className="space-y-3">
                              {quiz.questions[currentQuestionIdx].options.map((option, idx) => {
                                const isSelected = selectedOptionIdx === idx;
                                const isCorrectAnswer = idx === quiz.questions[currentQuestionIdx].correctAnswerIndex;
                                
                                let cardStyles = "border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-[#F2EFE9]/40 rounded-none";
                                let dotStyles = "border-[#1A1A1A]/20";

                                if (quizSubmitted) {
                                  if (isCorrectAnswer) {
                                    cardStyles = "border-emerald-700 bg-emerald-50 text-emerald-950 rounded-none";
                                    dotStyles = "border-emerald-700 bg-emerald-700 text-white";
                                  } else if (isSelected) {
                                    cardStyles = "border-red-700 bg-red-50 text-red-950 rounded-none";
                                    dotStyles = "border-red-700 bg-red-700 text-white";
                                  } else {
                                    cardStyles = "border-neutral-100 bg-[#FDFCF8] opacity-50 rounded-none";
                                    dotStyles = "border-neutral-200";
                                  }
                                } else if (isSelected) {
                                  cardStyles = "border-[#1A1A1A] bg-[#F2EFE9] text-[#1A1A1A] rounded-none";
                                  dotStyles = "border-[#1A1A1A] bg-[#1A1A1A] text-[#FDFCF8]";
                                }

                                return (
                                  <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    disabled={quizSubmitted}
                                    className={`w-full p-4 text-left transition flex items-start gap-3.5 group font-medium ${cardStyles}`}
                                  >
                                    <span className={`w-5 h-5 border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold font-mono transition-all rounded-none ${dotStyles}`}>
                                      {isSelected || (quizSubmitted && isCorrectAnswer) ? (
                                        <Check className="w-3 h-3 text-white" />
                                      ) : (
                                        String.fromCharCode(65 + idx)
                                      )}
                                    </span>
                                    <span className="text-sm">{option}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanations block */}
                            {quizSubmitted && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-none border text-xs leading-relaxed space-y-1.5 ${
                                  selectedOptionIdx === quiz.questions[currentQuestionIdx].correctAnswerIndex
                                    ? "bg-emerald-50/70 border-emerald-100 text-emerald-800"
                                    : "bg-red-50/70 border-red-100 text-red-800"
                                }`}
                              >
                                <p className="font-bold uppercase tracking-wider text-[10px]">
                                  {selectedOptionIdx === quiz.questions[currentQuestionIdx].correctAnswerIndex 
                                    ? "✓ Correct Answer!" 
                                    : "✗ Incorrect Choice"}
                                </p>
                                <p>{quiz.questions[currentQuestionIdx].explanation}</p>
                              </motion.div>
                            )}

                            {/* Submit or Next Buttons */}
                            <div className="flex items-center justify-end pt-2">
                              {!quizSubmitted ? (
                                <button
                                  onClick={handleSubmitAnswer}
                                  disabled={selectedOptionIdx === null}
                                  className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed text-[#FDFCF8] rounded-none text-xs font-bold transition uppercase tracking-wider"
                                >
                                  Submit Answer
                                </button>
                              ) : (
                                <button
                                  onClick={handleNextQuestion}
                                  className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-neutral-800 text-[#FDFCF8] rounded-none text-xs font-bold transition flex items-center gap-1.5 uppercase tracking-wider"
                                >
                                  {currentQuestionIdx === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* INTERVIEW MODE */}
                  {mode === "interview" && !error && (
                    <div className="flex flex-col h-full space-y-4 animate-fade-in pb-4">
                      {/* Interview Logs scroll-area */}
                      <div className="flex-1 bg-[#FDFCF8] border border-[#1A1A1A] rounded-none p-4 overflow-y-auto space-y-4 min-h-[350px] max-h-[50vh]">
                        {messages.map((msg, idx) => {
                          const isAI = msg.role === "assistant";
                          return (
                            <div 
                              key={idx}
                              className={`flex ${isAI ? "justify-start" : "justify-end"} items-start gap-2.5`}
                            >
                              {isAI && (
                                <div className="w-7 h-7 rounded-none bg-[#1A1A1A] border border-[#1A1A1A] text-[#FDFCF8] flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-[10px]">
                                  AI
                                </div>
                              )}
                              <div className={`p-4 rounded-none max-w-[85%] text-sm ${
                                isAI 
                                  ? "bg-[#F2EFE9] text-[#1A1A1A] border border-[#1A1A1A]/30" 
                                  : "bg-[#1A1A1A] text-white"
                              }`}>
                                <MarkdownView text={msg.content} />
                              </div>
                            </div>
                          );
                        })}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Chat controls input form */}
                      <form onSubmit={handleSendMessage} className="flex gap-2.5">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          disabled={loading}
                          placeholder={`Discuss your answer to the interviewer...`}
                          className="flex-1 px-4 py-3 bg-[#FDFCF8] border border-[#1A1A1A] rounded-none text-sm focus:outline-none focus:bg-[#F2EFE9]/30 text-[#1A1A1A] font-medium"
                        />
                        <button
                          type="submit"
                          disabled={!inputValue.trim() || loading}
                          className="px-4 py-3 bg-[#1A1A1A] hover:bg-neutral-800 disabled:bg-neutral-200 text-white rounded-none text-xs font-bold transition flex items-center justify-center shrink-0"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4.5 h-4.5" />
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
