# Desktop input isolation

This is a local restriction for the Mac used by Purpur, following the active [desktop input incident](../../../../tasks/desktop-input-freeze/README.md). It is not a general ban on UI testing.

Native desktop automation remains isolated until a verified fix and the user's authorization to resume it are recorded in that task. Do not call native app selection, desktop snapshots, native clicks, keyboard events or drag operations, including native fallbacks from a browser tool. Do not restart the helper, enable permissions, synthesize a mouse release, reset TCC or restart WindowServer to diagnose or clear the symptom. A CUA kernel reset does not release host input or terminate its native helper.

Use repository tests, HTTP checks and terminal diagnostics. Browser DOM operations may be used only when they do not require native app control or enabling its helper. A failed browser connection is a failed check. Do not escalate it into desktop automation during this incident.

Before investigating a recurrence, establish whether physical clicks work, whether the pointer moves and whether keyboard app switching works. Do not ask a user with failed clicks to drag items into macOS Settings. `npm run diagnose:input` takes a bounded passive snapshot on macOS, without posting input or granting access. It is a manual diagnostic, not a monitor or a repair. Sustained button state does not identify the source and may reflect an intentional physical press. An unavailable probe is not a healthy result.

Keep the animated companion off as explicitly requested by the user. Record observations, mitigations and causal conclusions separately. Do not claim that disabling the companion or stopping Computer Use proves either caused the failure. Do not reproduce a system-wide input failure on the user's active desktop to validate a hypothesis.

The failure recurred after the user clicked the floating character, with the native automation helper absent and Pets already reporting `default`. Do not assume that this setting closes every floating app window or releases stuck input. During the transfer to Cursor, leave the ChatGPT companion off. Finish saving before asking the user to quit ChatGPT with the keyboard. Recovery after quitting or rebooting remains unverified until reported or passively checked.
