const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = { window: {}, URL, URLSearchParams };
vm.createContext(context);
for (const file of ['certificates-data_v2.js','credlyBadges.js','credentials-catalog.js']) {
    vm.runInContext(fs.readFileSync(path.join(root,'assets/js',file),'utf8'),context,{ filename: file });
}
const catalog = context.window.credentialsCatalog;

test('every source record has a supported category, stable detail ID and usable preview', () => {
    assert.equal(Object.keys(catalog.types).length,5);
    assert.equal(catalog.list.length,125);
    assert.equal(new Set(catalog.list.map(record => record.id)).size,catalog.list.length);
    for (const record of catalog.list) {
        assert.ok(catalog.types[record.type],record.id);
        assert.equal(catalog.get(record.id),record);
        assert.ok(record.title && record.provider && record.mainImage,record.id);
        assert.ok(Array.isArray(record.modules) && Array.isArray(record.skills) && Array.isArray(record.projects));
        if (record.mainImage.startsWith('assets/')) assert.ok(fs.existsSync(path.join(root,record.mainImage)),record.mainImage);
        const href = new URL(catalog.detailHref(record.id),'https://example.com/cv/');
        assert.equal(href.pathname,'/cv/portfolio_details.html');
        assert.equal(href.searchParams.get('id'),record.id);
    }
    for (const [id,source] of Object.entries(context.window.certData)) assert.equal(catalog.get(id).type,source.type);
    assert.equal(Object.values(catalog.counts).reduce((sum,value) => sum+value,0),catalog.list.length);
    for (const count of Object.values(catalog.counts)) assert.ok(count > 0);
});

test('the same verified certificate is listed once and its badge alias still resolves', () => {
    const uuid = 'adc543d1-0d0a-42cf-9b76-f09412427cd1';
    assert.equal(catalog.list.filter(record => record.verifyLink.includes(uuid)).length,1);
    const record = catalog.get(`badge-${uuid}`);
    assert.equal(record.id,'associate-cloud-engineer');
    assert.equal(record.mainImage,'assets/docs/png/cert-associate-cloud-engineer-p1.jpg');
    assert.equal(record.expiresOn,'2029-02-01');
    assert.equal(context.window.credlyBadges.length,29);
});

test('ordering uses issue dates and keeps each category in the declared order', () => {
    assert.equal(catalog.sort(catalog.list,'recent')[0].id,'generative-ai-leader');
    assert.equal(catalog.get('associate-cloud-engineer').sortDate,20260201);
    for (const type of Object.keys(catalog.types)) {
        const records = catalog.list.filter(record => record.type === type);
        for (let i=1;i<records.length;i++) assert.ok(records[i-1].sortDate >= records[i].sortDate,type);
    }
    const alphabetic = catalog.sort(catalog.list,'title');
    for (let i=1;i<alphabetic.length;i++) assert.ok(alphabetic[i-1].title.localeCompare(alphabetic[i].title,'es') <= 0);
});

test('dates retain their original precision and support the source languages', () => {
    assert.equal(catalog.parseDate('Mar 13, 2026 EDT').iso,'2026-03-13');
    assert.equal(catalog.parseDate('1 de febrero de 2026').iso,'2026-02-01');
    assert.equal(catalog.parseDate('Noviembre 2023').display,'noviembre de 2023');
    assert.equal(catalog.parseDate('Noviembre 2023').iso,'');
    assert.equal(catalog.parseDate('2023').display,'2023');
    assert.equal(catalog.parseDate('2023').iso,'');
    assert.equal(catalog.parseDate('Feb 30, 2026').sortValue,0);
});

test('filter, query, sorting and expanded state survive a complete detail round trip', () => {
    const state = { type:'skill-badge',query:'Gemini & IA',sort:'title',expanded:true,open:true };
    const href = new URL(catalog.detailHref(catalog.list[0].id,catalog.stateQuery(state)),'https://example.com/cv/');
    const restored = catalog.readState(href.searchParams.get('catalog'));
    assert.deepEqual(JSON.parse(JSON.stringify(restored)),state);
    const back = new URL(catalog.returnHref(restored),'https://example.com/cv/');
    assert.equal(back.pathname,'/cv/index.html');
    assert.equal(back.hash,'#certifications');
    assert.deepEqual(JSON.parse(JSON.stringify(catalog.readState(back.searchParams))),state);
    assert.equal(catalog.returnHref(catalog.readState('credentialType=unknown&credentialSort=invalid&next=https://evil.example')),'index.html#certifications');
});

test('issuer names and logos do not turn Coursera badges into an inferred IBM issuer', () => {
    const records = catalog.list.filter(record => record.type === 'badge' && record.provider === 'Coursera');
    assert.ok(records.length > 0);
    for (const record of records) assert.equal(record.providerLogo,'assets/img/coursera.png');
});
