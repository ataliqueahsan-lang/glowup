export type Mode = "ai" | "demo";

export type MessageHelperResponse = {
  mode: Mode;
  improved: string;
  notes: string[];
};

export type CoachResponse = {
  mode: Mode;
  openers: { line: string; note: string }[];
  followUps: string[];
  replies: { theySay: string; youCouldSay: string }[];
  cues: string[];
  boundaries: string[];
};

export type PracticeTurn = { role: "user" | "partner"; text: string };

export type PracticeReplyResponse = { mode: Mode; reply: string };

export type FeedbackKey =
  | "clarity"
  | "relevance"
  | "naturalness"
  | "respectfulness"
  | "continuation";

export type FeedbackLevel = "Getting started" | "Solid" | "Strong";

export type FeedbackDimension = {
  key: FeedbackKey;
  label: string;
  level: FeedbackLevel;
  note: string;
};

export type PracticeFeedbackResponse = {
  mode: Mode;
  summary: string;
  dimensions: FeedbackDimension[];
  strengths: string[];
  suggestions: string[];
};

export const FEEDBACK_ORDER: { key: FeedbackKey; label: string }[] = [
  { key: "clarity", label: "Clarity" },
  { key: "relevance", label: "Relevance" },
  { key: "naturalness", label: "Naturalness" },
  { key: "respectfulness", label: "Respectfulness" },
  { key: "continuation", label: "Keeping it going" },
];
