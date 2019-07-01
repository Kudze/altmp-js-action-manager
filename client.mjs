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
                        action.getPosition()
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
    new: (pos, callback, title, {maxReachDist = MAX_DEFAULT_ACTION_REACT_DIST} = {}) => {
        let id = findUnusedActionID();
        
        ACTION_LIST[id] = {
            maxReachDist: maxReachDist,
            _pos: pos,
            callback: callback,
            getPosition() { 
                const posType = typeof this._pos;

                if(posType === "function")
                    return this._pos();

                return this._pos;
            },
            destroy() {
                if(this.text3D !== undefined)
                    this.text3D.destroy();

                ACTION_LIST[id] = undefined;
            }
        };

        if(title !== undefined && title !== null) {
            let titleType = typeof title;

            if(titleType === "string")
                ACTION_LIST[id].text3D = ALTText3D.new(
                    title,
                    () => {
                        return ACTION_LIST[id].getPosition()
                    }
                );

            else if(titleType === "object")
                ACTION_LIST[id].text3D = ALTText3D.new(
                    `~o~${title.title}\n~w~Press ~o~Y~w~ to ~o~${title.action}~w~.`,
                    () => {
                        return ACTION_LIST[id].getPosition()
                    }
                );

            else if(titleType === "function")
                ACTION_LIST[id].text3D = title();
        }

        return {
            destroy() {
                ACTION_LIST[id].destroy();
            },
            getPosition() {
                return ACTION_LIST[id].getPosition();
            },
            setPosition(position) {
                return ACTION_LIST[id]._pos = position;
            }
        };
    }
}

alt.on(
    `keydown`,
    (key) => {
        if (key === ACTION_REQUEST_KEY) actionRequest();
    }
)