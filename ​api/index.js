const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { type, id, season, episode } = req.query;

    if (!type || !id) {
        return res.status(400).json({ error: 'Paramètres "type" et "id" requis.' });
    }

    try {
        let targetUrl = '';
        if (type === 'movie') {
            targetUrl = `https://vidsrc.cc/v2/embed/movie/${id}`;
        } else if (type === 'tv') {
            targetUrl = `https://vidsrc.cc/v2/embed/tv/${id}/${season || 1}/${episode || 1}`;
        } else {
            return res.status(400).json({ error: 'Type invalide.' });
        }

        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://vidsrc.cc/'
            }
        });

        res.status(200).json({
            success: true,
            embedUrl: targetUrl,
            data: response.data
        });

    } catch (error) {
        res.status(500).json({
            error: 'Impossible de récupérer le flux vidéo.',
            details: error.message
        });
    }
};
