interface GetAllAppsRes {
    status: number;
    apps: number;
    result: {
        appId: string;
        appName: string;
        type: number;
        permission: number;
        apiprojectid: null;
        iconUrl: string;
        newUsersCount: number;
        activeUsersCount: number;
    }[];
}
