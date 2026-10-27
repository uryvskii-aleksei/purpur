# Storybook and browser smoke

Use the existing workspace/root Storybook or app script. Open the changed flow, exercise affected behavior and inspect console/network failures. Run configured interaction/screenshot checks where relevant. Stop only servers started for this check unless the user wants them kept running. Deeper diagnosis uses [browser diagnostics](analyze-logs.md).

## Story conventions

Where Storybook is configured, add/update stories for public components. Shared utilities are in `the owning workspace's configured Storybook helpers`.

### Story layout (canonical)

Stories live in `<workspace>/storybook/stories/<component>/`:

| Kind | File |
| --- | --- |
| Static overview | `<component>.overview.stories.tsx` |
| Static variants | `<NN>.<component>.<variant>.stories.tsx` |
| Dynamic `play` scenario | `scenarios/<name>.stories.tsx`, one story per file |
| Regression | `bugs/<name>.stories.tsx`, one story per file |

An overview may use `play` for one snapshot. Configured screenshot expectations live in `<workspace>/storybook/screenshots/`.

## Coverage of stories

Include relevant stories in existing interaction, screenshot or coverage checks. Story existence alone does not prove tested behavior.
