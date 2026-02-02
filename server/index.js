import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { buildOnePagerPrompt } from "./onePagerPrompt.js";
import { VMFS_SCORER_PROMPT, VERIFICATION_ARCHITECT_PROMPT } from "./vmfsPrompts.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const groq = new Groq({
    apiKey: process.env.GROQ_AI_API_KEY,
});

const MODEL_NAME = "moonshotai/kimi-k2-instruct-0905";

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: '2.0', features: ['vmfs-scorer', 'verification-architect', 'one-pager'] });
});

// Generate one-pager from treaty text
app.post('/api/generate-one-pager', async (req, res) => {
    try {
        const { treatyText, treatyName } = req.body;
        
        if (!treatyText || treatyText.trim().length < 50) {
            return res.status(400).json({ error: 'Treaty text is too short or missing' });
        }

        const prompt = buildOnePagerPrompt(treatyText, treatyName);
        
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: MODEL_NAME,
        });
        
        const onePagerContent = completion.choices[0]?.message?.content || "";

        res.json({ 
            success: true, 
            onePager: onePagerContent,
            treatyName: treatyName || 'Treaty Analysis'
        });
    } catch (error) {
        console.error('One-pager generation error:', error);
        res.status(500).json({ error: 'Failed to generate one-pager: ' + error.message });
    }
});

// Score a new mechanism using VMFS Scorer
app.post('/api/score-mechanism', async (req, res) => {
    try {
        const { mechanismDescription } = req.body;
        
        if (!mechanismDescription || mechanismDescription.trim().length < 20) {
            return res.status(400).json({ error: 'Mechanism description is too short' });
        }

        const prompt = `${VMFS_SCORER_PROMPT}

INPUT MECHANISM TO SCORE:
"${mechanismDescription}"

Analyze this mechanism and output the JSON scores.`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: MODEL_NAME,
        });
        
        const textResponse = completion.choices[0]?.message?.content || "";

        // Parse JSON response
        const cleanJson = textResponse
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .replace(/^[^{]*/, '')
            .replace(/[^}]*$/, '')
            .trim();

        const scores = JSON.parse(cleanJson);

        res.json({ 
            success: true, 
            scores
        });
    } catch (error) {
        console.error('Mechanism scoring error:', error);
        res.status(500).json({ error: 'Failed to score mechanism: ' + error.message });
    }
});

// Chat with Verification Architect
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;
        
        if (!message || message.trim().length < 1) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const historyMessages = conversationHistory?.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
        })) || [];

        const messages = [
            {
                role: "system",
                content: VERIFICATION_ARCHITECT_PROMPT
            },
            ...historyMessages,
            {
                role: "user",
                content: message
            }
        ];

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: MODEL_NAME,
        });

        const responseText = completion.choices[0]?.message?.content || "";

        res.json({ 
            success: true, 
            response: responseText
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat: ' + error.message });
    }
});

// Analyze treaty document
app.post('/api/analyze-treaty', async (req, res) => {
    try {
        const { treatyText } = req.body;
        
        if (!treatyText || treatyText.trim().length < 50) {
            return res.status(400).json({ error: 'Treaty text is too short' });
        }

        const prompt = `You are a Verification Architect analyzing treaty requirements.

Analyze this policy/treaty document and extract verification requirements:

${treatyText.substring(0, 15000)}

Return ONLY valid JSON (no markdown, no backticks, no explanation) with this exact structure:
{
  "requirements": ["requirement 1", "requirement 2", "requirement 3"],
  "evidence_locations_needed": ["chip_hardware", "data_center", "institutional"],
  "verification_goals": ["goal description 1", "goal description 2"],
  "priorities": {
    "trust_importance": "high/medium/low",
    "cost_sensitivity": "high/medium/low",
    "privacy_concerns": "high/medium/low"
  },
  "constraints": ["constraint 1", "constraint 2"]
}

Focus on concrete, actionable verification needs related to AI systems.`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: MODEL_NAME,
        });
        
        const textResponse = completion.choices[0]?.message?.content || "";

        const cleanJson = textResponse
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .replace(/^[^{]*/, '')
            .replace(/[^}]*$/, '')
            .trim();

        const analysis = JSON.parse(cleanJson);

        res.json({ 
            success: true, 
            analysis
        });
    } catch (error) {
        console.error('Treaty analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze treaty: ' + error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`VMFS Server running on port ${PORT}`);
    console.log(`Features: VMFS Scorer, Verification Architect, One-Pager Generator`);
});
