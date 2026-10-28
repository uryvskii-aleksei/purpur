# Corporate MCP capability selection

Use for Figma design access/editing and Rocket.Chat workspace integration. The current comparison and official sources are in [MCP assessment](../../../../docs/techprojects/site-development/mcp-assessment.md). Refresh unstable provider capabilities before setup.

## Select and prove capability

Distinguish advertised server features, installed/enabled configuration, tools actually exposed in this session and access to a specific corporate file or room. A plugin search result is not a connection. Prefer a supported first-party integration when it covers the requested operation. Evaluate a third-party bridge only against a demonstrated missing capability and its maintenance, trust, local dependencies and permissions.

For Figma, use the official remote MCP as the first candidate for read/write workflows, subject to actual access and tool availability. Do not assume all desktop/REST-context servers support canvas writing. Choose one active integration for a task when similarly named tools could select the wrong server. Preserve native components and the owning design system.

Before changing the default, verify in an authorized dedicated test file: read the intended frame, export needed assets, perform a bounded edit when authorized, preserve component relationships, read back the result and record the file/node/version. Test the applicable undo/recovery path. A code or image preview alone does not prove native Figma editing. Keep approved source links and useful exports with the Git task. Design files and external comments do not replace canonical requirements.

For Rocket.Chat, establish the real workspace version, licensing, endpoint and exact returned tool list. Native MCP's curated default includes write operations and is not read-only. Use a least-privilege identity and explicit room scope. Grant no admin access merely to make a test pass. Initial connectivity/read checks do not authorize posting, channel creation or membership changes. Workers return proposed messages/actions to the coordinator under the existing assignment boundaries.

## Configuration and records

The disabled [configuration example](../../../../.codex/mcp-servers.example.toml) is a template, not a live connection. Personal enabled configuration and secrets stay outside Git. Do not copy examples wholesale into a user's profile, replace unrelated servers, or guess a corporate URL/token. Use the actual client's supported plugin/OAuth setup or documented server configuration after its parameters are known.

Record exact tested capabilities, target identity, version/date, permission boundary, unavailable checks and next action in the owning Git task. Failures should identify the missing prerequisite. Continue work that does not depend on the integration. Automatic retries, broadening access or switching identities are not substitutes for a failed capability test.
