"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { ActivityFeedPanel } from "./ActivityFeedPanel";

export function ActivityFeedToggle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <History 
        className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" 
        onClick={() => setOpen(true)}
      />
      <ActivityFeedPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
