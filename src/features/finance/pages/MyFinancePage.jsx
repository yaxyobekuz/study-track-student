// Icons
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  Banknote,
  CreditCard,
  TrendingUp,
} from "lucide-react";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Hooks
import useMe from "@/features/auth/hooks/useMe";

// Utils
import { cn } from "@/shared/utils/cn";
import { formatUzDate } from "@/shared/utils/formatDate";

// Components
import Card from "@/shared/components/ui/Card";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import BackHeader from "@/shared/components/layout/BackHeader";

// API
import { financeAPI } from "@/features/finance/api/finance.api";

// So'm formatlash: 1000000 -> "1 000 000"
const fmtSom = (n) =>
  new Intl.NumberFormat("ru-RU").format(Math.round(Number(n) || 0));

const MyFinancePage = () => {
  const { me } = useMe();
  const fullName = me?.fullName || "";

  const { data, isLoading, isError } = useQuery({
    enabled: !!fullName,
    queryKey: ["molia", "finance", fullName],
    queryFn: () => financeAPI.getMyFinance(fullName).then((res) => res.data),
  });

  const found = data?.found;
  const s = data?.student;
  const payments = data?.payments ?? [];

  const qoldiq = s?.qoldiq ?? 0;
  const isDebtor = qoldiq > 0;
  const isOver = qoldiq < 0;

  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <BackHeader href="/dashboard" title="Mening moliyam" />

      <div className="container pt-5 space-y-5">
        {isLoading ? (
          <LoaderCard className="bg-transparent p-0 xs:p-0" />
        ) : isError ? (
          <Card className="text-center space-y-2">
            <AlertCircle className="size-10 mx-auto text-red-400" />
            <p className="text-sm text-gray-500">
              Moliya ma'lumotini yuklab bo'lmadi. Keyinroq urinib ko'ring.
            </p>
          </Card>
        ) : !found ? (
          <Card className="text-center space-y-2">
            <Wallet className="size-10 mx-auto text-gray-300" />
            <p className="text-sm font-medium text-gray-700">
              Ma'lumot topilmadi
            </p>
            <p className="text-xs text-gray-500">
              Moliya bazasida sizning ismingiz topilmadi. Iltimos, ma'mur bilan
              bog'laning.
            </p>
          </Card>
        ) : (
          <>
            {/* Asosiy qoldiq kartasi */}
            <Card
              className={cn(
                "text-white",
                isDebtor
                  ? "bg-gradient-to-br from-red-400 to-red-600"
                  : isOver
                    ? "bg-gradient-to-br from-violet-400 to-violet-600"
                    : "bg-gradient-to-br from-green-400 to-green-600",
              )}
            >
              <div className="flex items-center gap-2 text-white/90 text-sm">
                {isDebtor ? (
                  <AlertCircle className="size-4" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                {isDebtor
                  ? "Qolgan qarz"
                  : isOver
                    ? "Ortiqcha to'lov"
                    : "Qarzingiz yo'q"}
              </div>
              <div className="mt-2 text-4xl font-bold">
                {fmtSom(Math.abs(qoldiq))}
                <span className="ml-1 text-lg font-medium text-white/80">
                  so'm
                </span>
              </div>
              <div className="mt-1 text-xs text-white/80">
                {s?.group ? `${s.group} · ` : ""}
                {s?.name}
              </div>
            </Card>

            {/* Progress */}
            <Card title="To'lov holati" className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">To'langan</span>
                <span className="font-semibold text-gray-900">
                  {s?.progress ?? 0}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    (s?.progress ?? 0) >= 100
                      ? "bg-green-500"
                      : (s?.progress ?? 0) >= 60
                        ? "bg-blue-500"
                        : "bg-amber-500",
                  )}
                  style={{ width: `${Math.min(s?.progress ?? 0, 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Stat label="Jami to'lov" value={fmtSom(s?.expected)} />
                <Stat label="To'langan" value={fmtSom(s?.paid)} positive />
                <Stat
                  label="Naqd"
                  value={fmtSom(s?.paidNaqd)}
                  icon={Banknote}
                />
                <Stat
                  label="Plastik"
                  value={fmtSom(s?.paidPlastik)}
                  icon={CreditCard}
                />
              </div>
            </Card>

            {/* To'lovlar tarixi */}
            <Card title="To'lovlar tarixi" className="space-y-1">
              {payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <TrendingUp className="size-9 mb-2 opacity-30" />
                  <p className="text-sm">Hali to'lovlar yo'q</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                          {p.method === "plastik" ? (
                            <CreditCard className="size-4" />
                          ) : (
                            <Banknote className="size-4" />
                          )}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {p.notes || p.category}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatUzDate(p.date)}
                            {p.method ? ` · ${p.method}` : ""}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-green-600">
                        +{fmtSom(p.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <p className="text-center text-xs text-gray-400">
              Ma'lumotlar MBSI moliya bazasi bilan sinxron
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value, positive = false, icon: Icon = null }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      {Icon && <Icon className="size-3.5" />}
      {label}
    </div>
    <div
      className={cn(
        "mt-1 text-sm font-bold",
        positive ? "text-green-600" : "text-gray-900",
      )}
    >
      {value} <span className="text-xs font-medium text-gray-400">so'm</span>
    </div>
  </div>
);

export default MyFinancePage;
