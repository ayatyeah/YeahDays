# Frontend skill review — 14 November 2026

Scope: the five skills requested for the YeahGrind redesign. Reviewed their instructions, referenced guidance, relevant executable entry points and installer configuration. Retrieved 167 pinned source files, searched for credential access, instruction overrides, shell execution, network calls and hidden bidi/Unicode tag characters. Manually inspected the instruction entry points and higher-risk matches. This is a scoped static review, not a guarantee about all upstream dependencies or future releases.

| Skill | Reviewed upstream revision | Result / boundary |
| --- | --- | --- |
| UI/UX Pro Max | `nextlevelbuilder/ui-ux-pro-max-skill@6ae86f61f520d6ca229d2f40e070410638c908c5` | No evident instruction hijacking found. Search uses local CSV files and standard-library Python; optional persistence writes design documents. The separate CLI has shell string interpolation in `cli/src/utils/extract.ts` and can update global npm packages. That CLI is not used. |
| React Best Practices | `vercel-labs/agent-skills@1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` | Markdown guidance and examples; no installer/hook in the selected skill directory. No evident malicious instructions found. |
| Web Design Guidelines | Same agent-skills revision | Retrieves a mutable external rule document. Independently reviewed `vercel-labs/web-interface-guidelines@434b7f91364665f2f733b310ec54809bf8f37937/command.md`; no evident malicious instructions found. Future fetched versions require review. |
| Motion | `motiondivision/ai-kit@1e424943582cbbdb6e3f410687e39f96451447bb` | Local best-practice documents are usable independently. The separate installer adds hosted Motion MCP servers; premium tools can involve account access and saved reports. No Motion installer, MCP configuration or paid service was enabled. |
| Better Colors | `jakubkrehel/skills@a72290d140249813898ba8648becf6415abcb059` | Markdown guidance and agent metadata; no executable scripts in the skill directory. No evident malicious instructions found. |

Installation used Codex's existing skill-installer with explicit commit revisions and only the five skill directories. No upstream npm installer was executed. UI/UX Pro Max's Claude-specific script prefix was changed to its local absolute installation directory. Local skills are under `/home/yeahayat/.codex/skills/`.

No project secrets were sent to these repositories or optional services. External guidance remains subordinate to user and repository instructions. Source review copies and SHA-256 hashes are in `/tmp/yeahgrind-skill-audit-20261114/`; temporary files are not a durable archive.
