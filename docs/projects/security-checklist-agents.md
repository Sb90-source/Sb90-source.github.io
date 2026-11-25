---
title: Security best-practices toolkit voor AI-agents
sidebar_label: AI-security-toolkit
sidebar_position: 2
description: Een securitybibliotheek met verwijzingen naar standaarden plus compliance checks waarmee AI-codeeragents het project beveiligen waarin ze werken.
---

# Security best-practices toolkit voor AI-agents

**Status:** werkend, v1 · **Repository:** privé (op aanvraag beschikbaar)

Een toolkit die je downloadt en direct gebruikt: een AI-codeeragent (Claude Code, Cursor, Copilot) zet hem in een project om dat volgens de huidige best practices te beveiligen. Hij bestaat uit twee delen: een referentiebibliotheek die 23 securitydomeinen koppelt aan gezaghebbende standaarden, en een set compliance checks die het machinaal controleerbare deel automatisch verifiëren. Elke bevinding verwijst naar de sectie in de bibliotheek en de standaard erachter.

## Het probleem

AI-codeeragents schrijven snel veel code, maar passen securitystandaarden niet consequent toe, en als ze dat wel doen noemen ze vaak verouderde versies (OWASP Top 10 2021, ASVS 4.0.3). Ik wilde één bron van waarheid waar de agent vanuit moet werken, met gecontroleerde versies, plus checks die het resultaat bewijzen in plaats van erop te vertrouwen.

## Hoe het werkt

De repository volgt de `AGENTS.md`-conventie, dus elke agent pikt de instructies automatisch op. De agent doorloopt vijf stappen:

1. **Omgeving herkennen** aan de bestanden in de repo: frontend, API-backend, containers, IoT-firmware, mobiel, LLM-functies, identiteit, e-mail/DNS, cloud.
2. **Koppelen aan secties in de bibliotheek.** §1–§3 (governance, secure SDLC, supply chain) en §21 (threat modelling) gelden altijd; de rest hangt af van wat er herkend is. Een LLM-functie haalt §17 erbij, actief zijn in de EU §22.
3. **Compliance-profiel kiezen**: `web-app`, `api`, `network-host`, `cloud-container`, `iot-device`, `source-only` of `full`.
4. **Checks draaien** in een Docker-image met alle scanners erin, zodat er niets op de host wordt geïnstalleerd.
5. **Oplossen en opnieuw draaien.** Elke `FAIL` of `WARN` verwijst naar een `§N`; de agent past de kernpraktijken van die sectie toe en draait het profiel opnieuw tot de bevinding weg is.

## Referentiebibliotheek

23 domeinen, elk met de bronnen (huidige editie gecontroleerd op de reviewdatum) en de praktijken die die bronnen echt vereisen.

| § | Domein | Belangrijkste referenties |
|---|---|---|
| 1 | Governance, frameworks, volwassenheid | NIST CSF 2.0, ISO/IEC 27001:2022 en 27002:2022, CIS Controls v8.1, OWASP SAMM v2, BSIMM |
| 2 | Secure SDLC en DevSecOps | NIST SP 800-218 (SSDF), SP 800-218A, OWASP DevSecOps Guideline |
| 3 | Software supply chain | NIST SP 800-161r1, OWASP Top 10 CI/CD Risks, SBOM |
| 4 | Applicatiebeveiliging | OWASP Top 10:2025, ASVS 5.0.0, WSTG, Cheat Sheet Series |
| 5 | API-beveiliging | OWASP API Security Top 10 (2023) |
| 6 | Authenticatie en identiteit | NIST SP 800-63-4 |
| 7 | Autorisatie en toegangsbeheer | NIST SP 800-162 (ABAC), SP 800-207 (Zero Trust) |
| 8 | Cryptografie en sleutelbeheer | NIST SP 800-57, SP 800-52r2, FIPS 203/204/205 (post-quantum) |
| 9 | Gegevensbescherming en privacy | AVG (GDPR), NIST Privacy Framework, ISO/IEC 27701 |
| 10 | Logging, monitoring, detectie | OWASP Logging Cheat Sheet, NIST SP 800-92, MITRE ATT&CK |
| 11 | Incidentrespons en weerbaarheid | NIST SP 800-61r3, SP 800-34r1, CISA #StopRansomware Guide |
| 12 | Cloud en infrastructuur | CIS Benchmarks, CSA Cloud Controls Matrix, NIST SP 800-53 Rev. 5 |
| 13 | Containers en orchestratie | NIST SP 800-190, CIS Docker/Kubernetes Benchmarks, NSA/CISA Kubernetes Hardening |
| 14 | Netwerkbeveiliging en Zero Trust | NIST SP 800-207, CISA Zero Trust Maturity Model v2.0, SP 800-41r1 |
| 15 | Browser en client-side | MDN (CSP, CORS, Trusted Types, COOP/COEP), W3C SRI |
| 16 | Mobiel | OWASP MASVS 2.x, MASTG, Mobile Top 10 |
| 17 | AI- / LLM- / ML-beveiliging | OWASP Top 10 for LLM Applications 2025, OWASP Top 10 for Agentic Applications, NIST AI RMF en AI 600-1, MITRE ATLAS, ISO/IEC 42001:2023 |
| 18 | IoT, embedded, hardware | ETSI EN 303 645, NIST SP 800-213, OWASP IoT Top 10, SP 800-193 |
| 19 | Protocol- en mechanisme-specifieke richtlijnen | WebSockets (RFC 6455), webhooks, DNS, e-mailauthenticatie, bestandsupload, deserialisatie |
| 20 | Multi-tenancy en isolatie | OWASP Multi-Tenant Application Security Cheat Sheet |
| 21 | Threat modelling en zwakheden-taxonomieën | STRIDE, PASTA, MITRE ATT&CK, CWE |
| 22 | EU- en Nederlandse regelgeving | NIS2 (Cyberbeveiligingswet), DORA, Cyber Resilience Act, EU AI Act, BIO |
| 23 | Centrale bronnenindex | Alle bovenstaande, met links |

