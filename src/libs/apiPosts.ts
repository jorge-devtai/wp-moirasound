import type { newsProps } from '@libs/types/apiTypes';
import { endpoints } from "./apiConfing";

export async function getAllSlugNews(): Promise<newsProps[]> {
    try {
        const response = await fetch(`${endpoints.news}?per_page=100&_fields=id,slug`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("No news found.");

        const newsSlug = data.map((news) => news.slug)

        return newsSlug;

    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    }
}


export async function getNewsInfo( { perPage = 100}: { perPage?: number } = {}): Promise<newsProps[]> { 
    try {
        const response = await fetch( `${endpoints.news}?per_page=${perPage}&_embed=wp:featuredmedia,wp:term&_fields=id,slug,title,content,excerpt,acf,_links`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("No news found.");
        const newsInfo = data.map((news) => {
            const {
                id: newsId,
                slug: newsSlug,
                title: { rendered: newsTitle },
                excerpt: { rendered: newsExcerpt },
                content: { rendered: newsContent },
                _embedded: {
                  'wp:featuredmedia': featureMedia = [],
                  'wp:term': termsNews = [],
                } = {}
            } = news;

            const featuredImageNews = featureMedia?.[0]?.source_url ?? '';
           const newsCategories = termsNews
                ?.flat()?.map((t: any) => t.name) || [];

            return {
                newsId,
                newsSlug,
                newsTitle,
                newsExcerpt,
                newsContent,
                featuredImageNews,
                newsCategories,
            };
        });

        return newsInfo;    
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    }

} 

