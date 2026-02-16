// components/Stampede.tsx
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "./AppHeader";
import { BingoSquare } from "./BingoSquare";
import { type AppState, type Square, THEMES } from "../types";
import LZString from "lz-string";
import confetti from "canvas-confetti";

const packState = (state: AppState) => ({
  n: state.n,
  s: state.s,
  t: state.t,
  g: state.g.map((sq) => ({
    l: sq.goal,
    x: sq.stampedIdx,
  })),
});

// Restore the object after decompression
const unpackState = (min: any): AppState => ({
  n: min.n,
  s: min.s,
  t: min.t,
  g: min.g.map((sq: any) => ({
    goal: sq.l,
    stampedIdx: sq.x,
  })),
  v: 0, // Default version
});

const checkBingo = (grid: Square[]) => {
  const size = Math.sqrt(grid.length);
  const lines: number[][] = [];

  // 1. Rows
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) row.push(i * size + j);
    lines.push(row);
  }

  // 2. Columns
  for (let i = 0; i < size; i++) {
    const col = [];
    for (let j = 0; j < size; j++) col.push(j * size + i);
    lines.push(col);
  }

  // 3. Diagonals
  const diag1 = [];
  const diag2 = [];
  for (let i = 0; i < size; i++) {
    diag1.push(i * size + i);
    diag2.push(i * size + (size - 1 - i));
  }
  lines.push(diag1, diag2);

  // Check if any line is fully stamped
  return lines.some((line) =>
    line.every((idx) => grid[idx].stampedIdx !== null),
  );
};

const fireFireworks = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Fire two bursts from the sides
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

export default function Stampede({
  rows,
  cols,
}: {
  rows: number;
  cols: number;
}) {
  const { toast } = useToast();

  const getInitialState = (): AppState => {
    const params = new URLSearchParams(window.location.search);
    const compressed = params.get("d");

    if (compressed) {
      try {
        // Decompress the URL data
        const decompressed =
          LZString.decompressFromEncodedURIComponent(compressed);
        if (decompressed) {
          return unpackState(JSON.parse(decompressed));
        }
      } catch (e) {
        console.error("Failed to decompress URL data", e);
      }
    }

    // Default Fallback
    return {
      n: "Team Stampede",
      t: 0,
      g: Array.from({ length: rows * cols }, (_, i) => ({
        goal: `${(i + 1) * 1000} Steps`,
        stampedIdx: null,
      })),
      v: 0,
    };
  };

  const [state, setState] = useState<AppState>(getInitialState());
  const currentTheme = THEMES[state.t];
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    // 1. Always update the background immediately for that snappy feel
    document.body.className = `transition-colors duration-700 ${currentTheme.bg}`;

    // 2. Debounce the URL update so it doesn't lag the text input
    const timeoutId = setTimeout(() => {
      const packed = packState(state);
      const compressed = LZString.compressToEncodedURIComponent(
        JSON.stringify(packed),
      );
      const url = new URL(window.location.href);
      url.searchParams.set("d", compressed);
      window.history.replaceState({}, "", url.toString());
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state, currentTheme.bg]);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);

      if (navigator.share) {
        await navigator.share({
          title: `Stampede - ${state.n}`,
          text: `Check out our team's step progress on this Bingo card!`,
          url: url,
        });
      } else {
        toast({
          title: "Link Copied!",
          description: "The shareable URL is now on your clipboard.",
        });
      }
    } catch (err) {
      console.error("Share failed", err);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  const handleUpdateGoal = (index: number, newGoal: string) => {
    setState((prevState) => {
      const newGrid = [...prevState.g];
      newGrid[index] = {
        ...newGrid[index],
        goal: newGoal,
      };

      return {
        ...prevState,
        g: newGrid,
      };
    });
  };

  const handleRandomize = () => {
    setState((prev) => {
      const shuffledGrid = [...prev.g].map((s) => ({ ...s, stampedIdx: null })); // Clear stamps

      for (let i = shuffledGrid.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledGrid[i], shuffledGrid[j]] = [shuffledGrid[j], shuffledGrid[i]];
      }

      return { ...prev, v: (prev.v || 0) + 1, g: shuffledGrid };
    });

    toast({
      title: "Board Randomized!",
      description: "Stamps cleared for a new game.",
    });
  };

  const handleStamp = (index: number, iconIdx: number) => {
    setState((prev) => {
      const newGrid = [...prev.g];

      // Toggle logic
      newGrid[index] = {
        ...newGrid[index],
        stampedIdx: newGrid[index].stampedIdx === iconIdx ? null : iconIdx,
      };

      // Check for Bingo!
      if (checkBingo(newGrid)) {
        fireFireworks();
        toast({
          title: "BINGO! 🎉",
          description: "Your team has completed a line! Keep going!",
          className: "bg-green-500 text-white border-none shadow-2xl",
        });
      }

      return { ...prev, g: newGrid };
    });
  };

  const gridSize = Math.sqrt(state.g.length);

  const handleResize = (newSize: number) => {
    setState((prev) => {
      const total = newSize * newSize;
      let newGrid = [...prev.g];

      if (newGrid.length > total) {
        newGrid = newGrid.slice(0, total);
      } else {
        const extra = Array.from(
          { length: total - newGrid.length },
          (_, i) => ({
            goal: `${(newGrid.length + i + 1) * 1000} Steps`,
            stampedIdx: null,
          }),
        );
        newGrid = [...newGrid, ...extra];
      }
      return { ...prev, g: newGrid, v: (prev.v || 0) + 1 };
    });
  };

  const handleUpdateSubtitle = (newSubtitle: string) => {
    setState((prev) => ({
      ...prev,
      s: newSubtitle,
    }));
  };

  return (
    <div className={`min-h-screen py-10 px-4 ${currentTheme.text}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        <AppHeader
          gridSize={gridSize}
          goals={state.g}
          onUpdateGoal={handleUpdateGoal}
          teamName={state.n}
          subtitle={state.s}
          themeIdx={state.t}
          isLocked={isLocked}
          onResize={handleResize}
          onToggleLock={() => setIsLocked(!isLocked)}
          onUpdateName={(n) => setState({ ...state, n })}
          onUpdateTheme={(t) => setState({ ...state, t })}
          onUpdateSubtitle={handleUpdateSubtitle}
          onRandomize={handleRandomize}
          onReset={() => {
            setState((prevState) => ({
              ...prevState,
              v: (prevState.v || 0) + 1,
              g: prevState.g.map((s, i) => ({
                ...s,
                goal: `${(i + 1) * 1000} Steps`,
                stampedIdx: null,
              })),
            }));

            toast({
              title: "Board Reset",
              description: "Goals and stamps have been restored to default.",
              variant: "destructive",
            });
          }}
          onShare={handleShare}
        />
        <div
          className="grid gap-3 sm:gap-4"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {state.g.map((square, i) => (
            <BingoSquare
              key={`${state.v}-${i}`}
              square={square}
              isLocked={isLocked}
              onUpdateGoal={(newText) => handleUpdateGoal(i, newText)}
              borderClass={currentTheme.border}
              onStamp={(iconIdx) => handleStamp(i, iconIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
