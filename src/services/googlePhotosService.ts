import { GoogleAlbum, GoogleMediaItem, Photo, Album } from '../types';

const SCOPE = 'https://www.googleapis.com/auth/photoslibrary.readonly';

export const getAuthUrl = (clientId: string): string => {
  // The redirect URI must match exactly what is in the browser
  // We strip the hash (#) if present, but keep the path (e.g. /local/smart-memories/index.html)
  const redirectUri = window.location.href.split('#')[0];
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: SCOPE,
    include_granted_scopes: 'true',
    state: 'pass-through-value'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const fetchAlbums = async (accessToken: string): Promise<Album[]> => {
  try {
    const response = await fetch('https://photoslibrary.googleapis.com/v1/albums?pageSize=50', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch albums');

    const data = await response.json();
    const googleAlbums: GoogleAlbum[] = data.albums || [];

    return googleAlbums.map(gAlbum => ({
      id: gAlbum.id,
      title: gAlbum.title || 'Untitled Album',
      coverUrl: `${gAlbum.coverPhotoBaseUrl}=w500-h500-c`, // Request cropped square cover
      photoCount: parseInt(gAlbum.mediaItemsCount || '0'),
      photos: [] // Photos are fetched on demand
    }));
  } catch (error) {
    console.error("Error fetching albums", error);
    return [];
  }
};

export const fetchPhotosForAlbum = async (accessToken: string, albumId: string): Promise<Photo[]> => {
  try {
    // We use search to get media items from a specific album
    const response = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        albumId: albumId,
        pageSize: 100, // Limit to 100 for slideshow
        filters: {
          mediaTypeFilter: {
            mediaTypes: ['PHOTO']
          }
        }
      })
    });

    if (!response.ok) throw new Error('Failed to fetch photos');

    const data = await response.json();
    const items: GoogleMediaItem[] = data.mediaItems || [];

    return items.map(item => ({
      id: item.id,
      // =w1920-h1080 flag requests high res optimized for screens
      url: `${item.baseUrl}=w1920-h1080`, 
      description: ''
    }));
  } catch (error) {
    console.error("Error fetching photos", error);
    return [];
  }
};
