export const glowupTools = [
  {
    id: "message-helper",
    href: "/tools/message-helper",
    number: "01",
    title: "Message Helper",
    tagline: "Say what you mean, in your own voice.",
    description:
      "Shape everyday messages so they sound clear, kind, and like you, whether you are writing a classmate, a professor, or a group chat.",
    detail: "Pick who it is for and how you want to sound, then compare versions.",
    samplePrompts: [
      "Asking a classmate if they would like to study together",
      "Writing a respectful clarification email to a professor",
      "Replying to a group chat after being offline",
      "Declining an invitation kindly, without guilt",
    ],
    highlights: [
      "Choose who it is for, the tone, and what you want help with",
      "Copy a version, ask for another, or compare it with your original",
      "Your message stays yours: edit it and try again any time",
    ],
    identity: "coral",
  },
  {
    id: "conversation-coach",
    href: "/tools/conversation-coach",
    number: "02",
    title: "Conversation Coach",
    tagline: "Walk into the moment with a first step.",
    description:
      "Explore openers, follow-ups, and graceful exits for the social situations college life actually throws at you.",
    detail: "Seven everyday situations, from a first hello to leaving politely.",
    samplePrompts: [
      "Sitting next to someone new before a lecture",
      "Leaving a conversation without an awkward fade-out",
      "Finding common ground in a campus club",
      "Handling a pause without rushing to fill it",
    ],
    highlights: [
      "Three openers that fit the setting",
      "Follow-up questions and ideas for different replies",
      "Tips for reading the moment and respecting boundaries",
    ],
    identity: "peach",
  },
  {
    id: "practice-mode",
    href: "/tools/practice-mode",
    number: "03",
    title: "Practice Mode",
    tagline: "Rehearse the moment before it arrives.",
    description:
      "Role-play an everyday conversation at your own pace, so it feels more familiar when it happens for real.",
    detail: "Six scenarios, up to ten turns, and gentle feedback. No scores, no timers.",
    samplePrompts: [
      "Introducing yourself during orientation",
      "Sharing a viewpoint in a small seminar",
      "Asking a question during office hours",
    ],
    highlights: [
      "Six everyday scenarios with a simulated partner",
      "Take as many turns as you like, up to ten, with no clock",
      "Feedback on five areas in plain words, without scores",
    ],
    identity: "plum",
  },
] as const;

export type GlowUpTool = (typeof glowupTools)[number];
export type ToolId = GlowUpTool["id"];
