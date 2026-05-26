const cheerio = require('cheerio');
const { fetchHtml } = require('../utils/fetcher');
const { extractStreams } = require('../utils/extractors');

const BASE = 'https://www.cinecalidad.am';

async function getStreams(tmdbId, type, title, year, season, episode) {
    const streams = [];
    try {
        const query = encodeURIComponent(`${title} ${year}`);
        const html = await fetchHtml(`${BASE}/?s=${query}`, { 'Referer': BASE });
        if (!html) return streams;
        const $ = cheerio.load(html);

        let pageUrl = null;
        $('article a, .result-item a').each((i, el) => {
            if (pageUrl) return;
            const href = $(el).attr('href') || '';
            if (href.startsWith('http')) pageUrl = href;
        });
        if (!pageUrl) return streams;

        if (type === 'tv' && season && episode) {
            const ph = await fetchHtml(pageUrl, { 'Referer': BASE });
            if (!ph) return streams;
            const p$ = cheerio.load(ph);
            let epUrl = null;
            p$('a[href]').each((i, el) => {
                if (epUrl) return;
                const href = p$(el).attr('href') || '';
                const txt = p$(el).text().toLowerCase();
                const s = String(season).padStart(2,'0');
                const e = String(episode).padStart(2,'0');
                if ((txt.includes(`s${s}e${e}`) || txt.includes(`${season}x${episode}`)) && href)
                    epUrl = href;
            });
            if (epUrl) pageUrl = epUrl;
            else return streams;
        }

        const pageHtml = await fetchHtml(pageUrl, { 'Referer': BASE });
        if (!pageHtml) return streams;
        const p$ = cheerio.load(pageHtml);

        const embedUrls = new Set();
        p$('iframe[src]').each((i, el) => {
            const src = p$(el).attr('src');
            if (src && src.startsWith('http')) embedUrls.add(src);
        });
        p$('[data-url], .dooplay_player_option').each((i, el) => {
            const src = p$(el).attr('data-url') || p$(el).attr('data-post');
            if (src && src.startsWith('http')) embedUrls.add(src);
        });

        for (const url of embedUrls) {
            const extracted = await extractStreams(url);
            streams.push(...extracted.map(s => ({ ...s, source: 'CineCalidad', language: 'es-latino' })));
        }
    } catch (e) {
        console.error('[CineCalidad] Error:', e.message);
    }
    return streams;
}

module.exports = { getStreams, id: 'cinecalidad', name: 'CineCalidad', language: 'es' };
