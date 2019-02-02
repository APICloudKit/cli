import { promisify } from 'util';
import { writeFile, readFile } from 'fs';

const writeFilePromise = promisify(writeFile);
const readFilePromise = promisify(readFile);

const indexFileName = 'store/index.json';
const curProjectFileName = 'store/curProject.json';

export const setCookie = (cookie: string) =>
    writeFilePromise(indexFileName, JSON.stringify({ cookie }));

export const getCookie = async () =>
    JSON.parse(await readFilePromise(indexFileName, { encoding: 'utf8' }))
        .cookie as string;

export const setCurProject = (appName: string, appId: string) =>
    writeFilePromise(curProjectFileName, JSON.stringify({ appName, appId }));

export const getCurProject = async () =>
    JSON.parse(
        await readFilePromise(curProjectFileName, {
            encoding: 'utf8',
        }),
    ) as {
        appId: string;
        appName: string;
    } | null;
