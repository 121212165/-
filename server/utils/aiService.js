import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

export class AIService {
    // 文本分析服务
    static async analyzeText(text) {
        const systemPrompt = `
你是一个专业的美妆文案审查助手。请分析以下美妆相关文本，检测以下问题：

1. 错别字和语法错误
2. 违禁词和合规风险（如虚假宣传、夸大功效等）
3. 用词优化建议
4. 文案改进建议

请以JSON格式返回分析结果：
{
    "errors": [{"type": "typo/forbidden", "text": "问题文本", "suggestion": "建议", "reason": "原因"}],
    "suggestions": [{"original": "原文", "improved": "改进版", "reason": "改进原因"}],
    "compliance": {"score": 85, "issues": ["问题列表"]},
    "resources": ["相关资料推荐"]
}
        `;

        try {
            const completion = await openai.chat.completions.create({
                model: "qwen-plus",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `请分析这段美妆文案：\n\n${text}` }
                ],
                temperature: 0.7
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('AI分析失败:', error);
            throw new Error('AI分析服务暂时不可用');
        }
    }

    // 图文分析服务
    static async analyzeImageAndText(imageUrl, text) {
        const systemPrompt = `
你是一个专业的美妆图文内容审查助手。请分析图片和文字内容，检测：
1. 图文是否一致
2. 图片中是否有违规内容
3. 文字描述是否准确
4. 整体合规性评估

请以JSON格式返回结果。
        `;

        try {
            const response = await openai.chat.completions.create({
                model: "qwen-vl-max",
                messages: [{
                    role: "user",
                    content: [
                        { type: "text", text: systemPrompt + `\n\n文字描述：${text}` },
                        { type: "image_url", image_url: { url: imageUrl } }
                    ]
                }]
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('图文分析失败:', error);
            throw new Error('图文分析服务暂时不可用');
        }
    }
}