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
import { THEMES } from "../types";

interface AppHeaderProps {
  teamName: string;
  themeIdx: number;
  isLocked: boolean;
  onUpdateName: (name: string) => void;
  onUpdateTheme: (idx: number) => void;
  onToggleLock: () => void;
  onReset: () => void;
  onShare: () => void;
  onRandomize: () => void;
}

export const AppHeader = ({
  teamName,
  themeIdx,
  isLocked,
  onUpdateName,
  onUpdateTheme,
  onToggleLock,
  onReset,
  onShare,
  onRandomize,
}: AppHeaderProps) => {
  const [isEditingName, setIsEditingName] = useState(false);

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

        {/* Mode Toggle - Very important for Mobile UX */}
        <Button
          variant={isLocked ? "outline" : "default"}
          size="sm"
          onClick={onToggleLock}
          className={`gap-2 rounded-full h-9 px-4 transition-all ${!isLocked ? "bg-orange-500 hover:bg-orange-600 border-none" : "bg-white/50"}`}
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

      {/* Bottom Row: Theme, Reset, Share */}
      <div className="flex items-center justify-between bg-white/20 p-2 rounded-2xl backdrop-blur-sm border border-white/20">
        <div className="flex items-center gap-1">
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

          <Button
            onClick={onRandomize}
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-orange-50 hover:text-orange-500"
            title="Randomize Board"
          >
            <Dices className="w-5 h-5" />
          </Button>

          <Button
            onClick={onReset}
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-red-50 hover:text-red-500"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        <Button
          onClick={onShare}
          className="gap-2 rounded-xl px-5 font-bold shadow-lg"
        >
          <Share2 className="w-4 h-4" /> Share
        </Button>
      </div>
    </header>
  );
};
