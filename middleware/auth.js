const authMiddleware = (req, res, next) => {
    const apikey = req.query.apikey;
    if (!apikey || apikey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Invalid API key' });
    }
    next();
};

export default authMiddleware;
