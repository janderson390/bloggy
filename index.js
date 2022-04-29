//const exp = require('constants');
const express = require('express');
const { append } = require('express/lib/response');
//const res = require('express/lib/response');
const path = require('path');
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || 'https://aqueous-reaches-99018.herokuapp.com';
const { auth } = require('express-openid-connect');
const { Pool } = require('pg');
//const { isNull } = require('util');


require('dotenv').config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

function authenticateLogin(req, res, target) {
    res.redirect(req.oidc.isAuthenticated() ? target : '/login');
}

// Static Files (files that don't change when your app is running)
// EX: Js, CSS
express().use(express.static('public'));
express().use('/css', express.static(__dirname + 'public/css'));
express().use('js', express.static(__dirname + 'public/js'));




express()
	.use(express.static(path.join(__dirname, 'public')))
	.use(express.json())
	.use(express.urlencoded({ extended: true}))
	.use(auth({
		authRequired: false,
		auth0Logout: true,
		issuerBaseURL: 'https://dev-jihvntvr.us.auth0.com',
    	baseURL: BASE_URL,
    	clientID: 'wqx2OAZZ9hfJe2Y1naSTa9oItVKLT748',
    	secret: 'awdasgwafasd126gg4llkgr41ssfbbhuyb33',	
	}))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')



	.get('/', (req, res) => {
		res.redirect('/home');
	})
	.get('/home', async(req, res) => {

		try {
			const client = await pool.connect();

			const posts = await client.query(
				`SELECT * FROM posts ORDER BY postsid ASC;`);

			const locals = {
				'posts': (posts) ? posts.rows : null,
				'authenticated': req.oidc.isAuthenticated() ? true : false
			};
			res.render('pages/index', locals);
			client.release();
		} 
		catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.get('/profile', async(req, res) => {
		try {
			const client = await pool.connect();

			const posts = await client.query(
				`SELECT * FROM posts ORDER BY postsid ASC;`);

			const locals = {
				'posts': (posts) ? posts.rows : null,
				'authenticated': req.oidc.isAuthenticated() ? true : false
			};
			res.render('pages/profile', locals);
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
	.get('/authenticateLogin', (req, res) => {
		authenticateLogin(req, res, '/createPost');
	})
	.get('/authenticateLogout', (req, res) => {
		authenticateLogin(req, res, '/logout');
	})


	.get('/createPost', async(req, res) => {
		try {
			const client = await pool.connect();

			const posts = await client.query(
				`SELECT * FROM posts ORDER BY postsid ASC;`);

			const locals = {
				'posts': (posts) ? posts.rows : null
			};
			res.render('pages/createPost', locals);
			client.release();
		} 
		catch (err) {
			console.error(err);
			res.send("Error " + err);
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