# Automated Architectural Reviewer App

This is the first working product version of the TechGroei Automated Architectural Reviewer.

It is a static browser app. It does not need a backend, database, paid AI API, or server.

## What It Does

The app reviews a submitted architecture description and optional artifact/resource list, then generates:

- Architecture interpretation
- Red/yellow/green risk summary
- Red flags
- Warnings
- Visible strengths
- Security, data, resilience, cost, delivery, and AI-readiness findings
- Operational questions
- Recommended target direction
- 30-day improvement roadmap
- Markdown report download
- Print/save-as-PDF option

## Files

- `index.html`: app page
- `styles.css`: app styling
- `app.js`: local review engine and report generation
- `assets/techgroei_logo.svg`: logo used in the app

## How To Use Locally

Open `index.html` in your browser.

Then:

1. Click `Load sample`, or paste your own architecture description.
2. Optionally upload a `.txt`, `.md`, `.xml`, `.drawio`, `.json`, `.csv`, or `.tf` file.
3. Select cloud provider, workload type, and environment.
4. Tick relevant architecture characteristics.
5. Click `Generate review`.
6. Copy or download the Markdown report.

## How To Publish

For GitHub Pages, upload the app folder contents to a repository or subfolder.

If publishing under the main TechGroei website, use a path such as:

`/tools/architectural-reviewer/`

Files required:

- `index.html`
- `styles.css`
- `app.js`
- `assets/techgroei_logo.svg`

## Product Positioning

Use this wording:

"The Automated Architectural Reviewer is a fast first-pass architecture review tool. It helps teams identify red flags, missing questions, and improvement priorities before committing to a cloud, data, or AI implementation."

## Important Disclaimer

This first version is rule-based and runs locally in the browser. It is not a replacement for a full senior architecture review, security assessment, legal review, or compliance audit.

Use it as:

- A portfolio demo
- A sales conversation starter
- A first-pass architecture checklist
- An accelerator for TechGroei architecture audits

Do not present it as a fully automated final decision system.
