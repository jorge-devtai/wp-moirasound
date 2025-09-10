import type { StaffProps } from "./types/apiTypes";
import { endpoints } from "./apiConfing";


export async function getTeamInfo(): Promise<StaffProps[]> {
    try {
        const response = await fetch(`${endpoints.pages}?slug=equipo&_embed=wp:featuredmedia,wp:term,acf:term&_fields=id,slug,title,excerpt,content,acf,_links`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("No team data found.");

        const teamInfo: StaffProps[] = data.map((staffMember) => {
            const {
                id: staffId,
                slug: staffSlug,
                title: { rendered: staffTitle },
                excerpt: { rendered: staffExcerpt },
                content: { rendered: staffContent },
                acf: {
                    staff_name: staffName,
                    staff_role: staffRole,
                    staff_biography: staffBiography,
                } = {},
                _embedded: {
                    'wp:featuredmedia': featureMedia = [],
                    'acf:term': acfTerm = [],
                    'wp:term': wpTerm = []
                } = {}
            } = staffMember;

            const featuredImage = featureMedia?.[0]?.source_url ?? '';

            const country = wpTerm?.find((term: any) => term[0]?.taxonomy === 'pais')?.[0]?.name || '';
            
            const roles = acfTerm
                ?.filter((term: any) => term.taxonomy === "staff_role")
                ?.map((t: any) => t.name) || [];

            return {
                staffId,
                staffSlug,
                staffTitle,
                staffExcerpt,
                staffContent,
                staffName,
                staffRole,
                staffBiography, 
                featuredImage,
                country,
                roles,
            };
        });

        return teamInfo;    
    } catch (error) {
        console.error("Error fetching team data:", error);
        throw error;    
    }           
}