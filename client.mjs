import alt from "alt";
import game from "natives";

import ALTText3D from "altmp-js-3dtext-spawner";

const MAX_DEFAULT_ACTION_REACT_DIST = 3;
const ACTION_REQUEST_KEY = 89;

let dist = (pos1, pos2) => {
    let pos = {
        x: pos1.x - pos2.x,
        y: pos1.y - pos2.y,
        z: pos1.z - pos2.z
    };

    return Math.sqrt(
        pos.x*pos.x + pos.y*pos.y + pos.z*pos.z 
    );
};

let ACTION_LIST = [];

let findUnusedActionID = () => {
    for(let i = 0; i < ACTION_LIST.length; i++)
        if(ACTION_LIST[i] === undefined) return i;

    return ACTION_LIST.length;
};

//TODO: handle multiple actions in one place.
let actionRequest = () => {
    if(alt.gameControlsEnabled()) {
        let player = alt.getLocalPlayer();

        ACTION_LIST.forEach(
            (action) => {
                if(action !== undefined) {
                    let distance = dist(
                        player.pos,
                        action.pos
                    );

                    if(distance < action.maxReachDist) {
                        action.callback();
                    }
                }
            }
        );
    }
};

export default {
    new: (pos, callback, title, {maxReachDist = MAX_DEFAULT_ACTION_REACT_DIST}) => {
        let id = findUnusedActionID();

        let text3D = undefined;
        if(title !== undefined && title !== null) {
            let titleType = typeof title;

            if(titleType === "string")
                text3D = ALTText3D.new(
                    title,
                    () => {
                        ACTION_LIST[id].getPosition()
                    }
                );

            else if(titleType === "object")
                text3D = ALTText3D.new(
                    `~o~${title.title}\n~w~Press ~o~Y~w~ to ~o~${title.action}~w~.`,
                    () => {
                        ACTION_LIST[id].getPosition()
                    }
                );

            else if(titleType === "function")
                text3D = title();
        }

        ACTION_LIST[id] = {
            text3D: text3D,
            maxReachDist: maxReachDist,
            pos: pos,
            callback: callback,
            getPosition: () => { 
                const posType = typeof this.pos;

                if(posType === "function")
                    return this.pos();

                if(posType === "object") {
                    if(this.pos.position !== undefined)
                        return this.pos.position;

                    if(this.pos.pos !== undefined)
                        return this.pos.pos;

                    return this.pos;
                }

                else alt.warn("altmp-js-action-manager unable to decypher this.pos in getPosition()");

                return {
                    x: 0,
                    y: 0,
                    z: 0
                };
            },
            destroy: () => {
                if(this.text3D !== undefined)
                    this.text3D.destroy();

                ACTION_LIST[id] = undefined;
            }
        };

        return {
            id: id,
            destroy: () => {
                ACTION_LIST[this.id].destroy();
            },
        };
    }
}

alt.on(
    `keydown`,
    (key) => {
        if (key === ACTION_REQUEST_KEY) actionRequest();
    }
)