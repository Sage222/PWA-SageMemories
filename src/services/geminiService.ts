/**
 * Service deactivated. 
 * AI Caption functionality has been removed to eliminate API Key dependency.
 */

export const generateImageCaption = async (
  _imageBase64: string | undefined,
  _imageUrl: string | undefined
): Promise<string | null> => {
  return null;
};