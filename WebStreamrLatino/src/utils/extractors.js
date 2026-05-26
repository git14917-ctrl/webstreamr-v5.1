const axios = require('axios');

// ── Extractor VOE ──────────────────────────────────────────────────────────
async function extractVoe(url) {
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': url },
            timeout: 10000
        });
        const html = res.data;
        const hlsMatch = html.match(/'hls':\s*'([^']+)'/);
        if (hlsMatch) return [{ url: hlsMatch[1], quality: '1080p', label: 'VOE' }];
        const mp4Match = html.match(/'mp4':\s*'([^']+)'/);
        if (mp4Match) return [{ url: mp4Match[1], quality: '720p', label: 'VOE' }];
        // Newer VOE obfuscation
        const b64 = html.match(/atob\('([^']+)'\)/);
        if (b64) {
            const decoded = Buffer.from(b64[1], 'base64').toString();
            const m = decoded.match(/(https?:[^"']+\.m3u8[^"']*)/);
            if (m) return [{ url: m[1], quality: '1080p', label: 'VOE' }];
        }
    } catch (e) {}
    return [];
}

// ── Extractor FileMoon ─────────────────────────────────────────────────────
async function extractFilemoon(url) {
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://filemoon.sx/' },
            timeout: 10000
        });
        const html = res.data;
        const m3u8Match = html.match(/file:\s*"(https?:[^"]+\.m3u8[^"]*)"/);
        if (m3u8Match) return [{ url: m3u8Match[1], quality: '1080p', label: 'FileMoon' }];
    } catch (e) {}
    return [];
}

// ── Extractor StreamWish ───────────────────────────────────────────────────
async function extractStreamwish(url) {
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': url },
            timeout: 10000
        });
        const html = res.data;
        const m3u8Match = html.match(/file:\s*"(https?:[^"]+\.m3u8[^"]*)"/);
        if (m3u8Match) return [{ url: m3u8Match[1], quality: '1080p', label: 'StreamWish' }];
    } catch (e) {}
    return [];
}

// ── Extractor StreamH ──────────────────────────────────────────────────────
async function extractStreamh(url) {
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': url },
            timeout: 10000
        });
        const html = res.data;
        const m3u8Match = html.match(/file:\s*["'](https?:[^"']+\.m3u8[^"']*)/);
        if (m3u8Match) return [{ url: m3u8Match[1], quality: '1080p', label: 'StreamH' }];
        const mp4Match = html.match(/file:\s*["'](https?:[^"']+\.mp4[^"']*)/);
        if (mp4Match) return [{ url: mp4Match[1], quality: '720p', label: 'StreamH' }];
    } catch (e) {}
    return [];
}

// ── Extractor VidHide ──────────────────────────────────────────────────────
async function extractVidhide(url) {
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': url },
            timeout: 10000
        });
        const html = res.data;
        const m3u8Match = html.match(/file:\s*"(https?:[^"]+\.m3u8[^"]*)"/);
        if (m3u8Match) return [{ url: m3u8Match[1], quality: '1080p', label: 'VidHide' }];
    } catch (e) {}
    return [];
}

// ── Extractor DoodStream ───────────────────────────────────────────────────
async function extractDoodstream(url) {
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://dood.re/' },
            timeout: 10000
        });
        const html = res.data;
        const passMatch = html.match(/\/pass_md5\/[^'""]*/);
        if (!passMatch) return [];
        const passUrl = 'https://dood.re' + passMatch[0];
        const passRes = await axios.get(passUrl, {
            headers: { 'Referer': url },
            timeout: 10000
        });
        const token = html.match(/\?token=([^&'"]+)/);
        if (passRes.data && token) {
            const videoUrl = passRes.data + 'xYz123' + '?token=' + token[1] + '&expiry=' + Date.now();
            return [{ url: videoUrl, quality: '720p', label: 'DoodStream' }];
        }
    } catch (e) {}
    return [];
}

// ── Extractor GoodStream ───────────────────────────────────────────────────
async function extractGoodstream(url) {
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': url },
            timeout: 10000
        });
        const html = res.data;
        const m3u8Match = html.match(/file:\s*["'](https?:[^"']+\.m3u8[^"']*)/);
        if (m3u8Match) return [{ url: m3u8Match[1], quality: '1080p', label: 'GoodStream' }];
        const mp4Match = html.match(/file:\s*["'](https?:[^"']+\.mp4[^"']*)/);
        if (mp4Match) return [{ url: mp4Match[1], quality: '720p', label: 'GoodStream' }];
    } catch (e) {}
    return [];
}

// ── Extractor EarnVids ─────────────────────────────────────────────────────
async function extractEarnvids(url) {
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': url },
            timeout: 10000
        });
        const html = res.data;
        const m3u8Match = html.match(/file:\s*["'](https?:[^"']+\.m3u8[^"']*)/);
        if (m3u8Match) return [{ url: m3u8Match[1], quality: '1080p', label: 'EarnVids' }];
        const mp4Match = html.match(/["'](https?:[^"']+\.mp4[^"']*)/);
        if (mp4Match) return [{ url: mp4Match[1], quality: '720p', label: 'EarnVids' }];
    } catch (e) {}
    return [];
}

