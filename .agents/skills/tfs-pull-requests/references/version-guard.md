# App version guard

Apply only to a deliverable with an existing release/version policy. Purpur currently has no automated product release policy. A source-only website or harness change does not invent a version bump, release tag or publication pipeline.

Before an authorized release, inspect the actual manifests, target branch, changelog, publish paths and consumer pins. Determine the affected deliverables from that configuration. Use the configured package manager and release procedure. Never copy another product's application paths, artifact names or delivery locations.

Where SemVer is configured, use patch for compatible fixes, minor for compatible features and major for incompatible public contracts. For mixed changes use the highest required level. Reuse an in-flight version across review rounds unless the target has consumed it. Never reuse an already published version or move an existing tag. Version edits and release publication are separate authorized actions. Include version edits in the PR plan when applicable.

## Historical release lines

For explicitly requested historical publication, resolve the semantic boundary from Git history, changelogs and verified consumer pins. Preserve the historical product/dependency snapshot. Create a dedicated `release/<app>-<version>` from that verified base. Change only the necessary version/release records unless a demonstrated build prerequisite needs a separately reviewed correction.

Before publication, inspect remote branch and tag conflicts. Verify the exact source SHA, successful checks, version and expected artifacts. Inspect whether the actual pipeline creates tags before adding one within the release authorization. Missing historical evidence stays a reported gap. Publication alone does not switch a consumer to the new line.
