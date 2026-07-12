"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import * as React from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export function MobileNav() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 border-r-0 bg-slate-50 dark:bg-slate-900 w-72">
        <VisuallyHidden.Root>
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Main navigation for the application</SheetDescription>
        </VisuallyHidden.Root>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
