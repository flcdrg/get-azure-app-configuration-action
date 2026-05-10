# Copilot instructions for `get-azure-app-configuration-action`

## Build, test, lint

Use Node 20 and install dependencies with:

```bash
npm ci
```

Primary project scripts:

```bash
npm run build      # TypeScript: src -> lib
npm run lint       # ESLint over src/**/*.ts
npm test           # Jest (current tests are Azure-backed integration-style tests)
npm run package    # Bundle to dist/index.js with @vercel/ncc
npm run all        # build + format + lint + package + test
```

Run a single test file / test case:

```bash
npm test -- src/__tests__/appConfiguration.test.ts
npm test -- src/__tests__/appConfiguration.test.ts -t "single key1"
```

Test prerequisites (from test workflow + test file behavior):

1. `az` CLI must be installed and authenticated.
2. `Azure/login@v3` style auth is expected in CI before running tests/action.
3. Integration tests use `RESOURCE_GROUP` and `RESOURCE` env vars (defaults exist in test file but assume Azure resources are present).

## High-level architecture

This repository builds a JavaScript GitHub Action that runs from `dist/index.js` (`action.yml`), but source of truth is TypeScript in `src/`.

1. `src/main.ts` is the orchestration entrypoint:
   - Reads action inputs (`resourceGroup`, `appConfigurationName`, `keyFilter`, `labelFilter`).
   - Defaults missing `labelFilter` to `\0` (null-label entries).
   - Fetches settings via `getKeys(...)`.
   - Exports each setting as both action output (`core.setOutput`) and environment variable (`core.exportVariable`).
   - If a setting is an App Configuration Key Vault reference, resolves it through Key Vault first.
2. `src/appConfiguration.ts` handles App Configuration access:
   - Resolves `az` path.
   - Calls Azure CLI (`appconfig credential list ...`) to get the **Primary Read Only** connection string.
   - Masks that connection string with `core.setSecret`.
   - Uses `AppConfigurationClient.listConfigurationSettings(filter)` and returns the async iterator.
3. `src/kv.ts` resolves Key Vault referenced values:
   - Uses `DefaultAzureCredential` + `SecretClient`.
   - Fetches the secret value and masks it with `core.setSecret`.
4. Build/package flow:
   - `npm run build` compiles TS to `lib/`.
   - `npm run package` (ncc) bundles to `dist/index.js` (the runtime entry referenced by `action.yml`).

## Key conventions in this codebase

1. **Treat `src/` as canonical.** `lib/` and `dist/` are generated artifacts from build/package steps.
2. **Default label behavior is intentional:** omitted `labelFilter` becomes `\0` in `main.ts`, meaning unlabeled keys by default.
3. **Secret hygiene is explicit in code paths:**
   - App Configuration connection string is masked (`core.setSecret`).
   - Key Vault secret values are also masked.
4. **Dual export pattern for every resolved value:** each key is emitted as both step output and environment variable.
5. **Tests are snapshot-driven integration tests** against real Azure App Configuration semantics (`src/__tests__/appConfiguration.test.ts`), including filter combinations and wildcard behavior described in `README.md`.
6. **Filter semantics follow README contract:** exact list (comma-separated, up to 5) or single wildcard expression, with escaping rules for `*`, `\`, and `,`.
