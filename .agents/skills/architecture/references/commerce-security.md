# Commerce security and customer lifecycle

Use for scoped designs or changes involving customer identity, orders, payments or personal data. This is a verification procedure, not authority to deploy or perform production security tests.

## Ownership and evidence

Architect owns trust boundaries and the threat model. Coder implements the selected application contracts. Integration engineer owns provider messages, idempotency and reconciliation. DevOps owns secrets, isolation and recovery. QA and reviewer independently examine relevant behavior and code. Human business/legal owners settle retention and commercial obligations. No role label proves security or grants access.

Identify actual systems and providers before choosing a stack. Record customer/order identity, data purpose, storage, retention, deletion and restoration boundaries. Use synthetic data in nonproduction and keep secrets, real customer records and OTP codes out of Git and diagnostics.

## Identity and access

Design phone verification, session lifetime and logout, reauthentication, recovery and number-change handling together. A phone number alone is not proof of ownership. Cover rate limits, resend/attempt limits, expiration, reuse and concurrent challenges. Avoid account-existence leaks. Customer order reads and changes require server-side authorization on each request. Never attach historical orders merely because a visitor entered a matching phone number. Recycled numbers and shared devices require an explicit recovery/linking decision.

## Orders and payments

Server logic owns prices, availability and order transitions. A browser success screen or return URL does not prove payment. Verify provider messages through the actual provider contract. Cover duplicate/out-of-order delivery, retries, timeouts, cancellation, refunds and reconciliation. Separate authentication from permission to perform a transaction. Define safe failures before automating actions previously handled by a manager.

## Verification and handoff

QA covers customer A versus customer B, guest versus signed-in sessions, expired/reused/incorrect codes, retries and provider failure. Reviewer checks the same integrated revision and error paths. DevOps verifies nonproduction cannot use production payment/SMS credentials or write production data. Record passed, failed, blocked and untested boundaries in the task. Mock evidence does not prove a real provider integration.

Current source guidance consulted 2026-10-27: [OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) and [transaction authorization](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html). Provider-specific and legal requirements need their actual current sources when selected.
