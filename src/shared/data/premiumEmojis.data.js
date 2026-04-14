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
  bloodyHeartEmojiAnimation,
  blueCheckmarkEmojiAnimation,
  goldenCheckmarkEmojiAnimation,
  goldenCrownEmojiAnimation,
  greenCheckmarkEmojiAnimation,
  horizontalStarEmojiAnimation,
  magicPremiumEmojiAnimation,
  mbsiLogoEmojiAnimation,
  premiumStarEmojiAnimation,
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
  12: { animation: bloodyHeartEmojiAnimation, label: "Yurak" },
  13: { animation: blueCheckmarkEmojiAnimation, label: "Ko'k belgi" },
  14: { animation: goldenCheckmarkEmojiAnimation, label: "Oltin belgi" },
  15: { animation: goldenCrownEmojiAnimation, label: "Oltin toj" },
  16: { animation: greenCheckmarkEmojiAnimation, label: "Yashil belgi" },
  17: { animation: horizontalStarEmojiAnimation, label: "Yulduz" },
  18: { animation: magicPremiumEmojiAnimation, label: "Sehr" },
  19: { animation: mbsiLogoEmojiAnimation, label: "MBSI" },
  20: { animation: premiumStarEmojiAnimation, label: "Premium yulduz" },
};

export const getEmojiAnimation = (emojiId) => {
  if (!emojiId) return null;
  return PREMIUM_EMOJI_MAP[emojiId]?.animation || null;
};
