import type { EventProps } from "@lib-types/apiTypes"
import { endpoints } from "./apiConfing";

export async function getAllSlugEvents(): Promise<EventProps[]> {
    try {
        const response = await fetch(`${endpoints.events}?per_page=100&_fields=title,excerpt,acf`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("No events found.");

        const eventsSlug = data.map((eventSlug) => eventSlug.slug)

        //console.log("Estos son los slugs de los eventos:", eventsSlug);
        return eventsSlug;

    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
}


export async function getEventInfo({ perPage = 100 }: { perPage?: number } = {}): Promise<EventProps[]> {
    try {
        const reponse = await fetch(`${endpoints.events}?per_page=${perPage}&_embed=wp:featuredmedia,wp:term,acf:term,acf:post&_fields=id,slug,title,excerpt,acf,_links`);
        if (!reponse.ok) throw new Error(`HTTP error! status: ${reponse.status}`);

        const data = await reponse.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("No events found.");

        const eventsInfo: EventProps[] = data.map((eventInfo) => {
            const {
                id: eventId,
                slug: eventSlug,
                title: { rendered: eventTitle },
                excerpt: { rendered: eventExcertpt },
                acf: {
                    event_name: eventName,
                    event_address: eventAddress,
                    event_date: eventDate,
                    event_time: eventTime,
                    event_artist: eventArtist,
                } = {},
                _embedded: {
                    'wp:featuredmedia': featureMedia = [],
                    'acf:term': termsEvents = [],
                    'acf:post': artistData = [],
                } = {}
            } = eventInfo;

            const featuredImageEvent = featureMedia?.[0]?.source_url ?? '';
            const eventTypes = termsEvents?.[0]?.name || '';
            const artistName = artistData
                ?.filter((artist: any) => eventArtist?.includes(artist.id))
                ?.map((a: any) => a.acf.artist_name) || [];

            return {
                eventId,
                eventSlug,
                eventTitle,
                eventExcertpt,
                featuredImageEvent,
                eventTypes,
                artistName,
                eventAcf: {
                    eventName,
                    eventAddress,
                    eventDate,
                    eventTime,
                },
               
            };
        });

       // console.log("Información de los eventos desde la api:", eventsInfo);
        return eventsInfo;

    } catch (error) {
        console.error("Error fetching events info:", error);
        throw error;
    }
}