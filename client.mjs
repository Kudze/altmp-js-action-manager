import alt from "alt";
import game from "natives";

const MAX_3D_DIST = 20;
const MAX_ACTION_REACT_DIST = 3;

/**
 * Function is borrowed from: https://forum.altv.mp/index.php?/topic/33-basic-3dtext/
 * 
 * @param x 
 * @param y 
 * @param z 
 * @param name 
 */
let draw3dText = (pos, message) => {
    const [bol, _x, _y] = game.getScreenCoordFromWorldCoord(pos.x, pos.y, pos.z);
    const camCord = game.getGameplayCamCoords();
    const dist = game.getDistanceBetweenCoords(camCord.x,camCord.y,camCord.z, pos.x, pos.y, pos.z, 1);

    if (dist > MAX_3D_DIST) return;

    let scale = (4.00001/dist) * 0.3
    if (scale > 0.2)
        scale = 0.2;

    const fov = (1/game.getGameplayCamFov())*100;
	scale = scale*fov;
  
    if (bol){
        game.setTextScale(scale, scale);
        game.setTextFont(0);
        game.setTextProportional(true);
        game.setTextColour(255, 255, 255, 255);
        game.setTextDropshadow(0, 0, 0, 0, 255);
        game.setTextEdge(2, 0, 0, 0, 150);
        game.setTextDropShadow();
        game.setTextOutline();
        game.setTextCentre(true);
        game.beginTextCommandDisplayText("STRING");
        game.addTextComponentSubstringPlayerName(message);
        game.endTextCommandDisplayText(_x,_y + 0.025);
    }

}

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

let actions = [];

//TODO: handle multiple actions in one place.
let actionRequest = () => {
    if(alt.gameControlsEnabled()) {
        let player = alt.getLocalPlayer();

        actions.forEach(
            (action) => {
                let distance = dist(
                    player.pos,
                    action.pos
                );

                if(distance < MAX_ACTION_REACT_DIST) {
                    action.callback();
                }
            }
        );
    }
};

let findUnusedActionID = () => {
    for(let i = 0; i < actions.length; i++)
        if(actions[i] === undefined) return i;

    return actions.length;
};

export function registerAction(
    pos,
    title,
    actionName,
    callback
) {
    let id = findUnusedActionID();

    actions[id] = {
        pos: {...pos},
        message: `~o~${title}\n~w~Press ~o~Y~w~ to ~o~${actionName}~w~.`,
        callback: callback
    };

    return id;
}

export function destroyAction(id) {
    actions[id] = undefined;
}

alt.on(
    'update',
    () => {
        actions.forEach(
            (action) => {
                draw3dText(
                    action.pos,
                    action.message
                )
            }
        )
    }
)

alt.on(
    `keydown`,
    () => {
        if (key === 89) actionRequest();
    }
)