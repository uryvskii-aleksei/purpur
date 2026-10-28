---
name: data-analysis
description: >-
  Define business KPIs and analyze sales, stock, batches, cost and production data with reproducible calculations and lineage. Use for BI reports and data quality, excluding agent productivity analytics.
---

# Business intelligence and data analysis

Use the [bi-analyst contract](../../roles/bi-analyst.md). Apply the checks relevant to the requested measure and source, not a mandatory full audit for every small calculation.

1. Define the business question and decision, then the population, grain and time basis. Is one row an order, line, payment, refund, shipment or inventory movement? Which event/date and time zone place it in the period? For a rate, define the denominator and observation window. Do not substitute a file download, lead or order creation for a paid sale.
2. Inspect keys, duplicates, nulls, source coverage and business-event status. Distinguish duplicate ingestion from legitimate repeated line items, payment attempts or partial shipments. Determine how corrections and late-arriving events affect the requested period. Use an as-of snapshot or explicit extraction time where definitions can change.
3. Declare expected join cardinalities. Compare row counts, distinct business keys and relevant control totals before and after a join. Aggregate separate one-to-many facts to a compatible grain or use a justified allocation before combining them. Two lines joined to two payment rows must not silently double goods or payment totals. Temporal price/cost lookup must match the chosen effective date, not whichever record is latest.
4. Normalize only with approved business definitions. Separate goods, discounts, tax, shipping/packaging and net/gross amounts. Never add currencies or convert mass/package units without a supported basis. For FX, identify the rate source, date and conversion method. Treat absent costs as missing rather than zero and name the margin/cost components actually covered.
5. Handle cancellations, failed/partial payments and refunds at their actual grain and status. State whether refunds are reported on the refund date or attributed to an original sale cohort, and prevent both views from being deducted together. Keep cash receipts, recognized revenue and delivered sales distinct. For stock, reconcile opening balance plus permitted movements to closing balance before claiming availability or consumption.
6. Reconcile the result with a relevant source total or independent control, matching period, grain, units and exclusions. Explain remaining differences such as timing, rounding or missing records with amounts where available. If no control exists, state that reconciliation is incomplete. Do not force a match with an unexplained plug or conceal an unresolved difference in a chart.
7. Return the reproducible query/calculation with parameters, definitions, extraction/source coverage, exclusions and reconciliation. Separate observed findings from estimates, forecasts and causal hypotheses. Use a table, spreadsheet or plot suited to the decision, with units and denominator visible. A zero denominator is undefined, not zero conversion.

Send definition conflicts to BA, lineage/data-quality issues to integration engineer and decision/measurement needs to PO/marketing/sales. Current inquiry receipt and manager-confirmed payment can be measured without implementing future login or checkout. Live dashboard publication and source changes remain separate coordinator actions. Agent scoring, effort tracking and self-improvement analytics remain excluded.
