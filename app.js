require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const passport = require('passport');
const discordStrategy = require('./strategies/discordstrategy');
const db = require('./database/database');
app.set('view engine', 'pug');

db.then(()=>console.log ('Connected to MongoDB.')).catch(err =>console.log(err));

// Routes
const authRoute = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard')


app.use(session({
    secret: 'some random secret',
    cookie: {
        maxAge: 60000*60*24
    },
    saveUninitialized: false,
    name: 'discord.oauth2'
}));

// Passport

app.use(passport.initialize());
app.use(passport.session());

// Middleware Routes
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRouter);

app.use('/static', express.static('public'));

app.get('/', (req,res)=>{
    res.render('index',{title: 'hey', message: 'Log in with Discord', url: '/auth', style: '/static/style/style.css'});
});

app.listen(PORT, () =>{
    console.log(`Now listening to requests on port ${PORT}`);
});
