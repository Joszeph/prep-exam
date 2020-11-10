module.exports = {
    development: {
        port: process.env.PORT || 4000,
        privateKey: 'SOFT-UNI-WORKSHOP',
        databaseUrl: `mongodb+srv://Joseph:123456abc@cluster0.l8xzr.mongodb.net/Theater?retryWrites=true&w=majority`
    },
    production: {}
};


