type Fn = () => void;
let handler: Fn | null = null;

export const setLogoutHandler = (fn: Fn) => {
  handler = fn;
};
export const requestLogout = () => {
  handler?.();
};
