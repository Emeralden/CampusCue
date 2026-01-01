const PAGE_URLS = {
  Dashboard: '/',
  LoginPage: '/login',
  FullMessMenu: '/mess-menu',
  FullSchedule: '/schedule',
  SatisfactionCalendar: '/satisfaction',
  TomorrowOverview: '/tomorrow',
};

export const createPageUrl = (pageName) => {
  return PAGE_URLS[pageName] || '/';
};