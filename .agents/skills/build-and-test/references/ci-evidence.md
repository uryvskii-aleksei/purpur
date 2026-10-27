# CI evidence for a pull request

1. Read PR identity, source/target commits, iteration and required policies.
2. Match each applicable run to that PR state and checked merge commit, respecting target expiration. An unverified association is not current evidence.
3. Inspect the actual jobs, checks, published Tests and required Artifacts. A build verifies only the checks it ran. Publish results/artifacts from that run, not a later rebuild.
4. Re-read source identity before reporting. Separate local checks from CI. Distinguish pending, failed, automated checks passed/review pending, and all required policies satisfied.

Create the PR before waiting for PR-triggered CI. At handoff, take a bounded status snapshot, link pending/failed runs and continue independent work. Later relevant changes need fresh evidence.
