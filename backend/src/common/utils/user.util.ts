export const GUEST_USER_ID = 'guest';

export const isGuestUser = (userId?: string | null): boolean => {
  return !userId || userId === GUEST_USER_ID;
};
