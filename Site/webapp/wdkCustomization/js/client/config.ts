// __SITE_CONFIG__ is defined in siteConfig.js.j2

declare global {
  interface Window {
    __SITE_CONFIG__: { [K in string]?: string }
  }
}

if (window.__SITE_CONFIG__ == null) {
  throw new Error("`window.__SITE_CONFIG__` must be defined.");
}

export const {
  rootUrl = '',
  rootElement = '',
  endpoint = '',
  projectId = '',
  webAppUrl = '',
  facebookUrl = '',
  twitterUrl = '',
  youtubeUrl = '',
  vimeoUrl = '',
  communitySite = '',
} = window.__SITE_CONFIG__;
