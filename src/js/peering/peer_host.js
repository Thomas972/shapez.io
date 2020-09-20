import Peer from "peerjs";
import { PeerBehaviour } from "./peer_behaviour";

export class PeerHost extends PeerBehaviour {
    constructor(root, app) {
        super(root, app);
        app.peer = this;
        this.conn = null;

        this.peer = new Peer(null, {
            debug: 2,
        });

        this.peer.on("open", function (id) {
            // Workaround for peer.reconnect deleting previous id
            if (app.peer.peer.id === null) {
                console.log("Received null id from peer open");
                app.peer.peer.id = app.lastPeerId;
            } else {
                app.lastPeerId = app.peer.peer.id;
            }

            console.log("ID: " + app.peer.peer.id);
        });
        this.peer.on("connection", function (c) {
            // Allow only a single connection
            if (app.peer.conn && app.peer.conn.open) {
                c.on("open", function () {
                    c.send("Already connected to another client");
                    setTimeout(function () {
                        c.close();
                    }, 500);
                });
                return;
            }

            app.peer.conn = c;
            console.log("Connected to: " + app.peer.conn.peer);
            app.peer.ready();
            app.peer.handleDataReceived("hello");
        });
        this.peer.on("disconnected", function () {
            console.log("Connection lost. Please reconnect");

            // Workaround for peer.reconnect deleting previous id
            app.peer.peer.id = app.lastPeerId;
            app.peer.peer._lastServerId = app.lastPeerId;
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

    ready() {
        let app = this.app;
        this.conn.on("data", function (data) {
            console.log("Data recieved");
            console.log(data);
            app.peer.handleDataReceived(data);
        });
        this.conn.on("close", function () {
            app.peer.conn = null;
        });
    }

    handleDataReceived(data) {
        console.log("process data");
        console.log(data);
        if (data == "hello") {
            this.conn.send(this.root.savegame.getCurrentDump());
        } else {
            this.handleAction(data);
        }
    }
}
