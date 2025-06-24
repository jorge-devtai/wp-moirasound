const domain = import.meta.env.URL_WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`;

export const getArtistInfo = async ({ perPage =  3 }: {perPage?: number} = {}) => {
  const res = await fetch(`${apiUrl}/artista?per_page=${perPage}`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  console.log(res)

  const results = await res.json();
  console.log(results)
  if (!Array.isArray(results) || !results.length) throw new Error('No Artists found')
    
    const artists = results.map((artist: any) => {
      const { title: {rendered: artistName } } = artist;
      
      return { artistName }
    })

    return artists
}
  