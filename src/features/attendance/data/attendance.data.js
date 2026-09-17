// "Davomatim" sahifasining qayta ishlatiladigan statik ma'lumotlari.
// Nomlar va ranglar o'qituvchi panelidagi davomat bilan AYNI.

/** Davomat holatlari — ko'rsatish tartibida. */
export const ATTENDANCE_STATUSES = ["present", "late", "absent", "excused"];

export const STATUS_LABELS = {
  present: "Keldi",
  late: "Kech keldi",
  absent: "Kelmadi",
  excused: "Sababli",
};

/** Badge va kalendar katagi uchun. */
export const STATUS_COLORS = {
  present: "bg-green-100 text-green-700",
  late: "bg-yellow-100 text-yellow-700",
  absent: "bg-red-100 text-red-700",
  excused: "bg-blue-100 text-blue-700",
};

/** Kalendar sarlavhasi — hafta dushanbadan boshlanadi. */
export const WEEKDAY_SHORT_LABELS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
