/** Subscription plan definitions and feature limits */

export const PLANS = {
  FREE: "free",
  PRO: "pro",
  ENTERPRISE: "enterprise",
} as const;

export type Plan = (typeof PLANS)[keyof typeof PLANS];

export interface PlanLimits {
  invoicesPerMonth: number;
  ocrScansPerMonth: number;
  aiQueriesPerDay: number;
  teamMembers: number;
  storageGB: number;
  reportExport: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    invoicesPerMonth: 25,
    ocrScansPerMonth: 10,
    aiQueriesPerDay: 5,
    teamMembers: 1,
    storageGB: 1,
    reportExport: false,
    customBranding: false,
    apiAccess: false,
    prioritySupport: false,
  },
  pro: {
    invoicesPerMonth: Infinity,
    ocrScansPerMonth: 200,
    aiQueriesPerDay: 50,
    teamMembers: 10,
    storageGB: 10,
    reportExport: true,
    customBranding: true,
    apiAccess: false,
    prioritySupport: true,
  },
  enterprise: {
    invoicesPerMonth: Infinity,
    ocrScansPerMonth: Infinity,
    aiQueriesPerDay: Infinity,
    teamMembers: Infinity,
    storageGB: 100,
    reportExport: true,
    customBranding: true,
    apiAccess: true,
    prioritySupport: true,
  },
} as const;

export const PLAN_PRICES = {
  pro: {
    monthly: 999,   // ₹999/month
    yearly: 9999,   // ₹9,999/year (save ~17%)
  },
  enterprise: {
    monthly: 4999,
    yearly: 49999,
  },
} as const;
