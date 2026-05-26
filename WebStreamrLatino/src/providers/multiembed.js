const { fetchHtml, extractEmbeds } = require('../utils/fetcher');
const { extractStreams } = require('../utils/extractors');

// multiembed.mov — URL directa con TMDB ID, sin scraping
module.exports = {
    name: 'MultiEmbed',
    async getStreams(tmdbId, type, title, year, season = 1, episode = 1) {
        if (!tmdbId) return [];
        const url = type === 'tv'
            ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`
            : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;

        const html = await fetchHtml(url, { 'Referer': 'https://multiembed.mov/' });
        if (!html) return [];

        const results = [];
        const embeds = extractEmbeds(html);
        for (const embedUrl of embeds) {
            const streams = await extractStreams(embedUrl);
            streams.forEach(s => results.push({ ...s, source: 'MultiEmbed', language: 'es-latino' }));
        }
        return results;
    }
};
