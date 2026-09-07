"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateLeadCode } from "@/lib/lead-code";
import { getProductOption } from "@/lib/products";

export async function createManualLead(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "MANAGER" && role !== "EMPLOYEE") {
    throw new Error("Unauthorized");
  }

  const name = String(formData.get("name") ?? "").trim();
  const mobile = String(formData.get("mobile") ?? "").trim();
  const productKey = String(formData.get("product") ?? "").trim();

  const product = getProductOption(productKey);

  if (!name || !/^[6-9]\d{9}$/.test(mobile) || !product) {
    throw new Error("Invalid input. Please ensure name, 10-digit mobile, and product are correct.");
  }

  // Ensure customer exists
  const customer = await db.user.upsert({
    where: { mobile },
    update: {},
    create: { mobile, name, role: "CUSTOMER" },
  });

  const leadCode = await generateLeadCode();

  const lead = await db.lead.create({
    data: {
      leadCode,
      category: product.category,
      productType: product.key,
      routeType: product.routeType,
      source: "DIRECT",
      customerId: customer.id,
      createdById: session.user.id,
      assignedToId: role === "EMPLOYEE" || role === "MANAGER" ? session.user.id : null,
    },
  });

  redirect(`/dashboard/leads/${lead.id}`);
}
