// React
import { useState, useEffect, useCallback, useMemo } from "react";

// ─── Pure helpers (module-scope, not exported) ────────────────────────────────

/**
 * Convert a hex color string (#rrggbb or #rgb) to "H S% L%" for Tailwind CSS vars.
 * @param {string} hex
 * @returns {string}
 */
const hexToHsl = (hex) => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  let sat = 0;
  const lit = (max + min) / 2;
  if (delta !== 0) {
    sat = delta / (1 - Math.abs(2 * lit - 1));
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
  }
  return `${hue} ${Math.round(sat * 100)}% ${Math.round(lit * 100)}%`;
};

/**
 * Apply Telegram themeParams into app-scoped HSL CSS variables and handle dark mode class.
 * @param {Object} themeParams - Telegram theme color tokens
 * @param {string} colorScheme - "light" | "dark"
 */
const syncTailwindTheme = (themeParams, colorScheme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (colorScheme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");

  const map = {
    bg_color: "--mini-app-background",
    text_color: "--mini-app-foreground",
    button_color: "--mini-app-primary",
    button_text_color: "--mini-app-primary-foreground",
    secondary_bg_color: "--mini-app-secondary",
    hint_color: "--mini-app-muted-foreground",
    link_color: "--mini-app-ring",
  };

  Object.entries(map).forEach(([tgKey, cssVar]) => {
    if (themeParams[tgKey]) {
      root.style.setProperty(cssVar, hexToHsl(themeParams[tgKey]));
    }
  });
};

/**
 * Structural pre-validation of Telegram initData.
 * NOTE: This is NOT a cryptographic guarantee. For real security, send the raw
 * initData string to your backend and verify the HMAC-SHA256 hash there using
 * your bot token. Never put the bot token in client-side code.
 * @param {string} initData - Raw URL-encoded initData string from Telegram
 * @returns {boolean}
 */
const validateInitDataStructure = (initData) => {
  if (!initData) return false;
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash || !/^[0-9a-f]{64}$/.test(hash)) return false;
    const authDate = parseInt(params.get("auth_date"), 10);
    if (isNaN(authDate)) return false;
    const age = Math.floor(Date.now() / 1000) - authDate;
    if (age < 0 || age > 86400) return false; // older than 24h → reject
    const user = JSON.parse(params.get("user") || "null");
    if (!user || typeof user.id !== "number") return false;
    return true;
  } catch {
    return false;
  }
};

/**
 * Create a no-op stub of the Telegram WebApp object for non-Telegram environments.
 * Allows calling all hook functions without guards at every call site.
 * @returns {Object}
 */
