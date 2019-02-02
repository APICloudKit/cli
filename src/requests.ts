import * as axios from 'axios';
import { getCookie } from './store';
import { launchBrowserToLogin } from './login';
import { config } from './config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as qs from 'qs';

const execPromise = promisify(exec);

const request = axios.default.create({
    baseURL: 'https://www.apicloud.com',
});

const getCookieStr = async (appName: string, appId: string) => {
    return `i18next=zh-CN; connect.sid=${await getCookie()}; username=${encodeURIComponent(
        config.username,
    )}; nickname=${
        config.nickname
    }; curAppId=${appId}; curAppName=${appName}; mcmOpened=0; appType=0; apiprojectid=null`;
};

request.interceptors.request.use(async config => {
    config.headers = {
        Cookie: `connect.sid=${await getCookie()}`,
    };
    return config;
});

request.interceptors.response.use(
    res => {
        return res;
    },
    err => {
        if (err.response.status === 600) {
            console.log('请登录');
            launchBrowserToLogin();
        }
    },
);

export const getAllApps = () => request.get<GetAllAppsRes>('/api/apps');

export const getPackagePage = async (appName: string, appId: string) => {
    const curlComm = `curl 'https://www.apicloud.com/package' -H 'Referer: https://www.apicloud.com/package' -H 'Cookie: ${await getCookieStr(
        appName,
        appId,
    )}' --compressed`;

    const res = await execPromise(curlComm, { maxBuffer: 500 * 1024 });

    return res.stdout;
};

export const reqBuildPackages = async (appName: string, appId: string) => {
    const { buildConfig } = config;
    const data = qs.stringify({
        ...buildConfig,
        timepicker: Date.now(),
        appName,
        appId,
    });
    const curlComm = `curl 'https://www.apicloud.com/addUnpack' -H 'Pragma: no-cache' -H 'Origin: https://www.apicloud.com' -H 'Accept-Encoding: gzip, deflate, br' -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36' -H 'content-type: application/x-www-form-urlencoded; charset=UTF-8' -H 'accept: */*' -H 'Cache-Control: no-cache' -H 'x-requested-with: XMLHttpRequest' -H 'Cookie: ${await getCookieStr(
        appName,
        appId,
    )}' --data '${data}' --compressed`;
    const res = await execPromise(curlComm, { maxBuffer: 500 * 1024 });
    const isSucc = /打包中！/.test(res.stdout);
    if (!isSucc) throw new Error('发起打包失败');
};
