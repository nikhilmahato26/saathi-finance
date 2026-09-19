"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, Trash2, Users, Copy, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormError } from "@/components/form-error";
import { EnumSelectField } from "./enum-select-field";
import { StampButton } from "./stamp-button";
import { saveKyc, type StationFormState } from "@/app/dashboard/leads/[leadId]/application/actions";
import {
  HOME_LOAN_SUBTYPES,
  MEMBER_RELATIONS,
  type KycFields,
  type KycMember,
} from "@/lib/home-loan-schema";

const MAX_MEMBERS = 3;

export function KycStation({
  leadId,
  initial,
  onSaved,
}: {
  leadId: string;
  initial?: KycFields;
  onSaved: () => void;
}) {
  const action = saveKyc.bind(null, leadId);
  const [state, formAction] = useActionState<StationFormState, FormData>(action, undefined);
  const lastHandled = useRef<StationFormState>(undefined);

  const [primaryAddress, setPrimaryAddress] = useState(initial?.address ?? "");
  const [members, setMembers] = useState<KycMember[]>(initial?.members ?? []);
  const [clientError, setClientError] = useState<string | null>(null);

  useEffect(() => {
    if (state?.ok && state !== lastHandled.current) {
      lastHandled.current = state;
      onSaved();
    }
  }, [state, onSaved]);

  function handleAddMember() {
    if (members.length >= MAX_MEMBERS) return;
    const newId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `member-${Date.now()}`;

    setMembers((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        relation: "SPOUSE",
        dob: "",
        pan: "",
        aadhaar: "",
        address: primaryAddress,
        mobile: "",
      },
    ]);
    setClientError(null);
  }

  function handleRemoveMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setClientError(null);
  }

  function handleUpdateMember(id: string, patch: Partial<KycMember>) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    setClientError(null);
  }

  function handleCopyPrimaryAddress(id: string) {
    if (!primaryAddress) {
      setClientError("Please enter the primary applicant address first.");
      return;
    }
    handleUpdateMember(id, { address: primaryAddress });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      const memberLabel = m.name?.trim() ? `Member ${i + 1} (${m.name})` : `Member ${i + 1}`;
      if (!m.name.trim()) {
        e.preventDefault();
        setClientError(`Please enter full name for ${memberLabel}.`);
        return;
      }
      if (!m.relation) {
        e.preventDefault();
        setClientError(`Please select relationship for ${memberLabel}.`);
        return;
      }
      if (!m.dob) {
        e.preventDefault();
        setClientError(`Please enter date of birth for ${memberLabel}.`);
        return;
      }
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(m.pan.trim().toUpperCase())) {
        e.preventDefault();
        setClientError(`${memberLabel}: PAN must be formatted as ABCDE1234F.`);
        return;
      }
      if (!/^\d{12}$/.test(m.aadhaar.trim())) {
        e.preventDefault();
        setClientError(`${memberLabel}: Aadhaar must be exactly 12 digits.`);
        return;
      }
      if (!m.address.trim()) {
        e.preventDefault();
        setClientError(`Please enter address for ${memberLabel}.`);
        return;
      }
      if (m.mobile && !/^\d{10}$/.test(m.mobile.trim())) {
        e.preventDefault();
        setClientError(`${memberLabel}: Mobile number must be 10 digits.`);
        return;
      }
    }
    setClientError(null);
  }

  const relationLabelMap = Object.fromEntries(MEMBER_RELATIONS.map((r) => [r.key, r.label]));

  return (
    <form action={formAction} onSubmit={handleSubmit} className="grid max-w-2xl gap-6">
      <div>
        <h2 className="text-lg font-semibold">Customer Details</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Enter primary borrower identity details and select the loan category.
        </p>
      </div>

      {(clientError || state?.error) && (
        <FormError>{clientError ?? state?.error}</FormError>
      )}

      <EnumSelectField
        name="subType"
        label="Loan sub-type"
        options={HOME_LOAN_SUBTYPES}
        defaultValue={initial?.subType}
      />

      <div className="grid gap-1.5">
        <Label htmlFor="dob">Date of birth</Label>
        <Input id="dob" name="dob" type="date" defaultValue={initial?.dob} required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          rows={2}
          value={primaryAddress}
          onChange={(e) => setPrimaryAddress(e.target.value)}
          placeholder="Complete residential address"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="pan">PAN</Label>
          <Input
            id="pan"
            name="pan"
            placeholder="ABCDE1234F"
            defaultValue={initial?.pan}
            className="uppercase font-mono"
            maxLength={10}
            required
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="aadhaar">Aadhaar number</Label>
          <Input
            id="aadhaar"
            name="aadhaar"
            inputMode="numeric"
            placeholder="12-digit number"
            maxLength={12}
            defaultValue={initial?.aadhaar}
            required
          />
        </div>
      </div>

      {/* ADDITIONAL MEMBERS & THEIR KYC SECTION */}
      <div className="border-t pt-6 mt-2 grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">Additional Members / Co-Applicants</h3>
              <Badge variant="secondary" className="font-mono text-xs">
                {members.length}/{MAX_MEMBERS} Added
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add up to {MAX_MEMBERS} members (co-borrowers / family members) and complete their KYC.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddMember}
            disabled={members.length >= MAX_MEMBERS}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </Button>
        </div>

        {members.length >= MAX_MEMBERS && (
          <p className="text-xs text-muted-foreground italic">
            Maximum limit of {MAX_MEMBERS} members reached.
          </p>
        )}

        {/* Hidden JSON input passed with form submit */}
        <input type="hidden" name="members" value={JSON.stringify(members)} />

        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 px-4 text-center">
            <Users className="h-8 w-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">No additional members added</p>
            <p className="text-xs text-muted-foreground/80 mt-1 max-w-sm">
              If this loan includes joint applicants, family members, or co-borrowers, click &ldquo;Add Member&rdquo; above to record their KYC.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="rounded-lg border bg-card p-4 text-card-foreground shadow-xs grid gap-4"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="font-medium text-sm">
                      {member.name.trim() || `Member ${index + 1}`}
                    </span>
                    <Badge variant="outline" className="text-[11px] font-normal">
                      {relationLabelMap[member.relation] ?? member.relation}
                    </Badge>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="h-8 px-2 text-muted-foreground hover:text-destructive gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="text-xs">Remove</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor={`member-name-${member.id}`} className="text-xs font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id={`member-name-${member.id}`}
                      value={member.name}
                      onChange={(e) => handleUpdateMember(member.id, { name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      required
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor={`member-relation-${member.id}`} className="text-xs font-medium">
                      Relationship *
                    </Label>
                    <Select
                      value={member.relation}
                      onValueChange={(val) => handleUpdateMember(member.id, { relation: val ?? "" })}
                    >
                      <SelectTrigger id={`member-relation-${member.id}`} className="w-full">
                        <SelectValue placeholder="Select relation">
                          {relationLabelMap[member.relation] ?? member.relation}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {MEMBER_RELATIONS.map((r) => (
                          <SelectItem key={r.key} value={r.key}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor={`member-dob-${member.id}`} className="text-xs font-medium">
                      Date of Birth *
                    </Label>
                    <Input
                      id={`member-dob-${member.id}`}
                      type="date"
                      value={member.dob}
                      onChange={(e) => handleUpdateMember(member.id, { dob: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor={`member-mobile-${member.id}`} className="text-xs font-medium">
                      Mobile Number (Optional)
                    </Label>
                    <Input
                      id={`member-mobile-${member.id}`}
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={member.mobile ?? ""}
                      onChange={(e) =>
                        handleUpdateMember(member.id, {
                          mobile: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="10-digit mobile"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor={`member-pan-${member.id}`} className="text-xs font-medium">
                      Member PAN *
                    </Label>
                    <Input
                      id={`member-pan-${member.id}`}
                      value={member.pan}
                      maxLength={10}
                      onChange={(e) =>
                        handleUpdateMember(member.id, {
                          pan: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="ABCDE1234F"
                      className="uppercase font-mono"
                      required
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor={`member-aadhaar-${member.id}`} className="text-xs font-medium">
                      Member Aadhaar Number *
                    </Label>
                    <Input
                      id={`member-aadhaar-${member.id}`}
                      value={member.aadhaar}
                      maxLength={12}
                      inputMode="numeric"
                      onChange={(e) =>
                        handleUpdateMember(member.id, {
                          aadhaar: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="12-digit number"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`member-address-${member.id}`} className="text-xs font-medium">
                      Member Residential Address *
                    </Label>
                    {primaryAddress && (
                      <button
                        type="button"
                        onClick={() => handleCopyPrimaryAddress(member.id)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Same as primary address</span>
                      </button>
                    )}
                  </div>
                  <Textarea
                    id={`member-address-${member.id}`}
                    rows={2}
                    value={member.address}
                    onChange={(e) => handleUpdateMember(member.id, { address: e.target.value })}
                    placeholder="Residential address"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {members.length > 0 && (
          <div className="flex items-center gap-2 rounded-md bg-secondary/50 p-2.5 text-xs text-muted-foreground">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              Member KYC documents (Aadhaar Card & PAN Card) can be uploaded under the KYC category in Station 5 (Documents).
            </span>
          </div>
        )}
      </div>

      <StampButton />
    </form>
  );
}
