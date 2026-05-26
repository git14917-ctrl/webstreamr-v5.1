const { fetchHtml, extractEmbeds } = require('../utils/fetcher');
const { extractStreams } = require('../utils/extractors');

// embed.su — prefiere IMDB ID, fallback a TMDB ID
module.exports = {
    name: 'EmbedSu',
    async getStreams(tmdbId, type, title, year, season = 1, episode = 1, imdbId = null) {
        const vid = imdbId || tmdbId;
        if (!vid) return [];

        const url = type === 'tv'
            ? `https://embed.su/embed/tv/${vid}/${season}/${episode}`
            : `https://embed.su/embed/movie/${vid}`;

        const html = await fetchHtml(url, { 'Referer': 'https://embed.su/' });
        if (!html) return [];

        const results = [];
        const embeds = extractEmbeds(html);
        for (const embedUrl of embeds) {
            const streams = await extractStreams(embedUrl);
            streams.forEach(s => results.push({ ...s, source: 'EmbedSu', language: 'es-latino' }));
        }
        return results;
    }
};
