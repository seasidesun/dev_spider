module.exports = {
    mongo: {
        spider_cook: {
            url: "mongodb://127.0.0.1:27017/spider_cook"
        }
    },
    express: {
        port: 3007,
        env: 'development',
        // env: 'production',
        access_path: '/logs/access.log',
        error_path: '/logs/error.log'
    },
    appName: 'app_name',
};
