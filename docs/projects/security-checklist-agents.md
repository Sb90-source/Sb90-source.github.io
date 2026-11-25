---
title: Security best-practices toolkit for AI agents
sidebar_label: AI security toolkit
sidebar_position: 2
description: A standards-referenced security library plus compliance checks that AI coding agents use to secure the project they work in.
---

# Security best-practices toolkit for AI agents

**Status:** working, v1 · **Repository:** private (available on request)

A download-and-go toolkit that an AI coding agent (Claude Code, Cursor, Copilot) drops into a project to secure it to current best practice. It has two halves: a reference library that maps 23 security domains to authoritative standards, and a set of compliance checks that verify the machine-checkable part automatically. Every finding cites the library section and the standard behind it.

## The problem

AI coding agents write a lot of code quickly, but they don't apply security standards consistently, and when they do they often cite outdated versions (OWASP Top 10 2021, ASVS 4.0.3). I wanted one source of truth the agent has to work from, with versions verified, plus checks that prove the result instead of trusting it.

## How it works

The repository follows the `AGENTS.md` convention, so any agent picks up the instructions automatically. The agent works through five steps:

1. **Detect the environment** from files in the repo: frontend, API backend, containers, IoT firmware, mobile, LLM features, identity, email/DNS, cloud.
2. **Map it to library sections.** §1–§3 (governance, secure SDLC, supply chain) and §21 (threat modelling) always apply; the rest depend on what was detected. An LLM feature pulls in §17, EU operation pulls in §22.
3. **Pick a compliance profile**: `web-app`, `api`, `network-host`, `cloud-container`, `iot-device`, `source-only` or `full`.
4. **Run the checks** in a Docker image that bundles every scanner, so nothing gets installed on the host.
5. **Fix and re-run.** Each `FAIL` or `WARN` points to a `§N`; the agent applies that section's key practices and runs the profile again until the finding clears.

## Reference library

23 domains, each with its sources (current edition verified on the review date) and the practices those sources actually require.

| § | Domain | Main references |
|---|---|---|
| 1 | Governance, frameworks, maturity | NIST CSF 2.0, ISO/IEC 27001:2022 and 27002:2022, CIS Controls v8.1, OWASP SAMM v2, BSIMM |
| 2 | Secure SDLC and DevSecOps | NIST SP 800-218 (SSDF), SP 800-218A, OWASP DevSecOps Guideline |
| 3 | Software supply chain | NIST SP 800-161r1, OWASP Top 10 CI/CD Risks, SBOM |
| 4 | Application security | OWASP Top 10:2025, ASVS 5.0.0, WSTG, Cheat Sheet Series |
| 5 | API security | OWASP API Security Top 10 (2023) |
| 6 | Authentication and identity | NIST SP 800-63-4 |
| 7 | Authorization and access control | NIST SP 800-162 (ABAC), SP 800-207 (Zero Trust) |
| 8 | Cryptography and key management | NIST SP 800-57, SP 800-52r2, FIPS 203/204/205 (post-quantum) |
| 9 | Data protection and privacy | GDPR, NIST Privacy Framework, ISO/IEC 27701 |
| 10 | Logging, monitoring, detection | OWASP Logging Cheat Sheet, NIST SP 800-92, MITRE ATT&CK |
| 11 | Incident response and resilience | NIST SP 800-61r3, SP 800-34r1, CISA #StopRansomware Guide |
| 12 | Cloud and infrastructure | CIS Benchmarks, CSA Cloud Controls Matrix, NIST SP 800-53 Rev. 5 |
| 13 | Containers and orchestration | NIST SP 800-190, CIS Docker/Kubernetes Benchmarks, NSA/CISA Kubernetes Hardening |
| 14 | Network security and Zero Trust | NIST SP 800-207, CISA Zero Trust Maturity Model v2.0, SP 800-41r1 |
| 15 | Browser and client-side | MDN (CSP, CORS, Trusted Types, COOP/COEP), W3C SRI |
| 16 | Mobile | OWASP MASVS 2.x, MASTG, Mobile Top 10 |
| 17 | AI / LLM / ML security | OWASP Top 10 for LLM Applications 2025, OWASP Top 10 for Agentic Applications, NIST AI RMF and AI 600-1, MITRE ATLAS, ISO/IEC 42001:2023 |
| 18 | IoT, embedded, hardware | ETSI EN 303 645, NIST SP 800-213, OWASP IoT Top 10, SP 800-193 |
| 19 | Protocol- and mechanism-specific guidance | WebSockets (RFC 6455), webhooks, DNS, email authentication, file upload, deserialization |
| 20 | Multi-tenancy and isolation | OWASP Multi-Tenant Application Security Cheat Sheet |
| 21 | Threat modelling and weakness taxonomies | STRIDE, PASTA, MITRE ATT&CK, CWE |
| 22 | EU and Netherlands regulation | NIS2 (Cyberbeveiligingswet), DORA, Cyber Resilience Act, EU AI Act, BIO |
| 23 | Master source index | All of the above, with links |

