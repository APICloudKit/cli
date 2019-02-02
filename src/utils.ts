export const stringifyCookie = (cookies: any) => {
    return Object.keys(cookies)
        .map(name => `${name}=${cookies[name]}`)
        .join('; ');
};
