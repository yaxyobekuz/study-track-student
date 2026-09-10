// Utils
import { cn } from "@/shared/utils/cn";

// Data
import { LEVEL_LABELS, LEVEL_BADGE } from "../data/diagnostics.data";

/**
 * BITTA SAVOL — diagnostika rejimida EKRANDA YAKKA turadi.
 *
 * ⚠️ SAVOLLAR BIRMA-BIR KO'RSATILADI VA BU ATAYLAB. Diagnostikaning eng
 * qimmatli javobi — "nega xato qilindi": u har savolga KETGAN VAQT va
 * javobning necha marta O'ZGARTIRILGANIDAN hisoblanadi. Barcha savollar
 * bitta ekranda bo'lsa, o'quvchi ular orasida erkin yurgani uchun bu
 * ikkala o'lchov ham ma'nosini yo'qotardi (mavjud "Testlar" bo'limi esa
 * baho qo'yadi, unda bunday o'lchov kerak emas — shuning uchun u yerda
 * hammasi bitta ro'yxatda).
 *
 * @param {object} props
 * @param {object} props.question - muhrlangan savol (javob kalitisiz)
 * @param {number} props.index - joriy tartib (0 dan)
 * @param {number|null} props.total - jami savol (adaptivda noma'lum → null)
 * @param {string[]} props.selected - tanlangan variant id'lari
 * @param {string} props.textAnswer
 * @param {Function} props.onSelect - (optionId) => void
 * @param {Function} props.onText - (value) => void
 * @param {boolean} [props.disabled]
 */
const DiagnosticQuestionCard = ({
  question,
  index,
  total,
  selected = [],
  textAnswer = "",
  onSelect,
  onText,
  disabled = false,
}) => {
  const isMultiple = question.type === "multiple";
  const hasOptions = (question.options || []).length > 0;

  return (
    <div className="space-y-4">
      {/* Sarlavha qatori */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-gray-500">
          {index + 1}
          {total ? `-savol / ${total}` : "-savol"}
        </span>

        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            LEVEL_BADGE[question.difficulty],
          )}
        >
          {LEVEL_LABELS[question.difficulty] || question.difficulty}
        </span>

        {question.topicName && (
          <span className="truncate rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {question.topicName}
          </span>
        )}
      </div>

      {/* Savol */}
      {question.image?.url && (
        <img
          src={question.image.url}
          alt="Savol rasmi"
          className="max-h-72 max-w-full rounded-xl border object-contain"
        />
      )}

      <p className="whitespace-pre-wrap break-words text-lg text-gray-900">
        {question.text}
      </p>

      {isMultiple && (
        <p className="text-xs text-gray-500">
          Bir nechta javob to'g'ri bo'lishi mumkin — barchasini belgilang.
        </p>
      )}

      {/* Javob */}
      {hasOptions ? (
        <div className="space-y-2">
          {question.options.map((option, i) => {
            const isSelected = selected.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => !disabled && onSelect(option.id)}
                disabled={disabled}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-blue-300",
                  disabled && "cursor-not-allowed opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center border-2 text-sm font-medium",
                    // Bir nechta javobli savolda kvadrat, bittasida doira —
                    // shakl "nechta tanlash mumkin" degan savolga matnsiz
                    // ham javob beradi.
                    isMultiple ? "rounded-md" : "rounded-full",
                    isSelected
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 text-gray-500",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>

                <span className="flex flex-1 items-start gap-3">
                  {option.image?.url && (
                    <img
                      src={option.image.url}
                      alt="Variant rasmi"
                      className="max-h-32 max-w-32 shrink-0 rounded-lg border object-cover"
                    />
                  )}
                  {option.text && (
                    <span className="break-words text-gray-900">{option.text}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <textarea
          rows={question.type === "essay" ? 8 : 3}
          value={textAnswer}
          disabled={disabled}
          onChange={(e) => onText(e.target.value)}
          placeholder="Javobingizni shu yerga yozing…"
          className={cn(
            "w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100",
            disabled && "cursor-not-allowed opacity-60",
          )}
        />
      )}
    </div>
  );
};

export default DiagnosticQuestionCard;
