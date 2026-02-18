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
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { Edit3 } from "lucide-react";

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
          className="text-[10px] sm:text-xs h-auto p-2 text-center bg-white/90 border-primary font-bold px-2 z-20"
          value={square.goal}
          onChange={(e) => onUpdateGoal(e.target.value)}
          onBlur={() => setIsEditingText(false)}
          onKeyDown={(e) => e.key === "Enter" && setIsEditingText(false)}
        />
      );
    }

    return (
      <div
        className={`relative flex flex-col items-center justify-center w-full transition-opacity duration-300 
        ${isStamped ? "opacity-30 blur-[0.5px]" : "opacity-100"}`}
      >
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
              e.stopPropagation();
              setIsEditingText(true);
            }
          }}
          className={`text-[9px] sm:text-xs uppercase text-center font-bold leading-[1.1] break-words px-1
          ${!isLocked ? "underline decoration-dotted decoration-orange-400 cursor-edit" : ""}
        `}
        >
          {square.goal}
        </span>

        {/* Edit icon only shows when not locked and not stamped */}
        {!isLocked && !isEditingText && !isStamped && (
          <Edit3 className="w-3 h-3 text-orange-500 mt-1 opacity-50" />
        )}
      </div>
    );
  };

  // Reusable content for the Card
  const CardInner = (
    <>
      {renderGoalContent()}

      {/* Icon Layer: Positioned absolutely to sit on top of the text */}
      {IconData && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <IconData.icon
            className={`w-10 h-10 sm:w-14 sm:h-14 animate-in zoom-in spin-in-3 duration-300 drop-shadow-md ${IconData.color}`}
          />
        </div>
      )}
    </>
  );

  const cardClasses = `
    aspect-square flex flex-col items-center justify-center p-2 cursor-pointer 
    transition-all duration-300 border-2 relative overflow-hidden active:scale-95
    ${
      isStamped
        ? `${IconData?.bg} border-primary shadow-inner`
        : `bg-white/40 border-dashed ${borderClass} ${!isLocked ? "border-orange-300 bg-orange-50/30" : "hover:border-primary/50"}`
    }
  `;

  // If the board isn't locked, we just show the card (Edit Mode)
  if (!isLocked) {
    return <Card className={cardClasses}>{CardInner}</Card>;
  }

  // If locked, wrap in Popover for stamping
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Card className={cardClasses}>{CardInner}</Card>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-3 shadow-2xl rounded-2xl border-2">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
            Stamp Square
          </p>
          {isStamped && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[9px] text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onStamp(null as any)} // Assuming your onStamp handles null/clearing
            >
              Clear
            </Button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {ICON_LIB.map((item, idx) => (
            <Button
              key={idx}
              variant="ghost"
              className={`h-12 p-0 rounded-xl transition-transform active:scale-90 ${
                square.stampedIdx === idx
                  ? "bg-accent shadow-inner ring-2 ring-primary/20"
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
