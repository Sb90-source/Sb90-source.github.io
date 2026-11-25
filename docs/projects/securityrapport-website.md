---
title: Securityrapport van deze website
sidebar_label: Securityrapport website
sidebar_position: 3
description: Resultaat van het source-only-profiel van mijn eigen toolkit op de repository van deze site, wat er gevonden is en hoe het is opgelost.
---

# Securityrapport van deze website

**Datum:** 25 november 2026 · **Profiel:** `source-only` · **Toolkit:** [Security best-practices toolkit](./security-checklist-agents.md), commit `4803157`

Ik heb mijn eigen toolkit losgelaten op de repository van deze website. Het `source-only`-profiel draait twee checks die geen netwerktoegang tot een doel nodig hebben: een scan op dependency-kwetsbaarheden en een scan op secrets in de code en de git-geschiedenis.

## Samenvatting

| Check | Resultaat | Toelichting |
|---|---|---|
| `secrets-scan` (gitleaks 8.16) | PASS | Geen secrets in code of geschiedenis |
| `dependency-scan` (trivy) | SKIP | Trivy kon in mijn testomgeving niet worden geïnstalleerd; zie hieronder |
| Aanvullend: `npm audit` | Opgelost | 22 kwetsbare pakketten gevonden, teruggebracht naar 0 |

## Secrets: geslaagd, en gecontroleerd dat de check echt werkt

Gitleaks vond niets. Een lege uitkomst bewijst alleen weinig: als de tool niet goed draait, ziet dat er hetzelfde uit. Daarom heb ik een positieve controle gedaan: een testrepository met twee bekende nep-secrets (een AWS-sleutel en een GitHub-token). Gitleaks vond ze allebei. De PASS op de website is dus echt.

## Dependencies: SKIP is geen PASS

Trivy ontbrak in de omgeving waarin ik de scan draaide, dus de toolkit gaf `SKIP` in plaats van te doen alsof alles in orde was. Precies zoals bedoeld. Om het gat te dichten heb ik `npm audit` gedraaid, dat dezelfde vraag beantwoordt voor dit Node-project:

| Ernst | Aantal |
|---|---|
| Critical | 15 |
| High | 1 |
| Moderate | 6 |

Van de 1347 dependencies. De 15 critical meldingen kwamen bijna allemaal van Docusaurus-pakketten die alleen *indirect* kwetsbaar waren. De werkelijke oorzaken waren drie pakketten diep in de boom:

| Pakket | Probleem | Advies |
|---|---|---|
| `tinypool` 1.1.1 | Prototype pollution die tot remote code execution kan leiden | [GHSA-5gmw-xhrv-c9v3](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3), [GHSA-85c8-ppgw-ccpr](https://github.com/advisories/GHSA-85c8-ppgw-ccpr) |
| `serialize-javascript` 6.0.2 | RCE, XSS en denial of service | high |
| `uuid` 8.3.2 (via `sockjs`) | Ontbrekende bounds check | moderate |

### Impact

Deze pakketten draaien alleen tijdens het bouwen en in de lokale ontwikkelserver. De gepubliceerde site bestaat uit statische bestanden en bevat ze niet. Het risico zat dus in de buildomgeving (mijn laptop en de GitHub Actions-runner), niet bij bezoekers. Dat maakt het niet onbelangrijk: een gecompromitteerde build kan alsnog een besmette site publiceren.

### Oplossing

Het voorstel van `npm audit fix --force` was terug naar Docusaurus 3.7.0, een oudere hoofdversie. Dat heb ik niet gedaan. In plaats daarvan heb ik met `overrides` in `package.json` alleen de drie kwetsbare pakketten naar gepatchte versies gezet:

```json
"overrides": {
  "tinypool": "^2.2.0",
  "serialize-javascript": "^7.1.4",
  "uuid": "^11.1.1"
}
```

Resultaat: `npm audit` meldt 0 kwetsbaarheden. De productiebuild en de ontwikkelserver werken allebei nog.

## Vanaf nu automatisch: CI-gate

Elke push en pull request draait nu het `source-only`-profiel in GitHub Actions (`.github/workflows/security.yml`), daar wel met trivy erbij. Het rapport verschijnt in de samenvatting van elke run.

- De build faalt bij elke `FAIL`, maar ook bij `SKIP` of `ERROR`. Een check die niet gedraaid heeft, is niet geverifieerd.
- Alle gebruikte actions staan vast op een volledige commit-SHA in plaats van een versietag. Tags kunnen verplaatst worden: in maart 2026 zijn de tags van `trivy-action` en `setup-trivy` zelf misbruikt om malware in pipelines te krijgen.
- Trivy staat vast op een specifieke versie, gitleaks komt uit de Ubuntu-pakketbron.

## Verbeterpunt voor de toolkit

Tijdens deze test viel me iets op in mijn eigen code: `secrets-scan.sh` behandelt een leeg gitleaks-rapport als PASS, ook als gitleaks zelf vastloopt. Een kapotte installatie levert dan een valse PASS op. De volgende versie controleert de exitcode van gitleaks en geeft `ERROR` als de scan niet echt heeft gedraaid.

Gerelateerd: [Portfoliowebsite](./portfolio-website.md)
