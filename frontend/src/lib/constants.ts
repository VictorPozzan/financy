import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "briefcase-business": BriefcaseBusiness,
  "car-front": CarFront,
  "heart-pulse": HeartPulse,
  "piggy-bank": PiggyBank,
  "shopping-cart": ShoppingCart,
  ticket: Ticket,
  "tool-case": ToolCase,
  utensils: Utensils,
  "paw-print": PawPrint,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  "book-open": BookOpen,
  "baggage-claim": BaggageClaim,
  mailbox: Mailbox,
  "receipt-text": ReceiptText,
};

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS);

export function getCategoryIcon(icon: string): LucideIcon {
  return CATEGORY_ICONS[icon] ?? Wallet;
}

export interface CategoryColorClasses {
  /** dark shade badge/tag text, "Entrada"/"Saída" label */
  text: string;
  /** base shade (text utility) icon fill inside colored square */
  icon: string;
  /** base shade (background utility) color-picker swatch */
  swatch: string;
  /** light shade badge/tag background, icon square background */
  bg: string;
}

export const CATEGORY_COLORS: Record<string, CategoryColorClasses> = {
  green: {
    text: "text-category-green-text",
    icon: "text-category-green-icon",
    swatch: "bg-category-green-icon",
    bg: "bg-category-green-bg",
  },
  blue: {
    text: "text-category-blue-text",
    icon: "text-category-blue-icon",
    swatch: "bg-category-blue-icon",
    bg: "bg-category-blue-bg",
  },
  purple: {
    text: "text-category-purple-text",
    icon: "text-category-purple-icon",
    swatch: "bg-category-purple-icon",
    bg: "bg-category-purple-bg",
  },
  pink: {
    text: "text-category-pink-text",
    icon: "text-category-pink-icon",
    swatch: "bg-category-pink-icon",
    bg: "bg-category-pink-bg",
  },
  red: {
    text: "text-category-red-text",
    icon: "text-category-red-icon",
    swatch: "bg-category-red-icon",
    bg: "bg-category-red-bg",
  },
  orange: {
    text: "text-category-orange-text",
    icon: "text-category-orange-icon",
    swatch: "bg-category-orange-icon",
    bg: "bg-category-orange-bg",
  },
  yellow: {
    text: "text-category-yellow-text",
    icon: "text-category-yellow-icon",
    swatch: "bg-category-yellow-icon",
    bg: "bg-category-yellow-bg",
  },
};

export const CATEGORY_COLOR_NAMES = Object.keys(CATEGORY_COLORS);

const FALLBACK_COLOR: CategoryColorClasses = {
  text: "text-category-gray-text",
  icon: "text-category-gray-icon",
  swatch: "bg-category-gray-icon",
  bg: "bg-category-gray-bg",
};

export function getCategoryColor(color: string): CategoryColorClasses {
  return CATEGORY_COLORS[color] ?? FALLBACK_COLOR;
}
