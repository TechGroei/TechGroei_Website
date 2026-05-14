document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('assessment-form');
    const placeholder = document.getElementById('report-placeholder');
    const content = document.getElementById('report-content');
    const bodyContent = document.getElementById('report-body-content');
    const scoreCircle = document.getElementById('score-circle');
    const scoreText = document.getElementById('score-text');
    const downloadBtn = document.getElementById('download-btn');
    const scoreContainer = document.querySelector('.score-ring');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Start generating effect
        const btn = form.querySelector('.btn-primary');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="loader"></span> Identifying Risks...';
        btn.classList.add('generating');
        
        // Simulate "LLM Processing" delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const formData = new FormData(form);
        const useCase = formData.get('use-case');
        const dataSources = formData.getAll('data-source');
        const govRisks = formData.getAll('gov-risk');
        const hosting = formData.get('hosting');
        const failureImpact = formData.get('failure-impact');

        const assessment = generateAssessment(useCase, dataSources, govRisks, hosting, failureImpact);
        
        renderReport(assessment);
        
        // Reset button
        btn.innerHTML = originalText;
        btn.classList.remove('generating');
        
        // Switch view
        placeholder.style.display = 'none';
        content.style.display = 'flex';
        
        // Animate score
        animateScore(assessment.score);
    });

    function generateAssessment(useCase, dataSources, govRisks, hosting, failureImpact) {
        let score = 85; // Base score
        let risks = [];
        let wins = [];
        
        // Data readiness logic
        if (dataSources.length === 0) {
            score -= 20;
            risks.push("Undefined Data Sources: No clear data path identified for the AI model.");
        } else if (dataSources.includes('Local files (PDF/Word/Images)')) {
            score -= 10;
            risks.push("Unstructured Data Complexity: Processing local files requires robust OCR/Parsing logic.");
        }
        
        // Governance logic
        if (govRisks.includes('PII')) {
            score -= 15;
            risks.push("Privacy Risk: Personal data handling requires strict anonymization layers.");
        }
        if (govRisks.includes('HighRiskAI')) {
            score -= 20;
            risks.push("EU AI Act Compliance: This use-case likely qualifies as 'High Risk', requiring technical documentation and human oversight.");
        }
        if (govRisks.includes('NoReview')) {
            score -= 15;
            risks.push("Automation Risk: Lack of human-in-the-loop increases the chance of uncorrected hallucinations.");
        }

        // Hosting & Impact
        if (hosting === 'cloud-api' && govRisks.includes('PII')) {
            risks.push("Data Residency: Using public cloud APIs with PII may violate local data protection policies.");
        }

        if (failureImpact === 'high') {
            score -= 10;
            risks.push("Criticality Factor: High impact of failure requires extensive unit testing and fail-safe mechanisms.");
        }

        score = Math.max(0, Math.min(100, score));

        // Quick wins based on input
        if (dataSources.includes('Spreadsheets (Excel/CSV)')) {
            wins.push("Structured Pilot: Start with a CSV-based prototype to validate prompt logic before moving to complex docs.");
        }
        wins.push("Human-in-the-loop: Implement a 'Draft Review' interface for staff to verify AI outputs.");
        wins.push("Cost Monitoring: Set up API quota alerts to prevent unexpected overages.");

        return {
            score,
            useCase,
            risks,
            wins,
            hosting,
            timestamp: new Date().toLocaleDateString(),
            roadmap: [
                "Week 1: Data Audit & PII Discovery",
                "Week 2: Prototype Prompt Engineering (Sandbox)",
                "Week 3: Integration Architecture Review",
                "Week 4: User Acceptance Testing (UAT)"
            ]
        };
    }

    function renderReport(data) {
        let riskClass = data.score > 70 ? 'bg-success' : (data.score > 40 ? 'bg-warning' : 'bg-danger');
        let statusText = data.score > 70 ? 'Ready' : (data.score > 40 ? 'Caution' : 'High Risk');

        bodyContent.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <p><strong>Status:</strong> <span class="badge-inline ${riskClass}">${statusText}</span></p>
                <p><strong>Date:</strong> ${data.timestamp}</p>
            </div>
            
            <h3>Executive Summary</h3>
            <p>The proposed use case "<em>${data.useCase.substring(0, 50)}...</em>" shows ${statusText.toLowerCase()} readiness levels. Key focus areas should be data engineering and governance controls.</p>

            <h3>Data & Architecture</h3>
            <p>Hosting Strategy: <strong>${data.hosting.replace('-', ' ').toUpperCase()}</strong></p>
            <ul>
                ${data.risks.map(r => `<li>${r}</li>`).join('')}
            </ul>

            <h3>Quick Wins</h3>
            <ul>
                ${data.wins.map(w => `<li>${w}</li>`).join('')}
            </ul>

            <h3>30-Day Roadmap</h3>
            <ol>
                ${data.roadmap.map(step => `<li>${step}</li>`).join('')}
            </ol>

            <p style="font-size: 0.8rem; margin-top: 2rem; opacity: 0.7;"><em>Disclaimer: This report is a technical architectural review and not legal advice regarding the EU AI Act or other regulations.</em></p>
        `;

        // Update score color
        scoreContainer.className = 'score-ring ' + (data.score > 70 ? 'score-good' : (data.score > 40 ? 'score-med' : 'score-bad'));
    }

    function animateScore(targetScore) {
        let currentScore = 0;
        const duration = 1000;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            currentScore = Math.floor(progress * targetScore);
            
            scoreText.textContent = `${currentScore}%`;
            scoreCircle.setAttribute('stroke-dasharray', `${currentScore}, 100`);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    downloadBtn.addEventListener('click', () => {
        const text = bodyContent.innerText;
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'AI_Readiness_Report.md';
        a.click();
        URL.revokeObjectURL(url);
    });
});
