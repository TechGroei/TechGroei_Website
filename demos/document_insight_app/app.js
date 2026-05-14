const demoData = {
    contract: {
        title: "Service Level Agreement (SLA) - TechCorp",
        summary: "Master service agreement covering cloud infrastructure maintenance and support for the fiscal year 2024. Includes specific uptime guarantees and liability caps.",
        entities: [
            { label: "Parties", value: "TechCorp vs. CloudScale Systems" },
            { label: "Agreement Date", value: "Jan 12, 2024" },
            { label: "Contract Value", value: "€145,000 / Annual" },
            { label: "Payment Terms", value: "Net 45" },
            { label: "Jurisdiction", value: "Brussels, Belgium" },
            { label: "Auto-Renewal", value: "Yes (90 days notice)" }
        ],
        risks: [
            { title: "Price Escalation Clause", desc: "Vendor can increase prices by up to 15% annually without renegotiation (Section 8.2).", level: "high" },
            { title: "Limited Indemnity", desc: "Liability for data loss is capped at 3 months of service fees, which may not cover GDPR fines (Section 12.4).", level: "high" },
            { title: "Vague Termination", desc: "Convenience termination requires 180 days notice, significantly longer than industry standard.", level: "low" }
        ],
        actions: [
            "Request price escalation cap at 5% or CPI link.",
            "Verify insurance coverage for the data loss liability gap.",
            "Schedule contract review for 100 days before renewal date (Oct 2024)."
        ]
    },
    cv: {
        title: "Candidate Profile: Senior Backend Engineer",
        summary: "Highly experienced backend developer specializing in Python, Go, and distributed systems. Demonstrated history of scaling microservices for Fintech and SaaS sectors.",
        entities: [
            { label: "Name", value: "Marc Peeters" },
            { label: "Experience", value: "12+ Years" },
            { label: "Core Stack", value: "Python, Go, Kubernetes, Kafka" },
            { label: "Location", value: "Antwerp, Belgium" },
            { label: "Education", value: "MSc Computer Science" },
            { label: "Notice Period", value: "3 Months" }
        ],
        risks: [
            { title: "Cloud Preference Gap", desc: "Candidate has 8 years of AWS experience but the job requires Azure expertise. Training will be required.", level: "low" },
            { title: "Management Experience", desc: "CV focus is purely individual contributor; matching for a 'Lead' role may require further vetting of soft skills.", level: "low" }
        ],
        actions: [
            "Ask specifically about Azure familiarity in the first technical screen.",
            "Schedule a pair programming session to evaluate architectural thinking.",
            "Confirm availability for a start date in early Q3."
        ]
    },
    invoice: {
        title: "Invoice #INV-2024-8892 - VendorX",
        summary: "Monthly billing for cloud compute, storage, and premium support services. Includes a one-time setup fee for a private VPC.",
        entities: [
            { label: "Invoice Number", value: "#INV-2024-8892" },
            { label: "Total Due", value: "€12,340.50" },
            { label: "Tax (VAT)", value: "€2,591.51 (21%)" },
            { label: "Due Date", value: "Feb 28, 2024" },
            { label: "PO Reference", value: "PO-TECH-0012" },
            { label: "Vendor", value: "VendorX Solutions" }
        ],
        risks: [
            { title: "Unrecognized Charge", desc: "Line item 'Professional Services - Advanced Security' (€2,500) was not in the original quote.", level: "high" },
            { title: "VAT Inconsistency", desc: "VAT percentage is applied to the gross total instead of subtotal; calculation error detected.", level: "high" }
        ],
        actions: [
            "Dispute the 'Advanced Security' line item with the account manager.",
            "Recalculate VAT before processing final payment.",
            "Match PO-TECH-0012 against the internal ERP to verify budget authorization."
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const chips = document.querySelectorAll('.chip');
    const statusPanel = document.getElementById('processing-status');
    const progressFill = document.getElementById('progress-fill');
    const statusText = document.getElementById('status-text');
    const placeholder = document.getElementById('insight-placeholder');
    const insightContent = document.getElementById('insight-content');
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const jsonOutput = document.getElementById('json-output');

    let currentData = null;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const type = chip.getAttribute('data-type');
            simulateProcessing(demoData[type]);
        });
    });

    function simulateProcessing(data) {
        currentData = data;
        placeholder.style.display = 'none';
        insightContent.style.display = 'none';
        statusPanel.style.display = 'block';
        progressFill.style.width = '0%';
        
        const steps = [
            { text: "Reading document structure...", p: 20 },
            { text: "Classifying document type...", p: 45 },
            { text: "Extracting key entities...", p: 70 },
            { text: "Analyzing risks and action items...", p: 95 },
            { text: "Finalizing insight report...", p: 100 }
        ];

        let stepIdx = 0;
        const interval = setInterval(() => {
            if (stepIdx < steps.length) {
                statusText.textContent = steps[stepIdx].text;
                progressFill.style.width = steps[stepIdx].p + '%';
                stepIdx++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    renderInsight(data);
                    statusPanel.style.display = 'none';
                    insightContent.style.display = 'flex';
                }, 500);
            }
        }, 800);
    }

    function renderInsight(data) {
        // Summary Tab
        document.getElementById('tab-summary').innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.summary}</p>
            <div style="margin-top: 2rem;">
                <h4 style="margin-bottom: 1rem;">Primary Action Items</h4>
                <ul style="padding-left: 1.2rem; color: var(--text-dim);">
                    ${data.actions.map(a => `<li style="margin-bottom: 0.5rem;">${a}</li>`).join('')}
                </ul>
            </div>
        `;

        // Entities Tab
        document.getElementById('tab-entities').innerHTML = `
            <h3>Key Entities</h3>
            <div class="entity-grid">
                ${data.entities.map(e => `
                    <div class="entity-card">
                        <div class="entity-label">${e.label}</div>
                        <div class="entity-value">${e.value}</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Risks Tab
        document.getElementById('tab-risks').innerHTML = `
            <h3>Risks & Exceptions</h3>
            <div class="risk-list">
                ${data.risks.map(r => `
                    <div class="risk-item ${r.level}">
                        <span class="risk-title">${r.title}</span>
                        <span class="risk-desc">${r.desc}</span>
                    </div>
                `).join('')}
            </div>
        `;

        // JSON Tab
        jsonOutput.textContent = JSON.stringify(data, null, 2);
    }

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const target = tab.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.style.display = content.id === `tab-${target}` ? 'block' : 'none';
            });
        });
    });

    // Download
    document.getElementById('download-btn').addEventListener('click', () => {
        if (!currentData) return;
        const markdown = `# Insight Report: ${currentData.title}\n\n## Summary\n${currentData.summary}\n\n## Entities\n${currentData.entities.map(e => `- **${e.label}**: ${e.value}`).join('\n')}\n\n## Risks\n${currentData.risks.map(r => `### ${r.title}\n${r.desc}`).join('\n\n')}\n\n## Actions\n${currentData.actions.map(a => `- ${a}`).join('\n')}`;
        
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentData.title.replace(/\s+/g, '_')}_Insight.md`;
        a.click();
    });
});
