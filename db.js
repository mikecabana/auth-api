const sql = require('mssql');
const config = {
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    options: {
        encrypt: true
    }
};


const queryDb = (queryString) => {
    const conn = new sql.ConnectionPool(config);

    conn.connect()
        .then(() => {
            const request = new sql.Request(conn);
            request.query(queryString)
                .then((recordSet) => {
                    console.log(recordSet);
                    conn.close();
                }).catch((err) => {
                    console.log('DB Query Error', err);
                    conn.close();
                });
        })
        .catch((err) => {
            console.log('DB Connection Error', err);
        });
}

module.exports = { queryDb };
