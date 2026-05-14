const reviewForm = document.querySelector("#reviewForm");
const architectureText = document.querySelector("#architectureText");
const artifactText = document.querySelector("#artifactText");
const architectureFile = document.querySelector("#architectureFile");
const artifactFile = document.querySelector("#artifactFile");
const cloudProvider = document.querySelector("#cloudProvider");
const workloadType = document.querySelector("#workloadType");
const environment = document.querySelector("#environment");
const reportOutput = document.querySelector("#reportOutput");
const scoreLabel = document.querySelector("#scoreLabel");
const scoreBar = document.querySelector("#scoreBar");
const riskScore = document.querySelector("#riskScore");
const redCount = document.querySelector("#redCount");
const yellowCount = document.querySelector("#yellowCount");
const greenCount = document.querySelector("#greenCount");
const copyReport = document.querySelector("#copyReport");
const downloadReport = document.querySelector("#downloadReport");
const printReport = document.querySelector("#printReport");
const loadSample = document.querySelector("#loadSample");
const loadSampleTop = document.querySelector("#loadSampleTop");
const clearForm = document.querySelector("#clearForm");

let currentReportMarkdown = "";

const sampleArchitecture = `A B2B SaaS application has a React frontend used by external customers and internal operations staff.

The backend is a REST API running in containers. It stores customer records, uploaded PDFs, processing status, and generated summaries. PostgreSQL is used for transactional data. Blob storage is used for uploaded documents.

The team plans to add an AI document-processing workflow that extracts entities from uploaded PDFs, summarizes them, and suggests next actions to operations staff. Human review is planned before final action, but the approval process is not documented yet.

Current known components:
- React web app
- API backend
- PostgreSQL database
- Blob storage for documents
- Nightly batch jobs
- Admin users
- External customer users
- Basic CI/CD pipeline
- Basic logs

Known gaps:
- No clear network segmentation
- No documented backup restore test
- Monitoring is basic
- No cost alerts
- No data retention policy
- No AI evaluation process yet`;

const sampleArtifact = `resources:
- app-service: customer-portal-api
- container-registry: techgroei-demo-registry
- database: postgres-prod
- storage-account: customer-documents
- queue: document-processing-jobs
- function: nightly-document-batch
- identity: app-managed-identity
- monitoring: application-logs-basic

drawio-notes:
customer -> frontend -> api -> database
api -> blob storage
api -> queue -> batch job -> ai extraction service -> database`;

