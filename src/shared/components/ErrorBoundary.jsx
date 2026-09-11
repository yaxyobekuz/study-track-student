// React
import { Component } from "react";

// Router
import { Link, useLocation } from "react-router-dom";

// Icons
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * SAHIFA YIQILSA — OQ EKRAN EMAS.
 *
 * ⚠️ BU PANELDA ILGARI ErrorBoundary UMUMAN YO'Q EDI. Render paytidagi
 * birorta xato React'da BUTUN daraxtni o'chirib yuboradi va foydalanuvchi
 * bo'm-bo'sh oq sahifa ko'radi — na sabab, na chiqish yo'li. Eng yomoni:
 * xato faqat DevTools konsolida qolardi, ya'ni o'quvchi ham, biz ham
 * nima buzilganini bilmasdik.
 *
 * Bu yerda xato USHLANADI va ekranga uch narsa chiqadi: nima bo'lgani
 * (xato matni — skrinshot qilib yuborish uchun), qayta urinish tugmasi
 * va bosh sahifaga qaytish.
 *
 * ⚠️ Faqat RENDER xatolarini ushlaydi. Tugma bosilgandagi va so'rov
 * xatolari bu yerga kelmaydi — ular o'z joyida (toast, query `error`)
 * ishlanadi.
 */
class Boundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Konsolda to'liq iz qoladi — DevTools ochilganda sabab darhol ko'rinadi.
    console.error("[ErrorBoundary] sahifa yiqildi:", error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertTriangle size={24} strokeWidth={1.5} />
          </span>

          <h1 className="mt-4 text-lg font-bold text-gray-900">
            Sahifani ochishda xato yuz berdi
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Qayta urinib ko'ring. Xato takrorlansa, shu ekranni skrinshot qilib
            yuboring.
          </p>

          {/* Xato matni — foydalanuvchi uchun emas, uni yuborish uchun. */}
          <p className="mt-4 break-words rounded-xl bg-gray-50 p-3 text-left font-mono text-xs text-gray-500">
            {String(error?.message || error)}
          </p>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white"
            >
              <RotateCcw size={16} />
              Qayta urinish
            </button>
            <Link
              to="/dashboard"
              onClick={() => this.setState({ error: null })}
              className="flex flex-1 items-center justify-center rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-700"
            >
              Bosh sahifa
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * ⚠️ `key` — joriy manzil. Boshqa sahifaga o'tilganda chegara YANGIDAN
 * o'rnatiladi va eski xato holati tozalanadi. Usiz bitta sahifada
 * yiqilgan xato keyingi, butunlay sog' sahifani ham to'sib turardi.
 */
const ErrorBoundary = ({ children }) => {
  const { pathname } = useLocation();
  return <Boundary key={pathname}>{children}</Boundary>;
};

export default ErrorBoundary;
