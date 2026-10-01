"""
Generates the "Middleware to Cloud Migration Checklist" lead-magnet PDF.
Run: python scripts/generate_checklist_pdf.py
Output: public/documents/middleware-to-cloud-migration-checklist.pdf

Content is a first-pass draft grounded in what's already on the site
(Hero/CapabilitiesSection copy, the blog post) -- review and edit before
treating it as final.
"""

import os
import sys

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)

sys.path.insert(0, os.path.dirname(__file__))
from pdf_brand import ACCENT_DARK as ACCENT, INK, MUTED, LINE, TOP_MARGIN, make_page_callbacks

OUTPUT_PATH = os.path.join(
    os.path.dirname(__file__), "..", "public", "documents",
    "middleware-to-cloud-migration-checklist.pdf",
)

SECTIONS = [
    (
        "1. Dependency & environment audit",
        [
            "Map every system that produces or consumes data through the middleware layer",
            "Identify undocumented or point-to-point integrations that bypass the middleware layer entirely",
            "Catalog authentication and connectivity requirements for each integration",
            "Document current message volumes and peak load windows",
        ],
    ),
    (
        "2. Downtime tolerance assessment",
        [
            "Classify each integration by downtime tolerance: zero, minutes, or hours",
            "Identify integrations with hard SLAs or compliance requirements",
            "Flag integrations with no clear owner or unclear business criticality",
        ],
    ),
    (
        "3. Phased migration plan",
        [
            "Group integrations into migration waves by risk and dependency",
            "Sequence waves so no wave breaks a system that hasn't migrated yet",
            "Define concrete success criteria for a wave before starting the next one",
        ],
    ),
    (
        "4. Rollback trigger -- defined in advance",
        [
            "Set explicit, measurable rollback criteria before cutover, not decided under pressure",
            "Name who has the authority to call a rollback",
            "Keep the legacy path live and reachable until the new path is validated in production",
        ],
    ),
    (
        "5. Cutover & validation",
        [
            "Run the new path against production traffic in parallel before full cutover",
            "Validate message parity -- volume, latency, error rate -- against the legacy baseline",
            "Confirm monitoring and alerting are live on the new path before legacy is retired",
        ],
    ),
    (
        "6. Post-migration",
        [
            "Decommission the legacy path only after a defined stability window",
            "Document the as-built architecture of the new environment",
            "Stand up ongoing health, cost, and anomaly monitoring",
        ],
    ),
]


def checklist_table(items):
    rows = []
    for item in items:
        box = Table([[""]], colWidths=[0.16 * inch], rowHeights=[0.16 * inch])
        box.setStyle(
            TableStyle(
                [
                    ("BOX", (0, 0), (-1, -1), 1, INK),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ]
            )
        )
        text = Paragraph(item, ParagraphStyle(
            "item", fontName="Helvetica", fontSize=10.5, leading=15, textColor=INK,
        ))
        rows.append([box, text])

    t = Table(rows, colWidths=[0.3 * inch, 6.1 * inch])
    t.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return t


def build():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        topMargin=TOP_MARGIN,
        bottomMargin=0.75 * inch,
        leftMargin=0.85 * inch,
        rightMargin=0.85 * inch,
        title="Middleware to Cloud Migration Checklist",
        author="Caprock Cloud",
    )

    styles = getSampleStyleSheet()
    intro = ParagraphStyle(
        "intro", parent=styles["Normal"], fontName="Helvetica",
        fontSize=11, leading=16, textColor=MUTED, spaceAfter=18,
    )
    heading = ParagraphStyle(
        "heading", parent=styles["Heading2"], fontName="Helvetica-Bold",
        fontSize=13, leading=16, textColor=INK, spaceBefore=16, spaceAfter=8,
    )
    footer_style = ParagraphStyle(
        "footer", parent=styles["Normal"], fontName="Helvetica",
        fontSize=9, textColor=MUTED,
    )

    on_first_page, on_later_pages = make_page_callbacks(
        "Middleware to Cloud Migration Checklist",
        doc.leftMargin,
    )

    story = []
    story.append(
        Paragraph(
            "A phased checklist for moving legacy middleware and integrations onto "
            "Azure without a risky all-at-once cutover. Work through each section in "
            "order before moving a single workload.",
            intro,
        )
    )
    story.append(HRFlowable(width="100%", thickness=1, color=LINE))

    for heading_text, items in SECTIONS:
        story.append(Paragraph(heading_text, heading))
        story.append(checklist_table(items))

    story.append(Spacer(1, 24))
    story.append(HRFlowable(width="100%", thickness=1, color=LINE))
    story.append(Spacer(1, 10))
    story.append(
        Paragraph(
            "Caprock Cloud &mdash; Enterprise Integration &amp; Azure Operations Partner<br/>"
            "hello@caprock-cloud.com &mdash; caprock-cloud.com",
            footer_style,
        )
    )

    doc.build(story, onFirstPage=on_first_page, onLaterPages=on_later_pages)
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    build()
