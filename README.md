# Provia.

> **Resumes list skills. Provia asks you to prove them.**

Provia is a sovereign, proof-based skill verification platform. Built to help engineers turn "claims" into "proof," users submit real work that is vetted by a systematic verification engine. Instead of bullet points, you get a verifiable, API-driven technical archive.

🔗 **[Live Demo](https://provia-app.vercel.app)**

---

## The Verification Engine

Unlike a standard portfolio, Provia implements a live logic-based system to validate skills and prevent credential inflation:

* **Live Repository Validation:** Pings the public GitHub API during the audit process to ensure the submitted repository actually exists and is accessible.
* **Automated Tech-Stack Tagging:** Hooks into GitHub's language endpoints to dynamically calculate byte-weights and auto-generate tech stack pills for verified projects.
* **Documentation Integrity:** Mandates architectural descriptions to verify the developer understands the codebase, preventing blind copy-pasting.
* **Status Indicators:** Projects remain in "Pending Audit" until they successfully pass the multi-step verification pipeline.

---

## Core Features

* **Headless JSON API:** Every user gets a dedicated endpoint (`/api/v1/archive/username`) to fetch their verified portfolio data for use in companion mobile apps or external sites.
* **Dual UI Theme Engine:** Users can toggle between "Cyber Mode" (featuring a custom 3D Three.js particle engine) and a clean "Minimalist Mode".
* **Deep Link Media Player:** Native integration for YouTube demo videos and architecture diagrams directly within the project timeline.
* **Unified Auth System:** Secure login flow supporting both native GitHub OAuth (auto-fetching avatars/handles) and traditional Email/Password, backed by Firebase.
* **One-Click Resume Sync:** Upload and attach your PDF resume directly to your public archive.

---

## Tech Stack

* **Frontend:** React (Vite), CSS Custom Properties (UI Theme Engine)
* **3D Rendering:** Three.js
* **Backend & Auth:** Firebase Authentication, Firebase Realtime Database
* **External APIs:** GitHub REST API
* **Icons:** Lucide React
* **Deployment:** Vercel CI/CD

---

## Roadmap

- [x] Integrate Firebase for persistent data storage and secure OAuth.
- [x] Real-time GitHub API integration for live repo scanning and auto-tagging.
- [ ] Develop a Flutter-based companion mobile app consuming the Provia Headless API.
- [ ] Implement an LLM-powered deep codebase analyzer for advanced project summaries.
- [ ] Add a peer-review community layer for manual code audits.

---
*Built with logic, scale, and truth.*

