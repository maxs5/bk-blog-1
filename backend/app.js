require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || '0.0.0.0';
const siteUrl = process.env.SITE_URL || `http://localhost:${port}`;
const app = express();

app.use(express.static(path.resolve(__dirname, '..', 'frontend', 'build')));

app.use(cookieParser());
app.use(express.json());

app.use('/api', routes);
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'));
});

const atlasConnectionString = process.env.DB_CONNECTION_STRING_ATLAS;
const localConnectionString = process.env.DB_CONNECTION_STRING;

const isAtlasConfigured =
    atlasConnectionString &&
    !atlasConnectionString.includes('<username>') &&
    !atlasConnectionString.includes('<password>') &&
    !atlasConnectionString.includes('<cluster-url>');

if (!localConnectionString && !isAtlasConfigured) {
    console.error(
        'DB connection string is not set. Add DB_CONNECTION_STRING or DB_CONNECTION_STRING_ATLAS to backend/.env'
    );
    process.exit(1);
}

async function connectDatabase() {
    if (isAtlasConfigured) {
        try {
            await mongoose.connect(atlasConnectionString, { serverSelectionTimeoutMS: 7000 });
            console.log('Connected to MongoDB Atlas');
            return;
        } catch (error) {
            console.error('Atlas connection failed, fallback to local MongoDB:', error.message);
        }
    }

    if (!localConnectionString) {
        console.error('Local DB_CONNECTION_STRING is missing in backend/.env');
        process.exit(1);
    }

    await mongoose.connect(localConnectionString);
    console.log('Connected to local MongoDB');
}

connectDatabase()
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server started on ${host}:${port}`);
            console.log(`Public site URL: ${siteUrl}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    });

