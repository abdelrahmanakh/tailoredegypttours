import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Import cookies

export async function POST(request) {
  const body = await request.json();
  const cookieStore = await cookies();
  
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // --- SECURITY CHECK START ---
        // We check if the 'admin_session' cookie exists. 
        // If not, we block the upload.
        const adminSession = cookieStore.get('admin_session');
        if (!adminSession) {
            throw new Error('Unauthorized: You must be logged in');
        }
        // --- SECURITY CHECK END ---

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          tokenPayload: JSON.stringify({
            // optional payload
          }),
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob uploaded', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error).message },
      { status: 400 },
    );
  }
}