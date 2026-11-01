// Shared options for the three tools. Safe to import from client components.

export const MAX_MESSAGE_CHARS = 1200;
export const MAX_CONTEXT_CHARS = 600;
export const MAX_TURN_CHARS = 500;
export const MAX_PRACTICE_TURNS = 10;

export type Option = { id: string; label: string };

export const RECIPIENTS = [
  { id: "classmate", label: "Classmate" },
  { id: "friend", label: "Friend" },
  { id: "professor", label: "Professor" },
  { id: "group", label: "College group" },
  { id: "someone-new", label: "Someone I just met" },
] as const;

export const TONES = [
  { id: "friendly", label: "Friendly" },
  { id: "polite", label: "Polite" },
  { id: "confident", label: "Confident" },
  { id: "casual", label: "Casual" },
  { id: "professional", label: "Professional" },
] as const;

export const OBJECTIVES = [
  { id: "clearer", label: "Make my message clearer" },
  { id: "natural", label: "Make it sound more natural" },
  { id: "less-awkward", label: "Make it less awkward" },
  { id: "polite", label: "Make it more polite" },
  { id: "start-conversation", label: "Help me start a conversation" },
] as const;

export const SITUATIONS = [
  { id: "start-classmate", label: "Starting a conversation with a classmate" },
  { id: "join-group", label: "Joining a group conversation" },
  { id: "talk-professor", label: "Talking to a professor" },
  { id: "meet-first-time", label: "Meeting someone for the first time" },
  { id: "awkward-continue", label: "Continuing an awkward conversation" },
  { id: "end-politely", label: "Politely ending a conversation" },
  { id: "ask-help", label: "Asking someone for help with coursework" },
] as const;

export const SCENARIOS = [
  {
    id: "new-classmate",
    title: "Meeting a new classmate",
    description:
      "You are early to a lecture hall and someone you have not met yet sits down next to you.",
    partnerName: "Ananya",
    opening: "Hey, is this seat taken? I think I'm in the right room, this is the data structures lecture, right?",
  },
  {
    id: "intro-in-class",
    title: "Introducing yourself in class",
    description:
      "It is the first week. Your instructor asks everyone to say a little about themselves.",
    partnerName: "Prof. Mehta",
    opening: "Alright everyone, let's go around the room. Could you tell us your name and what made you pick this course?",
  },
  {
    id: "join-group",
    title: "Joining a college group",
    description:
      "A few students from a club are chatting before a meeting starts. You would like to join in.",
    partnerName: "Kabir",
    opening: "Oh hey, come on in. We were just trying to decide what to do for the club's welcome event. Have you been to any of our meetings before?",
  },
  {
    id: "small-talk",
    title: "Making small talk",
    description:
      "You are waiting outside the canteen with a classmate you know a little. The line is moving slowly.",
    partnerName: "Neha",
    opening: "This line is taking forever. Did you get a chance to look at the assignment yet?",
  },
  {
    id: "lecture-question",
    title: "Asking a question during a lecture",
    description:
      "Your professor just explained something and you did not fully follow it. Others seem fine.",
    partnerName: "Prof. Rao",
    opening: "So that's how the algorithm picks the next node each time. Any questions before I move on?",
  },
  {
    id: "college-event",
    title: "Starting a conversation at a college event",
    description:
      "You are at a freshers' mixer. You know almost nobody and someone is standing near the snacks.",
    partnerName: "Ishaan",
    opening: "The samosas here are surprisingly good. Are you in first year too?",
  },
] as const;