While building it I corrected outdated versions that commonly circulate, for example OWASP Top 10 to the 2025 edition, ASVS to 5.0.0, NIST SP 800-63 to Rev. 4 and SP 800-88 to Rev. 2.

## Compliance checks

Bash scripts, one per tool. Each finding is written as JSON lines and collected into a Markdown report.

| Check | Verifies | Library | Tool |
|---|---|---|---|
| `nmap-scan` | Open ports, exposed services | §14, §12 | nmap |
| `tls-check` | Protocols, ciphers, certificate validity | §8 | testssl.sh / openssl |
| `http-security-headers` | HSTS, CSP, X-Frame-Options, cookie flags, isolation headers | §15, §4 | curl |
| `web-nuclei` | Web misconfigurations and exposures (non-intrusive) | §4 | nuclei |
| `dns-email-auth` | SPF, DKIM, DMARC, MTA-STS, DNSSEC | §19 | dig |
| `host-hardening` | OS hardening index and warnings | §12, §1 | lynis |
| `dependency-scan` | Dependency CVEs, IaC misconfigurations, SBOM | §3, §2 | trivy |
| `secrets-scan` | Hardcoded secrets (output redacted) | §3, §8 | gitleaks |
| `container-image-scan` | Image vulnerabilities | §13, §3 | trivy |

The checks cover what can be verified reliably by a machine. Design, authorization logic, key lifecycle, governance and regulation stay with human review, guided by the library.

## Safety design

Giving an AI agent scanners is a risk in itself, so the guardrails are built into the scripts rather than left to the agent:

- **Allowlist gating.** Active checks call `authorized "$host"` and refuse any target that isn't in `config/authorized-targets.txt`. The allowlist ships empty, so out of the box only passive and code checks run.
- **The agent may not add targets.** `AGENTS.md` forbids adding a host unless the user confirms they own it or are authorised to test it, and never from something found in code, config or scan output.
- **Tool output is data, not instructions.** This is a defence against prompt injection through scanned files or scan results (§17).
- **Missing tool means `SKIP`, never a silent pass.** The agent has to treat `SKIP` as "not verified".
- **Secrets are redacted** in findings; real hits trigger advice to rotate.
- **Private by default.** Target lists and reports are git-ignored, because they describe your own systems.

## What I learned

- Standards versions go stale quickly. A library is only useful if every version line has a review date and a primary source.
- With an AI agent, the safety rules belong in code, not only in instructions. The allowlist check in the scripts holds even if the agent ignores `AGENTS.md`.
- Mapping everything to one framework spine (ISO 27001 or CSF 2.0) keeps controls from turning into parallel checklists, the same idea as one PDCA cycle in quality management.

## Next steps

- [ ] Run the `source-only` profile against this website's own repository and publish the report
- [ ] Add a GitHub Action so `source-only` runs as a CI gate on every push
- [ ] Map findings to ISO/IEC 27002:2022 control IDs in the report

Related: [Portfolio website](./portfolio-website.md)
