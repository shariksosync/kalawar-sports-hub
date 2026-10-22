import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Badge, DemoTag, Icon, PageHero, QrMock, Section, statusTone } from "@/components/kit";
import { Site, StatusPill, seo } from "@/components/site";
import type { Rec } from "@/data/mock";

export const Route = createFileRoute("/verify")({
  head: () =>
    seo(
      "Certificate Verification",
      "Public certificate verification system for KALAWAR Sports belts, referee credentials and course completion."
    ),
  component: VerifyCertificate,
});

const SAMPLES = [
  "KS-CERT-2026-0001",
  "KS-CERT-2026-0002",
  "KS-CERT-2026-0003",
  "KS-CERT-2025-0114",
];

function VerifyCertificate() {
  const { db } = useStore();
  const [certId, setCertId] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Rec | null>(null);

  const handleVerify = (idToSearch?: string) => {
    const id = (idToSearch ?? certId).trim();
    if (!id) return;
    setCertId(id);
    setSearched(true);
    const found = (db.certificates ?? []).find(
      (c: Rec) => c.id.toLowerCase() === id.toLowerCase()
    );
    setResult(found || null);
  };

  return (
    <Site>
      <PageHero
        title="Certificate Verification"
        sub="Verify the authenticity of digital certificates issued by KALAWAR Sports."
        img="martial"
      />

      <Section
        title="Verify Certificate Credential"
        eyebrow="Verification Portal"
        sub="Enter the unique certificate number located at the bottom of the issued digital certificate."
        action={<DemoTag>Sample verification registry</DemoTag>}
      >
        <div className="mx-auto max-w-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Icon
                name="shield"
                className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. KS-CERT-2026-0001"
                className="field !pl-11"
                aria-label="Certificate number"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary sm:w-auto">
              Verify Certificate
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-muted-foreground">Try sample numbers:</span>
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleVerify(s)}
                className="rounded-full border border-primary/40 bg-primary/5 px-2.5 py-1 font-mono text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search Result Card */}
          {searched && (
            <div className="mt-8 animate-fade-in">
              {result ? (
                <div className="card overflow-hidden border-2 border-primary/30 p-6 shadow-xl sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Credential ID: {result.id}
                        </span>
                        <StatusPill s={result.status} />
                      </div>
                      <h3 className="mt-2 font-display text-3xl font-black uppercase text-foreground">
                        {result.name}
                      </h3>
                      <p className="text-lg font-semibold text-primary">{result.title}</p>
                    </div>
                    <div className="rounded-xl border bg-muted/40 p-3 text-center">
                      <QrMock text={result.id} />
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Scan Demo QR
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Issued Date</p>
                      <p className="mt-1 font-bold">{result.issued}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Issuing Authority</p>
                      <p className="mt-1 font-bold">KALAWAR Sports Federation</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Verification Status</p>
                      <p className="mt-1 flex items-center gap-1.5 font-bold">
                        <Icon name="check" className="h-4 w-4 text-success" />
                        {result.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">Demonstration Notice:</p>
                    <p className="mt-1">
                      This record is part of the KALAWAR Sports prototype database. It represents an
                      illustrative credential and should not be used as an official legal document.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="card border-dashed p-8 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
                    <Icon name="x" className="h-6 w-6" />
                  </div>
                  <h3 className="mt-3 text-lg font-bold">Certificate Not Found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No certificate matching <span className="font-mono font-semibold">{certId}</span> was
                    found in the demonstration registry. Please verify the number and try again.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Section>
    </Site>
  );
}
