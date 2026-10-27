---
name: content-operations
description: >-
  Create, verify and update product catalog facts, copy and media with field-level provenance. Use for product records and content completeness, not inventing production or commercial facts.
---

# Content operations

Use the [content-manager contract](../../roles/content-manager.md) and [handoffs](../department-workflow/references/handoffs.md).

1. Identify assigned records/fields, authoritative sources and date. Preserve unrelated manual content.
2. Verify price/unit, package/weight, ingredients/allergens, storage/shelf life, images and rights. Track source/date and contradictions per changed field. Similar products and marketing drafts are not factual evidence.
3. Keep unknowns explicit. The current shop retains `canOrder: false` for unverified package weight until an authoritative source resolves it. Update the audit/source map where affected, without replacing unrelated catalog records.
4. Write factual copy aligned with the approved flow. Hand designer copy/assets, marketing approved claims and QA affected records, image/link checks and restrictions.
5. Validate schema, IDs, duplicates, units/prices, references and applicable catalog tests. Live CMS/commercial changes are performed by the coordinator only within actual authority.

Return content changes, provenance, unresolved fields and order restrictions. No customer data, fabricated reviews, health benefits or certifications in repository material.
