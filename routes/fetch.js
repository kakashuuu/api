import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Fetch URL Content Endpoint' });
});

export default router;
