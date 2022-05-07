//const exp = require('constants');
const express = require('express');
const { append } = require('express/lib/response');
//const res = require('express/lib/response');
const path = require('path');
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || 'https://aqueous-reaches-99018.herokuapp.com';
const { auth, requiresAuth } = require('express-openid-connect');
const { Pool } = require('pg');
const { user } = require('pg/lib/defaults');
// const axios = require("axios").default;
// const token;
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

const insertUserQuery = async function (req, res, client) {
	const user = req.oidc.user;

	const checkQuery = `SELECT * FROM users WHERE userID = '${user.email}'`;

	const insertQuery = `
	DO $$
	BEGIN
	IF NOT EXISTS (${checkQuery}) THEN
	INSERT INTO users(userID, userName, firstName, lastName) 
	VALUES('${user.email}', '${user.nickname}', ' ' , ' ');
	END IF;
	END $$
	`;

	try {

		await client.query(`BEGIN`);
		await client.query(insertQuery);
		await client.query(`COMMIT`);

	} catch (err) {
		await client.query(`ROLLBACK`);
		console.error(err);
		res.send("Error " + err);
	}
};


// Static Files (files that don't change when your app is running)
// EX: Js, CSS
express().use(express.static('public'));
express().use('/css', express.static(__dirname + 'public/css'));
express().use('js', express.static(__dirname + 'public/js'));


express()
	.use(express.static(path.join(__dirname, 'public')))
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
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
	.get('/home', async (req, res) => {

		try {
			const client = await pool.connect();

			const posts = await client.query(
				`SELECT * FROM posts ORDER BY postsid ASC;`);

			const user = req.oidc.user;

			const locals = {
				'posts': (posts) ? posts.rows : null,
				'authenticated': req.oidc.isAuthenticated() ? true : false,
				'user': user
			};
			res.render('pages/index', locals);
			client.release();
		}
		catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.get('/profile', requiresAuth(), async (req, res) => {
		try {
			const client = await pool.connect();

			insertUserQuery(req, res, client);

			const posts = await client.query(
				`SELECT * FROM posts ORDER BY postsid ASC;`);

			const user = req.oidc.user;
			
			const hkUser = await client.query(
				`SELECT * FROM users WHERE userID = '${user.email}'`);

			const locals = {
				'posts': (posts) ? posts.rows : null,
				'authenticated': req.oidc.isAuthenticated() ? true : false,
				'hkUser': (hkUser) ? hkUser.rows : null,
				'user': user
			};

			res.render('pages/profile', locals);

			client.release();
		}
		catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.get('/settings', requiresAuth(), async (req, res) => {
		try {
			const client = await pool.connect();

			insertUserQuery(req, res, client);

			const user = req.oidc.user;

			const hkUser = await client.query(
				`SELECT * FROM users WHERE userID = '${user.email}'`);

			const locals = {
				'authenticated': req.oidc.isAuthenticated() ? true : false,
				'hkUser': (hkUser) ? hkUser.rows : null,
				'user': user
			};

			res.render('pages/settings', locals);
			client.release();
		}
		catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.get('/search', async (req, res) => {
		try {
			const client = await pool.connect();

			insertUserQuery(req, res, client);

			const user = req.oidc.user;

			const hkUser = await client.query(
				`SELECT * FROM users WHERE userID = '${user.email}'`);

			// This is /search?search=text
			const searchText = req.query.search.toLocaleLowerCase();

			// Returns posts if the title has anything containing searchText, using LOWER() to make case insensitive
			const posts = await client.query(`
				SELECT * FROM posts WHERE LOWER(title) SIMILAR TO '%${searchText}%';
			`);

			const locals = {
				'posts': (posts) ? posts.rows : null,
				'authenticated': req.oidc.isAuthenticated() ? true : false,
				'hkUser': (hkUser) ? hkUser.rows : null,
				'user': user
			};

			res.render('pages/searchPosts', locals);
			client.release();
		}
		catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.get('/createPost', async (req, res) => {
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
	.get('/authenticateLogin', (req, res) => {
		authenticateLogin(req, res, '/createPost');
	})
	.get('/authenticateLogout', (req, res) => {
		authenticateLogin(req, res, '/logout');
	})
	.post ('/updateUser', async (req, res) => {
		try {
			const client = await pool.connect();

			const user = req.oidc.user;

			const userName = req.body.userName;
			const firstName = req.body.firstName;
			const lastName = req.body.lastName;

			const updateQuery = await client.query(
				`
				UPDATE users
				SET userName = ${userName},
				firstName = ${firstName},
				lastName = ${lastName}
				WHERE userID = '${user.email}';
				`
			);

			const result = {
				'response': (updateQuery) ? (updateQuery.rows) : null,
			};

			res.set({
				'Content-Type': 'application/json'
			});

			res.json({ requestBody: result });

			client.release();

		} catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.post('/log', async (req, res) => {
		try {
			const client = await pool.connect();
			const postsId = req.body.postsID;

			const title = req.body.title;
			const body = req.body.body;
			const email = req.body.email;

			const displayData = [title, body, email];

			const postSql = await client.query(
				`
				INSERT INTO posts (title, body, email)
				VALUES (${title}, ${body}, ${email});
				 
				`
			)

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
	.listen(PORT, () => console.log(`Listening on ${PORT}`));