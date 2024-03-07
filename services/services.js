const pool = require("../dbconfig");

const storeOTP = (name, email, secret, secretjson) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(
                `INSERT INTO users (name, email, secret,secret_json) VALUES (?, ?, ?, ?)`,
                [name, email, secret, secretjson],
                (error, results, fields) => {
                    connection.release();
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    });
};



      const  getOtpDetail = (email) => {
        return new Promise((resolve, reject) => {
          pool.getConnection((err, connection) => {
            if (err) {
              return reject(err);
            }
            connection.query(
                `SELECT secret FROM users WHERE email = ?`,
              [email],
              (error, results, fields) => {
                connection.release();
                if (error) {
                  return reject(error);
                }
                return resolve(results);
              }
            );
          });
        });
      };
      
      module.exports={
        storeOTP,
        getOtpDetail
          }

  