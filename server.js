var path = require('path');
var _ = require('lodash');
var d3 = require('d3');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;

var deterDataSize = require('./static/demonstration_items/StepCount_Stat')
    .deterDataSize;

var koa = require('koa');
var app = new koa();
const session = require('koa-session');
var SESSION_KEYS = require('./functions.js').SESSION_KEYS;

// const router = require('./routes.js').router;

var convert = require('koa-convert');
// app.use(convert(require('koa-better-body')()));
var koaBody = require('koa-bodyparser');
app.use(convert(koaBody()));

app.keys = SESSION_KEYS;
app.use(convert(session(app)));

var views = require('koa-views');

app.use(
    views(path.join(__dirname, 'views'), {
        map: {
            pug: 'pug',
        },
    })
);

app.use(convert(require('koa-static')(path.join(__dirname, 'static'))));

const axios = require('axios');
var router = require('koa-router')();

var makeDBQuery = require('./functions.js').makeDBQuery;

const koaJwt = convert(require('koa-jwt'));
const jwt = koaJwt({ secret: SESSION_KEYS[0] });
const jwebtoken = require('jsonwebtoken');

const CLIENT_ID = '22852C';
const CLIENT_SECRET = '9afe2c57a50708816966d992bf8fa4f7';
const REDIRECT_URI = 'http://www.greatcatchhelp.com/auth/fitbit/callback';

var ClientOAuth2 = require('client-oauth2');

let encodeClientStrings = () => {
    return Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
};

var { graphqlKoa, graphiqlKoa } = require('graphql-server-koa');

var myGraphQLSchema = require('./src/graphql/schema').graphqlSchema;

const nodemailer = require('nodemailer');

const gmailUser = 'CI491GreatCatch@gmail.com';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailUser,
        pass: 'helloWorld',
    },
});

const mailOptions = {
    from: gmailUser,
}; /*
    to: 'alex41290@gmail.com',
    subject: 'test',
    text: 'This is a test email'
};*/

router.post('/login', async ctx => {
    let { username, password } = ctx.request.body;

    // fields:
    //  { username, password }

    // DO AUTHENTICATION HERE, THEN PULL USER INFO FROM DB

    let { records, error } = await makeDBQuery({
        queryString: `MATCH (u:User) WHERE u.username =~ '(?i)${username}' AND u.password = {password} RETURN u AS user`,
        object: {
            password,
        },
    });

    // check if no errors AND match in DB
    if (!error && records.length) {
        let user = records[0].get('user').properties;

        //   -- CONSIDER REPLACING WITH PASSPORT LOCAL STRATEGY
        // let user = users.find(u => u.name === ctx.request.fields.username);
        //                                                 // seconds
        let token = jwebtoken.sign(user, SESSION_KEYS[0], {
            expiresIn: 60 * 60 * 5,
        });
        ctx.body = { token, username: user.username, email: user.email };
        ctx.status = 200;
    } else {
        // extend this to check for specific errors
        ctx.status = 401;
    }
});

