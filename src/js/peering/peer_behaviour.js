import { Vector } from "../core/vector";
import { MetaBeltBuilding } from "../game/buildings/belt";
import { MetaConstantSignalBuilding } from "../game/buildings/constant_signal";
import { MetaCutterBuilding } from "../game/buildings/cutter";
import { MetaDisplayBuilding } from "../game/buildings/display";
import { MetaFilterBuilding } from "../game/buildings/filter";
import { MetaHubBuilding } from "../game/buildings/hub";
import { MetaLeverBuilding } from "../game/buildings/lever";
import { MetaLogicGateBuilding } from "../game/buildings/logic_gate";
import { MetaMinerBuilding } from "../game/buildings/miner";
import { MetaMixerBuilding } from "../game/buildings/mixer";
import { MetaPainterBuilding } from "../game/buildings/painter";
import { MetaReaderBuilding } from "../game/buildings/reader";
import { MetaRotaterBuilding } from "../game/buildings/rotater";
import { MetaSplitterBuilding } from "../game/buildings/splitter";
import { MetaStackerBuilding } from "../game/buildings/stacker";
import { MetaTrashBuilding } from "../game/buildings/trash";
import { MetaUndergroundBeltBuilding } from "../game/buildings/underground_belt";
import { MetaVirtualProcessorBuilding } from "../game/buildings/virtual_processor";
import { MetaWireBuilding } from "../game/buildings/wire";
import { MetaWireTunnelBuilding } from "../game/buildings/wire_tunnel";
import { MetaBuilding } from "../game/meta_building";

export class PeerBehaviour {
    constructor(root, app) {
        this.root = root;
        this.app = app;
        this.conn = null;
    }

    sendAction(action, tile, metaBuilding, variant, remoteRotation) {
        console.log("sending action");
        console.log(action);
        if (this.conn != null) {
            this.conn.send({
                action: action,
                tile: tile,
                metaBuilding: metaBuilding,
                variant: variant,
                remoteRotation: remoteRotation,
            });
        }
    }

    handleAction(data) {
        var tile = new Vector(data.tile.x, data.tile.y);
        if (data.action == "put") {
            this.root.hud.parts.buildingPlacer.remotePlaceCurrentBuildingAt(
                tile,
                this.objectToBuilding(data.metaBuilding),
                data.variant,
                data.remoteRotation
            );
        } else if (data.action == "delete") {
            this.root.hud.parts.buildingPlacer.remoteDeleteAtPosition(tile);
        }
    }

    objectToBuilding(metaBuilding) {
        if (metaBuilding.id == "belt") {
            return new MetaBeltBuilding();
        } else if (metaBuilding.id == "constant_signal") {
            return new MetaConstantSignalBuilding();
        } else if (metaBuilding.id == "cutter") {
            return new MetaCutterBuilding();
        } else if (metaBuilding.id == "display") {
            return new MetaDisplayBuilding();
        } else if (metaBuilding.id == "filter") {
            return new MetaFilterBuilding();
        } else if (metaBuilding.id == "hub") {
            return new MetaHubBuilding();
        } else if (metaBuilding.id == "lever") {
            return new MetaLeverBuilding();
        } else if (metaBuilding.id == "logic_gate") {
            return new MetaLogicGateBuilding();
        } else if (metaBuilding.id == "miner") {
            return new MetaMinerBuilding();
        } else if (metaBuilding.id == "mixer") {
            return new MetaMixerBuilding();
        } else if (metaBuilding.id == "painter") {
            return new MetaPainterBuilding();
        } else if (metaBuilding.id == "reader") {
            return new MetaReaderBuilding();
        } else if (metaBuilding.id == "rotater") {
            return new MetaRotaterBuilding();
        } else if (metaBuilding.id == "splitter") {
            return new MetaSplitterBuilding();
        } else if (metaBuilding.id == "stacker") {
            return new MetaStackerBuilding();
        } else if (metaBuilding.id == "trash") {
            return new MetaTrashBuilding();
        } else if (metaBuilding.id == "underground_belt") {
            return new MetaUndergroundBeltBuilding();
        } else if (metaBuilding.id == "virtual_processor") {
            return new MetaVirtualProcessorBuilding();
        } else if (metaBuilding.id == "wire_tunnel") {
            return new MetaWireTunnelBuilding();
        } else if (metaBuilding.id == "wire") {
            return new MetaWireBuilding();
        }
    }
}
