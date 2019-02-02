import * as cheerio from 'cheerio';

export const parsePackagePage = (html: string) => {
    const $ = cheerio.load(html);
    const res: any[] = [].slice.call($('.build a'));
    const hrefs = res.map(el => el.attribs.href);
    const ios = hrefs.filter(el => /ipa/.test(el)).slice(0, 1);
    const android = hrefs
        .filter(el => !/ipa/.test(el) && !/javascript/.test(el))
        .slice(0, 1);

    return {
        ios: (ios[0] as string) || null,
        android: (android[0] as string) || null,
    };
};
