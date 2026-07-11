import { cn } from "@/lib/utils/cn";

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoadingSkeleton({ className, ...props }: LoadingSkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/60", className)}
      {...props}
    />
  );
}
