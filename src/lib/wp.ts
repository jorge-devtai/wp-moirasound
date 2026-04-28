const domain = import.meta.env.WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`

export const getPageInfo = async (slug: string) => {
    try {
        const res = await fetch(`${apiUrl}/pages?slug=${slug}`);
        if (!res.ok) throw new Error(`No se pudo obtener la información de la página: ${res.status}`);
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error al obtener la información de la página:", error);
        throw error; // Relanza el error para manejarlo más adelante
    }
};