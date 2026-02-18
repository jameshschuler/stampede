import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListOrdered } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const BulkEditDialog = ({
  goals,
  onUpdate,
}: {
  goals: { goal: string }[];
  onUpdate: (i: number, val: string) => void;
}) => {
  const { toast } = useToast();

  // Export goals as JSON
  const handleExport = () => {
    const data = JSON.stringify(
      goals.map((g) => g.goal),
      null,
      2,
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bingo-goals.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import goals from JSON
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const arr = JSON.parse(event.target?.result as string);
        if (!Array.isArray(arr)) throw new Error();
        arr.slice(0, goals.length).forEach((goal, i) => {
          if (typeof goal === "string") onUpdate(i, goal);
        });
      } catch {
        toast({
          title: "Import Failed",
          description:
            "Invalid file format. Please upload a valid JSON array of strings.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // reset input
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <ListOrdered className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-max-w-[425px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Edit All Goals</DialogTitle>
        </DialogHeader>
        {/* Export/Import Buttons */}
        <div className="flex gap-2 px-6 pt-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleImportClick}>
            Import
          </Button>
          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImport}
          />
        </div>
        <ScrollArea className="flex-1 w-full px-6">
          <div className="space-y-3 py-6">
            {goals.map((g, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono opacity-50 w-4">
                  {i + 1}
                </span>
                <Input
                  value={g.goal}
                  onChange={(e) => onUpdate(i, e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
