"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  QrCode,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

interface AdvisorLeadLinkProps {
  employeeId: string;
  employeeCode?: string | null;
  employeeName: string;
}

export function AdvisorLeadLink({
  employeeId,
  employeeCode,
  employeeName,
}: AdvisorLeadLinkProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );

  const refCode = employeeCode || employeeId;
  const shareUrl = origin ? `${origin}/apply?ref=${refCode}` : `/apply?ref=${refCode}`;

  useEffect(() => {
    if (shareUrl && showQr && !qrUrl) {
      QRCode.toDataURL(shareUrl, {
        width: 240,
        margin: 1.5,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
        .then((url) => setQrUrl(url))
        .catch(() => {});
    }
  }, [shareUrl, showQr, qrUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Advisor referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleWhatsApp = () => {
    const text = `Hi! Apply for Home Loan, Personal Loan, Vehicle Loan, or Business Finance directly with Saathi Finance using my advisor link: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Share2 className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Your Client Sourcing Link
              </h3>
              <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                {employeeCode ?? "ADVISOR"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Share with borrowers. Applications submitted through this link route automatically to your desk.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="h-8 text-xs gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleWhatsApp}
            className="h-8 text-xs gap-1.5 text-emerald-600 hover:text-emerald-700"
          >
            <span>WhatsApp</span>
          </Button>

          <Button
            size="sm"
            variant={showQr ? "secondary" : "outline"}
            onClick={() => setShowQr(!showQr)}
            className="h-8 text-xs gap-1.5"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>{showQr ? "Hide QR" : "Show QR"}</span>
          </Button>
        </div>
      </div>

      {showQr && (
        <div className="mt-4 border-t pt-4 flex flex-col sm:flex-row items-center gap-4 bg-muted/20 p-4 rounded-lg">
          {qrUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrUrl}
              alt="Advisor QR Code"
              className="h-36 w-36 rounded-md border bg-white p-2 shadow-xs"
            />
          ) : (
            <div className="h-36 w-36 animate-pulse rounded-md bg-muted border" />
          )}
          <div className="text-center sm:text-left space-y-1">
            <p className="text-xs font-semibold text-foreground">
              Client QR Code — {employeeName}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Borrowers can scan this code with their smartphone camera on field visits to open your direct application portal.
            </p>
            <p className="font-mono text-[11px] text-muted-foreground break-all pt-1">
              {shareUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
