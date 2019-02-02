import * as pup from 'puppeteer-core';
import { debounce, find } from 'lodash';
import { setCookie } from './store';

declare const jQuery: any;

export const launchBrowserToLogin = async (
    username?: string,
    password?: string,
) => {
    const browser = await pup.launch({
        executablePath:
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('https://www.apicloud.com/m/signin', {
        waitUntil: 'networkidle2',
    });
    await page.deleteCookie();
    page.on(
        'requestfinished',
        debounce(
            async () => {
                const cookies = await page.cookies();
                const found = find(cookies, { name: 'connect.sid' });
                if (found) {
                    console.log('登录成功');
                    setCookie(found.value);
                }
            },
            1000,
            { leading: false, trailing: true },
        ),
    );
    page.evaluate(
        (user: string, pass: string) => {
            jQuery('#username').val(user);
            jQuery('#password').val(pass);
        },
        username,
        password,
    );
};
