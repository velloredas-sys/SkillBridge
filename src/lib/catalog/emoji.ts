/** Small curated emoji set for the DM composer's emoji picker. Static and
 * local on purpose — no network/API call needed to open it. */
export const EMOJI_GROUPS: { label: string; emoji: string[] }[] = [
  {
    label: "Smileys",
    emoji: [
      "😀", "😁", "😂", "🤣", "😊", "😍", "😘", "😉", "😎", "🤔",
      "😅", "🙃", "😇", "🥳", "😴", "🤯", "😭", "😡", "🥺", "😬",
    ],
  },
  {
    label: "Gestures",
    emoji: [
      "👍", "👎", "👏", "🙌", "🙏", "🤝", "💪", "✌️", "👋", "🤞",
    ],
  },
  {
    label: "Hearts",
    emoji: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💯", "🔥"],
  },
  {
    label: "Work & study",
    emoji: [
      "🚀", "💻", "📚", "📝", "🎯", "✅", "⏰", "🏆", "🎓", "💡",
      "📈", "🛠️", "🧠", "☕", "📌",
    ],
  },
  {
    label: "Celebrate",
    emoji: ["🎉", "🎊", "👏", "🥂", "🍾", "⭐", "✨", "😄"],
  },
];