const fitbitTokenUrl = 'https://api.fitbit.com/oauth2/token';
router.get('/auth/fitbit/callback', async ctx => {
    let url = ctx.originalUrl;

    let match = url.match(/\?code=(.*)[#_=_]?$/)[1];
    let code = match.split('&')[0].split('#')[0];

    let state;
    try {
        state = match.split('&')[1].match(/state=(.*)/)[1];
    } catch (e) {}

    let headers = {
        Authorization: `Basic ${encodeClientStrings()}`,
    };

    let params = {
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
    };

    if (state) params = Object.assign(params, { state });

    let request = axios.create({
        headers,
        params,
    });
    try {
        let response = await request.post(fitbitTokenUrl);

        let { access_token, refresh_token, user_id } = response.data;

        ctx.session.access_token = access_token;
        ctx.session.refresh_token = refresh_token;
        ctx.session.user_id = user_id;

        ctx.redirect('/');
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
});

router.post('/auth/fitbit/refresh', jwt, async ctx => {
    let { refresh_token } = ctx.request.body;

    let headers = {
        Authorization: `Basic ${encodeClientStrings()}`,
    };

    let params = {
        grant_type: 'refresh_token',
        refresh_token,
    };

    let request = axios.create({
        headers,
        params,
    });
    try {
        let response = await request.post(fitbitTokenUrl);

        ctx.session = Object.assign(ctx.session, response.data);
        ctx.redirect('/user/profile');
    } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    }
});

router.post('/user/create', async ctx => {
    let {
        username,
        firstname,
        lastname,
        password,
        password_repeat,
        email,
    } = ctx.request.body;

    // fields:
    //  { username, password, password_repeat, email }  -- any more?

    // CREATE USER IN DB, THEN USE IT TO SIGN JWT INSTEAD

    if (password === password_repeat) {
        let { records, error } = await makeDBQuery({
            queryString: `CREATE (u:User 
                { username: {username}, 
                  password: {password}, 
                  email: {email}, 
                  firstName: {firstname}, 
                  lastName: {lastname},
                  createdAt: {createdAt}
                }) RETURN u AS user`,
            object: {
                username,
                password,
                email,
                lastname,
                firstname,
                createdAt: Date.now(),
            },
        });

        if (!error) {
            let user = _.omit(records[0].get('user').properties, password);
            // let user = Object.assign({}, ctx.request.fields, { id: users.length + 1 });
            // users = users.concat(user);

            let token = jwebtoken.sign(user, SESSION_KEYS[0], {
                expiresIn: 60 * 60 * 5,
            });

            // ctx.body = { token };
            ctx.body = Object.assign(_.omit(user, 'password'), { token });
            ctx.status = 201;
        } else {
            console.error(error);
        }
    } else {
        ctx.status = 401;
    }
});

router.get('/user/profile', jwt, async (ctx, next) => {
    ctx.body = { auth_token: ctx.session.access_token };
});

router.get('/user/:id/profile', async ctx => {
    // GET USER DATA FROM DB HERE
    let { id } = ctx.params;

    let { records, error } = await makeDBQuery({
        queryString: 'MATCH (u:User) WHERE id(u) = {id} RETURN u AS user',
        object: {
            id: parseInt(id),
        },
    });

    // let userData = {
    //     username: 'test',
    //     dateOfBirth: '01/01/1980',
    //     fullName: 'Test User'
    // };

    if (!error && records.length) {
        let user_data = _.omit(records[0].get('user').properties, 'password');
        let auth_token = ctx.session.access_token;
        ctx.body = { user_data, auth_token };
    } else {
        ctx.status = 403;
    }
});

router.get('/api/fitbit/test', jwt, async ctx => {
    if (ctx.session.access_token) {
        ctx.body = true;
    } else {
        ctx.body = false;
    }
});

router.get('/auth/fitbit', async ctx => {
    // let { username } = ctx.query;

    var fitbitAuth = new ClientOAuth2({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        accessTokenUri: 'https://api.fitbit.com/oauth2/token',
        authorizationUri: 'https://www.fitbit.com/oauth2/authorize',
        redirectUri: REDIRECT_URI,
        scopes: ['activity', 'heartrate', 'sleep', 'weight'],
    });

    var uri = fitbitAuth.code.getUri();
    ctx.redirect(uri);
});

router.post('/api/fitbit', jwt, async ctx => {
    let { data_set, date = 'today', period = '1y' } = ctx.request.body;

    // let url = 'https://api.fitbit.com/1/user/-';
    // switch(data_set) {
    //     case 'heart_rate': {
    //         url += `/activities/heart/date/${date}/${period}.json`;
    //         break;
    //     }
    // }
    let url =
        'https://api.fitbit.com/1/user/-/activities/steps/date/2017-01-12/7d.json';

    let headers = {
        Authorization: `Bearer ${ctx.session.access_token}`,
    };

    let requestObject = axios.create({
        headers,
    });

    try {
        let response = await requestObject.get(url);
        ctx.body = response.data;
    } catch (e) {
        if (e.response) {
            let { data } = e.response;
            ctx.body = data;
        } else ctx.body = e.message;
    }
});

router.post('/analysis/step', async ctx => {
    let { data } = ctx.request.body;
    let res = await deterDataSize(data);

    ctx.body = res;
});

router.get('/report/generate', async ctx => {
    let html = generateLineGraph([], [], 400, 400);

    ctx.body = `<html><body>${html}</body></html>`;
});

router.post('/graphql', jwt, graphqlKoa({ schema: myGraphQLSchema }));
router.get('/graphql', jwt, graphqlKoa({ schema: myGraphQLSchema }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

router.get('*', async ctx => {
    await ctx.render('index.pug');
});

function generateLineGraph(data, labels, chartWidth, chartHeight) {
    const { window } = new JSDOM('<!DOCTYPE html>');
    const pieData = [12, 31];

    var arc = d3.svg.arc().outerRadius(chartWidth / 2 - 10).innerRadius(0);

    var colours = [
        '#F00',
        '#000',
        '#000',
        '#000',
        '#000',
        '#000',
        '#000',
        '#000',
        '#000',
    ];

    window.d3 = d3.select(window.document); //get d3 into the dom

    //do yr normal d3 stuff
    var svg = window.d3
        .select('body')
        .append('div')
        .attr('class', 'container') //make a container div to ease the saving process
        .append('svg')
        .attr({
            xmlns: 'http://www.w3.org/2000/svg',
            width: chartWidth,
            height: chartHeight,
        })
        .append('g')
        .attr(
            'transform',
            'translate(' + chartWidth / 2 + ',' + chartWidth / 2 + ')'
        );

    svg
        .selectAll('.arc')
        .data(d3.layout.pie()(pieData))
        .enter()
        .append('path')
        .attr({
            class: 'arc',
            d: arc,
            fill: function(d, i) {
                return colours[i];
            },
            stroke: '#fff',
        });

    return window.d3.select('.container').html();
}

module.exports = {
    router,
};

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
