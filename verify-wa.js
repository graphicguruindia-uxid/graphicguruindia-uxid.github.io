const { chromium } = require('C:\\Users\\vinodd\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright-core');

(async () => {
  const b = await chromium.launch({ executablePath: 'C:\\Users\\vinodd\\AppData\\Local\\ms-playwright\\chromium-1234\\chrome-win64\\chrome.exe' });
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });

  // 1) index.html loads, find wa.html link
  const r1 = await pg.goto('http://127.0.0.1:8899/index.html', { waitUntil: 'networkidle' });
  console.log('index.html:', r1.status());
  const wa = await pg.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find(x => /wa\.html/.test(x.href));
    return a ? { href: a.href, text: a.textContent.trim() } : null;
  });
  console.log('hero wa link:', JSON.stringify(wa));

  // 2) wa.html loads and redirects to wa.me (meta refresh + noscript fallback)
  const r2 = await pg.goto('http://127.0.0.1:8899/wa.html', { waitUntil: 'commit' });
  console.log('wa.html initial:', r2.status());
  // Wait a moment for meta refresh to fire
  await new Promise(r => setTimeout(r, 500));
  const finalUrl = pg.url();
  console.log('final url:', finalUrl);
  console.log('redirect fired:', finalUrl.includes('wa.me'));

  // 3) contact.html: reveal WhatsApp link, verify it points at wa.html
  const r3 = await pg.goto('http://127.0.0.1:8899/contact.html', { waitUntil: 'networkidle' });
  console.log('contact.html:', r3.status());
  const revealed = await pg.evaluate(async () => {
    const btn = document.querySelector('.gg-reveal-contact[data-contact="whatsapp"]');
    if (!btn) return 'no reveal button';
    btn.click();
    await new Promise(r => setTimeout(r, 300));
    const link = document.querySelector('a[href*="wa.html"]');
    return link ? link.href : 'no link after reveal';
  });
  console.log('contact revealed link:', revealed);

  // 4) mobile 375px: hero wa link present + no horizontal scroll
  await pg.setViewportSize({ width: 375, height: 720 });
  const r4 = await pg.goto('http://127.0.0.1:8899/index.html', { waitUntil: 'networkidle' });
  const mobile = await pg.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find(x => /wa\.html/.test(x.href));
    return {
      link: a ? a.href : null,
      hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    };
  });
  console.log('mobile 375:', JSON.stringify(mobile));

  console.log('errors:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})().catch(e => console.log('FATAL', e.message));
