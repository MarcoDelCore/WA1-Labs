/**  NEW **/
import db from './db.mjs';
import crypto from 'crypto';

function UserDao() {
	this.getUser = (email, password) => {
		console.log("I'm searching the user in dd...")
		return new Promise((resolve, reject) => {
			const sql = 'SELECT * FROM users WHERE email = ?';
			db.get(sql, [email], (err, row) => {
				if (err) {
					reject(err);
				}
				else if (row === undefined) {
					resolve(false);
				}
				else {
					const user = { id: row.id, email: row.email, name: row.name };
					crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
						if (err) reject(err);
						if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
							resolve(false);
						else
							resolve(user);
					});
				}
			});
		});
	};

	this.getUserById = (id) => {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT * FROM users WHERE id = ?';
			db.get(sql, [id], (err, row) => {
				if (err) {
					reject(err);
				}
				else if (row === undefined) {
					resolve({ error: 'User not found!' });
				}
				else {
					const user = { id: row.id, name: row.name, username: row.email };
					resolve(user);
				}
			});
		});
	};

	this.createUser = (name, email, password) => {
		return new Promise((resolve, reject) => {
			try {
				const salt = crypto.randomBytes(8).toString('hex')
				const hashedPassword = crypto.scryptSync(password, salt, 32).toString('hex')
				const sql = "INSERT INTO users(email, name, hash, salt) VALUES(?, ?, ?, ?)"
				db.run(sql, [email, name, hashedPassword, salt], (err) => {
					if (err) {
						return reject(err)
					}
					resolve()
				})
			} catch (error) {
				reject(error)
			}
		})
	}
}

export default UserDao