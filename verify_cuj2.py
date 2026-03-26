from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(10000) # The intro animation takes 9000ms based on App.tsx!

    # Take screenshot of the initial dashboard
    page.screenshot(path="/home/jules/verification/screenshots/dashboard.png")
    page.wait_for_timeout(1000)

    # Click on Enter the Foundry
    page.get_by_text("Enter the Foundry").click()
    page.wait_for_timeout(2000)

    # Check if we are in the assets view
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