const createStub = () => ({
  ready: () => {},
  expand: () => {},
  close: () => {},
  setHeaderColor: () => {},
  setBackgroundColor: () => {},
  setBottomBarColor: () => {},
  enableClosingConfirmation: () => {},
  disableClosingConfirmation: () => {},
  showPopup: (_p, cb) => cb?.(),
  showAlert: (_m, cb) => cb?.(),
  showConfirm: (_m, cb) => cb?.(false),
  openLink: () => {},
  openTelegramLink: () => {},
  openInvoice: (_u, cb) => cb?.(),
  sendData: () => {},
  switchInlineQuery: () => {},
  readTextFromClipboard: (_cb) => {},
  requestContact: (_cb) => {},
  requestLocation: (_cb) => {},
  onEvent: () => {},
  offEvent: () => {},
  BackButton: {
    show: () => {},
    hide: () => {},
    onClick: () => {},
    offClick: () => {},
  },
  MainButton: {
    show: () => {},
    hide: () => {},
    setText: () => {},
    setParams: () => {},
    onClick: () => {},
    offClick: () => {},
    showProgress: () => {},
    hideProgress: () => {},
  },
  SecondaryButton: {
    show: () => {},
    hide: () => {},
    setText: () => {},
    setParams: () => {},
    onClick: () => {},
    offClick: () => {},
  },
  HapticFeedback: {
    impactOccurred: () => {},
    notificationOccurred: () => {},
    selectionChanged: () => {},
  },
  initData: "",
  initDataUnsafe: {},
  version: "0",
  platform: "unknown",
  colorScheme: "light",
  themeParams: {},
  viewportHeight: typeof window !== "undefined" ? window.innerHeight : 0,
  viewportStableHeight: typeof window !== "undefined" ? window.innerHeight : 0,
  isExpanded: false,
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hook wrapping the full Telegram Mini App WebApp API.
 *
 * Safe to use outside Telegram — returns stubs and `isDev: true`.
 *
 * Usage:
 * ```jsx
 * const { user, showBackButton, hideBackButton, haptic } = useTelegram();
 * ```
 *
 * Security note:
 * - `isDataValid` performs structural checks only (hash format, auth_date age, user.id).
 * - For real verification, send `initData` to your backend and verify the HMAC-SHA256
 *   hash using your bot token server-side.
 *
 * @returns {Object} Full Telegram WebApp API surface
 */
const useTelegram = () => {
  const isTelegram =
    typeof window !== "undefined" &&
    !!window.Telegram?.WebApp?.initData &&
    window.Telegram.WebApp.initData !== "";

  const tg = isTelegram ? window.Telegram.WebApp : createStub();

  // ── Reactive state ──────────────────────────────────────────────────────────
  const [colorScheme, setColorScheme] = useState(tg.colorScheme ?? "light");
  const [themeParams, setThemeParams] = useState(tg.themeParams ?? {});
  const [viewportHeight, setViewportHeight] = useState(
    tg.viewportHeight ?? (typeof window !== "undefined" ? window.innerHeight : 0)
  );
  const [viewportStableHeight, setViewportStableHeight] = useState(
    tg.viewportStableHeight ?? (typeof window !== "undefined" ? window.innerHeight : 0)
  );
  const [isExpanded, setIsExpanded] = useState(tg.isExpanded ?? false);

  // ── Stable data — read once, not reactive ───────────────────────────────────
  const initData = tg.initData;
  const initDataUnsafe = tg.initDataUnsafe ?? {};
  const user = initDataUnsafe.user ?? null;
  const startParam = initDataUnsafe.start_param ?? null;
  const chatType = initDataUnsafe.chat_type ?? null;
  const chatInstance = initDataUnsafe.chat_instance ?? null;
  const version = tg.version;
  const platform = tg.platform;

  // ── initData structural validation — computed once ──────────────────────────
  /**
   * True if initData passes structural checks.
   * Does NOT guarantee authenticity — use backend HMAC check for that.
   * @type {boolean}
   */
  const isDataValid = useMemo(() => validateInitDataStructure(initData), [initData]);

  // ── Version guard helper ────────────────────────────────────────────────────
  const supportsVersion = (minVersion) =>
    isTelegram && parseFloat(tg.version) >= parseFloat(minVersion);

  // ── Effect A: initialization ────────────────────────────────────────────────
  useEffect(() => {
    if (!isTelegram) return;
    tg.ready();
    tg.expand();
    setColorScheme(tg.colorScheme);
    setThemeParams(tg.themeParams);
    setViewportHeight(tg.viewportHeight);
    setViewportStableHeight(tg.viewportStableHeight);
    setIsExpanded(tg.isExpanded);
    syncTailwindTheme(tg.themeParams, tg.colorScheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Effect B: event subscriptions ──────────────────────────────────────────
  useEffect(() => {
    if (!isTelegram) return;

    const handleThemeChanged = () => {
      setColorScheme(tg.colorScheme);
      setThemeParams(tg.themeParams);
      syncTailwindTheme(tg.themeParams, tg.colorScheme);
    };

    const handleViewportChanged = () => {
      setViewportHeight(tg.viewportHeight);
      setViewportStableHeight(tg.viewportStableHeight);
      setIsExpanded(tg.isExpanded);
    };

    tg.onEvent("themeChanged", handleThemeChanged);
    tg.onEvent("viewportChanged", handleViewportChanged);

    return () => {
      tg.offEvent("themeChanged", handleThemeChanged);
      tg.offEvent("viewportChanged", handleViewportChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Effect C: hide buttons on unmount ──────────────────────────────────────
  useEffect(() => {
    return () => {
      if (!isTelegram) return;
      tg.BackButton.hide();
      tg.MainButton.hide();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── BackButton ──────────────────────────────────────────────────────────────

  /**
   * Show the Telegram back button and register a click handler.
   * Pass the same function reference to hideBackButton to deregister it.
   * @param {Function} onClickFn - Click handler
   */
  const showBackButton = useCallback((onClickFn) => {
    tg.BackButton.onClick(onClickFn);
    tg.BackButton.show();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Hide the Telegram back button and deregister its click handler.
   * @param {Function} [onClickFn] - The same function passed to showBackButton
   */
  const hideBackButton = useCallback((onClickFn) => {
    if (onClickFn) tg.BackButton.offClick(onClickFn);
    tg.BackButton.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── MainButton ──────────────────────────────────────────────────────────────

  /**
   * Show and configure the Telegram main button.
   * @param {Object} [options]
   * @param {string} [options.text] - Button label
   * @param {string} [options.color] - Button background color (hex)
   * @param {string} [options.textColor] - Button text color (hex)
   * @param {boolean} [options.isActive=true] - Whether the button is active/clickable
   * @param {boolean} [options.isProgressVisible=false] - Show loading spinner
   * @param {Function} [options.onClick] - Click handler
   */
  const showMainButton = useCallback(
    ({ text, color, textColor, isActive = true, isProgressVisible = false, onClick } = {}) => {
      if (text) tg.MainButton.setText(text);
      tg.MainButton.setParams({
        color: color ?? undefined,
        text_color: textColor ?? undefined,
        is_active: isActive,
        is_progress_visible: isProgressVisible,
      });
      if (onClick) tg.MainButton.onClick(onClick);
      tg.MainButton.show();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Hide the main button and deregister its click handler.
   * @param {Function} [onClickFn] - The same function passed via showMainButton onClick
   */
  const hideMainButton = useCallback((onClickFn) => {
    if (onClickFn) tg.MainButton.offClick(onClickFn);
    tg.MainButton.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Show or hide the main button's loading progress indicator.
   * @param {boolean} visible
   */
  const setMainButtonProgress = useCallback((visible) => {
    visible ? tg.MainButton.showProgress() : tg.MainButton.hideProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── SecondaryButton (v7.10+) ────────────────────────────────────────────────

  /**
   * Show and configure the secondary button (requires Telegram v7.10+).
   * @param {Object} [options]
   * @param {string} [options.text] - Button label
   * @param {string} [options.color] - Button background color (hex)
   * @param {string} [options.textColor] - Button text color (hex)
   * @param {Function} [options.onClick] - Click handler
   */
  const showSecondaryButton = useCallback(
    ({ text, color, textColor, onClick } = {}) => {
      if (!supportsVersion("7.10") || !tg.SecondaryButton) return;
      if (text) tg.SecondaryButton.setText(text);
      tg.SecondaryButton.setParams({ color, text_color: textColor });
      if (onClick) tg.SecondaryButton.onClick(onClick);
      tg.SecondaryButton.show();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Hide the secondary button and deregister its click handler.
   * @param {Function} [onClickFn] - The same function passed via showSecondaryButton onClick
   */
  const hideSecondaryButton = useCallback((onClickFn) => {
    if (!tg.SecondaryButton) return;
    if (onClickFn) tg.SecondaryButton.offClick(onClickFn);
    tg.SecondaryButton.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Colors ──────────────────────────────────────────────────────────────────

  /**
   * Set the Telegram header color.
   * @param {string} color - Hex color or "bg_color" | "secondary_bg_color"
   */
  const setHeaderColor = useCallback(
    (color) => tg.setHeaderColor(color),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Set the Telegram background color.
   * @param {string} color - Hex color or "bg_color" | "secondary_bg_color"
   */
  const setBackgroundColor = useCallback(
    (color) => tg.setBackgroundColor(color),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Set the Telegram bottom bar color (requires v7.10+).
   * @param {string} color - Hex color or "bg_color" | "secondary_bg_color"
   */
  const setBottomBarColor = useCallback((color) => {
    if (supportsVersion("7.10") && tg.setBottomBarColor) tg.setBottomBarColor(color);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Haptic Feedback ─────────────────────────────────────────────────────────

  /**
   * Haptic feedback methods.
   * @property {Function} impact - Trigger an impact haptic. style: "light"|"medium"|"heavy"|"rigid"|"soft"
   * @property {Function} notification - Trigger a notification haptic. type: "error"|"success"|"warning"
   * @property {Function} selection - Trigger a selection changed haptic.
   */
  const haptic = useMemo(
    () => ({
      impact: (style = "medium") => tg.HapticFeedback.impactOccurred(style),
      notification: (type = "success") => tg.HapticFeedback.notificationOccurred(type),
      selection: () => tg.HapticFeedback.selectionChanged(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ── Dialogs ─────────────────────────────────────────────────────────────────

  /**
   * Show a native Telegram popup.
   * @param {Object} params - { title?, message, buttons? }
   * @param {Function} [callback] - Called with the button id that was pressed
   */
  const showPopup = useCallback(
    (params, callback) => tg.showPopup(params, callback),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Show a native Telegram alert dialog.
   * @param {string} message
   * @param {Function} [callback] - Called when alert is closed
   */
  const showAlert = useCallback(
    (message, callback) => tg.showAlert(message, callback),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Show a native Telegram confirm dialog.
   * @param {string} message
   * @param {Function} [callback] - Called with boolean (true = OK, false = Cancel)
   */
  const showConfirm = useCallback(
    (message, callback) => tg.showConfirm(message, callback),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ── Links & Invoices ────────────────────────────────────────────────────────

  /**
   * Open an external link.
   * @param {string} url
   * @param {Object} [options] - { try_instant_view? }
   */
  const openLink = useCallback(
    (url, options) => tg.openLink(url, options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Open a Telegram internal link (t.me links, etc.).
   * @param {string} url
   */
  const openTelegramLink = useCallback(
    (url) => tg.openTelegramLink(url),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Open a payment invoice link.
   * @param {string} url
   * @param {Function} [callback] - Called with payment status
   */
  const openInvoice = useCallback(
    (url, callback) => tg.openInvoice(url, callback),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ── Data & Communication ────────────────────────────────────────────────────

  /**
   * Send data to the bot and close the Mini App.
   * Data must be a string ≤ 4096 bytes.
   * @param {string} data
   */
  const sendData = useCallback(
    (data) => tg.sendData(data),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Switch to inline mode and prefill the query.
   * @param {string} query
   * @param {string[]} [chatTypes] - "users"|"bots"|"groups"|"channels"
   */
  const switchInlineQuery = useCallback(
    (query, chatTypes) => tg.switchInlineQuery(query, chatTypes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Read text from clipboard (requires v6.4+).
   * @param {Function} callback - Called with the clipboard text string
   */
  const readTextFromClipboard = useCallback((callback) => {
    if (supportsVersion("6.4") && tg.readTextFromClipboard) tg.readTextFromClipboard(callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Contact & Location (v6.9+) ──────────────────────────────────────────────

  /**
   * Request the user's phone number (requires v6.9+).
   * @param {Function} callback - Called with the contact object or null
   */
  const requestContact = useCallback((callback) => {
    if (supportsVersion("6.9") && tg.requestContact) tg.requestContact(callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Request the user's current location (requires v6.9+).
   * @param {Function} callback - Called with the location object or null
   */
  const requestLocation = useCallback((callback) => {
    if (supportsVersion("6.9") && tg.requestLocation) tg.requestLocation(callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Closing Confirmation ────────────────────────────────────────────────────

  /**
   * Show a confirmation dialog before the user closes the Mini App.
   */
  const enableClosingConfirmation = useCallback(
    () => tg.enableClosingConfirmation(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Disable the close confirmation dialog.
   */
  const disableClosingConfirmation = useCallback(
    () => tg.disableClosingConfirmation(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  /**
   * Expand the Mini App to full height.
   */
  const expand = useCallback(
    () => tg.expand(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Close the Mini App.
   */
  const close = useCallback(
    () => tg.close(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ── Return ──────────────────────────────────────────────────────────────────
  return {
    // ── Environment ──────────────────────────────────────────────────────────
    /** True when running inside Telegram */
    isTelegram,
    /** True when running in a regular browser (dev/preview) */
    isDev: !isTelegram,

    // ── User & session data ───────────────────────────────────────────────────
    /** Telegram user object: { id, first_name, last_name?, username?, photo_url?, language_code? } */
    user,
    /** Deep-link start parameter passed to the bot */
    startParam,
    /** Chat type: "sender" | "private" | "group" | "supergroup" | "channel" */
    chatType,
    /** Unique chat instance identifier */
    chatInstance,
    /**
     * Raw URL-encoded initData string.
     * Send this to your backend for real HMAC-SHA256 verification with your bot token.
     */
    initData,
    /** Parsed initData object (use cautiously — not cryptographically verified on frontend) */
    initDataUnsafe,
    /**
     * Structural pre-validation result (hash format, auth_date age, user.id presence).
     * NOT a cryptographic guarantee. Send initData to backend for real verification.
     */
    isDataValid,

    // ── Platform ──────────────────────────────────────────────────────────────
    /** Telegram WebApp API version string (e.g. "7.10") */
    version,
    /** Platform: "android" | "ios" | "web" | "weba" | "tdesktop" | "macos" | etc. */
    platform,

    // ── Reactive state ────────────────────────────────────────────────────────
    /** Current color scheme — updates reactively on theme change */
    colorScheme,
    /** Current Telegram theme color tokens — updates reactively */
    themeParams,
    /** Current viewport height in px — updates reactively */
    viewportHeight,
    /** Stable viewport height in px (excludes on-screen keyboard) — updates reactively */
    viewportStableHeight,
    /** Whether the Mini App is expanded to full height */
    isExpanded,

    // ── Lifecycle ─────────────────────────────────────────────────────────────
    expand,
    close,

    // ── Navigation buttons ────────────────────────────────────────────────────
    showBackButton,
    hideBackButton,
    showMainButton,
    hideMainButton,
    setMainButtonProgress,
    showSecondaryButton,
    hideSecondaryButton,

    // ── Header / background colors ────────────────────────────────────────────
    setHeaderColor,
    setBackgroundColor,
    setBottomBarColor,

    // ── Haptic feedback ───────────────────────────────────────────────────────
    haptic,

    // ── Dialogs ───────────────────────────────────────────────────────────────
    showPopup,
    showAlert,
    showConfirm,

    // ── Links ─────────────────────────────────────────────────────────────────
    openLink,
    openTelegramLink,
    openInvoice,

    // ── Data ──────────────────────────────────────────────────────────────────
    sendData,
    switchInlineQuery,
    readTextFromClipboard,

    // ── Newer APIs ────────────────────────────────────────────────────────────
    requestContact,
    requestLocation,
    enableClosingConfirmation,
    disableClosingConfirmation,
  };
};

export default useTelegram;
