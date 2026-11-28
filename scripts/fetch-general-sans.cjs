// General Sans (headlines and the clock) comes from Fontshare under the ITF Free Font License.
// The license allows self-hosting it on Flow but not redistributing it through a public
// repository, so the file is downloaded at build time instead of committed (it is gitignored).
// If the download fails the build carries on and headlines fall back to Bricolage.
const { existsSync, mkdirSync, writeFileSync } = require('node:fs');
const { dirname, resolve } = require('node:path');

const out = resolve(__dirname, '../public/fonts/general-sans.woff2');

(async () => {
    if (existsSync(out)) return;
    try {
        const css = await (await fetch('https://api.fontshare.com/v2/css?f[]=general-sans@1&display=swap')).text();
        const url = css.match(/url\('([^']+\.woff2)'\)/)?.[1];
        if (!url) throw new Error('no woff2 in the Fontshare stylesheet');
        const res = await fetch(new URL(url, 'https://api.fontshare.com'));
        if (!res.ok) throw new Error(`font download returned ${res.status}`);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, Buffer.from(await res.arrayBuffer()));
        console.log('Downloaded General Sans from Fontshare.');
    } catch (error) {
        console.warn(`Could not download General Sans (${error.message}); headlines will fall back to Bricolage.`);
    }
})();
