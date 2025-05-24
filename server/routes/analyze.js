import express from 'express';
import multer from 'multer';
import { AIService } from '../utils/aiService.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 文本分析API
router.post('/analyze-text', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: '请提供要分析的文本' });
        }

        const result = await AIService.analyzeText(text);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('文本分析错误:', error);
        res.status(500).json({ error: error.message });
    }
});

// 图文分析API
router.post('/analyze-image-text', upload.single('image'), async (req, res) => {
    try {
        const { text } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ error: '请上传图片' });
        }

        // 将图片转换为base64
        const imageBase64 = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;
        
        const result = await AIService.analyzeImageAndText(imageBase64, text || '');
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('图文分析错误:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;