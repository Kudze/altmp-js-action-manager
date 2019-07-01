# altmp-js-action-manager

## Description

This adds client-side utilities to help you create client-side actions.

RoadMap:
* Add container utilities. (foreach, get(id), and more...)
* Add some getters & setters. (Position, rotation)
* Add client-side streaming. (Not mandatory)
* Maybe marker support as well. (Not really sure if it would be useful)

## Dependencies

This utility depends on https://github.com/Kudze/altmp-js-3dtext-spawner

## Instalation

1. Install https://github.com/Kudze/altmp-js-3dtext-spawner
2. Clone the repository.
3. Install as regular alt:v resource.

## Most basic example (invisible & stationary)

```
import ALTAction from "altmp-js-action-manager";

const someGroundItemID = 100;
let action = ALTAction.new(
    { //<-- Position
        "x": 0,
        "y": 0,
        "z": 0
    },
    () => { //<-- Callback. (The code which is executed if action is done.)
        alt.emitServer(
            "takeItem",
            someGroundItemID
        );
    },
    undefined //<-- 3DText type.
);
```

## Position types:

1. Static (shown in first example)
2. Dynamic (Action is attached to (moving with) physics-enabled 3D prop)

```
import ALTAction from "altmp-js-action-manager";
import ALTProp from "altmp-js-prop-spawner";

let prop = ALTProp.new(
    "prop_pineapple",
    {x: 0, y: 0, z: 80},
    {
        dynamic: true
    }
);

const someGroundItemID = 100;
let action = ALTAction.new(
    () => {
        return prop.getPosition()
    },
    () => { //<-- Callback. (The code which is executed if action is done.)
        alt.emitServer(
            "takeItem",
            someGroundItemID
        );
    },
    undefined //<-- 3DText type.
);
```

## 3DText types:

(On 2nd and 3rd examples 3DText will always be attached to action)

(On 4th example this is customizeable)

1. No 3DText (shown in first example)
2. Regular Action 3D text

```
import ALTAction from "altmp-js-action-manager";

const someGroundItemID = 100;
let action = ALTAction.new(
    { //<-- Position
        "x": 0,
        "y": 0,
        "z": 0
    },
    () => { //<-- Callback. (The code which is executed if action is done.)
        alt.emitServer(
            "takeItem",
            someGroundItemID
        );
    },
    { //<-- 3DText type.
        title: "Pineapple",
        action: "pick up"
    }
);
```

3. Custom 3D text

```
import ALTAction from "altmp-js-action-manager";

const someGroundItemID = 100;
let action = ALTAction.new(
    { //<-- Position
        "x": 0,
        "y": 0,
        "z": 0
    },
    () => { //<-- Callback. (The code which is executed if action is done.)
        alt.emitServer(
            "takeItem",
            someGroundItemID
        );
    },
    "~o~I'm a action with a custom 3D text!" //<-- 3DText type.
);
```

4. Fully customizable 3D Text

```
import ALTAction from "altmp-js-action-manager";

const someGroundItemID = 100;
let action = ALTAction.new(
    { //<-- Position
        "x": 0,
        "y": 0,
        "z": 0
    },
    () => { //<-- Callback. (The code which is executed if action is done.)
        alt.emitServer(
            "takeItem",
            someGroundItemID
        );
    },
    () => { //<-- 3DText (Executed only upon creation).
        //(Create some custom Text3D...)
        return someText3D;
    }
);
```



