module.exports = {
    mongo: {
        app_name: {
            url: "mongodb://127.0.0.1:27017/app_name"
        }
    },
    redis: {
        host: '127.0.0.1',
        port: 6379,
        db: 5,
    },
    express: {
        port: 3006,
        env: 'development',
        // env: 'production',
        access_path: '/logs/access.log',
        error_path: '/logs/error.log'
    },
    appName: 'app_name',
};
