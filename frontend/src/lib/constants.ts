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
  "book-open": BookOpen,
  dumbbell: Dumbbell,
  "baggage-claim": BaggageClaim,
  mailbox: Mailbox,
  "receipt-text": ReceiptText,
  gift: Gift,
};

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS);

export function getCategoryIcon(icon: string): LucideIcon {
  return CATEGORY_ICONS[icon] ?? Wallet;
}

export interface CategoryColorClasses {
  text: string;
  bg: string;
  swatch: string;
}

export const CATEGORY_COLORS: Record<string, CategoryColorClasses> = {
  green: { text: "text-category-green-text", bg: "bg-category-green-bg", swatch: "bg-category-green-text" },
  blue: { text: "text-category-blue-text", bg: "bg-category-blue-bg", swatch: "bg-category-blue-text" },
  purple: { text: "text-category-purple-text", bg: "bg-category-purple-bg", swatch: "bg-category-purple-text" },
  pink: { text: "text-category-pink-text", bg: "bg-category-pink-bg", swatch: "bg-category-pink-text" },
  red: { text: "text-category-red-text", bg: "bg-category-red-bg", swatch: "bg-category-red-text" },
  orange: { text: "text-category-orange-text", bg: "bg-category-orange-bg", swatch: "bg-category-orange-text" },
  yellow: { text: "text-category-yellow-text", bg: "bg-category-yellow-bg", swatch: "bg-category-yellow-text" },
};

export const CATEGORY_COLOR_NAMES = Object.keys(CATEGORY_COLORS);

export function getCategoryColor(color: string): CategoryColorClasses {
  return CATEGORY_COLORS[color] ?? { text: "text-category-gray-text", bg: "bg-category-gray-bg", swatch: "bg-category-gray-text" };
}
