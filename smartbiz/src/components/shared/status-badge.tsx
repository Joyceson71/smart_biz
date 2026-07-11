import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { InvoiceStatus } from "@/types/database";

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case "paid":
      return <Badge variant="success" className={className}>Paid</Badge>;
    case "sent":
      return <Badge variant="info" className={className}>Sent</Badge>;
    case "viewed":
      return <Badge variant="info" className={cn("bg-blue-200 text-blue-800 dark:bg-blue-800/40 dark:text-blue-200", className)}>Viewed</Badge>;
    case "partial":
      return <Badge variant="warning" className={className}>Partial</Badge>;
    case "overdue":
      return <Badge variant="destructive" className={className}>Overdue</Badge>;
    case "draft":
      return <Badge variant="secondary" className={className}>Draft</Badge>;
    case "cancelled":
      return <Badge variant="outline" className={cn("text-muted-foreground", className)}>Cancelled</Badge>;
    default:
      return <Badge variant="outline" className={className}>{status}</Badge>;
  }
}
