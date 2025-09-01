const domain = import.meta.env.PUBLIC_URL_WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`;

export const getArtistInfo = async ({ perPage =  3 }: {perPage?: number} = {}) => {
  const res = await fetch(`${apiUrl}/artista?per_page=${perPage}&_embed`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  const results = await res.json();
  //console.log(results)
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
  
export const getEventInfo = async ({ perPage = 3 }: { perPage?: number } = {}) => {
  const res = await fetch(`${apiUrl}/evento?per_page=${perPage}&_embed`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  const dataEvent = await res.json();
//  console.log('Data Información de Eventos:', dataEvent); // Log para verificar los datos recibidos

  if (!Array.isArray(dataEvent) || !dataEvent.length) throw new Error('No Events found');

  const events = dataEvent.map((event: any) => {
    const {
      title: { rendered: titleEvent },
      acf: { event_name: eventName, event_address: eventAddress, event_date: eventDate, event_time: eventTime },
      _embedded: {
        'acf:post': artistData,
        'wp:featuredmedia': featureMedia,
        'acf:term': termsEventData,
      }
    } = event;

    const artistName = artistData?.[0]?.artist_name || "Nombre del artista";
    const featuredImageEvent = featureMedia?.[0]?.source_url || "https://via.placeholder.com/150";
    const eventType = termsEventData?.[0]?.name || "Tipo de evento";

    return { titleEvent, eventName, eventAddress, eventDate, eventTime, artistName, featuredImageEvent, eventType };
  });

  return events;
};

export const getPostsInfo = async ({perPage = 3}: { perPage?: number } = {}) => {
  const res = await fetch(`${apiUrl}/posts?per_page=${perPage}&_embed`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  const dataPosts = await res.json();

//  console.log("Información de Posts:", dataPosts)

  const posts = dataPosts.map((post: any) => {
    const {
      title: { rendered: titlePost },
      content: { rendered: contentPost },
      excerpt: { rendered: excerptPost },
      date_gmt: datePost,
      _embedded: {
        'wp:featuredmedia': featureMedia,
        'wp:term': [termPostData],
      }
    } = post;

    const featuredImagePost = featureMedia?.[0]?.source_url || "Imagen de Post";
    const postType = termPostData?.[0]?.name || "Tipo de post";

    return { titlePost, contentPost, excerptPost, datePost, featuredImagePost, postType, }
  })
//  console.log("esto es el post especifico:", posts)
  return posts; 
  
}

export const getBentoImages = async (slug: string): Promise<string[]> => {
  // 1. Obtener el post de tipo gallery por slug
  const res = await fetch(`${apiUrl}/gallery?slug=${slug}`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  const [gallery] = await res.json();
  if (!gallery) throw new Error("Gallery not found");

  // 2. Extraer los IDs de las imágenes del campo ACF
  const ids = Object.values<number>(gallery.acf).filter(Boolean);

  // 3. Obtener los datos de cada imagen (batch)
  const mediaRes = await fetch(
    `${apiUrl}/media?include=${ids.join(",")}&per_page=100`
  );
  if (!mediaRes.ok) throw new Error(`Media fetch failed: ${mediaRes.status}`);

  const media = await mediaRes.json();
//  console.log("Esto son las imagenes de gallery",media)

  // 4. Extraer solo las URLs (tamaño "full")
  return media.map((m: any) => m.source_url);
};


export const allPagesSlug = async (slug: any) => {
  const res = await fetch (`${apiUrl}/pages?per_page=100`)

  if (!res.ok ) throw new Error(`HTTP error! Status: ${res.status}`)

    const results = await res.json()
    if (!results.length ) throw new Error("No pages found")

    const slugs = results.map((page: any) => page.slug)
    console.log("Estos son los slugs de las páginas:", slugs)
    return slugs
}

export const getNavMenu = async () => {

  const user = import.meta.env.PUBLIC_WP_USER;
  const pass = import.meta.env.PUBLIC_WP_PASS;

  if (!user || !pass) {
    throw new Error('WP_USERNAME y WP_PASSWORD deben estar configurados');
  }

   const token = btoa(`${user}:${pass}`);
  
  const res = await fetch(`${apiUrl}/menu-items?_fields=title,url`, {
    headers: {
       Authorization: `Basic ${token}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  const menu = await res.json();
  if (!menu.length) throw new Error("No menu items found");

  // console.log("Datos crudos del menú:", menu );

  const menuItems = menu.map((item: any) => {
    const { title: { rendered: title }, url } = item;
    return { title, url };
  });
  
  //console.log("Estos son los items del menú:", menuItems);
  return menuItems;
}