export const ENDPOINTS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  REFRESH: "/auth/refresh",
  MENU: "/menu",
  ORDERS: "/orders",
  TRACK_ORDER: (code: string) => `/orders/track/${code}`,
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  CANCEL_ORDER: (id: string) => `/orders/${id}/cancel`,
  SETTINGS: "/settings",
};
