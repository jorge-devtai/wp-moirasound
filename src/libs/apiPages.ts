import { endpoints } from "./apiConfing";
import type { ButtonProps, RawButton } from "@lib-types/apiTypes"


const normalizeButton = (
    btn: RawButton,
    source: "hero" | "feature" | "team" | "artist" | "event" | "news"
): ButtonProps => ({
    buttonText: btn?.title ?? "",
    href: btn?.url ?? "#",
    target: btn?.target ?? "_self",
    source,
});

export async function getInfoPage(slug: string) {
    try {
        const response = await fetch(`${endpoints.pages}?slug=${slug}&_embed&_fields=slug,title,excerpt,acf,_embedded`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("No page found with the given slug.");

        const [infoPage] = data.map((page) => {
            const {
                slug: pageSlug,
                title: { rendered: pageTitle },
                excerpt: { rendered: shortContent },
                acf: {
                    hero_section_title: heroTitle,
                    hero_section_description: heroDescription,
                    feature_section_title: featureTitle,
                    feature_section_description: featureDescription,
                    team_section_title: teamTitle,
                    team_section_description: teamDescription,
                    team_block: teamBlock,
                    artists_section_title: artistsTitle,
                    artists_section_subtitle: artistsSubtitle,
                    artists_block: artistsBlock,
                    events_section_title: eventsTitle,
                    events_section_subtitle: eventsSubtitle,
                    events_block: eventsBlock,
                    news_section_title: newsTitle,
                    news_section_subtitle: newsSubtitle,
                    news_block: newsBlock,
                    hero_section_buttom,
                    feature_section_buttom,
                    artists_section_buttom,
                    events_section_buttom,
                    news_section_button,
                    team_section_buttom
                } = {},
                _embedded,
            } = page;

            const heroButton = hero_section_buttom
                ? normalizeButton(hero_section_buttom, "hero")
                : null;

            const featureButton = feature_section_buttom
                ? normalizeButton(feature_section_buttom, "feature")
                : null;

            const teamButton = team_section_buttom
                ? normalizeButton(team_section_buttom, "team")
                : null;
            
            const artistButton = artists_section_buttom
                ? normalizeButton(artists_section_buttom, "artist")
                : null;
            
            const eventButton = events_section_buttom
                ? normalizeButton(events_section_buttom, "event")
                : null;
            
            const newsButton = news_section_button
                ? normalizeButton(news_section_button, "news")
                : null;



            return {
                pageSlug,
                pageTitle,
                shortContent,
                heroTitle,
                heroDescription,
                heroButton,
                featureTitle,
                featureDescription,
                featureButton,
                // featureImageUrl: featureImage?.url || '',
                teamTitle,
                teamDescription,
                teamButton,
                teamBlock,
                artistsTitle,
                artistsSubtitle,
                artistButton,
                artistsBlock,
                eventsTitle,
                eventsSubtitle,
                eventButton,
                eventsBlock,
                newsTitle,
                newsSubtitle,
                newsButton,
                newsBlock,
                _embedded
            }
        })

        return infoPage;

    } catch (error) {
        console.error("Error fetching info page:", error);
        throw error;
    }
}

export async function getAllSlugsPages() {
    try {
        const response = await fetch(`${endpoints.pages}?per_page=100&_fields=slug`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("No pages found.");

        const slugsPages = data.map((page: { slug: string }) => page.slug);

        return slugsPages;
    } catch (error) {
        console.error("Error fetching all slugs pages:", error);
        throw error;
    }
}