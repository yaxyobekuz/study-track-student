// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Icons
import { GraduationCap } from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import BackHeader from "@/shared/components/layout/BackHeader";
import CertificateCard from "../components/CertificateCard";

// Queries
import { certificatesQueries } from "../queries/certificates.queries";

/**
 * MENING SERTIFIKATLARIM — o'quvchining o'z rejalari va muddatlari.
 *
 * ⚠️ FORMA TO'LDIRILGAN VAQT KO'RINMAYDI va u API javobiga ham
 * KELMAYDI (server `forStudent` bilan maydonni butunlay chiqarib
 * tashlaydi): o'quvchiga kerakli narsa — muddat, topshirish vaqti emas.
 * Frontendda yashirish yetarli bo'lmasdi — maydon javobda baribir
 * ko'rinib turardi.
 *
 * ⚠️ TOPSHIRILGANLAR OXIRIDA: ekranning boshida harakat talab qiladigan
 * (muddati yaqin) rejalar turishi kerak. Tartibni server beradi
 * (muddat bo'yicha o'sish, muddatsizlar oxirida), bu yerda faqat
 * topshirilganlar pastga suriladi.
 */
const MyCertificatesPage = () => {
  const { data, isLoading } = useQuery(certificatesQueries.my());

  const plans = data?.plans ?? [];
  const active = plans.filter((plan) => plan.status !== "passed");
  const passed = plans.filter((plan) => plan.status === "passed");

  const overdue = active.filter(
    (plan) => plan.daysLeft !== null && plan.daysLeft < 0,
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 pb-28 animate__animated animate__fadeIn">
      <BackHeader href="/dashboard" title="Sertifikatlarim" />

      <div className="container space-y-4 pt-4">
        {isLoading ? (
          <LoaderCard />
        ) : plans.length === 0 ? (
          <Card className="py-10 text-center">
            <GraduationCap
              className="mx-auto size-10 text-gray-300"
              strokeWidth={1.5}
            />
            <p className="mt-3 font-medium text-gray-900">
              Sertifikat rejasi yo'q
            </p>
            <p className="mx-auto mt-1 max-w-xs text-sm text-gray-500">
              Qaysi sertifikatni qachon topshirmoqchi ekaningizni bildirsangiz,
              muddati shu yerda ko'rinadi.
            </p>
          </Card>
        ) : (
          <>
            {/* Qisqa xulosa */}
            <Card className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejalashtirilgan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {active.length}
                </p>
              </div>

              {overdue > 0 && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Muddati o'tgan</p>
                  <p className="text-2xl font-bold text-red-600">{overdue}</p>
                </div>
              )}

              {passed.length > 0 && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Topshirilgan</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {passed.length}
                  </p>
                </div>
              )}
            </Card>

            {active.map((plan) => (
              <CertificateCard key={plan.id} plan={plan} />
            ))}

            {passed.length > 0 && (
              <>
                <p className="px-1 pt-2 text-sm font-medium text-gray-500">
                  Topshirilgan sertifikatlar
                </p>
                {passed.map((plan) => (
                  <CertificateCard key={plan.id} plan={plan} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyCertificatesPage;
