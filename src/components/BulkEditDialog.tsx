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

export const BulkEditDialog = ({
  goals,
  onUpdate,
}: {
  goals: { goal: string }[];
  onUpdate: (i: number, val: string) => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <ListOrdered className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit All Goals</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3 py-4">
            {goals.map((g, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono opacity-50 w-4">
                  {i + 1}
                </span>
                <Input
                  value={g.goal}
                  onChange={(e) => onUpdate(i, e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
