import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

// Configure Cloudinary
function getCloudinary() {
    cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME || env.PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET
    });
    return cloudinary;
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { userImageUrl, gender, role } = await request.json();

        if (!userImageUrl || !gender || !role) {
            return json({ error: 'Missing required fields: userImageUrl, gender, or role' }, { status: 400 });
        }

        // Check for Gemini API key
        if (!env.GEMINI_API_KEY) {
            return json({
                error: 'Gemini API key not configured. Please add GEMINI_API_KEY to environment variables.'
            }, { status: 500 });
        }

        // Get the reference image path based on gender and role
        const genderPrefix = gender === 'male' ? 'm' : 'f';
        const referenceImagePath = `/${genderPrefix}-${role}.png`;

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-pro-latest',
            generationConfig: {
                // @ts-ignore - responseModalities is valid for image generation
                responseModalities: ['Text', 'Image']
            }
        });

        // Fetch the user's image and convert to base64
        const userImageResponse = await fetch(userImageUrl);
        const userImageBuffer = await userImageResponse.arrayBuffer();
        const userImageBase64 = Buffer.from(userImageBuffer).toString('base64');
        const userImageMimeType = userImageResponse.headers.get('content-type') || 'image/jpeg';

        // Fetch the reference image (role avatar) - need to construct full URL
        const baseUrl = request.url.split('/api')[0];
        const referenceImageUrl = `${baseUrl}${referenceImagePath}`;
        const refImageResponse = await fetch(referenceImageUrl);
        const refImageBuffer = await refImageResponse.arrayBuffer();
        const refImageBase64 = Buffer.from(refImageBuffer).toString('base64');
        const refImageMimeType = refImageResponse.headers.get('content-type') || 'image/png';

        // Create the face swap prompt
        const faceSwapPrompt = `You are an expert at face swapping and image editing.

I'm providing two images:
1. A reference avatar/character image (the ${role} role avatar)
2. A user's face photo

YOUR TASK:
- Take the face from the user's photo
- Seamlessly swap it onto the reference avatar/character image
- Maintain the body, pose, clothing, background and style of the reference avatar
- Only replace the face with the user's face
- The result should look natural and professionally edited
- Keep the same artistic style as the reference image

IMPORTANT:
- Output ONLY the final face-swapped image
- Do not add any text or watermarks
- Maintain high quality and resolution`;

        // Generate with both images
        const result = await model.generateContent([
            faceSwapPrompt,
            {
                inlineData: {
                    data: refImageBase64,
                    mimeType: refImageMimeType
                }
            },
            {
                inlineData: {
                    data: userImageBase64,
                    mimeType: userImageMimeType
                }
            }
        ]);

        const response = result.response;
        const parts = response.candidates?.[0]?.content?.parts || [];

        // Find the generated image
        for (const part of parts) {
            // @ts-ignore - inlineData exists on image responses
            if (part.inlineData) {
                // @ts-ignore
                const imageData = part.inlineData.data;
                // @ts-ignore
                const imageMimeType = part.inlineData.mimeType || 'image/png';

                const avatarDataUrl = `data:${imageMimeType};base64,${imageData}`;

                // Try to save to Cloudinary if configured
                let cloudinaryUrl = null;
                if (env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
                    try {
                        const cld = getCloudinary();
                        const uploadResult = await cld.uploader.upload(avatarDataUrl, {
                            folder: 'avatars',
                            resource_type: 'image',
                            public_id: `avatar_${Date.now()}_${role}`
                        });
                        cloudinaryUrl = uploadResult.secure_url;
                    } catch (uploadError) {
                        console.error('Cloudinary upload failed:', uploadError);
                        // Continue without Cloudinary - still return the generated image
                    }
                }

                return json({
                    avatarUrl: avatarDataUrl,
                    cloudinaryUrl: cloudinaryUrl,
                    role,
                    gender
                });
            }
        }

        // If no image was generated
        const textPart = parts.find((p: any) => p.text);
        if (textPart) {
            console.log('Gemini text response:', (textPart as any).text);
            return json({
                error: 'Image generation not available. The model returned text instead of an image. Please try again.'
            }, { status: 422 });
        }

        return json({ error: 'No image was generated. Please try again.' }, { status: 500 });

    } catch (error) {
        console.error('Avatar generation error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

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
