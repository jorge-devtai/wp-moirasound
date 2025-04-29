const domain = import.meta.env.URL_WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`;

export const getArtistInfo = async ({ perPage =  10 }: {perPage?: number}) => {
  const res = await fetch(`${apiUrl}/artista?slug=${perPage}&_embed`);
  if (!res.ok) throw new Error('Failed to fetch data');

  const results = await res.json();
  if (!results.length) throw new Error('No Artists found')
    
    const artists = results.map((artist: any) => {
      const { title: {redered: title }} = artists
      return { title }
    })

    return results
}
  