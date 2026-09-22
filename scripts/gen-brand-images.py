"""
One-off script to generate interim branded images (OG share image + favicon
set) for Barclay's Salon, using the site's real brand palette and a serif
font that stands in for Fraunces (not available as a system font in this
sandbox). These are INTERIM assets built from brand colors + typography only
-- not the salon's real circular scissors logo, which this sandbox can't
fetch (network-blocked) and which should replace these once Tegan/Ryan send
the actual logo file. Not part of the Next.js build pipeline; just run once
to produce the files in public/.
"""

from PIL import Image, ImageDraw, ImageFont

CHARCOAL = (36, 31, 27)
IVORY = (250, 246, 241)
TERRACOTTA = (185, 112, 74)
GOLD = (199, 154, 92)

LORA = "/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf"
LORA_ITALIC = "/usr/share/fonts/truetype/google-fonts/Lora-Italic-Variable.ttf"
POPPINS = "/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf"
POPPINS_SB = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def centered_text(draw, cx, y, text, fnt, fill, letter_spacing=0):
    if letter_spacing:
        total_w = sum(draw.textlength(ch, font=fnt) + letter_spacing for ch in text) - letter_spacing
        x = cx - total_w / 2
        for ch in text:
            draw.text((x, y), ch, font=fnt, fill=fill)
            x += draw.textlength(ch, font=fnt) + letter_spacing
    else:
        w = draw.textlength(text, font=fnt)
        draw.text((cx - w / 2, y), text, font=fnt, fill=fill)


# ---------- OG / Twitter share image (1200x630) ----------
def make_og_image(path):
    img = Image.new("RGB", (1200, 630), CHARCOAL)
    d = ImageDraw.Draw(img)
    cx = 600

    # thin gold rule
    d.line([(cx - 60, 168), (cx + 60, 168)], fill=GOLD, width=2)

    d.font = font(POPPINS, 22)
    centered_text(d, cx, 190, "EVERETT'S TRUSTED SALON SINCE 1977", d.font, GOLD, letter_spacing=4)

    wordmark_font = font(LORA_ITALIC, 108)
    centered_text(d, cx, 250, "Barclay's Salon", wordmark_font, IVORY)

    tagline_font = font(POPPINS, 30)
    centered_text(d, cx, 400, "Expert color, balayage & precision cuts", tagline_font, (222, 210, 197))
    centered_text(d, cx, 445, "in the heart of Everett, WA", tagline_font, (222, 210, 197))

    d.line([(cx - 60, 512), (cx + 60, 512)], fill=TERRACOTTA, width=2)

    img.save(path, "PNG")
    print(f"wrote {path} {img.size}")


# ---------- Favicon / app icon (monogram badge) ----------
def draw_badge(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([0, 0, size - 1, size - 1], fill=CHARCOAL)
    # thin gold ring
    ring = max(2, size // 64)
    inset = max(2, size // 20)
    d.ellipse([inset, inset, size - 1 - inset, size - 1 - inset], outline=GOLD, width=ring)

    b_font = font(LORA_ITALIC, int(size * 0.56))
    d.font = b_font
    bbox = d.textbbox((0, 0), "B", font=b_font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text((size / 2 - tw / 2 - bbox[0], size / 2 - th / 2 - bbox[1] - size * 0.02), "B", font=b_font, fill=IVORY)
    return img


def make_icons(public_dir):
    master = draw_badge(512)
    master.save(f"{public_dir}/icon.png", "PNG")
    print(f"wrote {public_dir}/icon.png (512x512)")

    apple = draw_badge(180)
    # apple touch icons look better on a solid (non-transparent) square
    flat = Image.new("RGB", (180, 180), CHARCOAL)
    flat.paste(apple, (0, 0), apple)
    flat.save(f"{public_dir}/apple-icon.png", "PNG")
    print(f"wrote {public_dir}/apple-icon.png (180x180)")

    ico_sizes = [16, 32, 48]
    ico_images = [draw_badge(s) for s in ico_sizes]
    ico_images[-1].save(
        f"{public_dir}/favicon.ico",
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
    )
    print(f"wrote {public_dir}/favicon.ico (multi-size {ico_sizes})")


if __name__ == "__main__":
    import os

    public_dir = os.path.join(os.path.dirname(__file__), "..", "public")
    os.makedirs(public_dir, exist_ok=True)
    make_og_image(os.path.join(public_dir, "og-image.png"))
    make_icons(public_dir)
