import dynamic from "next/dynamic";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";

const AICoreScene = dynamic(() => import("./AICoreScene"), { 
  loading: () => <SkeletonLoader /> 
});

export const metadata = {
  title: "AI Command Center | SmartBiz OS",
};

export default function AICorePage() {
  return <AICoreScene />;
}