Tijdens het bouwen heb ik verouderde versies die vaak rondgaan gecorrigeerd, bijvoorbeeld OWASP Top 10 naar de editie van 2025, ASVS naar 5.0.0, NIST SP 800-63 naar Rev. 4 en SP 800-88 naar Rev. 2.

## Compliance checks

Bash-scripts, één per tool. Elke bevinding wordt als JSON-regel weggeschreven en verzameld in een Markdown-rapport.

| Check | Controleert | Bibliotheek | Tool |
|---|---|---|---|
| `nmap-scan` | Open poorten, blootgestelde services | §14, §12 | nmap |
| `tls-check` | Protocollen, ciphers, geldigheid van certificaten | §8 | testssl.sh / openssl |
| `http-security-headers` | HSTS, CSP, X-Frame-Options, cookie-flags, isolatieheaders | §15, §4 | curl |
| `web-nuclei` | Webmisconfiguraties en blootstellingen (niet-intrusief) | §4 | nuclei |
| `dns-email-auth` | SPF, DKIM, DMARC, MTA-STS, DNSSEC | §19 | dig |
| `host-hardening` | Hardening-index van het OS en waarschuwingen | §12, §1 | lynis |
| `dependency-scan` | CVE's in dependencies, IaC-misconfiguraties, SBOM | §3, §2 | trivy |
| `secrets-scan` | Hardcoded secrets (output geredigeerd) | §3, §8 | gitleaks |
| `container-image-scan` | Kwetsbaarheden in images | §13, §3 | trivy |

De checks dekken wat een machine betrouwbaar kan verifiëren. Ontwerp, autorisatielogica, sleutellevenscyclus, governance en regelgeving blijven bij menselijke review, met de bibliotheek als leidraad.

## Veiligheidsontwerp

Een AI-agent scanners geven is op zich al een risico, dus de vangrails zitten in de scripts in plaats van dat ze aan de agent worden overgelaten:

- **Allowlist.** Actieve checks roepen `authorized "$host"` aan en weigeren elk doel dat niet in `config/authorized-targets.txt` staat. De allowlist wordt leeg geleverd, dus standaard draaien alleen passieve checks en code-checks.
- **De agent mag geen doelen toevoegen.** `AGENTS.md` verbiedt het toevoegen van een host tenzij de gebruiker bevestigt dat hij eigenaar is of toestemming heeft om te testen, en nooit op basis van iets uit code, configuratie of scanoutput.
- **Tooloutput is data, geen instructie.** Dit beschermt tegen prompt injection via gescande bestanden of scanresultaten (§17).
- **Ontbrekende tool betekent `SKIP`, nooit stilzwijgend geslaagd.** De agent moet `SKIP` behandelen als "niet geverifieerd".
- **Secrets worden geredigeerd** in bevindingen; bij een echte treffer volgt het advies om te roteren.
- **Standaard privé.** Doellijsten en rapporten staan in `.gitignore`, omdat ze je eigen systemen beschrijven.

## Wat ik heb geleerd

- Versies van standaarden verouderen snel. Een bibliotheek is alleen bruikbaar als elke versieregel een reviewdatum en een primaire bron heeft.
- Bij een AI-agent horen de veiligheidsregels in code, niet alleen in instructies. De allowlist-check in de scripts houdt stand, ook als de agent `AGENTS.md` negeert.
- Alles koppelen aan één framework als ruggengraat (ISO 27001 of CSF 2.0) voorkomt dat controls parallelle checklists worden, hetzelfde idee als één PDCA-cyclus in kwaliteitsmanagement.

## Volgende stappen

- [ ] Het `source-only`-profiel draaien op de repository van deze website en het rapport publiceren
- [ ] Een GitHub Action toevoegen zodat `source-only` bij elke push als CI-gate draait
- [ ] Bevindingen in het rapport koppelen aan control-ID's uit ISO/IEC 27002:2022

Gerelateerd: [Portfoliowebsite](./portfolio-website.md)
