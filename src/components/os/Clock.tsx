"use client";

import { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <span className="opacity-0 w-16 inline-block text-right">00:00 AM</span>;
  }

  return (
    <span suppressHydrationWarning className="w-16 inline-block text-right">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}
