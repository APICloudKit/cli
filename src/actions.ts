import { getAllApps, getPackagePage, reqBuildPackages } from './requests';
import * as inquirer from 'inquirer';
import { setCurProject, getCurProject } from './store';
import { parsePackagePage } from './parseHtml';
import chalk from 'chalk';
import * as qrcode from 'qrcode-terminal';

const { log } = console;

export const selectProject = async () => {
    const res = await getAllApps();
    const apps = res.data.result.map(el => ({
        name: el.appName,
        appId: el.appId,
    }));
    const choices = apps.map((el, i) => `${i}. ${el.name}`);
    const { projectIndex } = await inquirer.prompt([
        {
            name: 'projectIndex',
            type: 'list',
            message: '选择项目',
            choices,
            filter: str => str.match(/(\d+?)\./)![1],
        },
    ]);
    const { appId, appName } = res.data.result[projectIndex];
    await setCurProject(appName, appId);
    log(
        chalk.green(`
        ✅  设置成功！

        当前项目为：${appName}
        `),
    );
};

export const getPackages = async () => {
    const project = await getCurProject();
    if (project) {
        log(`
            获取中...
            当前项目为：${project.appName}
        `);
        const packagePage = await getPackagePage(
            project.appName,
            project.appId,
        );
        const { ios, android } = parsePackagePage(packagePage);
        log(`
            ✅  获取成功！依次为 iOS, Android
        `);
        qrcode.generate(ios, { small: true });
        qrcode.generate(android, { small: true });
    } else {
        log(
            chalk.red(`⚠
        ️  请先设置当前当前项目
        `),
        );
    }
};

export const buildPackages = async () => {
    const project = await getCurProject();
    if (project) {
        try {
            await reqBuildPackages(project.appName, project.appId);
            log(
                chalk.green(`
                开始打包...

                请3分钟后获取
                `),
            );
        } catch (e) {
            log(
                chalk.red(`
                    ❌  ${e.message}
                `),
            );
        }
    }
};
