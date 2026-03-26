from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000")

    # Bypass intro logic or just wait 10s
    page.wait_for_timeout(10000)

    # Take screenshot of the initial dashboard
    page.screenshot(path="/home/jules/verification/screenshots/dashboard.png")
    page.wait_for_timeout(1000)

    # Click on the start button on hero, or anywhere that is clickable.
    # We can also just get_by_role("button")
    buttons = page.get_by_role("button")
    if buttons.count() > 0:
        buttons.first.click()
    page.wait_for_timeout(2000)

    page.screenshot(path="/home/jules/verification/screenshots/assets.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
