import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface TimePickerProps {
  onChange?: (time: string) => void;
  value?: string;
}

export function TimePicker({ onChange, value }: TimePickerProps) {
  const [time, setTime] = React.useState<string>(value || "");

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (onChange) {
      onChange(newTime);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !time && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? time : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <Input
          type="time"
          value={time}
          onChange={handleTimeChange}
          className="w-[120px]"
        />
      </PopoverContent>
    </Popover>
  );
} 