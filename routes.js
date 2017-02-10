var _ = require('lodash');

const axios = require('axios');

var convert = require('koa-convert');
var router = require('koa-router')();

var makeDBQuery = require('./functions.js').makeDBQuery;
var SESSION_KEYS = require('./functions.js').SESSION_KEYS;

const koaJwt = convert(require('koa-jwt'));
const jwt = koaJwt({ secret: SESSION_KEYS[0] });
const jwebtoken = require('jsonwebtoken');

const CLIENT_ID = '22852C';
const CLIENT_SECRET = '9afe2c57a50708816966d992bf8fa4f7';
const REDIRECT_URI = 'http://www.greatcatchhelp.com/auth/fitbit/callback';

var ClientOAuth2 = require('client-oauth2');

var fitbitAuth = new ClientOAuth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  accessTokenUri: 'https://api.fitbit.com/oauth2/token',
  authorizationUri: 'https://www.fitbit.com/oauth2/authorize',
  redirectUri: REDIRECT_URI,
  scopes: ['activity', 'heartrate', 'sleep', 'weight']
});

/**
 * @swagger
 * /login:
 *      post:
 *          description: Login user to application
 *          produces:
 *              - application/json
 *          parameters:
 *              - name: username
 *                description:  Username provided by user
 *                in: formData
 *                required: true
 *                type: string
 *              - name: password
 *                description:  Password provided by user
 *                in: formData
 *                required: true
 *                type: string
 *          responses:
 *              200:
 *                  description: login
 *              401:
 *                  description: invalid credentials
 */
router.post('/login', async (ctx, next) => {
    console.log(ctx.request.fields);

    let { username, password } = ctx.request.fields;

    // fields:
    //  { username, password }

    // DO AUTHENTICATION HERE, THEN PULL USER INFO FROM DB

    let { records, error} = await makeDBQuery({
        queryString: 'MATCH (u:User) WHERE u.username = {username} AND u.password = {password} RETURN u AS user',
        object: {
            username,
            password
        }
    });

    // check if no errors AND match in DB
    if(!error && records.length) {
        let user = records[0].get('user').properties;

        //   -- CONSIDER REPLACING WITH PASSPORT LOCAL STRATEGY
        // let user = users.find(u => u.name === ctx.request.fields.username);
        //                                                 // seconds
        let token = jwebtoken.sign(user, SESSION_KEYS[0], { expiresIn: 60 * 60 * 5 });
        ctx.body = { token, username: user.username };
        ctx.status = 200;
    }
    // extend this to check for specific errors
    else {
        ctx.status = 401;
    }
});

router.get('/user/:id/profile', async (ctx, next) => {
    // GET USER DATA FROM DB HERE
    let { id } = ctx.params;

    let { records, error } = await makeDBQuery({
        queryString: 'MATCH (u:User) WHERE id(u) = {id} RETURN u AS user',
        object: {
            id: parseInt(id)
        }
    });

    // let userData = {
    //     username: 'test',
    //     dateOfBirth: '01/01/1980',
    //     fullName: 'Test User'
    // };

    if(!error && records.length) {
        let userData = _.omit(records[0].get('user').properties, 'password');
        ctx.body = userData;
    }
    else {
        ctx.status = 403;
    }
});

router.post('/user/create', async (ctx, next) => {
    let { username, password, password_repeat, email } = ctx.request.fields;

    // fields:
    //  { username, password, password_repeat, email }  -- any more?

    // CREATE USER IN DB, THEN USE IT TO SIGN JWT INSTEAD

    if(password === password_repeat) {

        let { records, error } = await makeDBQuery({ 
            queryString: 'CREATE (u:User { username: {username}, password: {password}, email: {email}}) RETURN u AS user', 
            object: {
                username,
                password,
                email
            }
        });

        if(!error) {
            let user = _.omit(records[0].get('user').properties, password);
            // let user = Object.assign({}, ctx.request.fields, { id: users.length + 1 });
            users = users.concat(user);

            // let token = jwebtoken.sign(user, SESSION_KEYS[0], { expiresIn: 60 * 60 * 5 });

            // ctx.body = { token };
            console.log('user', user);
            ctx.body = 'user created';
        }
        else {
            console.error(error);
        }
    }
    else {
        ctx.status = 401;
    }
});

router.get('/auth/fitbit', (ctx) => {
    var uri = fitbitAuth.code.getUri();
    console.log(uri);
    ctx.redirect(uri);
});

const fitbitTokenUrl = 'https://api.fitbit.com/oauth2/token';
router.get('/auth/fitbit/callback', async (ctx) => {
    if(ctx.body) {
        console.log(ctx.body);
    }
    else {
        let url = ctx.originalUrl;
        console.log(url);
        let code = url.match(/\?code=(.*)[#_=_]?$/)[1];

        let headers = {
            Authorization: `Basic ${Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')}`
        };

        let params = {
            client_id: CLIENT_ID,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
            code
        };

        let response = await axios.create({
            url: `${fitbitTokenUrl}?${queryString}`,
            method: 'POST',
            headers,
            params
        });
        console.log(response);
    }
});

module.exports = {
    router
};