from playwright.sync_api import sync_playwright

URL = "http://localhost:8123/mockups-menu-citta.html"

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1300, "height": 900}, device_scale_factor=2)
    pg.goto(URL, wait_until="networkidle")
    pg.wait_for_timeout(500)

    # Full comparison (all 4)
    pg.screenshot(path="mock_all_options.png", full_page=True)

    # Per-option phone screenshots
    wraps = pg.query_selector_all(".phone-wrap")
    for i, w in enumerate(wraps, 1):
        w.scroll_into_view_if_needed()
        pg.wait_for_timeout(150)
        w.screenshot(path=f"mock_option_{i}.png")
    b.close()
print("done", len(wraps) if 'wraps' in dir() else '?')
