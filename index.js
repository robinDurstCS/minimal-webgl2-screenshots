const path = require('path');
const { chromium, webkit } = require('playwright');
const sharp = require('sharp');
const expressApp = require('express')();

expressApp.get('', async (_, res) => {
    const webgl2sampleURL = 'https://webglsamples.org/WebGL2Samples/#glsl_flat_smooth_interpolators';
    const chromiumInstance = await chromium.launch();
    const webkitInstance = await webkit.launch();
    const chromiumPage = await chromiumInstance.newPage();
    const webkitPage = await webkitInstance.newPage();

    chromiumPage.goto(webgl2sampleURL);
    webkitPage.goto(webgl2sampleURL);

    setTimeout(async () => {
        const screenshotPath = path.join(__dirname, 'ChromiumVSWebkit.png');
        const chromiumScreenshot = await chromiumPage.screenshot();
        const webkiScreenshot = await webkitPage.screenshot();
        const { width, height } = webkitPage.viewportSize();

        await sharp({ create: {
            width: width * 2,
            height: height * 2,
            channels: 3,
            background: { r: 255, g: 255, b: 255 },
        } }).composite([ { input: webkiScreenshot, left: 0, top: 0 }, { input: chromiumScreenshot, left: 0, top: height } ]).toFile(screenshotPath);

        res.sendFile(screenshotPath);
    }, 4000);
});

expressApp.listen(3000, () => console.log('server listening on 3000'));
