// types.ts
import {
  Check,
  Rocket,
  Star,
  Flame,
  Heart,
  Footprints,
  Trophy,
  Target,
  Crown,
  Zap,
  Medal,
  Mountain,
} from "lucide-react";

export const ICON_LIB = [
  { icon: Check, color: "text-green-500", bg: "bg-green-50" },
  { icon: Rocket, color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
  { icon: Flame, color: "text-orange-600", bg: "bg-orange-50" },
  { icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
  { icon: Footprints, color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Trophy, color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Target, color: "text-red-500", bg: "bg-red-50" },
  { icon: Crown, color: "text-purple-500", bg: "bg-purple-50" },
  { icon: Zap, color: "text-yellow-600", bg: "bg-yellow-100" },
  { icon: Medal, color: "text-indigo-500", bg: "bg-indigo-50" },
  { icon: Mountain, color: "text-slate-600", bg: "bg-slate-100" },
];

export const THEMES = [
  {
    name: "Default",
    bg: "bg-slate-50",
    text: "text-slate-900",
    border: "border-slate-200",
    badge: "bg-slate-900 text-white hover:bg-slate-800", // Stark contrast
  },
  {
    name: "Rose",
    bg: "bg-rose-50",
    text: "text-rose-900",
    border: "border-rose-200",
    badge: "bg-teal-500 text-white hover:bg-teal-600", // Complementary to Pink
  },
  {
    name: "Sky",
    bg: "bg-sky-50",
    text: "text-sky-900",
    border: "border-sky-200",
    badge: "bg-orange-500 text-white hover:bg-orange-600", // Complementary to Blue
  },
  {
    name: "Mint",
    bg: "bg-emerald-50",
    text: "text-emerald-900",
    border: "border-emerald-200",
    badge: "bg-rose-500 text-white hover:bg-rose-600", // Complementary to Green
  },
  {
    name: "Lemon",
    bg: "bg-amber-50",
    text: "text-amber-900",
    border: "border-amber-200",
    badge: "bg-violet-600 text-white hover:bg-violet-700", // Complementary to Yellow
  },
  {
    name: "Lavender",
    bg: "bg-violet-50",
    text: "text-violet-900",
    border: "border-violet-200",
    badge: "bg-lime-500 text-black hover:bg-lime-600", // Complementary to Purple
  },
  {
    name: "Sage",
    bg: "bg-green-50",
    text: "text-green-900",
    border: "border-green-200",
    badge: "bg-fuchsia-600 text-white hover:bg-fuchsia-700", // Complementary to Green
  },
  {
    name: "Sunset",
    bg: "bg-orange-50",
    text: "text-orange-900",
    border: "border-orange-200",
    badge: "bg-blue-600 text-white hover:bg-blue-700", // Complementary to Orange
  },
  {
    name: "Storm",
    bg: "bg-blue-100/50",
    text: "text-blue-900",
    border: "border-blue-300",
    badge: "bg-yellow-400 text-blue-900 hover:bg-yellow-500", // High-vis yellow on blue
  },
];

export interface Square {
  goal: string;
  stampedIdx: number | null;
}

export interface AppState {
  n: string;
  s?: string;
  g: Square[];
  t: number;
  v: number;
}
