"""
Generates "Host Integration Server 2006 to 2020 -- Migration Planning Guide".
Run: python scripts/generate_his_migration_guide_pdf.py
Output: public/documents/his-2006-to-2020-migration-guide.pdf

Product facts (support dates, platform requirements, migration tool steps,
recompile requirements) come from Microsoft Learn's Host Integration Server
documentation as of October 2026. Re-verify before regenerating -- HIS 2028
is announced but unreleased, so the "choose your target" section will age.
"""

import os
import sys

from reportlab.lib.units import inch
from reportlab.platypus import Spacer, HRFlowable, KeepTogether

sys.path.insert(0, os.path.dirname(__file__))
from pdf_brand import (  # noqa: E402
    LINE, build_branded_doc, p, grid_table,
    body, body_muted, intro_style, heading_style, footer_style,
)

OUTPUT_PATH = os.path.join(
    os.path.dirname(__file__), "..", "public", "documents",
    "his-2006-to-2020-migration-guide.pdf",
)

CHANGES = [
    ["Area", "HIS 2020 reality", "What it means for your plan"],
    [
        "Platform",
        "64-bit (x64) only; cannot be installed on a 32-bit OS. Windows Server 2016 / 2019 "
        "(2022 with CU1). .NET Framework 4.8 required. 32-bit APPC applications and emulators "
        "run side-by-side.",
        "Treat this as a build on a new server, not an upgrade of the old one.",
    ],
    [
        "Upgrade path",
        "In-place upgrade is supported only from HIS 2016. Older versions use the HIS Migration "
        "Tool: save the configuration, install HIS 2020, then apply it.",
        "Plan a save / install / apply sequence. No wizard carries 2006 forward.",
    ],
    [
        "Application code",
        "Transaction Integrator (TI) assemblies, WIP and HIP programs are recompiled against "
        ".NET 4.8; configuration moves to .config files (not the registry). Microsoft documents "
        "this for 2013/2016 sources.",
        "From 2006, expect at least that much rework. Inventory every host-facing application "
        "early and test it first.",
    ],
    [
        "Developer tooling",
        "Visual Studio 2017 / 2019 / 2022 (2022 with CU1). Extensions are now VSIX packages; "
        "Visual Studio integration is not migrated and is re-enabled in the configuration wizard.",
        "Developer workstations need a tooling refresh alongside the servers.",
    ],
    [
        "Identity &amp; security",
        "Group Managed Service Accounts (gMSA) are supported. Service passwords are blanked in "
        "the saved configuration and must be re-entered before services will start.",
        "Revisit service-account design now, not after cutover.",
    ],
    [
        "Support lifecycle",
        "HIS 2006 left extended support on April 11, 2017. HIS 2020: mainstream support to "
        "July 12, 2028, extended to July 10, 2030.",
        "You are moving from an unsupported product to one with a defined end date.",
    ],
]

PHASES = [
    ["Phase", "Key tasks", "Exit criteria"],
    [
        "1. Discover &amp; decide",
        "Complete discovery (see our HIS Discovery Checklist). Inventory TI, WIP and HIP programs, "
        "BizTalk adapters and SNA links. Choose the target version.",
        "Signed-off inventory and a target decision.",
    ],
    [
        "2. Build the target",
        "New x64 server(s) on a supported Windows version; .NET 4.8; service accounts / gMSA; "
        "network paths. Install HIS 2020 but do not run the Configuration Wizard yet.",
        "Clean HIS 2020 install, wizard not yet run.",
    ],
    [
        "3. Capture &amp; apply configuration",
        "Rehearse on a non-production copy first. Run HisMigration.exe /Save, re-enter service "
        "passwords in savedConfig.config, then /Apply. For a different server name, regenerate "
        "com.cfg with SNACFG.exe.",
        "Configuration applies cleanly in test and services start.",
    ],
    [
        "4. Rebuild &amp; recompile",
        "Recompile TI / WIP / HIP programs on .NET 4.8, update .config files, re-save TI .hidx "
        "definitions in the designer, and move any registry-based settings into .config.",
        "Each host-facing application passes functional tests.",
    ],
    [
        "5. Parallel run &amp; validate",
        "Run the new path against production-like traffic. Compare TPS, latency and error rate "
        "to the discovery baseline. Check IPDLC link settings and SNA print sessions.",
        "Parity with the legacy baseline; rollback triggers agreed in advance.",
    ],
    [
        "6. Cutover",
        "In a multi-server subdomain, migrate secondary servers first and the primary last. "
        "Enable firewall rules manually when ready. Keep the 2006 environment intact until the "
        "stability window passes.",
        "Stability window met and sign-off recorded.",
    ],
    [
        "7. Decommission &amp; monitor",
        "Retire the 2006 hosts, stand up monitoring, and put the next HIS support milestone "
        "on the calendar.",
        "Legacy retired; ongoing monitoring live.",
    ],
]

