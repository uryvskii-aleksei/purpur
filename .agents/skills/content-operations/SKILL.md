---
name: content-operations
description: >-
  Create, verify and update product catalog facts, copy and media with field-level provenance. Use for product records and content completeness, not inventing production or commercial facts.
---

# Content operations

Use the [content-manager contract](../../roles/content-manager.md). Inspect the current catalog schema and audit before changing records.

1. Match the assigned field to the exact product ID/SKU, variant and package/version using its source. A similar name, shared photo or assortment is not enough to merge records. If the source has changed since the saved snapshot, identify the version conflict before replacing a fact. Preserve unrelated manual content and established IDs.
2. Verify the changed fact in its own unit and context. Distinguish net package weight, number of pieces, nutritional values per 100 g, sale unit and price unit. Check any conversion with the supported source values and rule. Do not transfer one variant's piece count or package price to another.
3. For ingredients/allergens, preserve the product-specific wording and separate declared composition, warnings about traces and an absent statement. Absence is not evidence of an allergen-free, alcohol-free or health claim. Send contradictions to the real production/quality owner instead of selecting a convenient source. Shelf life and storage conditions must refer to the relevant product version.
4. Inspect media against the product and intended use. Check file existence, resolution/crop suitability and source/license or supplied permission. Public accessibility alone does not establish reuse rights. Keep an unknown rights status explicit. New factual captions or alt text must describe what the asset supports.
5. Keep provenance at the changed-field level: product/version, source/date, supported value and any unresolved contradiction. Update the affected audit/source map without replacing unrelated records. The current shop keeps `canOrder: false` for unverified package weight. Resolve those restrictions only from an authoritative source and preserve unresolved entries in the current audit. A historical snapshot is not live stock or price confirmation.
6. Write clear copy from the verified facts. Separate readable summary from full composition without changing meaning or generalizing a collection's claims to the entire catalog. Then check affected schema fields, unique IDs/URLs, units/price consistency, media references and applicable catalog tests.

Give designer ready copy/assets, marketing the claims actually supported and QA the changed record IDs, provenance and retained restrictions. Report unresolved fields separately from changed facts. Live CMS or commercial updates remain scoped coordinator actions.
