const domain = import.meta.env.URL_WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`;

export const getArtistInfo = async ({ perPage =  3 }: {perPage?: number} = {}) => {
  const res = await fetch(`${apiUrl}/artista?per_page=${perPage}&_embed`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  console.log(res)

  const results = await res.json();
  console.log(results)
  if (!Array.isArray(results) || !results.length) throw new Error('No Artists found')
    
    const artists = results.map((artist: any) => {
      const { 
        title: {rendered: artistTitle }, 
        acf: {artist_name: artistName, artist_biography: artistDescription},
        _embedded: { 
          'wp:featuredmedia': featuredMedia, 
          'acf:term': terms, 
          'wp:term': termCountry 
        }
      } = artist;
       
      const styleName = terms?.[0]?.name || "Estilo Músical";
      const country = termCountry?.[2]?.[0]?.name || "País";
      const featuredImage = featuredMedia?.[0]?.source_url || "https://assets.codepen.io/2585/fiddle-leaf.jpeg";

      return { artistName, artistTitle,  artistDescription, featuredImage, styleName, country, }
    })

    return artists
}
  