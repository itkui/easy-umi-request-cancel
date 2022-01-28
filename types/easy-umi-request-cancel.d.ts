import { OnionMiddleware } from "umi-request"

export type UrlUnique = 'host' | 'path' | 'search' | RegExp

export interface CancelOptions {
  cancelKey?: string;
  urlUnique?: UrlUnique;
  urlBase?: string;
  urlUniqueList?: string[];
}

declare var umiRequestCancel: OnionMiddleware;

export default umiRequestCancel;

declare module "umi-request" {
  interface RequestOptionsInit extends CancelOptions { }
}