import { RequestOptionsInit } from 'umi-request'
declare global {
  export type UrlUnique = 'host' | 'path' | 'search' | RegExp
  export interface CancelOptions extends RequestOptionsInit {
    cancelKey?: string;
    urlUnique?: UrlUnique;
    urlBase?: string;
    urlUniqueList?: string[];
  }

}

export { }