# Copilot Instructions

## Conventions

- Workspace uses pnpm 10.x; install with `pnpm install` at repo root.
- File naming: prefer kebab-case (foo-bar). Unless the file is trivial, organize implementations inside a folder (foo-bar/index.tsx).
- Function parameters: functions should have no more than 3 parameters. If exceeding 3, merge parameters into an object argument.

## Run and build

- Dev server: `pnpm dev` (Next 16 App Router). Build: `pnpm build`; analyze bundle: `pnpm analyze`; start prod: `pnpm start`.
- Packages build: `pnpm build:deps` compiles workspaces (tsdown for the loader). Publishing flow: `pnpm changeset` → `pnpm version` → `pnpm release`.

## Quality gates

- Lint: `pnpm lint` (passes `--flag unstable_ts_config`), auto-fix with `pnpm lint:fix`.
- Types: `pnpm typecheck`. Tests: `pnpm test:unit` (Vitest app/shared), `pnpm test:auto-import` or `pnpm -C packages/auto-import-loader test` for the loader (pretest builds first).
- Husky + lint-staged run eslint on staged files during `prepare`.

## App layout and routing

- Root layout sets metadata, Inter font, and wraps children with Ant Design SSR registry + AppLayout in [src/app/layout.tsx#L13-L29](../src/app/layout.tsx#L13-L29).
- Sidebar + navigation live in [src/app/\_components/AppLayout/index.tsx#L19-L99](../src/app/_components/AppLayout/index.tsx#L19-L99); menu items derive from `AwesomeTool` and `getToolHref` in [src/helpers/router.ts#L1-L3](../src/helpers/router.ts#L1-L3).
- Tool route: /awesome/[tool] validates via `React.use(params)` and 404s unknown enums in [src/app/awesome/[tool]/page.tsx#L3-L21](../src/app/awesome/[tool]/page.tsx#L3-L21).

## Adding or updating tools

- Tool components are lazy-loaded (ssr: false) via map in [src/app/awesome/[tool]/\_pages/index.ts#L6-L33](../src/app/awesome/[tool]/_pages/index.ts#L6-L33).
- To add: update enum in [src/constants/tools.ts#L1-L9](../src/constants/tools.ts#L1-L9), add a client component under [src/app/awesome/[tool]/\_pages](../src/app/awesome/[tool]/_pages), register it in the map, and ensure the sider shows it if desired.
- Other demos (streaming, flex-1-scrollbar, konva) are linked in the sider; see [src/app/\_components/AppLayout/index.tsx#L35-L71](../src/app/_components/AppLayout/index.tsx#L35-L71).
- Streaming page opts into dynamic rendering (`dynamic = 'force-dynamic'`) and streams UI pieces with Suspense in [src/app/streaming/page.tsx#L1-L15](../src/app/streaming/page.tsx#L1-L15).

## UI stack

- Ant Design + utility classes; AntD SSR wiring in [src/app/\_components/AntdRegistry/index.tsx#L6-L12](../src/app/_components/AntdRegistry/index.tsx#L6-L12).
- Tool headers share [src/app/\_components/ToolTitle/index.tsx#L4-L18](../src/app/_components/ToolTitle/index.tsx#L4-L18) with GitHub icon support.

## Auto-import loader package

- Entry re-exports the loader from [packages/auto-import-loader/src/index.ts#L1-L1](../packages/auto-import-loader/src/index.ts#L1-L1); core logic in [packages/auto-import-loader/src/loader.ts#L13-L45](../packages/auto-import-loader/src/loader.ts#L13-L45).
- Behavior: flattens configured imports/presets/dirs via `createUnimport`, forces `injectAtEnd` for `use client`, emits d.ts, injects imports, or returns original code if unchanged.
- Options shape in [packages/auto-import-loader/src/types.ts#L8-L15](../packages/auto-import-loader/src/types.ts#L8-L15); `dts` controls emission (true → auto-imports.d.ts, string → custom path); `logLevel` follows consola.
- Build/test locally with `pnpm -C packages/auto-import-loader build` (tsdown) then `pnpm -C packages/auto-import-loader test` (Vitest under **test**).
