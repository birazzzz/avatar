import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { imageUrl, style, prompt } = await request.json();

        if (!imageUrl || !style || !prompt) {
            return json({ error: 'Missing required fields: imageUrl, style, or prompt' }, { status: 400 });
        }

        if (!env.GEMINI_API_KEY) {
            // Mock response for development flow
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
            return json({
                avatarUrl: `https://placehold.co/1024x1024/png?text=AI+Avatar+(${style})`,
                style
            });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

        // Use gemini-2.0-flash-exp for image generation
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                // @ts-ignore - responseModalities is valid for image generation
                responseModalities: ['Text', 'Image']
            }
        });

        // Fetch the source image and convert to base64
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

        // Create the prompt for avatar generation
        const avatarPrompt = `You are an expert digital artist. ${prompt}

IMPORTANT INSTRUCTIONS:
- Generate a single high-quality avatar image based on the reference photo provided
- The avatar should capture the essence and key features of the person in the reference
- Make it visually stunning and suitable for use as a profile picture
- Output ONLY the generated avatar image, no text`;

        // Generate with image input
        const result = await model.generateContent([
            avatarPrompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                }
            }
        ]);

        const response = result.response;

        // Check if we got an image in the response
        const parts = response.candidates?.[0]?.content?.parts || [];

        for (const part of parts) {
            // @ts-ignore - inlineData exists on image responses
            if (part.inlineData) {
                // @ts-ignore
                const imageData = part.inlineData.data;
                // @ts-ignore
                const imageMimeType = part.inlineData.mimeType || 'image/png';

                // Return the image as a data URL
                const avatarUrl = `data:${imageMimeType};base64,${imageData}`;
                return json({ avatarUrl, style });
            }
        }

        // If no image was generated, check for text response (error or description)
        const textPart = parts.find((p: any) => p.text);
        if (textPart) {
            return json({
                error: 'Image generation not available. The model returned text instead of an image. Please try a different style or image.'
            }, { status: 422 });
        }

        return json({ error: 'No image was generated. Please try again.' }, { status: 500 });

    } catch (error) {
        console.error('Avatar generation error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        // Handle specific errors
        if (errorMessage.includes('API key')) {
            return json({ error: 'Invalid API key. Please check your Gemini API configuration.' }, { status: 401 });
        }

        if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
            return json({ error: 'API rate limit exceeded. Please try again in a few moments.' }, { status: 429 });
        }

        if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
            return json({ error: 'The image could not be processed due to safety filters. Please try a different photo.' }, { status: 400 });
        }

        return json({ error: `Failed to generate avatar: ${errorMessage}` }, { status: 500 });
    }
};
