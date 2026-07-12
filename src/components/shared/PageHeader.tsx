import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  action,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-8",
        className
      )}
      {...props}
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground mt-1 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center space-x-2">
          {action}
        </div>
      )}
    </div>
  );
}
