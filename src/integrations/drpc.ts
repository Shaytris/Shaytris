// (c) 2024 written by chlove
// under the MIT licence
import { app, BrowserWindow, ipcMain } from 'electron';
import * as DiscordRPC from 'discord-rpc';

const clientId = 'place_a_client_id_here';
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
let mainWindow: BrowserWindow | null = null;
let currentUser = 'User'; // Default username if none is set

async function setActivity(route: string) {
    if (!rpc) return;

    const activityOptions: DiscordRPC.Presence = {
        startTimestamp: new Date(),
        largeImageKey: 'large-image',
        largeImageText: `Logged in as ${currentUser}`,
        instance: true,
    };

    switch (route) {
        case '#game':
            activityOptions.details = 'In match';
            activityOptions.state = 'Placing blocks!';
            break;
        case '#menu':
            activityOptions.details = 'In the Menus!';
            break;
            
        case '#editor':
                activityOptions.details = 'Editing a map!';
                break;
    }

    rpc.setActivity(activityOptions);
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: `${__dirname}/preload.js`, // Ensure you have a preload script
        },
    });

    mainWindow.loadURL('your-app-url');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

ipcMain.on('route-changed', (event, route) => {
    setActivity(route);
});

ipcMain.on('user-logged-in', (event, username) => {
    currentUser = username;
    setActivity(window.location.hash || '#menu'); 
});

app.on('ready', async () => {
    createWindow();

    try {
        await rpc.login({ clientId });
        console.log('Discord RPC connected');
        setActivity('#menu'); // Default activity
    } catch (error) {
        console.error('Failed to connect to Discord RPC:', error);
    }
});

app.on('before-quit', () => {
    if (rpc) rpc.destroy();
});
