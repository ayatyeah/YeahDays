# Cloud Computing endterm

Standalone `/events/cloud-computing-endterm` workspace. Its multi-answer source bank does not enter the older single-answer StudyEvent engine. It is registered in the event list and static route params; the route dynamically loads this workspace independently of EventScreen. Progress is account-scoped browser storage, not server-synced event readiness.

## Sources and transcription

User-supplied directory: `клауд код ивент эндка/`.
- `photo_2026-11-12_21-25-34.jpg`, `...46.jpg`, `...51.jpg`: the same first sheet, questions 1–25, with two **different** questions numbered 14.
- `photo_2026-11-12_21-25-08.jpg`, `...49.jpg`: the same second sheet, questions 26–47. Question 46 repeats 44 verbatim and is represented once.
- 48 printed questions minus one repeated CloudShell question = **47 unique questions**.
- English wording, option order, misspellings (including “Amazone”), and original option-label case are retained. Printed line wrapping is joined, blank answer lines are represented by underscores. IDs 14a/14b disambiguate the printed numbering.
- The photographs contain no verified official answer key. Answers and Russian explanations are editorial, checked against lecture material and official documentation. Questions 18, 22 and 47 are deliberately ungraded because their wording/options do not establish one reliable answer. Do not invent an official key or assert these questions will be on a future examination.
- The images are reviewed locally; original photo files are not published. `source-manifest.json` records SHA-256 hashes for the exact input files.

## Lessons

22 parts cover supplied Lecture5 (cloud adoption, cases, emerging technology), Lecture6 (DBaaS and databases), Lecture8 (security and careers), Lecture10 (economics, billing, reliability and compliance), plus six explicitly supplementary AWS Developing parts. Lecture8 image-only slides were rendered and inspected, not inferred from missing extracted text. Examples and English recall sentences are teaching additions, not verbatim lecturer statements.

The PDF is the syllabus, not a question bank. It identifies Cloud Developing modules 1–6 for the second attestation. The supplied AWS Academy modules URL redirected to login; no claim is made to have read the private course. Modern caveats distinguish historical lecture numbers and simplified claims from current technical behavior.

Official verification references:
- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.API.html
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html
- https://docs.aws.amazon.com/general/latest/gr/s3.html
- https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-metrics.html
- https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-mock-integration.html
- https://aws.amazon.com/cloudshell/faqs/
- https://docs.docker.com/reference/cli/docker/container/run/
- https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/overview-cost-management
- https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending

## Validation

Content tests verify source counts, duplicate handling, multi-answer grading, exclusion of ambiguous questions, lesson coverage, and corrupted-storage recovery. Browser validation uses a separate local development database, including single/multiple selection, explanation gating, mistake filtering, persistence and mobile layout.
