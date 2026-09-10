/**
 * DIAGNOSTIKA — o'quvchi panelidagi statik ma'lumotlar.
 *
 * ⚠️ CHEGARALAR VA YORLIQLAR SERVER BILAN BIR XIL bo'lishi shart
 * (`helpers/diagnostic.helpers.js`). Ular admin panelida ham xuddi shu
 * qiymatlarda — uch joyda bir xil tushuncha, uch xil rang bo'lib
 * qolmasligi kerak.
 */

import { Brain, ClipboardCheck, Timer, Layers } from "lucide-react";

export const LEVEL_LABELS = {
  easy: "Oson",
  medium: "O'rta",
  hard: "Qiyin",
  expert: "Murakkab",
};

export const LEVEL_BADGE = {
  easy: "bg-emerald-50 text-emerald-700",
  medium: "bg-blue-50 text-blue-700",
  hard: "bg-amber-50 text-amber-700",
  expert: "bg-rose-50 text-rose-700",
};

export const MODE_LABELS = {
  practice: "Amaliyot",
  timed: "Vaqtli imtihon",
  adaptive: "Adaptiv test",
  section: "Bo'lim testi",
};

export const MODE_ICONS = {
  practice: ClipboardCheck,
  timed: Timer,
  adaptive: Brain,
  section: Layers,
};

export const MODE_HINTS = {
  practice: "Vaqt cheklanmagan — xotirjam ishlang",
  timed: "Vaqt cheklangan, real imtihon sharoiti",
  adaptive: "Savollar javobingizga qarab moslashadi",
  section: "Bitta mavzuga fokuslangan",
};

export const ATTEMPT_STATUS = {
  in_progress: { label: "Davom etmoqda", className: "bg-blue-50 text-blue-700" },
  submitted: { label: "Yakunlangan", className: "bg-emerald-50 text-emerald-700" },
  evaluated: { label: "Tahlil qilingan", className: "bg-emerald-50 text-emerald-700" },
  expired: { label: "Vaqti tugagan", className: "bg-amber-50 text-amber-700" },
};

export const GRADE_LABELS = { GOOD: "Yaxshi", MEDIUM: "O'rta", BAD: "Zaif" };

export const GRADE_BADGE = {
  GOOD: "bg-emerald-50 text-emerald-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  BAD: "bg-rose-50 text-rose-700",
};

/**
 * Mavzu darajasi — server `diagnosisTone()` bilan AYNI chegaralar (80 / 50).
 *
 * ⚠️ MA'NO FAQAT RANG BILAN BERILMAYDI: har joyda matn yorlig'i ham
 * chiqadi. Rang ko'rmaydigan o'quvchi uchun bu yagona yo'l.
 */
export const TONES = {
  mastered: { label: "O'zlashtirilgan", color: "#10B981" },
  developing: { label: "Rivojlanmoqda", color: "#CA8A04" },
  gap: { label: "Kamchilik", color: "#EF4444" },
  untested: { label: "Tekshirilmagan", color: "#94A3B8" },
};

export const toneOf = (score) => {
  if (score == null) return "untested";
  if (score >= 80) return "mastered";
  if (score >= 50) return "developing";
  return "gap";
};

export const scoreColor = (score) => TONES[toneOf(score)].color;

/**
 * ⚠️ `sentence` — "Xato tahlili" blokidagi JUMLANING DAVOMI, mustaqil
 * matn emas: u "N ta xatoning X% — " dan keyin qo'yiladi. Tayyor
 * loyihada jumlaning oxiri qotib qolgan edi ("...bilim yetishmasligidan
 * emas") va bilim yetishmasligi ustun bo'lgan holatda "bilim
 * yetishmasligidan, bilim yetishmasligidan emas" degan matn chiqardi.
 */
export const ERROR_REASONS = {
  rushing: {
    label: "Shoshilish",
    color: "#CA8A04",
    sentence: "shoshilishdan. Savolni oxirigacha o'qib chiqing.",
  },
  knowledge: {
    label: "Bilim yetishmasligi",
    color: "#EF4444",
    sentence: "mavzuni bilmaslikdan. Quyidagi mavzularni takrorlash kerak.",
  },
  misread: {
    label: "Noto'g'ri tushunish",
    color: "#6366F1",
    sentence: "savolni noto'g'ri tushunishdan. Shartni qayta o'qib chiqing.",
  },
};

/** O'quvchi mustaqil test boshlaganda o'z darajasini tanlaydi. */
export const DECLARED_LEVELS = [
  { value: "beginner", label: "Boshlang'ich", hint: "Mavzuni endi o'rganyapman" },
  { value: "intermediate", label: "O'rta", hint: "Asoslarni bilaman" },
  { value: "advanced", label: "Yuqori", hint: "Murakkab savollarni istayman" },
];

/** Vaqt tugashiga qancha qolganda ogohlantiriladi (soniya). */
export const TIMER_WARNING_SECONDS = 300;
export const TIMER_DANGER_SECONDS = 60;

export const SUBMIT_CONFIRM =
  "Testni yakunlaysizmi? Yakunlangandan keyin javoblarni o'zgartirib bo'lmaydi.";
