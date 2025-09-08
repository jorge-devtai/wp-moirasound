
export interface Endpoints {
  posts: string;
  pages: string;
  media: string;
  categories: string;
  tags: string;
}


export interface PageProps {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  acf?: AcfProps;   
  _embedded: any;  
}


export interface AcfProps {
  hero_section_title?: string;
  hero_section_description?: string;
  buttonsSection: ButtonProps[]; 
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
