"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
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
  const email = String(formData.get("email") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const productKey = String(formData.get("product") ?? "").trim();
  const rawAmount = String(formData.get("amount") ?? "").replace(/[^0-9]/g, "");
  const loanAmount = rawAmount ? parseInt(rawAmount, 10) : null;
  const initialNote = String(formData.get("note") ?? "").trim();
  const assignedToIdInput = String(formData.get("assignedToId") ?? "").trim();

  const product = getProductOption(productKey);

  if (!name || !/^[6-9]\d{9}$/.test(mobile) || !product) {
    throw new Error("Invalid input. Please ensure name, 10-digit mobile, and product are correct.");
  }

  // Ensure customer exists
  const customer = await db.user.upsert({
    where: { mobile },
    update: {
      ...(email ? { email } : {}),
    },
    create: {
      mobile,
      name,
      ...(email ? { email } : {}),
      role: "CUSTOMER",
    },
  });

  const leadCode = await generateLeadCode();

  // If role is EMPLOYEE, the lead is created on their own and automatically self-assigned
  let assignedToId: string | null = session.user.id;
  if (role === "ADMIN" || role === "MANAGER") {
    if (assignedToIdInput === "unassigned") {
      assignedToId = null;
    } else if (assignedToIdInput) {
      assignedToId = assignedToIdInput;
    }
  }

  const lead = await db.lead.create({
    data: {
      leadCode,
      category: product.category,
      productType: product.key,
      routeType: product.routeType,
      source: "DIRECT",
      customerId: customer.id,
      createdById: session.user.id,
      assignedToId,
      ...(loanAmount || city
        ? {
            application: {
              create: {
                fieldsJson: {
                  loanDetails: {
                    ...(loanAmount ? { amount: loanAmount } : {}),
                    ...(city ? { city } : {}),
                  },
                },
              },
            },
          }
        : {}),
      ...(initialNote
        ? {
            notes: {
              create: {
                authorId: session.user.id,
                text: initialNote,
              },
            },
          }
        : {}),
    },
  });

  // Audit activity log
  const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
  await db.activityLog.create({
    data: {
      actorId: session.user.id,
      action: "LEAD_CREATED",
      entityType: "Lead",
      entityId: lead.id,
      ipAddress: ip,
    },
  });

  revalidatePath("/dashboard/employee");
  revalidatePath("/dashboard/manager/leads");
  revalidatePath("/dashboard/admin/leads");
  revalidatePath("/dashboard/admin/activity");

  redirect(`/dashboard/leads/${lead.id}`);
}

