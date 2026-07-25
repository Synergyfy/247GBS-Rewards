import axios from 'axios';

export async function uploadToCloudinary(
  file: string,
  folder?: string
): Promise<string> {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign: Record<string, any> = { timestamp };
  if (folder) paramsToSign.folder = folder;

  const { data: { signature } } = await axios.post('/api/cloudinary/sign', {
    paramsToSign,
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  if (folder) formData.append('folder', folder);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Image upload failed');
  }

  const data = await response.json();
  return data.secure_url as string;
}
