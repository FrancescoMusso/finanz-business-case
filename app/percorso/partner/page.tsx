"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUtente } from "@/components/Providers";
import { BottomBar, ChipStato, Icona, PrimaryButton, SecondaryButton, Sheet, TastoTondo } from "@/components/ui";
import { campiPreventivo, DISCLAIMER, FASCIA_PREZZO, MESSAGGIO_INTENTO } from "@/lib/partner";
import { NOME_RAMO, type Ramo, type Utente } from "@/lib/utenti";

const OGGETTO: Partial<Record<Ramo, string>> = { casa: "casa del tuo immobile" };
const AVVISO: Partial<Record<Ramo, string>> = { vita: "Ti chiederemo anche qualche dato sulla tua salute." };

// La schermata che porta al comparatore del partner, dopo il percorso.
// Ha due versioni (vedi VariantePartner): quella di prima e la proposta del business case.
export default function SchermataPartner() {
  const { utente, variantePartner, track } = useUtente();
  const router = useRouter();
  const tracciato = useRef(false);

  useEffect(() => {
    if (tracciato.current) return;
    tracciato.current = true;
    track("Partner Screen Viewed", { variante: variantePartner });
  }, [track, variantePartner]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-4">
        <TastoTondo label="Chiudi" onClick={() => router.push("/")}>
          <Icona nome="x" size={22} />
        </TastoTondo>
        <ChipStato serie={false} />
      </div>

      <div className="flex flex-col gap-5 px-4 pt-4 pb-8">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight">🛡️ Trova la tua polizza</h1>
        {variantePartner === "dopo" ? <ContenutoDopo utente={utente} /> : <ContenutoPrima utente={utente} />}
      </div>

      <BottomBar>
        <PrimaryButton
          onClick={() => {
            track("Partner CTA Clicked", { variante: variantePartner });
            router.push("/comparatore");
          }}
        >
          Confronta le polizze
        </PrimaryButton>
        <SecondaryButton onClick={() => router.push("/")}>Torna alla Home</SecondaryButton>
      </BottomBar>
    </div>
  );
}

// Com'era: stesso pitch per tutti e disclaimer stampato sopra al bottone.
function ContenutoPrima({ utente }: { utente: Utente }) {
  return (
    <>
      <p className="text-lg leading-snug font-semibold">
        Confronta in pochi minuti le offerte di tante compagnie per la polizza{" "}
        {OGGETTO[utente.ramo] ?? NOME_RAMO[utente.ramo]}.
      </p>
      <p className="rounded-2xl bg-box-azzurro px-6 py-4 text-lg leading-relaxed">
        Un solo modulo, tanti preventivi. Vedi prezzi, massimali e franchigie uno accanto all&apos;altro.
      </p>
      <p className="rounded-2xl bg-box-giallo px-6 py-4 text-lg leading-relaxed">
        Il confronto è gratis e non ti impegna. {AVVISO[utente.ramo]}
      </p>
      <p className="text-sm leading-relaxed text-muted">{DISCLAIMER}</p>
    </>
  );
}

// La proposta: messaggio per intento, fascia di prezzo del ramo, cosa verrà chiesto dopo.
// Il disclaimer c'è sempre, ma dietro un link, fuori dal punto in cui l'utente decide.
function ContenutoDopo({ utente }: { utente: Utente }) {
  const [perche, setPerche] = useState(false);
  const [min, max] = FASCIA_PREZZO[utente.ramo];

  return (
    <>
      <p className="text-lg leading-snug font-semibold">{MESSAGGIO_INTENTO[utente.onboarding_intent]}</p>

      <div className="flex flex-col gap-1.5 rounded-2xl border border-kiwi-200 bg-kiwi-50 px-6 py-4">
        <p className="text-xs font-bold tracking-wide text-muted uppercase">Fascia indicativa · {NOME_RAMO[utente.ramo]}</p>
        <p className="text-[28px] leading-tight font-extrabold text-forest tabular-nums">
          {min}–{max} €/anno
        </p>
        <p className="text-sm leading-snug">
          Confrontando tra più compagnie, non una raccomandazione su quale scegliere.
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border-[1.5px] border-dashed border-line px-5 py-4">
        <p className="font-bold">Cosa ti chiederemo dopo</p>
        <ul className="list-disc pl-5 text-base leading-relaxed">
          {campiPreventivo(utente.ramo).map((campo) => (
            <li key={campo}>{campo}</li>
          ))}
        </ul>
        {AVVISO[utente.ramo] && <p className="text-sm leading-snug font-semibold">{AVVISO[utente.ramo]}</p>}
        <p className="text-sm text-muted">⏱ circa 2 minuti · nessun obbligo</p>
      </div>

      <button
        type="button"
        onClick={() => setPerche(true)}
        className="-my-2 self-start py-2 text-sm font-semibold text-forest underline underline-offset-2"
      >
        Perché Finanz non consiglia una polizza →
      </button>

      {perche && (
        <Sheet onClose={() => setPerche(false)}>
          <p className="text-center text-[32px] leading-tight font-bold tracking-tight">
            Perché Finanz non consiglia una polizza
          </p>
          <p className="mt-3 mb-5 text-center text-lg leading-snug">{DISCLAIMER}</p>
          <PrimaryButton onClick={() => setPerche(false)}>Ho capito</PrimaryButton>
        </Sheet>
      )}
    </>
  );
}
