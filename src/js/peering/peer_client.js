import Peer from "peerjs";
import { PeerBehaviour } from "./peer_behaviour";

export class PeerClient extends PeerBehaviour {
    constructor(root, app, hostId, mainMenu) {
        super(root, app);
        app.peer = this;
        this.app = app;
        this.mainMenu = mainMenu;
        this.root = root;
        this.map = null;
        this.connected = false;
        this.peer = new Peer(null, {
            debug: 2,
        });

        this.peer.on("open", function (id) {
            // Workaround for peer.reconnect deleting previous id
            if (app.peer.peer.id === null) {
                console.log("Received null id from peer open");
                app.peer.peer.id = app.peer.lastPeerId;
            } else {
                app.peer.lastPeerId = app.peer.peer.id;
            }

            app.peer.connected = true;
            app.peer.join(hostId);

            console.log("ID: " + app.peer.peer.id);
        });
        this.peer.on("connection", function (c) {
            // Disallow incoming connections
            c.on("open", function () {
                c.send("Sender does not accept incoming connections");
                setTimeout(function () {
                    c.close();
                }, 500);
            });
        });
        this.peer.on("disconnected", function () {
            console.log("Connection lost. Please reconnect");

            // Workaround for peer.reconnect deleting previous id
            app.peer.peer.id = app.peer.lastPeerId;
            app.peer.peer._lastServerId = app.peer.lastPeerId;
            app.peer.peer.reconnect();
        });
        this.peer.on("close", function () {
            app.peer.conn = null;
            console.log("Connection destroyed");
        });
        this.peer.on("error", function (err) {
            console.log(err);
            alert("" + err);
        });
    }

    join(hostId) {
        var app = this.app;

        // Close old connection
        if (this.conn) {
            this.conn.close();
        }

        while (!this.connected) {}

        // Create connection to destination peer specified in the input field
        this.conn = this.peer.connect(hostId, {
            reliable: true,
        });

        this.conn.on("open", function () {
            console.log("Connected to: " + app.peer.conn.peer);

            app.peer.conn.send("hello");
        });
        // Handle incoming data (messages only since this is the signal sender)
        this.conn.on("data", function (data) {
            console.log("Data recieved");
            console.log(data);
            app.peer.handleDataReceived(data);
        });
        this.conn.on("close", function () {
            console.log("Connexion closed");
        });
    }

    handleDataReceived(data) {
        console.log("process data");
        console.log(data);
        if (data.action != null) {
            this.handleAction(data);
        } else {
            this.map = data;
            this.mainMenu.resumeGame(this.mainMenu.savedGames[0]);
        }
    }
}
