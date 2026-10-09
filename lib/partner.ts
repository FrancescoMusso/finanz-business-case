// Contenuti della schermata "Trova la tua polizza" e del modulo del comparatore.
// Stanno qui perché la schermata anticipa i campi che il modulo chiederà poi:
// una sola lista, così le due schermate non possono dire cose diverse.

import type { Intento, Ramo } from "@/lib/utenti";

// "prima" è la schermata com'era; "dopo" è la proposta del business case.
export type VariantePartner = "prima" | "dopo";

// Campi che il modulo del partner chiede, per ramo.
const CAMPI: Record<Ramo, string[]> = {
  rc_auto: ["Targa", "Data di nascita del proprietario", "Classe di merito"],
  casa: ["CAP dell'abitazione", "Metri quadri", "Anno di costruzione"],
  salute: ["Data di nascita", "Professione", "Preferisci rimborso o rete convenzionata?"],
  vita: ["Data di nascita", "Fumatore?", "Capitale da assicurare (€)"],
  dentale: ["Data di nascita", "CAP", "Componenti del nucleo"],
};

const CAMPI_COMUNI = ["Massimale", "Franchigia", "Email"];

export function campiPreventivo(ramo: Ramo): string[] {
  return [...CAMPI[ramo], ...CAMPI_COMUNI];
}

// ATTENZIONE: valori illustrativi del formato, NON dati di mercato.
// Nella feature finale vanno calcolati come intervallo aggregato e anonimo
// sulle attivazioni passate per ramo (euro l'anno).
export const FASCIA_PREZZO: Record<Ramo, [min: number, max: number]> = {
  rc_auto: [280, 520],
  casa: [120, 310],
  salute: [200, 650],
  vita: [150, 480],
  dentale: [90, 260],
};

// Il messaggio dipende da cosa l'utente ha risposto in onboarding.
// A chi ha già una polizza non promettiamo risparmio: il payout del partner vale
// solo per una polizza nuova, un rinnovo o un cambio varrebbe 0 €.
export const MESSAGGIO_INTENTO: Record<Intento, string> = {
  "Sì, ne ho già una o più": "Controlla cosa copre la polizza che hai e se ti manca una copertura.",
  "No, ma sto pensando di farne una": "Hai appena finito il percorso: è un buon momento per vedere quanto costerebbe davvero.",
  No: "Nessuna fretta: dai un'occhiata ai prezzi, senza nessun impegno.",
};

// Disclaimer normativo: nella variante "dopo" sta dietro il link, ma il testo resta lo stesso.
export const DISCLAIMER =
  "Finanz non è un intermediario assicurativo e non ti consiglia una polizza specifica. Il confronto è offerto da un partner iscritto al Registro Unico degli Intermediari (RUI).";
