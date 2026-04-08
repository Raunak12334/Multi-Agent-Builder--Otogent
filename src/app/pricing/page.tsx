import { enforceAppRouting } from "@/lib/auth-utils";
import { PricingTable } from "./pricing-table";

export default async function PricingPage() {
  await enforceAppRouting("/pricing");

  return <PricingTable />;
}
