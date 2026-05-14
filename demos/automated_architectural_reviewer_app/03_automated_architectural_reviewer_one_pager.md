# Automated Architectural Reviewer

## Short Pitch

The Automated Architectural Reviewer helps teams get a fast second opinion on cloud, data, and AI architectures by reviewing diagrams, descriptions, or exported architecture files and producing a practical risk report.

## Client Problem

Teams often make expensive architecture decisions without enough review.

Common issues:
- Diagrams are outdated or incomplete
- Security risks are not visible
- Data flow is unclear
- Cost drivers are hidden
- Operational ownership is not documented
- AI features are added before the data and integration design is ready

## Target Clients

- Startups preparing for scale
- SMEs modernizing cloud systems
- Engineering teams planning new architecture
- Consultancies needing fast architecture review support
- Teams building AI/data workflows on Azure or AWS

## Proposed Output

The reviewer produces:

- Architecture summary
- Red flags
- Missing components
- Security and data risks
- Scalability concerns
- Cost concerns
- Operational questions
- Recommended next steps
- 30-day improvement roadmap

## Demo Scenario

A fictional SaaS company has:
- Web application
- API layer
- Database
- Blob/object storage
- Batch jobs
- Planned AI document-processing workflow

The tool reviews a text description or diagram export and generates a red-flag report.

## Minimum Prototype

Input:
- Architecture description in Markdown
- Optional Draw.io XML export
- Optional cloud resource list

Processing:
- Structured checklist
- Rule-based architecture checks
- LLM-assisted explanation and prioritization

Output:
- Markdown report
- Red/yellow/green risk summary
- 30-day roadmap

## Stronger Prototype

Small web UI with:
- Upload architecture description or Draw.io XML
- Select cloud provider
- Select workload type
- Generate report
- Download PDF/Markdown

## Example Report Sections

1. Executive summary
2. Architecture interpretation
3. Red flags
4. Security risks
5. Data and integration risks
6. Cost and scalability concerns
7. AI-readiness notes
8. Recommended target architecture
9. 30-day improvement plan

## Sales Angle

"Before committing to a cloud, data, or AI implementation, TechGroei can provide a focused architecture review that identifies risks, missing pieces, and practical next steps."

## Website Portfolio Text

Automated Architectural Reviewer: a sample workflow that reviews cloud, data, and AI architecture descriptions and produces red flags, improvement recommendations, and a 30-day roadmap.

## LinkedIn Post Draft

Architecture diagrams often show what a team wants the system to be.

They do not always show:
- unclear ownership
- weak security boundaries
- hidden cost drivers
- missing monitoring
- fragile data flows
- AI features built on poor data foundations

That is why I am building a sample Automated Architectural Reviewer for TechGroei.

The idea is simple: upload or describe an architecture, then get a practical review with red flags, questions, and next steps.

Not a replacement for senior judgement. A faster way to start the right technical conversation.

## First Build Recommendation

This should be the first demo to build.

Reason:
- It directly supports TechGroei's architecture audit service
- It is easy to explain to technical and non-technical buyers
- It avoids confidential client details by using fictional architecture scenarios
- It can become a strong portfolio item quickly
