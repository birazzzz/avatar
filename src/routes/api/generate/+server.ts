import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// This endpoint is no longer used for AI generation
// The app now displays pre-made role images based on gender and role selection
export const POST: RequestHandler = async ({ request }) => {
    try {
        const { imageUrl, role, gender } = await request.json();

        if (!imageUrl || !role || !gender) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Return the appropriate role image path
        const genderPrefix = gender === 'male' ? 'm' : 'f';
        const avatarUrl = `/${genderPrefix}-${role}.png`;

        return json({ avatarUrl, role });
    } catch (error) {
        console.error('Error:', error);
        return json({ error: 'An error occurred' }, { status: 500 });
    }
};
