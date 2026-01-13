import {expect, type Page} from '@playwright/test';

interface DocumentWithFonts extends Document {
    readonly fonts: {
        readonly size: number;
        readonly ready: Promise<void>;
        readonly status: 'loading' | 'loaded';
    };
}

export async function tuiWaitForFonts(page: Page): Promise<void> {
    await expect(async () => {
        expect(
            await page.evaluate(() => (document as DocumentWithFonts).fonts.size),
        ).toBeGreaterThan(0);
        expect(
            await page.evaluate(() => (document as DocumentWithFonts).fonts.ready),
        ).toBeTruthy();
        expect(
            await page.evaluate(() => (document as DocumentWithFonts).fonts.status),
        ).toBe('loaded');
    }).toPass({timeout: 30_000});
}
