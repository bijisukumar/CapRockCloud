"""
Shared branding for Caprock Cloud lead-magnet PDFs: a dark header band
(matching the site's dark theme) instead of a logo, which doesn't exist
yet. Drop a real logo in later by adding an Image draw call inside
draw_band() -- everything else stays the same.
"""

from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph

ACCENT = colors.HexColor("#2dd4bf")  # site's accent-500
ACCENT_DARK = colors.HexColor("#0f766e")
INK = colors.HexColor("#111317")
MUTED = colors.HexColor("#52525b")
LINE = colors.HexColor("#e4e4e7")
PANEL = colors.HexColor("#f4f4f5")
BAND_BG = colors.HexColor("#0d0f12")  # site's base-900

BAND_HEIGHT = 1.5 * inch
TOP_MARGIN = BAND_HEIGHT + 0.4 * inch

_styles = getSampleStyleSheet()

kicker_band_style = ParagraphStyle(
    "kicker_band", parent=_styles["Normal"], fontName="Helvetica-Bold",
    fontSize=9, textColor=ACCENT, leading=11,
)
title_band_style = ParagraphStyle(
    "title_band", parent=_styles["Title"], fontName="Helvetica-Bold",
    fontSize=19, leading=23, textColor=colors.white, alignment=0,
)


def make_page_callbacks(title_text, left_margin):
    """Returns (on_first_page, on_later_pages) draw callbacks for SimpleDocTemplate.build()."""

    def on_first_page(canvas, doc):
        canvas.saveState()
        page_w, page_h = doc.pagesize
        canvas.setFillColor(BAND_BG)
        canvas.rect(0, page_h - BAND_HEIGHT, page_w, BAND_HEIGHT, fill=1, stroke=0)

        content_w = page_w - left_margin - doc.rightMargin

        kicker = Paragraph("CAPROCK CLOUD", kicker_band_style)
        kicker.wrapOn(canvas, content_w, 0.3 * inch)
        kicker.drawOn(canvas, left_margin, page_h - 0.62 * inch)

        title = Paragraph(title_text, title_band_style)
        _, title_h = title.wrapOn(canvas, content_w, BAND_HEIGHT)
        title.drawOn(canvas, left_margin, page_h - 0.95 * inch - title_h + 23)

        canvas.restoreState()

    def on_later_pages(canvas, doc):
        canvas.saveState()
        page_w, page_h = doc.pagesize
        canvas.setFillColor(ACCENT_DARK)
        canvas.rect(0, page_h - 0.06 * inch, page_w, 0.06 * inch, fill=1, stroke=0)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica-Bold", 8)
        canvas.drawString(left_margin, page_h - 0.35 * inch, "CAPROCK CLOUD")
        canvas.restoreState()

    return on_first_page, on_later_pages


# ---- Shared body styles and table helpers for new documents ----
from reportlab.platypus import Table, TableStyle  # noqa: E402

body = ParagraphStyle("body", parent=_styles["Normal"], fontName="Helvetica", fontSize=10, leading=14.5, textColor=INK)
body_muted = ParagraphStyle("body_muted", parent=body, textColor=MUTED)
small = ParagraphStyle("small", parent=body, fontSize=9, leading=13)
cell_head = ParagraphStyle("cell_head", parent=body, fontName="Helvetica-Bold", fontSize=10)
intro_style = ParagraphStyle("intro", parent=body_muted, fontSize=11, leading=16, spaceAfter=10)
heading_style = ParagraphStyle(
    "heading", parent=_styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=13, leading=16, textColor=INK, spaceBefore=18, spaceAfter=8,
)
footer_style = ParagraphStyle("footer", parent=small, textColor=MUTED)


def p(text, style=body):
    return Paragraph(text, style)


def grid_table(rows, col_widths, bold_first_col=False):
    """rows[0] is the header row; cells are plain strings (use &amp; for ampersands)."""
    first_col = ParagraphStyle("first_col", parent=small, fontName="Helvetica-Bold")
    cells = []
    for r, row in enumerate(rows):
        if r == 0:
            cells.append([Paragraph(c, cell_head) for c in row])
        else:
            cells.append([
                Paragraph(c, first_col if (bold_first_col and i == 0) else small)
                for i, c in enumerate(row)
            ])
    t = Table(cells, colWidths=col_widths, repeatRows=1)
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


def build_branded_doc(path, title, band_title, story, author="Caprock Cloud"):
    """Build a PDF with the dark header band on page 1 and a compact top margin
    on later pages (SimpleDocTemplate applies one top margin to every page)."""
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import BaseDocTemplate, Frame, NextPageTemplate, PageTemplate

    left = right = 0.85 * inch
    bottom = 0.75 * inch
    page_w, page_h = letter
    frame_w = page_w - left - right

    doc = BaseDocTemplate(
        path, pagesize=letter, leftMargin=left, rightMargin=right,
        topMargin=TOP_MARGIN, bottomMargin=bottom, title=title, author=author,
    )
    on_first, on_later = make_page_callbacks(band_title, left)
    doc.addPageTemplates([
        PageTemplate(id="First", onPage=on_first, frames=[
            Frame(left, bottom, frame_w, page_h - TOP_MARGIN - bottom, id="first"),
        ]),
        PageTemplate(id="Later", onPage=on_later, frames=[
            Frame(left, bottom, frame_w, page_h - 0.8 * inch - bottom, id="later"),
        ]),
    ])
    doc.build([NextPageTemplate("Later")] + story)