// ── Extractor Vimeo ────────────────────────────────────────────────────────
async function extractVimeo(url) {
    try {
        const videoId = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
        if (!videoId) return [];
        const apiUrl = `https://player.vimeo.com/video/${videoId}/config`;
        const res = await axios.get(apiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://vimeo.com/' },
            timeout: 10000
        });
        const data = res.data;
        if (data?.request?.files?.hls?.cdns) {
            const cdns = data.request.files.hls.cdns;
            const defaultCdn = data.request.files.hls.default_cdn;
            const m3u8 = cdns[defaultCdn]?.url;
            if (m3u8) return [{ url: m3u8, quality: '1080p', label: 'Vimeo' }];
        }
    } catch (e) {}
    return [];
}

// ── Extractor LaCloud ──────────────────────────────────────────────────────
async function extractLacloud(url) {
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': url },
            timeout: 10000
        });
        const html = res.data;
        const m3u8Match = html.match(/file:\s*["'](https?:[^"']+\.m3u8[^"']*)/);
        if (m3u8Match) return [{ url: m3u8Match[1], quality: '1080p', label: 'LaCloud' }];
        const mp4Match = html.match(/["'](https?:[^"']+\.mp4[^"']*)/);
        if (mp4Match) return [{ url: mp4Match[1], quality: '720p', label: 'LaCloud' }];
    } catch (e) {}
    return [];
}

// ── Extractor OkRu ────────────────────────────────────────────────────────
async function extractOkru(url) {
    try {
        const videoId = url.match(/video\/(\d+)/)?.[1];
        if (!videoId) return [];
        const res = await axios.get(`https://ok.ru/videoembed/${videoId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://ok.ru/' },
            timeout: 10000
        });
        const html = res.data;
        const dataMatch = html.match(/data-options="([^"]+)"/);
        if (dataMatch) {
            const data = JSON.parse(dataMatch[1].replace(/&quot;/g, '"'));
            const flashVars = data.flashvars || data;
            if (flashVars.hlsManifestUrl)
                return [{ url: flashVars.hlsManifestUrl, quality: '720p', label: 'OkRu' }];
        }
    } catch (e) {}
    return [];
}

// ── Extractor Fastream ─────────────────────────────────────────────────────
async function extractFastream(url) {
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': url },
            timeout: 10000
        });
        const html = res.data;
        const m3u8Match = html.match(/file:\s*"(https?:[^"]+\.m3u8[^"]*)"/);
        if (m3u8Match) return [{ url: m3u8Match[1], quality: '1080p', label: 'Fastream' }];
        const mp4Match = html.match(/file:\s*"(https?:[^"]+\.mp4[^"]*)"/);
        if (mp4Match) return [{ url: mp4Match[1], quality: '720p', label: 'Fastream' }];
    } catch (e) {}
    return [];
}

// ── Generic fallback ───────────────────────────────────────────────────────
async function extractGeneric(url) {
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': url },
            timeout: 10000
        });
        const html = res.data;
        const m3u8 = html.match(/["'](https?:[^"']+\.m3u8[^"']*)['"]/);
        if (m3u8) return [{ url: m3u8[1], quality: '1080p', label: 'Stream' }];
        const mp4 = html.match(/["'](https?:[^"']+\.mp4[^"']*)['"]/);
        if (mp4) return [{ url: mp4[1], quality: '720p', label: 'Stream' }];
    } catch (e) {}
    return [];
}

// ── Router ─────────────────────────────────────────────────────────────────
async function extractStreams(embedUrl) {
    const url = embedUrl.toLowerCase();
    try {
        if (url.includes('voe.sx') || url.includes('voe.la') || url.includes('voe.'))
            return await extractVoe(embedUrl);
        if (url.includes('filemoon') || url.includes('moonplayer'))
            return await extractFilemoon(embedUrl);
        if (url.includes('streamwish') || url.includes('swish') || url.includes('wishfast'))
            return await extractStreamwish(embedUrl);
        if (url.includes('streamh') || url.includes('stre.am'))
            return await extractStreamh(embedUrl);
        if (url.includes('vidhide') || url.includes('vid.icu'))
            return await extractVidhide(embedUrl);
        if (url.includes('dood') || url.includes('d0000d'))
            return await extractDoodstream(embedUrl);
        if (url.includes('goodstream') || url.includes('good.stream'))
            return await extractGoodstream(embedUrl);
        if (url.includes('earnvids') || url.includes('earnvid'))
            return await extractEarnvids(embedUrl);
        if (url.includes('vimeo.com') || url.includes('player.vimeo'))
            return await extractVimeo(embedUrl);
        if (url.includes('lacloud') || url.includes('la.cloud'))
            return await extractLacloud(embedUrl);
        if (url.includes('ok.ru') || url.includes('odnoklassniki'))
            return await extractOkru(embedUrl);
        if (url.includes('fastream'))
            return await extractFastream(embedUrl);
        return await extractGeneric(embedUrl);
    } catch (e) {
        return [];
    }
}

module.exports = { extractStreams };
