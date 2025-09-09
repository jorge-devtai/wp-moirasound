import type { ArtistProps } from '@libs/types/apiTypes';
import { endpoints } from "./apiConfing";

export async function getAllSlugArtists(): Promise<ArtistProps[]> {
    try {
        const response = await fetch(`${endpoints.artists}?per_page=100&_fields=id,slug,title`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("No artists found.");

        const artistsSlug = data.map((artist) => artist.slug)

        console.log("Estos son los slugs de los artistas:", artistsSlug);
        return artistsSlug;

    } catch (error) {
        console.error("Error fetching artists:", error);
        throw error;
    }
}

export async function getArtistInfo({ perPage = 100}: { perPage?: number } = {}): Promise<ArtistProps[]> {
    try {
        const response = await fetch( `${endpoints.artists}?per_page=${perPage}&_embed=wp:featuredmedia,wp:term,acf:term&_fields=id,slug,title,excerpt,acf,_links`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("No artists found.");

        const artistsInfo = data.map((artist) => {
            const {
                id: artistId,
                slug: artistSlug,
                title: { rendered: artistTitle },
                excerpt: { rendered: artitsExcerpt },
                acf: { 
                    artist_name: artistName, 
                    artist_biography: artistBiography,

                } = {},
                _embedded: {
                    'wp:featuredmedia': featureMedia = [],
                    'acf:term': acfTerm = [],
                    'wp:term': wpTerm = []
                } = {}

            } = artist;

            const featuredImage = featureMedia?.[0]?.source_url ?? '';

            const country = wpTerm?.find((term: any) => term[0]?.taxonomy === 'pais')?.[0]?.name || '';
            
            const genres = acfTerm
                ?.filter((term: any) => term.taxonomy === "musical_style")
                ?.map((t: any) => t.name) || [];

            return {
                artistId,
                artistSlug,
                artistTitle,
                artitsExcerpt,
                artistAcf: {
                 artistName,
                 artistBiography,
                },
                featuredImage,
                country,
                genres,            
            }
        })

        console.log("Estos son los datos de los artistas:", artistsInfo);
        return artistsInfo;

    } catch (error) {
        console.error("Error fetching artists info:", error);
        throw error;
    }
}