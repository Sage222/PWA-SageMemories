export interface Photo {
  id: string;
  url: string;
  base64?: string; // Used for local uploads
  description?: string;
}

export interface Album {
  id: string;
  title: string;
  coverUrl: string;
  photoCount: number;
  photos: Photo[];
}

export enum AppState {
  AUTH = 'AUTH',
  ALBUMS = 'ALBUMS',
  SETTINGS = 'SETTINGS',
  SLIDESHOW = 'SLIDESHOW',
}

export interface SlideshowSettings {
  duration: number; // in seconds
  transitionEffect: 'fade' | 'slide';
}

// Google API Types
export interface GoogleAlbum {
  id: string;
  title: string;
  mediaItemsCount: string;
  coverPhotoBaseUrl: string;
}

export interface GoogleMediaItem {
  id: string;
  baseUrl: string;
  filename: string;
  mimeType: string;
}
