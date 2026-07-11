import { z } from "zod";

export const getRevenueTool = {
  type: "function" as const,
  function: {
    name: "get_revenue",
    description: "Get total revenue and expenses for a specific period",
    parameters: {
      type: "object",
      properties: {
        period: {
          type: "string",
          enum: ["this_month", "last_month", "this_quarter", "this_year"],
          description: "The time period to check",
        },
      },
      required: ["period"],
    },
  },
};

export const getTopCustomersTool = {
  type: "function" as const,
  function: {
    name: "get_top_customers",
    description: "Get a list of the top customers by revenue",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of customers to return (default 5)",
        },
      },
      required: [],
    },
  },
};

export const getOverdueInvoicesTool = {
  type: "function" as const,
  function: {
    name: "get_overdue_invoices",
    description: "Get a list of all currently overdue sales invoices",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

export const tools = [getRevenueTool, getTopCustomersTool, getOverdueInvoicesTool];