const rules = [
    {
        id: "identity",
        category: "Security",
        title: "Identity and access control",
        keywords: ["identity", "iam", "rbac", "oauth", "openid", "sso", "managed identity", "service principal", "least privilege", "mfa", "role"],
        missingSeverity: "red",
        presentMessage: "The description includes identity or access-control signals. Validate least privilege, separation of duties, and privileged access controls.",
        missingMessage: "No clear identity and access-control model was found. Document authentication, authorization, roles, service identities, and privileged access controls."
    },
    {
        id: "network",
        category: "Security",
        title: "Network boundaries",
        keywords: ["vnet", "subnet", "private endpoint", "firewall", "waf", "network", "segmentation", "vpn", "zero trust", "security group"],
        missingSeverity: "yellow",
        presentMessage: "Network boundary terms are present. Confirm which services are public, private, and protected by filtering controls.",
        missingMessage: "Network boundaries are unclear. Identify public entry points, private services, firewall/WAF controls, and segmentation between application, data, and processing layers."
    },
    {
        id: "encryption",
        category: "Security",
        title: "Encryption and secrets",
        keywords: ["encryption", "encrypted", "tls", "https", "key vault", "kms", "secret", "certificate", "cmk"],
        missingSeverity: "red",
        presentMessage: "Encryption or secret-management signals were found. Verify key ownership, rotation, and secret access policies.",
        missingMessage: "Encryption and secret management are not visible. Document TLS, data-at-rest encryption, key management, and where application secrets are stored."
    },
    {
        id: "monitoring",
        category: "Operations",
        title: "Monitoring and alerting",
        keywords: ["monitoring", "alert", "observability", "logs", "metrics", "tracing", "application insights", "cloudwatch", "prometheus", "grafana"],
        missingSeverity: "yellow",
        presentMessage: "Monitoring signals exist. Check whether logs, metrics, traces, and actionable alerts cover user-facing flows and background jobs.",
        missingMessage: "Monitoring and alerting are not clearly defined. Add logs, metrics, traces, alert thresholds, and ownership for incident response."
    },
    {
        id: "backup",
        category: "Resilience",
        title: "Backup and recovery",
        keywords: ["backup", "restore", "recovery", "dr", "disaster recovery", "rpo", "rto", "replication", "snapshot"],
        missingSeverity: "red",
        presentMessage: "Backup/recovery terms are present. Confirm restore testing, RPO/RTO, and ownership of recovery procedures.",
        missingMessage: "Backup and recovery are not visible. Define backup coverage, restore testing, RPO/RTO targets, and recovery ownership."
    },
    {
        id: "dataflow",
        category: "Data",
        title: "Data flow and ownership",
        keywords: ["data flow", "lineage", "owner", "ownership", "retention", "classification", "pii", "personal data", "sensitive", "gdpr"],
        missingSeverity: "yellow",
        presentMessage: "Data governance signals exist. Make sure ownership, retention, classification, and lineage are explicit.",
        missingMessage: "Data ownership and flow are not clear. Document data sources, owners, retention, classification, and movement between services."
    },
    {
        id: "integration",
        category: "Integration",
        title: "Integration and failure handling",
        keywords: ["queue", "event", "retry", "dead letter", "dlq", "webhook", "integration", "api gateway", "timeout", "idempotent"],
        missingSeverity: "yellow",
        presentMessage: "Integration/failure-handling signals are present. Validate retries, idempotency, dead-letter handling, and timeout behavior.",
        missingMessage: "Integration failure handling is not visible. Define retries, idempotency, timeout behavior, dead-letter queues, and reconciliation processes."
    },
    {
        id: "cicd",
        category: "Delivery",
        title: "CI/CD and environment control",
        keywords: ["ci/cd", "pipeline", "deployment", "terraform", "iac", "bicep", "cloudformation", "github actions", "devops"],
        missingSeverity: "yellow",
        presentMessage: "Delivery automation signals are present. Check environment promotion, approvals, rollback, and infrastructure-as-code coverage.",
        missingMessage: "Delivery and environment controls are unclear. Define CI/CD, infrastructure-as-code, approvals, rollback, and environment separation."
    },
    {
        id: "cost",
        category: "Cost",
        title: "Cost controls",
        keywords: ["cost", "budget", "finops", "autoscale", "auto scale", "reserved", "rightsizing", "alert", "quota"],
        missingSeverity: "yellow",
        presentMessage: "Cost-control signals were found. Confirm budgets, alerts, scaling rules, and ownership for cost review.",
        missingMessage: "Cost controls are not visible. Add budgets, alerts, autoscaling rules, capacity assumptions, and a monthly cost review owner."
    },
    {
        id: "ai",
        category: "AI readiness",
        title: "AI workflow controls",
        keywords: ["ai", "genai", "llm", "rag", "prompt", "model", "embedding", "vector", "evaluation", "human review", "approval"],
        missingSeverity: "yellow",
        presentMessage: "AI workflow terms are present. Confirm evaluation, human review, prompt/version control, data handling, and fallback behavior.",
        missingMessage: "No AI workflow controls are visible. If AI is planned, define evaluation, human review, prompt/version control, data handling, and fallback behavior."
    }
];

function includesAny(text, keywords) {
    const lowered = text.toLowerCase();
    return keywords.some((keyword) => lowered.includes(keyword));
}

function collectInputs() {
    return {
        provider: cloudProvider.value,
        workload: workloadType.value,
        env: environment.value,
        architecture: architectureText.value.trim(),
        artifact: artifactText.value.trim(),
        flags: {
            sensitiveData: document.querySelector("#hasSensitiveData").checked,
            externalUsers: document.querySelector("#hasExternalUsers").checked,
            aiWorkflow: document.querySelector("#hasAiWorkflow").checked,
            regulatedContext: document.querySelector("#hasRegulatedContext").checked,
            legacySystem: document.querySelector("#hasLegacySystem").checked,
            highAvailability: document.querySelector("#hasHighAvailabilityNeed").checked
        }
    };
}

