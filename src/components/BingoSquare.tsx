// components/BingoSquare.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ICON_LIB, type Square } from "../types";
import { useState } from "react";
import { Edit3 } from "lucide-react";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

interface BingoSquareProps {
  square: Square;
  isLocked: boolean;
  onUpdateGoal: (newGoal: string) => void;
  onStamp: (iconIdx: number) => void;
  borderClass: string;
}

export const BingoSquare = ({
  square,
  isLocked,
  onUpdateGoal,
  onStamp,
  borderClass,
}: BingoSquareProps) => {
  const isStamped = square.stampedIdx !== null;
  const IconData = isStamped ? ICON_LIB[square.stampedIdx!] : null;
  const [isEditingText, setIsEditingText] = useState(false);
  const { toast } = useToast();

  const renderGoalContent = () => {
    if (!isLocked && isEditingText) {
      return (
        <Input
          autoFocus
          className="text-[10px] sm:text-xs h-auto p-2 text-center bg-white/90 border-primary font-bold px-2"
          value={square.goal}
          onChange={(e) => onUpdateGoal(e.target.value)}
          onBlur={() => setIsEditingText(false)}
          onKeyDown={(e) => e.key === "Enter" && setIsEditingText(false)}
        />
      );
    }

    return (
      <div className="relative flex flex-col items-center justify-center w-full">
        <span
          onClick={(e) => {
            if (!isLocked) {
              if (isStamped) {
                toast({
                  title: "Edit Locked",
                  description:
                    "Please clear the stamp before editing the goal.",
                });
                return;
              }

              e.stopPropagation(); // Don't open popover if we're editing
              setIsEditingText(true);
            }
          }}
          className={`text-[9px] sm:text-xs uppercase text-center leading-[1.1] transition-opacity break-word
          ${isLocked ? "opacity-70" : "opacity-100 underline decoration-dotted decoration-orange-400"}
        `}
        >
          {square.goal}
        </span>

        {/* Visual hint for "Edit Mode" */}
        {!isLocked && !isEditingText && (
          <Edit3 className="w-3 h-3 text-orange-500 mt-1 opacity-50" />
        )}
      </div>
    );
  };

  const CardContent = (
    <Card
      className={`
    aspect-square flex flex-col items-center justify-center p-2 cursor-pointer 
    transition-all duration-300 border-2 relative overflow-hidden active:scale-95
    ${
      isStamped
        ? `${IconData?.bg} border-primary shadow-md`
        : `bg-white/40 border-dashed ${borderClass} ${!isLocked ? "border-orange-300 bg-orange-50/30" : "hover:border-primary/50"}`
    }
  `}
    >
      {renderGoalContent()}
      {IconData && (
        <IconData.icon
          className={`w-8 h-8 sm:w-12 sm:h-12 mt-2 animate-in zoom-in duration-300 ${IconData.color}`}
        />
      )}
    </Card>
  );

  if (!isLocked) {
    return CardContent;
  }

  return (
    <Popover>
      {/* Popover only triggers if we are in Locked (Stamping) mode */}
      <PopoverTrigger asChild disabled={!isLocked}>
        <Card
          className={`
          aspect-square flex flex-col items-center justify-center p-2 cursor-pointer 
          transition-all duration-300 border-2 relative overflow-hidden active:scale-95
          ${
            isStamped
              ? `${IconData?.bg} border-primary shadow-md`
              : `bg-white/40 border-dashed ${borderClass} ${!isLocked ? "border-orange-300 bg-orange-50/30" : "hover:border-primary/50"}`
          }
        `}
        >
          {renderGoalContent()}

          {IconData && (
            <IconData.icon
              className={`w-8 h-8 sm:w-12 sm:h-12 mt-2 animate-in zoom-in duration-300 ${IconData.color}`}
            />
          )}
        </Card>
      </PopoverTrigger>

      {/* The Icon Selection Menu */}
      <PopoverContent className="w-64 p-3 shadow-2xl rounded-2xl border-2">
        <p className="text-[10px] font-black uppercase mb-3 opacity-40 tracking-widest text-center">
          Choose Your Stamp
        </p>
        <div className="grid grid-cols-4 gap-2">
          {ICON_LIB.map((item, idx) => (
            <Button
              key={idx}
              variant="ghost"
              className={`h-12 p-0 rounded-xl transition-transform active:scale-90 ${
                square.stampedIdx === idx
                  ? "bg-accent shadow-inner"
                  : "hover:bg-slate-100"
              }`}
              onClick={() => onStamp(idx)}
            >
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
