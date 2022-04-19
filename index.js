//const exp = require('constants');
const express = require('express');
const { append } = require('express/lib/response');
//const res = require('express/lib/response');
const path = require('path');
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
//const { isNull } = require('util');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

// Static Files (files that don't change when your app is running)
// EX: Js, CSS
express().use(express.static('public'));
express().use('/css', express.static(__dirname + 'public/css'))


express()
	.use(express.static(path.join(__dirname, 'public')))
	.use(express.json())
	.use(express.urlencoded({ extended: true}))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
	.get('/', async(req, res) => {
		try {
			const client = await pool.connect();

			const posts = await client.query(
				`SELECT * FROM posts ORDER BY postsid ASC;`);

				const locals = {
					'posts': (posts) ? posts.rows : null
				};
				res.render('pages/index', locals);
				client.release();
		} 
		catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.get('/db-info', async(req, res) => {
		try {
			const client = await pool.connect();
			const tables = await client.query(

				`
				SELECT c.relname AS table, a.attname AS column, t.typname AS type 
				FROM pg_catalog.pg_class AS c 
				LEFT JOIN pg_catalog.pg_attribute AS a 
				ON c.oid = a.attrelid AND a.attnum > 0 
				LEFT JOIN pg_catalog.pg_type AS t 
				ON a.atttypid = t.oid 
				WHERE c.relname IN ('users', 'observations', 'students', 'schools', 'tasks') 
				Order BY c.relname, a.attnum;
			`);

					const posts = await client.query(
						`SELECT * FROM posts`);			

					const locals = {
						'tables': (tables) ? tables.rows : null,
						'posts': (posts) ? posts.rows : null
					};
			

					res.render('pages/db-info', locals);
					client.release();

		}
		catch (err) {
			console.error(err);
			res.send("Error: " + err);
		}
	})
	.post('/log', async(req, res) => {
		try {
			const client = await pool.connect();
			const postsId = req.body.postsID;
			const userId = req.body.userID;
			const title = req.body.title;
			const body = req.body.body;

			const displayData = [postsId, userId, title, body];

			const result = {
				'response': displayData
			};
			res.set({
				'Content-Type': 'application/json'
			});
			res.json({ requestBody: result });
			client.release();
		}
		catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.listen(PORT, () => console.log(`Listening on ${ PORT }`));