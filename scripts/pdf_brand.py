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
