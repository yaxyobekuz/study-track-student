// Utils
import { cn } from "@/shared/utils/cn";

/**
 * Bitta savol va o'quvchi javob tanlash interfeysi (variantli yoki ochiq).
 *
 * @param {object} props
 * @param {object} props.question - frozen question (text, image, options, type, points)
 * @param {number} props.index - savol tartib raqami
 * @param {object} [props.currentAnswer] - hozirgi javob ({ selectedOptionId, textAnswer })
 * @param {Function} props.onAnswerChange - javob o'zgarganda chaqiriladi (questionId, { selectedOptionId?, textAnswer? })
 * @param {boolean} [props.disabled=false] - boshqarish o'chirilganmi
 */
const QuestionRenderer = ({
  question,
  index,
  currentAnswer,
  onAnswerChange,
  disabled = false,
}) => {
  const isStandard = question.type === "standard";

  const handleSelectOption = (optionId) => {
    if (disabled) return;
    onAnswerChange(question.question, { selectedOptionId: optionId });
  };

  const handleTextChange = (e) => {
    onAnswerChange(question.question, { textAnswer: e.target.value });
  };

  return (
    <div className="space-y-4">
      {/* Savol */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-500">
            {index + 1}-savol
          </span>
          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
            {question.points} ball
          </span>
        </div>

        {question.image?.url && (
          <img
            src={question.image.url}
            alt="Savol rasmi"
            className="max-w-full max-h-80 rounded-lg object-contain border"
          />
        )}

        {question.text && (
          <p className="text-lg text-gray-900 whitespace-pre-wrap break-words">
            {question.text}
          </p>
        )}
      </div>

      {/* Variantlar yoki matn maydoni */}
      {isStandard ? (
        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const isSelected =
              currentAnswer?.selectedOptionId?.toString() ===
              opt.optionId?.toString();
            return (
              <button
                key={opt.optionId}
                type="button"
                onClick={() => handleSelectOption(opt.optionId)}
                disabled={disabled}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-colors",
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-blue-300",
                  disabled && "cursor-not-allowed opacity-60",
                )}
              >
                <div
                  className={cn(
                    "size-6 shrink-0 rounded-full border-2 flex items-center justify-center font-medium text-sm",
                    isSelected
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 text-gray-500",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </div>

                <div className="flex-1 flex items-start gap-3">
                  {opt.image?.url && (
                    <img
                      src={opt.image.url}
                      alt="Variant rasmi"
                      className="max-w-32 max-h-32 rounded-lg object-cover border shrink-0"
                    />
                  )}
                  {opt.text && (
                    <p className="text-gray-900 break-words">{opt.text}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <textarea
          rows={6}
          value={currentAnswer?.textAnswer || ""}
          onChange={handleTextChange}
          disabled={disabled}
          placeholder="Javobingizni shu yerga yozing..."
          className={cn(
            "w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100",
            disabled && "cursor-not-allowed opacity-60",
          )}
        />
      )}
    </div>
  );
};

export default QuestionRenderer;
