const { fetchHtml, extractEmbeds } = require('../utils/fetcher');
const { extractStreams } = require('../utils/extractors');

// smashystream.com — URL directa con TMDB ID, sin scraping
module.exports = {
    name: 'SmashyStream',
    async getStreams(tmdbId, type, title, year, season = 1, episode = 1) {
        if (!tmdbId) return [];
        const url = type === 'tv'
            ? `https://player.smashystream.com/playere.php?tmdb=${tmdbId}&s=${season}&e=${episode}`
            : `https://player.smashystream.com/playere.php?tmdb=${tmdbId}`;

        const html = await fetchHtml(url, { 'Referer': 'https://smashystream.com/' });
        if (!html) return [];

        const results = [];
        const embeds = extractEmbeds(html);
        for (const embedUrl of embeds) {
            const streams = await extractStreams(embedUrl);
            streams.forEach(s => results.push({ ...s, source: 'SmashyStream', language: 'es-latino' }));
        }
        return results;
    }
};
