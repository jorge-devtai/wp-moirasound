import type { Endpoints } from "@lib-types/apiTypes";

const domain: string = import.meta.env.PUBLIC_URL_WP_DOMAIN as string;
const apiUrl: string = `${domain}/wp-json/wp/v2`;

const endpoints: Endpoints = {
  posts: `${apiUrl}/posts`,
  pages: `${apiUrl}/pages`,
  media: `${apiUrl}/media`,
  categories: `${apiUrl}/categories`,
  tags: `${apiUrl}/tags`,
};

export { domain, apiUrl, endpoints };
