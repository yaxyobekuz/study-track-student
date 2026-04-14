import {
  tvEmojiAnimation,
  bagEmojiAnimation,
  gcapEmojiAnimation,
  timeEmojiAnimation,
  adminEmojiAnimation,
  magicEmojiAnimation,
  folderEmojiAnimation,
  teacherEmojiAnimation,
  greetingEmojiAnimation,
  statsBarEmojiAnimation,
  lockWithKeyEmojiAnimation,
} from "@/shared/assets/animations";

export const PREMIUM_EMOJI_MAP = {
  1: { animation: magicEmojiAnimation, label: "Sehrli" },
  2: { animation: greetingEmojiAnimation, label: "Salom" },
  3: { animation: statsBarEmojiAnimation, label: "Statistika" },
  4: { animation: timeEmojiAnimation, label: "Vaqt" },
  5: { animation: folderEmojiAnimation, label: "Papka" },
  6: { animation: tvEmojiAnimation, label: "Televizor" },
  7: { animation: bagEmojiAnimation, label: "Sumka" },
  8: { animation: gcapEmojiAnimation, label: "Diplom" },
  9: { animation: adminEmojiAnimation, label: "Admin" },
  10: { animation: teacherEmojiAnimation, label: "O'qituvchi" },
  11: { animation: lockWithKeyEmojiAnimation, label: "Qulf" },
};

export const getEmojiAnimation = (emojiId) => {
  if (!emojiId) return null;
  return PREMIUM_EMOJI_MAP[emojiId]?.animation || null;
};