function analyzeArchitecture(input) {
    const combined = `${input.architecture}\n${input.artifact}\n${input.provider}\n${input.workload}\n${input.env}`;
    const findings = [];

    rules.forEach((rule) => {
        const present = includesAny(combined, rule.keywords);
        if (present) {
            findings.push({
                severity: "green",
                category: rule.category,
                title: rule.title,
                message: rule.presentMessage
            });
            return;
        }

        findings.push({
            severity: rule.missingSeverity,
            category: rule.category,
            title: rule.title,
            message: rule.missingMessage
        });
    });

    addContextualFindings(input, combined, findings);

    const counts = summarizeFindings(findings);
    const score = calculateScore(counts, input);
    const interpretation = interpretArchitecture(input, combined);
    const roadmap = buildRoadmap(findings, input);
    const questions = buildOperationalQuestions(findings, input);
    const target = buildTargetRecommendations(findings, input);
    const rating = scoreToRating(score);

    return {
        input,
        findings,
        counts,
        score,
        rating,
        interpretation,
        roadmap,
        questions,
        target,
        generatedAt: new Date()
    };
}

function addContextualFindings(input, combined, findings) {
    const lower = combined.toLowerCase();
    const hasDatabase = includesAny(lower, ["database", "postgres", "postgresql", "mysql", "sql", "cosmos", "dynamodb", "rds"]);
    const hasStorage = includesAny(lower, ["blob", "bucket", "storage", "s3", "object storage", "file share"]);
    const hasBatch = includesAny(lower, ["batch", "cron", "scheduled", "nightly", "worker", "background job"]);
    const hasHumanReview = includesAny(lower, ["human review", "approval", "manual review", "human-in-the-loop", "hitl"]);
    const hasRetention = includesAny(lower, ["retention", "delete", "purge", "archive", "lifecycle"]);
    const hasExternalAccess = input.flags.externalUsers || includesAny(lower, ["external user", "customer", "public", "internet"]);

    if (hasDatabase && hasStorage) {
        findings.push({
            severity: "green",
            category: "Data",
            title: "Core data stores identified",
            message: "The architecture identifies both transactional and file/object storage. Review data ownership, retention, and consistency between these stores."
        });
    }

    if (hasBatch && !includesAny(lower, ["dead letter", "dlq", "retry", "idempotent"])) {
        findings.push({
            severity: "yellow",
            category: "Operations",
            title: "Background processing needs failure design",
            message: "Batch or background processing is present, but retry, idempotency, and exception handling are not clear."
        });
    }

    if ((input.flags.aiWorkflow || lower.includes("ai") || lower.includes("llm")) && !hasHumanReview) {
        findings.push({
            severity: "red",
            category: "AI readiness",
            title: "AI workflow lacks visible human review",
            message: "AI output appears in scope, but the human review or approval path is not clearly documented."
        });
    }

    if ((input.flags.sensitiveData || input.flags.regulatedContext || lower.includes("personal data")) && !hasRetention) {
        findings.push({
            severity: "red",
            category: "Data",
            title: "Sensitive data without visible retention policy",
            message: "Sensitive, personal, or regulated data is involved, but retention, deletion, and lifecycle rules are not visible."
        });
    }

    if (hasExternalAccess && !includesAny(lower, ["waf", "rate limit", "ddos", "firewall", "api gateway"])) {
        findings.push({
            severity: "yellow",
            category: "Security",
            title: "External access needs edge protection",
            message: "External users are in scope, but edge protection such as WAF, rate limiting, API gateway, or DDoS controls is not visible."
        });
    }

    if (input.flags.highAvailability && !includesAny(lower, ["multi-zone", "availability zone", "failover", "replica", "redundant", "load balancer"])) {
        findings.push({
            severity: "red",
            category: "Resilience",
            title: "High availability expectation lacks design evidence",
            message: "High availability is expected, but redundancy, failover, or availability-zone strategy is not visible."
        });
    }

    if (input.env === "Prototype / MVP") {
        findings.push({
            severity: "yellow",
            category: "Delivery",
            title: "Prototype-to-production transition risk",
            message: "The workload is currently prototype/MVP. Define which controls are required before production use."
        });
    }
}

