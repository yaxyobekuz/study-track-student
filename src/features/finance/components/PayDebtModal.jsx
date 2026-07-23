// React
import { useRef, useState } from "react";

// Toast
import { toast } from "sonner";

// Icons
import { Copy, Upload, CheckCircle2, CreditCard, Loader2 } from "lucide-react";

// Utils
import { cn } from "@/shared/utils/cn";

// Data
import { paymentCards } from "@/features/finance/data/cards.data";

// Components
import ModalWrapper from "@/shared/components/ui/ModalWrapper";
import Button from "@/shared/components/ui/button/Button";

// Mutations
import { useCreatePaymentRequest } from "@/features/finance/queries/finance.mutations";

const fmtSom = (n) => new Intl.NumberFormat("ru-RU").format(Math.round(Number(n) || 0));

// Rasmni siqib, base64 data URL ga aylantiradi (hajmni kichraytirish uchun).
function fileToCompressedDataURL(file, maxW = 1200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const PayDebtModal = () => (
  <ModalWrapper name="payDebt" title="Qarzni to'lash" description="Karta orqali to'lab, chekni yuboring">
    <Content />
  </ModalWrapper>
);

const Content = ({ close, qoldiq = 0, studentName = "", studentId = null }) => {
  const fileRef = useRef(null);

  const [mode, setMode] = useState("full"); // full | partial
  const [amountRaw, setAmountRaw] = useState("");
  const [card, setCard] = useState(paymentCards[0]?.id ?? "UZCARD");
  const [receipt, setReceipt] = useState(null); // dataURL
  const [processing, setProcessing] = useState(false);

  const partial = amountRaw ? parseInt(amountRaw, 10) : 0;
  const amount = mode === "full" ? qoldiq : partial;
  const amountValid = amount > 0 && amount <= qoldiq;

  const copyCard = (number) => {
    navigator.clipboard?.writeText(number.replace(/\s/g, ""));
    toast.success("Karta raqami nusxalandi");
  };

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm yuklang");
      return;
    }
    try {
      setProcessing(true);
      const dataUrl = await fileToCompressedDataURL(file);
      setReceipt(dataUrl);
    } catch {
      toast.error("Rasmni o'qib bo'lmadi");
    } finally {
      setProcessing(false);
    }
  };

  const mutation = useCreatePaymentRequest();

  const submit = () =>
    mutation.mutate(
      { name: studentName, studentId, amount, card, receipt },
      {
        onSuccess: () => {
          toast.success("So'rovingiz yuborildi! Admin tasdiqlashini kuting.");
          close();
        },
        onError: (err) => {
          toast.error(err.response?.data?.error || "Xatolik yuz berdi");
        },
      },
    );

  const canSubmit = amountValid && receipt && !mutation.isPending && !processing;

  return (
    <div className="space-y-4">
      {/* 1. Summa */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">1. Qancha to'laysiz?</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode("full")}
            className={cn(
              "rounded-xl border p-3 text-left transition-colors",
              mode === "full" ? "border-blue-500 bg-blue-50" : "border-gray-200",
            )}
          >
            <span className="block text-xs text-gray-500">To'liq</span>
            <span className="block text-sm font-bold text-gray-900">{fmtSom(qoldiq)} so'm</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("partial")}
            className={cn(
              "rounded-xl border p-3 text-left transition-colors",
              mode === "partial" ? "border-blue-500 bg-blue-50" : "border-gray-200",
            )}
          >
            <span className="block text-xs text-gray-500">Bo'lib (qisman)</span>
            <span className="block text-sm font-bold text-gray-900">O'zingiz kiriting</span>
          </button>
        </div>

        {mode === "partial" && (
          <div className="relative">
            <input
              inputMode="numeric"
              value={amountRaw ? fmtSom(partial) : ""}
              onChange={(e) => setAmountRaw(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="h-11 w-full rounded-xl border border-gray-200 px-3 pr-12 text-right text-base font-semibold outline-none focus:border-blue-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">so'm</span>
            {partial > qoldiq && (
              <p className="mt-1 text-xs text-red-500">Qarzdan ko'p bo'lishi mumkin emas ({fmtSom(qoldiq)})</p>
            )}
          </div>
        )}
      </div>

      {/* 2. Kartalar */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">2. Quyidagi kartalardan biriga o'tkazing</p>
        {paymentCards.map((c) => (
          <div
            key={c.id}
            onClick={() => setCard(c.id)}
            className={cn(
              "cursor-pointer rounded-xl border p-3 transition-colors",
              card === c.id ? "border-blue-500 bg-blue-50" : "border-gray-200",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                <CreditCard className="size-4 text-blue-600" /> {c.type}
              </span>
              {card === c.id && <CheckCircle2 className="size-4 text-blue-600" />}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-semibold tracking-wide text-gray-900">{c.number}</p>
                <p className="text-xs text-gray-500">{c.holder}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  copyCard(c.number);
                }}
                className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-blue-600 hover:bg-blue-50"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Chek yuklash */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">
          3. To'lov chekini (screenshot) yuklang
        </p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
        {receipt ? (
          <div className="relative overflow-hidden rounded-xl border border-gray-200">
            <img src={receipt} alt="Chek" className="max-h-56 w-full object-contain bg-gray-50" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-2 right-2 rounded-lg bg-white/90 px-3 py-1 text-xs font-medium shadow"
            >
              O'zgartirish
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={processing}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 py-8 text-blue-600 transition-colors hover:bg-blue-50"
          >
            {processing ? <Loader2 className="size-7 animate-spin" /> : <Upload className="size-7" />}
            <span className="text-sm font-medium">Chek rasmini tanlang</span>
          </button>
        )}
      </div>

      {/* Submit */}
      <Button
        onClick={submit}
        disabled={!canSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
      >
        {mutation.isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Yuborilmoqda…
          </span>
        ) : (
          `So'rov yuborish · ${fmtSom(amount)} so'm`
        )}
      </Button>
      <p className="text-center text-xs text-gray-400">
        Admin chekni tekshirib tasdiqlagach to'lov hisobingizga o'tadi.
      </p>
    </div>
  );
};

export default PayDebtModal;
