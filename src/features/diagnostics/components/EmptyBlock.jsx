// Components
import Card from "@/shared/components/ui/Card";

/**
 * BO'SH BLOK — "bu yerda nima bo'lishini" aytadigan joy egallovchi.
 *
 * ⚠️ BLOK YASHIRILMAYDI. Ilgari ma'lumot bo'lmasa komponentlar
 * `return null` qilardi va ekran shunchaki bo'sh qolardi: yangi
 * o'quvchi (yoki yangi o'rnatilgan tizim) diagnostikada umuman nima
 * borligini bilmasdi — "hech narsa qo'shilmagan" degan taassurot
 * tug'ilardi.
 *
 * ⚠️ MATN SABABNI AYTADI, "ma'lumot yo'q" bilan cheklanmaydi: o'quvchi
 * nima qilsa bu blok to'lishini bilishi kerak.
 */
const EmptyBlock = ({ title, hint, icon = null }) => (
  <Card title={title} icon={icon}>
    <p className="py-4 text-center text-sm text-gray-400">{hint}</p>
  </Card>
);

export default EmptyBlock;
