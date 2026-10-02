"""
Generates the "Host Integration Server to Azure Migration -- Discovery
Checklist" lead-magnet PDF.
Run: python scripts/generate_his_discovery_pdf.py
Output: public/documents/his-to-azure-discovery-checklist.pdf

Based on a draft spec, restructured as a prospect-facing lead magnet:
added audience framing and a "why discovery first" intro, replaced the
internal-document sign-off block with a practical "using your findings"
section, and added a closing CTA. Review before treating it as final.
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
    KeepTogether,
)

sys.path.insert(0, os.path.dirname(__file__))
from pdf_brand import ACCENT_DARK as ACCENT, INK, MUTED, LINE, PANEL, TOP_MARGIN, make_page_callbacks

OUTPUT_PATH = os.path.join(
    os.path.dirname(__file__), "..", "public", "documents",
    "his-to-azure-discovery-checklist.pdf",
)

styles = getSampleStyleSheet()
body = ParagraphStyle("body", parent=styles["Normal"], fontName="Helvetica", fontSize=10, leading=14.5, textColor=INK)
body_muted = ParagraphStyle("body_muted", parent=body, textColor=MUTED)
cell_head = ParagraphStyle("cell_head", parent=body, fontName="Helvetica-Bold", fontSize=10)
small = ParagraphStyle("small", parent=body, fontSize=9, leading=13)


def p(text, style=body):
    return Paragraph(text, style)


def scope_table():
    in_scope = [
        "SNA Gateway &amp; Enterprise Server nodes",
        "TN3270 / TN5250 emulator sessions",
        "Host Integration Server (HIS) BizTalk adapters",
        "Custom MQSeries &amp; CPI-C transaction programs",
    ]
    out_scope = [
        "Core mainframe batch job scheduling (unless integrated via API)",
        "Peripheral hardware/printers on local branch networks",
        "End-user client desktop OS version audits",
    ]
    rows = [[p("In scope", cell_head), p("Out of scope", cell_head)]]
    for i in range(max(len(in_scope), len(out_scope))):
        left = p("&bull; " + in_scope[i], small) if i < len(in_scope) else ""
        right = p("&bull; " + out_scope[i], small) if i < len(out_scope) else ""
        rows.append([left, right])
    t = Table(rows, colWidths=[3.15 * inch, 3.15 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PANEL),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def tracks_table():
    data = [
        ["Track", "Core assessment activities", "Deliverable"],
        [
            "1. Network &amp; connectivity",
            "Audit IP routing, TN3270 ports (23/992), SNA DLC links, ExpressRoute circuits, firewall rule bases",
            "Network topology diagram &amp; port matrix",
        ],
        [
            "2. Protocol &amp; security",
            "Inspect SSL/TLS cipher suites, RACF/ACF2 credential handshakes, Kerberos/NTLM mappings",
            "Security compliance &amp; encryption report",
        ],
        [
            "3. Application interfaces",
            "Identify Transaction Integrator (TI) XML schemas, COM components, .NET client bindings, REST wrappers",
            "API &amp; component inventory catalog",
        ],
        [
            "4. Capacity &amp; latency",
            "Measure peak concurrent sessions, packet payload sizes, transaction TPS, round-trip latency",
            "SLA &amp; performance baseline document",
        ],
    ]
    rows = [[p(c, cell_head) if r == 0 else p(c, small) for c in row] for r, row in enumerate(data)]
    t = Table(rows, colWidths=[1.3 * inch, 3.3 * inch, 1.7 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PANEL),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def risk_table():
    data = [
        ["Risk", "Severity", "Potential impact", "Mitigation"],
        [
            "Hardcoded IP addresses in legacy client apps",
            "High",
            "Connection failures post-migration to Azure VNet",
            "Azure Private Link &amp; DNS forwarding rules",
        ],
        [
            "Undocumented custom COBOL copybooks",
            "Medium",
            "Transaction Integrator schema generation errors",
            "Reverse-engineer via static code analysis",
        ],
        [
            "Exceeded latency threshold on SNA over TCP",
            "High",
            "Timeout exceptions in interactive user sessions",
            "Azure ExpressRoute Local with FastPath",
        ],
    ]
    sev_colors = {"High": colors.HexColor("#b91c1c"), "Medium": colors.HexColor("#b45309")}
    rows = []
    for r, row in enumerate(data):
        if r == 0:
            rows.append([p(c, cell_head) for c in row])
        else:
            sev_style = ParagraphStyle("sev", parent=small, textColor=sev_colors.get(row[1], INK), fontName="Helvetica-Bold")
            rows.append([p(row[0], small), p(row[1], sev_style), p(row[2], small), p(row[3], small)])
    t = Table(rows, colWidths=[1.6 * inch, 0.9 * inch, 1.9 * inch, 1.9 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PANEL),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def numbered_item(n, title, text):
    num = Table([[str(n)]], colWidths=[0.28 * inch], rowHeights=[0.28 * inch])
    num.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), ACCENT),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.white),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
    ]))
    text_block = Paragraph(f"<b>{title}:</b> {text}", body)
    row = Table([[num, text_block]], colWidths=[0.4 * inch, 6.0 * inch])
    row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return row


def build():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        topMargin=TOP_MARGIN,
        bottomMargin=0.75 * inch,
        leftMargin=0.85 * inch,
        rightMargin=0.85 * inch,
        title="Host Integration Server to Azure Migration -- Discovery Checklist",
        author="Caprock Cloud",
    )

    intro = ParagraphStyle("intro", parent=body_muted, fontSize=11, leading=16, spaceAfter=10)
    heading = ParagraphStyle("heading", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=INK, spaceBefore=18, spaceAfter=8)
    footer_style = ParagraphStyle("footer", parent=small, textColor=MUTED)

    on_first_page, on_later_pages = make_page_callbacks(
        "Host Integration Server to Azure Migration<br/>Discovery Checklist",
        doc.leftMargin,
    )

    story = []
    story.append(p(
        "Before planning a Host Integration Server (HIS) migration to Azure, a structured "
        "discovery pass surfaces the dependencies, protocols, and risks that determine whether "
        "the migration goes smoothly &mdash; or turns into unplanned downtime. Use this checklist "
        "to scope that discovery phase.",
        intro,
    ))
    story.append(p(
        "<b>Who this is for:</b> IT and enterprise architecture teams running Host Integration "
        "Server, SNA gateways, or TN3270/TN5250 terminal connectivity into mainframe or AS/400 "
        "(IBM i) systems, evaluating a move to Azure.",
        body_muted,
    ))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1, color=LINE))

    story.append(p("Discovery scope &amp; boundaries", heading))
    story.append(p(
        "Discovery covers all hardware, virtual appliances, communication protocols, security "
        "certificates, and downstream application dependencies interfacing with legacy mainframe "
        "or AS/400 (IBM i) systems.",
        body_muted,
    ))
    story.append(Spacer(1, 8))
    story.append(scope_table())

    story.append(p("Four discovery tracks", heading))
    story.append(p(
        "Run these concurrently &mdash; a typical first pass takes about three weeks, scaled to "
        "the size of the environment.",
        body_muted,
    ))
    story.append(Spacer(1, 8))
    story.append(tracks_table())

    story.append(p("Step-by-step discovery procedure", heading))
    story.append(numbered_item(1, "Inventory extraction", "deploy discovery scripts to enumerate all active Host Integration Server instances and active connection pools."))
    story.append(numbered_item(2, "Dependency mapping", "trace inbound and outbound API calls from web front-ends down to legacy CICS/IMS regions using distributed tracing."))
    story.append(numbered_item(3, "Security &amp; authentication audit", "verify directory integration (Active Directory vs. RACF) and map the service principal names (SPNs) used by integration components."))
    story.append(numbered_item(4, "Data volume profiling", "analyze daily transaction volumes and peak concurrency to size target Azure VM and App Service tiers accurately."))

    story.append(p("Risk assessment &amp; mitigation", heading))
    story.append(risk_table())

    story.append(KeepTogether([
        p("Using your discovery findings", heading),
        p(
            "Discovery output should feed a <b>phased</b> migration plan, not a single cutover:",
            body,
        ),
        Spacer(1, 4),
        p("&bull; Group dependencies into migration waves by risk and business criticality, not by system age", body),
        p("&bull; Treat any undocumented dependency as a blocker to resolve before scheduling a cutover date", body),
        p("&bull; Size target Azure services directly from the capacity &amp; latency baseline you just captured, not from vendor sizing guides", body),
        p("&bull; Treat any High-severity risk from the matrix above as a go/no-go gate for the pilot wave", body),
    ]))

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=LINE))
    story.append(Spacer(1, 12))
    story.append(p(
        "<b>Planning a Host Integration Server migration?</b><br/>"
        "We run this discovery phase for teams moving off HIS, and turn it into a phased "
        "migration plan &mdash; particularly for older HIS environments where the gap in "
        "supported protocols and adapters versus current platforms is often bigger than it "
        "looks on paper.",
        body,
    ))
    story.append(Spacer(1, 10))
    story.append(p(
        "Caprock Cloud &mdash; Enterprise Integration &amp; Azure Operations Partner<br/>"
        "hello@caprock-cloud.com &mdash; caprock-cloud.com",
        footer_style,
    ))

    doc.build(story, onFirstPage=on_first_page, onLaterPages=on_later_pages)
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    build()
