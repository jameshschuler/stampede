// components/AppHeader.tsx
import { useState } from "react";
import {
  Palette,
  RotateCcw,
  Share2,
  Edit2,
  Lock,
  Unlock,
  CheckCircle2,
  Dices,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { THEMES, type Square } from "../types";
import { BulkEditDialog } from "./BulkEditDialog";
import { Badge } from "./ui/badge";

interface AppHeaderProps {
  teamName: string;
  subtitle?: string;
  themeIdx: number;
  isLocked: boolean;
  gridSize: number; // New: Derived from state.g.length
  goals: Square[]; // New: Pass the grid state for bulk editing
  onUpdateName: (name: string) => void;
  onUpdateSubtitle: (subtitle: string) => void;
  onUpdateTheme: (idx: number) => void;
  onToggleLock: () => void;
  onReset: () => void;
  onShare: () => void;
  onRandomize: () => void;
  onResize: (size: number) => void;
  onUpdateGoal: (index: number, val: string) => void; // New: For Bulk Edit
}

export const AppHeader = ({
  teamName,
  subtitle,
  themeIdx,
  isLocked,
  gridSize,
  goals,
  onUpdateName,
  onUpdateTheme,
  onToggleLock,
  onReset,
  onShare,
  onRandomize,
  onResize,
  onUpdateGoal,
  onUpdateSubtitle,
}: AppHeaderProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const currentTheme = THEMES[themeIdx];

  return (
    <header className="flex flex-col gap-6">
      {/* Top Row: Team Name & Mode Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1 min-w-[200px]">
          {isEditingName ? (
            <Input
              autoFocus
              className="text-2xl font-black uppercase italic h-auto p-1 bg-white/50 border-b-2 border-primary"
              value={teamName}
              onChange={(e) => onUpdateName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
            />
          ) : (
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setIsEditingName(true)}
            >
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                {teamName || "New Team"}
              </h1>
              <Edit2 className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Step Bingo Dashboard
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {isEditingSubtitle ? (
            <Input
              autoFocus
              className="h-6 text-[10px] w-32 font-bold uppercase py-0 px-2 bg-primary/10 border-primary"
              value={subtitle || ""}
              onChange={(e) => onUpdateSubtitle(e.target.value)}
              onBlur={() => setIsEditingSubtitle(false)}
              onKeyDown={(e) =>
                e.key === "Enter" && setIsEditingSubtitle(false)
              }
            />
          ) : (
            <Badge
              className={`cursor-pointer transition-all duration-300 text-[12px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md border-none shadow-sm shadow-black/5 ${currentTheme.badge}`}
              onClick={() => setIsEditingSubtitle(true)}
            >
              {subtitle || "Add Edition +"}
            </Badge>
          )}
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 flex items-center gap-1">
            • Step Bingo
          </p>
        </div>

        <Button
          variant={isLocked ? "outline" : "default"}
          size="sm"
          onClick={onToggleLock}
          className={`gap-2 rounded-full h-9 px-4 transition-all ${
            !isLocked
              ? "bg-orange-500 hover:bg-orange-600 border-none shadow-md"
              : "bg-white/50"
          }`}
        >
          {isLocked ? (
            <Lock className="w-3.5 h-3.5" />
          ) : (
            <Unlock className="w-3.5 h-3.5 animate-pulse" />
          )}
          <span className="text-xs font-bold uppercase tracking-tight">
            {isLocked ? "Stamping Mode" : "Edit Goals Mode"}
          </span>
        </Button>
      </div>

      {/* Bottom Row: Toolbelt */}
      <div className="flex flex-wrap items-center justify-between bg-white/20 p-2 rounded-2xl backdrop-blur-sm border border-white/20 gap-2">
        <div className="flex items-center gap-1">
          {/* Theme Palette */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-white/40"
              >
                <Palette className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3" align="start">
              <p className="text-[10px] font-black uppercase mb-2 opacity-50">
                Theme Palette
              </p>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((theme, idx) => (
                  <button
                    key={idx}
                    onClick={() => onUpdateTheme(idx)}
                    className={`h-8 w-full rounded-lg border-2 transition-all ${theme.bg} ${
                      themeIdx === idx
                        ? "border-primary scale-110 shadow-md"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Setup Tools (Only show when unlocked) */}
          {!isLocked && (
            <>
              <div className="h-6 w-[1px] bg-black/10 mx-1" />

              {/* Grid Size Selectors */}
              <div className="flex items-center gap-1 bg-black/5 rounded-lg p-0.5">
                {[3, 4, 5].map((size) => (
                  <button
                    key={size}
                    onClick={() => onResize(size)}
                    className={`text-[10px] font-bold w-7 h-7 rounded-md transition-all ${
                      gridSize === size
                        ? "bg-white text-primary shadow-sm scale-105"
                        : "text-black/40 hover:text-black"
                    }`}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>

              <BulkEditDialog goals={goals} onUpdate={onUpdateGoal} />

              {/* Randomizer */}
              <Button
                onClick={onRandomize}
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-orange-50 hover:text-orange-500"
                title="Randomize Board"
              >
                <Dices className="w-5 h-5" />
              </Button>
            </>
          )}

          <div className="h-6 w-[1px] bg-black/10 mx-1" />

          {/* Reset Button */}
          <Button
            onClick={onReset}
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-red-50 hover:text-red-500"
            title="Reset All"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Share Button */}
        <Button
          onClick={onShare}
          className="gap-2 rounded-xl px-5 font-bold shadow-lg transition-transform active:scale-95"
        >
          <Share2 className="w-4 h-4" /> Share
        </Button>
      </div>
    </header>
  );
};
