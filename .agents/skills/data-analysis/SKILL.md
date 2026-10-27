---
name: data-analysis
description: >-
  Define business KPIs and analyze sales, stock, batches, cost and production data with reproducible calculations and lineage. Use for BI reports and data quality, excluding agent productivity analytics.
---

# Business intelligence and data analysis

Use the [bi-analyst contract](../../roles/bi-analyst.md). Exclude agent scoring, effort tracking and self-improvement records.

1. Identify question, source permissions, period, units/currency, time zone, grain and data owner. Define each measure, exclusions and treatment of refunds/cancellations before calculating.
2. Check completeness, duplicate keys, nulls, joins and temporal coverage. Reconcile totals against authoritative records. Avoid multiplying order-line amounts by joining several payment rows.
3. Distinguish revenue, paid revenue, shipments, margin, production cost, stock movements and available balance. State formula and missing cost components. Label forecasts/assumptions and do not invent history.
4. Use permitted read-only sources or sanitized extracts. Keep customer records/secrets out of tracked reports. Send definition gaps to BA, lineage/data quality to integration engineer and measurement needs to PO/marketing/sales.
5. Return reproducible queries/calculations, definitions, reconciliation, source/date coverage, useful visualization and limits. Use artifact-appropriate spreadsheet/plotting tools. Coordinator performs authorized live dashboard publication or source changes separately.
