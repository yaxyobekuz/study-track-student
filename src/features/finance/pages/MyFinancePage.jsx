// React
import { useState } from "react";

// Icons
import {
  AlertCircle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  History,
  PiggyBank,
  Snowflake,
  Sun,
  Wallet,
} from "lucide-react";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Utils
import { cn } from "@/shared/utils/cn";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatUzDate } from "@/shared/utils/formatDate";

// Components
import Card from "@/shared/components/ui/Card";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import BackHeader from "@/shared/components/layout/BackHeader";

// Data & queries
import {
  ALLOCATION_SOURCE_LABELS,
  FINANCE_STATUS_META,
  INVOICE_STATUS_META,
  MOVEMENT_TYPE_META,
  SKIP_REASON_LABELS,
  TARIFF_REASON_LABELS,
} from "../data/finance.data";
import { financeQueries } from "../queries/finance.queries";

/**
 * "Mening moliyam" — o'quvchi to'rt savolga javob topadigan sahifa:
 * qancha qarzim bor, qaysi oylarni to'laganman, hisobimda pul bormi va
 * qanday tarif/chegirma bilan o'qiyman.
 *
 * Oylar ro'yxati SERVERDAN TAYYOR keladi (`timeline`): ta'til oylari ham
 * bor, shuning uchun "yanvarda nega to'lov yo'q?" degan savol tug'ilmaydi.
 */
