const sql = require('mssql');
const config = {
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    options: {
        encrypt: true
    }
};


const queryDb = (queryString, res) => {
    const conn = new sql.ConnectionPool(config);

    conn.connect()
        .then(() => {
            const request = new sql.Request(conn);
            request.query(queryString)
                .then((recordSet) => {
                    console.log(recordSet);
                    res.json(recordSet);
                    conn.close();
                }).catch((err) => {
                    console.log('DB Query Error', err);
                    res.json(err);
                    conn.close();
                });
        })
        .catch((err) => {
            console.log('DB Connection Error', err);
            res.json(err);
        });
}

module.exports = { queryDb, sql };
