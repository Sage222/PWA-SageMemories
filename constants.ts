import { Album } from './types';

export const MOCK_ALBUMS: Album[] = [
  {
    id: 'album-1',
    title: 'Summer Vacation',
    coverUrl: 'https://picsum.photos/id/10/400/400',
    photoCount: 5,
    photos: [
      { id: 'p1', url: 'https://picsum.photos/id/10/800/1200' },
      { id: 'p2', url: 'https://picsum.photos/id/11/800/1200' },
      { id: 'p3', url: 'https://picsum.photos/id/12/800/1200' },
      { id: 'p4', url: 'https://picsum.photos/id/13/800/1200' },
      { id: 'p5', url: 'https://picsum.photos/id/14/800/1200' },
    ],
  },
  {
    id: 'album-2',
    title: 'Mountain Hiking',
    coverUrl: 'https://picsum.photos/id/28/400/400',
    photoCount: 4,
    photos: [
      { id: 'p6', url: 'https://picsum.photos/id/28/800/1200' },
      { id: 'p7', url: 'https://picsum.photos/id/29/800/1200' },
      { id: 'p8', url: 'https://picsum.photos/id/30/800/1200' },
      { id: 'p9', url: 'https://picsum.photos/id/31/800/1200' },
    ],
  },
  {
    id: 'album-3',
    title: 'City Lights',
    coverUrl: 'https://picsum.photos/id/42/400/400',
    photoCount: 6,
    photos: [
      { id: 'p10', url: 'https://picsum.photos/id/42/800/1200' },
      { id: 'p11', url: 'https://picsum.photos/id/43/800/1200' },
      { id: 'p12', url: 'https://picsum.photos/id/44/800/1200' },
      { id: 'p13', url: 'https://picsum.photos/id/45/800/1200' },
      { id: 'p14', url: 'https://picsum.photos/id/46/800/1200' },
      { id: 'p15', url: 'https://picsum.photos/id/47/800/1200' },
    ],
  },
  {
    id: 'album-4',
    title: 'Pet Memories',
    coverUrl: 'https://picsum.photos/id/237/400/400',
    photoCount: 4,
    photos: [
      { id: 'p16', url: 'https://picsum.photos/id/237/800/1200' },
      { id: 'p17', url: 'https://picsum.photos/id/169/800/1200' },
      { id: 'p18', url: 'https://picsum.photos/id/200/800/1200' },
      { id: 'p19', url: 'https://picsum.photos/id/219/800/1200' },
    ],
  },
];

export const DEFAULT_SETTINGS = {
  duration: 5,
  transitionEffect: 'fade' as const,
};