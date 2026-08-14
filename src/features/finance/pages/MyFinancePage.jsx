// React
import { useState } from "react";

// Icons
import {
  AlertCircle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Snowflake,
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
  FINANCE_STATUS_META,
  INVOICE_STATUS_META,
  PAYMENT_METHOD_LABELS,
  TARIFF_REASON_LABELS,
  formatMonthKey,
} from "../data/finance.data";
import { financeQueries } from "../queries/finance.queries";

const MyFinancePage = () => {
  // Qaysi majburiyat ochilgan — to'lovlar tarixini ko'rsatish uchun
  const [openId, setOpenId] = useState(null);

  const { data, isLoading, isError } = useQuery(financeQueries.myFinance());

  const invoices = data?.invoices ?? [];
  const totals = data?.totals;
  const statusMeta = FINANCE_STATUS_META[data?.financeStatus?.status ?? "active"];
  const hasDebt = Number(totals?.debt ?? 0) > 0;

  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <BackHeader href="/dashboard" title="Mening moliyam" />

      <div className="container pt-5 space-y-5">
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

              <p className="mt-2 text-3xl font-bold">
                {formatMoney(totals?.debt)}
              </p>

              <p className="mt-1 text-xs opacity-90">
                {data.academicYearLabel} o'quv yili bo'yicha hisoblangan{" "}
                {formatMoney(totals?.invoiced)}, to'langan{" "}
                {formatMoney(totals?.paid)}
              </p>
            </div>

            {/* Tarif va o'quv yili */}
            <Card title="Tarif va o'quv yili" icon={<CalendarDays className="size-5 text-primary" />}>
              <div className="mt-3 space-y-3">
                {data.tariff ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">
                        {data.tariff.name}
                      </p>
                      <p className="text-xs text-gray-500">Oylik to'lov</p>
                    </div>
                    <p className="shrink-0 font-semibold text-gray-900">
                      {formatMoney(data.tariff.monthlyAmount)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    {TARIFF_REASON_LABELS[data.tariffReason] ??
                      "Tarif ma'lumoti yo'q"}
                  </p>
                )}

                {/* O'quv yilining nechanchi oyi ketayotgani */}
                {data.isAcademicMonth ? (
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {data.academicMonthCount} oydan {data.academicIndex}-si
                      </span>
                      <span>{formatMonthKey(data.currentMonth)}</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{
                          width: `${Math.round((data.academicIndex / data.academicMonthCount) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    {formatMonthKey(data.currentMonth)} — o'quv yiliga kirmaydi,
                    bu oy uchun to'lov hisoblanmaydi
                  </p>
                )}
              </div>
            </Card>

            {/* Oylik majburiyatlar */}
            <Card title="Oylik to'lovlar" icon={<Wallet className="size-5 text-primary" />}>
              {invoices.length === 0 ? (
                <p className="mt-3 py-4 text-center text-sm text-gray-500">
                  Hali to'lov majburiyati shakllantirilmagan
                </p>
              ) : (
                <div className="mt-3 divide-y divide-gray-100">
                  {invoices.map((invoice) => {
                    const badge = INVOICE_STATUS_META[invoice.status];
                    const isOpen = openId === invoice.id;
                    const payments = invoice.payments ?? [];

                    return (
                      <div key={invoice.id} className="py-3 first:pt-0 last:pb-0">
                        <button
                          type="button"
                          onClick={() => setOpenId(isOpen ? null : invoice.id)}
                          className="flex w-full items-center gap-3 text-left"
                        >
                          <div
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-full",
                              invoice.status === "paid"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-500",
                            )}
                          >
                            {invoice.status === "paid" ? (
                              <CheckCircle2 className="size-4.5" />
                            ) : (
                              <Banknote className="size-4.5" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900">
                              {formatMonthKey(invoice.month)}
                            </p>
                            <span
                              className={cn(
                                "mt-0.5 inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                                badge.className,
                              )}
                            >
                              {badge.label}
                            </span>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="font-semibold text-gray-900">
                              {formatMoney(invoice.amount)}
                            </p>
                            {invoice.status !== "paid" && (
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

                        {/* To'lovlar tarixi */}
                        {isOpen && payments.length > 0 && (
                          <div className="mt-2 space-y-1.5 rounded-xl bg-gray-50 p-3">
                            {payments.map((payment) => (
                              <div
                                key={payment.id}
                                className="flex items-center justify-between gap-3 text-sm"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <CreditCard className="size-3.5 shrink-0 text-gray-400" />
                                  <span className="truncate text-gray-500">
                                    {formatUzDate(payment.paidAt)} ·{" "}
                                    {PAYMENT_METHOD_LABELS[payment.method] ??
                                      payment.method}
                                  </span>
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
                  })}
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

export default MyFinancePage;
