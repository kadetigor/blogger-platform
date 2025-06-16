"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const settings_1 = require("../settings/settings");
console.log('Starting script...');
try {
    // Load these from your SETTINGS or hardcode them
    const clientId = settings_1.SETTINGS.GOOGLE_CLIENT_ID;
    const clientSecret = settings_1.SETTINGS.GOOGLE_CLIENT_SECRET;
    const redirectUri = 'http://localhost'; // <- here is the change // Simplest
    console.log('Loaded SETTINGS:');
    console.log('clientId:', clientId);
    console.log('clientSecret:', clientSecret ? '[HIDDEN]' : 'undefined');
    if (!clientId || !clientSecret) {
        console.error('Missing clientId or clientSecret — check your SETTINGS');
        process.exit(1);
    }
    const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const scopes = [
        'https://mail.google.com/'
    ];
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });
    console.log('Authorize this app by visiting this url:\n', authUrl);
}
catch (err) {
    console.error('Error occurred:', err);
}