GOTCHAS = [
    "<b>Passwords are blanked.</b> The saved configuration replaces service-account passwords with a "
    "placeholder; services will not start until you enter the real ones. There can be several.",
    "<b>Remote SNA Gateway configurations</b> are not supported by the migration tool (per Microsoft's "
    "current documentation). Plan to rebuild those by hand.",
    "<b>WIP programs are not inspected</b> by the tool. Check each application's app.config for "
    "up-to-date server locations.",
    "<b>Firewall rules</b> are not enabled automatically; turn them on deliberately at cutover.",
    "<b>New server, new name:</b> com.cfg may need regenerating, IPDLC link service settings may need "
    "manual updates for the new network adapters, and SNA print sessions need the same printers.",
    "<b>Same-server migration uninstalls the old HIS</b> after saving its configuration. Prefer "
    "server-to-server so the 2006 environment stays intact as your rollback path.",
    "<b>Validate the tool against your own 2006 configuration</b> in a test environment before "
    "committing to a timeline. Microsoft's guidance describes migration from \"earlier versions\" "
    "generally and calls out specific steps for 2013/2016.",
]


def build():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    s = []
    s.append(p(
        "HIS 2006 reached the end of extended support in April 2017, and HIS 2020 is a very "
        "different product to land on. This guide covers what changes, how to choose your target, "
        "and the phases of an actual migration. It is the follow-on to our "
        "<b>HIS to Azure Discovery Checklist</b>.",
        intro_style,
    ))
    s.append(p(
        "<b>Who this is for:</b> teams still running Host Integration Server 2006 (or another "
        "pre-2016 version) who need a practical plan for moving to HIS 2020. "
        "<i>Product facts reflect Microsoft Learn documentation as of October 2026.</i>",
        body_muted,
    ))
    s.append(Spacer(1, 6))
    s.append(HRFlowable(width="100%", thickness=1, color=LINE))

    s.append(p("Why this is not a normal upgrade", heading_style))
    s.append(p(
        "There is no in-place upgrade from HIS 2006. The supported route is to capture your "
        "configuration with the HIS Migration Tool and apply it to a fresh HIS 2020 install, "
        "and the surrounding platform changes substantially along the way.",
        body_muted,
    ))
    s.append(Spacer(1, 8))
    s.append(grid_table(CHANGES, [1.0 * inch, 3.1 * inch, 2.2 * inch], bold_first_col=True))

    s.append(p("Choose your target deliberately", heading_style))
    s.append(p(
        "HIS 2020 is the obvious landing spot, but its mainstream support ends in July 2028 and "
        "Microsoft has announced a successor. Decide before you plan:",
        body_muted,
    ))
    s.append(Spacer(1, 6))
    s.append(p(
        "&bull; <b>HIS 2020</b> &mdash; shipping today, with a documented migration tool and "
        "support into 2028 (mainstream) and 2030 (extended). The realistic target if your "
        "cutover lands in the next twelve months.", body))
    s.append(p(
        "&bull; <b>HIS 2028</b> &mdash; announced for September 2027: .NET 10, the first HIS to run "
        "on Linux, Microsoft Entra ID support, Azure Arc enablement for the HIS Gateway, and a "
        "Visual Studio Code designer. Not yet released, so a migration path from 2006 cannot be "
        "validated today.", body))
    s.append(p(
        "&bull; <b>Azure Logic Apps connectors</b> for IBM mainframe and midrange systems &mdash; for "
        "workloads you would rather move off HIS entirely. Microsoft's HIS 2020 notes reference "
        "optional extended support and discounts for customers who migrate to Logic Apps.", body))
    s.append(Spacer(1, 6))
    s.append(p(
        "<b>Our guidance:</b> a 2006 to 2020 move now followed by a 2020 to 2028 move later is two "
        "projects. If 2006 being unsupported is your urgent risk, land on 2020 and keep the next "
        "hop small by keeping your applications and configuration clean.", body))

    s.append(p("The migration, phase by phase", heading_style))
    s.append(p("Work the phases in order; each has an exit criterion to meet before moving on.", body_muted))
    s.append(Spacer(1, 8))
    s.append(grid_table(PHASES, [1.25 * inch, 3.25 * inch, 1.8 * inch], bold_first_col=True))

    gotcha_block = [p("Gotchas that catch teams out", heading_style)]
    for g in GOTCHAS:
        gotcha_block.append(p("&bull; " + g, body))
        gotcha_block.append(Spacer(1, 3))
    s.append(KeepTogether(gotcha_block[:4]))
    s.extend(gotcha_block[4:])

    s.append(Spacer(1, 18))
    s.append(HRFlowable(width="100%", thickness=1, color=LINE))
    s.append(Spacer(1, 12))
    s.append(p(
        "<b>Running HIS 2006 today?</b><br/>"
        "We plan and run these migrations, from discovery through parallel run and cutover. "
        "If you want a second pair of eyes on your plan or target decision, get in touch.",
        body,
    ))
    s.append(Spacer(1, 10))
    s.append(p(
        "Caprock Cloud &mdash; Enterprise Integration &amp; Azure Operations Partner<br/>"
        "hello@caprock-cloud.com &mdash; caprock-cloud.com",
        footer_style,
    ))

    build_branded_doc(
        OUTPUT_PATH,
        "Host Integration Server 2006 to 2020 -- Migration Planning Guide",
        "Host Integration Server 2006 to 2020<br/>Migration Planning Guide",
        s,
    )
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    build()
