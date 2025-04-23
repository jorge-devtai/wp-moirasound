const domain = import.meta.env.URL_WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`;

export const getPageInfo = async (slug: string) => {
  const res = await fetch(`${apiUrl}/pages?slug=${slug}&_embed`);
  if (!res.ok) throw new Error('Failed to fetch data');

  const [data] = await res.json();

  // Desestructuración de los datos principales
  const {
    acf: {
      mission_section: {
        section_title: missionSectionTitle = '',
        description: missionDescription = '',
        button_cta: missionButtonCta = '',
        mission_image: missionImageId = null
      } = {},
      featured_artists_section: {
        section_title: artistsSectionTitle = '',
        button_cta: artistsButtonCta = '',
        featured_artists: featuredArtistsIds = []
      } = {}
    } = {},
    title: { rendered: title } = { rendered: '' },
    content: { rendered: content } = { rendered: '' },
    _embedded: {
      'wp:featuredmedia': featuredMedia = [],
      author: [authorData = {}] = []
    } = {}
  } = data;

  // Obtener la URL de la imagen destacada desde _embedded
  let featuredImageUrl = '';
  if (Array.isArray(featuredMedia) && featuredMedia.length > 0) {
    featuredImageUrl = featuredMedia[0]?.source_url || '';
  }

  // Función para obtener la URL de una imagen por su ID
  const getImageUrlById = async (imageId: number | null): Promise<string> => {
    if (!imageId) return '';
    try {
      const mediaRes = await fetch(`${apiUrl}/media/${imageId}`);
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        return mediaData.source_url || '';
      }
    } catch (error) {
      console.error(`Error fetching media for image ID ${imageId}:`, error);
    }
    return '';
  };

  // Obtener la URL de la imagen de la misión
  const missionImageUrl = await getImageUrlById(missionImageId);

  // Obtener información de los artistas destacados
  const featuredArtists = await Promise.all(
    featuredArtistsIds.map(async (artistId: number) => {
      const artistRes = await fetch(`${apiUrl}/artista/${artistId}`);
      if (artistRes.ok) {
        const artistData = await artistRes.json();
        return {
          id: artistData.id,
          name: artistData.name,
          url: artistData.url,
          avatar: artistData.avatar_urls?.['96'] || ''
        };
      }
      return null;
    })
  );

  return {
    title,
    content,
    featuredImage: featuredImageUrl, // Imagen destacada
    mission: {
      title: missionSectionTitle,
      description: missionDescription,
      buttonCta: missionButtonCta,
      imageUrl: missionImageUrl
    },
    featuredArtistsSection: {
      title: artistsSectionTitle,
      buttonCta: artistsButtonCta,
      artists: featuredArtists.filter(Boolean) // Filtrar artistas válidos
    },
    authorName: authorData.name || 'Anónimo'
  };
};