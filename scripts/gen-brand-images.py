"""
Generates the favicon / app icons and the social-share (OG) image from the
salon's real logo (public/images/logo.png).

Run from the project root:  python scripts/gen-brand-images.py
Requires Pillow. Fonts: pass paths via LORA / POPPINS env vars if the
defaults below aren't present on your machine.
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = os.path.join(ROOT, "public", "images", "logo.png")

CHARCOAL = (36, 31, 27)
CHARCOAL_SOFT = (74, 66, 60)
IVORY = (250, 246, 241)
TERRACOTTA = (185, 112, 74)
GOLD = (199, 154, 92)

LORA = os.environ.get("LORA", "/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf")
POPPINS = os.environ.get("POPPINS", "/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf")


def resized(img, size):
    return img.resize((size, size), Image.LANCZOS)


def main():
    logo = Image.open(LOGO).convert("RGBA")

    # Browser tab + app icons, straight from the real logo (transparent corners).
    resized(logo, 512).save(os.path.join(ROOT, "app", "icon.png"), optimize=True)
    resized(logo, 256).save(
        os.path.join(ROOT, "app", "favicon.ico"),
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )

    # Apple touch icon: iOS needs an opaque square, so center the logo on ivory.
    apple = Image.new("RGBA", (180, 180), IVORY + (255,))
    mark = resized(logo, 160)
    apple.alpha_composite(mark, (10, 10))
    apple.convert("RGB").save(os.path.join(ROOT, "app", "apple-icon.png"), optimize=True)

    # Social share image, 1200x630.
    W, H = 1200, 630
    og = Image.new("RGBA", (W, H), IVORY + (255,))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    g.ellipse((780, -260, 1460, 420), fill=GOLD + (60,))
    g.ellipse((-260, 330, 380, 900), fill=TERRACOTTA + (45,))
    og.alpha_composite(glow.filter(ImageFilter.GaussianBlur(90)))

    mark = resized(logo, 400)
    og.alpha_composite(mark, (90, (H - 400) // 2))

    d = ImageDraw.Draw(og)
    x = 560
    eyebrow = ImageFont.truetype(POPPINS, 22)
    title = ImageFont.truetype(LORA, 76)
    try:
        title.set_variation_by_axes([600])
    except Exception:
        pass
    body = ImageFont.truetype(POPPINS, 28)
    small = ImageFont.truetype(POPPINS, 22)

    def spaced(y, text, fnt, fill, spacing):
        cx = x
        for ch in text:
            d.text((cx, y), ch, font=fnt, fill=fill)
            cx += d.textlength(ch, font=fnt) + spacing

    spaced(170, "EVERETT, WA  ·  SINCE 1977", eyebrow, TERRACOTTA, 3)
    d.text((x - 3, 210), "Barclay’s Salon", font=title, fill=CHARCOAL)
    d.rectangle((x, 318, x + 70, 321), fill=GOLD)
    d.text((x, 345), "Color, balayage & precision cuts", font=body, fill=CHARCOAL_SOFT)
    d.text((x, 385), "Walk-ins always welcome", font=body, fill=CHARCOAL_SOFT)
    d.text((x, 452), "barclaysalon.com", font=small, fill=TERRACOTTA)

    og.convert("RGB").save(os.path.join(ROOT, "public", "og-image.png"), optimize=True)
    print("Generated app/icon.png, app/favicon.ico, app/apple-icon.png, public/og-image.png")


if __name__ == "__main__":
    main()
