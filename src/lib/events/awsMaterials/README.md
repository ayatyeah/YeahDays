# AWS Academy module materials

Collected on 2026-11-19 from the authenticated module pages for courses 188512 (Cloud Foundations) and 193042 (Cloud Developing).

- `catalog.json` preserves module/item titles and canonical Canvas links: 10 Foundations modules and 14 Developing modules. The Developing supplementary links come from the course's Content Resources page. One malformed non-HTTPS Actions/Resources/Condition Keys link was omitted rather than silently replaced.
- `summaries.ts` contains brief Russian learning summaries informed by each module's Student Guide overview/objectives and introductory/closing pages. Examples and self-check questions are authored. These are not full translations of every slide, nor video transcripts.
- The original guides remain in AWS Academy and require the learner's access. No signed launch URLs, account identifiers, or original guide text are published in this directory.
- Local reading extracts are in `.out/aws-course-materials/*-pages.json` (not committed). On 2026-11-19 all 24 Student Guides were read through (1,574 pages) for the separate authored practice bank and private study archive. The earlier short summaries were based on selective reading. The 220-question bank is unchanged.

## Expanded module learning

`deepDive.ts` adds original worked examples, changed-condition exercises, and common mistakes for all 24 modules. Conceptual walkthroughs and terms reuse the existing Russian topic notes; this is authored teaching content, not a verbatim translation. Module quizzes use the unchanged 220-question bank. Developing modules 1 and 14 have no original checks: their explicitly labelled practice pools use modules 2/4 and all Developing modules respectively.

Technical clarifications cross-checked against AWS documentation on 2026-11-19:
- S3 website endpoints: https://docs.aws.amazon.com/us_en/AmazonS3/latest/userguide/WebsiteEndpoints.html
- Versioning: https://docs.aws.amazon.com/console/s3/enable-bucket-versioning
- IAM evaluation: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html
- DynamoDB keys: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html

The archived 47-question transcription was compared with the current bank: 25 matching prompts after punctuation/blank-length normalization; 22 also have matching option sets irrespective of order. IDs and differences are recorded in `../awsStudy/examOverlap.ts`. The originals have not been restored to the retired exam route.