const MyFinancePage = () => {
  // Qaysi oy ochilgan — to'lovlar tarixini ko'rsatish uchun
  const [openMonth, setOpenMonth] = useState(null);
  const [academicYear, setAcademicYear] = useState(null);
  const [showMovements, setShowMovements] = useState(false);

  const { data, isLoading, isError } = useQuery(
    financeQueries.myFinance(academicYear),
  );

  // O'quvchiga faqat O'ZI o'qigan yillar ko'rsatiladi — admin'dan farqli
  // o'laroq unga "men o'qimagan yil" tugmasi kerak emas. Ochilgan yil har
  // doim ro'yxatda qoladi (aks holda tanlangan tugma g'oyib bo'lardi).
  const yearTabs = (data?.academicYears ?? []).filter(
    (year) => year.isEnrolled || year.academicYear === data?.academicYear,
  );

  const totals = data?.totals;
  const timeline = data?.timeline ?? [];
  const movements = data?.movements ?? [];
  const statusMeta = FINANCE_STATUS_META[data?.financeStatus?.status ?? "active"];

  const hasDebt = Number(totals?.debt ?? 0) > 0;
  const balance = Number(data?.balance ?? 0);

  const paidMonths = totals?.paidMonths ?? 0;
  // O'quvchi O'ZI o'qigan va HOZIRGA QADAR KELGAN oylar — yanvardan kelgan
  // bola "8 oydan" emas, "5 oydan" ko'radi; sentabrda boshlanadigan yil esa
  // avgustda "9 oydan 0-si" bo'lib, u 9 oy qarzdordek ko'rinmaydi.
  // Maktab bo'yicha son (billableMonths) hisobotlarda qoladi.
  const billableMonths =
    totals?.dueMonths ?? totals?.enrolledMonths ?? totals?.billableMonths ?? 0;
  const progress =
    billableMonths > 0 ? Math.round((paidMonths / billableMonths) * 100) : 0;

  return (
    <div className="animate__animated animate__fadeIn min-h-screen bg-gray-100 pb-28">
      <BackHeader href="/dashboard" title="Mening moliyam" />

      <div className="container space-y-5 pt-5">
        {isLoading ? (
          <LoaderCard />
        ) : isError ? (
          <Card className="text-center">
            <AlertCircle className="mx-auto size-8 text-red-400" />
            <p className="mt-2 text-sm text-gray-500">
              Moliya ma'lumotini yuklab bo'lmadi
            </p>
          </Card>
        ) : (
          <>
            {/* O'quv yili tanlagichi — "o'zim o'qigan davrlar" */}
            {yearTabs.length > 1 && (
              <div className="hidden-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
                {yearTabs.map((year) => (
                  <button
                    key={year.academicYear}
                    type="button"
                    onClick={() => {
                      setAcademicYear(year.academicYear);
                      setOpenMonth(null);
                    }}
                    className={cn(
                      "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                      year.academicYear === data.academicYear
                        ? "bg-primary text-white"
                        : "bg-white text-gray-600",
                    )}
                  >
                    {year.label}
                  </button>
                ))}
              </div>
            )}

            {/* Qarz kartasi */}
            <div
              className={cn(
                "rounded-2xl p-5 text-white",
                hasDebt
                  ? "bg-gradient-to-br from-red-500 to-rose-600"
                  : "bg-gradient-to-br from-emerald-500 to-green-600",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm opacity-90">
                  {hasDebt ? "Qolgan qarz" : "Qarzingiz yo'q"}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {data.financeStatus.status === "frozen" && (
                    <Snowflake className="size-3" />
                  )}
                  {statusMeta.label}
                </span>
              </div>

              <p className="mt-2 text-3xl font-bold">{formatMoney(totals?.debt)}</p>

              <p className="mt-1 text-xs opacity-90">
                {data.academicYearLabel} o'quv yili bo'yicha hisoblangan{" "}
                {formatMoney(totals?.invoiced)}, to'langan{" "}
                {formatMoney(totals?.paid)}
              </p>
            </div>

            {/* Hisob balansi — oldindan to'langan pul */}
            {balance > 0 && (
              <Card
                title="Hisobingizdagi pul"
                icon={<PiggyBank className="size-5 text-primary" />}
              >
                <p className="mt-2 text-2xl font-bold text-blue-600">
                  {formatMoney(data.balance)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Oldindan to'langan — keyingi oylik to'lovlaringizdan
                  avtomatik yechiladi.
                </p>

                {movements.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowMovements((prev) => !prev)}
                    className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary"
                  >
                    <History className="size-4" />
                    Harakatlar tarixi
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        showMovements && "rotate-180",
                      )}
                    />
                  </button>
                )}

                {showMovements && (
                  <div className="mt-3 space-y-2 rounded-xl bg-gray-50 p-3">
                    {movements.slice(0, 15).map((item) => {
                      const meta = MOVEMENT_TYPE_META[item.type];
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <div className="min-w-0">
                            <p className={cn("truncate", meta?.className)}>
                              {meta?.label ?? item.label}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatUzDate(item.occurredAt)}
                              {item.description ? ` · ${item.description}` : ""}
                            </p>
                          </div>

                          <span
                            className={cn(
                              "shrink-0 font-medium",
                              item.direction === "in"
                                ? "text-green-600"
                                : "text-gray-500",
                            )}
                          >
                            {item.direction === "in" ? "+" : "−"}
                            {formatMoney(item.amount)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}

            {/* Tarif, chegirma va o'quv yili */}
            <Card
              title="Tarif va o'quv yili"
              icon={<CalendarDays className="size-5 text-primary" />}
            >
              <div className="mt-3 space-y-3">
                {data.tariff ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          {data.tariff.name}
                        </p>
                        <p className="text-xs text-gray-500">Oylik to'lov</p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-gray-900">
                          {formatMoney(data.tariff.effectiveMonthly)}
                        </p>
                        {Number(data.tariff.discountAmount) > 0 && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatMoney(data.tariff.monthlyAmount)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Chegirmalar — "nega arzonroq?" savoliga javob */}
                    {data.tariff.discounts?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {data.tariff.discounts.map((discount) => (
                          <span
                            key={discount.id}
                            className="rounded-lg bg-blue-50 px-2 py-1 text-xs text-blue-700"
                          >
                            {discount.name} · {discount.valueLabel}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    {TARIFF_REASON_LABELS[data.tariffReason] ??
                      "Tarif ma'lumoti yo'q"}
                  </p>
                )}

                {/* To'lov progressi — ta'til oylari hisobga olingan */}
                {billableMonths > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {billableMonths} oydan {paidMonths}-si to'langan
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {data.vacationMonths?.length > 0 && (
                  <p className="flex items-start gap-1.5 text-xs text-amber-700">
                    <Sun className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      Ta'til oylari:{" "}
                      {data.vacationMonths.map((m) => m.monthLabel).join(", ")} —
                      bu oylar uchun to'lov yozilmaydi.
                    </span>
                  </p>
                )}
              </div>
            </Card>

            {/* Oylar */}
            <Card
              title="Oylik to'lovlar"
              icon={<Wallet className="size-5 text-primary" />}
            >
              {timeline.length === 0 ? (
                <p className="mt-3 py-4 text-center text-sm text-gray-500">
                  Hali to'lov majburiyati shakllantirilmagan
                </p>
              ) : (
                <div className="mt-3 divide-y divide-gray-100">
                  {timeline.map((row) => (
                    <MonthRow
                      key={row.month}
                      row={row}
                      isOpen={openMonth === row.month}
                      onToggle={() =>
                        setOpenMonth(openMonth === row.month ? null : row.month)
                      }
                    />
                  ))}
                </div>
              )}
            </Card>

            <p className="pb-2 text-center text-xs text-gray-400">
              To'lovlar qabulxona orqali qayd etiladi
            </p>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Bitta oy qatori.
 *
 * Uch xil holat bo'lishi mumkin: ta'til (to'lov yo'q), hisob-faktura bor
 * (to'langan/qarz), yoki hali shakllantirilmagan (kelgusi oy).
 */
const MonthRow = ({ row, isOpen, onToggle }) => {
  const invoice = row.invoice;
  const badge = invoice ? INVOICE_STATUS_META[invoice.status] : null;
  const payments = invoice?.payments ?? [];
  const isPaid = invoice?.status === "paid";

  if (row.isVacation) {
    return (
      <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <Sun className="size-4.5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">{row.monthLabel}</p>
          <p className="text-xs text-amber-700">Ta'til — to'lov yo'q</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 opacity-60">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <CalendarDays className="size-4.5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">{row.monthLabel}</p>
          <p className="text-xs text-gray-500">
            {SKIP_REASON_LABELS[row.skipReason] ??
              (row.isFuture ? "Hali kelmagan" : "Hisoblanmagan")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <button
        type="button"
        onClick={onToggle}
        disabled={payments.length === 0}
        className="flex w-full items-center gap-3 text-left"
      >
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            isPaid ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500",
          )}
        >
          {isPaid ? (
            <CheckCircle2 className="size-4.5" />
          ) : (
            <Banknote className="size-4.5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">{row.monthLabel}</p>
          <span
            className={cn(
              "mt-0.5 inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium",
              badge.className,
            )}
          >
            {badge.label}
          </span>
          {invoice.hasDiscount && (
            <span className="ml-1 text-[11px] text-blue-600">
              −{formatMoney(invoice.discountAmount)} chegirma
            </span>
          )}
          {/* Oy o'rtasida kelgan — o'sha oy ulushga hisoblangan */}
          {row.isProrated && (
            <span className="ml-1 text-[11px] text-amber-700">
              qisman oy · {row.billableDays}/{row.monthDays} kun
            </span>
          )}
        </div>

        <div className="shrink-0 text-right">
          <p className="font-semibold text-gray-900">
            {formatMoney(invoice.amount)}
          </p>
          {!isPaid && invoice.status !== "cancelled" && (
            <p className="text-xs text-red-500">
              qoldiq {formatMoney(invoice.debt)}
            </p>
          )}
        </div>

        {payments.length > 0 && (
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-gray-400 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        )}
      </button>

      {/* To'lovlar tarixi — chek raqami bilan */}
      {isOpen && payments.length > 0 && (
        <div className="mt-2 space-y-1.5 rounded-xl bg-gray-50 p-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate text-gray-600">
                  {formatUzDate(payment.paidAt)} ·{" "}
                  {ALLOCATION_SOURCE_LABELS[payment.source] ?? ""}
                </p>
                <p className="font-mono text-xs text-gray-400">
                  {payment.receiptLabel}
                </p>
              </div>

              <span className="shrink-0 font-medium text-green-600">
                +{formatMoney(payment.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFinancePage;