function summarizeFindings(findings) {
    return findings.reduce((acc, finding) => {
        acc[finding.severity] += 1;
        return acc;
    }, { red: 0, yellow: 0, green: 0 });
}

function calculateScore(counts, input) {
    let score = 100 - (counts.red * 12) - (counts.yellow * 5) + Math.min(counts.green * 2, 12);

    if (input.flags.sensitiveData) score -= 4;
    if (input.flags.regulatedContext) score -= 4;
    if (input.flags.aiWorkflow) score -= 3;
    if (input.flags.highAvailability) score -= 3;

    return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreToRating(score) {
    if (score >= 80) return { label: "Low visible risk", color: "var(--success)" };
    if (score >= 55) return { label: "Moderate review needed", color: "var(--warning)" };
    return { label: "High-priority review needed", color: "var(--danger)" };
}

function interpretArchitecture(input, combined) {
    const componentSignals = [
        ["frontend", ["frontend", "react", "angular", "vue", "web app", "portal"]],
        ["API layer", ["api", "rest", "graphql", "backend"]],
        ["database", ["database", "postgres", "postgresql", "mysql", "sql", "cosmos", "dynamodb"]],
        ["object/file storage", ["blob", "bucket", "storage", "s3", "object storage"]],
        ["background processing", ["batch", "queue", "worker", "cron", "scheduled", "nightly"]],
        ["AI workflow", ["ai", "genai", "llm", "rag", "embedding", "model"]],
        ["CI/CD", ["ci/cd", "pipeline", "github actions", "devops", "deployment"]],
        ["monitoring", ["monitoring", "logs", "metrics", "tracing", "alert"]]
    ];

    const detected = componentSignals
        .filter(([, keywords]) => includesAny(combined, keywords))
        .map(([label]) => label);

    return {
        summary: `The reviewed workload appears to be a ${input.workload.toLowerCase()} on ${input.provider}, currently marked as "${input.env}".`,
        detected: detected.length ? detected : ["No specific components were confidently detected from the provided text."],
        note: "This interpretation is based only on the submitted text and optional artifact/resource list."
    };
}

function buildOperationalQuestions(findings, input) {
    const questions = [
        "Who owns the architecture decisions and operational runbook?",
        "What is the expected availability target and acceptable recovery time?",
        "Which data is sensitive, personal, regulated, or business-critical?",
        "Which alerts require immediate action and who receives them?",
        "What needs to be true before this architecture is production-ready?"
    ];

    if (findings.some((f) => f.category === "AI readiness" && f.severity !== "green") || input.flags.aiWorkflow) {
        questions.push("Who reviews AI output, and what happens when the model is uncertain or wrong?");
        questions.push("How are prompts, model versions, evaluation results, and AI decisions tracked?");
    }

    if (findings.some((f) => f.category === "Cost" && f.severity !== "green")) {
        questions.push("Who reviews cloud spend, and what budget or anomaly alerts are configured?");
    }

    return [...new Set(questions)];
}

function buildTargetRecommendations(findings, input) {
    const redCategories = new Set(findings.filter((f) => f.severity === "red").map((f) => f.category));
    const recommendations = [
        "Create a single current-state architecture diagram with users, services, data stores, integrations, and trust boundaries.",
        "Maintain a risk register that separates immediate blockers from later improvements.",
        "Define owners for architecture, security, data, operations, and cost review."
    ];

    if (redCategories.has("Security")) {
        recommendations.push("Prioritize identity, secrets, encryption, and external access controls before expanding functionality.");
    }

    if (redCategories.has("Data")) {
        recommendations.push("Document data classification, ownership, retention, deletion, and movement between services.");
    }

    if (redCategories.has("Resilience")) {
        recommendations.push("Define backup, restore testing, RPO/RTO, and failover assumptions.");
    }

    if (input.flags.aiWorkflow) {
        recommendations.push("Add an AI control layer: human review, evaluation set, prompt/version tracking, and fallback process.");
    }

    return recommendations;
}

function buildRoadmap(findings, input) {
    const red = findings.filter((f) => f.severity === "red").slice(0, 4);
    const yellow = findings.filter((f) => f.severity === "yellow").slice(0, 4);

    return {
        days1to7: [
            "Create or update the architecture diagram with data flows and trust boundaries.",
            ...red.slice(0, 2).map((f) => `Resolve or document: ${f.title}.`),
            "Assign owners for security, data, operations, and cost review."
        ],
        days8to20: [
            ...red.slice(2).map((f) => `Address high-priority gap: ${f.title}.`),
            ...yellow.slice(0, 2).map((f) => `Improve: ${f.title}.`),
            input.flags.aiWorkflow ? "Define AI human-review, evaluation, and fallback process." : "Review whether AI will be introduced later and what readiness controls would be needed."
        ],
        days21to30: [
            ...yellow.slice(2).map((f) => `Finalize improvement: ${f.title}.`),
            "Run a tabletop review of failure scenarios and recovery steps.",
            "Create a production-readiness checklist and decide next implementation sprint."
        ]
    };
}

function renderReport(result) {
    const redFindings = result.findings.filter((f) => f.severity === "red");
    const yellowFindings = result.findings.filter((f) => f.severity === "yellow");
    const greenFindings = result.findings.filter((f) => f.severity === "green");

    reportOutput.innerHTML = `
        <div class="report-document">
            <section>
                <h3>Executive summary</h3>
                <p>${escapeHtml(result.interpretation.summary)} The current visible risk rating is <strong>${escapeHtml(result.rating.label)}</strong> with a score of <strong>${result.score}/100</strong>.</p>
                <p>${escapeHtml(result.interpretation.note)}</p>
            </section>

            <section>
                <h3>Architecture interpretation</h3>
                <ul>
                    ${result.interpretation.detected.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
            </section>

            <section>
                <h3>Red flags</h3>
                ${renderFindingList(redFindings, "No high-priority red flags were found from the submitted text.")}
            </section>

            <section>
                <h3>Warnings</h3>
                ${renderFindingList(yellowFindings, "No medium-priority warnings were found from the submitted text.")}
            </section>

            <section>
                <h3>Visible strengths</h3>
                ${renderFindingList(greenFindings, "No clear strengths were detected yet. Add more architecture detail to improve the review.")}
            </section>

            <section>
                <h3>Recommended target direction</h3>
                <ul>
                    ${result.target.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
            </section>

            <section>
                <h3>Operational questions</h3>
                <ul>
                    ${result.questions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
            </section>

            <section>
                <h3>30-day improvement roadmap</h3>
                <div class="roadmap">
                    <article>
                        <h4>Days 1-7</h4>
                        <ul>${result.roadmap.days1to7.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
                    </article>
                    <article>
                        <h4>Days 8-20</h4>
                        <ul>${result.roadmap.days8to20.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
                    </article>
                    <article>
                        <h4>Days 21-30</h4>
                        <ul>${result.roadmap.days21to30.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
                    </article>
                </div>
            </section>
        </div>
    `;
}

function renderFindingList(findings, emptyMessage) {
    if (!findings.length) {
        return `<p class="empty-state">${escapeHtml(emptyMessage)}</p>`;
    }

    return `
        <ul class="finding-list">
            ${findings.map((finding) => `
                <li class="finding ${finding.severity}">
                    <strong>${escapeHtml(finding.title)} <span>(${escapeHtml(finding.category)})</span></strong>
                    <p>${escapeHtml(finding.message)}</p>
                </li>
            `).join("")}
        </ul>
    `;
}

function updateSummary(result) {
    scoreLabel.textContent = result.rating.label;
    scoreBar.style.width = `${result.score}%`;
    scoreBar.style.background = result.rating.color;
    riskScore.textContent = `${result.score}/100`;
    redCount.textContent = result.counts.red;
    yellowCount.textContent = result.counts.yellow;
    greenCount.textContent = result.counts.green;
    copyReport.disabled = false;
    downloadReport.disabled = false;
    printReport.disabled = false;
}

function buildMarkdown(result) {
    const findingMarkdown = (severity) => {
        const subset = result.findings.filter((f) => f.severity === severity);
        if (!subset.length) return "- None detected from submitted text.";
        return subset.map((f) => `- **${f.title} (${f.category})**: ${f.message}`).join("\n");
    };

    const list = (items) => items.map((item) => `- ${item}`).join("\n");

    return `# Automated Architectural Review

Generated: ${result.generatedAt.toLocaleString()}

## Executive Summary

${result.interpretation.summary}

Visible risk rating: **${result.rating.label}**

Risk score: **${result.score}/100**

Red flags: ${result.counts.red}
Warnings: ${result.counts.yellow}
Visible strengths: ${result.counts.green}

## Input Context

- Cloud provider: ${result.input.provider}
- Workload type: ${result.input.workload}
- Environment: ${result.input.env}

## Architecture Interpretation

${list(result.interpretation.detected)}

${result.interpretation.note}

## Red Flags

${findingMarkdown("red")}

## Warnings

${findingMarkdown("yellow")}

## Visible Strengths

${findingMarkdown("green")}

## Recommended Target Direction

${list(result.target)}

## Operational Questions

${list(result.questions)}

## 30-Day Improvement Roadmap

### Days 1-7

${list(result.roadmap.days1to7)}

### Days 8-20

${list(result.roadmap.days8to20)}

### Days 21-30

${list(result.roadmap.days21to30)}

## Disclaimer

This is a structured first-pass review based only on submitted text. It is not a replacement for a full senior architecture review, security assessment, legal review, or compliance audit.
`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function setSample() {
    architectureText.value = sampleArchitecture;
    artifactText.value = sampleArtifact;
    cloudProvider.value = "Azure";
    workloadType.value = "AI / GenAI workflow";
    environment.value = "Production planned";
    document.querySelector("#hasSensitiveData").checked = true;
    document.querySelector("#hasExternalUsers").checked = true;
    document.querySelector("#hasAiWorkflow").checked = true;
    document.querySelector("#hasRegulatedContext").checked = true;
    document.querySelector("#hasLegacySystem").checked = false;
    document.querySelector("#hasHighAvailabilityNeed").checked = true;
}

function resetReview() {
    reviewForm.reset();
    reportOutput.innerHTML = `<p class="empty-state">Generate a review to see the architecture report here.</p>`;
    scoreLabel.textContent = "No review yet";
    scoreBar.style.width = "0%";
    riskScore.textContent = "-";
    redCount.textContent = "-";
    yellowCount.textContent = "-";
    greenCount.textContent = "-";
    currentReportMarkdown = "";
    copyReport.disabled = true;
    downloadReport.disabled = true;
    printReport.disabled = true;
}

function readFileInto(fileInput, targetTextarea) {
    const [file] = fileInput.files;
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        targetTextarea.value = String(reader.result || "");
    });
    reader.readAsText(file);
}

reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = collectInputs();

    if (!input.architecture && !input.artifact) {
        architectureText.focus();
        reportOutput.innerHTML = `<p class="empty-state">Add an architecture description or artifact before generating a review.</p>`;
        return;
    }

    const result = analyzeArchitecture(input);
    renderReport(result);
    updateSummary(result);
    currentReportMarkdown = buildMarkdown(result);
    document.querySelector("#report").scrollIntoView({ behavior: "smooth", block: "start" });
});

architectureFile.addEventListener("change", () => readFileInto(architectureFile, architectureText));
artifactFile.addEventListener("change", () => readFileInto(artifactFile, artifactText));

[loadSample, loadSampleTop].forEach((button) => {
    button.addEventListener("click", () => {
        setSample();
        document.querySelector("#reviewer").scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

clearForm.addEventListener("click", resetReview);

copyReport.addEventListener("click", async () => {
    if (!currentReportMarkdown) return;
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentReportMarkdown);
    } else {
        const copyBuffer = document.createElement("textarea");
        copyBuffer.value = currentReportMarkdown;
        copyBuffer.style.position = "fixed";
        copyBuffer.style.left = "-9999px";
        document.body.appendChild(copyBuffer);
        copyBuffer.focus();
        copyBuffer.select();
        document.execCommand("copy");
        copyBuffer.remove();
    }
    copyReport.textContent = "Copied";
    setTimeout(() => {
        copyReport.textContent = "Copy report";
    }, 1500);
});

downloadReport.addEventListener("click", () => {
    if (!currentReportMarkdown) return;
    const blob = new Blob([currentReportMarkdown], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = URL.createObjectURL(blob);
    link.download = `techgroei-architecture-review-${date}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
});

printReport.addEventListener("click", () => {
    window.print();
});
