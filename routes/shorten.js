import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Shorten URL Endpoint' });
});

export default router;
