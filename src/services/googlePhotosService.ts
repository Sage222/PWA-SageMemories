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
    prompt: 'consent', // Forces account selection/consent every time
    state: 'pass-through-value'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const fetchAlbums = async (accessToken: string): Promise<Album[]> => {
  try {
    // 1. Fetch Real Albums
    // We construct the array manually so we can insert "Recent Photos" even if the API call for albums fails/returns empty
    const albums: Album[] = [];

    // A. Fetch "Recent Photos" (Main Stream) Cover
    // We try to get 1 item to see if access works and to get a cover image
    let recentCover = 'https://placehold.co/500x500/1a1a1a/ffffff?text=Recent';
    try {
        const recentRes = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=1', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        if (recentRes.status === 403) {
            throw new Error("API_DISABLED");
        }

        if (recentRes.ok) {
            const recentData = await recentRes.json();
            if (recentData.mediaItems && recentData.mediaItems.length > 0) {
                recentCover = `${recentData.mediaItems[0].baseUrl}=w500-h500-c`;
            }
        }
    } catch (e: any) {
        if (e.message === "API_DISABLED") throw e;
        console.warn("Could not fetch recent cover:", e);
    }

    // Add "Recent Photos" as the first album
    albums.push({
        id: 'RECENT_PHOTOS',
        title: 'Recent Photos',
        coverUrl: recentCover,
        photoCount: 0, // Unknown count for stream
        photos: []
    });

    // B. Fetch User Created Albums
    const response = await fetch('https://photoslibrary.googleapis.com/v1/albums?pageSize=50', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
        const data = await response.json();
        const googleAlbums: GoogleAlbum[] = data.albums || [];

        const mappedAlbums = googleAlbums.map(gAlbum => ({
            id: gAlbum.id,
            title: gAlbum.title || 'Untitled Album',
            coverUrl: `${gAlbum.coverPhotoBaseUrl}=w500-h500-c`, 
            photoCount: parseInt(gAlbum.mediaItemsCount || '0'),
            photos: []
        }));
        
        albums.push(...mappedAlbums);
    }

    return albums;
  } catch (error: any) {
    console.error("Error fetching albums", error);
    // Propagate specific errors so UI can show them
    if (error.message === "API_DISABLED") {
        throw new Error("Please enable the 'Google Photos Library API' in your Google Cloud Console.");
    }
    throw new Error("Failed to connect to Google Photos.");
  }
};

export const fetchPhotosForAlbum = async (accessToken: string, albumId: string): Promise<Photo[]> => {
  try {
    let url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';
    let method = 'POST';
    let body: any = {
        albumId: albumId,
        pageSize: 100, // Limit to 100 for slideshow
        filters: {
          mediaTypeFilter: {
            mediaTypes: ['PHOTO']
          }
        }
    };

    // Special handling for the Virtual "Recent Photos" album
    if (albumId === 'RECENT_PHOTOS') {
        url = 'https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=100';
        method = 'GET';
        body = undefined; // GET requests cannot have body
    }

    const options: RequestInit = {
        method,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
        options.headers = {
            ...options.headers,
            'Content-Type': 'application/json'
        };
    }

    const response = await fetch(url, options);

    if (!response.ok) throw new Error('Failed to fetch photos');

    const data = await response.json();
    const items: GoogleMediaItem[] = data.mediaItems || [];

    return items
        .filter(item => item.mimeType && item.mimeType.startsWith('image/')) // Client-side filter for GET requests
        .map(item => ({
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