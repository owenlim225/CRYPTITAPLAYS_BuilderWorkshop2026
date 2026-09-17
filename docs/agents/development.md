# AI-assisted development

- Before editing, inspect nearby code, package manifests, and the applicable specifications. Follow existing names, structure, and framework idioms; explain any necessary departure.
- Keep changes within the requested scope. Do not introduce a competing architecture or refactor unrelated code.
- Separate domain and business logic from UI frameworks, databases, transport, and third-party services where that separation provides real value. Prefer the simplest design with clear boundaries, low coupling, and high cohesion; do not create interfaces, DTOs, factories, or layers merely to satisfy a pattern.
- Keep modules cohesive and composable, with explicit inputs, outputs, dependencies, ownership, and side effects.
- At system boundaries, keep framework, persistence, network, and external-service details behind narrow adapters. Infrastructure implements contracts owned by application/domain code when such contracts are needed.
- Preserve the existing boundaries: `types.ts` defines frontend contracts; `lib/mapBuilderCard.ts` maps data; `lib/suiClient.ts` configures the network client; hooks coordinate effects; components render UI; Move owns on-chain state.
- Use explicit TypeScript types and validate external data at trust boundaries before treating it as trusted application data. Type assertions alone do not validate input.
- When changing a contract, update affected Move definitions, frontend types, adapters, consumers, tests, schemas, CLI examples, and documentation together.
- Prefer reproducible commands and stable APIs. Preserve lockfiles; change dependencies deliberately and document new external services and configuration in the README.
- Return actionable errors with enough context to diagnose the failed operation, without exposing credentials or sensitive payloads. Use structured context for new diagnostic logs; add metrics only for a concrete operational need.
- Make scripts and operations safe to retry or roll back where practical. Identify irreversible actions and partial completion explicitly; follow the [operation-specific rules](contracts-and-operations.md).
- Explain non-obvious decisions in nearby comments or documentation. Report actual validation results under the [verification rules](verification.md).
