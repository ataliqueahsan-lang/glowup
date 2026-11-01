export type StoryScene = {
  chapter: string;
  title: string;
  caption: string;
  /** Horizontal framing on portrait screens, as a % of the artwork width (negative shows more of the left side). */
  shift: number;
  /** On portrait screens, slowly pan across the artwork while the scene plays. */
  pan?: boolean;
};

export const STORY_TITLE = "A Little More You";

export const STORY_SCENES: StoryScene[] = [
  {
    chapter: "01",
    title: "A new world",
    caption:
      "Late afternoon on a new campus. Voices everywhere, friends already walking in step, and a path that is yours to start.",
    shift: 0,
  },
  {
    chapter: "02",
    title: "The unspoken thoughts",
    caption:
      "Everyone else seems to know what to say. You have words too. They just need a moment to find their way out.",
    shift: -8,
  },
  {
    chapter: "03",
    title: "Small moments",
    pan: true,
    caption:
      "A seat, a raised hand, an idea shared. Nothing dramatic, just you, a little more often, and still very much yourself.",
    shift: 0,
  },
  {
    chapter: "04",
    title: "Finding your rhythm",
    caption:
      "Some friendships are loud. Some are a quiet conversation on the steps. Both count, and neither asks you to change.",
    shift: 5,
  },
  {
    chapter: "05",
    title: "Your story continues",
    caption:
      "GlowUp is a calm place to find your words, practise a conversation, and try again, at your own pace.",
    shift: 0,
  },
];
