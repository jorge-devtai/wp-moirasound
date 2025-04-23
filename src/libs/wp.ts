const domain = import.meta.env.URL_WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`;

export const getPageInfo = async (slug: string) => {
    const res = await fetch(`${apiUrl}/pages?slug=${slug}&_embed`);
    if (!res.ok) throw new Error('Failed to fetch data')

    const [data] = await res.json();
}