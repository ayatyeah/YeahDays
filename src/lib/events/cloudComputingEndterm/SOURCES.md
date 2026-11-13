# Cloud Developing question bank and exam notes

`questions.json` remains the original 47-question photographed exam bank. Its
wording, option order, and keys were not changed by this import.

`knowledgeChecks.json` contains 120 questions observed in the authenticated
AWS Academy Cloud Developing course 193042: ten questions in each Knowledge
Check for modules 2–13. `knowledgeCheckModules.json` records the source URLs.
Question text, options, and feedback retain the original English, with layout
whitespace normalized. Code displayed alongside a question is included in its
prompt. Correct selections were checked against the course results.

Module 3 question 4 has contradictory source feedback: it displays “Incorrect”
while incrementing the correct-answer count and awarding full credit. Its key
is preserved with a caution explaining the HTTP/HTTPS website-endpoint issue.
This bank reflects the course's wording, not a guarantee that all historical
service limits or simplified statements remain current.

`examNotes.json` contains 47 Russian study sections and their primary sources.
Ten agents reviewed groups of four or five original exam questions, followed
by integration review and coverage checks. `examAnswerGuidance.json` is the
client-side subset for the 188 option explanations; full notes render on the
separate notes route. The three ambiguous original questions remain ungraded.

`knowledgeCheckOptionCounts.json` is a small validation index for restoring
saved progress without eagerly loading the full 120-question bank.
