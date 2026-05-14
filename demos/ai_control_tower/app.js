const approvalQueue = [
    {
        id: "task-1",
        type: "Email Draft",
        agent: "LeadGen Agent",
        context: "New Lead: Global Logistics Ltd",
        content: "Hi Sarah,\n\nI noticed Global Logistics is expanding its operations in Antwerp. Our cloud architecture audit could help ensure your scaling is cost-effective and secure. Would you be open to a brief discovery call next Tuesday?\n\nBest,\nTechGroei Team",
        confidence: 94,
        time: "12m ago",
        icon: "✉️"
    },
    {
        id: "task-2",
        type: "Policy Summary",
        agent: "DocInsight Agent",
        context: "Internal: Data Privacy Policy 2024",
        content: "Summary of changes:\n1. Added specific clauses for LLM data residency.\n2. Updated PII anonymization requirements for dev environments.\n3. Mandatory 30-day log retention for all AI agent prompts.",
        confidence: 88,
        time: "45m ago",
        icon: "📄"
    },
    {
        id: "task-3",
        type: "Cost Warning",
        agent: "CloudBudget Agent",
        context: "Azure Spend Optimization",
        content: "Alert: Dev Environment 'Project-Omega' is currently spending €45/day higher than the baseline. Recommendation:\n- Suspend 4x unused NV-series instances.\n- Consolidate S3 buckets to Glacier for archive data.",
        confidence: 91,
        time: "1h ago",
        icon: "💰"
    }
];

const activities = [
    { text: "DocInsight Agent successfully parsed 'Contract_V12.pdf'", time: "2m ago", status: "success" },
    { text: "LeadGen Agent detected 5 new prospects on LinkedIn", time: "5m ago", status: "success" },
    { text: "Billing Agent regenerating monthly report...", time: "7m ago", status: "processing" },
    { text: "ArchReviewer flagged 1 high-risk security port", time: "15m ago", status: "success" },
    { text: "System Health: P95 latency reduced by 120ms", time: "30m ago", status: "success" }
];

document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('approval-list');
    const feed = document.getElementById('activity-feed');
    const sidebar = document.getElementById('review-sidebar');
    const reviewBody = document.getElementById('review-body');
    const closeBtn = document.getElementById('close-review');
    const queueCount = document.getElementById('queue-count');

    let activeTaskId = null;

    function renderQueue() {
        list.innerHTML = approvalQueue.map(task => `
            <div class="approval-card" onclick="openReview('${task.id}')">
                <div class="icon-box">${task.icon}</div>
                <div class="card-meta">
                    <h4>${task.type}</h4>
                    <p>${task.context}</p>
                </div>
                <div class="card-status">
                    <span class="confidence-badge">${task.confidence}% Match</span>
                    <span class="card-time">${task.time}</span>
                </div>
            </div>
        `).join('');
        queueCount.textContent = approvalQueue.length;
    }

    function renderFeed() {
        feed.innerHTML = activities.map(item => `
            <div class="feed-item ${item.status}">
                <div class="item-content">
                    <p>${item.text}</p>
                    <span class="item-time">${item.time}</span>
                </div>
            </div>
        `).join('');
    }

    window.openReview = (id) => {
        activeTaskId = id;
        const task = approvalQueue.find(t => t.id === id);
        if (!task) return;

        reviewBody.innerHTML = `
            <div class="review-item">
                <span class="review-label">Agent Origin</span>
                <p><strong>${task.agent}</strong></p>
            </div>
            <div class="review-item">
                <span class="review-label">Context</span>
                <p>${task.context}</p>
            </div>
            <div class="review-item">
                <span class="review-label">AI Generated Output</span>
                <div class="review-text-panel">${task.content}</div>
            </div>
            <div class="review-item">
                <span class="review-label">AI Confidence Score</span>
                <div style="display:flex; justify-content:space-between; margin-bottom:4px">
                    <span>Probability of Accuracy</span>
                    <span class="text-success">${task.confidence}%</span>
                </div>
                <div class="confidence-meter">
                    <div class="confidence-fill" style="width: ${task.confidence}%"></div>
                </div>
            </div>
        `;

        sidebar.classList.add('active');
    };

    closeBtn.addEventListener('click', () => sidebar.classList.remove('active'));

    document.getElementById('approve-btn').addEventListener('click', () => {
        if (!activeTaskId) return;
        completeTask("Approved");
    });

    document.getElementById('reject-btn').addEventListener('click', () => {
        if (!activeTaskId) return;
        completeTask("Rejected");
    });

    function completeTask(status) {
        const index = approvalQueue.findIndex(t => t.id === activeTaskId);
        if (index > -1) {
            const task = approvalQueue[index];
            activities.unshift({
                text: `${status}: ${task.type} for ${task.agent} completed by Admin`,
                time: "Just now",
                status: status === "Approved" ? "success" : "processing"
            });
            approvalQueue.splice(index, 1);
            renderQueue();
            renderFeed();
            sidebar.classList.remove('active');
            activeTaskId = null;
        }
    }

    // Initial Render
    renderQueue();
    renderFeed();

    // Semi-random activity generator simulation
    setInterval(() => {
        const randomItems = [
            "Agent: ArchReviewer updated security logs",
            "Billing Agent synced with QuickBooks Online",
            "LeadGen Agent scanning regional industry news...",
            "System Health Check: OK",
            "DocInsight Agent processing batch 4410"
        ];
        const text = randomItems[Math.floor(Math.random() * randomItems.length)];
        activities.unshift({ text, time: "Just now", status: "success" });
        if (activities.length > 20) activities.pop();
        renderFeed();
    }, 15000);
});
