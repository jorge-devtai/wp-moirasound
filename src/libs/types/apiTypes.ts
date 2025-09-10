
export interface Endpoints {
  posts: string;
  pages: string;
  media: string;
  categories: string;
  news: string;
  tags: string;
  artists: string;
  events: string; 
  gallerys: string;
}

export interface PageProps {
  pageSlug: string;
  pageTitle: string;
  pageContent: string;
  pageExcerpt: string;
  pageAcf?: AcfPageProps;   
  _embedded: any;  
}

export interface ArtistProps {
  artistId: number;
  artistSlug: string;
  artistTitle: string;
  artitsExcerpt: string;
  artistAcf: ArtistAcfProps;
  featuredImage?: string;
  country?: string[];
  genres?: string[];
}

export interface AcfPageProps {
  hero_section_title?: string;
  hero_section_description?: string;
  buttonsSection: ButtonProps[];
  feature_section_title?: string;
  feature_section_description?: string;
  artists_section_title?: string;
  artists_section_subtitle?: string;
  artists_blocks?: number[];
  news_section_title?: string;
  news_section_subtitle?: string;
  block_latest_news?: number[];
}

export interface ArtistAcfProps {
  artistName?: string;
  artistBiography?: string;
  
}

export interface EventProps { 
  eventId: number;
  eventSlug: string;
  eventTitle: string;
  eventExcertpt: string;
  eventAcf: EventAcfProps;
  featuredImageEvent?: string;
  
}

export interface EventAcfProps {
  eventName?: string;
  eventAddress?: string;
  eventDate?: string;
  eventTime?: string;
  eventArtist?: number[];
  eventType?: string[];
}

export interface newsProps {
  newsId: number;
  newsSlug: string;
  newsTitle: string;
  newsExcerpt: string;
  newsContent: string;
  featuredImageNews?: string;
  newsCategories?: number[];
}

export interface RawButton {
  title?: string;
  url?: string;
  target?: string;
}


export interface ButtonProps {
  buttonText: string;
  href: string;
  target: string;
  source?: "hero" | "feature" | "team" | "artist" | "event" | "news"; 
}
