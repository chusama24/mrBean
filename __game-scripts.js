// GameConstants.js
var GameConstants = pc.createScript('gameConstants');

// initialize code called once per entity
GameConstants.prototype.initialize = function () {
    this.app.events = {
        soundManager: {
            setMusic: 'SoundManager:SetMusic',
            setSFX  : 'SoundManager:SetSFX', 
        },
    };
};

// swap method called for script hot-reloading
// inherit your script state here
// GameConstants.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// ReferenceManager.js
var ReferenceManager = pc.createScript('referenceManager');

// Add references here in for of attributes

// initialize code called once per entity
ReferenceManager.prototype.initialize = function () {
    ReferenceManager.instance = this;
};

// swap method called for script hot-reloading
// inherit your script state here
// ReferenceManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// MenuManager.js
var MenuManager = pc.createScript('menuManager');

MenuManager.attributes.add('version', { type: 'string', title: 'Version', default: '0.0.1'});
MenuManager.attributes.add('versionTxt', { type: 'entity', title: 'Version Text'});

MenuManager.attributes.add('prevPanel', {
    type: 'number',
    title: 'Previous Panel',
    enum: [
        { 'Home': 0 },
        { 'Costumes': 1 },
        { 'Gameplay': 2 },
        { 'Themes': 3 },
        { 'Leaderboard': 4 },
        { 'TCMenu': 5 },
        { 'CloseOverlay': 6 },
    ],
});

MenuManager.attributes.add('currentPanel', {
    type: 'number',
    title: 'Current Panel',
    enum: [
        { 'Home': 0 },
        { 'Costumes': 1 },
        { 'Gameplay': 2 },
        { 'Themes': 3 },
        { 'Leaderboard': 4 },
        { 'TCMenu': 5 },
        { 'CloseOverlay': 6 },
    ],
});

MenuManager.attributes.add('screenBlocker', { type: 'entity', title: 'Screen Blocker'})

MenuManager.attributes.add('allPanels', {
    type: 'json',
    schema: [
        { name: 'overlay', type: 'boolean' },
        { name: 'panel', type: 'entity' },
    ],
    array: true
});

MenuManager.States = {
    Home: 0,
    Costumes: 1,
    Gameplay: 2,
    Themes: 3,
    Leaderboard: 4,
    TCMenu: 5,
    CloseOverlay: 6,
};

// initialize code called once per entity
MenuManager.prototype.initialize = function () {
    console.log('Version ', this.version);
    this.versionTxt.element.text = this.version;
    MenuManager.Instance = this;

    this.prevState = undefined;
    this.currentState = this.prevPanel;
    this.currentOverlays = [];

    // this.app.on('MenuManager:BlockScreen', block => this.screenBlocker.enabled = block);
};

MenuManager.prototype.postInitialize = function () {
};


// update code called every frame
MenuManager.prototype.update = function (dt) {

};

MenuManager.prototype.changeState = function (newState) {
   // console.warn("Updating State: ", newState);
    if (this.currentState === newState) return;

    if (this.manageOverlayState(newState)) return;

    // // console.log("Not overlay");

    this.prevState = this.currentState;
    this.currentState = newState;

    var prevPanel = this.allPanels[this.prevState].panel;
    var currentPanel = this.allPanels[this.currentState].panel;

    // let onPrevPanelClosed = (duration) => {
    //     CustomCoroutine.Instance.set(() => {
    //         currentPanel.enabled = true;
    //     }, duration);
    // };

    // if (!this.allPanels[this.currentState].overlay && prevPanel.enabled)
    //     prevPanel.fire('disable', onPrevPanelClosed, 2);
    // else
    //     onPrevPanelClosed(0);

    if (!this.allPanels[this.currentState].overlay)
        prevPanel.enabled = false;

    // console.log("Home Menu Enabled");
    currentPanel.enabled = true;
};

MenuManager.prototype.manageOverlayState = function (state) {

    if (this.currentOverlays.length > 0 && state === MenuManager.States.CloseOverlay) {
        this.allPanels[this.currentOverlays.pop()].panel.enabled = false;
        return true;
    }

    if (this.allPanels[state].overlay) {
        this.allPanels[state].panel.enabled = true;
        this.currentOverlays.push(state);
    }

    return this.allPanels[state].overlay;
};

MenuManager.prototype.isState = function(state) {
    return this.currentState === state;
};

// swap method called for script hot-reloading
// inherit your script state here
// MenuManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// DragEvent.js
var DragEvent = pc.createScript('dragEvent');

DragEvent.attributes.add('captureCount', { title: 'Capture Count', type: 'number', default: -1 });
DragEvent.attributes.add('away', { title: 'Away', type: 'boolean' });
DragEvent.attributes.add('global', { title: 'Global Space', type: 'boolean' });
DragEvent.attributes.add('target', { title: 'Target', type: 'entity' });
// DragEvent.attributes.add('position', { type: 'vec3' });
DragEvent.attributes.add('minDistance', { title: 'Minimum Distance', type: 'number'});

DragEvent.attributes.add('eventName', { title: 'Event To Raise', type: 'string'});
DragEvent.attributes.add('uiSlider', { title: 'UI Slider', type: 'entity'});

DragEvent.attributes.add('args', {
    type: 'json',
    title: 'Arguments',
    schema: [
        { name: 'value', type: 'string'}, 
    ],
    array: true
});

DragEvent.attributes.add('objsActiveState', {
    type: 'json',
    title: 'Entities To Manage',
    schema: [
        { title: 'Enabled', name: 'setActive', type: 'boolean', default: true}, 
        // { name: 'useInput', type: 'boolean', default: true}, 
        { title: 'Entity', name: 'obj', type: 'entity'}, 
    ],
    array: true
});

// initialize code called once per entity
DragEvent.prototype.initialize = function() {
    
    this.capturedCount = 0;
    
    this.onEnable();
    this.on('enable', this.onEnable, this);
};

DragEvent.prototype.onEnable = function() {
    this.capturedCount = 0;
    this.currentCaptureID = 0;

    if (this.entity.element)
        this.entity.element.enabled = true;
};
// update code called every frame
DragEvent.prototype.update = function(dt) {
    
    if (!this.target) return;
    
    let slider = this.uiSlider === null ? this.entity.script.uiSlider : this.uiSlider.script.uiSlider;
    if (!slider.isDragging) return;
    
    let point = this.global ? this.entity.getPosition() : this.entity.getLocalPosition();
    let end = this.global ? this.target.getPosition() : this.target.getLocalPosition();
    
    // // console.log(this.entity.name + ": Distance: " + point.distance(end));

    let condition = this.away ? point.distance(end) >= this.minDistance : point.distance(end) <= this.minDistance;
    
    if (condition && this.checkCaptureSettings())
    {
        this.capturedCount++;
        // console.log("captured: " + this.capturedCount);
        
        this.raiseEvent();
        
        for(let i = 0; i < this.objsActiveState.length; i++)
        {
            this.objsActiveState[i].obj.enabled = this.objsActiveState[i].setActive;
            // this.objsActiveState[i].obj.element.useInput = this.objsActiveState[i].useInput;
        }
    }
    else if (!condition && this.currentCaptureID !== this.capturedCount)
    {
        // console.log(this.entity.name + ": [away]captured: " + this.currentCaptureID);
        this.currentCaptureID = this.capturedCount;
    }
};

DragEvent.prototype.raiseEvent = function() {
    
    if (this.eventName.length < 1) return;
    let args = [];


    for(let i = 0; i < this.args.length; i++)
        args.push(this.args[i].value);
    this.app.fire(this.eventName, args);
};

DragEvent.prototype.checkCaptureSettings = function() {
    // // console.log(this.capturedCount + " < " + this.captureCount + " || " + this.captureCount + " === -1 -> " + this.entity.name);
    let flag1 = this.capturedCount < this.captureCount || this.captureCount === -1;
    // // console.log(this.currentCaptureID + " === " + this.capturedCount + " && " + flag1);
    return  this.currentCaptureID === this.capturedCount && flag1;
};

// swap method called for script hot-reloading
// inherit your script state here
// DragEvent.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// swipeEvent.js
var SwipeEvent = pc.createScript('swipeEvent');

SwipeEvent.attributes.add('minimumSwipeDistance', { title: 'Minimum Swipe Distance', type: 'vec2'});
SwipeEvent.attributes.add('useAny', { title: 'Use Any', type: 'boolean'});

SwipeEvent.attributes.add('eventName', { title: 'Event Name', type: 'string'});

SwipeEvent.attributes.add('args', {
    type: 'json',
    title: 'Arguments',
    schema: [
        { name: 'value', type: 'string'}, 
    ],
    array: true
});

SwipeEvent.attributes.add('objsActiveState', {
    type: 'json',
    title: 'Entites',
    schema: [
        { title: 'Enabled', name: 'setActive', type: 'boolean', default: true}, 
        { title: 'Use Input', name: 'useInput', type: 'boolean', default: true}, 
        { title: 'Entity', name: 'obj', type: 'entity'}, 
    ],
    array: true
});


// initialize code called once per entity
SwipeEvent.prototype.initialize = function () {

    this.initialized = false;

    this.onEnable();
    this.on('enable', this.onEnable, this);
    this.on('disable', this.onDisable, this);
    this.on('destroy', this.onDisable, this);
};

SwipeEvent.prototype.onEnable = function () {
    if (this.initialized) return;
    this.initialized = true;
    // console.log("OnEnable: " + this.entity.name);

    this.handle = this.entity;
    this.addHandleListeners();

    this.touchId = -1;

    this.mousePos = new pc.Vec3();
    this.screen = this.getUIScreenComponent();
    this.isCaptured = false;
    this.isOnMe = false;

    this.isCaptured = false;
    this.isOnMe = false;
};

SwipeEvent.prototype.onDisable = function () {
    if (!this.initialized) return;
    this.initialized = false;
    // console.log("Destroy: " + this.entity.name);
    this.handle.element.off(pc.EVENT_MOUSEDOWN, this.onPressDown, this);
    this.app.mouse.off(pc.EVENT_MOUSEUP, this.onPressUp, this);

    if (this.app.touch) {
        this.handle.element.off(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.off(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
        this.app.touch.off(pc.EVENT_TOUCHCANCEL, this.onTouchEnd, this);
    }
};

SwipeEvent.prototype.getUIScreenComponent = function() {
    return this.handle.element.screen.screen;
};

SwipeEvent.prototype.addHandleListeners = function() {
    
    // this.handle.element.useInput = true;
    this.handle.element.on(pc.EVENT_MOUSEDOWN, this.onPressDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.onPressUp, this);
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onPressMove, this);
        
    if( this.app.touch )
    {
        // console.log("initing touches");
        this.handle.element.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
        this.app.touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchEnd, this);
    }     
};

SwipeEvent.prototype.onTouchStart = function(ev) {
    var touch = ev.changedTouches[0];
    this.touchId = touch.identifier;
    this.startDrag( ev.x, ev.y );
    ev.event.stopPropagation();
};

SwipeEvent.prototype.onTouchEnd = function(ev) {
    for(var i=0; i< ev.changedTouches.length; i++ ) 
    {
        var t = ev.changedTouches[i];
        if( t.id == this.touchId )
        {
            ev.event.stopImmediatePropagation();
            // e.event.stopPropagation();
            this.touchId = -1;
            this.endDrag( t.x, t.y );
            return;
        }
    }
};


SwipeEvent.prototype.onPressDown = function(ev) {
    ev.event.stopImmediatePropagation();
            // ev.event.stopPropagation();

    this.startDrag(ev.x,ev.y);
};

SwipeEvent.prototype.onPressUp = function(ev) {
    ev.event.stopImmediatePropagation();
            // e.event.stopPropagation();

    // ev.event.stopImmediatePropagation();
    this.endDrag(ev.x,ev.y);
};
        
SwipeEvent.prototype.startDrag = function(x,y) {
    this.isOnMe = true;
    this.setMouseXY(x,y);
};

SwipeEvent.prototype.endDrag = function(x,y) {
    
    let xMag = Math.abs(x - this.mousePos.x);
    let yMag = Math.abs(y - this.mousePos.y);
    
    // console.log("Mag: " + xMag + ", " + yMag);
    
    if (this.isOnMe)
        this.manageSwipe(xMag, yMag);
    else
        // console.log("No on me");
    // this.setMouseXY(x,y);
    
    this.isOnMe = false;
};
SwipeEvent.prototype.setMouseXY = function(x,y) {
    this.mousePos.x = x;
    this.mousePos.y = y;
    // // console.log("mouse: " + x + ", " + y);
};

SwipeEvent.prototype.manageSwipe = function(x, y) {
    
    if (!this.entity.element.useInput) return;
    
    // console.log(x + "<" + this.minimumSwipeDistance.x + "&&" + y + "<" + this.minimumSwipeDistance.y);
    if (this.useAny ? (this.minimumSwipeDistance.x < x || this.minimumSwipeDistance.y < y) : (this.minimumSwipeDistance.x < x && this.minimumSwipeDistance.y < y))
    {
        this.isCaptured = true;
        // console.log("capture");
        
        this.raiseEvent();
        
        for(let i = 0; i < this.objsActiveState.length; i++)
        {
            this.objsActiveState[i].obj.enabled = this.objsActiveState[i].setActive;
            this.objsActiveState[i].obj.element.useInput = this.objsActiveState[i].useInput;

        }
    }
};

SwipeEvent.prototype.raiseEvent = function() {
    
    let args = [];

    for(let i = 0; i < this.args.length; i++)
        args.push(this.args[i].value);
    this.app.fire(this.eventName, args);
};

// swap method called for script hot-reloading
// inherit your script state here
// SwipeEvent.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// CustomCoroutine.js
var CustomCoroutine = pc.createScript('customCoroutine');

CustomCoroutine.prototype.initialize = function () {

    CustomCoroutine.Instance = this;

    this.coroutines = [];
    this.id = 0;

    this.abandonedCoroutines = [];
    this.abandonAll = false;
};

CustomCoroutine.prototype.postInitialize = function () {

    // AB Testing
    // let ids = [];

    // ids.push(this.set(() => { console.log('A Completed'); }, 0.3));
    // ids.push(this.set(() => { console.log('B Completed'); }, 0.3));
    // ids.push(this.set(() => { console.log('C Completed'); }, 0.3));

    // this.set(() => {
    //     console.log("Triming");
    //     for (let i = 1; i < ids.length; i++) {
    //         this.clear(ids[i]);
    //     }
    // }, 0.1);
};

CustomCoroutine.prototype.update = function (dt) {
    this.coroutineTick(dt);
};

CustomCoroutine.prototype.set = function (func, delay) {

    let id = this.getId();
    this.coroutines.push({
        func: func,
        timer: delay,
        id: id
    });

    return id;
};

CustomCoroutine.prototype.coroutineTick = function (dt) {

    if (this.coroutines.length === 0) return;

    // console.log('-------- Tick ---------');
    for (let i = this.coroutines.length - 1; i > -1 ; i--) {
        // console.log('coroutine: ', i, ' -> ', this.coroutines[i]);
        this.coroutines[i].timer -= dt;
        if (this.coroutines[i].timer <= 0) {
            this.coroutines[i].func();
            this.coroutines.splice(i, 1);
        }
    }

    // console.log('-------- Clear');
    this.implementClear();
};

CustomCoroutine.prototype.clear = function (id) {
    // console.log('clear: ', id);
    this.abandonedCoroutines.push(id);
};

CustomCoroutine.prototype.clearAll = function () {

    this.abandonAll = true;
};

CustomCoroutine.prototype.implementClear = function () {

    if (this.abandonAll) {
        this.abandonAll = false;
        this.coroutines = [];
    }
    else {
        for (let i = this.abandonedCoroutines.length - 1; i > -1; i--) {
            let index = this.coroutines.findIndex((e) => { return e.id === this.abandonedCoroutines[i]; });
            // console.log('abandon: ', this.abandonedCoroutines[i], ' -> ', index);
            if (index !== -1) this.coroutines.splice(index, 1);
            this.abandonedCoroutines.splice(i, 1);
        }
    }
};

CustomCoroutine.prototype.getId = function () {

    this.id++;
    if (this.id > 1000)
        this.id = 0;

    return this.id;
};

// TweenRotation.js
var TweenRotation = pc.createScript('tweenRotation');

TweenRotation.attributes.add('obj', { title: 'Entity', type: 'entity' });
TweenRotation.attributes.add('rotationSpeed', { title: 'Rotation Speed', type: 'vec3' });

// initialize code called once per entity
TweenRotation.prototype.initialize = function () {
};

// update code called every frame
TweenRotation.prototype.update = function (dt) {
    // console.log("R Obj Rotation: " +  this.entity.getLocalEulerAngles());
    // console.log("dt            : " +  dt);

    let entity = this.obj === null ? this.entity : this.obj;
    var x = entity.getLocalEulerAngles().x - this.rotationSpeed.x * dt;
    var y = entity.getLocalEulerAngles().y - this.rotationSpeed.y * dt;
    var z = entity.getLocalEulerAngles().z - this.rotationSpeed.z * dt;

    entity.setLocalEulerAngles(x, y, z);
};

// swap method called for script hot-reloading
// inherit your script state here
// TweenRotation.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/

// GameManager.js
var GameManager = pc.createScript('gameManager');

GameManager.attributes.add('refs', {
    title: 'References',
    type: 'json',
    schema: [
        { name: 'currentMissionView', type: 'entity', title: 'Current Mission View' },
        { name: 'newMissionView', type: 'entity', title: 'New Mission View' },
        { name: 'missionManager', type: 'entity', title: 'Mission Manager' },
        { name: 'blackScreen', type: 'entity', title: 'Black Screen' }
    ],
});

GameManager.FirstClick = false;

// initialize code called once per entity
GameManager.prototype.initialize = function () {
    console.log('%cGameManager%c:initialize', "color: #FF0000;", "");

    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
    }

    this.app.on('GameManager:UpdateMissions', this.updateMissions, this);
    this.app.on('GameManager:LoadAssets', this.loadAssets, this);

    const orientationchanged = this.orientationChangeDetected.bind(this);
    const handleVisibilityChange = this.visibilityChanged.bind(this);

    window.addEventListener("orientationchange", orientationchanged, false);
    window.addEventListener("resize", orientationchanged, false);
    document.addEventListener("visibilitychange", handleVisibilityChange, false);

};

GameManager.prototype.postInitialize = function () {
    // console.log('Game Manager: postInitialize');
    this.app.fire('Loading:Start', 1);
};

GameManager.prototype.visibilityChanged = function () {
    if (document.hidden) {
        this.app.fire('SoundManager:PauseGameSound', true);
        this.app.timeScale = 0;
        // console.log('hidden');
    } else {
        this.app.timeScale = 1;
        this.app.fire('SoundManager:PauseGameSound', false);
        //  console.log('visible');
    }
};

GameManager.prototype.orientationChangeDetected = function () {
    if (pc.platform.desktop) return;

    var w = window.innerWidth;
    var h = window.innerHeight;

    if (w > h) {
        // Landscape
        this.refs.blackScreen.enabled = true;
        this.app.timeScale = 0;
    }
    else {
        // Portrait
        this.refs.blackScreen.enabled = false;
        this.app.timeScale = 1;
    }
};

GameManager.prototype.loadAssets = function () {
    let indexes = []
    let j = 9;
    for (let i = 0; i < 8; i++) {
        indexes[i] = j;
        j++;
    }
    indexes[8] = (DataManager.Instance.currentTheme.pageID * 9) + DataManager.Instance.currentTheme.itemID;
    // console.log('Game Manager Index: ', indexes[7], DataManager.Instance.currentTheme);
    let size = 16;
    this.app.fire('Assets:Count', indexes, () => {
        for (i = 9; i < size; i++) {
            if (i == (size - 1))
                this.app.fire('Assets:Load', i, () => {
                    this.app.fire('Assets:Load', 16, () => {
                        this.app.fire('SpineSkin:SetDefault');
                    });
                    this.app.fire('Theme:SetDefault', DataManager.Instance.currentTheme, DataManager.Instance.currentBox);
                });
            else
                this.app.fire('Assets:Load', i);
        }
    });

};

GameManager.prototype.updateMissions = function (status) {
    this.refs.missionManager.enabled = !status;
    // console.log('GameManager:MissionViews: manager,currentMission,newMission', this.refs.missionManager.enabled, this.refs.currentMissionView.enabled, this.refs.newMissionView.enabled);
};


GameManager.prototype.onTouchStart = function (ev) {

    // console.log(ev);
    ev.event.preventDefault();
};

// update code called every frame
GameManager.prototype.update = function (dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// GameManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// configManager.js
var ConfigManager = pc.createScript('configManager');

ConfigManager.EnvTypes = {
    'None': -1,
    'Gamedistribution': 0,
    'Snap': 1,
    'Facebook': 2,
};

ConfigManager.attributes.add('environmentType', {

    type: 'number',
    enum: [
        { 'None': ConfigManager.EnvTypes.None },
        { 'Gamedistribution': ConfigManager.EnvTypes.Gamedistribution },
        { 'Snap': ConfigManager.EnvTypes.Snap },
        { 'Facebook': ConfigManager.EnvTypes.Facebook },
    ],
    title: "EnvType"

});

ConfigManager.attributes.add('configs', { type: 'asset', array: true });


ConfigManager.prototype.initialize = function () {

    if (this.environmentType !== -1) {
        let config = this.configs[this.environmentType].resource.instantiate();
        this.app.root.addChild(config);
    }

};

// Logger_Manager.js
var LoggerManager = pc.createScript('loggerManager');

(function () {
    var style = document.createElement('style');
    document.head.appendChild(style);
    style.innerHTML =
        "canvas{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0;-webkit-tap-highlight-color:rgba(255,255,255,0)}" +
        "body{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0}";
})();

var isDebug = false; // Global debug state
var isDebugOnMobile = false;

if (this.isDebugOnMobile) {
    let vConsole = new VConsole();
}

var Debugger = function (gState, str) {
    this.debug = {};
    if (!window.console) return function () { };
    if (gState && str.isDebug) {
        for (let m in console)
            if (typeof console[m] == 'function')
                this.debug[m] = console[m].bind(str.toString() + ": ");
    } else {
        for (let m in console)
            if (typeof console[m] == 'function')
                this.debug[m] = function () { };
    }
    return this.debug;
};



Debug = Debugger(this.isDebug, this);

// USAGE: 
// Debug.log('Hello Log!');

// SoundManager.js
var SoundManager = pc.createScript('soundManager');

SoundManager.attributes.add('events', {
    title: 'Events',
    type: 'json',
    schema: [
        { name: 'play', type: 'string', title: 'Play Sound', default: 'SoundManager:Play' },
        { name: 'pause', type: 'string', title: 'Pause Sound', default: 'SoundManager:Pause' },
        { name: 'stop', type: 'string', title: 'Stop Sound', default: 'SoundManager:Stop' },
        { name: 'resume', type: 'string', title: 'Resume Sound', default: 'SoundManager:Resume' },
        { name: 'mute', type: 'string', title: 'Mute Sound', default: 'SoundManager:Mute' },
        { name: 'pauseGame', type: 'string', title: 'Pause Game Sound', default: 'SoundManager:PauseGameSound' }
    ],
});

// initialize code called once per entity
SoundManager.prototype.initialize = function () {
    this.gallerySoundBtnImageEntity = this.app.root.findByName("SoundIcon");
    this.previousState = 1;
    this.isGameSoundPaused = 0;
    this.app.on(this.events.play, this.playSound, this);
    this.app.on(this.events.pause, this.pauseSound, this);
    this.app.on(this.events.stop, this.stopSound, this);
    this.app.on(this.events.resume, this.resumeSound, this);
    this.app.on(this.events.mute, this.muteGameSound, this);
    this.app.on(this.events.pauseGame, this.pauseGameSound, this);

    this.on('destroy', () => {
        this.app.off(this.events.play);
        this.app.off(this.events.pause);
        this.app.off(this.events.stop);
        this.app.off(this.events.resume);
        this.app.off(this.events.mute);
        this.app.off(this.events.pauseGame);
    });
};

SoundManager.prototype.playSound = function (soundNames, delay, forceReplay) {
   // console.warn('%cSound%c:Manager:playSound: ', "color: red;", "", soundNames, delay, forceReplay);
    if (forceReplay === undefined) forceReplay = true;
    if (!delay) delay = 0;
    let soundName = undefined;
    if (Array.isArray(soundNames)) {
        let index = Math.floor(pc.math.random(0, 100));
        index = index % soundNames.length;
        // // // console.log(index);
        soundName = soundNames[index];
    }
    else
        soundName = soundNames;

    // // console.log("Play: ", soundName);
    if (forceReplay || !this.entity.sound.slot(soundName).isPlaying)
        CustomCoroutine.Instance.set(() => {
            if (this.entity.sound.volume != 0)
                this.entity.sound.slot(soundName).play()
        }, delay);
};

SoundManager.prototype.pauseSound = function (soundname) {
    // // console.log("Sound Pause: ", soundname);
    this.entity.sound.slot(soundname).pause();
};

SoundManager.prototype.stopSound = function (soundname) {
    console.warn('%cSound%c:Manager:stopSound: ', "color: red;", "", soundname);
    // // // console.log('stopSound: ', soundname);
    this.entity.sound.slot(soundname).stop();
};

SoundManager.prototype.resumeSound = function (soundname) {
    console.warn('%cSound%c:Manager:resumeSound: ', "color: red;", "", soundname);
    // console.warn('ResumeSound: ', soundname);
    if (this.entity.sound.slot(soundname).isPaused) {
        this.entity.sound.slot(soundname).resume();
        // // // console.log('ResumeSound: Resuming');
    }
    else if (!this.entity.sound.slot(soundname).isPlaying) {
        // // // console.log('ResumeSound: Playing: ');
        this.playSound(soundname);
    }
};

SoundManager.prototype.setSoundVolume = function (soundname, vol) {
    this.entity.sound.slot(soundname).volume = vol;
};

SoundManager.prototype.muteGameSound = function (canMuteSound) {
    //  console.warn('SoundManager:Mute: ', canMuteSound);
    if (canMuteSound) {
        this.entity.sound.volume = 0;
    } else {
        this.entity.sound.volume = 1;
    }

};

SoundManager.prototype.pauseGameSound = function (pauseSound) {
  //  console.trace('SoundManager:pauseGameSound: ', pauseSound, this.isGameSoundPaused)
    if (pauseSound && this.isGameSoundPaused > 0) {
        this.isGameSoundPaused++;
        return;
    }
    // // // console.log('SoundManager:PauseGameSound: ', pauseSound, this.previousState, this.entity.sound.volume);
    if (pauseSound) {
        this.isGameSoundPaused++;
        this.previousState = this.entity.sound.volume;
        if (this.entity.sound.volume != 0) {
            this.entity.sound.volume = 0;
            if (MenuManager.Instance.isState(MenuManager.States.Home) || MenuManager.Instance.isState(MenuManager.States.Costumes))
                this.pauseSound('TitleScreen');
            else {
                this.app.fire('GameplayMenu:IsPlayingGame', isPlayingGame => {
                    if (isPlayingGame && MenuManager.Instance.isState(MenuManager.States.Gameplay)) {
                        this.pauseSound('GamePlay')
                    }
                });
            }
        }
    }
    else {
        this.isGameSoundPaused--;
        if (this.isGameSoundPaused < 0) this.isGameSoundPaused = 0;
        if (this.isGameSoundPaused != 0) return;
        if (this.previousState == 1) {
            if (MenuManager.Instance.isState(MenuManager.States.Home) || MenuManager.Instance.isState(MenuManager.States.Costumes))
               this.resumeSound('TitleScreen');
            else {
                this.app.fire('GameplayMenu:IsPlayingGame', isPlayingGame => {
                    if (isPlayingGame && MenuManager.Instance.isState(MenuManager.States.Gameplay))
                        this.resumeSound('GamePlay')
                });
            }
        }
        this.entity.sound.volume = this.previousState;
    }
};

// touch-input.js
var TouchInput = pc.createScript('touchInput');

TouchInput.attributes.add('orbitSensitivity', {
    type: 'number', 
    default: 0.4, 
    title: 'Orbit Sensitivity', 
    description: 'How fast the camera moves around the orbit. Higher is faster'
});

TouchInput.attributes.add('distanceSensitivity', {
    type: 'number', 
    default: 0.2, 
    title: 'Distance Sensitivity', 
    description: 'How fast the camera moves in and out. Higher is faster'
});

// initialize code called once per entity
TouchInput.prototype.initialize = function() {
    this.orbitCamera = this.entity.script.orbitCamera;
    
    // Store the position of the touch so we can calculate the distance moved
    this.lastTouchPoint = new pc.Vec2();
    this.lastPinchMidPoint = new pc.Vec2();
    this.lastPinchDistance = 0;
    
    if (this.orbitCamera && this.app.touch) {
        // Use the same callback for the touchStart, touchEnd and touchCancel events as they 
        // all do the same thing which is to deal the possible multiple touches to the screen
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStartEndCancel, this);
        this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchStartEndCancel, this);
        this.app.touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchStartEndCancel, this);
        
        this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
        
        this.on('destroy', function() {
            this.app.touch.off(pc.EVENT_TOUCHSTART, this.onTouchStartEndCancel, this);
            this.app.touch.off(pc.EVENT_TOUCHEND, this.onTouchStartEndCancel, this);
            this.app.touch.off(pc.EVENT_TOUCHCANCEL, this.onTouchStartEndCancel, this);

            this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
        });
    }
};


TouchInput.prototype.getPinchDistance = function (pointA, pointB) {
    // Return the distance between the two points
    var dx = pointA.x - pointB.x;
    var dy = pointA.y - pointB.y;    
    
    return Math.sqrt((dx * dx) + (dy * dy));
};


TouchInput.prototype.calcMidPoint = function (pointA, pointB, result) {
    result.set(pointB.x - pointA.x, pointB.y - pointA.y);
    result.scale(0.5);
    result.x += pointA.x;
    result.y += pointA.y;
};


TouchInput.prototype.onTouchStartEndCancel = function(event) {
    // We only care about the first touch for camera rotation. As the user touches the screen, 
    // we stored the current touch position
    var touches = event.touches;
    if (touches.length == 1) {
        this.lastTouchPoint.set(touches[0].x, touches[0].y);
    
    } else if (touches.length == 2) {
        // If there are 2 touches on the screen, then set the pinch distance
        this.lastPinchDistance = this.getPinchDistance(touches[0], touches[1]);
        this.calcMidPoint(touches[0], touches[1], this.lastPinchMidPoint);
    }
};


TouchInput.fromWorldPoint = new pc.Vec3();
TouchInput.toWorldPoint = new pc.Vec3();
TouchInput.worldDiff = new pc.Vec3();


TouchInput.prototype.pan = function(midPoint) {
    var fromWorldPoint = TouchInput.fromWorldPoint;
    var toWorldPoint = TouchInput.toWorldPoint;
    var worldDiff = TouchInput.worldDiff;
    
    // For panning to work at any zoom level, we use screen point to world projection
    // to work out how far we need to pan the pivotEntity in world space 
    var camera = this.entity.camera;
    var distance = this.orbitCamera.distance;
    
    camera.screenToWorld(midPoint.x, midPoint.y, distance, fromWorldPoint);
    camera.screenToWorld(this.lastPinchMidPoint.x, this.lastPinchMidPoint.y, distance, toWorldPoint);
    
    worldDiff.sub2(toWorldPoint, fromWorldPoint);
     
    this.orbitCamera.pivotPoint.add(worldDiff);    
};


TouchInput.pinchMidPoint = new pc.Vec2();

TouchInput.prototype.onTouchMove = function(event) {
    var pinchMidPoint = TouchInput.pinchMidPoint;
    
    // We only care about the first touch for camera rotation. Work out the difference moved since the last event
    // and use that to update the camera target position 
    var touches = event.touches;
    if (touches.length == 1) {
        var touch = touches[0];
        
        this.orbitCamera.pitch -= (touch.y - this.lastTouchPoint.y) * this.orbitSensitivity;
        this.orbitCamera.yaw -= (touch.x - this.lastTouchPoint.x) * this.orbitSensitivity;
        
        this.lastTouchPoint.set(touch.x, touch.y);
    
    } else if (touches.length == 2) {
        // Calculate the difference in pinch distance since the last event
        var currentPinchDistance = this.getPinchDistance(touches[0], touches[1]);
        var diffInPinchDistance = currentPinchDistance - this.lastPinchDistance;
        this.lastPinchDistance = currentPinchDistance;
                
        this.orbitCamera.distance -= (diffInPinchDistance * this.distanceSensitivity * 0.1) * (this.orbitCamera.distance * 0.1);
        
        // Calculate pan difference
        this.calcMidPoint(touches[0], touches[1], pinchMidPoint);
        this.pan(pinchMidPoint);
        this.lastPinchMidPoint.copy(pinchMidPoint);
    }
};


// orbit-camera.js
var OrbitCamera = pc.createScript('orbitCamera');

OrbitCamera.attributes.add('autoRender', {
    type: 'boolean', 
    default: true, 
    title: 'Auto Render', 
    description: 'Disable to only render when camera is moving (saves power when the camera is still)'
});

OrbitCamera.attributes.add('distanceMax', {type: 'number', default: 0, title: 'Distance Max', description: 'Setting this at 0 will give an infinite distance limit'});
OrbitCamera.attributes.add('distanceMin', {type: 'number', default: 0, title: 'Distance Min'});
OrbitCamera.attributes.add('pitchAngleMax', {type: 'number', default: 90, title: 'Pitch Angle Max (degrees)'});
OrbitCamera.attributes.add('pitchAngleMin', {type: 'number', default: -90, title: 'Pitch Angle Min (degrees)'});

OrbitCamera.attributes.add('inertiaFactor', {
    type: 'number',
    default: 0,
    title: 'Inertia Factor',
    description: 'Higher value means that the camera will continue moving after the user has stopped dragging. 0 is fully responsive.'
});

OrbitCamera.attributes.add('focusEntity', {
    type: 'entity',
    title: 'Focus Entity',
    description: 'Entity for the camera to focus on. If blank, then the camera will use the whole scene'
});

OrbitCamera.attributes.add('frameOnStart', {
    type: 'boolean',
    default: true,
    title: 'Frame on Start',
    description: 'Frames the entity or scene at the start of the application."'
});


// Property to get and set the distance between the pivot point and camera
// Clamped between this.distanceMin and this.distanceMax
Object.defineProperty(OrbitCamera.prototype, "distance", {
    get: function() {
        return this._targetDistance;
    },

    set: function(value) {
        this._targetDistance = this._clampDistance(value);
    }
});


// Property to get and set the pitch of the camera around the pivot point (degrees)
// Clamped between this.pitchAngleMin and this.pitchAngleMax
// When set at 0, the camera angle is flat, looking along the horizon
Object.defineProperty(OrbitCamera.prototype, "pitch", {
    get: function() {
        return this._targetPitch;
    },

    set: function(value) {
        this._targetPitch = this._clampPitchAngle(value);
    }
});


// Property to get and set the yaw of the camera around the pivot point (degrees)
Object.defineProperty(OrbitCamera.prototype, "yaw", {
    get: function() {
        return this._targetYaw;
    },

    set: function(value) {
        this._targetYaw = value;

        // Ensure that the yaw takes the shortest route by making sure that 
        // the difference between the targetYaw and the actual is 180 degrees
        // in either direction
        var diff = this._targetYaw - this._yaw;
        var reminder = diff % 360;
        if (reminder > 180) {
            this._targetYaw = this._yaw - (360 - reminder);
        } else if (reminder < -180) {
            this._targetYaw = this._yaw + (360 + reminder);
        } else {
            this._targetYaw = this._yaw + reminder;
        }
    }
});


// Property to get and set the world position of the pivot point that the camera orbits around
Object.defineProperty(OrbitCamera.prototype, "pivotPoint", {
    get: function() {
        return this._pivotPoint;
    },

    set: function(value) {
        this._pivotPoint.copy(value);
    }
});


// Moves the camera to look at an entity and all its children so they are all in the view
OrbitCamera.prototype.focus = function (focusEntity) {
    // Calculate an bounding box that encompasses all the models to frame in the camera view
    this._buildAabb(focusEntity, 0);

    var halfExtents = this._modelsAabb.halfExtents;

    var distance = Math.max(halfExtents.x, Math.max(halfExtents.y, halfExtents.z));
    distance = (distance / Math.tan(0.5 * this.entity.camera.fov * pc.math.DEG_TO_RAD));
    distance = (distance * 2);

    this.distance = distance;

    this._removeInertia();

    this._pivotPoint.copy(this._modelsAabb.center);
};


OrbitCamera.distanceBetween = new pc.Vec3();

// Set the camera position to a world position and look at a world position
// Useful if you have multiple viewing angles to swap between in a scene
OrbitCamera.prototype.resetAndLookAtPoint = function (resetPoint, lookAtPoint) {
    this.pivotPoint.copy(lookAtPoint);
    this.entity.setPosition(resetPoint);

    this.entity.lookAt(lookAtPoint);

    var distance = OrbitCamera.distanceBetween;
    distance.sub2(lookAtPoint, resetPoint);
    this.distance = distance.length();

    this.pivotPoint.copy(lookAtPoint);

    var cameraQuat = this.entity.getRotation();
    this.yaw = this._calcYaw(cameraQuat);
    this.pitch = this._calcPitch(cameraQuat, this.yaw);

    this._removeInertia();
    this._updatePosition();

    if (!this.autoRender) {
        this.app.renderNextFrame = true;
    }
};


// Set camera position to a world position and look at an entity in the scene
// Useful if you have multiple models to swap between in a scene
OrbitCamera.prototype.resetAndLookAtEntity = function (resetPoint, entity) {
    this._buildAabb(entity, 0);
    this.resetAndLookAtPoint(resetPoint, this._modelsAabb.center);
};


// Set the camera at a specific, yaw, pitch and distance without inertia (instant cut)
OrbitCamera.prototype.reset = function (yaw, pitch, distance) {
    this.pitch = pitch;
    this.yaw = yaw;
    this.distance = distance;

    this._removeInertia();

    if (!this.autoRender) {
        this.app.renderNextFrame = true;
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////
// Private methods

OrbitCamera.prototype.initialize = function () {
    this._checkAspectRatio();

    // Find all the models in the scene that are under the focused entity
    this._modelsAabb = new pc.BoundingBox();
    this._buildAabb(this.focusEntity || this.app.root, 0);

    this.entity.lookAt(this._modelsAabb.center);

    this._pivotPoint = new pc.Vec3();
    this._pivotPoint.copy(this._modelsAabb.center);

    this._lastFramePivotPoint = this._pivotPoint.clone();

    // Calculate the camera euler angle rotation around x and y axes
    // This allows us to place the camera at a particular rotation to begin with in the scene
    var cameraQuat = this.entity.getRotation();

    // Preset the camera
    this._yaw = this._calcYaw(cameraQuat);
    this._pitch = this._clampPitchAngle(this._calcPitch(cameraQuat, this._yaw));
    this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);

    this._distance = 0;

    this._targetYaw = this._yaw;
    this._targetPitch = this._pitch;

    // If we have ticked focus on start, then attempt to position the camera where it frames
    // the focused entity and move the pivot point to entity's position otherwise, set the distance
    // to be between the camera position in the scene and the pivot point
    if (this.frameOnStart) {
        this.focus(this.focusEntity || this.app.root);
    } else {
        var distanceBetween = new pc.Vec3();
        distanceBetween.sub2(this.entity.getPosition(), this._pivotPoint);
        this._distance = this._clampDistance(distanceBetween.length());
    }

    this._targetDistance = this._distance;

    this._autoRenderDefault = this.app.autoRender;

    // Do not enable autoRender if it's already off as it's controlled elsewhere
    if (this.app.autoRender) {
        this.app.autoRender = this.autoRender;
    }

    if (!this.autoRender) {
        this.app.renderNextFrame = true;
    }

    this.on('attr:autoRender', function (value, prev) {
        this.app.autoRender = value;
        if (!this.autoRender) {
            this.app.renderNextFrame = true;
        }
    }, this);

    // Reapply the clamps if they are changed in the editor
    this.on('attr:distanceMin', function (value, prev) {
        this._targetDistance = this._clampDistance(this._distance);
    }, this);

    this.on('attr:distanceMax', function (value, prev) {
        this._targetDistance = this._clampDistance(this._distance);
    }, this);

    this.on('attr:pitchAngleMin', function (value, prev) {
        this._targetPitch = this._clampPitchAngle(this._pitch);
    }, this);

    this.on('attr:pitchAngleMax', function (value, prev) {
        this._targetPitch = this._clampPitchAngle(this._pitch);
    }, this);

    // Focus on the entity if we change the focus entity
    this.on('attr:focusEntity', function (value, prev) {
        if (this.frameOnStart) {
            this.focus(value || this.app.root);
        } else {
            this.resetAndLookAtEntity(this.entity.getPosition(), value || this.app.root);
        }
    }, this);

    this.on('attr:frameOnStart', function (value, prev) {
        if (value) {
            this.focus(this.focusEntity || this.app.root);
        }
    }, this);

    var onResizeCanvas = function () {
        this._checkAspectRatio();
        if (!this.autoRender) {
            this.app.renderNextFrame = true;
        }
    };

    this.app.graphicsDevice.on('resizecanvas', onResizeCanvas, this);

    this.on('destroy', function() {
        this.app.graphicsDevice.off('resizecanvas', onResizeCanvas, this);
        this.app.autoRender = this._autoRenderDefault;
    }, this);
};


OrbitCamera.prototype.update = function(dt) {
    // Check if we have are still moving for autorender
    if (!this.autoRender) {
        var distanceDiff = Math.abs(this._targetDistance - this._distance);
        var yawDiff = Math.abs(this._targetYaw - this._yaw);
        var pitchDiff = Math.abs(this._targetPitch - this._pitch);
        var pivotPointDiff = this._lastFramePivotPoint.distance(this._pivotPoint);
    
        this.app.renderNextFrame = this.app.renderNextFrame || 
            distanceDiff > 0.01 || yawDiff > 0.01 || pitchDiff > 0.01 || pivotPointDiff > 0;
    }

    // Add inertia, if any
    var t = this.inertiaFactor === 0 ? 1 : Math.min(dt / this.inertiaFactor, 1);
    this._distance = pc.math.lerp(this._distance, this._targetDistance, t);
    this._yaw = pc.math.lerp(this._yaw, this._targetYaw, t);
    this._pitch = pc.math.lerp(this._pitch, this._targetPitch, t);

    this._lastFramePivotPoint.copy(this._pivotPoint);

    this._updatePosition();
};


OrbitCamera.prototype._updatePosition = function () {
    // Work out the camera position based on the pivot point, pitch, yaw and distance
    this.entity.setLocalPosition(0,0,0);
    this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);

    var position = this.entity.getPosition();
    position.copy(this.entity.forward);
    position.scale(-this._distance);
    position.add(this.pivotPoint);
    this.entity.setPosition(position);
};


OrbitCamera.prototype._removeInertia = function () {
    this._yaw = this._targetYaw;
    this._pitch = this._targetPitch;
    this._distance = this._targetDistance;
};


OrbitCamera.prototype._checkAspectRatio = function () {
    var height = this.app.graphicsDevice.height;
    var width = this.app.graphicsDevice.width;

    // Match the axis of FOV to match the aspect ratio of the canvas so
    // the focused entities is always in frame
    this.entity.camera.horizontalFov = height > width;
};


OrbitCamera.prototype._buildAabb = function (entity, modelsAdded) {
    var i = 0, j = 0, meshInstances;
    
    if (entity instanceof pc.Entity) {
        var allMeshInstances = [];
        var renders = entity.findComponents('render');

        for (i = 0; i < renders.length; ++i) {
            meshInstances = renders[i].meshInstances;
            if (meshInstances) {
                for (j = 0; j < meshInstances.length; j++) {
                    allMeshInstances.push(meshInstances[j]);
                }
            }
        }  

        var models = entity.findComponents('model');
        for (i = 0; i < models.length; ++i) {
            meshInstances = models[i].meshInstances;
            if (meshInstances) {
                for (j = 0; j < meshInstances.length; j++) {
                    allMeshInstances.push(meshInstances[j]);
                }
            }
        }  

        for (i = 0; i < allMeshInstances.length; i++) {
            if (modelsAdded === 0) {
                this._modelsAabb.copy(allMeshInstances[i].aabb);
            } else {
                this._modelsAabb.add(allMeshInstances[i].aabb);
            }

            modelsAdded += 1;
        }
    }

    for (i = 0; i < entity.children.length; ++i) {
        modelsAdded += this._buildAabb(entity.children[i], modelsAdded);
    }

    return modelsAdded;
};


OrbitCamera.prototype._calcYaw = function (quat) {
    var transformedForward = new pc.Vec3();
    quat.transformVector(pc.Vec3.FORWARD, transformedForward);

    return Math.atan2(-transformedForward.x, -transformedForward.z) * pc.math.RAD_TO_DEG;
};


OrbitCamera.prototype._clampDistance = function (distance) {
    if (this.distanceMax > 0) {
        return pc.math.clamp(distance, this.distanceMin, this.distanceMax);
    } else {
        return Math.max(distance, this.distanceMin);
    }
};


OrbitCamera.prototype._clampPitchAngle = function (pitch) {
    // Negative due as the pitch is inversed since the camera is orbiting the entity
    return pc.math.clamp(pitch, -this.pitchAngleMax, -this.pitchAngleMin);
};


OrbitCamera.quatWithoutYaw = new pc.Quat();
OrbitCamera.yawOffset = new pc.Quat();

OrbitCamera.prototype._calcPitch = function(quat, yaw) {
    var quatWithoutYaw = OrbitCamera.quatWithoutYaw;
    var yawOffset = OrbitCamera.yawOffset;

    yawOffset.setFromEulerAngles(0, -yaw, 0);
    quatWithoutYaw.mul2(yawOffset, quat);

    var transformedForward = new pc.Vec3();

    quatWithoutYaw.transformVector(pc.Vec3.FORWARD, transformedForward);

    return Math.atan2(transformedForward.y, -transformedForward.z) * pc.math.RAD_TO_DEG;
};

// keyboard-input.js
var KeyboardInput = pc.createScript('keyboardInput');

// initialize code called once per entity
KeyboardInput.prototype.initialize = function() {
    this.orbitCamera = this.entity.script.orbitCamera;
};


KeyboardInput.prototype.postInitialize = function() {
    if (this.orbitCamera) {
        this.startDistance = this.orbitCamera.distance;
        this.startYaw = this.orbitCamera.yaw;
        this.startPitch = this.orbitCamera.pitch;
        this.startPivotPosition = this.orbitCamera.pivotPoint.clone();
    }
};

// update code called every frame
KeyboardInput.prototype.update = function(dt) {
    if (this.orbitCamera) {
        if (this.app.keyboard.wasPressed(pc.KEY_SPACE)) {
            this.orbitCamera.reset(this.startYaw, this.startPitch, this.startDistance);
            this.orbitCamera.pivotPoint = this.startPivotPosition;
        }
    }
};


// mouse-input.js
var MouseInput = pc.createScript('mouseInput');

MouseInput.attributes.add('orbitSensitivity', {
    type: 'number', 
    default: 0.3, 
    title: 'Orbit Sensitivity', 
    description: 'How fast the camera moves around the orbit. Higher is faster'
});

MouseInput.attributes.add('distanceSensitivity', {
    type: 'number', 
    default: 0.15, 
    title: 'Distance Sensitivity', 
    description: 'How fast the camera moves in and out. Higher is faster'
});

// initialize code called once per entity
MouseInput.prototype.initialize = function() {
    this.orbitCamera = this.entity.script.orbitCamera;
        
    if (this.orbitCamera) {
        var self = this;
        
        var onMouseOut = function (e) {
           self.onMouseOut(e);
        };
        
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);

        // Listen to when the mouse travels out of the window
        window.addEventListener('mouseout', onMouseOut, false);
        
        // Remove the listeners so if this entity is destroyed
        this.on('destroy', function() {
            this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
            this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
            this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
            this.app.mouse.off(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);

            window.removeEventListener('mouseout', onMouseOut, false);
        });
    }
    
    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    this.app.mouse.disableContextMenu();
  
    this.lookButtonDown = false;
    this.panButtonDown = false;
    this.lastPoint = new pc.Vec2();
};


MouseInput.fromWorldPoint = new pc.Vec3();
MouseInput.toWorldPoint = new pc.Vec3();
MouseInput.worldDiff = new pc.Vec3();


MouseInput.prototype.pan = function(screenPoint) {
    var fromWorldPoint = MouseInput.fromWorldPoint;
    var toWorldPoint = MouseInput.toWorldPoint;
    var worldDiff = MouseInput.worldDiff;
    
    // For panning to work at any zoom level, we use screen point to world projection
    // to work out how far we need to pan the pivotEntity in world space 
    var camera = this.entity.camera;
    var distance = this.orbitCamera.distance;
    
    camera.screenToWorld(screenPoint.x, screenPoint.y, distance, fromWorldPoint);
    camera.screenToWorld(this.lastPoint.x, this.lastPoint.y, distance, toWorldPoint);

    worldDiff.sub2(toWorldPoint, fromWorldPoint);
       
    this.orbitCamera.pivotPoint.add(worldDiff);    
};


MouseInput.prototype.onMouseDown = function (event) {
    switch (event.button) {
        case pc.MOUSEBUTTON_LEFT: {
            this.lookButtonDown = true;
        } break;
            
        case pc.MOUSEBUTTON_MIDDLE: 
        case pc.MOUSEBUTTON_RIGHT: {
            this.panButtonDown = true;
        } break;
    }
};


MouseInput.prototype.onMouseUp = function (event) {
    switch (event.button) {
        case pc.MOUSEBUTTON_LEFT: {
            this.lookButtonDown = false;
        } break;
            
        case pc.MOUSEBUTTON_MIDDLE: 
        case pc.MOUSEBUTTON_RIGHT: {
            this.panButtonDown = false;            
        } break;
    }
};


MouseInput.prototype.onMouseMove = function (event) {    
    var mouse = pc.app.mouse;
    if (this.lookButtonDown) {
        this.orbitCamera.pitch -= event.dy * this.orbitSensitivity;
        this.orbitCamera.yaw -= event.dx * this.orbitSensitivity;
        
    } else if (this.panButtonDown) {
        this.pan(event);   
    }
    
    this.lastPoint.set(event.x, event.y);
};


MouseInput.prototype.onMouseWheel = function (event) {
    this.orbitCamera.distance -= event.wheel * this.distanceSensitivity * (this.orbitCamera.distance * 0.1);
    event.event.preventDefault();
};


MouseInput.prototype.onMouseOut = function (event) {
    this.lookButtonDown = false;
    this.panButtonDown = false;
};

// animateSprites.js
var AnimateSprites = pc.createScript('animateSprites');

AnimateSprites.attributes.add('animate', { type: 'boolean' });
AnimateSprites.attributes.add('switchDelay', { type: 'number' });
AnimateSprites.attributes.add('pairAnimations', { type: 'number', default: 0 });

AnimateSprites.attributes.add('image', { type: 'entity' });
AnimateSprites.attributes.add('sprites', { type: 'asset', assetType: 'sprite', array: true });


// initialize code called once per entity
AnimateSprites.prototype.initialize = function () {

    this.pauseAnimation = false;
    this.currentSprite = 0;
    this.currentPair = 0;
};

// update code called every frame
AnimateSprites.prototype.update = function (dt) {

    if (!this.image) return;

    if (this.animate && !this.pauseAnimation) {
        this.pauseAnimation = true;
        CustomCoroutine.Instance.set(function () {

            this.showSprite();
            this.pauseAnimation = false;

            if (this.pairAnimations > 0) {
                this.currentPair++;

                if (this.pairAnimations <= this.currentPair) {
                    this.animate = false;
                    this.currentPair = 0;
                }
            }
        }.bind(this), this.switchDelay);
    }
};

AnimateSprites.prototype.showSprite = function () {

    try {
        if (this.animate)
            this.image.sprite.sprite = this.sprites[this.currentSprite].resource;
    } catch (e) { console.log(e);}
    this.currentSprite++;
    if (this.currentSprite >= this.sprites.length)
        this.currentSprite = 0;
};

AnimateSprites.prototype.play = function (playAnim) {

    this.animate = playAnim;
};

AnimateSprites.prototype.reset = function () {

    this.currentSprite = 0;
    this.image.element.texture = this.sprites[this.currentSprite].resource;
};

// swap method called for script hot-reloading
// inherit your script state here
// AnimateSprites.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/

// LookAtObject.js
var LookAtobject = pc.createScript('lookAtobject');

LookAtobject.attributes.add('obj', { type: 'entity', title: 'LookAt Entity'});
LookAtobject.attributes.add('offset', { type: 'vec3', title: 'LookAt Offset'});

LookAtobject.attributes.add('lookAtX', { type: 'boolean', title: 'LookAt X', default: true});
LookAtobject.attributes.add('lookAtY', { type: 'boolean', title: 'LookAt Y', default: true});
LookAtobject.attributes.add('lookAtZ', { type: 'boolean', title: 'LookAt Z', default: true});

// initialize code called once per entity
LookAtobject.prototype.initialize = function() {
};

LookAtobject.prototype.postInitialize = function() {
    if (!this.obj)
        this.obj = this.app.root.findByTag('Main Camera')[0];
};

// update code called every frame
LookAtobject.prototype.update = function(dt) {
    if (!this.obj) return;

    let objPos = this.obj.getLocalPosition();
    let myPos = this.entity.getLocalPosition();

    let x = this.lookAtX ? objPos.x + this.offset.x : myPos.x;
    let y = this.lookAtY ? objPos.y + this.offset.y : myPos.y;
    let z = this.lookAtZ ? objPos.z + this.offset.z : myPos.z;

    this.entity.lookAt(x, y, z);
};

// swap method called for script hot-reloading
// inherit your script state here
// LookAtobject.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// ToggleGroup.js
var ToggleGroup = pc.createScript('toggleGroup');

ToggleGroup.attributes.add('toggleEvent', { type: 'string', title: 'Toggle Event'});
ToggleGroup.attributes.add('alowMultiCheck', { type: 'boolean', title: 'Allow Multi Check' });
ToggleGroup.attributes.add('alowAllDisabled', { type: 'boolean', title: 'Allow All Unchecked' });
ToggleGroup.attributes.add('defaultCheck', { type: 'number', title: 'Default Toggle Index' });

ToggleGroup.attributes.add('toggle', {
    type: 'json',
    title: 'Toggles',
    schema: [
        { name: 'event', title: 'Event', type: 'string' },
        { name: 'check', title: 'Check', type: 'entity' },
    ],
    array: true
});

// initialize code called once per entity
ToggleGroup.prototype.initialize = function () {
    this.app.on(this.toggleEvent, this.updateToggle, this);
    this.entity.on('UpdateToggle', this.updateToggle, this);
    
    this.currentToggle = -1;
    this.prevToggle = -1;

    if (!this.alowMultiCheck) {
        for (let i = 0; i < this.toggle.length; i++) {
            this.toggle[i].check.enabled = false;
        }
        if(this.defaultCheck !== -1)
            this.updateToggle(this.defaultCheck);
    }
};

// update code called every frame
ToggleGroup.prototype.update = function (dt) {

};

ToggleGroup.prototype.updateToggle = function (newToggle, enable) {

    newToggle = parseInt(newToggle);
    console.log("updateToggle: ", newToggle, enable, this.toggle.length);
    
    if (!this.alowMultiCheck) {
        
        if (this.currentToggle === newToggle && !this.alowAllDisabled) return;

        this.currentToggle = newToggle;

        if (enable || enable === undefined) {
            for (let i = 0; i < this.toggle.length; i++) {
                // console.log(i, ' == ', newToggle);
                if (i !== newToggle)
                    this.setCheck(this.toggle[i], false);
            }
        }

        let value = true;

        if (enable === undefined) {
            if (this.alowAllDisabled)
                value = !this.toggle[this.currentToggle].check.enabled;
        }
        else
            value = enable;

        this.setCheck(this.toggle[this.currentToggle], value);
    }
    else {
        let value = this.toggle[newToggle].check.enabled;
        value = enable === undefined ? !value : enable;
        this.setCheck(this.toggle[newToggle], value);
    }
};

ToggleGroup.prototype.setCheck = function (toggle, enable) {
    console.warn("setCheck: ", toggle.check.parent.parent.name, enable);
    // if (toggle.check.script.uianimator && !enable)
    //     toggle.check.fire('disable');
    // else
        toggle.check.enabled = enable;

    this.app.fire(toggle.event, enable);
};

// swap method called for script hot-reloading
// inherit your script state here
// ToggleGroup.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// PoolController.js
var PoolController = pc.createScript('PoolController');

PoolController.attributes.add('startingID', { title: 'Starting ID', type: 'number' });
PoolController.attributes.add('entityName', { title: 'Name', type: 'string' });
PoolController.attributes.add('capacity', { title: 'Capacity', type: 'number', description: 'Instantiates these much elements on initialize' });
PoolController.attributes.add('container', { title: 'Available Container', type: 'entity' });
PoolController.attributes.add('usedContainer', { title: 'Used Container', type: 'entity' });
PoolController.attributes.add('prefab', { title: 'Template', type: 'asset', assetType: 'template' });

PoolController.attributes.add('events', {
    title: 'Events',
    type: 'json',
    schema: [
        { title: 'Restore', name: 'restore', type: 'string', default: 'Pool:Restore' },
        { title: 'Get', name: 'get', type: 'string', default: 'Pool:Get' },
        { title: 'Created New', name: 'createdNew', type: 'string', default: 'Pool:CreatedNew' },
    ],
});


// initialize code called once per entity
PoolController.prototype.initialize = function () {
    this.avalibleID = this.startingID;

    if (this.events.restore.length > 0)
        this.app.on(this.events.restore, this.restore, this);

    if (this.events.get.length > 0)
        this.app.on(this.events.get, this.getEvent, this);

    this.on("destroy", this.onDestroy, this);

};

PoolController.prototype.onDestroy = function () {

    if (this.events.restore.length > 0)
        this.app.off(this.events.restore, this.restore, this);

    if (this.events.get.length > 0)
        this.app.off(this.events.get, this.getEvent, this);

};

PoolController.prototype.postInitialize = function () {
    this.initCapacity();
};

// update code called every frame
PoolController.prototype.initCapacity = function () {
    for (let i = 0; i < this.capacity; i++)
        this.createNew().reparent(this.container);
};

PoolController.prototype.getEvent = function (newParent, callback) {
    if (callback) callback(this.get(newParent));
};

PoolController.prototype.get = function (newParent) {
    let count = this.container.children.length;
    let entity = count <= 0 ? this.createNew() : this.container.children[0];
    entity.reparent(newParent || this.usedContainer);
    // console.log("Get: " + entity.name + " => " + entity.enabled);
    return entity;
};

PoolController.prototype.restore = function (entity) {
     //console.log('restore: ' + entity.name);
    entity.enabled = false;
    entity.reparent(this.container);
};

PoolController.prototype.restoreAll = function() {
    for (let i = this.usedContainer.children.length - 1; i > -1; i--) {
        this.restore(this.usedContainer.children[i]);
    }
};

PoolController.prototype.createNew = function () {
    let entity = this.prefab.resource.instantiate();
    entity.enabled = false;
    entity.name = `${this.entityName} ${this.avalibleID++}`;
    // console.log('Creating: ' + entity.name + " => " + entity.enabled);
    this.app.root.addChild(entity);
    this.app.fire(this.events.createdNew, entity);
    return entity;
};

// swap method called for script hot-reloading
// inherit your script state here
// PoolController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// CountdownHandler.js
var CountdownHandler = pc.createScript('countdownHandler');

CountdownHandler.attributes.add('countDownOrder', { 
    title: 'Count Down Order',
    type: 'number',
    enum: [
        { "Ascending":  0},
        { "Descending ":  1},
    ],
    default: 1
});

CountdownHandler.attributes.add('blockUI', { type: 'boolean', title: 'Block UI'});
CountdownHandler.attributes.add('uIBlocker', { type: 'entity', title: 'UI Blocker'});
CountdownHandler.attributes.add('event', { type: 'string', title: 'Event'});
CountdownHandler.attributes.add('start', { type: 'number', title: 'Start', default: 0});
CountdownHandler.attributes.add('end', { type: 'number', title: 'End', default: 3});
CountdownHandler.attributes.add('txt', { type: 'entity', title: 'Counting Text'});

CountdownHandler.attributes.add('distinctCharacters', { type: 'string', title: 'Distinct Characters', array: true, description: "Populate this array to don't use start and end, instead this custom set up. For Example: Ready, Get, Set, Go..."});

CountdownHandler.attributes.add('animationSettings', {
    title: 'Animation Settings',
    type: 'json',
    schema: [
        { name: 'fadeOutline', title: "Fade Outline", type: 'boolean'},
        { name: 'fadeDuration', title: "Fade Duration", type: 'number'},
        { name: 'startFade', title: "Start Fade", type: 'number', min: 0, max: 1,},
        { name: 'endFade', title: "End Fade", type: 'number', min: 0, max: 1,},
        { name: 'scaleDuration', title: "Scale Duration", type: 'number'},
        { name: 'startScale', title: "Start Scale", type: 'vec3'},
        { name: 'endScale', title: "End Scale", type: 'vec3'},
        { name: 'customTxt', title: "Custom Text", type: 'entity'},
    ],
    array: true
});

// initialize code called once per entity
CountdownHandler.prototype.initialize = function() {
    this.fadeTween = undefined;
    this.scaleTween = undefined;
    this.countdownNumber = 0;
    this.onCompleteCountDown = undefined;
    this.oC = new pc.Color();

    this.app.on(this.event, this.countDown, this);
};

CountdownHandler.prototype.postInitialize = function() {
    // this.app.fire("SoundManager:Play", "CountDown");
    // this.countDown();
};

// update code called every frame
CountdownHandler.prototype.countDown = function (onComplete) {
    // console.log("countDown: ", onComplete);
    if (this.fadeTween)
        TweenWrapper.StopTween(this.fadeTween);

    if (this.scaleTween)
        TweenWrapper.StopTween(this.scaleTween);
    
    // this.app.fire("SoundManager:Play", "CountDown");
    this.uIBlocker.element.useInput = this.blockUI;
    this.onCompleteCountDown = onComplete;
    this.countdownNumber = 0;

    this.countDownHelper(this.countdownNumber);
};

CountdownHandler.prototype.countDownHelper = function(number) {
    // console.log("-------------------------");
    // console.log("countDownHelper: ", number);
    this.enableTxts(false);
    this.setText(number);
    this.tweenHelper(0);
};

CountdownHandler.prototype.tweenHelper = function(index) {
    // console.log("tweenHelper: ", index);
    let fromFade = this.animationSettings[index].startFade;
    let toFade = this.animationSettings[index].endFade;
    let fadeDuration = this.animationSettings[index].fadeDuration;

    let txt = this.animationSettings[index].customTxt || this.txt;
    txt.enabled = true;

    // let oC = txt.element.outlineColor;
    if (this.animationSettings[index].fadeOutline) {
        this.oC.set(txt.element.outlineColor.r, txt.element.outlineColor.g, txt.element.outlineColor.b);
        this.oC.a = fromFade;
        txt.element.outlineColor = this.oC;
    }

    this.fadeTween = TweenWrapper.TweenNumber(fromFade, toFade, fadeDuration, (obj) => {
        // console.log(obj.number);
        if (this.animationSettings[index].fadeOutline) {
            // outlineColor.a = obj.number;
            // txt.element.outlineColor.a = obj.number;
            this.oC.a = obj.number;
            txt.element.outlineColor = this.oC;
            // console.log(txt.name, ': ', obj.number, txt.element.outlineColor);
        }
        else
            txt.element.opacity = obj.number;
    });

    let fromScale = this.animationSettings[index].startScale;
    let toScale = this.animationSettings[index].endScale;
    let scaleDuration = this.animationSettings[index].scaleDuration;

    txt.setLocalScale(fromScale.x, fromScale.y, fromScale.z);
    this.scaleTween = TweenWrapper.Tween(txt, txt.getLocalScale(), toScale, scaleDuration);

    let duration = fadeDuration > scaleDuration ? fadeDuration : scaleDuration;
    CustomCoroutine.Instance.set(this.recursiveCaller.bind(this, index), duration);
};

CountdownHandler.prototype.recursiveCaller = function (index) {
    // console.log("recursiveCaller: ", index);
    index++;
    if (index < this.getTweenLimit())
        this.tweenHelper(index);
    else {
        this.countdownNumber++;

        if (this.countdownNumber < this.getLimit())
            this.countDownHelper(this.countdownNumber);
        else {
            this.enableTxts(false);
            this.uIBlocker.element.useInput = false;
            try {
                if (this.onCompleteCountDown) {
                    this.onCompleteCountDown();
                }
            } catch (e) { }
        }

    }
};

CountdownHandler.prototype.setText = function(number) {
    // console.log("setText: ", this.distinctCharacters[number]);
    if (this.distinctCharacters.length > 0)
        this.setTxts(this.distinctCharacters[number]);
    else
        this.setTxts(number);
};

CountdownHandler.prototype.getLimit = function() {
    return this.distinctCharacters.length > 0 ? this.distinctCharacters.length : Math.abs(this.start - this.end);
};

CountdownHandler.prototype.getTweenLimit = function() {
    return this.animationSettings.length;
};

CountdownHandler.prototype.enableTxts = function(enable) {
    this.txt.enabled = enable;

    for (let i = 0; i < this.animationSettings.length; i++) {
        if (this.animationSettings[i].customTxt)
            this.animationSettings[i].customTxt.enabled = enable;
    }
};

CountdownHandler.prototype.setTxts = function(val) {
    this.txt.element.text = val;

    for (let i = 0; i < this.animationSettings.length; i++) {
        if (this.animationSettings[i].customTxt)
            this.animationSettings[i].customTxt.element.text = val;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// CountdownHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// fps.js
// Just add this script to any object in the scene (usually Root) and it will 
// appear in the app as HTML overlay

if (typeof(document) !== "undefined") {
    /*! FPSMeter 0.3.1 - 9th May 2013 | https://github.com/Darsain/fpsmeter */
    (function(m,j){function s(a,e){for(var g in e)try{a.style[g]=e[g]}catch(j){}return a}function H(a){return null==a?String(a):"object"===typeof a||"function"===typeof a?Object.prototype.toString.call(a).match(/\s([a-z]+)/i)[1].toLowerCase()||"object":typeof a}function R(a,e){if("array"!==H(e))return-1;if(e.indexOf)return e.indexOf(a);for(var g=0,j=e.length;g<j;g++)if(e[g]===a)return g;return-1}function I(){var a=arguments,e;for(e in a[1])if(a[1].hasOwnProperty(e))switch(H(a[1][e])){case "object":a[0][e]=
    I({},a[0][e],a[1][e]);break;case "array":a[0][e]=a[1][e].slice(0);break;default:a[0][e]=a[1][e]}return 2<a.length?I.apply(null,[a[0]].concat(Array.prototype.slice.call(a,2))):a[0]}function N(a){a=Math.round(255*a).toString(16);return 1===a.length?"0"+a:a}function S(a,e,g,j){if(a.addEventListener)a[j?"removeEventListener":"addEventListener"](e,g,!1);else if(a.attachEvent)a[j?"detachEvent":"attachEvent"]("on"+e,g)}function D(a,e){function g(a,b,d,c){return y[0|a][Math.round(Math.min((b-d)/(c-d)*J,J))]}
    function r(){f.legend.fps!==q&&(f.legend.fps=q,f.legend[T]=q?"FPS":"ms");K=q?b.fps:b.duration;f.count[T]=999<K?"999+":K.toFixed(99<K?0:d.decimals)}function m(){z=A();L<z-d.threshold&&(b.fps-=b.fps/Math.max(1,60*d.smoothing/d.interval),b.duration=1E3/b.fps);for(c=d.history;c--;)E[c]=0===c?b.fps:E[c-1],F[c]=0===c?b.duration:F[c-1];r();if(d.heat){if(w.length)for(c=w.length;c--;)w[c].el.style[h[w[c].name].heatOn]=q?g(h[w[c].name].heatmap,b.fps,0,d.maxFps):g(h[w[c].name].heatmap,b.duration,d.threshold,
    0);if(f.graph&&h.column.heatOn)for(c=u.length;c--;)u[c].style[h.column.heatOn]=q?g(h.column.heatmap,E[c],0,d.maxFps):g(h.column.heatmap,F[c],d.threshold,0)}if(f.graph)for(p=0;p<d.history;p++)u[p].style.height=(q?E[p]?Math.round(O/d.maxFps*Math.min(E[p],d.maxFps)):0:F[p]?Math.round(O/d.threshold*Math.min(F[p],d.threshold)):0)+"px"}function k(){20>d.interval?(x=M(k),m()):(x=setTimeout(k,d.interval),P=M(m))}function G(a){a=a||window.event;a.preventDefault?(a.preventDefault(),a.stopPropagation()):(a.returnValue=
    !1,a.cancelBubble=!0);b.toggle()}function U(){d.toggleOn&&S(f.container,d.toggleOn,G,1);a.removeChild(f.container)}function V(){f.container&&U();h=D.theme[d.theme];y=h.compiledHeatmaps||[];if(!y.length&&h.heatmaps.length){for(p=0;p<h.heatmaps.length;p++){y[p]=[];for(c=0;c<=J;c++){var b=y[p],e=c,g;g=0.33/J*c;var j=h.heatmaps[p].saturation,m=h.heatmaps[p].lightness,n=void 0,k=void 0,l=void 0,t=l=void 0,v=n=k=void 0,v=void 0,l=0.5>=m?m*(1+j):m+j-m*j;0===l?g="#000":(t=2*m-l,k=(l-t)/l,g*=6,n=Math.floor(g),
    v=g-n,v*=l*k,0===n||6===n?(n=l,k=t+v,l=t):1===n?(n=l-v,k=l,l=t):2===n?(n=t,k=l,l=t+v):3===n?(n=t,k=l-v):4===n?(n=t+v,k=t):(n=l,k=t,l-=v),g="#"+N(n)+N(k)+N(l));b[e]=g}}h.compiledHeatmaps=y}f.container=s(document.createElement("div"),h.container);f.count=f.container.appendChild(s(document.createElement("div"),h.count));f.legend=f.container.appendChild(s(document.createElement("div"),h.legend));f.graph=d.graph?f.container.appendChild(s(document.createElement("div"),h.graph)):0;w.length=0;for(var q in f)f[q]&&
    h[q].heatOn&&w.push({name:q,el:f[q]});u.length=0;if(f.graph){f.graph.style.width=d.history*h.column.width+(d.history-1)*h.column.spacing+"px";for(c=0;c<d.history;c++)u[c]=f.graph.appendChild(s(document.createElement("div"),h.column)),u[c].style.position="absolute",u[c].style.bottom=0,u[c].style.right=c*h.column.width+c*h.column.spacing+"px",u[c].style.width=h.column.width+"px",u[c].style.height="0px"}s(f.container,d);r();a.appendChild(f.container);f.graph&&(O=f.graph.clientHeight);d.toggleOn&&("click"===
    d.toggleOn&&(f.container.style.cursor="pointer"),S(f.container,d.toggleOn,G))}"object"===H(a)&&a.nodeType===j&&(e=a,a=document.body);a||(a=document.body);var b=this,d=I({},D.defaults,e||{}),f={},u=[],h,y,J=100,w=[],W=0,B=d.threshold,Q=0,L=A()-B,z,E=[],F=[],x,P,q="fps"===d.show,O,K,c,p;b.options=d;b.fps=0;b.duration=0;b.isPaused=0;b.tickStart=function(){Q=A()};b.tick=function(){z=A();W=z-L;B+=(W-B)/d.smoothing;b.fps=1E3/B;b.duration=Q<L?B:z-Q;L=z};b.pause=function(){x&&(b.isPaused=1,clearTimeout(x),
    C(x),C(P),x=P=0);return b};b.resume=function(){x||(b.isPaused=0,k());return b};b.set=function(a,c){d[a]=c;q="fps"===d.show;-1!==R(a,X)&&V();-1!==R(a,Y)&&s(f.container,d);return b};b.showDuration=function(){b.set("show","ms");return b};b.showFps=function(){b.set("show","fps");return b};b.toggle=function(){b.set("show",q?"ms":"fps");return b};b.hide=function(){b.pause();f.container.style.display="none";return b};b.show=function(){b.resume();f.container.style.display="block";return b};b.destroy=function(){b.pause();
    U();b.tick=b.tickStart=function(){}};V();k()}var A,r=m.performance;A=r&&(r.now||r.webkitNow)?r[r.now?"now":"webkitNow"].bind(r):function(){return+new Date};for(var C=m.cancelAnimationFrame||m.cancelRequestAnimationFrame,M=m.requestAnimationFrame,r=["moz","webkit","o"],G=0,k=0,Z=r.length;k<Z&&!C;++k)M=(C=m[r[k]+"CancelAnimationFrame"]||m[r[k]+"CancelRequestAnimationFrame"])&&m[r[k]+"RequestAnimationFrame"];C||(M=function(a){var e=A(),g=Math.max(0,16-(e-G));G=e+g;return m.setTimeout(function(){a(e+
    g)},g)},C=function(a){clearTimeout(a)});var T="string"===H(document.createElement("div").textContent)?"textContent":"innerText";D.extend=I;window.FPSMeter=D;D.defaults={interval:100,smoothing:10,show:"fps",toggleOn:"click",decimals:1,maxFps:60,threshold:100,position:"absolute",zIndex:10,left:"5px",top:"5px",right:"auto",bottom:"auto",margin:"0 0 0 0",theme:"dark",heat:0,graph:0,history:20};var X=["toggleOn","theme","heat","graph","history"],Y="position zIndex left top right bottom margin".split(" ")})(window);(function(m,j){j.theme={};var s=j.theme.base={heatmaps:[],container:{heatOn:null,heatmap:null,padding:"5px",minWidth:"95px",height:"30px",lineHeight:"30px",textAlign:"right",textShadow:"none"},count:{heatOn:null,heatmap:null,position:"absolute",top:0,right:0,padding:"5px 10px",height:"30px",fontSize:"24px",fontFamily:"Consolas, Andale Mono, monospace",zIndex:2},legend:{heatOn:null,heatmap:null,position:"absolute",top:0,left:0,padding:"5px 10px",height:"30px",fontSize:"12px",lineHeight:"32px",fontFamily:"sans-serif",
    textAlign:"left",zIndex:2},graph:{heatOn:null,heatmap:null,position:"relative",boxSizing:"padding-box",MozBoxSizing:"padding-box",height:"100%",zIndex:1},column:{width:4,spacing:1,heatOn:null,heatmap:null}};j.theme.dark=j.extend({},s,{heatmaps:[{saturation:0.8,lightness:0.8}],container:{background:"#222",color:"#fff",border:"1px solid #1a1a1a",textShadow:"1px 1px 0 #222"},count:{heatOn:"color"},column:{background:"#3f3f3f"}});j.theme.light=j.extend({},s,{heatmaps:[{saturation:0.5,lightness:0.5}],
    container:{color:"#666",background:"#fff",textShadow:"1px 1px 0 rgba(255,255,255,.5), -1px -1px 0 rgba(255,255,255,.5)",boxShadow:"0 0 0 1px rgba(0,0,0,.1)"},count:{heatOn:"color"},column:{background:"#eaeaea"}});j.theme.colorful=j.extend({},s,{heatmaps:[{saturation:0.5,lightness:0.6}],container:{heatOn:"backgroundColor",background:"#888",color:"#fff",textShadow:"1px 1px 0 rgba(0,0,0,.2)",boxShadow:"0 0 0 1px rgba(0,0,0,.1)"},column:{background:"#777",backgroundColor:"rgba(0,0,0,.2)"}});j.theme.transparent=
    j.extend({},s,{heatmaps:[{saturation:0.8,lightness:0.5}],container:{padding:0,color:"#fff",textShadow:"1px 1px 0 rgba(0,0,0,.5)"},count:{padding:"0 5px",height:"40px",lineHeight:"40px"},legend:{padding:"0 5px",height:"40px",lineHeight:"42px"},graph:{height:"40px"},column:{width:5,background:"#999",heatOn:"backgroundColor",opacity:0.5}})})(window,FPSMeter);    
}

var Fps = pc.createScript('fps');

Fps.attributes.add('broadcastEntities', { type: 'entity', title: 'Broadcast Entities', array: true});

Fps.prototype.initialize = function () {
    this.fps = new FPSMeter({heat: true, graph: true});
};

    // Called every frame, dt is time in seconds since last update
Fps.prototype.update = function (dt) {
    this.fps.tick();
    for (let i = 0; i < this.broadcastEntities.length; i++) {
        this.broadcastEntities[i].fire("OnFpsTick", this.fps.fps);
    }
};


// buttonController.js
var ButtonController = pc.createScript('buttonController');

ButtonController.attributes.add('event', {
    title: 'Events',
    type: 'json',
    schema: [
        {
            name: 'eventScope', type: 'number', title: 'Events Scope',
            enum: [{ 'App': 0 }, { 'Entity': 1 },], default: 0
        },
        { name: 'onClick', type: 'string', title: 'On Click', description: 'This event will be fired when button is clicked', default: 'ButtonController:OnClick'},
        { name: 'onPointerDown', type: 'string', title: 'On Point Down', description: 'This event will be fired when button is pressed'},
        { name: 'onPointerUp', type: 'string', title: 'On Point Up', description: 'This event will be fired when button is released'},
    ],
    description: 'No event Will be fired if left empty',
});

ButtonController.attributes.add('btn', {
    title: 'Button Settings',
    type: 'json',
    schema: [
        { name: 'doubleTapSpeed', type: 'number', title: 'Double tap speed', description: 'If value is 0 simple click will be used, otherwise double tap' },
        { name: 'labelTxt', type: 'entity', title: 'Button Label', description: 'Fire SetLabel event to set value of this text' },
        { name: 'iconImg', type: 'entity', title: 'Button Icon', description: 'Fire SetIcon event to set value of this image' },
    ],
});

ButtonController.attributes.add('animSettings', {
    title: 'Animation Settings',
    type: 'json',
    schema: [
        {
            name: 'eventScope', type: 'number', title: 'Events Scope',
            enum: [{ 'App': 0 }, { 'Entity': 1 }, { 'Disabled' : 2}], default: 0
        },
        { name: 'onClick', type: 'string', title: 'Click', description: 'This event will be called on scope when button is clicked', default: 'OnClickAnim' },
        { name: 'onPointerDown', type: 'string', title: 'On Point Down', description: 'This event will be called on scope when button is pressed', default: 'OnPointerDownAnim' },
        { name: 'onPointerUp', type: 'string', title: 'On Point Up', description: 'This event will be called on scope when button is released', default: 'OnPointerUpAnim' }
    ],
});

ButtonController.attributes.add('argsSettings', {
    title: 'Arguments Settings',
    type: 'json',
    schema: [
        { name: 'sendAsSeperateArgs', type: 'boolean', title: 'Send As Params' },
        {
            name: 'includeInArgs', type: 'number', title: 'Include Sender',
            enum: [
                { 'None': 0 },
                { 'Name': 1 },
                { 'Entity': 2 },
            ],
            default: 0
        },
        { name: 'args', type: 'string', title: 'Arguments', array: true },
    ],
});

ButtonController.attributes.add('setterEvents', {
    title: 'Setter Events',
    type: 'json',
    schema: [
        {
            name: 'eventScope', type: 'number', title: 'Events Scope',
            enum: [{ 'App': 0 }, { 'Entity': 1 },], default: 1
        },
        { name: 'onClick', type: 'string', title: 'On Click', default: 'SetEvent:OnClick'},
        { name: 'onPointerDown', type: 'string', title: 'On Pointer Down', default: 'SetEvent:OnPointerDown'},
        { name: 'onPointerUp', type: 'string', title: 'On Pointer Up', default: 'SetEvent:OnPointerUp'},
        { name: 'setLabel', type: 'string', title: 'Set Label', default: 'SetLabel'},
        { name: 'setIcon', type: 'string', title: 'Set Icon', default: 'SetIcon'},
        { name: 'setArgs', type: 'string', title: 'Set Arguments', default: 'SetArgs'},
    ],
});

// ************************
// * Playcanvas Callbacks *
// ************************

// initialize code called once per entity
ButtonController.prototype.initialize = function() {

    this.initialized = false;
    // // console.log("------------------------");
    // // console.log("initialize: " + this.entity.name);
    this.onEnable();

    this.on('enable', this.onEnable, this);
    this.on('disable', this.onDisable, this);
    this.on('destroy', this.onDisable, this);


    this.setEvents();

    this.entity.on('SetIcon', (icon) => {
        this.btn.iconImg.element.texture = icon;
    });

    this.entity.on('SetLabel', (label) => {
        this.btn.labelTxt.element.text = label;
    });
};

ButtonController.prototype.onEnable = function () {
    if (this.initialized) return;
    this.initialized = true;
    // // console.log("onEnable: " + this.entity.name);

    this.timeSinceLastTap = 0;
    this.entity.button.on("click", this.onClick, this);

    if (this.app.touch)
    {
        this.entity.element.on('touchstart', this.onPointerDown, this);
        this.entity.element.on('touchend', this.onPointerUp, this);
    }
    else {
        this.entity.element.on('mousedown', this.onPointerDown, this);
        this.entity.element.on('mouseup', this.onPointerUp, this);
    }
};

ButtonController.prototype.onDisable = function () {
    if (!this.initialized) return;
    this.initialized = false;
    // // console.log("onDisable: " + this.entity.name);
    this.entity.button.off("click", this.onClick, this);

    if (this.app.touch) {
        this.entity.element.off('touchstart', this.onPointerDown, this);
        this.entity.element.off('touchend', this.onPointerUp, this);
    }
    else {
        this.entity.element.off('mousedown', this.onPointerDown, this);
        this.entity.element.off('mouseup', this.onPointerUp, this);
    }
};

ButtonController.prototype.update = function(dt) {

    if (this.timeSinceLastTap > 0)
        this.timeSinceLastTap -= dt;
    else if (this.timeSinceLastTap < 0)
        this.timeSinceLastTap = 0;
};

// ******************
// * Pointer Events *
// ******************

ButtonController.prototype.onPointerDown = function (ev) {
    // console.log(`${this.entity.name} -> onPointerDown:`);
    this.raiseAnimEvent(this.animSettings.onPointerDown);
    this.raiseEvent(this.event.onPointerDown);
};

ButtonController.prototype.onPointerUp = function () {
    // console.log(`${this.entity.name} -> onPointerUp`);
    this.raiseAnimEvent(this.animSettings.onPointerUp);
    this.raiseEvent(this.event.onPointerUp);
};

ButtonController.prototype.onClick = function(ev) {
    // console.log(`${this.entity.name} -> onClick ${ev}`);

    if (!this.manageDoubleTap())
        return;

    this.raiseAnimEvent(this.animSettings.onClick);
    this.raiseEvent(this.event.onClick);
};

// *******************
// * Functionalities *
// *******************

ButtonController.prototype.setEvents = function() {
    let scope = this.setterEvents.eventScope === 0 ? this.app : this.entity;

    scope.on(this.setterEvents.onClick, (eventName) => {
        this.event.onClick = eventName;
    });

    scope.on(this.setterEvents.onPointerDown, (eventName) => {
        this.event.onPointerDown = eventName;
    });

    scope.on(this.setterEvents.onPointerUp, (eventName) => {
        this.event.onPointerUp = eventName;
    });

    scope.on(this.setterEvents.setLabel, (label) => {
        if (this.btn.labelTxt) this.btn.labelTxt.element.text = label;
    });

    scope.on(this.setterEvents.setIcon, (icon) => {
        if (this.btn.iconImg) this.btn.iconImg.element.texture = icon;
    });

    scope.on(this.setterEvents.setArgs, (args, clearPrevArgs) => {
        // console.log('setArgs: ', args, clearPrevArgs);
        if (clearPrevArgs) this.argsSettings.args = [];
        
        for (let i = 0; i < args.length; i++) {
            this.argsSettings.args.push(args[i]);
        }
    });
};

ButtonController.prototype.manageDoubleTap = function() {

    if (this.btn.doubleTapSpeed > 0)
    {
        if (this.timeSinceLastTap <= 0)
        {
            this.timeSinceLastTap = this.btn.doubleTapSpeed;
            return false;
        }

        this.timeSinceLastTap = 0;

        // // console.log('double tapped');
    }

    return true;
};

ButtonController.prototype.raiseEvent = function(eventName) {
    
    if (eventName.length <= 0) return;
    
    let args = [];

    for(let i = 0; i < this.argsSettings.args.length; i++)
        args.push(this.argsSettings.args[i]);

    let senderInfo = this.getSenderInfo();
    if (senderInfo) args.push(senderInfo);

    let scope = this.event.eventScope === 0 ? this.app : this.entity;

    // console.log(`Button: ${eventName}`);
    // console.log('raiseEvent: ', args);
    if (!this.argsSettings.sendAsSeperateArgs)
        scope.fire(eventName, args);
    else
        scope.fire(eventName, ...args);
};

ButtonController.prototype.raiseAnimEvent = function (eventName) {
    if (this.animSettings.eventScope === 2) return; // if disabled

    let scope = this.animSettings.eventScope === 0 ? this.app : this.entity;
    if (eventName.length > 0)
        scope.fire(eventName);
};

ButtonController.prototype.getSenderInfo = function () {
    switch (this.argsSettings.includeInArgs) {
        case 0: // include nothing
            return undefined;
        case 1: // include name
            return this.entity.name;
        case 2: // include entity
            return this.entity;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// ButtonController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// ButtonAnimController.js
var ButtonAnimController = pc.createScript('buttonAnimController');

ButtonAnimController.attributes.add('animationSettings', {
    type: 'json',
    title: 'Animation Settings',
    schema: [
        {
            name: 'type',
            type: 'number',
            enum: 
            [
                { 'Bounce': 0 },
                { 'ScaleOutIn': 1 },
                { 'None': 2 },
                { 'LeftRight': 3 },

            ],
            default: 0
        },
        { name: 'duration', type: 'number'}, 
        { name: 'animValue', type: 'vec3', default: [0.9, 1, 1.2], description: 'x: min animValue | y: base animValue | z: max animValue'},
        { name: 'delegate', type: 'entity', description: 'If no delegate is given, entity having this script will be animated. Otherwise delegate will be animated.'}, 
    ],
});

ButtonAnimController.attributes.add('enabledSettings', {
    type: 'json',
    title: 'Enabled Settings',
    schema: [
        {
            name: 'animType',
            type: 'number',
            enum: 
            [
                { 'Bounce': 0 },
                { 'ScaleOutIn': 1 },
                { 'None': 2 },
                { 'LeftRight': 3 },
            ],
            default: 3
        },
        { name: 'isEnabled', type: 'boolean', default: true}, 
        { name: 'animDuration', type: 'number', default: 0.15}, 
        { name: 'animValue', type: 'vec3', default: [-15, 7.5, 7.5], description: 'x: min animValue | y: base animValue | z: max animValue'},
        { name: 'delegate', type: 'entity', description: 'Assign delegate to change this.entity Image to deligate Image.'}, 
    ],
});

ButtonAnimController.AnimType = {
    Bounce: 0,
    ScaleOutIn: 1,
    None: 2,
    LeftRight: 3,
};

ButtonAnimController.prototype.initialize = function() {
    this.initialized = false;
    // // console.log("------------------------");
    // // console.log("initialize: " + this.entity.name);
    this.onEnable();

    this.on('enable', this.onEnable, this);
    this.on('disable', this.onDisable, this);
    this.on('destroy', this.onDisable, this);

    this.entity.on('OnClickAnim', this.onClickAnim, this);
};

ButtonAnimController.prototype.onEnable = function () {
    if (this.initialized) return;
    this.initialized = true;

    if (this.animationSettings.type === ButtonAnimController.AnimType.None)
        return;

    let entity = this.animationSettings.delegate === null ? this.entity : this.animationSettings.delegate;
    let baseScale = this.animationSettings.animValue.y;
    entity.setLocalScale(baseScale, baseScale, baseScale);
};

ButtonAnimController.prototype.onDisable = function () {
    if (!this.initialized) return;
    this.initialized = false;
};

ButtonAnimController.prototype.onClickAnim = function() {
    if (!this.enabledSettings.isEnabled)
    {
        this.animateButton(this.enabledSettings.animType);
        return;
    }

    this.animateButton(this.animationSettings.type);
};

ButtonAnimController.prototype.animateButton = function(animType) {

    let entity = this.animationSettings.delegate || this.entity;
    // // console.log("entity: " + entity.name);

    switch(animType)
    {
        case ButtonAnimController.AnimType.Bounce:
            TweenWrapper.TweenNumber(this.animationSettings.animValue.x, this.animationSettings.animValue.y, this.animationSettings.duration, function(obj) {
                entity.setLocalScale(obj.number, obj.number, obj.number);
            }.bind(this), null, pc.BounceOut);
            break;
        case ButtonAnimController.AnimType.ScaleOutIn:
            let updateScale = function(obj) {
                entity.setLocalScale(obj.number, obj.number, obj.number);
            }.bind(this);

            TweenWrapper.TweenNumber(this.animationSettings.animValue.y, this.animationSettings.animValue.z, this.animationSettings.duration, updateScale , function() { 
                TweenWrapper.TweenNumber(this.animationSettings.animValue.z, this.animationSettings.animValue.y, this.animationSettings.duration, updateScale);
            }.bind(this));
            break;
        case ButtonAnimController.AnimType.LeftRight:
            let axis = [ this.enabledSettings.animValue.z, this.enabledSettings.animValue.x, this.enabledSettings.animValue.y];
            let animateHelper = function(index) {
                animate(index + 1);
            };

            let animate = function(index) {
                if (index > 2) return;

                // // console.log("Animate: " + index);
                let start = entity.getLocalPosition();
                // // console.log("start: " + start);

                let end = entity.getLocalPosition().clone();
                end.x += axis[index];
                // // console.log("end: " + end);


                TweenWrapper.Tween(entity, entity.getLocalPosition(), end, this.enabledSettings.animDuration, function() { animate(index + 1); });
            }.bind(this);
            animate(0);
            break;
    }
};
// image params = { type, resize, resource }
ButtonAnimController.prototype.setEnabled = function(enable, image) {

    let entity = this.enabledSettings.delegate || this.entity;
    // // console.log(image);
    // // console.log(entity.element.texture);

    this.enabledSettings.isEnabled = enable;

    // if (entity.element.texture !== undefined && entity.element.texture !== null)
    //     // console.log(entity.element.texture);

    if (image === undefined)
        return;

    if (image.type === "Texture")
    {
        // // console.log("image: " + image.resource);
        entity.element.texture = image.resource;
    }
    else
        entity.element.sprite = image.resource;

    if (image.resize)
    {
        // // console.log(`${image.width}x${image.height}`);
        entity.element.width = image.width;
        entity.element.height = image.height;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// ButtonAnimController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// ShopTile.js
var ShopTile = pc.createScript('shopTile');

ShopTile.attributes.add('pageID', { type: 'number', title: 'Page ID', default: 0 });
ShopTile.attributes.add('id', { type: 'number', title: 'ID' });
ShopTile.attributes.add('itemName', { type: 'string', title: 'Name' });
ShopTile.attributes.add('searchByName', { type: 'boolean', title: 'Search By Name' });
ShopTile.attributes.add('highlight', { type: 'entity', title: 'Highlight' });
ShopTile.attributes.add('icon', { type: 'entity', title: 'Icon' });
ShopTile.attributes.add('lock', { type: 'entity', title: 'Lock' });
ShopTile.attributes.add('eventName', { type: 'string', title: 'Event Name' });

// initialize code called once per entity
ShopTile.prototype.initialize = function () {
    this.entity.on('OnClick', this.onClick, this);
    this.entity.on('SetHighlight', this.setHighlight, this);
    this.entity.on('Lock', this.setLock, this);
    this.entity.on('SetIcon', this.setIcon, this);
    this.entity.on('SetOnClick', this.setOnClickCall, this);
    this.entity.on('Selected', this.selected, this);
};

// update code called every frame
ShopTile.prototype.update = function (dt) {

};

ShopTile.prototype.setLock = function (lock) {
    // console.log(this.entity.name, ' -> lock: ', lock);
    this.lock.enabled = lock;
    this.entity.button.active = !lock;
};

ShopTile.prototype.setIcon = function (icon) {
    this.icon.element.texture = icon;
};

ShopTile.prototype.setHighlight = function (highlight) {
    this.highlight.enabled = highlight;
};

ShopTile.prototype.selected = function () {
    this.setHighlight(true);
    if (this.searchByName)
        this.app.fire(this.eventName, this.itemName, this.pageID, this.id);
    else
        this.app.fire(this.eventName, this.pageID, this.id);
};

ShopTile.prototype.setOnClickCall = function (onClickCall) {
    this.onClickCall = onClickCall;
    //  console.log(this.entity);
    // console.log('ShopTile:setOnClickCall: ', this.onClickCall);
};

ShopTile.prototype.onClick = function () {
    let id = this.lock.enabled ? undefined : this.id;
    console.log('onClick: ', this.onClickCall);
    if (this.onClickCall) {
        this.onClickCall(id);
        // this.app.fire(this.eventName, this.id);
        //  console.log('ShopTile Clicked: ', this.eventName, " ", this.id);
    }
};


// swap method called for script hot-reloading
// inherit your script state here
// ShopTile.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// PaginationController.js
var PaginationController = pc.createScript('paginationController');

PaginationController.attributes.add('settings', {
    title: 'Settings',
    type: 'json',
    schema: [
        { name: 'totalPages', type: 'number', title: 'Total Pages', default: 5 },
        { name: 'clipDur', type: 'number', title: 'Clip Duration', default: 0.2 },
        { name: 'defaultPage', type: 'number', title: 'Default Page', default: 0 },
    ],
});

PaginationController.attributes.add('refs', {
    title: 'References',
    type: 'json',
    schema: [
        { name: 'content', type: 'entity', title: 'Content' },
        { name: 'scrollBar', type: 'entity', title: 'Scroll Bar' },
        { name: 'paginationIndicators', type: 'entity', title: 'Pagination Indicators', array: true },
    ],
});

// ************************
// * Playcanvas Callbacks *
// ************************

// initialize code called once per entity
PaginationController.prototype.initialize = function () {
    this.refs.content.element.on('mousedown', this.onMouseDown, this);
    this.refs.content.element.on('mouseup', this.onMouseUp, this);
    this.refs.content.element.on('touchstart', this.onTouchStart, this);
    this.refs.content.element.on('touchend', this.onTouchEnd, this);

    this.scrollTween = null;
    this.isContentPressed = false;
    this.prevPageNo = 0;
    this.currentPageNo = -1;

    // for (let i = 0; i < this.settings.totalPages; i++) {
    //     this.refs.paginationIndicators[i].enabled = false;
    // }

    // this.focusOnPage(this.settings.defaultPage);

    this.on('enable', this.onEnable, this);
    this.on('disable', this.onDisable, this);
};

PaginationController.prototype.postInitialize = function () {
    for (let i = 0; i < this.settings.totalPages; i++) {
        this.refs.paginationIndicators[i].enabled = false;
    }
    this.focusOnPage(this.settings.defaultPage);
    this.onEnable();
};

PaginationController.prototype.onEnable = function () {
    this.app.on('Pagination:OnClickButton', this.onClickButton, this);
};

PaginationController.prototype.onDisable = function () {
    this.app.off('Pagination:OnClickButton', this.onClickButton, this);
};

// * Mouse Events
PaginationController.prototype.onMouseDown = function (ev) {
    this.onContentPressed(true);
    ev.event.stopPropagation();
};

PaginationController.prototype.onMouseUp = function (ev) {
    this.onContentPressed(false);
    ev.event.stopPropagation();
};

// * Touch Events *
PaginationController.prototype.onTouchStart = function (ev) {
    this.onContentPressed(true);
    ev.event.stopPropagation();
};

PaginationController.prototype.onTouchEnd = function (ev) {
    this.onContentPressed(false);
    ev.event.stopPropagation();
};

// update code called every frame
PaginationController.prototype.update = function (dt) {
    if (this.isContentPressed)
        this.focusOnPage(this.findPageToFocus());
};

// *****************
// * Button Clicks *
// *****************

PaginationController.prototype.onClickButton = function (pageNo) {
    if (typeof (pageNo) === 'string')
        pageNo = parseInt(pageNo);
    this.focusOnPage(pageNo);
};

// *******************
// * Functionalities *
// *******************

PaginationController.prototype.onContentPressed = function (isPressed) {
    // console.log('isPressed: ', this.isContentPressed);
    this.isContentPressed = isPressed;
};

PaginationController.prototype.findPageToFocus = function () {
    let val = this.refs.scrollBar.scrollbar.value;
    let ratio = 1 / (this.settings.totalPages - 1);

    // i is page number
    // j is divider value
    for (let i = 0, j = ratio / 2; i < this.settings.totalPages; i++, j += ratio) {
        if (val < j) {
            return i;
        }
    }
};

PaginationController.prototype.focusOnPage = function (pageNo) {

   // console.log('focusOnPage: ', pageNo);
    // console.log('prevPageNo: ', this.prevPageNo);
    // console.log('currentPageNo: ', this.currentPageNo);
    // if (this.currentPageNo === pageNo) return;

    this.prevPageNo = this.currentPageNo;
    this.currentPageNo = pageNo;

    let val = this.refs.scrollBar.scrollbar.value;
    let ratio = 1 / (this.settings.totalPages - 1);

    if (this.scrollTween)
        TweenWrapper.StopTween(this.scrollTween);

    let target = pc.math.clamp(pageNo * ratio, 0, 1);

    // console.log(val, '!==', target);
    if (val !== target) {
        this.scrollTween = TweenWrapper.TweenNumber(val, target, this.settings.clipDur, (obj) => {
            this.refs.scrollBar.scrollbar.value = obj.number;
        }, () => {
            this.refs.scrollBar.scrollbar.value = target;
            this.scrollTween = null;
        })
    }

    this.updateIndicators();
};

PaginationController.prototype.updateIndicators = function () {

    let prev = this.prevPageNo;
    let current = this.currentPageNo;
    // console.log('updateIndicators: ');
    // console.log('prev: ', prev);
    // console.log('current: ', current);
    // console.log('totalPages: ', this.settings.totalPages);

    if (prev > -1 && prev < this.settings.totalPages) {
        // console.log('Setting prev');
        let prevIndicator = this.refs.paginationIndicators[prev];
        if (prevIndicator.script && prevIndicator.script.uianimator)
            prevIndicator.fire('disable');
        else
            prevIndicator.enabled = false;
    }

    if (current > -1 && current < this.settings.totalPages) {
        // console.log('Setting current');
        let currentIndicator = this.refs.paginationIndicators[current];
        currentIndicator.enabled = true;
    }
};


// swap method called for script hot-reloading
// inherit your script state here
// PaginationController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// HomeMenuEventListener.js
var HomeMenuEventListener = pc.createScript('homeMenuEventListener');

HomeMenuEventListener.attributes.add('bestScoreTxt', { type: 'entity', title: 'Best Score Text' });
HomeMenuEventListener.attributes.add('specialOffer', { type: 'entity', title: 'Special Offer' });
HomeMenuEventListener.attributes.add('specialOfferBtn', { type: 'entity', title: 'Special Offer Button' });
HomeMenuEventListener.attributes.add('firstTouch', { type: 'entity', title: 'First Touch Btn' });
HomeMenuEventListener.attributes.add('coinsTxt', { type: 'entity', title: 'Coins Text' });
HomeMenuEventListener.attributes.add('camera', { type: 'entity', title: 'Camera' });


HomeMenuEventListener.attributes.add('freeCoins', {
    title: 'Free Coins Settings',
    type: 'json',
    schema: [
        { name: 'count', type: 'number', title: 'Count' },
        { name: 'txt', type: 'entity', title: 'Text' },
        { name: 'btn', type: 'entity', title: 'Button' },
    ],
});

HomeMenuEventListener.attributes.add('settings', {
    title: 'Settings',
    type: 'json',
    schema: [
        { name: 'soundBtn', type: 'entity', title: 'Sound Button' },
        { name: 'vibrationBtn', type: 'entity', title: 'Viberation Button' },
        // { name: 'restoreBtn', type: 'entity', title: 'Restore Button' },
    ],
});

// initialize code called once per entity
HomeMenuEventListener.prototype.initialize = function () {

    console.log('HomeMenuEventListener:initialize');

    this.isSoundOn = true;
    this.isViberationOn = true;
    this.isChallenge = true;
    this.storeBtnInitialized = false;
    this.isSettingsEnabled = false;
    this.firstTouch.enabled = pc.platform.name !== 'windows';

    this.on('enable', this.onEnable, this);
    this.app.on('HomeMenu:OnClick', this.onClickButton, this);
    this.app.on('EconomyManager:OnCoinsUpdated', this.onCoinsUpdated, this);
    this.app.on('HomeMenu:UpdateValues', this.coinsUpdate, this);
    this.app.on('PopUp:SpecialOffer', this.popSpecialOffer, this);
    this.app.on('HomeMenu:FirstTouch', this.firstTouchDetect, this);
    this.app.on('SdkManager:RewaredAdLoaded', this.updateFreeCoinBtn, this);
    this.app.on('ChallengeFriend:Play', this.startChallenge, this);
    this.app.on('SdkManager:StoreReady', this.onStoreReady, this)
    this.app.on('SdkManager:OnAdsInitialized', this.onAdsInitialized, this)
    this.app.on('HomeMenu:SetProductInfo', this.setProductInfo, this);

    console.log('HomeMenuEventListener:initialize:complete');
};

HomeMenuEventListener.prototype.postInitialize = function () {
    // 2 is index of Android/iOS SDK.
    // we will autostart sound in android and iOS mobiles
    if (GameManager.FirstClick || SdkManager.Instance.isCurrentSDK([2]))
        this.firstTouchDetect();

    this.onEnable();
};

HomeMenuEventListener.prototype.startChallenge = function () {
    this.onClickButton('Play');
};

HomeMenuEventListener.prototype.firstTouchDetect = function () {
    //  console.warn('HomeMenuEventListener:firstTouchDetect ');
    this.firstTouch.enabled = false;
    this.app.fire("SoundManager:Play", "TitleScreen", 0, false);
};

HomeMenuEventListener.prototype.updateFreeCoinBtn = function (isActive) {
    if (SdkManager.Instance.test.isEditor)
        isActive = SdkManager.Instance.test.isSuccessful;
    // this.freeCoins.btn.button.active = isActive;
    // this.freeCoins.btn.script.enabled = isActive;
    //this.freeCoins.script.enabled = isActive;
};


HomeMenuEventListener.prototype.onEnable = function () {
    this.enableSettings(false);

    this.app.fire("SoundManager:Stop", "GamePlay");
    this.app.fire('SdkManager:ShowAd', 'Banner', undefined, false, [0, 1]);
    this.app.fire('SdkManager:ShowAd', 'Banner', undefined, true, [2]);

    if (!this.firstTouch.enabled)
        this.app.fire("SoundManager:Play", "TitleScreen", 0, false);

    if (ScoreManager.Instance.bestScore)
        this.bestScoreTxt.element.text = ScoreManager.Instance.bestScore;

    if (this.freeCoins.txt)
        this.freeCoins.txt.element.text = this.freeCoins.count + "";

    if (pc.platform.desktop)
        this.camera.setPosition(0, 4, 10);
    else
        this.camera.setPosition(0, 7, 14);

    this.app.fire('Gameplay:Reset', false);
    this.onCoinsUpdated(EconomyManager.Instance.getCoins());
    this.updateFreeCoinBtn(SdkManager.Instance.isRewarededAdLoaded);

    // this.app.fire('SdkManager:GetLeaderBoard', this.setBoard.bind(this));

    if (this.isChallenge) {
        this.isChallenge = false;
        this.app.fire('SdkManager:CheckVSmode');
    }
    console.log('setProductInfo: ', DataManager.Instance.isOfferPurchased);

    if (pc.platform.ios)
        this.setProductInfo(0, !DataManager.Instance.isOfferPurchased);
    else
        this.app.fire('SdkManager:GetProductInfo', this.setProductInfo.bind(this));
};

// HomeMenuEventListener.prototype.setBoard = function (entries) {
//     console.log("LeaderboardMenuEventListener:setBoard:", entries);
// };

HomeMenuEventListener.prototype.coinsUpdate = function () {
    let coins = EconomyManager.Instance.getCoins();
    console.log('HomeMenuEventListener:coinsUpdate: ', coins);
    this.onCoinsUpdated(coins);
    this.bestScoreTxt.element.text = ScoreManager.Instance.bestScore;
};


// update code called every frame
HomeMenuEventListener.prototype.update = function (dt) {

};

// *****************
// * Button Clicks *
// *****************

HomeMenuEventListener.prototype.onClickButton = function (name) {
    console.log('HomeMenuEventListener:onClickButton: ', name);
    if (name !== "Play") {
        this.app.fire("SoundManager:Play", "BtnPress");
        if (this.firstTouch.enabled) {
            this.firstTouchDetect();
        }
    }
    else if (this.firstTouch.enabled) {
        this.firstTouch.enabled = false;
    }
    switch (name) {
        case "Settings":
            this.isSettingsEnabled = !this.isSettingsEnabled;
            this.enableSettings(this.isSettingsEnabled);
            break;
        case "Sound":
            this.onClickSoundBtn();
            break;
        case "Vibration":
            this.onClickVibrationBtn();
            break;
        case "Restore":
            this.app.fire('SdkManager:IapRestore');
            break;
        case "FreeCoins":
            this.onClickFreeCoinsBtn();
            // this.freeCoins.btn.active = false;
            break;
        case "Tournament":
            this.app.fire('SdkManager:CreateTournament');
            break;
        case "Costumes":
            MenuManager.Instance.changeState(MenuManager.States.Costumes);
            this.app.fire('Show:CostumePanel');
            break;
        case "Play":
            this.app.fire("SoundManager:Play", ['PlayBtn1', 'PlayBtn1']);
            MenuManager.Instance.changeState(MenuManager.States.Gameplay);
            break;
        case "Themes":
            console.log("Opening Themes!");
            MenuManager.Instance.changeState(MenuManager.States.Costumes);
            this.app.fire('Show:ThemePanel');
            break;
        case "InviteFriends":
            console.log('HomeMenu:InviteFriends');
            this.app.fire('SdkManager:InviteFriends');
            break;
        case "SpecialOffer":
            console.log("SpecialOffer: ", this.specialOffer);
            this.specialOffer.enabled = true;
            break;
        case "ShareImage":
            console.log("HomeMenu:ShareImage");
            this.app.fire("SdkManager:Sharing");
            break;
        case "Leaderboard":
            console.log('HomeMenu:Leaderboard');
            AdsManager.Instance.showAdLoading('Loading Leaderboard...', true);
            this.app.fire('SdkManager:ShowLeaderboard', () =>
                AdsManager.Instance.showAdLoading('Loading Leaderboard...', false)
            );
            break;
    }
};

// *******************
// * Functionalities *
// *******************

HomeMenuEventListener.prototype.onClickFreeCoinsBtn = function () {
    console.log('HomeMenuEventListener:onClickFreeCoinsBtn: ', SdkManager.Instance.isRewarededAdLoaded)
    if (SdkManager.Instance.isRewarededAdLoaded)
        this.app.fire('SdkManager:ShowAd', 'Rewarded', this.addCoins.bind(this));
    else {
        this.app.fire(
            'PopupView:Show', true, "Ad unavailable",
            'Please check you have an active internet or WiFi connection and please try again later.',
            () => this.app.fire('PopupView:Show', false)
        )
    }
};

HomeMenuEventListener.prototype.addCoins = function (message) {
    if (message) return console.error('HomeMenuEventListener:addCoins: ', message);
    EconomyManager.Instance.addCoins(this.freeCoins.count);
};

HomeMenuEventListener.prototype.onCoinsUpdated = function (coins) {
    this.coinsTxt.element.text = coins + "";
};

HomeMenuEventListener.prototype.enableSettings = function (enable) {
    this.isSettingsEnabled = enable;

    if (enable) {
        this.settings.soundBtn.enabled = true;
        if (SdkManager.Instance.currentSdk == 0)
            this.settings.vibrationBtn.enabled = true;
        // this.settings.restoreBtn.enabled = true;
    }
    else {
        this.settings.soundBtn.fire('disable', () => this.settings.soundBtn.enabled = false);
        this.settings.vibrationBtn.fire('disable', () => this.settings.vibrationBtn.enabled = false);
        // this.settings.restoreBtn.fire('disable', () => this.settings.restoreBtn.enabled = false);
    }
};

HomeMenuEventListener.prototype.onClickSoundBtn = function () {
    this.isSoundOn = !this.isSoundOn;
    this.app.fire("SoundManager:Mute", !this.isSoundOn);
    if (this.isSoundOn) {
        console.log("HomeMenuEventListener: SoundOn", this.isSoundOn);
        this.app.fire("SoundManager:Resume", "TitleScreen");
    }
    else {
        this.app.fire('SoundManager:Pause', 'TitleScreen');
    }
    console.log('onClickSoundBtn: ', this.isSoundOn);
    this.settings.soundBtn.fire('UpdateIcon', this.isSoundOn);
};

HomeMenuEventListener.prototype.onClickVibrationBtn = function () {
    console.log('onClickVibrationBtn: ', this.isViberationOn);
    this.isViberationOn = !this.isViberationOn;
    SdkManager.Instance.isVibrationOn = this.isViberationOn;
    this.settings.vibrationBtn.fire('UpdateIcon', this.isViberationOn);
};

HomeMenuEventListener.prototype.setProductInfo = function (price, isEnable) {
    console.log('HomeMenu:SpecialOfferBtn: ', this.specialOfferBtn.enabled, isEnable);
    this.specialOfferBtn.enabled = isEnable;
    if (!isEnable) {
        DataManager.Instance.isOfferPurchased = true;
        DataManager.Instance.unlockAllItems();
        DataManager.Instance.setData();
    }
};


HomeMenuEventListener.prototype.onStoreReady = function (isReady) {
    if (isReady) {
        this.specialOfferBtn.setLocalPosition(-15, 167, 0);
        this.app.fire('SdkManager:GetProductInfo', this.setProductInfo.bind(this));
    }
};

HomeMenuEventListener.prototype.onAdsInitialized = function () {
    this.app.fire('SdkManager:ShowAd', 'Banner', undefined, true, [2]);
};



// swap method called for script hot-reloading
// inherit your script state here
// HomeMenuEventListener.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// GameplayMenuEventListener.js
var GameplayMenuEventListener = pc.createScript('gameplayMenuEventListener');

GameplayMenuEventListener.attributes.add('refs', {
    title: 'References',
    type: 'json',
    schema: [
        { name: 'bestScoreTxt', type: 'entity', title: 'Best Score Txt' },
        { name: 'scoreTxt', type: 'entity', title: 'Score Txt' },
        { name: 'continueView', type: 'entity', title: 'Continue View' },
        { name: 'resultView', type: 'entity', title: 'Result View' },
        { name: 'currentMissionView', type: 'entity', title: 'Current Mission View' },
        { name: 'newMissionView', type: 'entity', title: 'New Mission View' },
        { name: 'missionManager', type: 'entity', title: 'Mission Manager' }
    ],
});

// initialize code called once per entity
GameplayMenuEventListener.prototype.initialize = function () {
    this.missionsUiHanlder = new MissionsUiHandler(
        this.app, this.refs.newMissionView, this.refs.currentMissionView
    );

    this.app.on('GameplayMenu:OnClick', this.onClickButton, this);
    this.app.on('Gameplay:EnableResult', this.enableResultView, this);
    this.app.on('GameplayMenu:OnGameOver', this.onGameOver, this);
    this.app.on('GameplayMenu:IsPlayingGame', this.isPlayingGame, this);

    this.app.on('ScoreManager:OnScoreUpdated', this.onScoreUpdated, this);
    this.app.on('MissionManager:CurrentMission', this.missionsUiHanlder.onCurrentMissionIntiated, this.missionsUiHanlder);
    this.app.on('MissionManager:Progress', this.missionsUiHanlder.onMissionProgress, this.missionsUiHanlder);
    this.app.on('MissionManager:OnMissionCompleted', this.missionsUiHanlder.onMissionCompleted, this.missionsUiHanlder);

    this.on('enable', this.onEnable, this);
    this.on('disable', this.onDisable, this);
};

GameplayMenuEventListener.prototype.onEnable = function () {
    this.reviveCount = 0;
    this.refs.continueView.enabled = false;
    this.refs.resultView.enabled = false;
    ScoreManager.Instance.reset();

    // console.log('setMission:Show', false);

    this.refs.newMissionView.fire('Show', false);
    this.refs.currentMissionView.fire('Show', false);
    this.app.fire('Gameplay:Start', true);
    this.app.fire('SdkManager:ShowAd', 'Banner', undefined, true, [0, 1]);
};

GameplayMenuEventListener.prototype.postInitialize = function () {
    this.onEnable();
};

GameplayMenuEventListener.prototype.onDisable = function () {
    this.refs.currentMissionView.fire('Show', false);
};

// update code called every frame
GameplayMenuEventListener.prototype.update = function (dt) {

};


GameplayMenuEventListener.prototype.onClickButton = function (name) {
    switch (name) {
        case "PerfectJump":
            ScoreManager.Instance.playerJumped(true);
            break;
        case "Jump":
            ScoreManager.Instance.playerJumped(false);
            break;
        case "Gameover":
            this.onGameOver();
            break;
    }
};

GameplayMenuEventListener.prototype.onScoreUpdated = function (score, bestScore, increment) {
    if (score !== undefined)
        this.refs.scoreTxt.element.text = score.toString();
    if (bestScore !== undefined)
        this.refs.bestScoreTxt.element.text = "BEST\n" + bestScore.toString();
};

GameplayMenuEventListener.prototype.onGameOver = function () {
    if (ScoreManager.Instance.currentScore === 0) {
        MenuManager.Instance.changeState(MenuManager.States.Home);
        this.app.fire('DataManager:StoreData');
        this.app.fire('SdkManager:ChallengeFriend');
        return;
    }
    if (this.reviveCount < 1)
        this.enableContinueView(true);
    else {
        console.log('Gameplay:onGameOver:Enabling Result View');
        this.app.fire('SdkManager:ChallengeFriend');
        this.app.fire('SdkManager:SetScore', ScoreManager.Instance.currentScore);
        this.app.fire('SdkManager:SubmitLeaderboardScore', ScoreManager.Instance.currentScore);
        this.enableResultView(true);
        this.app.fire('DataManager:StoreData');
    }
    this.reviveCount++;
};
GameplayMenuEventListener.prototype.activeHomeMenu = function (message) {
    console.log('Ad Message: ', message);
    MenuManager.Instance.changeState(MenuManager.States.Home);
}

GameplayMenuEventListener.prototype.enableContinueView = function (enable) {
    this.refs.continueView.enabled = enable;
};

GameplayMenuEventListener.prototype.enableResultView = function (enable) {
    this.refs.resultView.enabled = enable;
};

GameplayMenuEventListener.prototype.isPlayingGame = function (callback) {
    callback(!this.refs.continueView.enabled && !this.refs.resultView.enabled)
};

// swap method called for script hot-reloading
// inherit your script state here
// GameplayMenuEventListener.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// LeaderboardMenuEventListener.js
var LeaderboardMenuEventListener = pc.createScript('leaderboardMenuEventListener');

// initialize code called once per entity
LeaderboardMenuEventListener.prototype.initialize = function () {
    this.app.on('LeaderboardMenu:OnClick', this.onClickButton, this);
    this.on('enable', this.onEnable, this);
};

LeaderboardMenuEventListener.prototype.postInitialize = function () {
    this.onEnable();
};

// update code called every frame
LeaderboardMenuEventListener.prototype.update = function (dt) {

};

LeaderboardMenuEventListener.prototype.onEnable = function () {
    console.warn('LeaderboardMenu: Active');
    this.app.fire('SdkManager:GetLeaderBoard', this.setBoard.bind(this));
};

LeaderboardMenuEventListener.prototype.setBoard = function (entries) {
    console.log("LeaderboardMenuEventListener:setBoard:", entries);
};

LeaderboardMenuEventListener.prototype.onClickButton = function (name) {
    switch (name) {
        case "Cross":
            MenuManager.Instance.changeState(MenuManager.States.Home);
            break;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// LeaderboardMenuEventListener.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// CostumesMenuEventListener.js
var CostumizationMenuEventListener = pc.createScript('costumizationMenuEventListener');

CostumizationMenuEventListener.attributes.add('settings', {
    title: 'Settings',
    type: 'json',
    schema: [
        { name: 'randomUnlockAnimDur', type: 'number', title: 'Random Unlock Anim Duration' },
        { name: 'freeCoinsCount', type: 'number', title: 'Free Coins Count' },
    ],
});

CostumizationMenuEventListener.attributes.add('refs', {
    title: 'References',
    type: 'json',
    schema: [
        { name: 'titleTxt', type: 'entity', title: 'Title Text' },
        { name: 'coinsTxt', type: 'entity', title: 'Coins Text' },
        { name: 'randomUnlockPriceTxt', type: 'entity', title: 'Random Unlock Price Text' },
        { name: 'randomUnlockPriceBtn', type: 'entity', title: 'Random Unlock Price Button' },
        { name: 'randomUnlockMsg', type: 'entity', title: 'Random Unlock Message' },
        { name: 'freeCoinsTxt', type: 'entity', title: 'Free Coins Text' },
        { name: 'freeCoinsBtn', type: 'entity', title: 'Free Coins Button' }
    ],
});

CostumizationMenuEventListener.attributes.add('panels', {
    title: 'Panel References',
    type: 'json',
    schema: [
        { name: 'entity', type: 'entity', title: 'Panel' },
        { name: 'highlight', type: 'entity', title: 'HighlightBtn' }
    ],
    array: true
})

CostumizationMenuEventListener.attributes.add('pagesSetting', {
    title: 'Pages Setting',
    type: 'json',
    schema: [
        { name: 'content', type: 'entity', title: 'Content' },
        { name: 'pages', type: 'entity', title: 'Pages', array: true },
    ],
    array: true
});

// initialize code called once per entity
CostumizationMenuEventListener.prototype.initialize = function () {
    // console.log('CostumizationMenuEventListener:initialize');
    CostumizationMenuEventListener.Instance = this;
    this.currentPanel = null;
    this.app.on('Update:CostumePanel', this.updatePanel, this);
    this.app.on('CostumesMenu:OnClick', this.onClickButton, this);
    this.app.on('SdkManager:RewaredAdLoaded', this.updateFreeCoinsBtn, this);
    this.prevItem = [];
    this.selectedItem = [];
    this.openingMenu = false;
    for (let i = 0; i < this.pagesSetting.length; i++) {
        this.prevItem.push({ pageID: -1, itemID: -1 });
        this.selectedItem.push({ pageID: -1, itemID: -1 });
    }
    // this.selectedItem = { pageID: -1, itemID: -1 };
    // this.prevItem = { pageID: -1, itemID: -1 };
    this.pageIndex = 0;
    this.isPanelInitialized = [false, false, false, false];
    this.app.on('EconomyManager:OnCoinsUpdated', this.onCoinsUpdated, this);
    this.on('enable', this.onEnable, this);
};

CostumizationMenuEventListener.prototype.onEnable = function () {
    this.setRandomUnlockMsg("");
    this.animateMrBean();
    this.closeDelay = 1;
    this.canClose = false;
    // this.ref.titleTxt.element.text = CustomizationManager.Instance.selectedView;
    // console.log('CostumizationMenuEventListener:onEnable');
    this.onCoinsUpdated(EconomyManager.Instance.getCoins());
    this.updateFreeCoinBtn(SdkManager.Instance.isRewarededAdLoaded);
    if (this.refs.freeCoinsTxt)
        this.refs.freeCoinsTxt.element.text = this.settings.freeCoinsCount + "";
};

CostumizationMenuEventListener.prototype.postInitialize = function () {
    EconomyManager.Instance.randomUnlockPrice[0] = DataManager.Instance.randomUnlockPrice;
    this.refs.randomUnlockPriceTxt.element.text = EconomyManager.Instance.randomUnlockPrice[0] + "";
    this.onEnable();
};


// update code called every frame
CostumizationMenuEventListener.prototype.update = function (dt) {
    this.closeDelay -= dt;
    if (this.closeDelay <= 0) this.canClose = true;
};

CostumizationMenuEventListener.prototype.animateMrBean = function () {
    PlatformGenerator.Instance.generatePlatform(80);
    this.app.fire('PlayerController:Jump', true);
    this.app.fire('Move:CameraTo', undefined, 2.5, 17);

};

CostumizationMenuEventListener.prototype.updateFreeCoinBtn = function (isActive) {
    if (SdkManager.Instance.test.isEditor)
        isActive = SdkManager.Instance.test.isSuccessful;
};

CostumizationMenuEventListener.prototype.onClickButton = function (name) {
    switch (name) {
        case "Cross":
            if (this.canClose)
                MenuManager.Instance.changeState(MenuManager.States.Home);
            break;
        case "Boxes":
            this.currentPanel = "Boxes";
            this.updatePanel(0);
            break;
        case "Themes":
            this.currentPanel = "Themes";
            this.updatePanel(1);
            break;
        case "Shirts":
            this.currentPanel = "Shirts";
            this.updatePanel(2);
            break;
        case "Hats":
            this.currentPanel = "Hats";
            this.updatePanel(3);
            break;
        case "UnlockRandom":
            this.unlockRandomItem();
            break;
        case "FreeCoins":
            this.onClickFreeCoinsBtn();
            break;
    }
};

CostumizationMenuEventListener.prototype.onClickFreeCoinsBtn = function () {
    console.log('CostumizationMenuEventListener:onClickFreeCoinsBtn: ', SdkManager.Instance.isRewarededAdLoaded)
    if (SdkManager.Instance.isRewarededAdLoaded)
        this.app.fire('SdkManager:ShowAd', 'Rewarded', this.addCoins.bind(this));
    else {
        this.app.fire(
            'PopupView:Show', true, "Ad unavailable",
            'Please check you have an active internet or WiFi connection and please try again later.',
            () => this.app.fire('PopupView:Show', false)
        )
    }
};

CostumizationMenuEventListener.prototype.updatePanel = function (newPageIndex) {
    console.log('CostumizationMenu:UpdatePanel: ', this.pageIndex, newPageIndex);
    //  Disable old panel
    this.panels[this.pageIndex].entity.enabled = false;
    this.panels[this.pageIndex].highlight.enabled = false;
    this.pageIndex = newPageIndex;
    let pageID = DataManager.Instance.getCurrentItem(this.pageIndex).pageID;
    // Enable new panel
    this.panels[this.pageIndex].entity.enabled = true;
    this.panels[this.pageIndex].highlight.enabled = true;
    this.app.fire('Pagination:OnClickButton', pageID);
    if (!this.isPanelInitialized[this.pageIndex])
        this.setCallbacks();
    this.isPanelInitialized[this.pageIndex] = true;
}
CostumizationMenuEventListener.prototype.setCallbacks = function () {
    this.setOnClickCallbacks();
    let values = DataManager.Instance.getCurrentItem(this.pageIndex);
    this.onClickItem(values.pageID, values.itemID);
}

CostumizationMenuEventListener.prototype.addCoins = function () {
    EconomyManager.Instance.addCoins(this.settings.freeCoinsCount);
};

CostumizationMenuEventListener.prototype.unlockRandomItem = function () {
    let price = EconomyManager.Instance.randomUnlockPrice[0];
    if (!EconomyManager.Instance.isPurchaseable(price)) {
        this.setRandomUnlockMsg("Insufficient Coins!");
        return;
    }

    let pages = this.pagesSetting[this.pageIndex].pages;
    let totalItems = [];

    // Deactivate Button
    this.refs.randomUnlockPriceBtn.button.active = false;

    // get locked items from all the pages
    for (let i = 0; i < pages.length; i++) {
        totalItems.push(...pages[i].script.pageController.getLockedItems());
    }

    let maxRandItems = 5;
    let randomItems = [];

    // select random from total Items
    if (totalItems.length === 0) {
        this.setRandomUnlockMsg("Everything Purchased!!!");
        return;
    }
    else if (totalItems.length < maxRandItems)
        randomItems = totalItems;
    else {
        for (let i = 0; i < maxRandItems; i++) {
            let index = Math.floor(pc.math.random(0, totalItems.length - 1));
            randomItems.push(totalItems[index]);
            totalItems.splice(index, 1);
        }
    }
    EconomyManager.Instance.addCoins(-price);

    let dur = this.settings.randomUnlockAnimDur;
    let currentItem = this.selectedItem[this.pageIndex];
    let prevItem = undefined;

    for (let i = 0; i < randomItems.length; i++) {
        let j = i;
        CustomCoroutine.Instance.set(function (index) {
            prevItem = currentItem;
            currentItem = randomItems[index];
            if (prevItem !== undefined)
                pages[prevItem.pageID].fire('SetHighlight', prevItem.itemID, false);
            if (currentItem !== undefined)
                pages[currentItem.pageID].fire('SetHighlight', currentItem.itemID, true);

            if (index === randomItems.length - 1) {
                pages[currentItem.pageID].fire('Lock', currentItem.itemID, false);
                this.onClickItem(currentItem.pageID, currentItem.itemID);

                DataManager.Instance.updateUnlockedItems(this.currentPanel, currentItem.pageID, currentItem.itemID);

                this.refs.randomUnlockPriceBtn.button.active = true;
                EconomyManager.Instance.increaseRandomUnlockPrice(0);
                this.refs.randomUnlockPriceTxt.element.text = EconomyManager.Instance.randomUnlockPrice[0] + "";
            }
        }.bind(this, j), dur * (i / randomItems.length));
    }
};

CostumizationMenuEventListener.prototype.onClickItem = function (pageID, itemID) {
    let isSameItem = this.selectedItem[this.pageIndex].pageID === pageID && this.selectedItem[this.pageIndex].itemID === itemID;

    if (itemID === undefined || isSameItem) return;
    this.prevItem[this.pageIndex].pageID = this.selectedItem[this.pageIndex].pageID;
    this.prevItem[this.pageIndex].itemID = this.selectedItem[this.pageIndex].itemID;
    this.selectedItem[this.pageIndex].pageID = pageID;
    this.selectedItem[this.pageIndex].itemID = itemID;

    if (this.prevItem[this.pageIndex].pageID >= 0 && this.prevItem[this.pageIndex].itemID >= 0)
        this.pagesSetting[this.pageIndex].pages[this.prevItem[this.pageIndex].pageID].fire('SetHighlight', this.prevItem[this.pageIndex].itemID, false);
    console.log("Costumization:onClickItem: ", this.pageIndex, pageID, itemID);
    this.app.fire('Pagination:OnClickButton', pageID);
    this.pagesSetting[this.pageIndex].pages[pageID].fire('Selected', itemID);
};

CostumizationMenuEventListener.prototype.setOnClickCallbacks = function () {
    for (let i = 0; i < this.pagesSetting[this.pageIndex].pages.length; i++) {
        this.pagesSetting[this.pageIndex].pages[i].enabled = true;
        this.pagesSetting[this.pageIndex].pages[i].fire('SetOnClick', this.onClickItem.bind(this));
    }
};

CostumizationMenuEventListener.prototype.onCoinsUpdated = function (coins) {
    console.log('onCoinsUpdated: ', coins);
    this.refs.coinsTxt.element.text = coins + "";
};

CostumizationMenuEventListener.prototype.setRandomUnlockMsg = function (msg) {
    this.refs.randomUnlockMsg.enabled = true;
    this.refs.randomUnlockMsg.element.text = msg;

    if (this.msg1Tween)
        TweenWrapper.StopTween(this.msg1Tween);

    if (this.msg1Coroutine)
        CustomCoroutine.Instance.clear(this.msg1Coroutine);

    this.msg1Tween = TweenWrapper.TweenNumber(0, 1, 0.35, (obj) => {
        this.refs.randomUnlockMsg.element.opacity = obj.number;
    }, () => {
        this.msg1Coroutine = CustomCoroutine.Instance.set(() => {
            this.msg1Tween = TweenWrapper.TweenNumber(1, 0, 0.35, (obj) => {
                this.refs.randomUnlockMsg.element.opacity = obj.number;
            }, () => {
                this.msg1Tween = undefined;
                this.msg1Coroutine = undefined;
                this.refs.randomUnlockMsg.enabled = false;
            });
        }, 2);
    })
    // this.refs.randomUnlockMsg.enabled = msg !== "";
};

// swap method called for script hot-reloading
// inherit your script state here
// CostumizationMenuEventListener.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// ThemesMenuEventListener.js
var ThemesMenuEventListener = pc.createScript('themesMenuEventListener');

// initialize code called once per entity
ThemesMenuEventListener.prototype.initialize = function() {

};

// update code called every frame
ThemesMenuEventListener.prototype.update = function(dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// ThemesMenuEventListener.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// EconomyManager.js
var EconomyManager = pc.createScript('economyManager');

EconomyManager.attributes.add('defaultCoins', { type: 'number', title: 'Default Coins' });
EconomyManager.attributes.add('isFree', { type: 'boolean', title: 'Everything Free' });

EconomyManager.attributes.add('randomUnlockSettings', {
    title: 'Random Unlock Settings ',
    type: 'json',
    schema: [
        { name: 'basePrice', type: 'number', title: 'Base Price' },
        { name: 'increment', type: 'number', title: 'Increment' },
    ],
    array: true
})

// initialize code called once per entity
EconomyManager.prototype.initialize = function () {
    EconomyManager.Instance = this;
    this.coins = 0;

    this.randomUnlockPrice = [];
    
    for (let i = 0; i < this.randomUnlockSettings.length; i++) {
        this.randomUnlockPrice.push(this.randomUnlockSettings[i].basePrice);
    }
};

EconomyManager.prototype.postInitialize = function () {
   // this.addCoins(this.defaultCoins, true);
};

// update code called every frame
EconomyManager.prototype.update = function (dt) {

};

EconomyManager.prototype.addCoins = function (amount, setAmount) {

    if (this.isFree && amount < 0) return;
    // console.log('addCoins: ', amount);
    this.coins = setAmount ? amount : this.coins + amount;
    DataManager.Instance.coinsAmount = this.coins;
    this.app.fire('DataManager:StoreData');
    this.app.fire('EconomyManager:OnCoinsUpdated', this.coins);
};

EconomyManager.prototype.getCoins = function () {
    this.coins = DataManager.Instance.coinsAmount;
    console.log('EconomyManager:getCoins: ', this.coins)
    return this.coins;
};

EconomyManager.prototype.isPurchaseable = function (price) {
    return this.isFree || this.coins - price >= 0;
};

EconomyManager.prototype.increaseRandomUnlockPrice = function (index) {
    this.randomUnlockPrice[index] += this.randomUnlockSettings[index].increment;
    DataManager.Instance.randomUnlockPrice =  this.randomUnlockPrice[index];
    DataManager.Instance.setData();
};

// swap method called for script hot-reloading
// inherit your script state here
// EconomyManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// PageController.js
var PageController = pc.createScript('pageController');

PageController.attributes.add('itemName', { type: 'string', title: 'Item Name' });
PageController.attributes.add('id', { type: 'number', title: 'ID' });

PageController.attributes.add('items', {
    title: 'Items',
    type: 'json',
    schema: [
        { name: 'isLocked', type: 'boolean', title: 'Locked', default: true },
        { name: 'obj', type: 'entity', title: 'Entity' },
        { name: 'icon', type: 'asset', assetType: 'texture', title: 'Icon' },
    ],
    array: true
});


// initialize code called once per entity
PageController.prototype.initialize = function () {
    this.entity.on('OnClick', this.onClick, this);
    this.entity.on('SetHighlight', this.setHighlight, this);
    this.entity.on('Lock', this.setLock, this);
    this.entity.on('SetIcon', this.setIcon, this);
    this.entity.on('SetOnClick', this.setOnClickCall, this);
    this.entity.on('Selected', this.selected, this);
    this.on('enable', this.onEnable, this);
    //  // console.log('PageController:initialize: ', this.id);
};

PageController.prototype.postInitialize = function () {
    this.onEnable();
};

// update code called every frame
PageController.prototype.update = function (dt) {

};

PageController.prototype.onEnable = function(){
    this.initItems();
};


PageController.prototype.initItems = function () {
    // // console.log('2233:Initializing Pages', this.itemName, DataManager.Instance.unlockedItems);
    this.unlockedList = DataManager.Instance.unlockedItems[this.itemName][this.id];
    // console.log('2233:List: ', this.unlockedList);
    for (let i = 0; i < this.items.length; i++) {
        // console.log(i);
        this.setLock(i, !this.unlockedList[i]);
    }

};

PageController.prototype.getLockedItems = function () {
    let lockedItems = [];

    for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i].obj.script.shopTile;
        if (item.lock.enabled) {
            lockedItems.push({ pageID: this.id, itemID: item.id });
        }
    }

    return lockedItems;
};

PageController.prototype.setLock = function (index, lock) {
    // // console.log('setLock: ', index, lock);
    this.items[index].obj.fire('Lock', lock);
    this.items[index].isLocked = lock;
};

PageController.prototype.setIcon = function (index, icon) {
    this.items[index].obj.fire('SetIcon', icon);
};

PageController.prototype.setHighlight = function (index, highlight) {
    this.items[index].obj.fire('SetHighlight', highlight);
};

PageController.prototype.selected = function (index) {
    this.items[index].obj.fire('Selected');
};

PageController.prototype.setOnClickCall = function (onClickCall) {
    this.onClickCall = onClickCall;
    // console.log('PageController:setOnClickCall: ');
    for (let i = 0; i < this.items.length; i++) {
        this.items[i].obj.fire('SetOnClick', this.onClick.bind(this));
    }

    // // console.log('---------------');
};

PageController.prototype.onClick = function (itemID) {
    if (this.onClickCall) this.onClickCall(this.id, itemID);
};

// swap method called for script hot-reloading
// inherit your script state here
// PageController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// RandomUnlockSystem.js
var RandomUnlockSystem = pc.createScript('randomUnlockSystem');

// initialize code called once per entity
RandomUnlockSystem.prototype.initialize = function() {
    
};

// update code called every frame
RandomUnlockSystem.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// RandomUnlockSystem.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// CoinAnimationController.js
var CoinAnimationController = pc.createScript('coinAnimationController');

CoinAnimationController.attributes.add('coinsPool', { type: 'entity', title: 'Coins Pool' });

// initialize code called once per entity
CoinAnimationController.prototype.initialize = function() {
    this.coins = 0;
};

// update code called every frame
CoinAnimationController.prototype.update = function(dt) {

};

CoinAnimationController.prototype.onCoinsUpdated = function(coins, pos, isAdded) {
    // if (!isAdded)
};

// swap method called for script hot-reloading
// inherit your script state here
// CoinAnimationController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// ScoreManager.js
var ScoreManager = pc.createScript('scoreManager');

ScoreManager.attributes.add('consecutiveJumpsThreshold', { type: 'number', title: 'Consecutive Jumps Threshold' });
ScoreManager.attributes.add('jumpBaseScore', { type: 'number', title: 'Jump Base Score' });
ScoreManager.attributes.add('jumpScoreIncrement', { type: 'number', title: 'Jump Score Increment' });
ScoreManager.attributes.add('maxIncrement', { type: 'number', title: 'Increment Max', default: 5 });
ScoreManager.attributes.add('incrementText', { type: 'entity', title: "Increment Text" });

// initialize code called once per entity
ScoreManager.prototype.initialize = function () {
    ScoreManager.Instance = this;
    this.currentScore = 0;
    this.consecutiveJumps = 0;
    // this.bestScore = this.getItemFromLocalStorage('BestScore', 0);

    this.app.on('ScoreManager:SetBestScore', this.setBestScore, this);
};

// update code called every frame
ScoreManager.prototype.update = function (dt) {

};

ScoreManager.prototype.setBestScore = function () {
    this.bestScore = DataManager.Instance.bestScore;
}


ScoreManager.prototype.reset = function () {
    this.currentScore = 0;
    this.consecutiveJumps = 0;
    this.app.fire('ScoreManager:OnScoreUpdated', this.currentScore, this.bestScore, 0);;
};

ScoreManager.prototype.playerJumped = function (isPerfect) {
    let increment = this.jumpBaseScore;
    if (isPerfect) {
        this.consecutiveJumps++;
        let mul = Math.floor(this.consecutiveJumps / this.consecutiveJumpsThreshold);
        increment += this.jumpScoreIncrement * mul;
        increment = Math.min(this.maxIncrement, increment);
        this.currentScore += increment;
    }
    else {
        this.currentScore += increment;
        this.consecutiveJumps = 0;
    }

    if (this.bestScore < this.currentScore) {
        this.bestScore = this.currentScore;
      //  localStorage.setItem('BestScore', this.bestScore)
        DataManager.Instance.bestScore = this.bestScore;
    }

    this.app.fire('ScoreManager:OnScoreUpdated', this.currentScore, this.bestScore, increment);

    return increment;
};
ScoreManager.prototype.getItemFromLocalStorage = function (key, defaultValue) {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
        return parseInt(storedValue);
    } else {
        return defaultValue;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// ScoreManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// ContinueView.js
var ContinueView = pc.createScript('continueView');

ContinueView.attributes.add('continueDur', { type: 'number', title: 'Continue Duration' });
ContinueView.attributes.add('continueTxt', { type: 'entity', title: 'Continue Text' });
ContinueView.attributes.add('yesBtn', { type: 'entity', title: 'Yes Button' });


// initialize code called once per entity
ContinueView.prototype.initialize = function () {
    this.app.on('ContinueView:OnClick', this.onClickButton, this);
    this.on('enable', this.onEnable, this);
    this.timerRoutines = [];
};

ContinueView.prototype.postInitialize = function () {
    this.onEnable();
};

ContinueView.prototype.onEnable = function () {
    this.startTimer();
};

// update code called every frame
ContinueView.prototype.update = function (dt) {

};

ContinueView.prototype.onClickButton = function (name) {
    switch (name) {
        case "Continue":
            this.onClickContinueBtn();
            //  AdsManager.Instance.showAd(() => this.onContinue(true));
            break;
        case "Cross":
            this.onContinue(false);
            break;
    }
};

ContinueView.prototype.onClickContinueBtn = function () {
    if (!SdkManager.Instance.isRewarededAdLoaded) {
        this.app.fire(
            'PopupView:Show', true, "Ad unavailable",
            'Please check you have an active internet or WiFi connection and please try again later.',
            () => this.app.fire('PopupView:Show', false)
        )
        return;
    }

    this.clearRoutines();
    this.app.fire('SdkManager:ShowAd', "Rewarded", this.onContinue.bind(this));
};

ContinueView.prototype.startTimer = function () {
    let dur = this.continueDur;
    for (let i = dur; i >= 0; i--) {
        let j = i;
        this.timerRoutines.push(CustomCoroutine.Instance.set(function (index) {
            this.continueTxt.element.text = index.toString();

            if (index === 0) {
                this.onContinue(false);
                this.timerRoutines = [];
            }
        }.bind(this, j), dur - i));
    }
};

ContinueView.prototype.onContinue = function (revive) {
    // console.trace('onContinue: ', revive);
    console.log('OnContinue: ', revive);
    this.clearRoutines();

    if (revive === null) {
        this.entity.enabled = false;
        this.app.fire('Gameplay:Revive');
    }
    else {
        this.app.fire('SdkManager:SetScore', ScoreManager.Instance.currentScore);
        this.app.fire('SdkManager:SubmitLeaderboardScore', ScoreManager.Instance.currentScore);
        this.app.fire('SdkManager:ChallengeFriend');
        this.app.fire('Gameplay:EnableResult', true);
        this.app.fire('PopupView:Show', false)
        this.entity.enabled = false;
    }
};

ContinueView.prototype.clearRoutines = function () {
    for (let i = 0; i < this.timerRoutines.length; i++)
        CustomCoroutine.Instance.clear(this.timerRoutines[i]);
    this.timerRoutines = [];
};

// swap method called for script hot-reloading
// inherit your script state here
// ContinueView.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// AdsView.js
var AdsView = pc.createScript('adsView');

AdsView.attributes.add('dur', { type: 'number', title: 'Duration' });
AdsView.attributes.add('root', { type: 'entity', title: 'Root' });
AdsView.attributes.add('txt', { type: 'entity', title: 'Text' });
AdsView.attributes.add('msg', { type: 'entity', title: 'Message', default: 'Loading ad...' });

// initialize code called once per entity
AdsView.prototype.initialize = function () {
    this.app.on('Show:Loading', this.showForTime, this);
    this.app.on('Start:Loading', this.show, this);
    this.timer = this.dur;
};

AdsView.prototype.showForTime = function (callback, txt, dur, showTimer) {
    this.dur = dur === undefined ? this.timer : dur;

    this.root.enabled = true;
    this.msg.element.text = txt != undefined ? txt : 'Loading Ad...';
    this.txt.enabled = showTimer === true;

    for (let i = this.dur; i >= 0; i--) {
        let j = i;
        CustomCoroutine.Instance.set(function (index) {
            this.txt.element.text = index.toString();
            if (index === 0) {
                if (callback) callback();
                this.root.enabled = false;
            }
        }.bind(this, j), this.dur - i);
    }
};

AdsView.prototype.show = function (txt, enable, dur, onComplete) {
    this.root.enabled = enable;
    this.msg.element.text = txt != undefined ? txt : 'Loading Ad...';
    this.txt.enabled = false;
    if (dur != undefined) {
        CustomCoroutine.Instance.set(function () {
            if (onComplete) onComplete();
            this.root.enabled = false;
        }, dur)
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// AdsView.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// AdsManager.js
var AdsManager = pc.createScript('adsManager');

AdsManager.attributes.add('adsView', { type: 'entity', title: 'Ads View' });

// initialize code called once per entity
AdsManager.prototype.initialize = function () {
    AdsManager.Instance = this;
};

// update code called every frame
AdsManager.prototype.update = function (dt) {

};

AdsManager.prototype.showAd = function (callback) {
    this.app.fire('Show:Loading', callback, "Loading ad...", undefined, true);
};

AdsManager.prototype.showAdLoading = function (txt, enable, dur, onComplete) {
    console.warn('AdsManager:showAdLoading: ', txt, enable);
    let duration = dur === undefined ? undefined : dur;
    this.app.fire('Start:Loading', txt, enable, duration, onComplete);
};

// swap method called for script hot-reloading
// inherit your script state here
// AdsManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// ResultView.js
var ResultView = pc.createScript('resultView');

ResultView.attributes.add('coinsText', { type: 'entity', title: 'Coins Text' });
ResultView.attributes.add('confetti', { type: 'entity', title: 'Confetti' });
ResultView.attributes.add('collectBtn', { type: 'entity', title: 'Collect Button' });
ResultView.attributes.add('sliderSettings', {
    title: 'Slider Settings',
    type: 'json',
    schema: [
        { name: 'dur', type: 'number', title: 'Duration' },
        { name: 'pick', type: 'entity', title: 'Pick' },
        { name: 'start', type: 'entity', title: 'Start' },
        { name: 'end', type: 'entity', title: 'End' },
    ]
});

ResultView.attributes.add('sliderPoints', {
    title: 'Slider Points',
    type: 'json',
    schema: [
        { name: 'mul', type: 'number', title: 'Multiplier' },
        { name: 'point', type: 'entity', title: 'Point' },
    ],
    array: true
});

// initialize code called once per entity
ResultView.prototype.initialize = function () {
    this.coins = 25;
    this.app.on('ResultView:OnClick', this.onClickButton, this);
    this.on('enable', this.onEnable, this);
};


ResultView.prototype.postInitialize = function () {
    this.onEnable();
};

ResultView.prototype.onEnable = function () {
    this.init();
};

// update code called every frame
ResultView.prototype.update = function (dt) {
    this.updateCoinsText();
};

ResultView.prototype.onClickButton = function (name) {
    switch (name) {
        case "Collect":
            this.onClickCollect();
            // AdsManager.Instance.showAd(() => this.onCollect(true));
            break;
        case "Cross":
            this.onCollect('Failed to collect');
            break;
    }
};

ResultView.prototype.updateCoinsText = function () {
    this.coinsText.element.text = "+" + (this.coins * this.calculateMultiplier())
};

ResultView.prototype.onClickCollect = function () {
    this.collectBtn.button.active = false;
    this.collectBtn.script.enabled = false;

    if (!SdkManager.Instance.isRewarededAdLoaded) {
        this.app.fire(
            'PopupView:Show', true, "Ad unavailable",
            'Please check you have an active internet or WiFi connection and please try again later.',
            () => this.app.fire('PopupView:Show', false)
        )
        return;
    }

    if (this.pickTween)
        TweenWrapper.StopTween(this.pickTween);
    this.app.fire('SdkManager:ShowAd', 'Rewarded', this.onCollect.bind(this));
};

ResultView.prototype.onCollect = function (isCollected) {
    console.log('ResultView:onCollect: ', isCollected);

    if (this.pickTween)
        TweenWrapper.StopTween(this.pickTween);

    if (isCollected === null) {
        this.onClickCollectBtn();
    }
    else {
        this.onClickCloseBtn();
    }
    this.app.fire('DataManager:StoreData');
};

ResultView.prototype.onClickCloseBtn = function () {
    EconomyManager.Instance.addCoins(this.coins);
    console.log("Result View Transfering!");
    if (this.autoClose) CustomCoroutine.Instance.clear(this.autoClose);
    this.app.fire('SdkManager:ShowAd', 'Interstitial', this.backToMainMenu.bind(this));
    if (DataManager.Instance.gameCount <= 1) {
        this.app.fire('SdkManager:CreateTournament');
    }
    this.entity.enabled = false;
    MenuManager.Instance.changeState(MenuManager.States.Home);
    //  this.confetti.fire('Play', false);
};

ResultView.prototype.onClickCollectBtn = function () {
    EconomyManager.Instance.addCoins(this.coins * this.calculateMultiplier());
    this.confetti.fire('Play', true);
    CustomCoroutine.Instance.set(() => this.confetti.fire('Play', false), 3);

    this.autoClose = CustomCoroutine.Instance.set(() => {
        this.app.fire('SdkManager:ShowAd', 'Interstitial', err => {
            if (err) console.log("ResultView:OnCollect:Interstitial:Error: ", err);
            console.log('ResultView:Closing: ', this.entity.enabled)
            if (!this.entity.enabled) return;
            MenuManager.Instance.changeState(MenuManager.States.Home);
            this.collectBtn.button.active = true;
            this.collectBtn.script.enabled = true;
            //  
            this.entity.enabled = false;
        });
    }, 5);
    
};

ResultView.prototype.init = function () {
    this.coins = ScoreManager.Instance.currentScore;
    this.confetti.fire('Play', false);
    console.log('ResultView: Editor,success,adLoaded: ', SdkManager.Instance.test.isEditor, SdkManager.Instance.test.isSuccessful, SdkManager.Instance.isRewarededAdLoaded);

    this.collectBtn.button.active = true;
    this.collectBtn.script.enabled = true;

    let a = this.sliderSettings.start.getLocalPosition().x;
    let b = this.sliderSettings.end.getLocalPosition().x;
    this.tweenFromAtoB(a, b);

};

ResultView.prototype.tweenFromAtoB = function (a, b) {
    if (this.pickTween)
        TweenWrapper.StopTween(this.pickTween);

    //  console.log('SLider tweening....');
    this.pickTween = TweenWrapper.TweenNumber(a, b, this.sliderSettings.dur, (obj) => {
        // console.log('Entity: ', this.entity);
        let pos = this.sliderSettings.pick.getLocalPosition();
        pos.x = obj.number;
        this.sliderSettings.pick.setLocalPosition(pos.x, pos.y, pos.z);
    }, () => this.tweenFromAtoB(b, a));
};

ResultView.prototype.calculateMultiplier = function () {
    let pickPosX = this.sliderSettings.pick.getLocalPosition().x;

    for (let i = this.sliderPoints.length - 1; i > -1; i--) {
        let point = this.sliderPoints[i].point.getLocalPosition();
        // console.log(pickPosX, ' > ', point.x);
        if (pickPosX >= point.x) {
            // console.log('----------------------: ', this.sliderPoints[i].mul, 'x', this.coins);
            return this.sliderPoints[i].mul;
        }
    }
    // console.log('----------------------: ', 2, 'x', this.coins);

    return 2;
};

ResultView.prototype.backToMainMenu = function (err) {
    if (err) console.log("ResultView:backToMainMenu:Interstitial:Error: ", err);
    AdsManager.Instance.showAdLoading('Loading Ad...', false);
    MenuManager.Instance.changeState(MenuManager.States.Home)
};

// swap method called for script hot-reloading
// inherit your script state here
// ResultView.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// ParticleSystemController.js
var ParticleSystemController = pc.createScript('particleSystemController');

ParticleSystemController.attributes.add('particles', { type: 'entity', title: 'Particles', array: true });

// initialize code called once per entity
ParticleSystemController.prototype.initialize = function () {
    this.entity.on('Play', this.play, this);
};

// update code called every frame
ParticleSystemController.prototype.play = function (play) {
    // console.log('play: ', play);
    for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].enabled = play;

        // // console.log(this.particles[i]);
        if (play) {
            // this.particles[i].particlesystem.reset();
            this.particles[i].particlesystem.play();
        }
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// ParticleSystemController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// CustomToggle.js
var CustomToggle = pc.createScript('customToggle');

CustomToggle.attributes.add('event', {
    title: 'Events',
    type: 'json',
    schema: [
        {
            name: 'eventScope', type: 'number', title: 'Events Scope',
            enum: [{ 'App': 0 }, { 'Entity': 1 },], default: 0
        },
        { name: 'enableEvent', type: 'string', title: 'Enable Event', description: 'Call This function with true/false to switch icon on/off.', default: 'CustomToggle:Enable'},
    ],
});

CustomToggle.attributes.add('icon', { type: 'entity', title: 'Icon' });
CustomToggle.attributes.add('onImg', { type: 'asset', assetType: 'sprite', title: 'On Image' });
CustomToggle.attributes.add('offImg', { type: 'asset', assetType: 'sprite', title: 'Off Image' });

// initialize code called once per entity
CustomToggle.prototype.initialize = function() {
    let scope = this.event.eventScope === 0 ? this.app : this.entity;
    scope.on(this.event.enableEvent, this.enableToggle, this);
};

// update code called every frame
CustomToggle.prototype.enableToggle = function(enable) {
    console.log('enableToggle: ', enable);
    this.icon.element.sprite = enable ? this.onImg.resource : this.offImg.resource;
};

// swap method called for script hot-reloading
// inherit your script state here
// CustomToggle.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// CustomizationManager.js
var CustomizationManager = pc.createScript('customizationManager');

CustomizationManager.Views = {
    Themes: 0,
    Skins: 1
};

// initialize code called once per entity
CustomizationManager.prototype.initialize = function() {
    CustomizationManager.Instance = this;
    this.selectedView = 0;
};

// update code called every frame
CustomizationManager.prototype.update = function(dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// CustomizationDataManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// playcanvas-spine.3.8.min.js
var spine=function(t){"use strict";function e(t){var e=Object.create(null);return t&&Object.keys(t).forEach((function(n){if("default"!==n){var r=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,r.get?r:{enumerable:!0,get:function(){return t[n]}})}})),e.default=t,Object.freeze(e)}var n,r,a,i=e(t),o=this&&this.__extends||(n=function(t,e){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},n(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)});function s(){s=function(){return e};var t,e={},n=Object.prototype,r=n.hasOwnProperty,a=Object.defineProperty||function(t,e,n){t[e]=n.value},i="function"==typeof Symbol?Symbol:{},o=i.iterator||"@@iterator",h=i.asyncIterator||"@@asyncIterator",l=i.toStringTag||"@@toStringTag";function u(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,n){return t[e]=n}}function c(t,e,n,r){var i=e&&e.prototype instanceof y?e:y,o=Object.create(i.prototype),s=new k(r||[]);return a(o,"_invoke",{value:R(t,n,s)}),o}function f(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}e.wrap=c;var d="suspendedStart",p="suspendedYield",m="executing",v="completed",g={};function y(){}function E(){}function w(){}var x={};u(x,o,(function(){return this}));var T=Object.getPrototypeOf,A=T&&T(T(N([])));A&&A!==n&&r.call(A,o)&&(x=A);var M=w.prototype=y.prototype=Object.create(x);function I(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function b(t,e){function n(a,i,o,s){var h=f(t[a],t,i);if("throw"!==h.type){var l=h.arg,u=l.value;return u&&"object"==typeof u&&r.call(u,"__await")?e.resolve(u.__await).then((function(t){n("next",t,o,s)}),(function(t){n("throw",t,o,s)})):e.resolve(u).then((function(t){l.value=t,o(l)}),(function(t){return n("throw",t,o,s)}))}s(h.arg)}var i;a(this,"_invoke",{value:function(t,r){function a(){return new e((function(e,a){n(t,r,e,a)}))}return i=i?i.then(a,a):a()}})}function R(e,n,r){var a=d;return function(i,o){if(a===m)throw new Error("Generator is already running");if(a===v){if("throw"===i)throw o;return{value:t,done:!0}}for(r.method=i,r.arg=o;;){var s=r.delegate;if(s){var h=S(s,r);if(h){if(h===g)continue;return h}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(a===d)throw a=v,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);a=m;var l=f(e,n,r);if("normal"===l.type){if(a=r.done?v:p,l.arg===g)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(a=v,r.method="throw",r.arg=l.arg)}}}function S(e,n){var r=n.method,a=e.iterator[r];if(a===t)return n.delegate=null,"throw"===r&&e.iterator.return&&(n.method="return",n.arg=t,S(e,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),g;var i=f(a,e.iterator,n.arg);if("throw"===i.type)return n.method="throw",n.arg=i.arg,n.delegate=null,g;var o=i.arg;return o?o.done?(n[e.resultName]=o.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,g):o:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,g)}function C(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function k(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(C,this),this.reset(!0)}function N(e){if(e||""===e){var n=e[o];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,i=function n(){for(;++a<e.length;)if(r.call(e,a))return n.value=e[a],n.done=!1,n;return n.value=t,n.done=!0,n};return i.next=i}}throw new TypeError(typeof e+" is not iterable")}return E.prototype=w,a(M,"constructor",{value:w,configurable:!0}),a(w,"constructor",{value:E,configurable:!0}),E.displayName=u(w,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===E||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,u(t,l,"GeneratorFunction")),t.prototype=Object.create(M),t},e.awrap=function(t){return{__await:t}},I(b.prototype),u(b.prototype,h,(function(){return this})),e.AsyncIterator=b,e.async=function(t,n,r,a,i){void 0===i&&(i=Promise);var o=new b(c(t,n,r,a),i);return e.isGeneratorFunction(n)?o:o.next().then((function(t){return t.done?t.value:o.next()}))},I(M),u(M,l,"Generator"),u(M,o,(function(){return this})),u(M,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},e.values=N,k.prototype={constructor:k,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function a(r,a){return s.type="throw",s.arg=e,n.next=r,a&&(n.method="next",n.arg=t),!!a}for(var i=this.tryEntries.length-1;i>=0;--i){var o=this.tryEntries[i],s=o.completion;if("root"===o.tryLoc)return a("end");if(o.tryLoc<=this.prev){var h=r.call(o,"catchLoc"),l=r.call(o,"finallyLoc");if(h&&l){if(this.prev<o.catchLoc)return a(o.catchLoc,!0);if(this.prev<o.finallyLoc)return a(o.finallyLoc)}else if(h){if(this.prev<o.catchLoc)return a(o.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return a(o.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var a=this.tryEntries[n];if(a.tryLoc<=this.prev&&r.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var i=a;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var o=i?i.completion:{};return o.type=t,o.arg=e,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(o)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),P(n),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var a=r.arg;P(n)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:N(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),g}},e}function h(t){return h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},h(t)}function l(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function u(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,M(r.key),r)}}function c(t,e,n){return e&&u(t.prototype,e),n&&u(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function f(t,e,n){return(e=M(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function d(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&m(t,e)}function p(t){return p=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},p(t)}function m(t,e){return m=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},m(t,e)}function v(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function g(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=p(t);if(e){var a=p(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return function(t,e){if(e&&("object"==typeof e||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return v(t)}(this,n)}}function y(){return y="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=p(t)););return t}(t,e);if(r){var a=Object.getOwnPropertyDescriptor(r,e);return a.get?a.get.call(arguments.length<3?t:n):a.value}},y.apply(this,arguments)}function E(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,a,i,o,s=[],h=!0,l=!1;try{if(i=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;h=!1}else for(;!(h=(r=i.call(n)).done)&&(s.push(r.value),s.length!==e);h=!0);}catch(t){l=!0,a=t}finally{try{if(!h&&null!=n.return&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw a}}return s}}(t,e)||x(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function w(t){return function(t){if(Array.isArray(t))return T(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||x(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function x(t,e){if(t){if("string"==typeof t)return T(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?T(t,e):void 0}}function T(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function A(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=x(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,a=function(){};return{s:a,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return o=t.done,t},e:function(t){s=!0,i=t},f:function(){try{o||null==n.return||n.return()}finally{if(s)throw i}}}}function M(t){var e=function(t,e){if("object"!=typeof t||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,e||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==typeof e?e:String(e)}!function(t){var e,n,r,a=function(){function t(t,e,n){if(null==t)throw new Error("name cannot be null.");if(null==e)throw new Error("timelines cannot be null.");this.name=t,this.timelines=e,this.timelineIds=[];for(var r=0;r<e.length;r++)this.timelineIds[e[r].getPropertyId()]=!0;this.duration=n}return t.prototype.hasTimeline=function(t){return 1==this.timelineIds[t]},t.prototype.apply=function(t,e,n,r,a,i,o,s){if(null==t)throw new Error("skeleton cannot be null.");r&&0!=this.duration&&(n%=this.duration,e>0&&(e%=this.duration));for(var h=this.timelines,l=0,u=h.length;l<u;l++)h[l].apply(t,e,n,a,i,o,s)},t.binarySearch=function(t,e,n){void 0===n&&(n=1);var r=0,a=t.length/n-2;if(0==a)return n;for(var i=a>>>1;;){if(t[(i+1)*n]<=e?r=i+1:a=i,r==a)return(r+1)*n;i=r+a>>>1}},t.linearSearch=function(t,e,n){for(var r=0,a=t.length-n;r<=a;r+=n)if(t[r]>e)return r;return-1},t}();t.Animation=a,function(t){t[t.setup=0]="setup",t[t.first=1]="first",t[t.replace=2]="replace",t[t.add=3]="add"}(e=t.MixBlend||(t.MixBlend={})),function(t){t[t.mixIn=0]="mixIn",t[t.mixOut=1]="mixOut"}(n=t.MixDirection||(t.MixDirection={})),function(t){t[t.rotate=0]="rotate",t[t.translate=1]="translate",t[t.scale=2]="scale",t[t.shear=3]="shear",t[t.attachment=4]="attachment",t[t.color=5]="color",t[t.deform=6]="deform",t[t.event=7]="event",t[t.drawOrder=8]="drawOrder",t[t.ikConstraint=9]="ikConstraint",t[t.transformConstraint=10]="transformConstraint",t[t.pathConstraintPosition=11]="pathConstraintPosition",t[t.pathConstraintSpacing=12]="pathConstraintSpacing",t[t.pathConstraintMix=13]="pathConstraintMix",t[t.twoColor=14]="twoColor"}(r=t.TimelineType||(t.TimelineType={}));var i=function(){function e(n){if(n<=0)throw new Error("frameCount must be > 0: "+n);this.curves=t.Utils.newFloatArray((n-1)*e.BEZIER_SIZE)}return e.prototype.getFrameCount=function(){return this.curves.length/e.BEZIER_SIZE+1},e.prototype.setLinear=function(t){this.curves[t*e.BEZIER_SIZE]=e.LINEAR},e.prototype.setStepped=function(t){this.curves[t*e.BEZIER_SIZE]=e.STEPPED},e.prototype.getCurveType=function(t){var n=t*e.BEZIER_SIZE;if(n==this.curves.length)return e.LINEAR;var r=this.curves[n];return r==e.LINEAR?e.LINEAR:r==e.STEPPED?e.STEPPED:e.BEZIER},e.prototype.setCurve=function(t,n,r,a,i){var o=.03*(2*-n+a),s=.03*(2*-r+i),h=.006*(3*(n-a)+1),l=.006*(3*(r-i)+1),u=2*o+h,c=2*s+l,f=.3*n+o+.16666667*h,d=.3*r+s+.16666667*l,p=t*e.BEZIER_SIZE,m=this.curves;m[p++]=e.BEZIER;for(var v=f,g=d,y=p+e.BEZIER_SIZE-1;p<y;p+=2)m[p]=v,m[p+1]=g,f+=u,d+=c,u+=h,c+=l,v+=f,g+=d},e.prototype.getCurvePercent=function(n,r){r=t.MathUtils.clamp(r,0,1);var a=this.curves,i=n*e.BEZIER_SIZE,o=a[i];if(o==e.LINEAR)return r;if(o==e.STEPPED)return 0;for(var s=0,h=++i,l=i+e.BEZIER_SIZE-1;i<l;i+=2)if((s=a[i])>=r){var u=void 0,c=void 0;return i==h?(u=0,c=0):(u=a[i-2],c=a[i-1]),c+(a[i+1]-c)*(r-u)/(s-u)}var f=a[i-1];return f+(1-f)*(r-s)/(1-s)},e.LINEAR=0,e.STEPPED=1,e.BEZIER=2,e.BEZIER_SIZE=19,e}();t.CurveTimeline=i;var s=function(n){function i(e){var r=n.call(this,e)||this;return r.frames=t.Utils.newFloatArray(e<<1),r}return o(i,n),i.prototype.getPropertyId=function(){return(r.rotate<<24)+this.boneIndex},i.prototype.setFrame=function(t,e,n){t<<=1,this.frames[t]=e,this.frames[t+i.ROTATION]=n},i.prototype.apply=function(t,n,r,o,s,h,l){var u=this.frames,c=t.bones[this.boneIndex];if(c.active)if(r<u[0])switch(h){case e.setup:return void(c.rotation=c.data.rotation);case e.first:var f=c.data.rotation-c.rotation;c.rotation+=(f-360*(16384-(16384.499999999996-f/360|0)))*s}else if(r>=u[u.length-i.ENTRIES]){var d=u[u.length+i.PREV_ROTATION];switch(h){case e.setup:c.rotation=c.data.rotation+d*s;break;case e.first:case e.replace:d+=c.data.rotation-c.rotation,d-=360*(16384-(16384.499999999996-d/360|0));case e.add:c.rotation+=d*s}}else{var p=a.binarySearch(u,r,i.ENTRIES),m=u[p+i.PREV_ROTATION],v=u[p],g=this.getCurvePercent((p>>1)-1,1-(r-v)/(u[p+i.PREV_TIME]-v)),y=u[p+i.ROTATION]-m;switch(y=m+(y-360*(16384-(16384.499999999996-y/360|0)))*g,h){case e.setup:c.rotation=c.data.rotation+(y-360*(16384-(16384.499999999996-y/360|0)))*s;break;case e.first:case e.replace:y+=c.data.rotation-c.rotation;case e.add:c.rotation+=(y-360*(16384-(16384.499999999996-y/360|0)))*s}}},i.ENTRIES=2,i.PREV_TIME=-2,i.PREV_ROTATION=-1,i.ROTATION=1,i}(i);t.RotateTimeline=s;var h=function(n){function i(e){var r=n.call(this,e)||this;return r.frames=t.Utils.newFloatArray(e*i.ENTRIES),r}return o(i,n),i.prototype.getPropertyId=function(){return(r.translate<<24)+this.boneIndex},i.prototype.setFrame=function(t,e,n,r){t*=i.ENTRIES,this.frames[t]=e,this.frames[t+i.X]=n,this.frames[t+i.Y]=r},i.prototype.apply=function(t,n,r,o,s,h,l){var u=this.frames,c=t.bones[this.boneIndex];if(c.active)if(r<u[0])switch(h){case e.setup:return c.x=c.data.x,void(c.y=c.data.y);case e.first:c.x+=(c.data.x-c.x)*s,c.y+=(c.data.y-c.y)*s}else{var f=0,d=0;if(r>=u[u.length-i.ENTRIES])f=u[u.length+i.PREV_X],d=u[u.length+i.PREV_Y];else{var p=a.binarySearch(u,r,i.ENTRIES);f=u[p+i.PREV_X],d=u[p+i.PREV_Y];var m=u[p],v=this.getCurvePercent(p/i.ENTRIES-1,1-(r-m)/(u[p+i.PREV_TIME]-m));f+=(u[p+i.X]-f)*v,d+=(u[p+i.Y]-d)*v}switch(h){case e.setup:c.x=c.data.x+f*s,c.y=c.data.y+d*s;break;case e.first:case e.replace:c.x+=(c.data.x+f-c.x)*s,c.y+=(c.data.y+d-c.y)*s;break;case e.add:c.x+=f*s,c.y+=d*s}}},i.ENTRIES=3,i.PREV_TIME=-3,i.PREV_X=-2,i.PREV_Y=-1,i.X=1,i.Y=2,i}(i);t.TranslateTimeline=h;var l=function(i){function s(t){return i.call(this,t)||this}return o(s,i),s.prototype.getPropertyId=function(){return(r.scale<<24)+this.boneIndex},s.prototype.apply=function(r,i,o,h,l,u,c){var f=this.frames,d=r.bones[this.boneIndex];if(d.active)if(o<f[0])switch(u){case e.setup:return d.scaleX=d.data.scaleX,void(d.scaleY=d.data.scaleY);case e.first:d.scaleX+=(d.data.scaleX-d.scaleX)*l,d.scaleY+=(d.data.scaleY-d.scaleY)*l}else{var p=0,m=0;if(o>=f[f.length-s.ENTRIES])p=f[f.length+s.PREV_X]*d.data.scaleX,m=f[f.length+s.PREV_Y]*d.data.scaleY;else{var v=a.binarySearch(f,o,s.ENTRIES);p=f[v+s.PREV_X],m=f[v+s.PREV_Y];var g=f[v],y=this.getCurvePercent(v/s.ENTRIES-1,1-(o-g)/(f[v+s.PREV_TIME]-g));p=(p+(f[v+s.X]-p)*y)*d.data.scaleX,m=(m+(f[v+s.Y]-m)*y)*d.data.scaleY}if(1==l)u==e.add?(d.scaleX+=p-d.data.scaleX,d.scaleY+=m-d.data.scaleY):(d.scaleX=p,d.scaleY=m);else{var E=0,w=0;if(c==n.mixOut)switch(u){case e.setup:E=d.data.scaleX,w=d.data.scaleY,d.scaleX=E+(Math.abs(p)*t.MathUtils.signum(E)-E)*l,d.scaleY=w+(Math.abs(m)*t.MathUtils.signum(w)-w)*l;break;case e.first:case e.replace:E=d.scaleX,w=d.scaleY,d.scaleX=E+(Math.abs(p)*t.MathUtils.signum(E)-E)*l,d.scaleY=w+(Math.abs(m)*t.MathUtils.signum(w)-w)*l;break;case e.add:E=d.scaleX,w=d.scaleY,d.scaleX=E+(Math.abs(p)*t.MathUtils.signum(E)-d.data.scaleX)*l,d.scaleY=w+(Math.abs(m)*t.MathUtils.signum(w)-d.data.scaleY)*l}else switch(u){case e.setup:E=Math.abs(d.data.scaleX)*t.MathUtils.signum(p),w=Math.abs(d.data.scaleY)*t.MathUtils.signum(m),d.scaleX=E+(p-E)*l,d.scaleY=w+(m-w)*l;break;case e.first:case e.replace:E=Math.abs(d.scaleX)*t.MathUtils.signum(p),w=Math.abs(d.scaleY)*t.MathUtils.signum(m),d.scaleX=E+(p-E)*l,d.scaleY=w+(m-w)*l;break;case e.add:E=t.MathUtils.signum(p),w=t.MathUtils.signum(m),d.scaleX=Math.abs(d.scaleX)*E+(p-Math.abs(d.data.scaleX)*E)*l,d.scaleY=Math.abs(d.scaleY)*w+(m-Math.abs(d.data.scaleY)*w)*l}}}},s}(h);t.ScaleTimeline=l;var u=function(t){function n(e){return t.call(this,e)||this}return o(n,t),n.prototype.getPropertyId=function(){return(r.shear<<24)+this.boneIndex},n.prototype.apply=function(t,r,i,o,s,h,l){var u=this.frames,c=t.bones[this.boneIndex];if(c.active)if(i<u[0])switch(h){case e.setup:return c.shearX=c.data.shearX,void(c.shearY=c.data.shearY);case e.first:c.shearX+=(c.data.shearX-c.shearX)*s,c.shearY+=(c.data.shearY-c.shearY)*s}else{var f=0,d=0;if(i>=u[u.length-n.ENTRIES])f=u[u.length+n.PREV_X],d=u[u.length+n.PREV_Y];else{var p=a.binarySearch(u,i,n.ENTRIES);f=u[p+n.PREV_X],d=u[p+n.PREV_Y];var m=u[p],v=this.getCurvePercent(p/n.ENTRIES-1,1-(i-m)/(u[p+n.PREV_TIME]-m));f+=(u[p+n.X]-f)*v,d+=(u[p+n.Y]-d)*v}switch(h){case e.setup:c.shearX=c.data.shearX+f*s,c.shearY=c.data.shearY+d*s;break;case e.first:case e.replace:c.shearX+=(c.data.shearX+f-c.shearX)*s,c.shearY+=(c.data.shearY+d-c.shearY)*s;break;case e.add:c.shearX+=f*s,c.shearY+=d*s}}},n}(h);t.ShearTimeline=u;var c=function(n){function i(e){var r=n.call(this,e)||this;return r.frames=t.Utils.newFloatArray(e*i.ENTRIES),r}return o(i,n),i.prototype.getPropertyId=function(){return(r.color<<24)+this.slotIndex},i.prototype.setFrame=function(t,e,n,r,a,o){t*=i.ENTRIES,this.frames[t]=e,this.frames[t+i.R]=n,this.frames[t+i.G]=r,this.frames[t+i.B]=a,this.frames[t+i.A]=o},i.prototype.apply=function(t,n,r,o,s,h,l){var u=t.slots[this.slotIndex];if(u.bone.active){var c=this.frames;if(r<c[0])switch(h){case e.setup:return void u.color.setFromColor(u.data.color);case e.first:var f=u.color,d=u.data.color;f.add((d.r-f.r)*s,(d.g-f.g)*s,(d.b-f.b)*s,(d.a-f.a)*s)}else{var p=0,m=0,v=0,g=0;if(r>=c[c.length-i.ENTRIES]){var y=c.length;p=c[y+i.PREV_R],m=c[y+i.PREV_G],v=c[y+i.PREV_B],g=c[y+i.PREV_A]}else{var E=a.binarySearch(c,r,i.ENTRIES);p=c[E+i.PREV_R],m=c[E+i.PREV_G],v=c[E+i.PREV_B],g=c[E+i.PREV_A];var w=c[E],x=this.getCurvePercent(E/i.ENTRIES-1,1-(r-w)/(c[E+i.PREV_TIME]-w));p+=(c[E+i.R]-p)*x,m+=(c[E+i.G]-m)*x,v+=(c[E+i.B]-v)*x,g+=(c[E+i.A]-g)*x}if(1==s)u.color.set(p,m,v,g);else{f=u.color;h==e.setup&&f.setFromColor(u.data.color),f.add((p-f.r)*s,(m-f.g)*s,(v-f.b)*s,(g-f.a)*s)}}}},i.ENTRIES=5,i.PREV_TIME=-5,i.PREV_R=-4,i.PREV_G=-3,i.PREV_B=-2,i.PREV_A=-1,i.R=1,i.G=2,i.B=3,i.A=4,i}(i);t.ColorTimeline=c;var f=function(n){function i(e){var r=n.call(this,e)||this;return r.frames=t.Utils.newFloatArray(e*i.ENTRIES),r}return o(i,n),i.prototype.getPropertyId=function(){return(r.twoColor<<24)+this.slotIndex},i.prototype.setFrame=function(t,e,n,r,a,o,s,h,l){t*=i.ENTRIES,this.frames[t]=e,this.frames[t+i.R]=n,this.frames[t+i.G]=r,this.frames[t+i.B]=a,this.frames[t+i.A]=o,this.frames[t+i.R2]=s,this.frames[t+i.G2]=h,this.frames[t+i.B2]=l},i.prototype.apply=function(t,n,r,o,s,h,l){var u=t.slots[this.slotIndex];if(u.bone.active){var c=this.frames;if(r<c[0])switch(h){case e.setup:return u.color.setFromColor(u.data.color),void u.darkColor.setFromColor(u.data.darkColor);case e.first:var f=u.color,d=u.darkColor,p=u.data.color,m=u.data.darkColor;f.add((p.r-f.r)*s,(p.g-f.g)*s,(p.b-f.b)*s,(p.a-f.a)*s),d.add((m.r-d.r)*s,(m.g-d.g)*s,(m.b-d.b)*s,0)}else{var v=0,g=0,y=0,E=0,w=0,x=0,T=0;if(r>=c[c.length-i.ENTRIES]){var A=c.length;v=c[A+i.PREV_R],g=c[A+i.PREV_G],y=c[A+i.PREV_B],E=c[A+i.PREV_A],w=c[A+i.PREV_R2],x=c[A+i.PREV_G2],T=c[A+i.PREV_B2]}else{var M=a.binarySearch(c,r,i.ENTRIES);v=c[M+i.PREV_R],g=c[M+i.PREV_G],y=c[M+i.PREV_B],E=c[M+i.PREV_A],w=c[M+i.PREV_R2],x=c[M+i.PREV_G2],T=c[M+i.PREV_B2];var I=c[M],b=this.getCurvePercent(M/i.ENTRIES-1,1-(r-I)/(c[M+i.PREV_TIME]-I));v+=(c[M+i.R]-v)*b,g+=(c[M+i.G]-g)*b,y+=(c[M+i.B]-y)*b,E+=(c[M+i.A]-E)*b,w+=(c[M+i.R2]-w)*b,x+=(c[M+i.G2]-x)*b,T+=(c[M+i.B2]-T)*b}if(1==s)u.color.set(v,g,y,E),u.darkColor.set(w,x,T,1);else{f=u.color,d=u.darkColor;h==e.setup&&(f.setFromColor(u.data.color),d.setFromColor(u.data.darkColor)),f.add((v-f.r)*s,(g-f.g)*s,(y-f.b)*s,(E-f.a)*s),d.add((w-d.r)*s,(x-d.g)*s,(T-d.b)*s,0)}}}},i.ENTRIES=8,i.PREV_TIME=-8,i.PREV_R=-7,i.PREV_G=-6,i.PREV_B=-5,i.PREV_A=-4,i.PREV_R2=-3,i.PREV_G2=-2,i.PREV_B2=-1,i.R=1,i.G=2,i.B=3,i.A=4,i.R2=5,i.G2=6,i.B2=7,i}(i);t.TwoColorTimeline=f;var d=function(){function i(e){this.frames=t.Utils.newFloatArray(e),this.attachmentNames=new Array(e)}return i.prototype.getPropertyId=function(){return(r.attachment<<24)+this.slotIndex},i.prototype.getFrameCount=function(){return this.frames.length},i.prototype.setFrame=function(t,e,n){this.frames[t]=e,this.attachmentNames[t]=n},i.prototype.apply=function(t,r,i,o,s,h,l){var u=t.slots[this.slotIndex];if(u.bone.active)if(l!=n.mixOut){var c=this.frames;if(i<c[0])h!=e.setup&&h!=e.first||this.setAttachment(t,u,u.data.attachmentName);else{var f=0;f=i>=c[c.length-1]?c.length-1:a.binarySearch(c,i,1)-1;var d=this.attachmentNames[f];t.slots[this.slotIndex].setAttachment(null==d?null:t.getAttachment(this.slotIndex,d))}}else h==e.setup&&this.setAttachment(t,u,u.data.attachmentName)},i.prototype.setAttachment=function(t,e,n){e.setAttachment(null==n?null:t.getAttachment(this.slotIndex,n))},i}();t.AttachmentTimeline=d;var p=null,m=function(n){function i(e){var r=n.call(this,e)||this;return r.frames=t.Utils.newFloatArray(e),r.frameVertices=new Array(e),null==p&&(p=t.Utils.newFloatArray(64)),r}return o(i,n),i.prototype.getPropertyId=function(){return(r.deform<<27)+ +this.attachment.id+this.slotIndex},i.prototype.setFrame=function(t,e,n){this.frames[t]=e,this.frameVertices[t]=n},i.prototype.apply=function(n,r,i,o,s,h,l){var u=n.slots[this.slotIndex];if(u.bone.active){var c=u.getAttachment();if(c instanceof t.VertexAttachment&&c.deformAttachment==this.attachment){var f=u.deform;0==f.length&&(h=e.setup);var d=this.frameVertices,p=d[0].length,m=this.frames;if(i<m[0]){var v=c;switch(h){case e.setup:return void(f.length=0);case e.first:if(1==s){f.length=0;break}var g=t.Utils.setArraySize(f,p);if(null==v.bones)for(var y=v.vertices,E=0;E<p;E++)g[E]+=(y[E]-g[E])*s;else{s=1-s;for(E=0;E<p;E++)g[E]*=s}}}else{var w=t.Utils.setArraySize(f,p);if(i>=m[m.length-1]){var x=d[m.length-1];if(1==s)if(h==e.add)if(null==(v=c).bones){y=v.vertices;for(var T=0;T<p;T++)w[T]+=x[T]-y[T]}else for(var A=0;A<p;A++)w[A]+=x[A];else t.Utils.arrayCopy(x,0,w,0,p);else switch(h){case e.setup:var M=c;if(null==M.bones){y=M.vertices;for(var I=0;I<p;I++){var b=y[I];w[I]=b+(x[I]-b)*s}}else for(var R=0;R<p;R++)w[R]=x[R]*s;break;case e.first:case e.replace:for(var S=0;S<p;S++)w[S]+=(x[S]-w[S])*s;break;case e.add:if(null==(v=c).bones){y=v.vertices;for(var C=0;C<p;C++)w[C]+=(x[C]-y[C])*s}else for(var P=0;P<p;P++)w[P]+=x[P]*s}}else{var k=a.binarySearch(m,i),N=d[k-1],_=d[k],V=m[k],L=this.getCurvePercent(k-1,1-(i-V)/(m[k-1]-V));if(1==s)if(h==e.add)if(null==(v=c).bones){y=v.vertices;for(var O=0;O<p;O++){var F=N[O];w[O]+=F+(_[O]-F)*L-y[O]}}else for(var D=0;D<p;D++){F=N[D];w[D]+=F+(_[D]-F)*L}else for(var U=0;U<p;U++){F=N[U];w[U]=F+(_[U]-F)*L}else switch(h){case e.setup:var B=c;if(null==B.bones){y=B.vertices;for(var X=0;X<p;X++){F=N[X],b=y[X];w[X]=b+(F+(_[X]-F)*L-b)*s}}else for(var Y=0;Y<p;Y++){F=N[Y];w[Y]=(F+(_[Y]-F)*L)*s}break;case e.first:case e.replace:for(var W=0;W<p;W++){F=N[W];w[W]+=(F+(_[W]-F)*L-w[W])*s}break;case e.add:if(null==(v=c).bones){y=v.vertices;for(var j=0;j<p;j++){F=N[j];w[j]+=(F+(_[j]-F)*L-y[j])*s}}else for(var G=0;G<p;G++){F=N[G];w[G]+=(F+(_[G]-F)*L)*s}}}}}}},i}(i);t.DeformTimeline=m;var v=function(){function e(e){this.frames=t.Utils.newFloatArray(e),this.events=new Array(e)}return e.prototype.getPropertyId=function(){return r.event<<24},e.prototype.getFrameCount=function(){return this.frames.length},e.prototype.setFrame=function(t,e){this.frames[t]=e.time,this.events[t]=e},e.prototype.apply=function(t,e,n,r,i,o,s){if(null!=r){var h=this.frames,l=this.frames.length;if(e>n)this.apply(t,e,Number.MAX_VALUE,r,i,o,s),e=-1;else if(e>=h[l-1])return;if(!(n<h[0])){var u=0;if(e<h[0])u=0;else for(var c=h[u=a.binarySearch(h,e)];u>0&&h[u-1]==c;)u--;for(;u<l&&n>=h[u];u++)r.push(this.events[u])}}},e}();t.EventTimeline=v;var g=function(){function i(e){this.frames=t.Utils.newFloatArray(e),this.drawOrders=new Array(e)}return i.prototype.getPropertyId=function(){return r.drawOrder<<24},i.prototype.getFrameCount=function(){return this.frames.length},i.prototype.setFrame=function(t,e,n){this.frames[t]=e,this.drawOrders[t]=n},i.prototype.apply=function(r,i,o,s,h,l,u){var c=r.drawOrder,f=r.slots;if(u!=n.mixOut){var d=this.frames;if(o<d[0])l!=e.setup&&l!=e.first||t.Utils.arrayCopy(r.slots,0,r.drawOrder,0,r.slots.length);else{var p=0;p=o>=d[d.length-1]?d.length-1:a.binarySearch(d,o)-1;var m=this.drawOrders[p];if(null==m)t.Utils.arrayCopy(f,0,c,0,f.length);else for(var v=0,g=m.length;v<g;v++)c[v]=f[m[v]]}}else l==e.setup&&t.Utils.arrayCopy(r.slots,0,r.drawOrder,0,r.slots.length)},i}();t.DrawOrderTimeline=g;var y=function(i){function s(e){var n=i.call(this,e)||this;return n.frames=t.Utils.newFloatArray(e*s.ENTRIES),n}return o(s,i),s.prototype.getPropertyId=function(){return(r.ikConstraint<<24)+this.ikConstraintIndex},s.prototype.setFrame=function(t,e,n,r,a,i,o){t*=s.ENTRIES,this.frames[t]=e,this.frames[t+s.MIX]=n,this.frames[t+s.SOFTNESS]=r,this.frames[t+s.BEND_DIRECTION]=a,this.frames[t+s.COMPRESS]=i?1:0,this.frames[t+s.STRETCH]=o?1:0},s.prototype.apply=function(t,r,i,o,h,l,u){var c=this.frames,f=t.ikConstraints[this.ikConstraintIndex];if(f.active)if(i<c[0])switch(l){case e.setup:return f.mix=f.data.mix,f.softness=f.data.softness,f.bendDirection=f.data.bendDirection,f.compress=f.data.compress,void(f.stretch=f.data.stretch);case e.first:f.mix+=(f.data.mix-f.mix)*h,f.softness+=(f.data.softness-f.softness)*h,f.bendDirection=f.data.bendDirection,f.compress=f.data.compress,f.stretch=f.data.stretch}else if(i>=c[c.length-s.ENTRIES])l==e.setup?(f.mix=f.data.mix+(c[c.length+s.PREV_MIX]-f.data.mix)*h,f.softness=f.data.softness+(c[c.length+s.PREV_SOFTNESS]-f.data.softness)*h,u==n.mixOut?(f.bendDirection=f.data.bendDirection,f.compress=f.data.compress,f.stretch=f.data.stretch):(f.bendDirection=c[c.length+s.PREV_BEND_DIRECTION],f.compress=0!=c[c.length+s.PREV_COMPRESS],f.stretch=0!=c[c.length+s.PREV_STRETCH])):(f.mix+=(c[c.length+s.PREV_MIX]-f.mix)*h,f.softness+=(c[c.length+s.PREV_SOFTNESS]-f.softness)*h,u==n.mixIn&&(f.bendDirection=c[c.length+s.PREV_BEND_DIRECTION],f.compress=0!=c[c.length+s.PREV_COMPRESS],f.stretch=0!=c[c.length+s.PREV_STRETCH]));else{var d=a.binarySearch(c,i,s.ENTRIES),p=c[d+s.PREV_MIX],m=c[d+s.PREV_SOFTNESS],v=c[d],g=this.getCurvePercent(d/s.ENTRIES-1,1-(i-v)/(c[d+s.PREV_TIME]-v));l==e.setup?(f.mix=f.data.mix+(p+(c[d+s.MIX]-p)*g-f.data.mix)*h,f.softness=f.data.softness+(m+(c[d+s.SOFTNESS]-m)*g-f.data.softness)*h,u==n.mixOut?(f.bendDirection=f.data.bendDirection,f.compress=f.data.compress,f.stretch=f.data.stretch):(f.bendDirection=c[d+s.PREV_BEND_DIRECTION],f.compress=0!=c[d+s.PREV_COMPRESS],f.stretch=0!=c[d+s.PREV_STRETCH])):(f.mix+=(p+(c[d+s.MIX]-p)*g-f.mix)*h,f.softness+=(m+(c[d+s.SOFTNESS]-m)*g-f.softness)*h,u==n.mixIn&&(f.bendDirection=c[d+s.PREV_BEND_DIRECTION],f.compress=0!=c[d+s.PREV_COMPRESS],f.stretch=0!=c[d+s.PREV_STRETCH]))}},s.ENTRIES=6,s.PREV_TIME=-6,s.PREV_MIX=-5,s.PREV_SOFTNESS=-4,s.PREV_BEND_DIRECTION=-3,s.PREV_COMPRESS=-2,s.PREV_STRETCH=-1,s.MIX=1,s.SOFTNESS=2,s.BEND_DIRECTION=3,s.COMPRESS=4,s.STRETCH=5,s}(i);t.IkConstraintTimeline=y;var E=function(n){function i(e){var r=n.call(this,e)||this;return r.frames=t.Utils.newFloatArray(e*i.ENTRIES),r}return o(i,n),i.prototype.getPropertyId=function(){return(r.transformConstraint<<24)+this.transformConstraintIndex},i.prototype.setFrame=function(t,e,n,r,a,o){t*=i.ENTRIES,this.frames[t]=e,this.frames[t+i.ROTATE]=n,this.frames[t+i.TRANSLATE]=r,this.frames[t+i.SCALE]=a,this.frames[t+i.SHEAR]=o},i.prototype.apply=function(t,n,r,o,s,h,l){var u=this.frames,c=t.transformConstraints[this.transformConstraintIndex];if(c.active)if(r<u[0]){var f=c.data;switch(h){case e.setup:return c.rotateMix=f.rotateMix,c.translateMix=f.translateMix,c.scaleMix=f.scaleMix,void(c.shearMix=f.shearMix);case e.first:c.rotateMix+=(f.rotateMix-c.rotateMix)*s,c.translateMix+=(f.translateMix-c.translateMix)*s,c.scaleMix+=(f.scaleMix-c.scaleMix)*s,c.shearMix+=(f.shearMix-c.shearMix)*s}}else{var d=0,p=0,m=0,v=0;if(r>=u[u.length-i.ENTRIES]){var g=u.length;d=u[g+i.PREV_ROTATE],p=u[g+i.PREV_TRANSLATE],m=u[g+i.PREV_SCALE],v=u[g+i.PREV_SHEAR]}else{var y=a.binarySearch(u,r,i.ENTRIES);d=u[y+i.PREV_ROTATE],p=u[y+i.PREV_TRANSLATE],m=u[y+i.PREV_SCALE],v=u[y+i.PREV_SHEAR];var E=u[y],w=this.getCurvePercent(y/i.ENTRIES-1,1-(r-E)/(u[y+i.PREV_TIME]-E));d+=(u[y+i.ROTATE]-d)*w,p+=(u[y+i.TRANSLATE]-p)*w,m+=(u[y+i.SCALE]-m)*w,v+=(u[y+i.SHEAR]-v)*w}if(h==e.setup){f=c.data;c.rotateMix=f.rotateMix+(d-f.rotateMix)*s,c.translateMix=f.translateMix+(p-f.translateMix)*s,c.scaleMix=f.scaleMix+(m-f.scaleMix)*s,c.shearMix=f.shearMix+(v-f.shearMix)*s}else c.rotateMix+=(d-c.rotateMix)*s,c.translateMix+=(p-c.translateMix)*s,c.scaleMix+=(m-c.scaleMix)*s,c.shearMix+=(v-c.shearMix)*s}},i.ENTRIES=5,i.PREV_TIME=-5,i.PREV_ROTATE=-4,i.PREV_TRANSLATE=-3,i.PREV_SCALE=-2,i.PREV_SHEAR=-1,i.ROTATE=1,i.TRANSLATE=2,i.SCALE=3,i.SHEAR=4,i}(i);t.TransformConstraintTimeline=E;var w=function(n){function i(e){var r=n.call(this,e)||this;return r.frames=t.Utils.newFloatArray(e*i.ENTRIES),r}return o(i,n),i.prototype.getPropertyId=function(){return(r.pathConstraintPosition<<24)+this.pathConstraintIndex},i.prototype.setFrame=function(t,e,n){t*=i.ENTRIES,this.frames[t]=e,this.frames[t+i.VALUE]=n},i.prototype.apply=function(t,n,r,o,s,h,l){var u=this.frames,c=t.pathConstraints[this.pathConstraintIndex];if(c.active)if(r<u[0])switch(h){case e.setup:return void(c.position=c.data.position);case e.first:c.position+=(c.data.position-c.position)*s}else{var f=0;if(r>=u[u.length-i.ENTRIES])f=u[u.length+i.PREV_VALUE];else{var d=a.binarySearch(u,r,i.ENTRIES);f=u[d+i.PREV_VALUE];var p=u[d],m=this.getCurvePercent(d/i.ENTRIES-1,1-(r-p)/(u[d+i.PREV_TIME]-p));f+=(u[d+i.VALUE]-f)*m}h==e.setup?c.position=c.data.position+(f-c.data.position)*s:c.position+=(f-c.position)*s}},i.ENTRIES=2,i.PREV_TIME=-2,i.PREV_VALUE=-1,i.VALUE=1,i}(i);t.PathConstraintPositionTimeline=w;var x=function(t){function n(e){return t.call(this,e)||this}return o(n,t),n.prototype.getPropertyId=function(){return(r.pathConstraintSpacing<<24)+this.pathConstraintIndex},n.prototype.apply=function(t,r,i,o,s,h,l){var u=this.frames,c=t.pathConstraints[this.pathConstraintIndex];if(c.active)if(i<u[0])switch(h){case e.setup:return void(c.spacing=c.data.spacing);case e.first:c.spacing+=(c.data.spacing-c.spacing)*s}else{var f=0;if(i>=u[u.length-n.ENTRIES])f=u[u.length+n.PREV_VALUE];else{var d=a.binarySearch(u,i,n.ENTRIES);f=u[d+n.PREV_VALUE];var p=u[d],m=this.getCurvePercent(d/n.ENTRIES-1,1-(i-p)/(u[d+n.PREV_TIME]-p));f+=(u[d+n.VALUE]-f)*m}h==e.setup?c.spacing=c.data.spacing+(f-c.data.spacing)*s:c.spacing+=(f-c.spacing)*s}},n}(w);t.PathConstraintSpacingTimeline=x;var T=function(n){function i(e){var r=n.call(this,e)||this;return r.frames=t.Utils.newFloatArray(e*i.ENTRIES),r}return o(i,n),i.prototype.getPropertyId=function(){return(r.pathConstraintMix<<24)+this.pathConstraintIndex},i.prototype.setFrame=function(t,e,n,r){t*=i.ENTRIES,this.frames[t]=e,this.frames[t+i.ROTATE]=n,this.frames[t+i.TRANSLATE]=r},i.prototype.apply=function(t,n,r,o,s,h,l){var u=this.frames,c=t.pathConstraints[this.pathConstraintIndex];if(c.active)if(r<u[0])switch(h){case e.setup:return c.rotateMix=c.data.rotateMix,void(c.translateMix=c.data.translateMix);case e.first:c.rotateMix+=(c.data.rotateMix-c.rotateMix)*s,c.translateMix+=(c.data.translateMix-c.translateMix)*s}else{var f=0,d=0;if(r>=u[u.length-i.ENTRIES])f=u[u.length+i.PREV_ROTATE],d=u[u.length+i.PREV_TRANSLATE];else{var p=a.binarySearch(u,r,i.ENTRIES);f=u[p+i.PREV_ROTATE],d=u[p+i.PREV_TRANSLATE];var m=u[p],v=this.getCurvePercent(p/i.ENTRIES-1,1-(r-m)/(u[p+i.PREV_TIME]-m));f+=(u[p+i.ROTATE]-f)*v,d+=(u[p+i.TRANSLATE]-d)*v}h==e.setup?(c.rotateMix=c.data.rotateMix+(f-c.data.rotateMix)*s,c.translateMix=c.data.translateMix+(d-c.data.translateMix)*s):(c.rotateMix+=(f-c.rotateMix)*s,c.translateMix+=(d-c.translateMix)*s)}},i.ENTRIES=3,i.PREV_TIME=-3,i.PREV_ROTATE=-2,i.PREV_TRANSLATE=-1,i.ROTATE=1,i.TRANSLATE=2,i}(i);t.PathConstraintMixTimeline=T}(a||(a={})),function(t){var e=function(){function e(e){this.tracks=new Array,this.timeScale=1,this.unkeyedState=0,this.events=new Array,this.listeners=new Array,this.queue=new a(this),this.propertyIDs=new t.IntSet,this.animationsChanged=!1,this.trackEntryPool=new t.Pool((function(){return new n})),this.data=e}return e.prototype.update=function(t){t*=this.timeScale;for(var e=this.tracks,n=0,r=e.length;n<r;n++){var a=e[n];if(null!=a){a.animationLast=a.nextAnimationLast,a.trackLast=a.nextTrackLast;var i=t*a.timeScale;if(a.delay>0){if(a.delay-=i,a.delay>0)continue;i=-a.delay,a.delay=0}var o=a.next;if(null!=o){var s=a.trackLast-o.delay;if(s>=0){for(o.delay=0,o.trackTime+=0==a.timeScale?0:(s/a.timeScale+t)*o.timeScale,a.trackTime+=i,this.setCurrent(n,o,!0);null!=o.mixingFrom;)o.mixTime+=t,o=o.mixingFrom;continue}}else if(a.trackLast>=a.trackEnd&&null==a.mixingFrom){e[n]=null,this.queue.end(a),this.disposeNext(a);continue}if(null!=a.mixingFrom&&this.updateMixingFrom(a,t)){var h=a.mixingFrom;for(a.mixingFrom=null,null!=h&&(h.mixingTo=null);null!=h;)this.queue.end(h),h=h.mixingFrom}a.trackTime+=i}}this.queue.drain()},e.prototype.updateMixingFrom=function(t,e){var n=t.mixingFrom;if(null==n)return!0;var r=this.updateMixingFrom(n,e);return n.animationLast=n.nextAnimationLast,n.trackLast=n.nextTrackLast,t.mixTime>0&&t.mixTime>=t.mixDuration?(0!=n.totalAlpha&&0!=t.mixDuration||(t.mixingFrom=n.mixingFrom,null!=n.mixingFrom&&(n.mixingFrom.mixingTo=t),t.interruptAlpha=n.interruptAlpha,this.queue.end(n)),r):(n.trackTime+=e*n.timeScale,t.mixTime+=e,!1)},e.prototype.apply=function(n){if(null==n)throw new Error("skeleton cannot be null.");this.animationsChanged&&this._animationsChanged();for(var r=this.events,a=this.tracks,i=!1,o=0,s=a.length;o<s;o++){var h=a[o];if(!(null==h||h.delay>0)){i=!0;var l=0==o?t.MixBlend.first:h.mixBlend,u=h.alpha;null!=h.mixingFrom?u*=this.applyMixingFrom(h,n,l):h.trackTime>=h.trackEnd&&null==h.next&&(u=0);var c=h.animationLast,f=h.getAnimationTime(),d=h.animation.timelines.length,p=h.animation.timelines;if(0==o&&1==u||l==t.MixBlend.add)for(var m=0;m<d;m++){t.Utils.webkit602BugfixHelper(u,l);var v=p[m];v instanceof t.AttachmentTimeline?this.applyAttachmentTimeline(v,n,f,l,!0):v.apply(n,c,f,r,u,l,t.MixDirection.mixIn)}else{var g=h.timelineMode,y=0==h.timelinesRotation.length;y&&t.Utils.setArraySize(h.timelinesRotation,d<<1,null);var E=h.timelinesRotation;for(m=0;m<d;m++){var w=p[m],x=g[m]==e.SUBSEQUENT?l:t.MixBlend.setup;w instanceof t.RotateTimeline?this.applyRotateTimeline(w,n,f,u,x,E,m<<1,y):w instanceof t.AttachmentTimeline?this.applyAttachmentTimeline(w,n,f,l,!0):(t.Utils.webkit602BugfixHelper(u,l),w.apply(n,c,f,r,u,x,t.MixDirection.mixIn))}}this.queueEvents(h,f),r.length=0,h.nextAnimationLast=f,h.nextTrackLast=h.trackTime}}for(var T=this.unkeyedState+e.SETUP,A=n.slots,M=0,I=n.slots.length;M<I;M++){var b=A[M];if(b.attachmentState==T){var R=b.data.attachmentName;b.setAttachment(null==R?null:n.getAttachment(b.data.index,R))}}return this.unkeyedState+=2,this.queue.drain(),i},e.prototype.applyMixingFrom=function(n,r,a){var i=n.mixingFrom;null!=i.mixingFrom&&this.applyMixingFrom(i,r,a);var o=0;0==n.mixDuration?(o=1,a==t.MixBlend.first&&(a=t.MixBlend.setup)):((o=n.mixTime/n.mixDuration)>1&&(o=1),a!=t.MixBlend.first&&(a=i.mixBlend));var s=o<i.eventThreshold?this.events:null,h=o<i.attachmentThreshold,l=o<i.drawOrderThreshold,u=i.animationLast,c=i.getAnimationTime(),f=i.animation.timelines.length,d=i.animation.timelines,p=i.alpha*n.interruptAlpha,m=p*(1-o);if(a==t.MixBlend.add)for(var v=0;v<f;v++)d[v].apply(r,u,c,s,m,a,t.MixDirection.mixOut);else{var g=i.timelineMode,y=i.timelineHoldMix,E=0==i.timelinesRotation.length;E&&t.Utils.setArraySize(i.timelinesRotation,f<<1,null);var w=i.timelinesRotation;i.totalAlpha=0;for(v=0;v<f;v++){var x=d[v],T=t.MixDirection.mixOut,A=void 0,M=0;switch(g[v]){case e.SUBSEQUENT:if(!l&&x instanceof t.DrawOrderTimeline)continue;A=a,M=m;break;case e.FIRST:A=t.MixBlend.setup,M=m;break;case e.HOLD_SUBSEQUENT:A=a,M=p;break;case e.HOLD_FIRST:A=t.MixBlend.setup,M=p;break;default:A=t.MixBlend.setup;var I=y[v];M=p*Math.max(0,1-I.mixTime/I.mixDuration)}i.totalAlpha+=M,x instanceof t.RotateTimeline?this.applyRotateTimeline(x,r,c,M,A,w,v<<1,E):x instanceof t.AttachmentTimeline?this.applyAttachmentTimeline(x,r,c,A,h):(t.Utils.webkit602BugfixHelper(M,a),l&&x instanceof t.DrawOrderTimeline&&A==t.MixBlend.setup&&(T=t.MixDirection.mixIn),x.apply(r,u,c,s,M,A,T))}}return n.mixDuration>0&&this.queueEvents(i,c),this.events.length=0,i.nextAnimationLast=c,i.nextTrackLast=i.trackTime,o},e.prototype.applyAttachmentTimeline=function(n,r,a,i,o){var s=r.slots[n.slotIndex];if(s.bone.active){var h,l=n.frames;if(a<l[0])i!=t.MixBlend.setup&&i!=t.MixBlend.first||this.setAttachment(r,s,s.data.attachmentName,o);else h=a>=l[l.length-1]?l.length-1:t.Animation.binarySearch(l,a)-1,this.setAttachment(r,s,n.attachmentNames[h],o);s.attachmentState<=this.unkeyedState&&(s.attachmentState=this.unkeyedState+e.SETUP)}},e.prototype.setAttachment=function(t,n,r,a){n.setAttachment(null==r?null:t.getAttachment(n.data.index,r)),a&&(n.attachmentState=this.unkeyedState+e.CURRENT)},e.prototype.applyRotateTimeline=function(e,n,r,a,i,o,s,h){if(h&&(o[s]=0),1!=a){var l=e,u=l.frames,c=n.bones[l.boneIndex];if(c.active){var f=0,d=0;if(r<u[0])switch(i){case t.MixBlend.setup:c.rotation=c.data.rotation;default:return;case t.MixBlend.first:f=c.rotation,d=c.data.rotation}else if(f=i==t.MixBlend.setup?c.data.rotation:c.rotation,r>=u[u.length-t.RotateTimeline.ENTRIES])d=c.data.rotation+u[u.length+t.RotateTimeline.PREV_ROTATION];else{var p=t.Animation.binarySearch(u,r,t.RotateTimeline.ENTRIES),m=u[p+t.RotateTimeline.PREV_ROTATION],v=u[p],g=l.getCurvePercent((p>>1)-1,1-(r-v)/(u[p+t.RotateTimeline.PREV_TIME]-v));d=u[p+t.RotateTimeline.ROTATION]-m,d=m+(d-=360*(16384-(16384.499999999996-d/360|0)))*g+c.data.rotation,d-=360*(16384-(16384.499999999996-d/360|0))}var y=0,E=d-f;if(0==(E-=360*(16384-(16384.499999999996-E/360|0))))y=o[s];else{var w=0,x=0;h?(w=0,x=E):(w=o[s],x=o[s+1]);var T=E>0,A=w>=0;t.MathUtils.signum(x)!=t.MathUtils.signum(E)&&Math.abs(x)<=90&&(Math.abs(w)>180&&(w+=360*t.MathUtils.signum(w)),A=T),y=E+w-w%360,A!=T&&(y+=360*t.MathUtils.signum(w)),o[s]=y}o[s+1]=E,f+=y*a,c.rotation=f-360*(16384-(16384.499999999996-f/360|0))}}else e.apply(n,0,r,null,1,i,t.MixDirection.mixIn)},e.prototype.queueEvents=function(t,e){for(var n=t.animationStart,r=t.animationEnd,a=r-n,i=t.trackLast%a,o=this.events,s=0,h=o.length;s<h;s++){var l=o[s];if(l.time<i)break;l.time>r||this.queue.event(t,l)}for((t.loop?0==a||i>t.trackTime%a:e>=r&&t.animationLast<r)&&this.queue.complete(t);s<h;s++){o[s].time<n||this.queue.event(t,o[s])}},e.prototype.clearTracks=function(){var t=this.queue.drainDisabled;this.queue.drainDisabled=!0;for(var e=0,n=this.tracks.length;e<n;e++)this.clearTrack(e);this.tracks.length=0,this.queue.drainDisabled=t,this.queue.drain()},e.prototype.clearTrack=function(t){if(!(t>=this.tracks.length)){var e=this.tracks[t];if(null!=e){this.queue.end(e),this.disposeNext(e);for(var n=e;;){var r=n.mixingFrom;if(null==r)break;this.queue.end(r),n.mixingFrom=null,n.mixingTo=null,n=r}this.tracks[e.trackIndex]=null,this.queue.drain()}}},e.prototype.setCurrent=function(t,e,n){var r=this.expandToIndex(t);this.tracks[t]=e,null!=r&&(n&&this.queue.interrupt(r),e.mixingFrom=r,r.mixingTo=e,e.mixTime=0,null!=r.mixingFrom&&r.mixDuration>0&&(e.interruptAlpha*=Math.min(1,r.mixTime/r.mixDuration)),r.timelinesRotation.length=0),this.queue.start(e)},e.prototype.setAnimation=function(t,e,n){var r=this.data.skeletonData.findAnimation(e);if(null==r)throw new Error("Animation not found: "+e);return this.setAnimationWith(t,r,n)},e.prototype.setAnimationWith=function(t,e,n){if(null==e)throw new Error("animation cannot be null.");var r=!0,a=this.expandToIndex(t);null!=a&&(-1==a.nextTrackLast?(this.tracks[t]=a.mixingFrom,this.queue.interrupt(a),this.queue.end(a),this.disposeNext(a),a=a.mixingFrom,r=!1):this.disposeNext(a));var i=this.trackEntry(t,e,n,a);return this.setCurrent(t,i,r),this.queue.drain(),i},e.prototype.addAnimation=function(t,e,n,r){var a=this.data.skeletonData.findAnimation(e);if(null==a)throw new Error("Animation not found: "+e);return this.addAnimationWith(t,a,n,r)},e.prototype.addAnimationWith=function(t,e,n,r){if(null==e)throw new Error("animation cannot be null.");var a=this.expandToIndex(t);if(null!=a)for(;null!=a.next;)a=a.next;var i=this.trackEntry(t,e,n,a);if(null==a)this.setCurrent(t,i,!0),this.queue.drain();else if(a.next=i,r<=0){var o=a.animationEnd-a.animationStart;0!=o?(a.loop?r+=o*(1+(a.trackTime/o|0)):r+=Math.max(o,a.trackTime),r-=this.data.getMix(a.animation,e)):r=a.trackTime}return i.delay=r,i},e.prototype.setEmptyAnimation=function(t,n){var r=this.setAnimationWith(t,e.emptyAnimation,!1);return r.mixDuration=n,r.trackEnd=n,r},e.prototype.addEmptyAnimation=function(t,n,r){r<=0&&(r-=n);var a=this.addAnimationWith(t,e.emptyAnimation,!1,r);return a.mixDuration=n,a.trackEnd=n,a},e.prototype.setEmptyAnimations=function(t){var e=this.queue.drainDisabled;this.queue.drainDisabled=!0;for(var n=0,r=this.tracks.length;n<r;n++){var a=this.tracks[n];null!=a&&this.setEmptyAnimation(a.trackIndex,t)}this.queue.drainDisabled=e,this.queue.drain()},e.prototype.expandToIndex=function(e){return e<this.tracks.length?this.tracks[e]:(t.Utils.ensureArrayCapacity(this.tracks,e+1,null),this.tracks.length=e+1,null)},e.prototype.trackEntry=function(e,n,r,a){var i=this.trackEntryPool.obtain();return i.trackIndex=e,i.animation=n,i.loop=r,i.holdPrevious=!1,i.eventThreshold=0,i.attachmentThreshold=0,i.drawOrderThreshold=0,i.animationStart=0,i.animationEnd=n.duration,i.animationLast=-1,i.nextAnimationLast=-1,i.delay=0,i.trackTime=0,i.trackLast=-1,i.nextTrackLast=-1,i.trackEnd=Number.MAX_VALUE,i.timeScale=1,i.alpha=1,i.interruptAlpha=1,i.mixTime=0,i.mixDuration=null==a?0:this.data.getMix(a.animation,n),i.mixBlend=t.MixBlend.replace,i},e.prototype.disposeNext=function(t){for(var e=t.next;null!=e;)this.queue.dispose(e),e=e.next;t.next=null},e.prototype._animationsChanged=function(){this.animationsChanged=!1,this.propertyIDs.clear();for(var e=0,n=this.tracks.length;e<n;e++){var r=this.tracks[e];if(null!=r){for(;null!=r.mixingFrom;)r=r.mixingFrom;do{null!=r.mixingFrom&&r.mixBlend==t.MixBlend.add||this.computeHold(r),r=r.mixingTo}while(null!=r)}}},e.prototype.computeHold=function(n){var r=n.mixingTo,a=n.animation.timelines,i=n.animation.timelines.length,o=t.Utils.setArraySize(n.timelineMode,i);n.timelineHoldMix.length=0;var s=t.Utils.setArraySize(n.timelineHoldMix,i),h=this.propertyIDs;if(null!=r&&r.holdPrevious)for(var l=0;l<i;l++)o[l]=h.add(a[l].getPropertyId())?e.HOLD_FIRST:e.HOLD_SUBSEQUENT;else t:for(l=0;l<i;l++){var u=a[l],c=u.getPropertyId();if(h.add(c))if(null==r||u instanceof t.AttachmentTimeline||u instanceof t.DrawOrderTimeline||u instanceof t.EventTimeline||!r.animation.hasTimeline(c))o[l]=e.FIRST;else{for(var f=r.mixingTo;null!=f;f=f.mixingTo)if(!f.animation.hasTimeline(c)){if(n.mixDuration>0){o[l]=e.HOLD_MIX,s[l]=f;continue t}break}o[l]=e.HOLD_FIRST}else o[l]=e.SUBSEQUENT}},e.prototype.getCurrent=function(t){return t>=this.tracks.length?null:this.tracks[t]},e.prototype.addListener=function(t){if(null==t)throw new Error("listener cannot be null.");this.listeners.push(t)},e.prototype.removeListener=function(t){var e=this.listeners.indexOf(t);e>=0&&this.listeners.splice(e,1)},e.prototype.clearListeners=function(){this.listeners.length=0},e.prototype.clearListenerNotifications=function(){this.queue.clear()},e.emptyAnimation=new t.Animation("<empty>",[],0),e.SUBSEQUENT=0,e.FIRST=1,e.HOLD_SUBSEQUENT=2,e.HOLD_FIRST=3,e.HOLD_MIX=4,e.SETUP=1,e.CURRENT=2,e}();t.AnimationState=e;var n=function(){function e(){this.mixBlend=t.MixBlend.replace,this.timelineMode=new Array,this.timelineHoldMix=new Array,this.timelinesRotation=new Array}return e.prototype.reset=function(){this.next=null,this.mixingFrom=null,this.mixingTo=null,this.animation=null,this.listener=null,this.timelineMode.length=0,this.timelineHoldMix.length=0,this.timelinesRotation.length=0},e.prototype.getAnimationTime=function(){if(this.loop){var t=this.animationEnd-this.animationStart;return 0==t?this.animationStart:this.trackTime%t+this.animationStart}return Math.min(this.trackTime+this.animationStart,this.animationEnd)},e.prototype.setAnimationLast=function(t){this.animationLast=t,this.nextAnimationLast=t},e.prototype.isComplete=function(){return this.trackTime>=this.animationEnd-this.animationStart},e.prototype.resetRotationDirections=function(){this.timelinesRotation.length=0},e}();t.TrackEntry=n;var r,a=function(){function t(t){this.objects=[],this.drainDisabled=!1,this.animState=t}return t.prototype.start=function(t){this.objects.push(r.start),this.objects.push(t),this.animState.animationsChanged=!0},t.prototype.interrupt=function(t){this.objects.push(r.interrupt),this.objects.push(t)},t.prototype.end=function(t){this.objects.push(r.end),this.objects.push(t),this.animState.animationsChanged=!0},t.prototype.dispose=function(t){this.objects.push(r.dispose),this.objects.push(t)},t.prototype.complete=function(t){this.objects.push(r.complete),this.objects.push(t)},t.prototype.event=function(t,e){this.objects.push(r.event),this.objects.push(t),this.objects.push(e)},t.prototype.drain=function(){if(!this.drainDisabled){this.drainDisabled=!0;for(var t=this.objects,e=this.animState.listeners,n=0;n<t.length;n+=2){var a=t[n],i=t[n+1];switch(a){case r.start:null!=i.listener&&i.listener.start&&i.listener.start(i);for(var o=0;o<e.length;o++)e[o].start&&e[o].start(i);break;case r.interrupt:null!=i.listener&&i.listener.interrupt&&i.listener.interrupt(i);for(o=0;o<e.length;o++)e[o].interrupt&&e[o].interrupt(i);break;case r.end:null!=i.listener&&i.listener.end&&i.listener.end(i);for(o=0;o<e.length;o++)e[o].end&&e[o].end(i);case r.dispose:null!=i.listener&&i.listener.dispose&&i.listener.dispose(i);for(o=0;o<e.length;o++)e[o].dispose&&e[o].dispose(i);this.animState.trackEntryPool.free(i);break;case r.complete:null!=i.listener&&i.listener.complete&&i.listener.complete(i);for(o=0;o<e.length;o++)e[o].complete&&e[o].complete(i);break;case r.event:var s=t[2+n++];null!=i.listener&&i.listener.event&&i.listener.event(i,s);for(o=0;o<e.length;o++)e[o].event&&e[o].event(i,s)}}this.clear(),this.drainDisabled=!1}},t.prototype.clear=function(){this.objects.length=0},t}();t.EventQueue=a,function(t){t[t.start=0]="start",t[t.interrupt=1]="interrupt",t[t.end=2]="end",t[t.dispose=3]="dispose",t[t.complete=4]="complete",t[t.event=5]="event"}(r=t.EventType||(t.EventType={}));var i=function(){function t(){}return t.prototype.start=function(t){},t.prototype.interrupt=function(t){},t.prototype.end=function(t){},t.prototype.dispose=function(t){},t.prototype.complete=function(t){},t.prototype.event=function(t,e){},t}();t.AnimationStateAdapter=i}(a||(a={})),function(t){var e=function(){function t(t){if(this.animationToMixTime={},this.defaultMix=0,null==t)throw new Error("skeletonData cannot be null.");this.skeletonData=t}return t.prototype.setMix=function(t,e,n){var r=this.skeletonData.findAnimation(t);if(null==r)throw new Error("Animation not found: "+t);var a=this.skeletonData.findAnimation(e);if(null==a)throw new Error("Animation not found: "+e);this.setMixWith(r,a,n)},t.prototype.setMixWith=function(t,e,n){if(null==t)throw new Error("from cannot be null.");if(null==e)throw new Error("to cannot be null.");var r=t.name+"."+e.name;this.animationToMixTime[r]=n},t.prototype.getMix=function(t,e){var n=t.name+"."+e.name,r=this.animationToMixTime[n];return void 0===r?this.defaultMix:r},t}();t.AnimationStateData=e}(a||(a={})),function(t){var e=function(){function e(t,e){void 0===e&&(e=""),this.assets={},this.errors={},this.toLoad=0,this.loaded=0,this.rawDataUris={},this.textureLoader=t,this.pathPrefix=e}return e.prototype.downloadText=function(t,e,n){var r=new XMLHttpRequest;r.overrideMimeType("text/html"),this.rawDataUris[t]&&(t=this.rawDataUris[t]),r.open("GET",t,!0),r.onload=function(){200==r.status?e(r.responseText):n(r.status,r.responseText)},r.onerror=function(){n(r.status,r.responseText)},r.send()},e.prototype.downloadBinary=function(t,e,n){var r=new XMLHttpRequest;this.rawDataUris[t]&&(t=this.rawDataUris[t]),r.open("GET",t,!0),r.responseType="arraybuffer",r.onload=function(){200==r.status?e(new Uint8Array(r.response)):n(r.status,r.responseText)},r.onerror=function(){n(r.status,r.responseText)},r.send()},e.prototype.setRawDataURI=function(t,e){this.rawDataUris[this.pathPrefix+t]=e},e.prototype.loadBinary=function(t,e,n){var r=this;void 0===e&&(e=null),void 0===n&&(n=null),t=this.pathPrefix+t,this.toLoad++,this.downloadBinary(t,(function(n){r.assets[t]=n,e&&e(t,n),r.toLoad--,r.loaded++}),(function(e,a){r.errors[t]="Couldn't load binary "+t+": status "+status+", "+a,n&&n(t,"Couldn't load binary "+t+": status "+status+", "+a),r.toLoad--,r.loaded++}))},e.prototype.loadText=function(t,e,n){var r=this;void 0===e&&(e=null),void 0===n&&(n=null),t=this.pathPrefix+t,this.toLoad++,this.downloadText(t,(function(n){r.assets[t]=n,e&&e(t,n),r.toLoad--,r.loaded++}),(function(e,a){r.errors[t]="Couldn't load text "+t+": status "+status+", "+a,n&&n(t,"Couldn't load text "+t+": status "+status+", "+a),r.toLoad--,r.loaded++}))},e.prototype.loadTexture=function(t,e,n){var r=this;void 0===e&&(e=null),void 0===n&&(n=null);var a=t=this.pathPrefix+t;this.toLoad++;var i=new Image;i.crossOrigin="anonymous",i.onload=function(n){var o=r.textureLoader(i);r.assets[a]=o,r.toLoad--,r.loaded++,e&&e(t,i)},i.onerror=function(e){r.errors[t]="Couldn't load image "+t,r.toLoad--,r.loaded++,n&&n(t,"Couldn't load image "+t)},this.rawDataUris[t]&&(t=this.rawDataUris[t]),i.src=t},e.prototype.loadTextureAtlas=function(e,n,r){var a=this;void 0===n&&(n=null),void 0===r&&(r=null);var i=e.lastIndexOf("/")>=0?e.substring(0,e.lastIndexOf("/")):"";e=this.pathPrefix+e,this.toLoad++,this.downloadText(e,(function(o){var s={count:0},h=new Array;try{new t.TextureAtlas(o,(function(e){h.push(""==i?e:i+"/"+e);var n=document.createElement("img");return n.width=16,n.height=16,new t.FakeTexture(n)}))}catch(t){var l=t;return a.errors[e]="Couldn't load texture atlas "+e+": "+l.message,r&&r(e,"Couldn't load texture atlas "+e+": "+l.message),a.toLoad--,void a.loaded++}for(var u=function(l){var u=!1;a.loadTexture(l,(function(l,c){if(s.count++,s.count==h.length)if(u)a.errors[e]="Couldn't load texture atlas page "+l+"} of atlas "+e,r&&r(e,"Couldn't load texture atlas page "+l+" of atlas "+e),a.toLoad--,a.loaded++;else try{var f=new t.TextureAtlas(o,(function(t){return a.get(""==i?t:i+"/"+t)}));a.assets[e]=f,n&&n(e,f),a.toLoad--,a.loaded++}catch(t){var d=t;a.errors[e]="Couldn't load texture atlas "+e+": "+d.message,r&&r(e,"Couldn't load texture atlas "+e+": "+d.message),a.toLoad--,a.loaded++}}),(function(t,n){u=!0,s.count++,s.count==h.length&&(a.errors[e]="Couldn't load texture atlas page "+t+"} of atlas "+e,r&&r(e,"Couldn't load texture atlas page "+t+" of atlas "+e),a.toLoad--,a.loaded++)}))},c=0,f=h;c<f.length;c++){u(f[c])}}),(function(t,n){a.errors[e]="Couldn't load texture atlas "+e+": status "+status+", "+n,r&&r(e,"Couldn't load texture atlas "+e+": status "+status+", "+n),a.toLoad--,a.loaded++}))},e.prototype.get=function(t){return t=this.pathPrefix+t,this.assets[t]},e.prototype.remove=function(t){t=this.pathPrefix+t;var e=this.assets[t];e.dispose&&e.dispose(),this.assets[t]=null},e.prototype.removeAll=function(){for(var t in this.assets){var e=this.assets[t];e.dispose&&e.dispose()}this.assets={}},e.prototype.isLoadingComplete=function(){return 0==this.toLoad},e.prototype.getToLoad=function(){return this.toLoad},e.prototype.getLoaded=function(){return this.loaded},e.prototype.dispose=function(){this.removeAll()},e.prototype.hasErrors=function(){return Object.keys(this.errors).length>0},e.prototype.getErrors=function(){return this.errors},e}();t.AssetManager=e}(a||(a={})),function(t){var e=function(){function e(t){this.atlas=t}return e.prototype.newRegionAttachment=function(e,n,r){var a=this.atlas.findRegion(r);if(null==a)throw new Error("Region not found in atlas: "+r+" (region attachment: "+n+")");a.renderObject=a;var i=new t.RegionAttachment(n);return i.setRegion(a),i},e.prototype.newMeshAttachment=function(e,n,r){var a=this.atlas.findRegion(r);if(null==a)throw new Error("Region not found in atlas: "+r+" (mesh attachment: "+n+")");a.renderObject=a;var i=new t.MeshAttachment(n);return i.region=a,i},e.prototype.newBoundingBoxAttachment=function(e,n){return new t.BoundingBoxAttachment(n)},e.prototype.newPathAttachment=function(e,n){return new t.PathAttachment(n)},e.prototype.newPointAttachment=function(e,n){return new t.PointAttachment(n)},e.prototype.newClippingAttachment=function(e,n){return new t.ClippingAttachment(n)},e}();t.AtlasAttachmentLoader=e}(a||(a={})),function(t){var e;(e=t.BlendMode||(t.BlendMode={}))[e.Normal=0]="Normal",e[e.Additive=1]="Additive",e[e.Multiply=2]="Multiply",e[e.Screen=3]="Screen"}(a||(a={})),function(t){var e=function(){function e(t,e,n){if(this.children=new Array,this.x=0,this.y=0,this.rotation=0,this.scaleX=0,this.scaleY=0,this.shearX=0,this.shearY=0,this.ax=0,this.ay=0,this.arotation=0,this.ascaleX=0,this.ascaleY=0,this.ashearX=0,this.ashearY=0,this.appliedValid=!1,this.a=0,this.b=0,this.c=0,this.d=0,this.worldY=0,this.worldX=0,this.sorted=!1,this.active=!1,null==t)throw new Error("data cannot be null.");if(null==e)throw new Error("skeleton cannot be null.");this.data=t,this.skeleton=e,this.parent=n,this.setToSetupPose()}return e.prototype.isActive=function(){return this.active},e.prototype.update=function(){this.updateWorldTransformWith(this.x,this.y,this.rotation,this.scaleX,this.scaleY,this.shearX,this.shearY)},e.prototype.updateWorldTransform=function(){this.updateWorldTransformWith(this.x,this.y,this.rotation,this.scaleX,this.scaleY,this.shearX,this.shearY)},e.prototype.updateWorldTransformWith=function(e,n,r,a,i,o,s){this.ax=e,this.ay=n,this.arotation=r,this.ascaleX=a,this.ascaleY=i,this.ashearX=o,this.ashearY=s,this.appliedValid=!0;var h=this.parent;if(null==h){var l=this.skeleton,u=r+90+s,c=l.scaleX,f=l.scaleY;return this.a=t.MathUtils.cosDeg(r+o)*a*c,this.b=t.MathUtils.cosDeg(u)*i*c,this.c=t.MathUtils.sinDeg(r+o)*a*f,this.d=t.MathUtils.sinDeg(u)*i*f,this.worldX=e*c+l.x,void(this.worldY=n*f+l.y)}var d=h.a,p=h.b,m=h.c,v=h.d;switch(this.worldX=d*e+p*n+h.worldX,this.worldY=m*e+v*n+h.worldY,this.data.transformMode){case t.TransformMode.Normal:u=r+90+s;var g=t.MathUtils.cosDeg(r+o)*a,y=t.MathUtils.cosDeg(u)*i,E=t.MathUtils.sinDeg(r+o)*a,w=t.MathUtils.sinDeg(u)*i;return this.a=d*g+p*E,this.b=d*y+p*w,this.c=m*g+v*E,void(this.d=m*y+v*w);case t.TransformMode.OnlyTranslation:u=r+90+s;this.a=t.MathUtils.cosDeg(r+o)*a,this.b=t.MathUtils.cosDeg(u)*i,this.c=t.MathUtils.sinDeg(r+o)*a,this.d=t.MathUtils.sinDeg(u)*i;break;case t.TransformMode.NoRotationOrReflection:var x=0;(M=d*d+m*m)>1e-4?(M=Math.abs(d*v-p*m)/M,d/=this.skeleton.scaleX,p=(m/=this.skeleton.scaleY)*M,v=d*M,x=Math.atan2(m,d)*t.MathUtils.radDeg):(d=0,m=0,x=90-Math.atan2(v,p)*t.MathUtils.radDeg);var T=r+o-x,A=r+s-x+90;g=t.MathUtils.cosDeg(T)*a,y=t.MathUtils.cosDeg(A)*i,E=t.MathUtils.sinDeg(T)*a,w=t.MathUtils.sinDeg(A)*i;this.a=d*g-p*E,this.b=d*y-p*w,this.c=m*g+v*E,this.d=m*y+v*w;break;case t.TransformMode.NoScale:case t.TransformMode.NoScaleOrReflection:var M,I=t.MathUtils.cosDeg(r),b=t.MathUtils.sinDeg(r),R=(d*I+p*b)/this.skeleton.scaleX,S=(m*I+v*b)/this.skeleton.scaleY;(M=Math.sqrt(R*R+S*S))>1e-5&&(M=1/M),R*=M,S*=M,M=Math.sqrt(R*R+S*S),this.data.transformMode==t.TransformMode.NoScale&&d*v-p*m<0!=(this.skeleton.scaleX<0!=this.skeleton.scaleY<0)&&(M=-M);var C=Math.PI/2+Math.atan2(S,R),P=Math.cos(C)*M,k=Math.sin(C)*M;g=t.MathUtils.cosDeg(o)*a,y=t.MathUtils.cosDeg(90+s)*i,E=t.MathUtils.sinDeg(o)*a,w=t.MathUtils.sinDeg(90+s)*i;this.a=R*g+P*E,this.b=R*y+P*w,this.c=S*g+k*E,this.d=S*y+k*w}this.a*=this.skeleton.scaleX,this.b*=this.skeleton.scaleX,this.c*=this.skeleton.scaleY,this.d*=this.skeleton.scaleY},e.prototype.setToSetupPose=function(){var t=this.data;this.x=t.x,this.y=t.y,this.rotation=t.rotation,this.scaleX=t.scaleX,this.scaleY=t.scaleY,this.shearX=t.shearX,this.shearY=t.shearY},e.prototype.getWorldRotationX=function(){return Math.atan2(this.c,this.a)*t.MathUtils.radDeg},e.prototype.getWorldRotationY=function(){return Math.atan2(this.d,this.b)*t.MathUtils.radDeg},e.prototype.getWorldScaleX=function(){return Math.sqrt(this.a*this.a+this.c*this.c)},e.prototype.getWorldScaleY=function(){return Math.sqrt(this.b*this.b+this.d*this.d)},e.prototype.updateAppliedTransform=function(){this.appliedValid=!0;var e=this.parent;if(null==e)return this.ax=this.worldX,this.ay=this.worldY,this.arotation=Math.atan2(this.c,this.a)*t.MathUtils.radDeg,this.ascaleX=Math.sqrt(this.a*this.a+this.c*this.c),this.ascaleY=Math.sqrt(this.b*this.b+this.d*this.d),this.ashearX=0,void(this.ashearY=Math.atan2(this.a*this.b+this.c*this.d,this.a*this.d-this.b*this.c)*t.MathUtils.radDeg);var n=e.a,r=e.b,a=e.c,i=e.d,o=1/(n*i-r*a),s=this.worldX-e.worldX,h=this.worldY-e.worldY;this.ax=s*i*o-h*r*o,this.ay=h*n*o-s*a*o;var l=o*i,u=o*n,c=o*r,f=o*a,d=l*this.a-c*this.c,p=l*this.b-c*this.d,m=u*this.c-f*this.a,v=u*this.d-f*this.b;if(this.ashearX=0,this.ascaleX=Math.sqrt(d*d+m*m),this.ascaleX>1e-4){var g=d*v-p*m;this.ascaleY=g/this.ascaleX,this.ashearY=Math.atan2(d*p+m*v,g)*t.MathUtils.radDeg,this.arotation=Math.atan2(m,d)*t.MathUtils.radDeg}else this.ascaleX=0,this.ascaleY=Math.sqrt(p*p+v*v),this.ashearY=0,this.arotation=90-Math.atan2(v,p)*t.MathUtils.radDeg},e.prototype.worldToLocal=function(t){var e=this.a,n=this.b,r=this.c,a=this.d,i=1/(e*a-n*r),o=t.x-this.worldX,s=t.y-this.worldY;return t.x=o*a*i-s*n*i,t.y=s*e*i-o*r*i,t},e.prototype.localToWorld=function(t){var e=t.x,n=t.y;return t.x=e*this.a+n*this.b+this.worldX,t.y=e*this.c+n*this.d+this.worldY,t},e.prototype.worldToLocalRotation=function(e){var n=t.MathUtils.sinDeg(e),r=t.MathUtils.cosDeg(e);return Math.atan2(this.a*n-this.c*r,this.d*r-this.b*n)*t.MathUtils.radDeg+this.rotation-this.shearX},e.prototype.localToWorldRotation=function(e){e-=this.rotation-this.shearX;var n=t.MathUtils.sinDeg(e),r=t.MathUtils.cosDeg(e);return Math.atan2(r*this.c+n*this.d,r*this.a+n*this.b)*t.MathUtils.radDeg},e.prototype.rotateWorld=function(e){var n=this.a,r=this.b,a=this.c,i=this.d,o=t.MathUtils.cosDeg(e),s=t.MathUtils.sinDeg(e);this.a=o*n-s*a,this.b=o*r-s*i,this.c=s*n+o*a,this.d=s*r+o*i,this.appliedValid=!1},e}();t.Bone=e}(a||(a={})),function(t){var e,n=function(n,r,a){if(this.x=0,this.y=0,this.rotation=0,this.scaleX=1,this.scaleY=1,this.shearX=0,this.shearY=0,this.transformMode=e.Normal,this.skinRequired=!1,this.color=new t.Color,n<0)throw new Error("index must be >= 0.");if(null==r)throw new Error("name cannot be null.");this.index=n,this.name=r,this.parent=a};t.BoneData=n,function(t){t[t.Normal=0]="Normal",t[t.OnlyTranslation=1]="OnlyTranslation",t[t.NoRotationOrReflection=2]="NoRotationOrReflection",t[t.NoScale=3]="NoScale",t[t.NoScaleOrReflection=4]="NoScaleOrReflection"}(e=t.TransformMode||(t.TransformMode={}))}(a||(a={})),function(t){var e=function(t,e,n){this.name=t,this.order=e,this.skinRequired=n};t.ConstraintData=e}(a||(a={})),function(t){var e=function(t,e){if(null==e)throw new Error("data cannot be null.");this.time=t,this.data=e};t.Event=e}(a||(a={})),function(t){var e=function(t){this.name=t};t.EventData=e}(a||(a={})),function(t){var e=function(){function e(t,e){if(this.bendDirection=0,this.compress=!1,this.stretch=!1,this.mix=1,this.softness=0,this.active=!1,null==t)throw new Error("data cannot be null.");if(null==e)throw new Error("skeleton cannot be null.");this.data=t,this.mix=t.mix,this.softness=t.softness,this.bendDirection=t.bendDirection,this.compress=t.compress,this.stretch=t.stretch,this.bones=new Array;for(var n=0;n<t.bones.length;n++)this.bones.push(e.findBone(t.bones[n].name));this.target=e.findBone(t.target.name)}return e.prototype.isActive=function(){return this.active},e.prototype.apply=function(){this.update()},e.prototype.update=function(){var t=this.target,e=this.bones;switch(e.length){case 1:this.apply1(e[0],t.worldX,t.worldY,this.compress,this.stretch,this.data.uniform,this.mix);break;case 2:this.apply2(e[0],e[1],t.worldX,t.worldY,this.bendDirection,this.stretch,this.softness,this.mix)}},e.prototype.apply1=function(e,n,r,a,i,o,s){e.appliedValid||e.updateAppliedTransform();var h=e.parent,l=h.a,u=h.b,c=h.c,f=h.d,d=-e.ashearX-e.arotation,p=0,m=0;switch(e.data.transformMode){case t.TransformMode.OnlyTranslation:p=n-e.worldX,m=r-e.worldY;break;case t.TransformMode.NoRotationOrReflection:var v=Math.abs(l*f-u*c)/(l*l+c*c),g=l/e.skeleton.scaleX,y=c/e.skeleton.scaleY;u=-y*v*e.skeleton.scaleX,f=g*v*e.skeleton.scaleY,d+=Math.atan2(y,g)*t.MathUtils.radDeg;default:var E=n-h.worldX,w=r-h.worldY,x=l*f-u*c;p=(E*f-w*u)/x-e.ax,m=(w*l-E*c)/x-e.ay}d+=Math.atan2(m,p)*t.MathUtils.radDeg,e.ascaleX<0&&(d+=180),d>180?d-=360:d<-180&&(d+=360);var T=e.ascaleX,A=e.ascaleY;if(a||i){switch(e.data.transformMode){case t.TransformMode.NoScale:case t.TransformMode.NoScaleOrReflection:p=n-e.worldX,m=r-e.worldY}var M=e.data.length*T,I=Math.sqrt(p*p+m*m);if(a&&I<M||i&&I>M&&M>1e-4)T*=v=(I/M-1)*s+1,o&&(A*=v)}e.updateWorldTransformWith(e.ax,e.ay,e.arotation+d*s,T,A,e.ashearX,e.ashearY)},e.prototype.apply2=function(e,n,r,a,i,o,s,h){if(0!=h){e.appliedValid||e.updateAppliedTransform(),n.appliedValid||n.updateAppliedTransform();var l=e.ax,u=e.ay,c=e.ascaleX,f=c,d=e.ascaleY,p=n.ascaleX,m=0,v=0,g=0;c<0?(c=-c,m=180,g=-1):(m=0,g=1),d<0&&(d=-d,g=-g),p<0?(p=-p,v=180):v=0;var y=n.ax,E=0,w=0,x=0,T=e.a,A=e.b,M=e.c,I=e.d,b=Math.abs(c-d)<=1e-4;b?(w=T*y+A*(E=n.ay)+e.worldX,x=M*y+I*E+e.worldY):(E=0,w=T*y+e.worldX,x=M*y+e.worldY);var R=e.parent;T=R.a,A=R.b,M=R.c;var S,C,P=1/(T*(I=R.d)-A*M),k=w-R.worldX,N=x-R.worldY,_=(k*I-N*A)*P-l,V=(N*T-k*M)*P-u,L=Math.sqrt(_*_+V*V),O=n.data.length*p;if(L<1e-4)return this.apply1(e,r,a,!1,o,!1,h),void n.updateWorldTransformWith(y,E,0,n.ascaleX,n.ascaleY,n.ashearX,n.ashearY);var F=((k=r-R.worldX)*I-(N=a-R.worldY)*A)*P-l,D=(N*T-k*M)*P-u,U=F*F+D*D;if(0!=s){s*=c*(p+1)/2;var B=Math.sqrt(U),X=B-L-O*c+s;if(X>0){var Y=Math.min(1,X/(2*s))-1;U=(F-=(Y=(X-s*(1-Y*Y))/B)*F)*F+(D-=Y*D)*D}}t:if(b){var W=(U-L*L-(O*=c)*O)/(2*L*O);W<-1?W=-1:W>1&&(W=1,o&&(f*=(Math.sqrt(U)/(L+O)-1)*h+1)),C=Math.acos(W)*i,T=L+O*W,A=O*Math.sin(C),S=Math.atan2(D*T-F*A,F*T+D*A)}else{var j=(T=c*O)*T,G=(A=d*O)*A,q=Math.atan2(D,F),H=-2*G*L,z=G-j;if((I=H*H-4*z*(M=G*L*L+j*U-j*G))>=0){var Z=Math.sqrt(I);H<0&&(Z=-Z);var $=(Z=-(H+Z)/2)/z,Q=M/Z,J=Math.abs($)<Math.abs(Q)?$:Q;if(J*J<=U){N=Math.sqrt(U-J*J)*i,S=q-Math.atan2(N,J),C=Math.atan2(N/d,(J-L)/c);break t}}var K=t.MathUtils.PI,tt=L-T,et=tt*tt,nt=0,rt=0,at=L+T,it=at*at,ot=0;(M=-T*L/(j-G))>=-1&&M<=1&&(M=Math.acos(M),(I=(k=T*Math.cos(M)+L)*k+(N=A*Math.sin(M))*N)<et&&(K=M,et=I,tt=k,nt=N),I>it&&(rt=M,it=I,at=k,ot=N)),U<=(et+it)/2?(S=q-Math.atan2(nt*i,tt),C=K*i):(S=q-Math.atan2(ot*i,at),C=rt*i)}var st=Math.atan2(E,y)*g,ht=e.arotation;(S=(S-st)*t.MathUtils.radDeg+m-ht)>180?S-=360:S<-180&&(S+=360),e.updateWorldTransformWith(l,u,ht+S*h,f,e.ascaleY,0,0),ht=n.arotation,(C=((C+st)*t.MathUtils.radDeg-n.ashearX)*g+v-ht)>180?C-=360:C<-180&&(C+=360),n.updateWorldTransformWith(y,E,ht+C*h,n.ascaleX,n.ascaleY,n.ashearX,n.ashearY)}else n.updateWorldTransform()},e}();t.IkConstraint=e}(a||(a={})),function(t){var e=function(t){function e(e){var n=t.call(this,e,0,!1)||this;return n.bones=new Array,n.bendDirection=1,n.compress=!1,n.stretch=!1,n.uniform=!1,n.mix=1,n.softness=0,n}return o(e,t),e}(t.ConstraintData);t.IkConstraintData=e}(a||(a={})),function(t){var e=function(){function e(t,e){if(this.position=0,this.spacing=0,this.rotateMix=0,this.translateMix=0,this.spaces=new Array,this.positions=new Array,this.world=new Array,this.curves=new Array,this.lengths=new Array,this.segments=new Array,this.active=!1,null==t)throw new Error("data cannot be null.");if(null==e)throw new Error("skeleton cannot be null.");this.data=t,this.bones=new Array;for(var n=0,r=t.bones.length;n<r;n++)this.bones.push(e.findBone(t.bones[n].name));this.target=e.findSlot(t.target.name),this.position=t.position,this.spacing=t.spacing,this.rotateMix=t.rotateMix,this.translateMix=t.translateMix}return e.prototype.isActive=function(){return this.active},e.prototype.apply=function(){this.update()},e.prototype.update=function(){var n=this.target.getAttachment();if(n instanceof t.PathAttachment){var r=this.rotateMix,a=this.translateMix,i=r>0;if(a>0||i){var o=this.data,s=o.spacingMode==t.SpacingMode.Percent,h=o.rotateMode,l=h==t.RotateMode.Tangent,u=h==t.RotateMode.ChainScale,c=this.bones.length,f=l?c:c+1,d=this.bones,p=t.Utils.setArraySize(this.spaces,f),m=null,v=this.spacing;if(u||!s){u&&(m=t.Utils.setArraySize(this.lengths,c));for(var g=o.spacingMode==t.SpacingMode.Length,y=0,E=f-1;y<E;){var w=(k=d[y]).data.length;if(w<e.epsilon)u&&(m[y]=0),p[++y]=0;else if(s){if(u){var x=w*k.a,T=w*k.c,A=Math.sqrt(x*x+T*T);m[y]=A}p[++y]=v}else{x=w*k.a,T=w*k.c;var M=Math.sqrt(x*x+T*T);u&&(m[y]=M),p[++y]=(g?w+v:v)*M/w}}}else for(y=1;y<f;y++)p[y]=v;var I=this.computeWorldPositions(n,f,l,o.positionMode==t.PositionMode.Percent,s),b=I[0],R=I[1],S=o.offsetRotation,C=!1;if(0==S)C=h==t.RotateMode.Chain;else C=!1,S*=(P=this.target.bone).a*P.d-P.b*P.c>0?t.MathUtils.degRad:-t.MathUtils.degRad;y=0;for(var P=3;y<c;y++,P+=3){var k;(k=d[y]).worldX+=(b-k.worldX)*a,k.worldY+=(R-k.worldY)*a;var N=(x=I[P])-b,_=(T=I[P+1])-R;if(u){var V=m[y];if(0!=V){var L=(Math.sqrt(N*N+_*_)/V-1)*r+1;k.a*=L,k.c*=L}}if(b=x,R=T,i){var O=k.a,F=k.b,D=k.c,U=k.d,B=0,X=0,Y=0;if(B=l?I[P-1]:0==p[y+1]?I[P+2]:Math.atan2(_,N),B-=Math.atan2(D,O),C){X=Math.cos(B),Y=Math.sin(B);var W=k.data.length;b+=(W*(X*O-Y*D)-N)*r,R+=(W*(Y*O+X*D)-_)*r}else B+=S;B>t.MathUtils.PI?B-=t.MathUtils.PI2:B<-t.MathUtils.PI&&(B+=t.MathUtils.PI2),B*=r,X=Math.cos(B),Y=Math.sin(B),k.a=X*O-Y*D,k.b=X*F-Y*U,k.c=Y*O+X*D,k.d=Y*F+X*U}k.appliedValid=!1}}}},e.prototype.computeWorldPositions=function(n,r,a,i,o){var s=this.target,h=this.position,l=this.spaces,u=t.Utils.setArraySize(this.positions,3*r+2),c=null,f=n.closed,d=n.worldVerticesLength,p=d/6,m=e.NONE;if(!n.constantSpeed){var v=n.lengths,g=v[p-=f?1:2];if(i&&(h*=g),o)for(var y=1;y<r;y++)l[y]*=g;c=t.Utils.setArraySize(this.world,8);y=0;for(var E=0,w=0;y<r;y++,E+=3){var x=h+=G=l[y];if(f)(x%=g)<0&&(x+=g),w=0;else{if(x<0){m!=e.BEFORE&&(m=e.BEFORE,n.computeWorldVertices(s,2,4,c,0,2)),this.addBeforePosition(x,c,0,u,E);continue}if(x>g){m!=e.AFTER&&(m=e.AFTER,n.computeWorldVertices(s,d-6,4,c,0,2)),this.addAfterPosition(x-g,c,0,u,E);continue}}for(;;w++){var T=v[w];if(!(x>T)){if(0==w)x/=T;else x=(x-(Z=v[w-1]))/(T-Z);break}}w!=m&&(m=w,f&&w==p?(n.computeWorldVertices(s,d-4,4,c,0,2),n.computeWorldVertices(s,0,4,c,4,2)):n.computeWorldVertices(s,6*w+2,8,c,0,2)),this.addCurvePosition(x,c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],u,E,a||y>0&&0==G)}return u}f?(d+=2,c=t.Utils.setArraySize(this.world,d),n.computeWorldVertices(s,2,d-4,c,0,2),n.computeWorldVertices(s,0,2,c,d-4,2),c[d-2]=c[0],c[d-1]=c[1]):(p--,d-=4,c=t.Utils.setArraySize(this.world,d),n.computeWorldVertices(s,2,d,c,0,2));for(var A=t.Utils.setArraySize(this.curves,p),M=0,I=c[0],b=c[1],R=0,S=0,C=0,P=0,k=0,N=0,_=0,V=0,L=0,O=0,F=0,D=0,U=0,B=0,X=(y=0,2);y<p;y++,X+=6)R=c[X],S=c[X+1],C=c[X+2],P=c[X+3],F=2*(_=.1875*(I-2*R+C))+(L=.09375*(3*(R-C)-I+(k=c[X+4]))),D=2*(V=.1875*(b-2*S+P))+(O=.09375*(3*(S-P)-b+(N=c[X+5]))),U=.75*(R-I)+_+.16666667*L,B=.75*(S-b)+V+.16666667*O,M+=Math.sqrt(U*U+B*B),U+=F,B+=D,F+=L,D+=O,M+=Math.sqrt(U*U+B*B),U+=F,B+=D,M+=Math.sqrt(U*U+B*B),U+=F+L,B+=D+O,M+=Math.sqrt(U*U+B*B),A[y]=M,I=k,b=N;if(h*=i?M:M/n.lengths[p-1],o)for(y=1;y<r;y++)l[y]*=M;for(var Y=this.segments,W=0,j=(y=0,E=0,w=0,0);y<r;y++,E+=3){var G;x=h+=G=l[y];if(f)(x%=M)<0&&(x+=M),w=0;else{if(x<0){this.addBeforePosition(x,c,0,u,E);continue}if(x>M){this.addAfterPosition(x-M,c,d-4,u,E);continue}}for(;;w++){var q=A[w];if(!(x>q)){if(0==w)x/=q;else x=(x-(Z=A[w-1]))/(q-Z);break}}if(w!=m){m=w;var H=6*w;for(I=c[H],b=c[H+1],R=c[H+2],S=c[H+3],C=c[H+4],P=c[H+5],F=2*(_=.03*(I-2*R+C))+(L=.006*(3*(R-C)-I+(k=c[H+6]))),D=2*(V=.03*(b-2*S+P))+(O=.006*(3*(S-P)-b+(N=c[H+7]))),U=.3*(R-I)+_+.16666667*L,B=.3*(S-b)+V+.16666667*O,W=Math.sqrt(U*U+B*B),Y[0]=W,H=1;H<8;H++)U+=F,B+=D,F+=L,D+=O,W+=Math.sqrt(U*U+B*B),Y[H]=W;U+=F,B+=D,W+=Math.sqrt(U*U+B*B),Y[8]=W,U+=F+L,B+=D+O,W+=Math.sqrt(U*U+B*B),Y[9]=W,j=0}for(x*=W;;j++){var z=Y[j];if(!(x>z)){var Z;if(0==j)x/=z;else x=j+(x-(Z=Y[j-1]))/(z-Z);break}}this.addCurvePosition(.1*x,I,b,R,S,C,P,k,N,u,E,a||y>0&&0==G)}return u},e.prototype.addBeforePosition=function(t,e,n,r,a){var i=e[n],o=e[n+1],s=e[n+2]-i,h=e[n+3]-o,l=Math.atan2(h,s);r[a]=i+t*Math.cos(l),r[a+1]=o+t*Math.sin(l),r[a+2]=l},e.prototype.addAfterPosition=function(t,e,n,r,a){var i=e[n+2],o=e[n+3],s=i-e[n],h=o-e[n+1],l=Math.atan2(h,s);r[a]=i+t*Math.cos(l),r[a+1]=o+t*Math.sin(l),r[a+2]=l},e.prototype.addCurvePosition=function(t,e,n,r,a,i,o,s,h,l,u,c){if(0==t||isNaN(t))return l[u]=e,l[u+1]=n,void(l[u+2]=Math.atan2(a-n,r-e));var f=t*t,d=f*t,p=1-t,m=p*p,v=m*p,g=p*t,y=3*g,E=p*y,w=y*t,x=e*v+r*E+i*w+s*d,T=n*v+a*E+o*w+h*d;l[u]=x,l[u+1]=T,c&&(l[u+2]=t<.001?Math.atan2(a-n,r-e):Math.atan2(T-(n*m+a*g*2+o*f),x-(e*m+r*g*2+i*f)))},e.NONE=-1,e.BEFORE=-2,e.AFTER=-3,e.epsilon=1e-5,e}();t.PathConstraint=e}(a||(a={})),function(t){var e,n,r,a=function(t){function e(e){var n=t.call(this,e,0,!1)||this;return n.bones=new Array,n}return o(e,t),e}(t.ConstraintData);t.PathConstraintData=a,(e=t.PositionMode||(t.PositionMode={}))[e.Fixed=0]="Fixed",e[e.Percent=1]="Percent",(n=t.SpacingMode||(t.SpacingMode={}))[n.Length=0]="Length",n[n.Fixed=1]="Fixed",n[n.Percent=2]="Percent",(r=t.RotateMode||(t.RotateMode={}))[r.Tangent=0]="Tangent",r[r.Chain=1]="Chain",r[r.ChainScale=2]="ChainScale"}(a||(a={})),function(t){var e=function(){function t(t){this.toLoad=new Array,this.assets={},this.clientId=t}return t.prototype.loaded=function(){var t=0;for(var e in this.assets)t++;return t},t}(),n=function(){function t(t){void 0===t&&(t=""),this.clientAssets={},this.queuedAssets={},this.rawAssets={},this.errors={},this.pathPrefix=t}return t.prototype.queueAsset=function(t,n,r){var a=this.clientAssets[t];return null==a&&(a=new e(t),this.clientAssets[t]=a),null!==n&&(a.textureLoader=n),a.toLoad.push(r),this.queuedAssets[r]!==r&&(this.queuedAssets[r]=r,!0)},t.prototype.loadText=function(t,e){var n=this;if(e=this.pathPrefix+e,this.queueAsset(t,null,e)){var r=new XMLHttpRequest;r.overrideMimeType("text/html"),r.onreadystatechange=function(){r.readyState==XMLHttpRequest.DONE&&(r.status>=200&&r.status<300?n.rawAssets[e]=r.responseText:n.errors[e]="Couldn't load text "+e+": status "+r.status+", "+r.responseText)},r.open("GET",e,!0),r.send()}},t.prototype.loadJson=function(t,e){var n=this;if(e=this.pathPrefix+e,this.queueAsset(t,null,e)){var r=new XMLHttpRequest;r.overrideMimeType("text/html"),r.onreadystatechange=function(){r.readyState==XMLHttpRequest.DONE&&(r.status>=200&&r.status<300?n.rawAssets[e]=JSON.parse(r.responseText):n.errors[e]="Couldn't load text "+e+": status "+r.status+", "+r.responseText)},r.open("GET",e,!0),r.send()}},t.prototype.loadTexture=function(t,e,n){var r=this;if(n=this.pathPrefix+n,this.queueAsset(t,e,n))if(!!("undefined"==typeof window||"undefined"==typeof navigator||!window.document)&&"undefined"!=typeof importScripts){fetch(n,{mode:"cors"}).then((function(t){return t.ok||(r.errors[n]="Couldn't load image "+n),t.blob()})).then((function(t){return createImageBitmap(t,{premultiplyAlpha:"none",colorSpaceConversion:"none"})})).then((function(t){r.rawAssets[n]=t}))}else{var a=new Image;a.crossOrigin="anonymous",a.onload=function(t){r.rawAssets[n]=a},a.onerror=function(t){r.errors[n]="Couldn't load image "+n},a.src=n}},t.prototype.get=function(t,e){e=this.pathPrefix+e;var n=this.clientAssets[t];return null==n||n.assets[e]},t.prototype.updateClientAssets=function(t){for(var e=!!("undefined"==typeof window||"undefined"==typeof navigator||!window.document)&&"undefined"!=typeof importScripts,n=0;n<t.toLoad.length;n++){var r=t.toLoad[n],a=t.assets[r];if(null==a){var i=this.rawAssets[r];if(null==i)continue;e?i instanceof ImageBitmap?t.assets[r]=t.textureLoader(i):t.assets[r]=i:i instanceof HTMLImageElement?t.assets[r]=t.textureLoader(i):t.assets[r]=i}}},t.prototype.isLoadingComplete=function(t){var e=this.clientAssets[t];return null==e||(this.updateClientAssets(e),e.toLoad.length==e.loaded())},t.prototype.dispose=function(){},t.prototype.hasErrors=function(){return Object.keys(this.errors).length>0},t.prototype.getErrors=function(){return this.errors},t}();t.SharedAssetManager=n}(a||(a={})),function(t){var e=function(){function e(e){if(this._updateCache=new Array,this.updateCacheReset=new Array,this.time=0,this.scaleX=1,this.scaleY=1,this.x=0,this.y=0,null==e)throw new Error("data cannot be null.");this.data=e,this.bones=new Array;for(var n=0;n<e.bones.length;n++){var r=e.bones[n],a=void 0;if(null==r.parent)a=new t.Bone(r,this,null);else{var i=this.bones[r.parent.index];a=new t.Bone(r,this,i),i.children.push(a)}this.bones.push(a)}this.slots=new Array,this.drawOrder=new Array;for(n=0;n<e.slots.length;n++){var o=e.slots[n],s=(a=this.bones[o.boneData.index],new t.Slot(o,a));this.slots.push(s),this.drawOrder.push(s)}this.ikConstraints=new Array;for(n=0;n<e.ikConstraints.length;n++){var h=e.ikConstraints[n];this.ikConstraints.push(new t.IkConstraint(h,this))}this.transformConstraints=new Array;for(n=0;n<e.transformConstraints.length;n++){var l=e.transformConstraints[n];this.transformConstraints.push(new t.TransformConstraint(l,this))}this.pathConstraints=new Array;for(n=0;n<e.pathConstraints.length;n++){var u=e.pathConstraints[n];this.pathConstraints.push(new t.PathConstraint(u,this))}this.color=new t.Color(1,1,1,1),this.updateCache()}return e.prototype.updateCache=function(){this._updateCache.length=0,this.updateCacheReset.length=0;for(var t=this.bones,e=0,n=t.length;e<n;e++){(a=t[e]).sorted=a.data.skinRequired,a.active=!a.sorted}if(null!=this.skin){var r=this.skin.bones;for(e=0,n=this.skin.bones.length;e<n;e++){var a=this.bones[r[e].index];do{a.sorted=!1,a.active=!0,a=a.parent}while(null!=a)}}var i=this.ikConstraints,o=this.transformConstraints,s=this.pathConstraints,h=i.length,l=o.length,u=s.length,c=h+l+u;t:for(e=0;e<c;e++){for(var f=0;f<h;f++){if((d=i[f]).data.order==e){this.sortIkConstraint(d);continue t}}for(f=0;f<l;f++){if((d=o[f]).data.order==e){this.sortTransformConstraint(d);continue t}}for(f=0;f<u;f++){var d;if((d=s[f]).data.order==e){this.sortPathConstraint(d);continue t}}}for(e=0,n=t.length;e<n;e++)this.sortBone(t[e])},e.prototype.sortIkConstraint=function(e){if(e.active=e.target.isActive()&&(!e.data.skinRequired||null!=this.skin&&t.Utils.contains(this.skin.constraints,e.data,!0)),e.active){var n=e.target;this.sortBone(n);var r=e.bones,a=r[0];if(this.sortBone(a),r.length>1){var i=r[r.length-1];this._updateCache.indexOf(i)>-1||this.updateCacheReset.push(i)}this._updateCache.push(e),this.sortReset(a.children),r[r.length-1].sorted=!0}},e.prototype.sortPathConstraint=function(e){if(e.active=e.target.bone.isActive()&&(!e.data.skinRequired||null!=this.skin&&t.Utils.contains(this.skin.constraints,e.data,!0)),e.active){var n=e.target,r=n.data.index,a=n.bone;null!=this.skin&&this.sortPathConstraintAttachment(this.skin,r,a),null!=this.data.defaultSkin&&this.data.defaultSkin!=this.skin&&this.sortPathConstraintAttachment(this.data.defaultSkin,r,a);for(var i=0,o=this.data.skins.length;i<o;i++)this.sortPathConstraintAttachment(this.data.skins[i],r,a);var s=n.getAttachment();s instanceof t.PathAttachment&&this.sortPathConstraintAttachmentWith(s,a);var h=e.bones,l=h.length;for(i=0;i<l;i++)this.sortBone(h[i]);this._updateCache.push(e);for(i=0;i<l;i++)this.sortReset(h[i].children);for(i=0;i<l;i++)h[i].sorted=!0}},e.prototype.sortTransformConstraint=function(e){if(e.active=e.target.isActive()&&(!e.data.skinRequired||null!=this.skin&&t.Utils.contains(this.skin.constraints,e.data,!0)),e.active){this.sortBone(e.target);var n=e.bones,r=n.length;if(e.data.local)for(var a=0;a<r;a++){var i=n[a];this.sortBone(i.parent),this._updateCache.indexOf(i)>-1||this.updateCacheReset.push(i)}else for(a=0;a<r;a++)this.sortBone(n[a]);this._updateCache.push(e);for(var o=0;o<r;o++)this.sortReset(n[o].children);for(o=0;o<r;o++)n[o].sorted=!0}},e.prototype.sortPathConstraintAttachment=function(t,e,n){var r=t.attachments[e];if(r)for(var a in r)this.sortPathConstraintAttachmentWith(r[a],n)},e.prototype.sortPathConstraintAttachmentWith=function(e,n){if(e instanceof t.PathAttachment){var r=e.bones;if(null==r)this.sortBone(n);else for(var a=this.bones,i=0;i<r.length;)for(var o=r[i++],s=i+o;i<s;i++){var h=r[i];this.sortBone(a[h])}}},e.prototype.sortBone=function(t){if(!t.sorted){var e=t.parent;null!=e&&this.sortBone(e),t.sorted=!0,this._updateCache.push(t)}},e.prototype.sortReset=function(t){for(var e=0,n=t.length;e<n;e++){var r=t[e];r.active&&(r.sorted&&this.sortReset(r.children),r.sorted=!1)}},e.prototype.updateWorldTransform=function(){for(var t=this.updateCacheReset,e=0,n=t.length;e<n;e++){var r=t[e];r.ax=r.x,r.ay=r.y,r.arotation=r.rotation,r.ascaleX=r.scaleX,r.ascaleY=r.scaleY,r.ashearX=r.shearX,r.ashearY=r.shearY,r.appliedValid=!0}var a=this._updateCache;for(e=0,n=a.length;e<n;e++)a[e].update()},e.prototype.setToSetupPose=function(){this.setBonesToSetupPose(),this.setSlotsToSetupPose()},e.prototype.setBonesToSetupPose=function(){for(var t=this.bones,e=0,n=t.length;e<n;e++)t[e].setToSetupPose();var r=this.ikConstraints;for(e=0,n=r.length;e<n;e++){(s=r[e]).mix=s.data.mix,s.softness=s.data.softness,s.bendDirection=s.data.bendDirection,s.compress=s.data.compress,s.stretch=s.data.stretch}var a=this.transformConstraints;for(e=0,n=a.length;e<n;e++){var i=(s=a[e]).data;s.rotateMix=i.rotateMix,s.translateMix=i.translateMix,s.scaleMix=i.scaleMix,s.shearMix=i.shearMix}var o=this.pathConstraints;for(e=0,n=o.length;e<n;e++){var s;i=(s=o[e]).data;s.position=i.position,s.spacing=i.spacing,s.rotateMix=i.rotateMix,s.translateMix=i.translateMix}},e.prototype.setSlotsToSetupPose=function(){var e=this.slots;t.Utils.arrayCopy(e,0,this.drawOrder,0,e.length);for(var n=0,r=e.length;n<r;n++)e[n].setToSetupPose()},e.prototype.getRootBone=function(){return 0==this.bones.length?null:this.bones[0]},e.prototype.findBone=function(t){if(null==t)throw new Error("boneName cannot be null.");for(var e=this.bones,n=0,r=e.length;n<r;n++){var a=e[n];if(a.data.name==t)return a}return null},e.prototype.findBoneIndex=function(t){if(null==t)throw new Error("boneName cannot be null.");for(var e=this.bones,n=0,r=e.length;n<r;n++)if(e[n].data.name==t)return n;return-1},e.prototype.findSlot=function(t){if(null==t)throw new Error("slotName cannot be null.");for(var e=this.slots,n=0,r=e.length;n<r;n++){var a=e[n];if(a.data.name==t)return a}return null},e.prototype.findSlotIndex=function(t){if(null==t)throw new Error("slotName cannot be null.");for(var e=this.slots,n=0,r=e.length;n<r;n++)if(e[n].data.name==t)return n;return-1},e.prototype.setSkinByName=function(t){var e=this.data.findSkin(t);if(null==e)throw new Error("Skin not found: "+t);this.setSkin(e)},e.prototype.setSkin=function(t){if(t!=this.skin){if(null!=t)if(null!=this.skin)t.attachAll(this,this.skin);else for(var e=this.slots,n=0,r=e.length;n<r;n++){var a=e[n],i=a.data.attachmentName;if(null!=i){var o=t.getAttachment(n,i);null!=o&&a.setAttachment(o)}}this.skin=t,this.updateCache()}},e.prototype.getAttachmentByName=function(t,e){return this.getAttachment(this.data.findSlotIndex(t),e)},e.prototype.getAttachment=function(t,e){if(null==e)throw new Error("attachmentName cannot be null.");if(null!=this.skin){var n=this.skin.getAttachment(t,e);if(null!=n)return n}return null!=this.data.defaultSkin?this.data.defaultSkin.getAttachment(t,e):null},e.prototype.setAttachment=function(t,e){if(null==t)throw new Error("slotName cannot be null.");for(var n=this.slots,r=0,a=n.length;r<a;r++){var i=n[r];if(i.data.name==t){var o=null;if(null!=e&&null==(o=this.getAttachment(r,e)))throw new Error("Attachment not found: "+e+", for slot: "+t);return void i.setAttachment(o)}}throw new Error("Slot not found: "+t)},e.prototype.findIkConstraint=function(t){if(null==t)throw new Error("constraintName cannot be null.");for(var e=this.ikConstraints,n=0,r=e.length;n<r;n++){var a=e[n];if(a.data.name==t)return a}return null},e.prototype.findTransformConstraint=function(t){if(null==t)throw new Error("constraintName cannot be null.");for(var e=this.transformConstraints,n=0,r=e.length;n<r;n++){var a=e[n];if(a.data.name==t)return a}return null},e.prototype.findPathConstraint=function(t){if(null==t)throw new Error("constraintName cannot be null.");for(var e=this.pathConstraints,n=0,r=e.length;n<r;n++){var a=e[n];if(a.data.name==t)return a}return null},e.prototype.getBounds=function(e,n,r){if(void 0===r&&(r=new Array(2)),null==e)throw new Error("offset cannot be null.");if(null==n)throw new Error("size cannot be null.");for(var a=this.drawOrder,i=Number.POSITIVE_INFINITY,o=Number.POSITIVE_INFINITY,s=Number.NEGATIVE_INFINITY,h=Number.NEGATIVE_INFINITY,l=0,u=a.length;l<u;l++){var c=a[l];if(c.bone.active){var f=0,d=null,p=c.getAttachment();if(p instanceof t.RegionAttachment)f=8,d=t.Utils.setArraySize(r,f,0),p.computeWorldVertices(c.bone,d,0,2);else if(p instanceof t.MeshAttachment){var m=p;f=m.worldVerticesLength,d=t.Utils.setArraySize(r,f,0),m.computeWorldVertices(c,0,f,d,0,2)}if(null!=d)for(var v=0,g=d.length;v<g;v+=2){var y=d[v],E=d[v+1];i=Math.min(i,y),o=Math.min(o,E),s=Math.max(s,y),h=Math.max(h,E)}}}e.set(i,o),n.set(s-i,h-o)},e.prototype.update=function(t){this.time+=t},e}();t.Skeleton=e}(a||(a={})),function(t){var e=function(){function e(t){this.scale=1,this.linkedMeshes=new Array,this.attachmentLoader=t}return e.prototype.readSkeletonData=function(r){var a=this.scale,i=new t.SkeletonData;i.name="";var o=new n(r);if(i.hash=o.readString(),i.version=o.readString(),"3.8.75"==i.version)throw new Error("Unsupported skeleton data, please export with a newer version of Spine.");i.x=o.readFloat(),i.y=o.readFloat(),i.width=o.readFloat(),i.height=o.readFloat();var s=o.readBoolean();s&&(i.fps=o.readFloat(),i.imagesPath=o.readString(),i.audioPath=o.readString());var h=0;h=o.readInt(!0);for(var l=0;l<h;l++)o.strings.push(o.readString());h=o.readInt(!0);for(l=0;l<h;l++){var u=o.readString(),c=0==l?null:i.bones[o.readInt(!0)];(p=new t.BoneData(l,u,c)).rotation=o.readFloat(),p.x=o.readFloat()*a,p.y=o.readFloat()*a,p.scaleX=o.readFloat(),p.scaleY=o.readFloat(),p.shearX=o.readFloat(),p.shearY=o.readFloat(),p.length=o.readFloat()*a,p.transformMode=e.TransformModeValues[o.readInt(!0)],p.skinRequired=o.readBoolean(),s&&t.Color.rgba8888ToColor(p.color,o.readInt32()),i.bones.push(p)}h=o.readInt(!0);for(l=0;l<h;l++){var f=o.readString(),d=i.bones[o.readInt(!0)],p=new t.SlotData(l,f,d);t.Color.rgba8888ToColor(p.color,o.readInt32());var m=o.readInt32();-1!=m&&t.Color.rgb888ToColor(p.darkColor=new t.Color,m),p.attachmentName=o.readStringRef(),p.blendMode=e.BlendModeValues[o.readInt(!0)],i.slots.push(p)}h=o.readInt(!0);l=0;for(var v=void 0;l<h;l++){(p=new t.IkConstraintData(o.readString())).order=o.readInt(!0),p.skinRequired=o.readBoolean(),v=o.readInt(!0);for(var g=0;g<v;g++)p.bones.push(i.bones[o.readInt(!0)]);p.target=i.bones[o.readInt(!0)],p.mix=o.readFloat(),p.softness=o.readFloat()*a,p.bendDirection=o.readByte(),p.compress=o.readBoolean(),p.stretch=o.readBoolean(),p.uniform=o.readBoolean(),i.ikConstraints.push(p)}h=o.readInt(!0);for(l=0,v=void 0;l<h;l++){(p=new t.TransformConstraintData(o.readString())).order=o.readInt(!0),p.skinRequired=o.readBoolean(),v=o.readInt(!0);for(g=0;g<v;g++)p.bones.push(i.bones[o.readInt(!0)]);p.target=i.bones[o.readInt(!0)],p.local=o.readBoolean(),p.relative=o.readBoolean(),p.offsetRotation=o.readFloat(),p.offsetX=o.readFloat()*a,p.offsetY=o.readFloat()*a,p.offsetScaleX=o.readFloat(),p.offsetScaleY=o.readFloat(),p.offsetShearY=o.readFloat(),p.rotateMix=o.readFloat(),p.translateMix=o.readFloat(),p.scaleMix=o.readFloat(),p.shearMix=o.readFloat(),i.transformConstraints.push(p)}h=o.readInt(!0);for(l=0,v=void 0;l<h;l++){(p=new t.PathConstraintData(o.readString())).order=o.readInt(!0),p.skinRequired=o.readBoolean(),v=o.readInt(!0);for(g=0;g<v;g++)p.bones.push(i.bones[o.readInt(!0)]);p.target=i.slots[o.readInt(!0)],p.positionMode=e.PositionModeValues[o.readInt(!0)],p.spacingMode=e.SpacingModeValues[o.readInt(!0)],p.rotateMode=e.RotateModeValues[o.readInt(!0)],p.offsetRotation=o.readFloat(),p.position=o.readFloat(),p.positionMode==t.PositionMode.Fixed&&(p.position*=a),p.spacing=o.readFloat(),p.spacingMode!=t.SpacingMode.Length&&p.spacingMode!=t.SpacingMode.Fixed||(p.spacing*=a),p.rotateMix=o.readFloat(),p.translateMix=o.readFloat(),i.pathConstraints.push(p)}var y=this.readSkin(o,i,!0,s);null!=y&&(i.defaultSkin=y,i.skins.push(y));l=i.skins.length;for(t.Utils.setArraySize(i.skins,h=l+o.readInt(!0));l<h;l++)i.skins[l]=this.readSkin(o,i,!1,s);h=this.linkedMeshes.length;for(l=0;l<h;l++){var E=this.linkedMeshes[l],w=null==E.skin?i.defaultSkin:i.findSkin(E.skin);if(null==w)throw new Error("Skin not found: "+E.skin);var x=w.getAttachment(E.slotIndex,E.parent);if(null==x)throw new Error("Parent mesh not found: "+E.parent);E.mesh.deformAttachment=E.inheritDeform?x:E.mesh,E.mesh.setParentMesh(x),E.mesh.updateUVs()}this.linkedMeshes.length=0,h=o.readInt(!0);for(l=0;l<h;l++){(p=new t.EventData(o.readStringRef())).intValue=o.readInt(!1),p.floatValue=o.readFloat(),p.stringValue=o.readString(),p.audioPath=o.readString(),null!=p.audioPath&&(p.volume=o.readFloat(),p.balance=o.readFloat()),i.events.push(p)}h=o.readInt(!0);for(l=0;l<h;l++)i.animations.push(this.readAnimation(o,o.readString(),i));return i},e.prototype.readSkin=function(e,n,r,a){var i=null,o=0;if(r){if(0==(o=e.readInt(!0)))return null;i=new t.Skin("default")}else{(i=new t.Skin(e.readStringRef())).bones.length=e.readInt(!0);for(var s=0,h=i.bones.length;s<h;s++)i.bones[s]=n.bones[e.readInt(!0)];for(s=0,h=e.readInt(!0);s<h;s++)i.constraints.push(n.ikConstraints[e.readInt(!0)]);for(s=0,h=e.readInt(!0);s<h;s++)i.constraints.push(n.transformConstraints[e.readInt(!0)]);for(s=0,h=e.readInt(!0);s<h;s++)i.constraints.push(n.pathConstraints[e.readInt(!0)]);o=e.readInt(!0)}for(s=0;s<o;s++)for(var l=e.readInt(!0),u=0,c=e.readInt(!0);u<c;u++){var f=e.readStringRef(),d=this.readAttachment(e,n,i,l,f,a);null!=d&&i.setAttachment(l,f,d)}return i},e.prototype.readAttachment=function(n,a,i,o,s,h){var l=this.scale,u=n.readStringRef();null==u&&(u=s);var c=n.readByte();switch(e.AttachmentTypeValues[c]){case t.AttachmentType.Region:var f=n.readStringRef(),d=n.readFloat(),p=n.readFloat(),m=n.readFloat(),v=n.readFloat(),g=n.readFloat(),y=n.readFloat(),E=n.readFloat(),w=n.readInt32();null==f&&(f=u);var x=this.attachmentLoader.newRegionAttachment(i,u,f);return null==x?null:(x.path=f,x.x=p*l,x.y=m*l,x.scaleX=v,x.scaleY=g,x.rotation=d,x.width=y*l,x.height=E*l,t.Color.rgba8888ToColor(x.color,w),x.updateOffset(),x);case t.AttachmentType.BoundingBox:var T=n.readInt(!0),A=this.readVertices(n,T),M=(w=h?n.readInt32():0,this.attachmentLoader.newBoundingBoxAttachment(i,u));return null==M?null:(M.worldVerticesLength=T<<1,M.vertices=A.vertices,M.bones=A.bones,h&&t.Color.rgba8888ToColor(M.color,w),M);case t.AttachmentType.Mesh:f=n.readStringRef(),w=n.readInt32(),T=n.readInt(!0);var I=this.readFloatArray(n,T<<1,1),b=this.readShortArray(n),R=(A=this.readVertices(n,T),n.readInt(!0)),S=null;y=0,E=0;return h&&(S=this.readShortArray(n),y=n.readFloat(),E=n.readFloat()),null==f&&(f=u),null==(C=this.attachmentLoader.newMeshAttachment(i,u,f))?null:(C.path=f,t.Color.rgba8888ToColor(C.color,w),C.bones=A.bones,C.vertices=A.vertices,C.worldVerticesLength=T<<1,C.triangles=b,C.regionUVs=I,C.updateUVs(),C.hullLength=R<<1,h&&(C.edges=S,C.width=y*l,C.height=E*l),C);case t.AttachmentType.LinkedMesh:f=n.readStringRef(),w=n.readInt32();var C,P=n.readStringRef(),k=n.readStringRef(),N=n.readBoolean();y=0,E=0;return h&&(y=n.readFloat(),E=n.readFloat()),null==f&&(f=u),null==(C=this.attachmentLoader.newMeshAttachment(i,u,f))?null:(C.path=f,t.Color.rgba8888ToColor(C.color,w),h&&(C.width=y*l,C.height=E*l),this.linkedMeshes.push(new r(C,P,o,k,N)),C);case t.AttachmentType.Path:for(var _=n.readBoolean(),V=n.readBoolean(),L=(T=n.readInt(!0),A=this.readVertices(n,T),t.Utils.newArray(T/3,0)),O=0,F=L.length;O<F;O++)L[O]=n.readFloat()*l;w=h?n.readInt32():0;return null==(f=this.attachmentLoader.newPathAttachment(i,u))?null:(f.closed=_,f.constantSpeed=V,f.worldVerticesLength=T<<1,f.vertices=A.vertices,f.bones=A.bones,f.lengths=L,h&&t.Color.rgba8888ToColor(f.color,w),f);case t.AttachmentType.Point:d=n.readFloat(),p=n.readFloat(),m=n.readFloat(),w=h?n.readInt32():0;var D=this.attachmentLoader.newPointAttachment(i,u);return null==D?null:(D.x=p*l,D.y=m*l,D.rotation=d,h&&t.Color.rgba8888ToColor(D.color,w),D);case t.AttachmentType.Clipping:var U=n.readInt(!0),B=(T=n.readInt(!0),A=this.readVertices(n,T),w=h?n.readInt32():0,this.attachmentLoader.newClippingAttachment(i,u));return null==B?null:(B.endSlot=a.slots[U],B.worldVerticesLength=T<<1,B.vertices=A.vertices,B.bones=A.bones,h&&t.Color.rgba8888ToColor(B.color,w),B)}return null},e.prototype.readVertices=function(e,n){var r=n<<1,i=new a,o=this.scale;if(!e.readBoolean())return i.vertices=this.readFloatArray(e,r,o),i;for(var s=new Array,h=new Array,l=0;l<n;l++){var u=e.readInt(!0);h.push(u);for(var c=0;c<u;c++)h.push(e.readInt(!0)),s.push(e.readFloat()*o),s.push(e.readFloat()*o),s.push(e.readFloat())}return i.vertices=t.Utils.toFloatArray(s),i.bones=h,i},e.prototype.readFloatArray=function(t,e,n){var r=new Array(e);if(1==n)for(var a=0;a<e;a++)r[a]=t.readFloat();else for(a=0;a<e;a++)r[a]=t.readFloat()*n;return r},e.prototype.readShortArray=function(t){for(var e=t.readInt(!0),n=new Array(e),r=0;r<e;r++)n[r]=t.readShort();return n},e.prototype.readAnimation=function(n,r,a){for(var i=new Array,o=this.scale,s=0,h=new t.Color,l=new t.Color,u=0,c=n.readInt(!0);u<c;u++)for(var f=n.readInt(!0),d=0,p=n.readInt(!0);d<p;d++){var m=n.readByte(),v=n.readInt(!0);switch(m){case e.SLOT_ATTACHMENT:(w=new t.AttachmentTimeline(v)).slotIndex=f;for(var g=0;g<v;g++)w.setFrame(g,n.readFloat(),n.readStringRef());i.push(w),s=Math.max(s,w.frames[v-1]);break;case e.SLOT_COLOR:(w=new t.ColorTimeline(v)).slotIndex=f;for(g=0;g<v;g++){var y=n.readFloat();t.Color.rgba8888ToColor(h,n.readInt32()),w.setFrame(g,y,h.r,h.g,h.b,h.a),g<v-1&&this.readCurve(n,g,w)}i.push(w),s=Math.max(s,w.frames[(v-1)*t.ColorTimeline.ENTRIES]);break;case e.SLOT_TWO_COLOR:(w=new t.TwoColorTimeline(v)).slotIndex=f;for(g=0;g<v;g++){y=n.readFloat();t.Color.rgba8888ToColor(h,n.readInt32()),t.Color.rgb888ToColor(l,n.readInt32()),w.setFrame(g,y,h.r,h.g,h.b,h.a,l.r,l.g,l.b),g<v-1&&this.readCurve(n,g,w)}i.push(w),s=Math.max(s,w.frames[(v-1)*t.TwoColorTimeline.ENTRIES])}}for(u=0,c=n.readInt(!0);u<c;u++){var E=n.readInt(!0);for(d=0,p=n.readInt(!0);d<p;d++){m=n.readByte(),v=n.readInt(!0);switch(m){case e.BONE_ROTATE:(w=new t.RotateTimeline(v)).boneIndex=E;for(g=0;g<v;g++)w.setFrame(g,n.readFloat(),n.readFloat()),g<v-1&&this.readCurve(n,g,w);i.push(w),s=Math.max(s,w.frames[(v-1)*t.RotateTimeline.ENTRIES]);break;case e.BONE_TRANSLATE:case e.BONE_SCALE:case e.BONE_SHEAR:var w=void 0,x=1;m==e.BONE_SCALE?w=new t.ScaleTimeline(v):m==e.BONE_SHEAR?w=new t.ShearTimeline(v):(w=new t.TranslateTimeline(v),x=o),w.boneIndex=E;for(g=0;g<v;g++)w.setFrame(g,n.readFloat(),n.readFloat()*x,n.readFloat()*x),g<v-1&&this.readCurve(n,g,w);i.push(w),s=Math.max(s,w.frames[(v-1)*t.TranslateTimeline.ENTRIES])}}}for(u=0,c=n.readInt(!0);u<c;u++){var T=n.readInt(!0);v=n.readInt(!0);(w=new t.IkConstraintTimeline(v)).ikConstraintIndex=T;for(g=0;g<v;g++)w.setFrame(g,n.readFloat(),n.readFloat(),n.readFloat()*o,n.readByte(),n.readBoolean(),n.readBoolean()),g<v-1&&this.readCurve(n,g,w);i.push(w),s=Math.max(s,w.frames[(v-1)*t.IkConstraintTimeline.ENTRIES])}for(u=0,c=n.readInt(!0);u<c;u++){T=n.readInt(!0),v=n.readInt(!0);(w=new t.TransformConstraintTimeline(v)).transformConstraintIndex=T;for(g=0;g<v;g++)w.setFrame(g,n.readFloat(),n.readFloat(),n.readFloat(),n.readFloat(),n.readFloat()),g<v-1&&this.readCurve(n,g,w);i.push(w),s=Math.max(s,w.frames[(v-1)*t.TransformConstraintTimeline.ENTRIES])}for(u=0,c=n.readInt(!0);u<c;u++){T=n.readInt(!0);var A=a.pathConstraints[T];for(d=0,p=n.readInt(!0);d<p;d++){m=n.readByte(),v=n.readInt(!0);switch(m){case e.PATH_POSITION:case e.PATH_SPACING:w=void 0,x=1;m==e.PATH_SPACING?(w=new t.PathConstraintSpacingTimeline(v),A.spacingMode!=t.SpacingMode.Length&&A.spacingMode!=t.SpacingMode.Fixed||(x=o)):(w=new t.PathConstraintPositionTimeline(v),A.positionMode==t.PositionMode.Fixed&&(x=o)),w.pathConstraintIndex=T;for(g=0;g<v;g++)w.setFrame(g,n.readFloat(),n.readFloat()*x),g<v-1&&this.readCurve(n,g,w);i.push(w),s=Math.max(s,w.frames[(v-1)*t.PathConstraintPositionTimeline.ENTRIES]);break;case e.PATH_MIX:(w=new t.PathConstraintMixTimeline(v)).pathConstraintIndex=T;for(g=0;g<v;g++)w.setFrame(g,n.readFloat(),n.readFloat(),n.readFloat()),g<v-1&&this.readCurve(n,g,w);i.push(w),s=Math.max(s,w.frames[(v-1)*t.PathConstraintMixTimeline.ENTRIES])}}}for(u=0,c=n.readInt(!0);u<c;u++){var M=a.skins[n.readInt(!0)];for(d=0,p=n.readInt(!0);d<p;d++){f=n.readInt(!0);for(var I=0,b=n.readInt(!0);I<b;I++){var R=M.getAttachment(f,n.readStringRef()),S=null!=R.bones,C=R.vertices,P=S?C.length/3*2:C.length;v=n.readInt(!0);(w=new t.DeformTimeline(v)).slotIndex=f,w.attachment=R;for(g=0;g<v;g++){y=n.readFloat();var k=void 0,N=n.readInt(!0);if(0==N)k=S?t.Utils.newFloatArray(P):C;else{k=t.Utils.newFloatArray(P);var _=n.readInt(!0);if(N+=_,1==o)for(var V=_;V<N;V++)k[V]=n.readFloat();else for(V=_;V<N;V++)k[V]=n.readFloat()*o;if(!S){V=0;for(var L=k.length;V<L;V++)k[V]+=C[V]}}w.setFrame(g,y,k),g<v-1&&this.readCurve(n,g,w)}i.push(w),s=Math.max(s,w.frames[v-1])}}}var O=n.readInt(!0);if(O>0){w=new t.DrawOrderTimeline(O);var F=a.slots.length;for(u=0;u<O;u++){y=n.readFloat();var D=n.readInt(!0),U=t.Utils.newArray(F,0);for(d=F-1;d>=0;d--)U[d]=-1;var B=t.Utils.newArray(F-D,0),X=0,Y=0;for(d=0;d<D;d++){for(f=n.readInt(!0);X!=f;)B[Y++]=X++;U[X+n.readInt(!0)]=X++}for(;X<F;)B[Y++]=X++;for(d=F-1;d>=0;d--)-1==U[d]&&(U[d]=B[--Y]);w.setFrame(u,y,U)}i.push(w),s=Math.max(s,w.frames[O-1])}var W=n.readInt(!0);if(W>0){for(w=new t.EventTimeline(W),u=0;u<W;u++){y=n.readFloat();var j=a.events[n.readInt(!0)],G=new t.Event(y,j);G.intValue=n.readInt(!1),G.floatValue=n.readFloat(),G.stringValue=n.readBoolean()?n.readString():j.stringValue,null!=G.data.audioPath&&(G.volume=n.readFloat(),G.balance=n.readFloat()),w.setFrame(u,G)}i.push(w),s=Math.max(s,w.frames[W-1])}return new t.Animation(r,i,s)},e.prototype.readCurve=function(t,n,r){switch(t.readByte()){case e.CURVE_STEPPED:r.setStepped(n);break;case e.CURVE_BEZIER:this.setCurve(r,n,t.readFloat(),t.readFloat(),t.readFloat(),t.readFloat())}},e.prototype.setCurve=function(t,e,n,r,a,i){t.setCurve(e,n,r,a,i)},e.AttachmentTypeValues=[0,1,2,3,4,5,6],e.TransformModeValues=[t.TransformMode.Normal,t.TransformMode.OnlyTranslation,t.TransformMode.NoRotationOrReflection,t.TransformMode.NoScale,t.TransformMode.NoScaleOrReflection],e.PositionModeValues=[t.PositionMode.Fixed,t.PositionMode.Percent],e.SpacingModeValues=[t.SpacingMode.Length,t.SpacingMode.Fixed,t.SpacingMode.Percent],e.RotateModeValues=[t.RotateMode.Tangent,t.RotateMode.Chain,t.RotateMode.ChainScale],e.BlendModeValues=[t.BlendMode.Normal,t.BlendMode.Additive,t.BlendMode.Multiply,t.BlendMode.Screen],e.BONE_ROTATE=0,e.BONE_TRANSLATE=1,e.BONE_SCALE=2,e.BONE_SHEAR=3,e.SLOT_ATTACHMENT=0,e.SLOT_COLOR=1,e.SLOT_TWO_COLOR=2,e.PATH_POSITION=0,e.PATH_SPACING=1,e.PATH_MIX=2,e.CURVE_LINEAR=0,e.CURVE_STEPPED=1,e.CURVE_BEZIER=2,e}();t.SkeletonBinary=e;var n=function(){function t(t,e,n,r){void 0===e&&(e=new Array),void 0===n&&(n=0),void 0===r&&(r=new DataView(t.buffer)),this.strings=e,this.index=n,this.buffer=r}return t.prototype.readByte=function(){return this.buffer.getInt8(this.index++)},t.prototype.readShort=function(){var t=this.buffer.getInt16(this.index);return this.index+=2,t},t.prototype.readInt32=function(){var t=this.buffer.getInt32(this.index);return this.index+=4,t},t.prototype.readInt=function(t){var e=this.readByte(),n=127&e;return 0!=(128&e)&&(n|=(127&(e=this.readByte()))<<7,0!=(128&e)&&(n|=(127&(e=this.readByte()))<<14,0!=(128&e)&&(n|=(127&(e=this.readByte()))<<21,0!=(128&e)&&(n|=(127&(e=this.readByte()))<<28)))),t?n:n>>>1^-(1&n)},t.prototype.readStringRef=function(){var t=this.readInt(!0);return 0==t?null:this.strings[t-1]},t.prototype.readString=function(){var t=this.readInt(!0);switch(t){case 0:return null;case 1:return""}t--;for(var e="",n=0;n<t;){var r=this.readByte();switch(r>>4){case 12:case 13:e+=String.fromCharCode((31&r)<<6|63&this.readByte()),n+=2;break;case 14:e+=String.fromCharCode((15&r)<<12|(63&this.readByte())<<6|63&this.readByte()),n+=3;break;default:e+=String.fromCharCode(r),n++}}return e},t.prototype.readFloat=function(){var t=this.buffer.getFloat32(this.index);return this.index+=4,t},t.prototype.readBoolean=function(){return 0!=this.readByte()},t}(),r=function(t,e,n,r,a){this.mesh=t,this.skin=e,this.slotIndex=n,this.parent=r,this.inheritDeform=a},a=function(t,e){void 0===t&&(t=null),void 0===e&&(e=null),this.bones=t,this.vertices=e}}(a||(a={})),function(t){var e=function(){function e(){this.minX=0,this.minY=0,this.maxX=0,this.maxY=0,this.boundingBoxes=new Array,this.polygons=new Array,this.polygonPool=new t.Pool((function(){return t.Utils.newFloatArray(16)}))}return e.prototype.update=function(e,n){if(null==e)throw new Error("skeleton cannot be null.");var r=this.boundingBoxes,a=this.polygons,i=this.polygonPool,o=e.slots,s=o.length;r.length=0,i.freeAll(a),a.length=0;for(var h=0;h<s;h++){var l=o[h];if(l.bone.active){var u=l.getAttachment();if(u instanceof t.BoundingBoxAttachment){var c=u;r.push(c);var f=i.obtain();f.length!=c.worldVerticesLength&&(f=t.Utils.newFloatArray(c.worldVerticesLength)),a.push(f),c.computeWorldVertices(l,0,c.worldVerticesLength,f,0,2)}}}n?this.aabbCompute():(this.minX=Number.POSITIVE_INFINITY,this.minY=Number.POSITIVE_INFINITY,this.maxX=Number.NEGATIVE_INFINITY,this.maxY=Number.NEGATIVE_INFINITY)},e.prototype.aabbCompute=function(){for(var t=Number.POSITIVE_INFINITY,e=Number.POSITIVE_INFINITY,n=Number.NEGATIVE_INFINITY,r=Number.NEGATIVE_INFINITY,a=this.polygons,i=0,o=a.length;i<o;i++)for(var s=a[i],h=s,l=0,u=s.length;l<u;l+=2){var c=h[l],f=h[l+1];t=Math.min(t,c),e=Math.min(e,f),n=Math.max(n,c),r=Math.max(r,f)}this.minX=t,this.minY=e,this.maxX=n,this.maxY=r},e.prototype.aabbContainsPoint=function(t,e){return t>=this.minX&&t<=this.maxX&&e>=this.minY&&e<=this.maxY},e.prototype.aabbIntersectsSegment=function(t,e,n,r){var a=this.minX,i=this.minY,o=this.maxX,s=this.maxY;if(t<=a&&n<=a||e<=i&&r<=i||t>=o&&n>=o||e>=s&&r>=s)return!1;var h=(r-e)/(n-t),l=h*(a-t)+e;if(l>i&&l<s)return!0;if((l=h*(o-t)+e)>i&&l<s)return!0;var u=(i-e)/h+t;return u>a&&u<o||(u=(s-e)/h+t)>a&&u<o},e.prototype.aabbIntersectsSkeleton=function(t){return this.minX<t.maxX&&this.maxX>t.minX&&this.minY<t.maxY&&this.maxY>t.minY},e.prototype.containsPoint=function(t,e){for(var n=this.polygons,r=0,a=n.length;r<a;r++)if(this.containsPointPolygon(n[r],t,e))return this.boundingBoxes[r];return null},e.prototype.containsPointPolygon=function(t,e,n){for(var r=t,a=t.length,i=a-2,o=!1,s=0;s<a;s+=2){var h=r[s+1],l=r[i+1];if(h<n&&l>=n||l<n&&h>=n){var u=r[s];u+(n-h)/(l-h)*(r[i]-u)<e&&(o=!o)}i=s}return o},e.prototype.intersectsSegment=function(t,e,n,r){for(var a=this.polygons,i=0,o=a.length;i<o;i++)if(this.intersectsSegmentPolygon(a[i],t,e,n,r))return this.boundingBoxes[i];return null},e.prototype.intersectsSegmentPolygon=function(t,e,n,r,a){for(var i=t,o=t.length,s=e-r,h=n-a,l=e*a-n*r,u=i[o-2],c=i[o-1],f=0;f<o;f+=2){var d=i[f],p=i[f+1],m=u*p-c*d,v=u-d,g=c-p,y=s*g-h*v,E=(l*v-s*m)/y;if((E>=u&&E<=d||E>=d&&E<=u)&&(E>=e&&E<=r||E>=r&&E<=e)){var w=(l*g-h*m)/y;if((w>=c&&w<=p||w>=p&&w<=c)&&(w>=n&&w<=a||w>=a&&w<=n))return!0}u=d,c=p}return!1},e.prototype.getPolygon=function(t){if(null==t)throw new Error("boundingBox cannot be null.");var e=this.boundingBoxes.indexOf(t);return-1==e?null:this.polygons[e]},e.prototype.getWidth=function(){return this.maxX-this.minX},e.prototype.getHeight=function(){return this.maxY-this.minY},e}();t.SkeletonBounds=e}(a||(a={})),function(t){var e=function(){function e(){this.triangulator=new t.Triangulator,this.clippingPolygon=new Array,this.clipOutput=new Array,this.clippedVertices=new Array,this.clippedTriangles=new Array,this.scratch=new Array}return e.prototype.clipStart=function(n,r){if(null!=this.clipAttachment)return 0;this.clipAttachment=r;var a=r.worldVerticesLength,i=t.Utils.setArraySize(this.clippingPolygon,a);r.computeWorldVertices(n,0,a,i,0,2);var o=this.clippingPolygon;e.makeClockwise(o);for(var s=this.clippingPolygons=this.triangulator.decompose(o,this.triangulator.triangulate(o)),h=0,l=s.length;h<l;h++){var u=s[h];e.makeClockwise(u),u.push(u[0]),u.push(u[1])}return s.length},e.prototype.clipEndWithSlot=function(t){null!=this.clipAttachment&&this.clipAttachment.endSlot==t.data&&this.clipEnd()},e.prototype.clipEnd=function(){null!=this.clipAttachment&&(this.clipAttachment=null,this.clippingPolygons=null,this.clippedVertices.length=0,this.clippedTriangles.length=0,this.clippingPolygon.length=0)},e.prototype.isClipping=function(){return null!=this.clipAttachment},e.prototype.clipTriangles=function(e,n,r,a,i,o,s,h){var l=this.clipOutput,u=this.clippedVertices,c=this.clippedTriangles,f=this.clippingPolygons,d=this.clippingPolygons.length,p=h?12:8,m=0;u.length=0,c.length=0;t:for(var v=0;v<a;v+=3)for(var g=r[v]<<1,y=e[g],E=e[g+1],w=i[g],x=i[g+1],T=e[g=r[v+1]<<1],A=e[g+1],M=i[g],I=i[g+1],b=e[g=r[v+2]<<1],R=e[g+1],S=i[g],C=i[g+1],P=0;P<d;P++){var k=u.length;if(!this.clip(y,E,T,A,b,R,f[P],l)){(B=t.Utils.setArraySize(u,k+3*p))[k]=y,B[k+1]=E,B[k+2]=o.r,B[k+3]=o.g,B[k+4]=o.b,B[k+5]=o.a,h?(B[k+6]=w,B[k+7]=x,B[k+8]=s.r,B[k+9]=s.g,B[k+10]=s.b,B[k+11]=s.a,B[k+12]=T,B[k+13]=A,B[k+14]=o.r,B[k+15]=o.g,B[k+16]=o.b,B[k+17]=o.a,B[k+18]=M,B[k+19]=I,B[k+20]=s.r,B[k+21]=s.g,B[k+22]=s.b,B[k+23]=s.a,B[k+24]=b,B[k+25]=R,B[k+26]=o.r,B[k+27]=o.g,B[k+28]=o.b,B[k+29]=o.a,B[k+30]=S,B[k+31]=C,B[k+32]=s.r,B[k+33]=s.g,B[k+34]=s.b,B[k+35]=s.a):(B[k+6]=w,B[k+7]=x,B[k+8]=T,B[k+9]=A,B[k+10]=o.r,B[k+11]=o.g,B[k+12]=o.b,B[k+13]=o.a,B[k+14]=M,B[k+15]=I,B[k+16]=b,B[k+17]=R,B[k+18]=o.r,B[k+19]=o.g,B[k+20]=o.b,B[k+21]=o.a,B[k+22]=S,B[k+23]=C),k=c.length,(Z=t.Utils.setArraySize(c,k+3))[k]=m,Z[k+1]=m+1,Z[k+2]=m+2,m+=3;continue t}var N=l.length;if(0!=N){for(var _=A-R,V=b-T,L=y-b,O=R-E,F=1/(_*L+V*(E-R)),D=N>>1,U=this.clipOutput,B=t.Utils.setArraySize(u,k+D*p),X=0;X<N;X+=2){var Y=U[X],W=U[X+1];B[k]=Y,B[k+1]=W,B[k+2]=o.r,B[k+3]=o.g,B[k+4]=o.b,B[k+5]=o.a;var j=Y-b,G=W-R,q=(_*j+V*G)*F,H=(O*j+L*G)*F,z=1-q-H;B[k+6]=w*q+M*H+S*z,B[k+7]=x*q+I*H+C*z,h&&(B[k+8]=s.r,B[k+9]=s.g,B[k+10]=s.b,B[k+11]=s.a),k+=p}k=c.length;var Z=t.Utils.setArraySize(c,k+3*(D-2));D--;for(X=1;X<D;X++)Z[k]=m,Z[k+1]=m+X,Z[k+2]=m+X+1,k+=3;m+=D+1}}},e.prototype.clip=function(t,e,n,r,a,i,o,s){var h=s,l=!1,u=null;o.length%4>=2?(u=s,s=this.scratch):u=this.scratch,u.length=0,u.push(t),u.push(e),u.push(n),u.push(r),u.push(a),u.push(i),u.push(t),u.push(e),s.length=0;for(var c=o,f=o.length-4,d=0;;d+=2){for(var p=c[d],m=c[d+1],v=c[d+2],g=c[d+3],y=p-v,E=m-g,w=u,x=u.length-2,T=s.length,A=0;A<x;A+=2){var M=w[A],I=w[A+1],b=w[A+2],R=w[A+3],S=y*(R-g)-E*(b-v)>0;if(y*(I-g)-E*(M-v)>0){if(S){s.push(b),s.push(R);continue}var C=(k=R-I)*(v-p)-(N=b-M)*(g-m);if(Math.abs(C)>1e-6){var P=(N*(m-I)-k*(p-M))/C;s.push(p+(v-p)*P),s.push(m+(g-m)*P)}else s.push(p),s.push(m)}else if(S){var k,N;C=(k=R-I)*(v-p)-(N=b-M)*(g-m);if(Math.abs(C)>1e-6){P=(N*(m-I)-k*(p-M))/C;s.push(p+(v-p)*P),s.push(m+(g-m)*P)}else s.push(p),s.push(m);s.push(b),s.push(R)}l=!0}if(T==s.length)return h.length=0,!0;if(s.push(s[0]),s.push(s[1]),d==f)break;var _=s;(s=u).length=0,u=_}if(h!=s){h.length=0;d=0;for(var V=s.length-2;d<V;d++)h[d]=s[d]}else h.length=h.length-2;return l},e.makeClockwise=function(t){for(var e=t,n=t.length,r=e[n-2]*e[1]-e[0]*e[n-1],a=0,i=0,o=0,s=0,h=n-3;s<h;s+=2)a=e[s],i=e[s+1],o=e[s+2],r+=a*e[s+3]-o*i;if(!(r<0)){s=0;var l=n-2;for(h=n>>1;s<h;s+=2){var u=e[s],c=e[s+1],f=l-s;e[s]=e[f],e[s+1]=e[f+1],e[f]=u,e[f+1]=c}}},e}();t.SkeletonClipping=e}(a||(a={})),function(t){var e=function(){function t(){this.bones=new Array,this.slots=new Array,this.skins=new Array,this.events=new Array,this.animations=new Array,this.ikConstraints=new Array,this.transformConstraints=new Array,this.pathConstraints=new Array,this.fps=0}return t.prototype.findBone=function(t){if(null==t)throw new Error("boneName cannot be null.");for(var e=this.bones,n=0,r=e.length;n<r;n++){var a=e[n];if(a.name==t)return a}return null},t.prototype.findBoneIndex=function(t){if(null==t)throw new Error("boneName cannot be null.");for(var e=this.bones,n=0,r=e.length;n<r;n++)if(e[n].name==t)return n;return-1},t.prototype.findSlot=function(t){if(null==t)throw new Error("slotName cannot be null.");for(var e=this.slots,n=0,r=e.length;n<r;n++){var a=e[n];if(a.name==t)return a}return null},t.prototype.findSlotIndex=function(t){if(null==t)throw new Error("slotName cannot be null.");for(var e=this.slots,n=0,r=e.length;n<r;n++)if(e[n].name==t)return n;return-1},t.prototype.findSkin=function(t){if(null==t)throw new Error("skinName cannot be null.");for(var e=this.skins,n=0,r=e.length;n<r;n++){var a=e[n];if(a.name==t)return a}return null},t.prototype.findEvent=function(t){if(null==t)throw new Error("eventDataName cannot be null.");for(var e=this.events,n=0,r=e.length;n<r;n++){var a=e[n];if(a.name==t)return a}return null},t.prototype.findAnimation=function(t){if(null==t)throw new Error("animationName cannot be null.");for(var e=this.animations,n=0,r=e.length;n<r;n++){var a=e[n];if(a.name==t)return a}return null},t.prototype.findIkConstraint=function(t){if(null==t)throw new Error("constraintName cannot be null.");for(var e=this.ikConstraints,n=0,r=e.length;n<r;n++){var a=e[n];if(a.name==t)return a}return null},t.prototype.findTransformConstraint=function(t){if(null==t)throw new Error("constraintName cannot be null.");for(var e=this.transformConstraints,n=0,r=e.length;n<r;n++){var a=e[n];if(a.name==t)return a}return null},t.prototype.findPathConstraint=function(t){if(null==t)throw new Error("constraintName cannot be null.");for(var e=this.pathConstraints,n=0,r=e.length;n<r;n++){var a=e[n];if(a.name==t)return a}return null},t.prototype.findPathConstraintIndex=function(t){if(null==t)throw new Error("pathConstraintName cannot be null.");for(var e=this.pathConstraints,n=0,r=e.length;n<r;n++)if(e[n].name==t)return n;return-1},t}();t.SkeletonData=e}(a||(a={})),function(t){var e=function(){function e(t){this.scale=1,this.linkedMeshes=new Array,this.attachmentLoader=t}return e.prototype.readSkeletonData=function(n){var r=this.scale,a=new t.SkeletonData,i="string"==typeof n?JSON.parse(n):n,o=i.skeleton;if(null!=o){if(a.hash=o.hash,a.version=o.spine,"3.8.75"==a.version)throw new Error("Unsupported skeleton data, please export with a newer version of Spine.");a.x=o.x,a.y=o.y,a.width=o.width,a.height=o.height,a.fps=o.fps,a.imagesPath=o.images}if(i.bones)for(var s=0;s<i.bones.length;s++){var h=i.bones[s],l=null,u=this.getValue(h,"parent",null);if(null!=u&&null==(l=a.findBone(u)))throw new Error("Parent bone not found: "+u);(p=new t.BoneData(a.bones.length,h.name,l)).length=this.getValue(h,"length",0)*r,p.x=this.getValue(h,"x",0)*r,p.y=this.getValue(h,"y",0)*r,p.rotation=this.getValue(h,"rotation",0),p.scaleX=this.getValue(h,"scaleX",1),p.scaleY=this.getValue(h,"scaleY",1),p.shearX=this.getValue(h,"shearX",0),p.shearY=this.getValue(h,"shearY",0),p.transformMode=e.transformModeFromString(this.getValue(h,"transform","normal")),p.skinRequired=this.getValue(h,"skin",!1),a.bones.push(p)}if(i.slots)for(s=0;s<i.slots.length;s++){var c=(b=i.slots[s]).name,f=b.bone,d=a.findBone(f);if(null==d)throw new Error("Slot bone not found: "+f);var p=new t.SlotData(a.slots.length,c,d),m=this.getValue(b,"color",null);null!=m&&p.color.setFromString(m);var v=this.getValue(b,"dark",null);null!=v&&(p.darkColor=new t.Color(1,1,1,1),p.darkColor.setFromString(v)),p.attachmentName=this.getValue(b,"attachment",null),p.blendMode=e.blendModeFromString(this.getValue(b,"blend","normal")),a.slots.push(p)}if(i.ik)for(s=0;s<i.ik.length;s++){var g=i.ik[s];(p=new t.IkConstraintData(g.name)).order=this.getValue(g,"order",0),p.skinRequired=this.getValue(g,"skin",!1);for(var y=0;y<g.bones.length;y++){f=g.bones[y];if(null==(A=a.findBone(f)))throw new Error("IK bone not found: "+f);p.bones.push(A)}var E=g.target;if(p.target=a.findBone(E),null==p.target)throw new Error("IK target bone not found: "+E);p.mix=this.getValue(g,"mix",1),p.softness=this.getValue(g,"softness",0)*r,p.bendDirection=this.getValue(g,"bendPositive",!0)?1:-1,p.compress=this.getValue(g,"compress",!1),p.stretch=this.getValue(g,"stretch",!1),p.uniform=this.getValue(g,"uniform",!1),a.ikConstraints.push(p)}if(i.transform)for(s=0;s<i.transform.length;s++){g=i.transform[s];(p=new t.TransformConstraintData(g.name)).order=this.getValue(g,"order",0),p.skinRequired=this.getValue(g,"skin",!1);for(y=0;y<g.bones.length;y++){f=g.bones[y];if(null==(A=a.findBone(f)))throw new Error("Transform constraint bone not found: "+f);p.bones.push(A)}E=g.target;if(p.target=a.findBone(E),null==p.target)throw new Error("Transform constraint target bone not found: "+E);p.local=this.getValue(g,"local",!1),p.relative=this.getValue(g,"relative",!1),p.offsetRotation=this.getValue(g,"rotation",0),p.offsetX=this.getValue(g,"x",0)*r,p.offsetY=this.getValue(g,"y",0)*r,p.offsetScaleX=this.getValue(g,"scaleX",0),p.offsetScaleY=this.getValue(g,"scaleY",0),p.offsetShearY=this.getValue(g,"shearY",0),p.rotateMix=this.getValue(g,"rotateMix",1),p.translateMix=this.getValue(g,"translateMix",1),p.scaleMix=this.getValue(g,"scaleMix",1),p.shearMix=this.getValue(g,"shearMix",1),a.transformConstraints.push(p)}if(i.path)for(s=0;s<i.path.length;s++){g=i.path[s];(p=new t.PathConstraintData(g.name)).order=this.getValue(g,"order",0),p.skinRequired=this.getValue(g,"skin",!1);for(y=0;y<g.bones.length;y++){f=g.bones[y];if(null==(A=a.findBone(f)))throw new Error("Transform constraint bone not found: "+f);p.bones.push(A)}E=g.target;if(p.target=a.findSlot(E),null==p.target)throw new Error("Path target slot not found: "+E);p.positionMode=e.positionModeFromString(this.getValue(g,"positionMode","percent")),p.spacingMode=e.spacingModeFromString(this.getValue(g,"spacingMode","length")),p.rotateMode=e.rotateModeFromString(this.getValue(g,"rotateMode","tangent")),p.offsetRotation=this.getValue(g,"rotation",0),p.position=this.getValue(g,"position",0),p.positionMode==t.PositionMode.Fixed&&(p.position*=r),p.spacing=this.getValue(g,"spacing",0),p.spacingMode!=t.SpacingMode.Length&&p.spacingMode!=t.SpacingMode.Fixed||(p.spacing*=r),p.rotateMix=this.getValue(g,"rotateMix",1),p.translateMix=this.getValue(g,"translateMix",1),a.pathConstraints.push(p)}if(i.skins)for(s=0;s<i.skins.length;s++){var w=i.skins[s],x=new t.Skin(w.name);if(w.bones)for(var T=0;T<w.bones.length;T++){var A;if(null==(A=a.findBone(w.bones[T])))throw new Error("Skin bone not found: "+w.bones[s]);x.bones.push(A)}if(w.ik)for(T=0;T<w.ik.length;T++){if(null==(M=a.findIkConstraint(w.ik[T])))throw new Error("Skin IK constraint not found: "+w.ik[s]);x.constraints.push(M)}if(w.transform)for(T=0;T<w.transform.length;T++){if(null==(M=a.findTransformConstraint(w.transform[T])))throw new Error("Skin transform constraint not found: "+w.transform[s]);x.constraints.push(M)}if(w.path)for(T=0;T<w.path.length;T++){var M;if(null==(M=a.findPathConstraint(w.path[T])))throw new Error("Skin path constraint not found: "+w.path[s]);x.constraints.push(M)}for(var c in w.attachments){var I=a.findSlot(c);if(null==I)throw new Error("Slot not found: "+c);var b=w.attachments[c];for(var R in b){var S=this.readAttachment(b[R],x,I.index,R,a);null!=S&&x.setAttachment(I.index,R,S)}}a.skins.push(x),"default"==x.name&&(a.defaultSkin=x)}s=0;for(var C=this.linkedMeshes.length;s<C;s++){var P=this.linkedMeshes[s];if(null==(x=null==P.skin?a.defaultSkin:a.findSkin(P.skin)))throw new Error("Skin not found: "+P.skin);var k=x.getAttachment(P.slotIndex,P.parent);if(null==k)throw new Error("Parent mesh not found: "+P.parent);P.mesh.deformAttachment=P.inheritDeform?k:P.mesh,P.mesh.setParentMesh(k),P.mesh.updateUVs()}if(this.linkedMeshes.length=0,i.events)for(var N in i.events){var _=i.events[N];(p=new t.EventData(N)).intValue=this.getValue(_,"int",0),p.floatValue=this.getValue(_,"float",0),p.stringValue=this.getValue(_,"string",""),p.audioPath=this.getValue(_,"audio",null),null!=p.audioPath&&(p.volume=this.getValue(_,"volume",1),p.balance=this.getValue(_,"balance",0)),a.events.push(p)}if(i.animations)for(var V in i.animations){var L=i.animations[V];this.readAnimation(L,V,a)}return a},e.prototype.readAttachment=function(e,r,a,i,o){var s=this.scale;switch(i=this.getValue(e,"name",i),this.getValue(e,"type","region")){case"region":var h=this.getValue(e,"path",i),l=this.attachmentLoader.newRegionAttachment(r,i,h);return null==l?null:(l.path=h,l.x=this.getValue(e,"x",0)*s,l.y=this.getValue(e,"y",0)*s,l.scaleX=this.getValue(e,"scaleX",1),l.scaleY=this.getValue(e,"scaleY",1),l.rotation=this.getValue(e,"rotation",0),l.width=e.width*s,l.height=e.height*s,null!=(x=this.getValue(e,"color",null))&&l.color.setFromString(x),l.updateOffset(),l);case"boundingbox":var u=this.attachmentLoader.newBoundingBoxAttachment(r,i);return null==u?null:(this.readVertices(e,u,e.vertexCount<<1),null!=(x=this.getValue(e,"color",null))&&u.color.setFromString(x),u);case"mesh":case"linkedmesh":h=this.getValue(e,"path",i);var c=this.attachmentLoader.newMeshAttachment(r,i,h);if(null==c)return null;c.path=h,null!=(x=this.getValue(e,"color",null))&&c.color.setFromString(x),c.width=this.getValue(e,"width",0)*s,c.height=this.getValue(e,"height",0)*s;var f=this.getValue(e,"parent",null);if(null!=f)return this.linkedMeshes.push(new n(c,this.getValue(e,"skin",null),a,f,this.getValue(e,"deform",!0))),c;var d=e.uvs;return this.readVertices(e,c,d.length),c.triangles=e.triangles,c.regionUVs=d,c.updateUVs(),c.edges=this.getValue(e,"edges",null),c.hullLength=2*this.getValue(e,"hull",0),c;case"path":if(null==(h=this.attachmentLoader.newPathAttachment(r,i)))return null;h.closed=this.getValue(e,"closed",!1),h.constantSpeed=this.getValue(e,"constantSpeed",!0);var p=e.vertexCount;this.readVertices(e,h,p<<1);for(var m=t.Utils.newArray(p/3,0),v=0;v<e.lengths.length;v++)m[v]=e.lengths[v]*s;return h.lengths=m,null!=(x=this.getValue(e,"color",null))&&h.color.setFromString(x),h;case"point":var g=this.attachmentLoader.newPointAttachment(r,i);return null==g?null:(g.x=this.getValue(e,"x",0)*s,g.y=this.getValue(e,"y",0)*s,g.rotation=this.getValue(e,"rotation",0),null!=(x=this.getValue(e,"color",null))&&g.color.setFromString(x),g);case"clipping":var y=this.attachmentLoader.newClippingAttachment(r,i);if(null==y)return null;var E=this.getValue(e,"end",null);if(null!=E){var w=o.findSlot(E);if(null==w)throw new Error("Clipping end slot not found: "+E);y.endSlot=w}var x;p=e.vertexCount;return this.readVertices(e,y,p<<1),null!=(x=this.getValue(e,"color",null))&&y.color.setFromString(x),y}return null},e.prototype.readVertices=function(e,n,r){var a=this.scale;n.worldVerticesLength=r;var i=e.vertices;if(r!=i.length){var o=new Array,s=new Array;for(c=0,f=i.length;c<f;){var h=i[c++];s.push(h);for(var l=c+4*h;c<l;c+=4)s.push(i[c]),o.push(i[c+1]*a),o.push(i[c+2]*a),o.push(i[c+3])}n.bones=s,n.vertices=t.Utils.toFloatArray(o)}else{var u=t.Utils.toFloatArray(i);if(1!=a)for(var c=0,f=i.length;c<f;c++)u[c]*=a;n.vertices=u}},e.prototype.readAnimation=function(e,n,r){var a=this.scale,i=new Array,o=0;if(e.slots)for(var s in e.slots){var h=e.slots[s];if(-1==($=r.findSlotIndex(s)))throw new Error("Slot not found: "+s);for(var l in h){var u=h[l];if("attachment"==l){(w=new t.AttachmentTimeline(u.length)).slotIndex=$;for(var c=0,f=0;f<u.length;f++){var d=u[f];w.setFrame(c++,this.getValue(d,"time",0),d.name)}i.push(w),o=Math.max(o,w.frames[w.getFrameCount()-1])}else if("color"==l){(w=new t.ColorTimeline(u.length)).slotIndex=$;for(c=0,f=0;f<u.length;f++){d=u[f];var p=new t.Color;p.setFromString(d.color),w.setFrame(c,this.getValue(d,"time",0),p.r,p.g,p.b,p.a),this.readCurve(d,w,c),c++}i.push(w),o=Math.max(o,w.frames[(w.getFrameCount()-1)*t.ColorTimeline.ENTRIES])}else{if("twoColor"!=l)throw new Error("Invalid timeline type for a slot: "+l+" ("+s+")");(w=new t.TwoColorTimeline(u.length)).slotIndex=$;for(c=0,f=0;f<u.length;f++){d=u[f];var m=new t.Color,v=new t.Color;m.setFromString(d.light),v.setFromString(d.dark),w.setFrame(c,this.getValue(d,"time",0),m.r,m.g,m.b,m.a,v.r,v.g,v.b),this.readCurve(d,w,c),c++}i.push(w),o=Math.max(o,w.frames[(w.getFrameCount()-1)*t.TwoColorTimeline.ENTRIES])}}}if(e.bones)for(var g in e.bones){var y=e.bones[g],E=r.findBoneIndex(g);if(-1==E)throw new Error("Bone not found: "+g);for(var l in y){u=y[l];if("rotate"===l){(w=new t.RotateTimeline(u.length)).boneIndex=E;for(c=0,f=0;f<u.length;f++){d=u[f];w.setFrame(c,this.getValue(d,"time",0),this.getValue(d,"angle",0)),this.readCurve(d,w,c),c++}i.push(w),o=Math.max(o,w.frames[(w.getFrameCount()-1)*t.RotateTimeline.ENTRIES])}else{if("translate"!==l&&"scale"!==l&&"shear"!==l)throw new Error("Invalid timeline type for a bone: "+l+" ("+g+")");var w=null,x=1,T=0;"scale"===l?(w=new t.ScaleTimeline(u.length),T=1):"shear"===l?w=new t.ShearTimeline(u.length):(w=new t.TranslateTimeline(u.length),x=a),w.boneIndex=E;for(c=0,f=0;f<u.length;f++){d=u[f];var A=this.getValue(d,"x",T),M=this.getValue(d,"y",T);w.setFrame(c,this.getValue(d,"time",0),A*x,M*x),this.readCurve(d,w,c),c++}i.push(w),o=Math.max(o,w.frames[(w.getFrameCount()-1)*t.TranslateTimeline.ENTRIES])}}}if(e.ik)for(var I in e.ik){var b=e.ik[I],R=r.findIkConstraint(I);(w=new t.IkConstraintTimeline(b.length)).ikConstraintIndex=r.ikConstraints.indexOf(R);for(c=0,f=0;f<b.length;f++){d=b[f];w.setFrame(c,this.getValue(d,"time",0),this.getValue(d,"mix",1),this.getValue(d,"softness",0)*a,this.getValue(d,"bendPositive",!0)?1:-1,this.getValue(d,"compress",!1),this.getValue(d,"stretch",!1)),this.readCurve(d,w,c),c++}i.push(w),o=Math.max(o,w.frames[(w.getFrameCount()-1)*t.IkConstraintTimeline.ENTRIES])}if(e.transform)for(var I in e.transform){b=e.transform[I],R=r.findTransformConstraint(I);(w=new t.TransformConstraintTimeline(b.length)).transformConstraintIndex=r.transformConstraints.indexOf(R);for(c=0,f=0;f<b.length;f++){d=b[f];w.setFrame(c,this.getValue(d,"time",0),this.getValue(d,"rotateMix",1),this.getValue(d,"translateMix",1),this.getValue(d,"scaleMix",1),this.getValue(d,"shearMix",1)),this.readCurve(d,w,c),c++}i.push(w),o=Math.max(o,w.frames[(w.getFrameCount()-1)*t.TransformConstraintTimeline.ENTRIES])}if(e.path)for(var I in e.path){b=e.path[I];var S=r.findPathConstraintIndex(I);if(-1==S)throw new Error("Path constraint not found: "+I);var C=r.pathConstraints[S];for(var l in b){u=b[l];if("position"===l||"spacing"===l){w=null,x=1;"spacing"===l?(w=new t.PathConstraintSpacingTimeline(u.length),C.spacingMode!=t.SpacingMode.Length&&C.spacingMode!=t.SpacingMode.Fixed||(x=a)):(w=new t.PathConstraintPositionTimeline(u.length),C.positionMode==t.PositionMode.Fixed&&(x=a)),w.pathConstraintIndex=S;for(c=0,f=0;f<u.length;f++){d=u[f];w.setFrame(c,this.getValue(d,"time",0),this.getValue(d,l,0)*x),this.readCurve(d,w,c),c++}i.push(w),o=Math.max(o,w.frames[(w.getFrameCount()-1)*t.PathConstraintPositionTimeline.ENTRIES])}else if("mix"===l){(w=new t.PathConstraintMixTimeline(u.length)).pathConstraintIndex=S;for(c=0,f=0;f<u.length;f++){d=u[f];w.setFrame(c,this.getValue(d,"time",0),this.getValue(d,"rotateMix",1),this.getValue(d,"translateMix",1)),this.readCurve(d,w,c),c++}i.push(w),o=Math.max(o,w.frames[(w.getFrameCount()-1)*t.PathConstraintMixTimeline.ENTRIES])}}}if(e.deform)for(var P in e.deform){var k=e.deform[P],N=r.findSkin(P);if(null==N)throw new Error("Skin not found: "+P);for(var s in k){h=k[s];if(-1==($=r.findSlotIndex(s)))throw new Error("Slot not found: "+h.name);for(var l in h){u=h[l];var _=N.getAttachment($,l);if(null==_)throw new Error("Deform attachment not found: "+u.name);var V=null!=_.bones,L=_.vertices,O=V?L.length/3*2:L.length;(w=new t.DeformTimeline(u.length)).slotIndex=$,w.attachment=_;c=0;for(var F=0;F<u.length;F++){d=u[F];var D=void 0,U=this.getValue(d,"vertices",null);if(null==U)D=V?t.Utils.newFloatArray(O):L;else{D=t.Utils.newFloatArray(O);var B=this.getValue(d,"offset",0);if(t.Utils.arrayCopy(U,0,D,B,U.length),1!=a)for(var X=(f=B)+U.length;f<X;f++)D[f]*=a;if(!V)for(f=0;f<O;f++)D[f]+=L[f]}w.setFrame(c,this.getValue(d,"time",0),D),this.readCurve(d,w,c),c++}i.push(w),o=Math.max(o,w.frames[w.getFrameCount()-1])}}}var Y=e.drawOrder;if(null==Y&&(Y=e.draworder),null!=Y){w=new t.DrawOrderTimeline(Y.length);var W=r.slots.length;for(c=0,F=0;F<Y.length;F++){var j=Y[F],G=null,q=this.getValue(j,"offsets",null);if(null!=q){G=t.Utils.newArray(W,-1);var H=t.Utils.newArray(W-q.length,0),z=0,Z=0;for(f=0;f<q.length;f++){var $,Q=q[f];if(-1==($=r.findSlotIndex(Q.slot)))throw new Error("Slot not found: "+Q.slot);for(;z!=$;)H[Z++]=z++;G[z+Q.offset]=z++}for(;z<W;)H[Z++]=z++;for(f=W-1;f>=0;f--)-1==G[f]&&(G[f]=H[--Z])}w.setFrame(c++,this.getValue(j,"time",0),G)}i.push(w),o=Math.max(o,w.frames[w.getFrameCount()-1])}if(e.events){for(w=new t.EventTimeline(e.events.length),c=0,f=0;f<e.events.length;f++){var J=e.events[f],K=r.findEvent(J.name);if(null==K)throw new Error("Event not found: "+J.name);var tt=new t.Event(t.Utils.toSinglePrecision(this.getValue(J,"time",0)),K);tt.intValue=this.getValue(J,"int",K.intValue),tt.floatValue=this.getValue(J,"float",K.floatValue),tt.stringValue=this.getValue(J,"string",K.stringValue),null!=tt.data.audioPath&&(tt.volume=this.getValue(J,"volume",1),tt.balance=this.getValue(J,"balance",0)),w.setFrame(c++,tt)}i.push(w),o=Math.max(o,w.frames[w.getFrameCount()-1])}if(isNaN(o))throw new Error("Error while parsing animation, duration is NaN");r.animations.push(new t.Animation(n,i,o))},e.prototype.readCurve=function(t,e,n){if(t.hasOwnProperty("curve"))if("stepped"==t.curve)e.setStepped(n);else{var r=t.curve;e.setCurve(n,r,this.getValue(t,"c2",0),this.getValue(t,"c3",1),this.getValue(t,"c4",1))}},e.prototype.getValue=function(t,e,n){return void 0!==t[e]?t[e]:n},e.blendModeFromString=function(e){if("normal"==(e=e.toLowerCase()))return t.BlendMode.Normal;if("additive"==e)return t.BlendMode.Additive;if("multiply"==e)return t.BlendMode.Multiply;if("screen"==e)return t.BlendMode.Screen;throw new Error("Unknown blend mode: "+e)},e.positionModeFromString=function(e){if("fixed"==(e=e.toLowerCase()))return t.PositionMode.Fixed;if("percent"==e)return t.PositionMode.Percent;throw new Error("Unknown position mode: "+e)},e.spacingModeFromString=function(e){if("length"==(e=e.toLowerCase()))return t.SpacingMode.Length;if("fixed"==e)return t.SpacingMode.Fixed;if("percent"==e)return t.SpacingMode.Percent;throw new Error("Unknown position mode: "+e)},e.rotateModeFromString=function(e){if("tangent"==(e=e.toLowerCase()))return t.RotateMode.Tangent;if("chain"==e)return t.RotateMode.Chain;if("chainscale"==e)return t.RotateMode.ChainScale;throw new Error("Unknown rotate mode: "+e)},e.transformModeFromString=function(e){if("normal"==(e=e.toLowerCase()))return t.TransformMode.Normal;if("onlytranslation"==e)return t.TransformMode.OnlyTranslation;if("norotationorreflection"==e)return t.TransformMode.NoRotationOrReflection;if("noscale"==e)return t.TransformMode.NoScale;if("noscaleorreflection"==e)return t.TransformMode.NoScaleOrReflection;throw new Error("Unknown transform mode: "+e)},e}();t.SkeletonJson=e;var n=function(t,e,n,r,a){this.mesh=t,this.skin=e,this.slotIndex=n,this.parent=r,this.inheritDeform=a}}(a||(a={})),function(t){var e=function(t,e,n){this.slotIndex=t,this.name=e,this.attachment=n};t.SkinEntry=e;var n=function(){function n(t){if(this.attachments=new Array,this.bones=Array(),this.constraints=new Array,null==t)throw new Error("name cannot be null.");this.name=t}return n.prototype.setAttachment=function(t,e,n){if(null==n)throw new Error("attachment cannot be null.");var r=this.attachments;t>=r.length&&(r.length=t+1),r[t]||(r[t]={}),r[t][e]=n},n.prototype.addSkin=function(t){for(var e=0;e<t.bones.length;e++){for(var n=t.bones[e],r=!1,a=0;a<this.bones.length;a++)if(this.bones[a]==n){r=!0;break}r||this.bones.push(n)}for(e=0;e<t.constraints.length;e++){var i=t.constraints[e];for(r=!1,a=0;a<this.constraints.length;a++)if(this.constraints[a]==i){r=!0;break}r||this.constraints.push(i)}var o=t.getAttachments();for(e=0;e<o.length;e++){var s=o[e];this.setAttachment(s.slotIndex,s.name,s.attachment)}},n.prototype.copySkin=function(e){for(var n=0;n<e.bones.length;n++){for(var r=e.bones[n],a=!1,i=0;i<this.bones.length;i++)if(this.bones[i]==r){a=!0;break}a||this.bones.push(r)}for(n=0;n<e.constraints.length;n++){var o=e.constraints[n];for(a=!1,i=0;i<this.constraints.length;i++)if(this.constraints[i]==o){a=!0;break}a||this.constraints.push(o)}var s=e.getAttachments();for(n=0;n<s.length;n++){var h=s[n];null!=h.attachment&&(h.attachment instanceof t.MeshAttachment?(h.attachment=h.attachment.newLinkedMesh(),this.setAttachment(h.slotIndex,h.name,h.attachment)):(h.attachment=h.attachment.copy(),this.setAttachment(h.slotIndex,h.name,h.attachment)))}},n.prototype.getAttachment=function(t,e){var n=this.attachments[t];return n?n[e]:null},n.prototype.removeAttachment=function(t,e){var n=this.attachments[t];n&&(n[e]=null)},n.prototype.getAttachments=function(){for(var t=new Array,n=0;n<this.attachments.length;n++){var r=this.attachments[n];if(r)for(var a in r){var i=r[a];i&&t.push(new e(n,a,i))}}return t},n.prototype.getAttachmentsForSlot=function(t,n){var r=this.attachments[t];if(r)for(var a in r){var i=r[a];i&&n.push(new e(t,a,i))}},n.prototype.clear=function(){this.attachments.length=0,this.bones.length=0,this.constraints.length=0},n.prototype.attachAll=function(t,e){for(var n=0,r=0;r<t.slots.length;r++){var a=t.slots[r],i=a.getAttachment();if(i&&n<e.attachments.length){var o=e.attachments[n];for(var s in o){if(i==o[s]){var h=this.getAttachment(n,s);null!=h&&a.setAttachment(h);break}}}n++}},n}();t.Skin=n}(a||(a={})),function(t){var e=function(){function e(e,n){if(this.deform=new Array,null==e)throw new Error("data cannot be null.");if(null==n)throw new Error("bone cannot be null.");this.data=e,this.bone=n,this.color=new t.Color,this.darkColor=null==e.darkColor?null:new t.Color,this.setToSetupPose()}return e.prototype.getSkeleton=function(){return this.bone.skeleton},e.prototype.getAttachment=function(){return this.attachment},e.prototype.setAttachment=function(t){this.attachment!=t&&(this.attachment=t,this.attachmentTime=this.bone.skeleton.time,this.deform.length=0)},e.prototype.setAttachmentTime=function(t){this.attachmentTime=this.bone.skeleton.time-t},e.prototype.getAttachmentTime=function(){return this.bone.skeleton.time-this.attachmentTime},e.prototype.setToSetupPose=function(){this.color.setFromColor(this.data.color),null!=this.darkColor&&this.darkColor.setFromColor(this.data.darkColor),null==this.data.attachmentName?this.attachment=null:(this.attachment=null,this.setAttachment(this.bone.skeleton.getAttachment(this.data.index,this.data.attachmentName)))},e}();t.Slot=e}(a||(a={})),function(t){var e=function(e,n,r){if(this.color=new t.Color(1,1,1,1),e<0)throw new Error("index must be >= 0.");if(null==n)throw new Error("name cannot be null.");if(null==r)throw new Error("boneData cannot be null.");this.index=e,this.name=n,this.boneData=r};t.SlotData=e}(a||(a={})),function(t){var e,n,r=function(){function t(t){this._image=t}return t.prototype.getImage=function(){return this._image},t.filterFromString=function(t){switch(t.toLowerCase()){case"nearest":return e.Nearest;case"linear":return e.Linear;case"mipmap":return e.MipMap;case"mipmapnearestnearest":return e.MipMapNearestNearest;case"mipmaplinearnearest":return e.MipMapLinearNearest;case"mipmapnearestlinear":return e.MipMapNearestLinear;case"mipmaplinearlinear":return e.MipMapLinearLinear;default:throw new Error("Unknown texture filter "+t)}},t.wrapFromString=function(t){switch(t.toLowerCase()){case"mirroredtepeat":return n.MirroredRepeat;case"clamptoedge":return n.ClampToEdge;case"repeat":return n.Repeat;default:throw new Error("Unknown texture wrap "+t)}},t}();t.Texture=r,function(t){t[t.Nearest=9728]="Nearest",t[t.Linear=9729]="Linear",t[t.MipMap=9987]="MipMap",t[t.MipMapNearestNearest=9984]="MipMapNearestNearest",t[t.MipMapLinearNearest=9985]="MipMapLinearNearest",t[t.MipMapNearestLinear=9986]="MipMapNearestLinear",t[t.MipMapLinearLinear=9987]="MipMapLinearLinear"}(e=t.TextureFilter||(t.TextureFilter={})),function(t){t[t.MirroredRepeat=33648]="MirroredRepeat",t[t.ClampToEdge=33071]="ClampToEdge",t[t.Repeat=10497]="Repeat"}(n=t.TextureWrap||(t.TextureWrap={}));var a=function(){this.u=0,this.v=0,this.u2=0,this.v2=0,this.width=0,this.height=0,this.rotate=!1,this.offsetX=0,this.offsetY=0,this.originalWidth=0,this.originalHeight=0};t.TextureRegion=a;var i=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype.setFilters=function(t,e){},e.prototype.setWraps=function(t,e){},e.prototype.dispose=function(){},e}(r);t.FakeTexture=i}(a||(a={})),function(t){var e=function(){function e(t,e){this.pages=new Array,this.regions=new Array,this.load(t,e)}return e.prototype.load=function(e,i){if(null==i)throw new Error("textureLoader cannot be null.");for(var o=new n(e),s=new Array(4),h=null;;){var l=o.readLine();if(null==l)break;if(0==(l=l.trim()).length)h=null;else if(h){var u=new a;u.name=l,u.page=h;var c=o.readValue();"true"==c.toLocaleLowerCase()?u.degrees=90:"false"==c.toLocaleLowerCase()?u.degrees=0:u.degrees=parseFloat(c),u.rotate=90==u.degrees,o.readTuple(s);var f=parseInt(s[0]),d=parseInt(s[1]);o.readTuple(s);var p=parseInt(s[0]),m=parseInt(s[1]);u.u=f/h.width,u.v=d/h.height,u.rotate?(u.u2=(f+m)/h.width,u.v2=(d+p)/h.height):(u.u2=(f+p)/h.width,u.v2=(d+m)/h.height),u.x=f,u.y=d,u.width=Math.abs(p),u.height=Math.abs(m),4==o.readTuple(s)&&4==o.readTuple(s)&&o.readTuple(s),u.originalWidth=parseInt(s[0]),u.originalHeight=parseInt(s[1]),o.readTuple(s),u.offsetX=parseInt(s[0]),u.offsetY=parseInt(s[1]),u.index=parseInt(o.readValue()),u.texture=h.texture,this.regions.push(u)}else{(h=new r).name=l,2==o.readTuple(s)&&(h.width=parseInt(s[0]),h.height=parseInt(s[1]),o.readTuple(s)),o.readTuple(s),h.minFilter=t.Texture.filterFromString(s[0]),h.magFilter=t.Texture.filterFromString(s[1]);var v=o.readValue();h.uWrap=t.TextureWrap.ClampToEdge,h.vWrap=t.TextureWrap.ClampToEdge,"x"==v?h.uWrap=t.TextureWrap.Repeat:"y"==v?h.vWrap=t.TextureWrap.Repeat:"xy"==v&&(h.uWrap=h.vWrap=t.TextureWrap.Repeat),h.texture=i(l),h.texture.setFilters(h.minFilter,h.magFilter),h.texture.setWraps(h.uWrap,h.vWrap),h.width=h.texture.getImage().width,h.height=h.texture.getImage().height,this.pages.push(h)}}},e.prototype.findRegion=function(t){for(var e=0;e<this.regions.length;e++)if(this.regions[e].name==t)return this.regions[e];return null},e.prototype.dispose=function(){for(var t=0;t<this.pages.length;t++)this.pages[t].texture.dispose()},e}();t.TextureAtlas=e;var n=function(){function t(t){this.index=0,this.lines=t.split(/\r\n|\r|\n/)}return t.prototype.readLine=function(){return this.index>=this.lines.length?null:this.lines[this.index++]},t.prototype.readValue=function(){var t=this.readLine(),e=t.indexOf(":");if(-1==e)throw new Error("Invalid line: "+t);return t.substring(e+1).trim()},t.prototype.readTuple=function(t){var e=this.readLine(),n=e.indexOf(":");if(-1==n)throw new Error("Invalid line: "+e);for(var r=0,a=n+1;r<3;r++){var i=e.indexOf(",",a);if(-1==i)break;t[r]=e.substr(a,i-a).trim(),a=i+1}return t[r]=e.substring(a).trim(),r+1},t}(),r=function(){};t.TextureAtlasPage=r;var a=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e}(t.TextureRegion);t.TextureAtlasRegion=a}(a||(a={})),function(t){var e=function(){function e(e,n){if(this.rotateMix=0,this.translateMix=0,this.scaleMix=0,this.shearMix=0,this.temp=new t.Vector2,this.active=!1,null==e)throw new Error("data cannot be null.");if(null==n)throw new Error("skeleton cannot be null.");this.data=e,this.rotateMix=e.rotateMix,this.translateMix=e.translateMix,this.scaleMix=e.scaleMix,this.shearMix=e.shearMix,this.bones=new Array;for(var r=0;r<e.bones.length;r++)this.bones.push(n.findBone(e.bones[r].name));this.target=n.findBone(e.target.name)}return e.prototype.isActive=function(){return this.active},e.prototype.apply=function(){this.update()},e.prototype.update=function(){this.data.local?this.data.relative?this.applyRelativeLocal():this.applyAbsoluteLocal():this.data.relative?this.applyRelativeWorld():this.applyAbsoluteWorld()},e.prototype.applyAbsoluteWorld=function(){for(var e=this.rotateMix,n=this.translateMix,r=this.scaleMix,a=this.shearMix,i=this.target,o=i.a,s=i.b,h=i.c,l=i.d,u=o*l-s*h>0?t.MathUtils.degRad:-t.MathUtils.degRad,c=this.data.offsetRotation*u,f=this.data.offsetShearY*u,d=this.bones,p=0,m=d.length;p<m;p++){var v=d[p],g=!1;if(0!=e){var y=v.a,E=v.b,w=v.c,x=v.d;(R=Math.atan2(h,o)-Math.atan2(w,y)+c)>t.MathUtils.PI?R-=t.MathUtils.PI2:R<-t.MathUtils.PI&&(R+=t.MathUtils.PI2),R*=e;var T=Math.cos(R),A=Math.sin(R);v.a=T*y-A*w,v.b=T*E-A*x,v.c=A*y+T*w,v.d=A*E+T*x,g=!0}if(0!=n){var M=this.temp;i.localToWorld(M.set(this.data.offsetX,this.data.offsetY)),v.worldX+=(M.x-v.worldX)*n,v.worldY+=(M.y-v.worldY)*n,g=!0}if(r>0){var I=Math.sqrt(v.a*v.a+v.c*v.c),b=Math.sqrt(o*o+h*h);I>1e-5&&(I=(I+(b-I+this.data.offsetScaleX)*r)/I),v.a*=I,v.c*=I,I=Math.sqrt(v.b*v.b+v.d*v.d),b=Math.sqrt(s*s+l*l),I>1e-5&&(I=(I+(b-I+this.data.offsetScaleY)*r)/I),v.b*=I,v.d*=I,g=!0}if(a>0){E=v.b,x=v.d;var R,S=Math.atan2(x,E);(R=Math.atan2(l,s)-Math.atan2(h,o)-(S-Math.atan2(v.c,v.a)))>t.MathUtils.PI?R-=t.MathUtils.PI2:R<-t.MathUtils.PI&&(R+=t.MathUtils.PI2),R=S+(R+f)*a;I=Math.sqrt(E*E+x*x);v.b=Math.cos(R)*I,v.d=Math.sin(R)*I,g=!0}g&&(v.appliedValid=!1)}},e.prototype.applyRelativeWorld=function(){for(var e=this.rotateMix,n=this.translateMix,r=this.scaleMix,a=this.shearMix,i=this.target,o=i.a,s=i.b,h=i.c,l=i.d,u=o*l-s*h>0?t.MathUtils.degRad:-t.MathUtils.degRad,c=this.data.offsetRotation*u,f=this.data.offsetShearY*u,d=this.bones,p=0,m=d.length;p<m;p++){var v=d[p],g=!1;if(0!=e){var y=v.a,E=v.b,w=v.c,x=v.d;(b=Math.atan2(h,o)+c)>t.MathUtils.PI?b-=t.MathUtils.PI2:b<-t.MathUtils.PI&&(b+=t.MathUtils.PI2),b*=e;var T=Math.cos(b),A=Math.sin(b);v.a=T*y-A*w,v.b=T*E-A*x,v.c=A*y+T*w,v.d=A*E+T*x,g=!0}if(0!=n){var M=this.temp;i.localToWorld(M.set(this.data.offsetX,this.data.offsetY)),v.worldX+=M.x*n,v.worldY+=M.y*n,g=!0}if(r>0){var I=(Math.sqrt(o*o+h*h)-1+this.data.offsetScaleX)*r+1;v.a*=I,v.c*=I,I=(Math.sqrt(s*s+l*l)-1+this.data.offsetScaleY)*r+1,v.b*=I,v.d*=I,g=!0}if(a>0){var b;(b=Math.atan2(l,s)-Math.atan2(h,o))>t.MathUtils.PI?b-=t.MathUtils.PI2:b<-t.MathUtils.PI&&(b+=t.MathUtils.PI2);E=v.b,x=v.d;b=Math.atan2(x,E)+(b-t.MathUtils.PI/2+f)*a;I=Math.sqrt(E*E+x*x);v.b=Math.cos(b)*I,v.d=Math.sin(b)*I,g=!0}g&&(v.appliedValid=!1)}},e.prototype.applyAbsoluteLocal=function(){var t=this.rotateMix,e=this.translateMix,n=this.scaleMix,r=this.shearMix,a=this.target;a.appliedValid||a.updateAppliedTransform();for(var i=this.bones,o=0,s=i.length;o<s;o++){var h=i[o];h.appliedValid||h.updateAppliedTransform();var l=h.arotation;if(0!=t){var u=a.arotation-l+this.data.offsetRotation;l+=(u-=360*(16384-(16384.499999999996-u/360|0)))*t}var c=h.ax,f=h.ay;0!=e&&(c+=(a.ax-c+this.data.offsetX)*e,f+=(a.ay-f+this.data.offsetY)*e);var d=h.ascaleX,p=h.ascaleY;0!=n&&(d>1e-5&&(d=(d+(a.ascaleX-d+this.data.offsetScaleX)*n)/d),p>1e-5&&(p=(p+(a.ascaleY-p+this.data.offsetScaleY)*n)/p));var m=h.ashearY;if(0!=r){u=a.ashearY-m+this.data.offsetShearY;u-=360*(16384-(16384.499999999996-u/360|0)),h.shearY+=u*r}h.updateWorldTransformWith(c,f,l,d,p,h.ashearX,m)}},e.prototype.applyRelativeLocal=function(){var t=this.rotateMix,e=this.translateMix,n=this.scaleMix,r=this.shearMix,a=this.target;a.appliedValid||a.updateAppliedTransform();for(var i=this.bones,o=0,s=i.length;o<s;o++){var h=i[o];h.appliedValid||h.updateAppliedTransform();var l=h.arotation;0!=t&&(l+=(a.arotation+this.data.offsetRotation)*t);var u=h.ax,c=h.ay;0!=e&&(u+=(a.ax+this.data.offsetX)*e,c+=(a.ay+this.data.offsetY)*e);var f=h.ascaleX,d=h.ascaleY;0!=n&&(f>1e-5&&(f*=(a.ascaleX-1+this.data.offsetScaleX)*n+1),d>1e-5&&(d*=(a.ascaleY-1+this.data.offsetScaleY)*n+1));var p=h.ashearY;0!=r&&(p+=(a.ashearY+this.data.offsetShearY)*r),h.updateWorldTransformWith(u,c,l,f,d,h.ashearX,p)}},e}();t.TransformConstraint=e}(a||(a={})),function(t){var e=function(t){function e(e){var n=t.call(this,e,0,!1)||this;return n.bones=new Array,n.rotateMix=0,n.translateMix=0,n.scaleMix=0,n.shearMix=0,n.offsetRotation=0,n.offsetX=0,n.offsetY=0,n.offsetScaleX=0,n.offsetScaleY=0,n.offsetShearY=0,n.relative=!1,n.local=!1,n}return o(e,t),e}(t.ConstraintData);t.TransformConstraintData=e}(a||(a={})),function(t){var e=function(){function e(){this.convexPolygons=new Array,this.convexPolygonsIndices=new Array,this.indicesArray=new Array,this.isConcaveArray=new Array,this.triangles=new Array,this.polygonPool=new t.Pool((function(){return new Array})),this.polygonIndicesPool=new t.Pool((function(){return new Array}))}return e.prototype.triangulate=function(t){var n=t,r=t.length>>1,a=this.indicesArray;a.length=0;for(var i=0;i<r;i++)a[i]=i;var o=this.isConcaveArray;o.length=0;i=0;for(var s=r;i<s;++i)o[i]=e.isConcave(i,r,n,a);var h=this.triangles;for(h.length=0;r>3;){for(var l=r-1,u=(i=0,1);;){t:if(!o[i]){for(var c=a[l]<<1,f=a[i]<<1,d=a[u]<<1,p=n[c],m=n[c+1],v=n[f],g=n[f+1],y=n[d],E=n[d+1],w=(u+1)%r;w!=l;w=(w+1)%r)if(o[w]){var x=a[w]<<1,T=n[x],A=n[x+1];if(e.positiveArea(y,E,p,m,T,A)&&e.positiveArea(p,m,v,g,T,A)&&e.positiveArea(v,g,y,E,T,A))break t}break}if(0==u){do{if(!o[i])break;i--}while(i>0);break}l=i,i=u,u=(u+1)%r}h.push(a[(r+i-1)%r]),h.push(a[i]),h.push(a[(i+1)%r]),a.splice(i,1),o.splice(i,1);var M=(--r+i-1)%r,I=i==r?0:i;o[M]=e.isConcave(M,r,n,a),o[I]=e.isConcave(I,r,n,a)}return 3==r&&(h.push(a[2]),h.push(a[0]),h.push(a[1])),h},e.prototype.decompose=function(t,n){var r=t,a=this.convexPolygons;this.polygonPool.freeAll(a),a.length=0;var i=this.convexPolygonsIndices;this.polygonIndicesPool.freeAll(i),i.length=0;var o=this.polygonIndicesPool.obtain();o.length=0;var s=this.polygonPool.obtain();s.length=0;for(var h=-1,l=0,u=0,c=n.length;u<c;u+=3){var f=n[u]<<1,d=n[u+1]<<1,p=n[u+2]<<1,m=r[f],v=r[f+1],g=r[d],y=r[d+1],E=r[p],w=r[p+1],x=!1;if(h==f){var T=s.length-4,A=e.winding(s[T],s[T+1],s[T+2],s[T+3],E,w),M=e.winding(E,w,s[0],s[1],s[2],s[3]);A==l&&M==l&&(s.push(E),s.push(w),o.push(p),x=!0)}x||(s.length>0?(a.push(s),i.push(o)):(this.polygonPool.free(s),this.polygonIndicesPool.free(o)),(s=this.polygonPool.obtain()).length=0,s.push(m),s.push(v),s.push(g),s.push(y),s.push(E),s.push(w),(o=this.polygonIndicesPool.obtain()).length=0,o.push(f),o.push(d),o.push(p),l=e.winding(m,v,g,y,E,w),h=f)}s.length>0&&(a.push(s),i.push(o));for(u=0,c=a.length;u<c;u++)if(0!=(o=i[u]).length)for(var I=o[0],b=o[o.length-1],R=(s=a[u])[T=s.length-4],S=s[T+1],C=s[T+2],P=s[T+3],k=s[0],N=s[1],_=s[2],V=s[3],L=e.winding(R,S,C,P,k,N),O=0;O<c;O++)if(O!=u){var F=i[O];if(3==F.length){var D=F[0],U=F[1],B=F[2],X=a[O];E=X[X.length-2],w=X[X.length-1];if(D==I&&U==b){A=e.winding(R,S,C,P,E,w),M=e.winding(E,w,k,N,_,V);A==L&&M==L&&(X.length=0,F.length=0,s.push(E),s.push(w),o.push(B),R=C,S=P,C=E,P=w,O=0)}}}for(u=a.length-1;u>=0;u--)0==(s=a[u]).length&&(a.splice(u,1),this.polygonPool.free(s),o=i[u],i.splice(u,1),this.polygonIndicesPool.free(o));return a},e.isConcave=function(t,e,n,r){var a=r[(e+t-1)%e]<<1,i=r[t]<<1,o=r[(t+1)%e]<<1;return!this.positiveArea(n[a],n[a+1],n[i],n[i+1],n[o],n[o+1])},e.positiveArea=function(t,e,n,r,a,i){return t*(i-r)+n*(e-i)+a*(r-e)>=0},e.winding=function(t,e,n,r,a,i){var o=n-t,s=r-e;return a*s-i*o+o*e-t*s>=0?1:-1},e}();t.Triangulator=e}(a||(a={})),function(t){var e=function(){function t(){this.array=new Array}return t.prototype.add=function(t){var e=this.contains(t);return this.array[0|t]=0|t,!e},t.prototype.contains=function(t){return null!=this.array[0|t]},t.prototype.remove=function(t){this.array[0|t]=void 0},t.prototype.clear=function(){this.array.length=0},t}();t.IntSet=e;var n=function(){function t(t,e,n,r){void 0===t&&(t=0),void 0===e&&(e=0),void 0===n&&(n=0),void 0===r&&(r=0),this.r=t,this.g=e,this.b=n,this.a=r}return t.prototype.set=function(t,e,n,r){return this.r=t,this.g=e,this.b=n,this.a=r,this.clamp(),this},t.prototype.setFromColor=function(t){return this.r=t.r,this.g=t.g,this.b=t.b,this.a=t.a,this},t.prototype.setFromString=function(t){return t="#"==t.charAt(0)?t.substr(1):t,this.r=parseInt(t.substr(0,2),16)/255,this.g=parseInt(t.substr(2,2),16)/255,this.b=parseInt(t.substr(4,2),16)/255,this.a=(8!=t.length?255:parseInt(t.substr(6,2),16))/255,this},t.prototype.add=function(t,e,n,r){return this.r+=t,this.g+=e,this.b+=n,this.a+=r,this.clamp(),this},t.prototype.clamp=function(){return this.r<0?this.r=0:this.r>1&&(this.r=1),this.g<0?this.g=0:this.g>1&&(this.g=1),this.b<0?this.b=0:this.b>1&&(this.b=1),this.a<0?this.a=0:this.a>1&&(this.a=1),this},t.rgba8888ToColor=function(t,e){t.r=((4278190080&e)>>>24)/255,t.g=((16711680&e)>>>16)/255,t.b=((65280&e)>>>8)/255,t.a=(255&e)/255},t.rgb888ToColor=function(t,e){t.r=((16711680&e)>>>16)/255,t.g=((65280&e)>>>8)/255,t.b=(255&e)/255},t.WHITE=new t(1,1,1,1),t.RED=new t(1,0,0,1),t.GREEN=new t(0,1,0,1),t.BLUE=new t(0,0,1,1),t.MAGENTA=new t(1,0,1,1),t}();t.Color=n;var r=function(){function t(){}return t.clamp=function(t,e,n){return t<e?e:t>n?n:t},t.cosDeg=function(e){return Math.cos(e*t.degRad)},t.sinDeg=function(e){return Math.sin(e*t.degRad)},t.signum=function(t){return t>0?1:t<0?-1:0},t.toInt=function(t){return t>0?Math.floor(t):Math.ceil(t)},t.cbrt=function(t){var e=Math.pow(Math.abs(t),1/3);return t<0?-e:e},t.randomTriangular=function(e,n){return t.randomTriangularWith(e,n,.5*(e+n))},t.randomTriangularWith=function(t,e,n){var r=Math.random(),a=e-t;return r<=(n-t)/a?t+Math.sqrt(r*a*(n-t)):e-Math.sqrt((1-r)*a*(e-n))},t.PI=3.1415927,t.PI2=2*t.PI,t.radiansToDegrees=180/t.PI,t.radDeg=t.radiansToDegrees,t.degreesToRadians=t.PI/180,t.degRad=t.degreesToRadians,t}();t.MathUtils=r;var a=function(){function t(){}return t.prototype.apply=function(t,e,n){return t+(e-t)*this.applyInternal(n)},t}();t.Interpolation=a;var i=function(t){function e(e){var n=t.call(this)||this;return n.power=2,n.power=e,n}return o(e,t),e.prototype.applyInternal=function(t){return t<=.5?Math.pow(2*t,this.power)/2:Math.pow(2*(t-1),this.power)/(this.power%2==0?-2:2)+1},e}(a);t.Pow=i;var s=function(t){function e(e){return t.call(this,e)||this}return o(e,t),e.prototype.applyInternal=function(t){return Math.pow(t-1,this.power)*(this.power%2==0?-1:1)+1},e}(i);t.PowOut=s;var h=function(){function t(){}return t.arrayCopy=function(t,e,n,r,a){for(var i=e,o=r;i<e+a;i++,o++)n[o]=t[i]},t.setArraySize=function(t,e,n){void 0===n&&(n=0);var r=t.length;if(r==e)return t;if(t.length=e,r<e)for(var a=r;a<e;a++)t[a]=n;return t},t.ensureArrayCapacity=function(e,n,r){return void 0===r&&(r=0),e.length>=n?e:t.setArraySize(e,n,r)},t.newArray=function(t,e){for(var n=new Array(t),r=0;r<t;r++)n[r]=e;return n},t.newFloatArray=function(e){if(t.SUPPORTS_TYPED_ARRAYS)return new Float32Array(e);for(var n=new Array(e),r=0;r<n.length;r++)n[r]=0;return n},t.newShortArray=function(e){if(t.SUPPORTS_TYPED_ARRAYS)return new Int16Array(e);for(var n=new Array(e),r=0;r<n.length;r++)n[r]=0;return n},t.toFloatArray=function(e){return t.SUPPORTS_TYPED_ARRAYS?new Float32Array(e):e},t.toSinglePrecision=function(e){return t.SUPPORTS_TYPED_ARRAYS?Math.fround(e):e},t.webkit602BugfixHelper=function(t,e){},t.contains=function(t,e,n){for(var r=0;r<t.length;r++)if(t[r]==e)return!0;return!1},t.SUPPORTS_TYPED_ARRAYS="undefined"!=typeof Float32Array,t}();t.Utils=h;var l=function(){function t(){}return t.logBones=function(t){for(var e=0;e<t.bones.length;e++){var n=t.bones[e];console.log(n.data.name+", "+n.a+", "+n.b+", "+n.c+", "+n.d+", "+n.worldX+", "+n.worldY)}},t}();t.DebugUtils=l;var u=function(){function t(t){this.items=new Array,this.instantiator=t}return t.prototype.obtain=function(){return this.items.length>0?this.items.pop():this.instantiator()},t.prototype.free=function(t){t.reset&&t.reset(),this.items.push(t)},t.prototype.freeAll=function(t){for(var e=0;e<t.length;e++)this.free(t[e])},t.prototype.clear=function(){this.items.length=0},t}();t.Pool=u;var c=function(){function t(t,e){void 0===t&&(t=0),void 0===e&&(e=0),this.x=t,this.y=e}return t.prototype.set=function(t,e){return this.x=t,this.y=e,this},t.prototype.length=function(){var t=this.x,e=this.y;return Math.sqrt(t*t+e*e)},t.prototype.normalize=function(){var t=this.length();return 0!=t&&(this.x/=t,this.y/=t),this},t}();t.Vector2=c;var f=function(){function t(){this.maxDelta=.064,this.framesPerSecond=0,this.delta=0,this.totalTime=0,this.lastTime=Date.now()/1e3,this.frameCount=0,this.frameTime=0}return t.prototype.update=function(){var t=Date.now()/1e3;this.delta=t-this.lastTime,this.frameTime+=this.delta,this.totalTime+=this.delta,this.delta>this.maxDelta&&(this.delta=this.maxDelta),this.lastTime=t,this.frameCount++,this.frameTime>1&&(this.framesPerSecond=this.frameCount/this.frameTime,this.frameTime=0,this.frameCount=0)},t}();t.TimeKeeper=f;var d=function(){function t(t){void 0===t&&(t=32),this.addedValues=0,this.lastValue=0,this.mean=0,this.dirty=!0,this.values=new Array(t)}return t.prototype.hasEnoughData=function(){return this.addedValues>=this.values.length},t.prototype.addValue=function(t){this.addedValues<this.values.length&&this.addedValues++,this.values[this.lastValue++]=t,this.lastValue>this.values.length-1&&(this.lastValue=0),this.dirty=!0},t.prototype.getMean=function(){if(this.hasEnoughData()){if(this.dirty){for(var t=0,e=0;e<this.values.length;e++)t+=this.values[e];this.mean=t/this.values.length,this.dirty=!1}return this.mean}return 0},t}();t.WindowedMean=d}(a||(a={})),Math.fround||(Math.fround=(r=new Float32Array(1),function(t){return r[0]=t,r[0]})),function(t){var e=function(t){if(null==t)throw new Error("name cannot be null.");this.name=t};t.Attachment=e;var n=function(e){function n(t){var r=e.call(this,t)||this;return r.id=(65535&n.nextID++)<<11,r.worldVerticesLength=0,r.deformAttachment=r,r}return o(n,e),n.prototype.computeWorldVertices=function(t,e,n,r,a,i){n=a+(n>>1)*i;var o=t.bone.skeleton,s=t.deform,h=this.vertices,l=this.bones;if(null!=l){for(var u=0,c=0,f=0;f<e;f+=2){u+=(v=l[u])+1,c+=v}var d=o.bones;if(0==s.length)for(S=a,M=3*c;S<n;S+=i){var p=0,m=0,v=l[u++];for(v+=u;u<v;u++,M+=3){w=d[l[u]],C=h[M],P=h[M+1];var g=h[M+2];p+=(C*w.a+P*w.b+w.worldX)*g,m+=(C*w.c+P*w.d+w.worldY)*g}r[S]=p,r[S+1]=m}else for(var y=s,E=(S=a,M=3*c,c<<1);S<n;S+=i){p=0,m=0,v=l[u++];for(v+=u;u<v;u++,M+=3,E+=2){w=d[l[u]],C=h[M]+y[E],P=h[M+1]+y[E+1],g=h[M+2];p+=(C*w.a+P*w.b+w.worldX)*g,m+=(C*w.c+P*w.d+w.worldY)*g}r[S]=p,r[S+1]=m}}else{s.length>0&&(h=s);for(var w,x=(w=t.bone).worldX,T=w.worldY,A=w.a,M=w.b,I=w.c,b=w.d,R=e,S=a;S<n;R+=2,S+=i){var C=h[R],P=h[R+1];r[S]=C*A+P*M+x,r[S+1]=C*I+P*b+T}}},n.prototype.copyTo=function(e){null!=this.bones?(e.bones=new Array(this.bones.length),t.Utils.arrayCopy(this.bones,0,e.bones,0,this.bones.length)):e.bones=null,null!=this.vertices?(e.vertices=t.Utils.newFloatArray(this.vertices.length),t.Utils.arrayCopy(this.vertices,0,e.vertices,0,this.vertices.length)):e.vertices=null,e.worldVerticesLength=this.worldVerticesLength,e.deformAttachment=this.deformAttachment},n.nextID=0,n}(e);t.VertexAttachment=n}(a||(a={})),function(t){var e;(e=t.AttachmentType||(t.AttachmentType={}))[e.Region=0]="Region",e[e.BoundingBox=1]="BoundingBox",e[e.Mesh=2]="Mesh",e[e.LinkedMesh=3]="LinkedMesh",e[e.Path=4]="Path",e[e.Point=5]="Point",e[e.Clipping=6]="Clipping"}(a||(a={})),function(t){var e=function(e){function n(n){var r=e.call(this,n)||this;return r.color=new t.Color(1,1,1,1),r}return o(n,e),n.prototype.copy=function(){var t=new n(this.name);return this.copyTo(t),t.color.setFromColor(this.color),t},n}(t.VertexAttachment);t.BoundingBoxAttachment=e}(a||(a={})),function(t){var e=function(e){function n(n){var r=e.call(this,n)||this;return r.color=new t.Color(.2275,.2275,.8078,1),r}return o(n,e),n.prototype.copy=function(){var t=new n(this.name);return this.copyTo(t),t.endSlot=this.endSlot,t.color.setFromColor(this.color),t},n}(t.VertexAttachment);t.ClippingAttachment=e}(a||(a={})),function(t){var e=function(e){function n(n){var r=e.call(this,n)||this;return r.color=new t.Color(1,1,1,1),r.tempColor=new t.Color(0,0,0,0),r}return o(n,e),n.prototype.updateUVs=function(){var e=this.regionUVs;null!=this.uvs&&this.uvs.length==e.length||(this.uvs=t.Utils.newFloatArray(e.length));var n=this.uvs,r=this.uvs.length,a=this.region.u,i=this.region.v,o=0,s=0;if(this.region instanceof t.TextureAtlasRegion){var h=this.region,l=h.texture.getImage().width,u=h.texture.getImage().height;switch(h.degrees){case 90:a-=(h.originalHeight-h.offsetY-h.height)/l,i-=(h.originalWidth-h.offsetX-h.width)/u,o=h.originalHeight/l,s=h.originalWidth/u;for(var c=0;c<r;c+=2)n[c]=a+e[c+1]*o,n[c+1]=i+(1-e[c])*s;return;case 180:a-=(h.originalWidth-h.offsetX-h.width)/l,i-=h.offsetY/u,o=h.originalWidth/l,s=h.originalHeight/u;for(c=0;c<r;c+=2)n[c]=a+(1-e[c])*o,n[c+1]=i+(1-e[c+1])*s;return;case 270:a-=h.offsetY/l,i-=h.offsetX/u,o=h.originalHeight/l,s=h.originalWidth/u;for(c=0;c<r;c+=2)n[c]=a+(1-e[c+1])*o,n[c+1]=i+e[c]*s;return}a-=h.offsetX/l,i-=(h.originalHeight-h.offsetY-h.height)/u,o=h.originalWidth/l,s=h.originalHeight/u}else null==this.region?(a=i=0,o=s=1):(o=this.region.u2-a,s=this.region.v2-i);for(c=0;c<r;c+=2)n[c]=a+e[c]*o,n[c+1]=i+e[c+1]*s},n.prototype.getParentMesh=function(){return this.parentMesh},n.prototype.setParentMesh=function(t){this.parentMesh=t,null!=t&&(this.bones=t.bones,this.vertices=t.vertices,this.worldVerticesLength=t.worldVerticesLength,this.regionUVs=t.regionUVs,this.triangles=t.triangles,this.hullLength=t.hullLength,this.worldVerticesLength=t.worldVerticesLength)},n.prototype.copy=function(){if(null!=this.parentMesh)return this.newLinkedMesh();var e=new n(this.name);return e.region=this.region,e.path=this.path,e.color.setFromColor(this.color),this.copyTo(e),e.regionUVs=new Array(this.regionUVs.length),t.Utils.arrayCopy(this.regionUVs,0,e.regionUVs,0,this.regionUVs.length),e.uvs=new Array(this.uvs.length),t.Utils.arrayCopy(this.uvs,0,e.uvs,0,this.uvs.length),e.triangles=new Array(this.triangles.length),t.Utils.arrayCopy(this.triangles,0,e.triangles,0,this.triangles.length),e.hullLength=this.hullLength,null!=this.edges&&(e.edges=new Array(this.edges.length),t.Utils.arrayCopy(this.edges,0,e.edges,0,this.edges.length)),e.width=this.width,e.height=this.height,e},n.prototype.newLinkedMesh=function(){var t=new n(this.name);return t.region=this.region,t.path=this.path,t.color.setFromColor(this.color),t.deformAttachment=this.deformAttachment,t.setParentMesh(null!=this.parentMesh?this.parentMesh:this),t.updateUVs(),t},n}(t.VertexAttachment);t.MeshAttachment=e}(a||(a={})),function(t){var e=function(e){function n(n){var r=e.call(this,n)||this;return r.closed=!1,r.constantSpeed=!1,r.color=new t.Color(1,1,1,1),r}return o(n,e),n.prototype.copy=function(){var e=new n(this.name);return this.copyTo(e),e.lengths=new Array(this.lengths.length),t.Utils.arrayCopy(this.lengths,0,e.lengths,0,this.lengths.length),e.closed=closed,e.constantSpeed=this.constantSpeed,e.color.setFromColor(this.color),e},n}(t.VertexAttachment);t.PathAttachment=e}(a||(a={})),function(t){var e=function(e){function n(n){var r=e.call(this,n)||this;return r.color=new t.Color(.38,.94,0,1),r}return o(n,e),n.prototype.computeWorldPosition=function(t,e){return e.x=this.x*t.a+this.y*t.b+t.worldX,e.y=this.x*t.c+this.y*t.d+t.worldY,e},n.prototype.computeWorldRotation=function(e){var n=t.MathUtils.cosDeg(this.rotation),r=t.MathUtils.sinDeg(this.rotation),a=n*e.a+r*e.b,i=n*e.c+r*e.d;return Math.atan2(i,a)*t.MathUtils.radDeg},n.prototype.copy=function(){var t=new n(this.name);return t.x=this.x,t.y=this.y,t.rotation=this.rotation,t.color.setFromColor(this.color),t},n}(t.VertexAttachment);t.PointAttachment=e}(a||(a={})),function(t){var e=function(e){function n(n){var r=e.call(this,n)||this;return r.x=0,r.y=0,r.scaleX=1,r.scaleY=1,r.rotation=0,r.width=0,r.height=0,r.color=new t.Color(1,1,1,1),r.offset=t.Utils.newFloatArray(8),r.uvs=t.Utils.newFloatArray(8),r.tempColor=new t.Color(1,1,1,1),r}return o(n,e),n.prototype.updateOffset=function(){var t=this.width/this.region.originalWidth*this.scaleX,e=this.height/this.region.originalHeight*this.scaleY,r=-this.width/2*this.scaleX+this.region.offsetX*t,a=-this.height/2*this.scaleY+this.region.offsetY*e,i=r+this.region.width*t,o=a+this.region.height*e,s=this.rotation*Math.PI/180,h=Math.cos(s),l=Math.sin(s),u=r*h+this.x,c=r*l,f=a*h+this.y,d=a*l,p=i*h+this.x,m=i*l,v=o*h+this.y,g=o*l,y=this.offset;y[n.OX1]=u-d,y[n.OY1]=f+c,y[n.OX2]=u-g,y[n.OY2]=v+c,y[n.OX3]=p-g,y[n.OY3]=v+m,y[n.OX4]=p-d,y[n.OY4]=f+m},n.prototype.setRegion=function(t){this.region=t;var e=this.uvs;t.rotate?(e[2]=t.u,e[3]=t.v2,e[4]=t.u,e[5]=t.v,e[6]=t.u2,e[7]=t.v,e[0]=t.u2,e[1]=t.v2):(e[0]=t.u,e[1]=t.v2,e[2]=t.u,e[3]=t.v,e[4]=t.u2,e[5]=t.v,e[6]=t.u2,e[7]=t.v2)},n.prototype.computeWorldVertices=function(t,e,r,a){var i=this.offset,o=t.worldX,s=t.worldY,h=t.a,l=t.b,u=t.c,c=t.d,f=0,d=0;f=i[n.OX1],d=i[n.OY1],e[r]=f*h+d*l+o,e[r+1]=f*u+d*c+s,r+=a,f=i[n.OX2],d=i[n.OY2],e[r]=f*h+d*l+o,e[r+1]=f*u+d*c+s,r+=a,f=i[n.OX3],d=i[n.OY3],e[r]=f*h+d*l+o,e[r+1]=f*u+d*c+s,r+=a,f=i[n.OX4],d=i[n.OY4],e[r]=f*h+d*l+o,e[r+1]=f*u+d*c+s},n.prototype.copy=function(){var e=new n(this.name);return e.region=this.region,e.rendererObject=this.rendererObject,e.path=this.path,e.x=this.x,e.y=this.y,e.scaleX=this.scaleX,e.scaleY=this.scaleY,e.rotation=this.rotation,e.width=this.width,e.height=this.height,t.Utils.arrayCopy(this.uvs,0,e.uvs,0,8),t.Utils.arrayCopy(this.offset,0,e.offset,0,8),e.color.setFromColor(this.color),e},n.OX1=0,n.OY1=1,n.OX2=2,n.OY2=3,n.OX3=4,n.OY3=5,n.OX4=6,n.OY4=7,n.X1=0,n.Y1=1,n.C1R=2,n.C1G=3,n.C1B=4,n.C1A=5,n.U1=6,n.V1=7,n.X2=8,n.Y2=9,n.C2R=10,n.C2G=11,n.C2B=12,n.C2A=13,n.U2=14,n.V2=15,n.X3=16,n.Y3=17,n.C3R=18,n.C3G=19,n.C3B=20,n.C3A=21,n.U3=22,n.V3=23,n.X4=24,n.Y4=25,n.C4R=26,n.C4G=27,n.C4B=28,n.C4A=29,n.U4=30,n.V4=31,n}(t.Attachment);t.RegionAttachment=e}(a||(a={})),function(t){var e=function(){function e(t,e){this.jitterX=0,this.jitterY=0,this.jitterX=t,this.jitterY=e}return e.prototype.begin=function(t){},e.prototype.transform=function(e,n,r,a){e.x+=t.MathUtils.randomTriangular(-this.jitterX,this.jitterY),e.y+=t.MathUtils.randomTriangular(-this.jitterX,this.jitterY)},e.prototype.end=function(){},e}();t.JitterEffect=e}(a||(a={})),function(t){var e=function(){function e(t){this.centerX=0,this.centerY=0,this.radius=0,this.angle=0,this.worldX=0,this.worldY=0,this.radius=t}return e.prototype.begin=function(t){this.worldX=t.x+this.centerX,this.worldY=t.y+this.centerY},e.prototype.transform=function(n,r,a,i){var o=this.angle*t.MathUtils.degreesToRadians,s=n.x-this.worldX,h=n.y-this.worldY,l=Math.sqrt(s*s+h*h);if(l<this.radius){var u=e.interpolation.apply(0,o,(this.radius-l)/this.radius),c=Math.cos(u),f=Math.sin(u);n.x=c*s-f*h+this.worldX,n.y=f*s+c*h+this.worldY}},e.prototype.end=function(){},e.interpolation=new t.PowOut(2),e}();t.SwirlEffect=e}(a||(a={}));var I={9728:t.FILTER_NEAREST,9729:t.FILTER_LINEAR,9984:t.FILTER_NEAREST_MIPMAP_NEAREST,9985:t.FILTER_LINEAR_MIPMAP_NEAREST,9986:t.FILTER_NEAREST_MIPMAP_LINEAR,9987:t.FILTER_LINEAR_MIPMAP_LINEAR},b={33648:t.ADDRESS_MIRRORED_REPEAT,33071:t.ADDRESS_CLAMP_TO_EDGE,10487:t.ADDRESS_REPEAT},R=function(){function t(e){l(this,t),this._image={width:e.width,height:e.height},this.pcTexture=e}return c(t,[{key:"setFilters",value:function(t,e){this.pcTexture.minFilter=I[t],this.pcTexture.magFilter=I[e]}},{key:"setWraps",value:function(t,e){this.pcTexture.addressU=b[t],this.pcTexture.addressV=b[e]}},{key:"getImage",value:function(){return this._image}},{key:"dispose",value:function(){this.pcTexture.destroy()}}]),t}();function S(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var C={MAX_LENGTH:256,MAX_SAFE_COMPONENT_LENGTH:16,MAX_SAFE_BUILD_LENGTH:250,MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER||9007199254740991,RELEASE_TYPES:["major","premajor","minor","preminor","patch","prepatch","prerelease"],SEMVER_SPEC_VERSION:"2.0.0",FLAG_INCLUDE_PRERELEASE:1,FLAG_LOOSE:2},P=S(C),k="object"===("undefined"==typeof process?"undefined":h(process))&&process.env&&process.env.NODE_DEBUG&&/\bsemver\b/i.test(process.env.NODE_DEBUG)?function(){for(var t,e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return(t=console).error.apply(t,["SEMVER"].concat(n))}:function(){},N=k;S(N);var _={exports:{}};!function(t,e){var n=C.MAX_SAFE_COMPONENT_LENGTH,r=C.MAX_SAFE_BUILD_LENGTH,a=C.MAX_LENGTH,i=N,o=(e=t.exports={}).re=[],s=e.safeRe=[],h=e.src=[],l=e.t={},u=0,c="[a-zA-Z0-9-]",f=[["\\s",1],["\\d",a],[c,r]],d=function(t,e,n){var r=function(t){for(var e=0,n=f;e<n.length;e++){var r=E(n[e],2),a=r[0],i=r[1];t=t.split("".concat(a,"*")).join("".concat(a,"{0,").concat(i,"}")).split("".concat(a,"+")).join("".concat(a,"{1,").concat(i,"}"))}return t}(e),a=u++;i(t,a,e),l[t]=a,h[a]=e,o[a]=new RegExp(e,n?"g":void 0),s[a]=new RegExp(r,n?"g":void 0)};d("NUMERICIDENTIFIER","0|[1-9]\\d*"),d("NUMERICIDENTIFIERLOOSE","\\d+"),d("NONNUMERICIDENTIFIER","\\d*[a-zA-Z-]".concat(c,"*")),d("MAINVERSION","(".concat(h[l.NUMERICIDENTIFIER],")\\.")+"(".concat(h[l.NUMERICIDENTIFIER],")\\.")+"(".concat(h[l.NUMERICIDENTIFIER],")")),d("MAINVERSIONLOOSE","(".concat(h[l.NUMERICIDENTIFIERLOOSE],")\\.")+"(".concat(h[l.NUMERICIDENTIFIERLOOSE],")\\.")+"(".concat(h[l.NUMERICIDENTIFIERLOOSE],")")),d("PRERELEASEIDENTIFIER","(?:".concat(h[l.NUMERICIDENTIFIER],"|").concat(h[l.NONNUMERICIDENTIFIER],")")),d("PRERELEASEIDENTIFIERLOOSE","(?:".concat(h[l.NUMERICIDENTIFIERLOOSE],"|").concat(h[l.NONNUMERICIDENTIFIER],")")),d("PRERELEASE","(?:-(".concat(h[l.PRERELEASEIDENTIFIER],"(?:\\.").concat(h[l.PRERELEASEIDENTIFIER],")*))")),d("PRERELEASELOOSE","(?:-?(".concat(h[l.PRERELEASEIDENTIFIERLOOSE],"(?:\\.").concat(h[l.PRERELEASEIDENTIFIERLOOSE],")*))")),d("BUILDIDENTIFIER","".concat(c,"+")),d("BUILD","(?:\\+(".concat(h[l.BUILDIDENTIFIER],"(?:\\.").concat(h[l.BUILDIDENTIFIER],")*))")),d("FULLPLAIN","v?".concat(h[l.MAINVERSION]).concat(h[l.PRERELEASE],"?").concat(h[l.BUILD],"?")),d("FULL","^".concat(h[l.FULLPLAIN],"$")),d("LOOSEPLAIN","[v=\\s]*".concat(h[l.MAINVERSIONLOOSE]).concat(h[l.PRERELEASELOOSE],"?").concat(h[l.BUILD],"?")),d("LOOSE","^".concat(h[l.LOOSEPLAIN],"$")),d("GTLT","((?:<|>)?=?)"),d("XRANGEIDENTIFIERLOOSE","".concat(h[l.NUMERICIDENTIFIERLOOSE],"|x|X|\\*")),d("XRANGEIDENTIFIER","".concat(h[l.NUMERICIDENTIFIER],"|x|X|\\*")),d("XRANGEPLAIN","[v=\\s]*(".concat(h[l.XRANGEIDENTIFIER],")")+"(?:\\.(".concat(h[l.XRANGEIDENTIFIER],")")+"(?:\\.(".concat(h[l.XRANGEIDENTIFIER],")")+"(?:".concat(h[l.PRERELEASE],")?").concat(h[l.BUILD],"?")+")?)?"),d("XRANGEPLAINLOOSE","[v=\\s]*(".concat(h[l.XRANGEIDENTIFIERLOOSE],")")+"(?:\\.(".concat(h[l.XRANGEIDENTIFIERLOOSE],")")+"(?:\\.(".concat(h[l.XRANGEIDENTIFIERLOOSE],")")+"(?:".concat(h[l.PRERELEASELOOSE],")?").concat(h[l.BUILD],"?")+")?)?"),d("XRANGE","^".concat(h[l.GTLT],"\\s*").concat(h[l.XRANGEPLAIN],"$")),d("XRANGELOOSE","^".concat(h[l.GTLT],"\\s*").concat(h[l.XRANGEPLAINLOOSE],"$")),d("COERCE","".concat("(^|[^\\d])(\\d{1,").concat(n,"})")+"(?:\\.(\\d{1,".concat(n,"}))?")+"(?:\\.(\\d{1,".concat(n,"}))?")+"(?:$|[^\\d])"),d("COERCERTL",h[l.COERCE],!0),d("LONETILDE","(?:~>?)"),d("TILDETRIM","(\\s*)".concat(h[l.LONETILDE],"\\s+"),!0),e.tildeTrimReplace="$1~",d("TILDE","^".concat(h[l.LONETILDE]).concat(h[l.XRANGEPLAIN],"$")),d("TILDELOOSE","^".concat(h[l.LONETILDE]).concat(h[l.XRANGEPLAINLOOSE],"$")),d("LONECARET","(?:\\^)"),d("CARETTRIM","(\\s*)".concat(h[l.LONECARET],"\\s+"),!0),e.caretTrimReplace="$1^",d("CARET","^".concat(h[l.LONECARET]).concat(h[l.XRANGEPLAIN],"$")),d("CARETLOOSE","^".concat(h[l.LONECARET]).concat(h[l.XRANGEPLAINLOOSE],"$")),d("COMPARATORLOOSE","^".concat(h[l.GTLT],"\\s*(").concat(h[l.LOOSEPLAIN],")$|^$")),d("COMPARATOR","^".concat(h[l.GTLT],"\\s*(").concat(h[l.FULLPLAIN],")$|^$")),d("COMPARATORTRIM","(\\s*)".concat(h[l.GTLT],"\\s*(").concat(h[l.LOOSEPLAIN],"|").concat(h[l.XRANGEPLAIN],")"),!0),e.comparatorTrimReplace="$1$2$3",d("HYPHENRANGE","^\\s*(".concat(h[l.XRANGEPLAIN],")")+"\\s+-\\s+"+"(".concat(h[l.XRANGEPLAIN],")")+"\\s*$"),d("HYPHENRANGELOOSE","^\\s*(".concat(h[l.XRANGEPLAINLOOSE],")")+"\\s+-\\s+"+"(".concat(h[l.XRANGEPLAINLOOSE],")")+"\\s*$"),d("STAR","(<|>)?=?\\s*\\*"),d("GTE0","^\\s*>=\\s*0\\.0\\.0\\s*$"),d("GTE0PRE","^\\s*>=\\s*0\\.0\\.0-0\\s*$")}(_,_.exports);var V=_.exports;S(V);var L=Object.freeze({loose:!0}),O=Object.freeze({}),F=function(t){return t?"object"!==h(t)?L:t:O};S(F);var D=/^[0-9]+$/,U=function(t,e){var n=D.test(t),r=D.test(e);return n&&r&&(t=+t,e=+e),t===e?0:n&&!r?-1:r&&!n?1:t<e?-1:1},B={compareIdentifiers:U,rcompareIdentifiers:function(t,e){return U(e,t)}};S(B);var X=N,Y=C.MAX_LENGTH,W=C.MAX_SAFE_INTEGER,j=V.safeRe,G=V.t,q=F,H=B.compareIdentifiers,z=function(){function t(e,n){if(l(this,t),n=q(n),e instanceof t){if(e.loose===!!n.loose&&e.includePrerelease===!!n.includePrerelease)return e;e=e.version}else if("string"!=typeof e)throw new TypeError('Invalid version. Must be a string. Got type "'.concat(h(e),'".'));if(e.length>Y)throw new TypeError("version is longer than ".concat(Y," characters"));X("SemVer",e,n),this.options=n,this.loose=!!n.loose,this.includePrerelease=!!n.includePrerelease;var r=e.trim().match(n.loose?j[G.LOOSE]:j[G.FULL]);if(!r)throw new TypeError("Invalid Version: ".concat(e));if(this.raw=e,this.major=+r[1],this.minor=+r[2],this.patch=+r[3],this.major>W||this.major<0)throw new TypeError("Invalid major version");if(this.minor>W||this.minor<0)throw new TypeError("Invalid minor version");if(this.patch>W||this.patch<0)throw new TypeError("Invalid patch version");r[4]?this.prerelease=r[4].split(".").map((function(t){if(/^[0-9]+$/.test(t)){var e=+t;if(e>=0&&e<W)return e}return t})):this.prerelease=[],this.build=r[5]?r[5].split("."):[],this.format()}return c(t,[{key:"format",value:function(){return this.version="".concat(this.major,".").concat(this.minor,".").concat(this.patch),this.prerelease.length&&(this.version+="-".concat(this.prerelease.join("."))),this.version}},{key:"toString",value:function(){return this.version}},{key:"compare",value:function(e){if(X("SemVer.compare",this.version,this.options,e),!(e instanceof t)){if("string"==typeof e&&e===this.version)return 0;e=new t(e,this.options)}return e.version===this.version?0:this.compareMain(e)||this.comparePre(e)}},{key:"compareMain",value:function(e){return e instanceof t||(e=new t(e,this.options)),H(this.major,e.major)||H(this.minor,e.minor)||H(this.patch,e.patch)}},{key:"comparePre",value:function(e){if(e instanceof t||(e=new t(e,this.options)),this.prerelease.length&&!e.prerelease.length)return-1;if(!this.prerelease.length&&e.prerelease.length)return 1;if(!this.prerelease.length&&!e.prerelease.length)return 0;var n=0;do{var r=this.prerelease[n],a=e.prerelease[n];if(X("prerelease compare",n,r,a),void 0===r&&void 0===a)return 0;if(void 0===a)return 1;if(void 0===r)return-1;if(r!==a)return H(r,a)}while(++n)}},{key:"compareBuild",value:function(e){e instanceof t||(e=new t(e,this.options));var n=0;do{var r=this.build[n],a=e.build[n];if(X("prerelease compare",n,r,a),void 0===r&&void 0===a)return 0;if(void 0===a)return 1;if(void 0===r)return-1;if(r!==a)return H(r,a)}while(++n)}},{key:"inc",value:function(t,e,n){switch(t){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",e,n);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",e,n);break;case"prepatch":this.prerelease.length=0,this.inc("patch",e,n),this.inc("pre",e,n);break;case"prerelease":0===this.prerelease.length&&this.inc("patch",e,n),this.inc("pre",e,n);break;case"major":0===this.minor&&0===this.patch&&0!==this.prerelease.length||this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":0===this.patch&&0!==this.prerelease.length||this.minor++,this.patch=0,this.prerelease=[];break;case"patch":0===this.prerelease.length&&this.patch++,this.prerelease=[];break;case"pre":var r=Number(n)?1:0;if(!e&&!1===n)throw new Error("invalid increment argument: identifier is empty");if(0===this.prerelease.length)this.prerelease=[r];else{for(var a=this.prerelease.length;--a>=0;)"number"==typeof this.prerelease[a]&&(this.prerelease[a]++,a=-2);if(-1===a){if(e===this.prerelease.join(".")&&!1===n)throw new Error("invalid increment argument: identifier already exists");this.prerelease.push(r)}}if(e){var i=[e,r];!1===n&&(i=[e]),0===H(this.prerelease[0],e)?isNaN(this.prerelease[1])&&(this.prerelease=i):this.prerelease=i}break;default:throw new Error("invalid increment argument: ".concat(t))}return this.raw=this.format(),this.build.length&&(this.raw+="+".concat(this.build.join("."))),this}}]),t}(),Z=z;S(Z);var $=Z,Q=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(t instanceof $)return t;try{return new $(t,e)}catch(t){if(!n)return null;throw t}};S(Q);var J,K,tt=Q,et=S((function(t,e){var n=tt(t,e);return n?n.version:null})),nt=Z,rt=Q,at=V.safeRe,it=V.t,ot=S((function(t,e){if(t instanceof nt)return t;if("number"==typeof t&&(t=String(t)),"string"!=typeof t)return null;var n=null;if((e=e||{}).rtl){for(var r;(r=at[it.COERCERTL].exec(t))&&(!n||n.index+n[0].length!==t.length);)n&&r.index+r[0].length===n.index+n[0].length||(n=r),at[it.COERCERTL].lastIndex=r.index+r[1].length+r[2].length;at[it.COERCERTL].lastIndex=-1}else n=t.match(at[it.COERCE]);return null===n?null:rt("".concat(n[2],".").concat(n[3]||"0",".").concat(n[4]||"0"),e)}));var st=ht;function ht(t){var e=this;if(e instanceof ht||(e=new ht),e.tail=null,e.head=null,e.length=0,t&&"function"==typeof t.forEach)t.forEach((function(t){e.push(t)}));else if(arguments.length>0)for(var n=0,r=arguments.length;n<r;n++)e.push(arguments[n]);return e}function lt(t,e,n){var r=e===t.head?new ft(n,null,e,t):new ft(n,e,e.next,t);return null===r.next&&(t.tail=r),null===r.prev&&(t.head=r),t.length++,r}function ut(t,e){t.tail=new ft(e,t.tail,null,t),t.head||(t.head=t.tail),t.length++}function ct(t,e){t.head=new ft(e,null,t.head,t),t.tail||(t.tail=t.head),t.length++}function ft(t,e,n,r){if(!(this instanceof ft))return new ft(t,e,n,r);this.list=r,this.value=t,e?(e.next=this,this.prev=e):this.prev=null,n?(n.prev=this,this.next=n):this.next=null}ht.Node=ft,ht.create=ht,ht.prototype.removeNode=function(t){if(t.list!==this)throw new Error("removing node which does not belong to this list");var e=t.next,n=t.prev;return e&&(e.prev=n),n&&(n.next=e),t===this.head&&(this.head=e),t===this.tail&&(this.tail=n),t.list.length--,t.next=null,t.prev=null,t.list=null,e},ht.prototype.unshiftNode=function(t){if(t!==this.head){t.list&&t.list.removeNode(t);var e=this.head;t.list=this,t.next=e,e&&(e.prev=t),this.head=t,this.tail||(this.tail=t),this.length++}},ht.prototype.pushNode=function(t){if(t!==this.tail){t.list&&t.list.removeNode(t);var e=this.tail;t.list=this,t.prev=e,e&&(e.next=t),this.tail=t,this.head||(this.head=t),this.length++}},ht.prototype.push=function(){for(var t=0,e=arguments.length;t<e;t++)ut(this,arguments[t]);return this.length},ht.prototype.unshift=function(){for(var t=0,e=arguments.length;t<e;t++)ct(this,arguments[t]);return this.length},ht.prototype.pop=function(){if(this.tail){var t=this.tail.value;return this.tail=this.tail.prev,this.tail?this.tail.next=null:this.head=null,this.length--,t}},ht.prototype.shift=function(){if(this.head){var t=this.head.value;return this.head=this.head.next,this.head?this.head.prev=null:this.tail=null,this.length--,t}},ht.prototype.forEach=function(t,e){e=e||this;for(var n=this.head,r=0;null!==n;r++)t.call(e,n.value,r,this),n=n.next},ht.prototype.forEachReverse=function(t,e){e=e||this;for(var n=this.tail,r=this.length-1;null!==n;r--)t.call(e,n.value,r,this),n=n.prev},ht.prototype.get=function(t){for(var e=0,n=this.head;null!==n&&e<t;e++)n=n.next;if(e===t&&null!==n)return n.value},ht.prototype.getReverse=function(t){for(var e=0,n=this.tail;null!==n&&e<t;e++)n=n.prev;if(e===t&&null!==n)return n.value},ht.prototype.map=function(t,e){e=e||this;for(var n=new ht,r=this.head;null!==r;)n.push(t.call(e,r.value,this)),r=r.next;return n},ht.prototype.mapReverse=function(t,e){e=e||this;for(var n=new ht,r=this.tail;null!==r;)n.push(t.call(e,r.value,this)),r=r.prev;return n},ht.prototype.reduce=function(t,e){var n,r=this.head;if(arguments.length>1)n=e;else{if(!this.head)throw new TypeError("Reduce of empty list with no initial value");r=this.head.next,n=this.head.value}for(var a=0;null!==r;a++)n=t(n,r.value,a),r=r.next;return n},ht.prototype.reduceReverse=function(t,e){var n,r=this.tail;if(arguments.length>1)n=e;else{if(!this.tail)throw new TypeError("Reduce of empty list with no initial value");r=this.tail.prev,n=this.tail.value}for(var a=this.length-1;null!==r;a--)n=t(n,r.value,a),r=r.prev;return n},ht.prototype.toArray=function(){for(var t=new Array(this.length),e=0,n=this.head;null!==n;e++)t[e]=n.value,n=n.next;return t},ht.prototype.toArrayReverse=function(){for(var t=new Array(this.length),e=0,n=this.tail;null!==n;e++)t[e]=n.value,n=n.prev;return t},ht.prototype.slice=function(t,e){(e=e||this.length)<0&&(e+=this.length),(t=t||0)<0&&(t+=this.length);var n=new ht;if(e<t||e<0)return n;t<0&&(t=0),e>this.length&&(e=this.length);for(var r=0,a=this.head;null!==a&&r<t;r++)a=a.next;for(;null!==a&&r<e;r++,a=a.next)n.push(a.value);return n},ht.prototype.sliceReverse=function(t,e){(e=e||this.length)<0&&(e+=this.length),(t=t||0)<0&&(t+=this.length);var n=new ht;if(e<t||e<0)return n;t<0&&(t=0),e>this.length&&(e=this.length);for(var r=this.length,a=this.tail;null!==a&&r>e;r--)a=a.prev;for(;null!==a&&r>t;r--,a=a.prev)n.push(a.value);return n},ht.prototype.splice=function(t,e){t>this.length&&(t=this.length-1),t<0&&(t=this.length+t);for(var n=0,r=this.head;null!==r&&n<t;n++)r=r.next;var a=[];for(n=0;r&&n<e;n++)a.push(r.value),r=this.removeNode(r);null===r&&(r=this.tail),r!==this.head&&r!==this.tail&&(r=r.prev);for(n=0;n<(arguments.length<=2?0:arguments.length-2);n++)r=lt(this,r,n+2<2||arguments.length<=n+2?void 0:arguments[n+2]);return a},ht.prototype.reverse=function(){for(var t=this.head,e=this.tail,n=t;null!==n;n=n.prev){var r=n.prev;n.prev=n.next,n.next=r}return this.head=e,this.tail=t,this};try{(K||(K=1,J=function(t){t.prototype[Symbol.iterator]=s().mark((function t(){var e;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=this.head;case 1:if(!e){t.next=7;break}return t.next=4,e.value;case 4:e=e.next,t.next=1;break;case 7:case"end":return t.stop()}}),t,this)}))}),J)(ht)}catch(t){}S(st);var dt=st,pt=Symbol("max"),mt=Symbol("length"),vt=Symbol("lengthCalculator"),gt=Symbol("allowStale"),yt=Symbol("maxAge"),Et=Symbol("dispose"),wt=Symbol("noDisposeOnSet"),xt=Symbol("lruList"),Tt=Symbol("cache"),At=Symbol("updateAgeOnGet"),Mt=function(){return 1},It=function(){function t(e){if(l(this,t),"number"==typeof e&&(e={max:e}),e||(e={}),e.max&&("number"!=typeof e.max||e.max<0))throw new TypeError("max must be a non-negative number");this[pt]=e.max||1/0;var n=e.length||Mt;if(this[vt]="function"!=typeof n?Mt:n,this[gt]=e.stale||!1,e.maxAge&&"number"!=typeof e.maxAge)throw new TypeError("maxAge must be a number");this[yt]=e.maxAge||0,this[Et]=e.dispose,this[wt]=e.noDisposeOnSet||!1,this[At]=e.updateAgeOnGet||!1,this.reset()}return c(t,[{key:"max",get:function(){return this[pt]},set:function(t){if("number"!=typeof t||t<0)throw new TypeError("max must be a non-negative number");this[pt]=t||1/0,St(this)}},{key:"allowStale",get:function(){return this[gt]},set:function(t){this[gt]=!!t}},{key:"maxAge",get:function(){return this[yt]},set:function(t){if("number"!=typeof t)throw new TypeError("maxAge must be a non-negative number");this[yt]=t,St(this)}},{key:"lengthCalculator",get:function(){return this[vt]},set:function(t){var e=this;"function"!=typeof t&&(t=Mt),t!==this[vt]&&(this[vt]=t,this[mt]=0,this[xt].forEach((function(t){t.length=e[vt](t.value,t.key),e[mt]+=t.length}))),St(this)}},{key:"length",get:function(){return this[mt]}},{key:"itemCount",get:function(){return this[xt].length}},{key:"rforEach",value:function(t,e){e=e||this;for(var n=this[xt].tail;null!==n;){var r=n.prev;kt(this,t,n,e),n=r}}},{key:"forEach",value:function(t,e){e=e||this;for(var n=this[xt].head;null!==n;){var r=n.next;kt(this,t,n,e),n=r}}},{key:"keys",value:function(){return this[xt].toArray().map((function(t){return t.key}))}},{key:"values",value:function(){return this[xt].toArray().map((function(t){return t.value}))}},{key:"reset",value:function(){var t=this;this[Et]&&this[xt]&&this[xt].length&&this[xt].forEach((function(e){return t[Et](e.key,e.value)})),this[Tt]=new Map,this[xt]=new dt,this[mt]=0}},{key:"dump",value:function(){var t=this;return this[xt].map((function(e){return!Rt(t,e)&&{k:e.key,v:e.value,e:e.now+(e.maxAge||0)}})).toArray().filter((function(t){return t}))}},{key:"dumpLru",value:function(){return this[xt]}},{key:"set",value:function(t,e,n){if((n=n||this[yt])&&"number"!=typeof n)throw new TypeError("maxAge must be a number");var r=n?Date.now():0,a=this[vt](e,t);if(this[Tt].has(t)){if(a>this[pt])return Ct(this,this[Tt].get(t)),!1;var i=this[Tt].get(t).value;return this[Et]&&(this[wt]||this[Et](t,i.value)),i.now=r,i.maxAge=n,i.value=e,this[mt]+=a-i.length,i.length=a,this.get(t),St(this),!0}var o=new Pt(t,e,a,r,n);return o.length>this[pt]?(this[Et]&&this[Et](t,e),!1):(this[mt]+=o.length,this[xt].unshift(o),this[Tt].set(t,this[xt].head),St(this),!0)}},{key:"has",value:function(t){if(!this[Tt].has(t))return!1;var e=this[Tt].get(t).value;return!Rt(this,e)}},{key:"get",value:function(t){return bt(this,t,!0)}},{key:"peek",value:function(t){return bt(this,t,!1)}},{key:"pop",value:function(){var t=this[xt].tail;return t?(Ct(this,t),t.value):null}},{key:"del",value:function(t){Ct(this,this[Tt].get(t))}},{key:"load",value:function(t){this.reset();for(var e=Date.now(),n=t.length-1;n>=0;n--){var r=t[n],a=r.e||0;if(0===a)this.set(r.k,r.v);else{var i=a-e;i>0&&this.set(r.k,r.v,i)}}}},{key:"prune",value:function(){var t=this;this[Tt].forEach((function(e,n){return bt(t,n,!1)}))}}]),t}(),bt=function(t,e,n){var r=t[Tt].get(e);if(r){var a=r.value;if(Rt(t,a)){if(Ct(t,r),!t[gt])return}else n&&(t[At]&&(r.value.now=Date.now()),t[xt].unshiftNode(r));return a.value}},Rt=function(t,e){if(!e||!e.maxAge&&!t[yt])return!1;var n=Date.now()-e.now;return e.maxAge?n>e.maxAge:t[yt]&&n>t[yt]},St=function(t){if(t[mt]>t[pt])for(var e=t[xt].tail;t[mt]>t[pt]&&null!==e;){var n=e.prev;Ct(t,e),e=n}},Ct=function(t,e){if(e){var n=e.value;t[Et]&&t[Et](n.key,n.value),t[mt]-=n.length,t[Tt].delete(n.key),t[xt].removeNode(e)}},Pt=c((function t(e,n,r,a,i){l(this,t),this.key=e,this.value=n,this.length=r,this.now=a,this.maxAge=i||0})),kt=function(t,e,n,r){var a=n.value;Rt(t,a)&&(Ct(t,n),t[gt]||(a=void 0)),a&&e.call(r,a.value,a.key,t)},Nt=It;S(Nt);var _t=Z,Vt=function(t,e,n){return new _t(t,n).compare(new _t(e,n))};S(Vt);var Lt=Vt,Ot=function(t,e,n){return 0===Lt(t,e,n)};S(Ot);var Ft=Vt,Dt=function(t,e,n){return 0!==Ft(t,e,n)};S(Dt);var Ut=Vt,Bt=function(t,e,n){return Ut(t,e,n)>0};S(Bt);var Xt=Vt,Yt=function(t,e,n){return Xt(t,e,n)>=0};S(Yt);var Wt=Vt,jt=function(t,e,n){return Wt(t,e,n)<0};S(jt);var Gt=Vt,qt=function(t,e,n){return Gt(t,e,n)<=0};S(qt);var Ht,zt,Zt,$t,Qt=Ot,Jt=Dt,Kt=Bt,te=Yt,ee=jt,ne=qt,re=function(t,e,n,r){switch(e){case"===":return"object"===h(t)&&(t=t.version),"object"===h(n)&&(n=n.version),t===n;case"!==":return"object"===h(t)&&(t=t.version),"object"===h(n)&&(n=n.version),t!==n;case"":case"=":case"==":return Qt(t,n,r);case"!=":return Jt(t,n,r);case">":return Kt(t,n,r);case">=":return te(t,n,r);case"<":return ee(t,n,r);case"<=":return ne(t,n,r);default:throw new TypeError("Invalid operator: ".concat(e))}};function ae(){if($t)return Zt;$t=1;var t=function(){function t(e,a){var i=this;if(l(this,t),a=n(a),e instanceof t)return e.loose===!!a.loose&&e.includePrerelease===!!a.includePrerelease?e:new t(e.raw,a);if(e instanceof r)return this.raw=e.value,this.set=[[e]],this.format(),this;if(this.options=a,this.loose=!!a.loose,this.includePrerelease=!!a.includePrerelease,this.raw=e.trim().split(/\s+/).join(" "),this.set=this.raw.split("||").map((function(t){return i.parseRange(t.trim())})).filter((function(t){return t.length})),!this.set.length)throw new TypeError("Invalid SemVer Range: ".concat(this.raw));if(this.set.length>1){var o=this.set[0];if(this.set=this.set.filter((function(t){return!m(t[0])})),0===this.set.length)this.set=[o];else if(this.set.length>1){var s,h=A(this.set);try{for(h.s();!(s=h.n()).done;){var u=s.value;if(1===u.length&&v(u[0])){this.set=[u];break}}}catch(t){h.e(t)}finally{h.f()}}}this.format()}return c(t,[{key:"format",value:function(){return this.range=this.set.map((function(t){return t.join(" ").trim()})).join("||").trim(),this.range}},{key:"toString",value:function(){return this.range}},{key:"parseRange",value:function(t){var n=this,i=((this.options.includePrerelease&&d)|(this.options.loose&&p))+":"+t,l=e.get(i);if(l)return l;var c=this.options.loose,v=c?o[s.HYPHENRANGELOOSE]:o[s.HYPHENRANGE];t=t.replace(v,k(this.options.includePrerelease)),a("hyphen replace",t),t=t.replace(o[s.COMPARATORTRIM],h),a("comparator trim",t),t=t.replace(o[s.TILDETRIM],u),a("tilde trim",t),t=t.replace(o[s.CARETTRIM],f),a("caret trim",t);var g=t.split(" ").map((function(t){return y(t,n.options)})).join(" ").split(/\s+/).map((function(t){return P(t,n.options)}));c&&(g=g.filter((function(t){return a("loose invalid filter",t,n.options),!!t.match(o[s.COMPARATORLOOSE])}))),a("range list",g);var E,x=new Map,T=g.map((function(t){return new r(t,n.options)})),M=A(T);try{for(M.s();!(E=M.n()).done;){var I=E.value;if(m(I))return[I];x.set(I.value,I)}}catch(t){M.e(t)}finally{M.f()}x.size>1&&x.has("")&&x.delete("");var b=w(x.values());return e.set(i,b),b}},{key:"intersects",value:function(e,n){if(!(e instanceof t))throw new TypeError("a Range is required");return this.set.some((function(t){return g(t,n)&&e.set.some((function(e){return g(e,n)&&t.every((function(t){return e.every((function(e){return t.intersects(e,n)}))}))}))}))}},{key:"test",value:function(t){if(!t)return!1;if("string"==typeof t)try{t=new i(t,this.options)}catch(t){return!1}for(var e=0;e<this.set.length;e++)if(_(this.set[e],t,this.options))return!0;return!1}}]),t}();Zt=t;var e=new Nt({max:1e3}),n=F,r=function(){if(zt)return Ht;zt=1;var t=Symbol("SemVer ANY"),e=function(){function e(r,a){if(l(this,e),a=n(a),r instanceof e){if(r.loose===!!a.loose)return r;r=r.value}r=r.trim().split(/\s+/).join(" "),o("comparator",r,a),this.options=a,this.loose=!!a.loose,this.parse(r),this.semver===t?this.value="":this.value=this.operator+this.semver.version,o("comp",this)}return c(e,[{key:"parse",value:function(e){var n=this.options.loose?r[a.COMPARATORLOOSE]:r[a.COMPARATOR],i=e.match(n);if(!i)throw new TypeError("Invalid comparator: ".concat(e));this.operator=void 0!==i[1]?i[1]:"","="===this.operator&&(this.operator=""),i[2]?this.semver=new s(i[2],this.options.loose):this.semver=t}},{key:"toString",value:function(){return this.value}},{key:"test",value:function(e){if(o("Comparator.test",e,this.options.loose),this.semver===t||e===t)return!0;if("string"==typeof e)try{e=new s(e,this.options)}catch(t){return!1}return i(e,this.operator,this.semver,this.options)}},{key:"intersects",value:function(t,r){if(!(t instanceof e))throw new TypeError("a Comparator is required");return""===this.operator?""===this.value||new h(t.value,r).test(this.value):""===t.operator?""===t.value||new h(this.value,r).test(t.semver):!((r=n(r)).includePrerelease&&("<0.0.0-0"===this.value||"<0.0.0-0"===t.value)||!r.includePrerelease&&(this.value.startsWith("<0.0.0")||t.value.startsWith("<0.0.0"))||(!this.operator.startsWith(">")||!t.operator.startsWith(">"))&&(!this.operator.startsWith("<")||!t.operator.startsWith("<"))&&(this.semver.version!==t.semver.version||!this.operator.includes("=")||!t.operator.includes("="))&&!(i(this.semver,"<",t.semver,r)&&this.operator.startsWith(">")&&t.operator.startsWith("<"))&&!(i(this.semver,">",t.semver,r)&&this.operator.startsWith("<")&&t.operator.startsWith(">")))}}],[{key:"ANY",get:function(){return t}}]),e}();Ht=e;var n=F,r=V.safeRe,a=V.t,i=re,o=N,s=Z,h=ae();return Ht}(),a=N,i=Z,o=V.safeRe,s=V.t,h=V.comparatorTrimReplace,u=V.tildeTrimReplace,f=V.caretTrimReplace,d=C.FLAG_INCLUDE_PRERELEASE,p=C.FLAG_LOOSE,m=function(t){return"<0.0.0-0"===t.value},v=function(t){return""===t.value},g=function(t,e){for(var n=!0,r=t.slice(),a=r.pop();n&&r.length;)n=r.every((function(t){return a.intersects(t,e)})),a=r.pop();return n},y=function(t,e){return a("comp",t,e),t=M(t,e),a("caret",t),t=x(t,e),a("tildes",t),t=b(t,e),a("xrange",t),t=S(t,e),a("stars",t),t},E=function(t){return!t||"x"===t.toLowerCase()||"*"===t},x=function(t,e){return t.trim().split(/\s+/).map((function(t){return T(t,e)})).join(" ")},T=function(t,e){var n=e.loose?o[s.TILDELOOSE]:o[s.TILDE];return t.replace(n,(function(e,n,r,i,o){var s;return a("tilde",t,e,n,r,i,o),E(n)?s="":E(r)?s=">=".concat(n,".0.0 <").concat(+n+1,".0.0-0"):E(i)?s=">=".concat(n,".").concat(r,".0 <").concat(n,".").concat(+r+1,".0-0"):o?(a("replaceTilde pr",o),s=">=".concat(n,".").concat(r,".").concat(i,"-").concat(o," <").concat(n,".").concat(+r+1,".0-0")):s=">=".concat(n,".").concat(r,".").concat(i," <").concat(n,".").concat(+r+1,".0-0"),a("tilde return",s),s}))},M=function(t,e){return t.trim().split(/\s+/).map((function(t){return I(t,e)})).join(" ")},I=function(t,e){a("caret",t,e);var n=e.loose?o[s.CARETLOOSE]:o[s.CARET],r=e.includePrerelease?"-0":"";return t.replace(n,(function(e,n,i,o,s){var h;return a("caret",t,e,n,i,o,s),E(n)?h="":E(i)?h=">=".concat(n,".0.0").concat(r," <").concat(+n+1,".0.0-0"):E(o)?h="0"===n?">=".concat(n,".").concat(i,".0").concat(r," <").concat(n,".").concat(+i+1,".0-0"):">=".concat(n,".").concat(i,".0").concat(r," <").concat(+n+1,".0.0-0"):s?(a("replaceCaret pr",s),h="0"===n?"0"===i?">=".concat(n,".").concat(i,".").concat(o,"-").concat(s," <").concat(n,".").concat(i,".").concat(+o+1,"-0"):">=".concat(n,".").concat(i,".").concat(o,"-").concat(s," <").concat(n,".").concat(+i+1,".0-0"):">=".concat(n,".").concat(i,".").concat(o,"-").concat(s," <").concat(+n+1,".0.0-0")):(a("no pr"),h="0"===n?"0"===i?">=".concat(n,".").concat(i,".").concat(o).concat(r," <").concat(n,".").concat(i,".").concat(+o+1,"-0"):">=".concat(n,".").concat(i,".").concat(o).concat(r," <").concat(n,".").concat(+i+1,".0-0"):">=".concat(n,".").concat(i,".").concat(o," <").concat(+n+1,".0.0-0")),a("caret return",h),h}))},b=function(t,e){return a("replaceXRanges",t,e),t.split(/\s+/).map((function(t){return R(t,e)})).join(" ")},R=function(t,e){t=t.trim();var n=e.loose?o[s.XRANGELOOSE]:o[s.XRANGE];return t.replace(n,(function(n,r,i,o,s,h){a("xRange",t,n,r,i,o,s,h);var l=E(i),u=l||E(o),c=u||E(s),f=c;return"="===r&&f&&(r=""),h=e.includePrerelease?"-0":"",l?n=">"===r||"<"===r?"<0.0.0-0":"*":r&&f?(u&&(o=0),s=0,">"===r?(r=">=",u?(i=+i+1,o=0,s=0):(o=+o+1,s=0)):"<="===r&&(r="<",u?i=+i+1:o=+o+1),"<"===r&&(h="-0"),n="".concat(r+i,".").concat(o,".").concat(s).concat(h)):u?n=">=".concat(i,".0.0").concat(h," <").concat(+i+1,".0.0-0"):c&&(n=">=".concat(i,".").concat(o,".0").concat(h," <").concat(i,".").concat(+o+1,".0-0")),a("xRange return",n),n}))},S=function(t,e){return a("replaceStars",t,e),t.trim().replace(o[s.STAR],"")},P=function(t,e){return a("replaceGTE0",t,e),t.trim().replace(o[e.includePrerelease?s.GTE0PRE:s.GTE0],"")},k=function(t){return function(e,n,r,a,i,o,s,h,l,u,c,f,d){return n=E(r)?"":E(a)?">=".concat(r,".0.0").concat(t?"-0":""):E(i)?">=".concat(r,".").concat(a,".0").concat(t?"-0":""):o?">=".concat(n):">=".concat(n).concat(t?"-0":""),h=E(l)?"":E(u)?"<".concat(+l+1,".0.0-0"):E(c)?"<".concat(l,".").concat(+u+1,".0-0"):f?"<=".concat(l,".").concat(u,".").concat(c,"-").concat(f):t?"<".concat(l,".").concat(u,".").concat(+c+1,"-0"):"<=".concat(h),"".concat(n," ").concat(h).trim()}},_=function(t,e,n){for(var i=0;i<t.length;i++)if(!t[i].test(e))return!1;if(e.prerelease.length&&!n.includePrerelease){for(var o=0;o<t.length;o++)if(a(t[o].semver),t[o].semver!==r.ANY&&t[o].semver.prerelease.length>0){var s=t[o].semver;if(s.major===e.major&&s.minor===e.minor&&s.patch===e.patch)return!0}return!1}return!0};return Zt}S(re);var ie,oe,se=ae(),he=function(t,e,n){try{e=new se(e,n)}catch(t){return!1}return e.test(t)},le={valid:et,coerce:ot,satisfies:S(he),SEMVER_SPEC_VERSION:P.SEMVER_SPEC_VERSION},ue=0,ce=1,fe=2,de=[0,1,2,2,3,0],pe=function(){function t(e,n,r,o){var s;if(l(this,t),f(this,"autoUpdate",!0),f(this,"skeleton",void 0),f(this,"states",void 0),this._app=e,this._position=new i.Vec3,1===a.TextureAtlas.length){var h,u=A((s=new a.TextureAtlas(n)).pages);try{for(u.s();!(h=u.n()).done;){var c=h.value;c.setTexture(new R(o[c.name]))}}catch(t){u.e(t)}finally{u.f()}}else s=new a.TextureAtlas(n,(function(t){return new R(o[t])}));var d=new a.SkeletonJson(new a.AtlasAttachmentLoader(s));d.scale*=.01;var p=d.readSkeletonData(r);this.skeletonVersion=le.valid(le.coerce(p.version)),this._spine_3_6_0=le.satisfies(this.skeletonVersion,"<=3.6.0"),this._spine_3_7_99=le.satisfies(this.skeletonVersion,"<=3.7.99"),this._spine_4_0_X=le.satisfies(this.skeletonVersion,"~4.0.0"),this._spine_4_1_X=le.satisfies(this.skeletonVersion,"~4.1.23"),this.skeleton=new a.Skeleton(p),this.skeleton.updateWorldTransform(),this.stateData=new a.AnimationStateData(this.skeleton.data),this.states=[new a.AnimationState(this.stateData)],this.clipper=new a.SkeletonClipping,this._node=new i.GraphNode,this._meshes=[],this._meshInstances=[],this._materials={},this._tint={},this._aabb=new i.BoundingBox,this._aabbTempArray=[],this._aabbTempOffset=new i.Vec2,this._aabbTempSize=new i.Vec2,this._renderCounts={vertexCount:0,indexCount:0},this._vertexFormat=null,this._vertexBuffer=null,this._indexBuffer=null,this._priority=0,this._timeScale=1,this._layers=[i.LAYERID_UI],this.init(),this._hidden=!1}return c(t,[{key:"destroy",value:function(){this.removeFromLayers();for(var t=0;t<this._meshInstances.length;t++)this._meshInstances[t].mesh.vertexBuffer=null,this._meshInstances[t].mesh.indexBuffer.length=0,this._meshInstances[t].material=null;this._vertexBuffer&&(this._vertexBuffer.destroy(),this._vertexBuffer=null),this._indexBuffer&&(this._indexBuffer.destroy(),this._indexBuffer=null),this._meshInstances=[],this.skeleton=null,this.stateData=null,this._materials={},this._node=null}},{key:"hide",value:function(){if(!this._hidden){for(var t=0,e=this._meshInstances.length;t<e;t++)this._meshInstances[t].visible=!1;this._hidden=!0}}},{key:"show",value:function(){if(this._hidden){for(var t=0,e=this._meshInstances.length;t<e;t++)this._meshInstances[t].visible=!0;this._hidden=!1}}},{key:"init",value:function(){this._vertexFormat=new i.VertexFormat(this._app.graphicsDevice,[{semantic:i.SEMANTIC_POSITION,components:2,type:i.TYPE_FLOAT32},{semantic:i.SEMANTIC_NORMAL,components:4,type:i.TYPE_UINT8,normalize:!0},{semantic:i.SEMANTIC_TEXCOORD0,components:2,type:i.TYPE_FLOAT32},{semantic:i.SEMANTIC_COLOR,components:4,type:i.TYPE_UINT8,normalize:!0}]);for(var t=this.skeleton.drawOrder,e=0,n=t.length;e<n;e++)this.initSlot(t[e])}},{key:"initSlot",value:function(t){t.positions=[],t.uvs=[],t.indices=[],t.vertexColor={},t._active={name:"",type:ue},this.initAttachment(t)}},{key:"createMaterial",value:function(t){var e=new i.StandardMaterial;if(e.emissiveMap=t,e.emissiveVertexColor=!0,e.opacityMap=t,e.opacityVertexColor=!0,e.depthWrite=!1,e.cull=i.CULLFACE_NONE,e.blendType=i.BLEND_PREMULTIPLIED,this._spine_3_6_0){var n=["gl_FragColor.rgb *= vVertexColor.a;","gl_FragColor.a = dAlpha;"].join("\n");e.chunks.outputAlphaPremulPS=n}return e.update(),e}},{key:"initAttachment",value:function(t){var e=t.attachment;if(e){t._active.name=e.name,e instanceof a.RegionAttachment?t._active.type=fe:e instanceof a.MeshAttachment&&(t._active.type=ce);var n=null;if(e.region&&(e.region.texture&&(n=e.region.texture.pcTexture),e.region.page&&e.region.page.texture&&(n=e.region.page.texture.pcTexture)),n)if(n instanceof i.StandardMaterial)this._materials[n.name]=n,t.material=n.name;else{var r=null;if(n.name?r=n.name:n.getSource()instanceof Image&&(r=n.getSource().getAttribute("src")),r){if(void 0===this._materials[r]){var o=this.createMaterial(n);this._materials[r]=o}t.material=r}}}}},{key:"updateSlot",value:function(t,e){var n=t.attachment,r=n.name,i=n instanceof a.RegionAttachment?fe:n instanceof a.MeshAttachment?ce:ue;t._active.name===r&&t._active.type===i||this.initAttachment(t),t.positions.length=0,n instanceof a.RegionAttachment?this._spine_4_1_X?n.computeWorldVertices(t,t.positions,0,2):n.computeWorldVertices(t.bone,t.positions,0,2):n instanceof a.MeshAttachment&&n.computeWorldVertices(t,0,n.worldVerticesLength,t.positions,0,2);var o=this._tint[r];t.vertexColor={r:Math.round(255*t.color.r*(o?o.r:1)),g:Math.round(255*t.color.g*(o?o.g:1)),b:Math.round(255*t.color.b*(o?o.b:1)),a:Math.round(255*t.color.a*(o?o.a:1))};var s,h,l=n.triangles||de;if(e.isClipping()){e.clipTriangles(t.positions,0,l,l.length,n.uvs,a.Color.WHITE,a.Color.WHITE,false),t.positions.length=0,t.uvs.length=0;for(h=e.clippedVertices.length,s=0;s<h;s+=8)t.positions.push(e.clippedVertices[s],e.clippedVertices[s+1]),t.uvs.push(e.clippedVertices[s+6],1-e.clippedVertices[s+7]);t.indices=e.clippedTriangles.slice()}else{for(t.uvs.length=0,h=t.positions.length,s=0;s<h;s+=2)t.uvs.push(n.uvs[s],1-n.uvs[s+1]);t.indices=l}this._renderCounts.vertexCount+=t.positions.length/2,this._renderCounts.indexCount+=t.indices.length}},{key:"updateSkeleton",value:function(t){this._renderCounts.vertexCount=0,this._renderCounts.indexCount=0;var e=this.clipper;for(var n=this.skeleton.drawOrder,r=n.length,i=0;i<r;i++){var o=n[i];if(this._spine_3_7_99||o.bone.active){0;var s=o.getAttachment();s instanceof a.ClippingAttachment?e.clipStart(o,s):s instanceof a.RegionAttachment||s instanceof a.MeshAttachment?this.updateSlot(o,e):this._spine_3_7_99||e.clipEndWithSlot(o)}else e.clipEndWithSlot(o)}}},{key:"render",value:function(){if(this._meshInstances.forEach((function(t){t.material=null})),this.removeFromLayers(),this._meshes=[],this._meshInstances.length=0,this._renderCounts.indexCount>0&&this._renderCounts.vertexCount>0){this.skeleton.getBounds(this._aabbTempOffset,this._aabbTempSize,this._aabbTempArray),this._aabb.center=new i.Vec3(this._aabbTempOffset.x,this._aabbTempOffset.y,0),this._aabb.halfExtents=new i.Vec3(.5*this._aabbTempSize.x,.5*this._aabbTempSize.y,0),(!this._vertexBuffer||this._vertexBuffer.getNumVertices()<this._renderCounts.vertexCount)&&(this._vertexBuffer&&this._vertexBuffer.destroy(),this._vertexBuffer=new i.VertexBuffer(this._app.graphicsDevice,this._vertexFormat,this._renderCounts.vertexCount)),(!this._indexBuffer||this._indexBuffer.getNumIndices()<this._renderCounts.indexCount)&&(this._indexBuffer&&this._indexBuffer.destroy(),this._indexBuffer=new i.IndexBuffer(this._app.graphicsDevice,i.INDEXFORMAT_UINT16,this._renderCounts.indexCount));for(var t=null,e=0,n=0,r=new i.VertexIterator(this._vertexBuffer),a=new Uint16Array(this._indexBuffer.lock()),o=0,s=0,h=this.skeleton.drawOrder,l=h.length,u=0;u<l;u++){var c=h[u];if(c.attachment&&c.material&&c.positions.length>0&&c.indices.length>0){t&&t!==c.material&&(this.SubmitBatch(e,n,t),t=c.material,e=o,n=0),t=c.material;var f=c.positions,d=c.vertexColor.r,p=c.vertexColor.g,m=c.vertexColor.b,v=c.vertexColor.a,g=c.uvs,y=void 0,E=f.length/2;for(y=0;y<E;y++)r.element[i.SEMANTIC_POSITION].set(f[2*y],f[2*y+1]),r.element[i.SEMANTIC_NORMAL].set(0,255,0,0),r.element[i.SEMANTIC_COLOR].set(d,p,m,v),r.element[i.SEMANTIC_TEXCOORD0].set(g[2*y],1-g[2*y+1]),r.next();var w=c.indices,x=w.length;for(y=0;y<x;y++)a[o+y]=w[y]+s;n+=x,o+=x,s+=E}}r.end(),this._indexBuffer.unlock(),this.SubmitBatch(e,n,t)}this.addToLayers()}},{key:"SubmitBatch",value:function(t,e,n){if(e>0){var r=new i.Mesh(this._app.graphicsDevice);r.vertexBuffer=this._vertexBuffer,r.indexBuffer[0]=this._indexBuffer,r.primitive[0].type=i.PRIMITIVE_TRIANGLES,r.primitive[0].base=t,r.primitive[0].count=e,r.primitive[0].indexed=!0,r.aabb=this._aabb,this._meshes.push(r);var a=new i.MeshInstance(r,this._materials[n],this._node);a.drawOrder=this.priority+this._meshInstances.length,a.visible=!this._hidden,this._meshInstances.push(a)}}},{key:"update",value:function(t){if(!this._hidden){var e;t*=this._timeScale;var n=this.states.length;for(e=0;e<n;e++)this.states[e].update(t);for(e=0;e<n;e++)this.states[e].apply(this.skeleton);this.autoUpdate&&this.skeleton.updateWorldTransform(),this.updateSkeleton(),this.render()}}},{key:"setPosition",value:function(t){this._position.copy(t)}},{key:"setTint",value:function(t,e){this._tint[t]=e}},{key:"removeFromLayers",value:function(){if(this._meshInstances.length)for(var t=0;t<this._layers.length;t++){var e=this._app.scene.layers.getLayerById(this._layers[t]);e&&e.removeMeshInstances(this._meshInstances)}}},{key:"addToLayers",value:function(){if(this._meshInstances.length)for(var t=0;t<this._layers.length;t++){var e=this._app.scene.layers.getLayerById(this._layers[t]);e&&e.addMeshInstances(this._meshInstances)}}},{key:"state",get:function(){return this.states[0]}},{key:"priority",get:function(){return this._priority},set:function(t){this._priority=t}},{key:"timeScale",get:function(){return this._timeScale},set:function(t){this._timeScale=t}},{key:"layers",get:function(){return this._layers},set:function(t){this.removeFromLayers(),this._layers=t||[],this.addToLayers()}}]),t}(),me=function(e){d(r,e);var n=g(r);function r(t,e){var a;return l(this,r),(a=n.call(this,t,e)).on("set_atlasAsset",a.onSetAsset,v(a)),a.on("set_textureAssets",a.onSetAssets,v(a)),a.on("set_skeletonAsset",a.onSetAsset,v(a)),a.on("set_atlasData",a.onSetResource,v(a)),a.on("set_textures",a.onSetResource,v(a)),a.on("set_skeletonData",a.onSetResource,v(a)),a}return c(r,[{key:"_createSpine",value:function(){this.data.spine&&(this.data.spine.destroy(),this.data.spine=null);for(var e={},n=0,r=this.textureAssets.length;n<r;n++){var a=this.system.app.assets.get(this.textureAssets[n]),i=a.name?a.name:a.file?a.file.filename:null;i||(i=t.path.getBasename(a.file.url));var o=i.indexOf("?");-1!==o&&(i=i.substring(0,o)),e[i]=a.resource}this.data.spine=new pe(this.system.app,this.atlasData,this.skeletonData,e),this.state=this.data.spine.state,this.states=this.data.spine.states,this.skeleton=this.data.spine.skeleton,this.entity.addChild(this.data.spine._node)}},{key:"_onAssetReady",value:function(t){var e=t.type,n=t.resource;"texture"===e&&this.textures.push(n),"json"===e&&(this.skeletonData=n),"text"===e&&(this.atlasData=n)}},{key:"_onAssetAdd",value:function(t){t.off("change",this.onAssetChanged,this),t.on("change",this.onAssetChanged,this),t.off("remove",this.onAssetRemoved,this),t.on("remove",this.onAssetRemoved,this),t.ready(this._onAssetReady,this),this.system.app.assets.load(t)}},{key:"onSetResource",value:function(){this.data.atlasData&&this.data.textures.length&&this.data.skeletonData&&this._createSpine()}},{key:"onSetAsset",value:function(e,n,r){var a=this.system.app.assets,i=null;if(n&&(i=a.get(n))&&(i.off("change",this.onAssetChanged),i.off("remove",this.onAssetRemoved)),r){var o=r;r instanceof t.Asset&&(o=r.id,this.data[e]=o),(i=a.get(o))?this._onAssetAdd(i):a.on("add:".concat(o))}}},{key:"onSetAssets",value:function(e,n,r){var a,i,o=this.system.app.assets,s=null;if(n.length)for(a=0,i=n.length;a<i;a++)(s=o.get(n[a]))&&(s.off("change",this.onAssetChanged),s.off("remove",this.onAssetRemoved));if(r&&r.length){var h=r.map((function(e){return e instanceof t.Asset?e.id:e}));for(a=0,i=r.length;a<i;a++)(s=o.get(h[a]))?this._onAssetAdd(s):o.on("add:".concat(h[a]))}}},{key:"onAssetChanged",value:function(t,e,n,r){}},{key:"onAssetRemoved",value:function(t){}},{key:"onEnable",value:function(){t.Component.prototype.onEnable.call(this);var e=this.data.spine;e&&e.addToLayers()}},{key:"onDisable",value:function(){t.Component.prototype.onDisable.call(this);var e=this.data.spine;e&&e.removeFromLayers()}},{key:"hide",value:function(){this.data.spine&&this.data.spine.hide()}},{key:"show",value:function(){this.data.spine&&this.data.spine.show()}},{key:"removeComponent",value:function(){var t;if(this.atlasAsset&&(t=this.system.app.assets.get(this.atlasAsset))&&(t.off("change",this.onAssetChanged),t.off("remove",this.onAssetRemoved)),this.skeletonAsset&&(t=this.system.app.assets.get(this.skeletonAsset))&&(t.off("change",this.onAssetChanged),t.off("remove",this.onAssetRemoved)),this.textureAssets&&this.textureAssets.length)for(var e=0;e<this.textureAssets.length;e++)(t=this.system.app.assets.get(this.textureAssets[e]))&&(t.off("change",this.onAssetChanged),t.off("remove",this.onAssetRemoved))}}]),r}(t.Component),ve=c((function t(){l(this,t),this.enabled=!0,this.atlasAsset=null,this.textureAssets=[],this.skeletonAsset=null,this.speed=1,this.spine=null,this.atlasData=null,this.textures=[],this.skeletonData=null})),ge=function(t){d(n,t);var e=g(n);function n(t){var r;return l(this,n),(r=e.call(this,t)).id="spine",r.ComponentType=me,r.DataType=ve,r.schema=["enabled","atlasAsset","textureAssets","skeletonAsset","atlasData","textures","skeletonData","speed","spine"],r.on("beforeremove",r.onBeforeRemove,v(r)),r.app.systems.on("update",r.onUpdate,v(r)),r}return c(n,[{key:"initializeComponentData",value:function(t,e,r){r=["enabled","atlasAsset","textureAssets","skeletonAsset","atlasData","textures","skeletonData","spine"],y(p(n.prototype),"initializeComponentData",this).call(this,t,e,r)}},{key:"onBeforeRemove",value:function(t,e){var n=t.spine.data;n.spine&&n.spine.destroy(),t.spine.removeComponent()}},{key:"onUpdate",value:function(t){var e=this.store;for(var n in e)if(e.hasOwnProperty(n)){var r=e[n],a=r.data;a.enabled&&r.entity.enabled&&a.spine&&(a.spine.setPosition(r.entity.getPosition()),a.spine.update(a.speed*t))}}}]),n}(t.ComponentSystem);return ie=i.Application.getApplication(),oe=new ge(ie),ie.systems.add(oe),a}(pc);

// spine.js
var Spine = pc.createScript("spine");

Spine.attributes.add("atlas", { type: "asset", assetType: "text" });
Spine.attributes.add("skeleton", { type: "asset", assetType: "json" });
Spine.attributes.add("textures", { type: "asset", array: true, assetType: "texture" });
Spine.attributes.add("priority", { type: "number", default: 1 });

Spine.prototype.initialize = function () {
    if (this.atlas && this.textures && this.skeleton) {
        // If all assets are present, add the spine component to the entity
        this.entity.addComponent("spine", {
            atlasAsset: this.atlas.id,
            textureAssets: this.textures.map(function (a) {
                return a.id;
            }),
            skeletonAsset: this.skeleton.id
        });
        if (this.entity.spine) {
            this.priority = this.priority ? this.priority : 0;
            this.entity.spine.spine.priority = this.priority;
        }
    }

    this.on('attr:priority', function (val) {
        if (this.entity.spine) {
            this.entity.spine.spine.priority = val;
        }
    }, this);
};

Spine.prototype.postInitialize = function () {

};


// play-anim.js
var PlayAnim = pc.createScript('playAnim');

PlayAnim.attributes.add('event', {
    title: 'Events',
    type: 'json',
    schema: [
        {
            name: 'eventScope', type: 'number', title: 'Events Scope',
            enum: [{ 'App': 0 }, { 'Entity': 1 },], default: 0
        },
        { name: 'playByIndex', type: 'string', title: 'Play By Index', description: 'Call this event to play animation by index and time. Call Example playByIndex(index, time)', default: 'PlayAnim:ByIndex'},
        { name: 'playByName', type: 'string', title: 'Play By Name', description: 'Call this event to play animation by name and time. Call Example playByIndex(name, time)', default: 'PlayAnim:ByName'},
    ]
});

PlayAnim.attributes.add('settings', {
    title: 'Settings',
    type: 'json',
    schema: [
        { name: 'playIndex', type: 'number', title: 'Play Index', description: 'Set -1 to not play animation on postInitialize', default: -1},
        { name: 'track', type: 'number', title: 'Track', description: 'Tranck on which the animation will be played', },
        { name: 'spineEntity', type: 'entity', title: 'Spine Entity', description: 'Entity to which spine.js is attached. Leave empty if spine.js is attached to this entity', },
        { name: 'animNames', type: 'string', title: 'Animation Names', description: 'Put all animation names here in order to make event.playByIndex work', array: true},
    ]
});

PlayAnim.prototype.initialize = function() {
    this.entity.spine.layers = [this.app.scene.layers.getLayerByName('Spine World')];
    this.spineEntity = this.spineEntity || this.entity;
};

// initialize code called once per entity
PlayAnim.prototype.postInitialize = function() {

    let scope = this.event.eventScope === 0 ? this.app : this.entity;
    scope.on(this.event.playByIndex, this.playByIndex, this);
    scope.on(this.event.playByName, this.playByName, this);

    // this.spineEntity.spine.state.mixDuration = 1;
    if (this.settings.playIndex !== -1) {
        this.playByIndex(this.settings.playIndex, this.settings.track);
    }
};

// update code called every frame
PlayAnim.prototype.update = function(dt) {
    
};

PlayAnim.prototype.playByIndex = function(index, loop, track, dur) {
    this.playByName(this.settings.animNames[index], track, loop, dur);
}

PlayAnim.prototype.playByName = function(name, loop, track, dur) {
    if (!track) track = 0;
    if (!dur) dur = 0.2;
    let entry = this.spineEntity.spine.state.setAnimation(track, name, loop);
    entry.mixDuration = dur;
}

// swap method called for script hot-reloading
// inherit your script state here
// PlayAnim.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/

// PlayerMovement.js
var PlayerMovement = pc.createScript('playerMovement');

PlayerMovement.attributes.add('player', { type: 'entity', title: 'Player' });
PlayerMovement.attributes.add('alwaysPerfect', { type: 'boolean', title: 'Always Perfect' });
PlayerMovement.attributes.add('initPos', { type: 'vec3', title: 'Initial Position' });
PlayerMovement.attributes.add('shadow', { type: 'entity', title: "Shadow" });
PlayerMovement.attributes.add('shadowIcons', {
    title: 'Shadow Icons',
    type: 'json',
    schema: [
        { name: 'initIcon', type: 'entity', title: 'Menu Icon' },
        { name: 'gameIcon', type: 'entity', title: 'Gameplay Icon' }
    ]
});
PlayerMovement.attributes.add('jumpSettings', {
    title: 'Jump Settings',
    type: 'json',
    schema: [
        { name: 'height', type: 'number', title: 'Height' },
        { name: 'speed', type: 'number', title: 'Speed' },
    ]
});


PlayerMovement.attributes.add('bounds', {
    title: 'Bounds',
    type: 'json',
    schema: [
        { name: 'left', type: 'entity', title: 'Left' },
        { name: 'right', type: 'entity', title: 'Right' },
    ]
});

// initialize code called once per entity
PlayerMovement.prototype.initialize = function () {
    this.isDead = false;
    this.isJumping = false;
    this.jumpProgress = 0;
    this.isForcedJump = false;

    this.player = this.player || this.entity;
    this.player.setPosition(pc.Vec3.ZERO);

    this.groundPosition = this.player.getPosition().y;
    this.nextGroundPosition = this.groundPosition;
    this.boxHeight = 0;

    this.entity.on('Jump', this.jump, this);
    this.entity.on('Start', this.start, this);
    this.entity.on('Revive', this.revive, this);
    this.entity.on('Reset', this.reset, this);
};

// update code called every frame
PlayerMovement.prototype.update = function (dt) {
    if (this.isDead) return;
    this.updateJump(dt);
};

PlayerMovement.prototype.start = function (start) {
    this.isDead = !start;
    this.isJumping = false;
    this.jumpProgress = 0;

    this.shadowIcons.initIcon.enabled = false;
    this.shadowIcons.gameIcon.enabled = true;
};

PlayerMovement.prototype.reset = function () {
    this.shadowIcons.initIcon.enabled = true;
    this.shadowIcons.gameIcon.enabled = false;
    this.player.setPosition(this.initPos.x, this.initPos.y, this.initPos.z);
    this.isJumping = false;
    this.groundPosition = this.player.getPosition().z;
    this.nextGroundPosition = this.groundPosition;
    this.updateShadow(this.groundPosition);
};

PlayerMovement.prototype.revive = function () {
    let pos = this.player.getPosition();
    this.player.setPosition(pos.x, this.groundPosition, pos.z);
    this.updateShadow(this.groundPosition);
    this.jumpProgress = 0;
};

PlayerMovement.prototype.jump = function (isForced) {
    if (this.isJumping) return;

    this.jumpProgress = 0;
    this.isJumping = true;
    this.isForcedJump = isForced != undefined ? isForced : false;
    if (this.isForcedJump) this.isDead = false;
};

PlayerMovement.prototype.updateJump = function (dt) {
    if (!this.isJumping) return;

    let pos = this.player.getPosition();
    this.jumpProgress += this.jumpSettings.speed * dt;
    var y = this.groundPosition + Math.sin(this.jumpProgress * Math.PI) * this.jumpSettings.height;
    this.player.setPosition(pos.x, y, pos.z);
    this.updateShadow(y);

    // If Progress completed or ground position reached
    if (this.jumpProgress >= 1 || y <= this.nextGroundPosition) {
        this.finishJump();
    }
};

PlayerMovement.prototype.finishJump = function () {

    this.isJumping = false;
    this.app.fire('SdkManager:Vibrate');
    let pos = this.player.getPosition();
    pos.y = this.nextGroundPosition;
    this.player.setPosition(pos.x, this.nextGroundPosition, pos.z);
    if (!this.isForcedJump) {
        if (this.groundPosition != this.nextGroundPosition) {
            this.app.fire('Gameplay:OnPlayerJump', this.isPerfectJump || this.alwaysPerfect, pos, this.boxHeight);
        }
    }
    this.groundPosition = this.nextGroundPosition;
    pos = this.player.getPosition();
    pos.y += 0.3;
    this.app.fire('Box:PlayerLanded');
    this.app.fire('PlayerController:FinishJump', this.isForcedJump);
    this.isPerfectJump = false;
    this.isForcedJump = false;
};

PlayerMovement.prototype.updateGroundPosition = function (newPos, isPerfectJump) {
    // console.log('updateGroundPosition: ', newPos);
    if (isPerfectJump) this.isPerfectJump = true;
    this.nextGroundPosition = newPos;
};

PlayerMovement.prototype.updateShadow = function (y, setIcon, newPos) {
    let groundY = this.nextGroundPosition;

    // Update Position
    let pos = this.shadow.getPosition();
    this.shadow.setPosition(pos.x, groundY, pos.z);

    // Update Scale
    let dist = Math.abs(y - groundY) / this.jumpSettings.height;
    let scale = 1 - dist;
    // console.log("Shadow: ", dist.toFixed(2), scale.toFixed(2));
    this.shadow.setLocalScale(scale, scale, scale);
};

PlayerMovement.prototype.getZBound = function (mul) {
    // Negative Mul means Platform is coming from left side of the player.
    return mul != -1 ? this.bounds.left.getPosition().x : this.bounds.right.getPosition().x;
}


PlayerMovement.prototype.dead = function (isDead) {
    this.isDead = isDead;
    if (!isDead) return;
    this.app.fire('PlayerController:Dead');
};

// PlatformGenerator.js
var PlatformGenerator = pc.createScript('platformGenerator');


PlatformGenerator.attributes.add('settings', {
    title: 'Settings',
    type: 'json',
    schema: [
        { name: 'timeRange', type: 'vec2', title: 'Time Range', default: [2, 2] },
        { name: 'speed', type: 'vec2', title: 'Speed Range', default: [25, 30] },
        { name: 'speedIncrement', type: 'number', title: 'Speed Increment', default: 5 },
        { name: 'startingPos', type: 'vec3', title: 'Starting Position', default: [0, 2, -18] },
        { name: 'heightIncrement', type: 'number', title: 'Height Increment', default: 2 },
        { name: 'angles', type: 'vec3', title: 'Starting Angle', default: [0, 50, 0] },
        { name: 'countLimit', type: 'number', title: 'Count Increment Count', default: 5, description: 'Speed of boxes will increase after every this many boxes' },
    ],
});

PlatformGenerator.attributes.add('speedSettings', {
    title: 'Speed Settings',
    type: 'json',
    schema: [
        { name: 'initialBox', type: 'vec2', title: 'Initial Box Speed' },
        { name: 'initialBoxCount', type: 'number', title: 'Initial Box Count' },
        { name: 'revivalBox', type: 'vec2', title: 'Revival Box Speed' },
        { name: 'revivalBoxCount', type: 'number', title: 'Revival Box Count' },
        { name: 'fastBoxSpeed', type: 'vec2', title: 'Fast Box Speed' },
        { name: 'fastSpeedIncrement', type: 'number', title: 'Fast Speed Increment', default: 5 },
        { name: 'slowBoxSpeed', type: 'vec2', title: 'Slow Box Speed' },
        { name: 'slowSpeedIncrement', type: 'number', title: 'Slow Speed Increment', default: 2 },
        { name: 'isSlowSpeed', type: 'boolean', title: 'Slow Speed' },
        { name: 'repeatCount', type: 'number', title: 'Repeat Speed Count' },
        { name: 'initialSpeed', type: 'boolean', title: 'Initial Speed Check' },
        { name: 'speedSwitch', type: 'vec2', title: 'Speed Switch Range', default: [5, 8] }
    ]
});

PlatformGenerator.attributes.add('refs', {
    title: 'References',
    type: 'json',
    schema: [
        { name: 'player', type: 'entity', title: 'Player' },
        { name: 'platformPool', type: 'entity', title: 'Platform Pool' },
    ],
});

PlatformGenerator.attributes.add('testing', {
    title: 'Testing',
    type: 'json',
    schema: [
        { name: 'fixedSide', type: 'number', title: 'Fixed Side', enum: [{ "None": 0 }, { "Left": 1 }, { "Right": 2 }] },
    ],
});

// initialize code called once per entity
PlatformGenerator.prototype.initialize = function () {
    PlatformGenerator.Instance = this;
    this.entity.on('Start', this.start, this);
    this.entity.on('Revive', this.revive, this);
    this.entity.on('Reset', this.reset, this);
    this.entity.on('RemoveKillers', this.removeKillers, this);
    this.app.on('Platform:AddKiller', this.addKiller, this);
};

PlatformGenerator.prototype.postInitialize = function () {
    this.pool = this.refs.platformPool.script.PoolController;
    this.killerBoxes = [];
    this.boxHeight = undefined;
    this.playerInfo = this.refs.player.script.playerController.movement.script.playerMovement;
    this.count = 1;
    this.repeatCount = 0;
    this.isRevived = false;
    this.countAfterRevive = 0;
    this.switchCount = Math.floor(pc.math.random(this.speedSettings.speedSwitch.x, this.speedSettings.speedSwitch.y));

    this.currentSpeed = new pc.Vec2(this.speedSettings.initialBox.x, this.speedSettings.initialBox.y);
    this.oldSpeed = new pc.Vec2(this.speedSettings.initialBox.x, this.speedSettings.initialBox.y);

    this.slowSpeed = new pc.Vec2(this.speedSettings.slowBoxSpeed.x, this.speedSettings.slowBoxSpeed.y);
    this.fastSpeed = new pc.Vec2(this.speedSettings.fastBoxSpeed.x, this.speedSettings.fastBoxSpeed.y);
    this.reset();
    // // console.log('PlatformGenerator: ', this.entity.name, this.isStarted);
};

// update code called every frame
PlatformGenerator.prototype.update = function (dt) {
    // // // console.log('PlatformGenerator:isStarted -> ', this.isStarted);
    if (!this.isStarted) return;
    this.checkForGeneration(dt);
};

PlatformGenerator.prototype.reset = function () {
    // // console.log("Platform Reset called");
    this.time = 0;
    this.settings.startingPos.y /= this.count;
    this.count = 1;
    this.repeatCount = 0;

    this.currentSpeed.x = this.speedSettings.initialBox.x;
    this.currentSpeed.y = this.speedSettings.initialBox.y;
    this.pool.restoreAll();
    // // console.log("Starting Pos: ", this.settings.startingPos);
    this.killerBoxes = [];
    this.isStarted = false;

    this.isRevived = false;
    this.countAfterRevive = 0;

    this.oldSpeed.x = this.speedSettings.initialBox.x;
    this.oldSpeed.y = this.speedSettings.initialBox.y;

    this.slowSpeed.x = this.speedSettings.slowBoxSpeed.x;
    this.slowSpeed.y = this.speedSettings.slowBoxSpeed.y;

    this.fastSpeed.x = this.speedSettings.fastBoxSpeed.x;
    this.fastSpeed.y = this.speedSettings.fastBoxSpeed.y;

    this.speedSettings.initialSpeed = true;
    this.speedSettings.isSlowSpeed = true;
}

PlatformGenerator.prototype.start = function (start) {
    // // console.log('Start: ', start);
    this.isStarted = start;
    if (!start) {
        this.oldSpeed.x = this.currentSpeed.x;
        this.oldSpeed.y = this.currentSpeed.y;
    }
};

PlatformGenerator.prototype.revive = function (playerPos) {
    this.time = 0;
    //  this.settings.startingPos.y -= this.settings.heightIncrement;
    this.settings.startingPos.y = playerPos + this.settings.heightIncrement;
    this.currentSpeed.x = this.speedSettings.revivalBox.x;
    this.currentSpeed.y = this.speedSettings.revivalBox.y;
    this.isStarted = true;
    this.isRevived = true;
    this.countAfterRevive = 0;
};

PlatformGenerator.prototype.removeKillers = function () {
    this.count -= (this.killerBoxes.length + 1);
    for (i = 0; i < this.killerBoxes.length; i++) {
        this.pool.restore(this.killerBoxes[i].entity);
    }
    this.killerBoxes = [];
};

PlatformGenerator.prototype.addKiller = function (box) {
    this.killerBoxes.push(box);
    //  // // console.log("Added Killer");
}

// Checking for generating next Platform and checking for increasing speed range.
PlatformGenerator.prototype.checkForGeneration = function (dt) {
    this.time -= dt;
    if (this.time > 0) return;

    let min = this.settings.timeRange.x;
    let max = this.settings.timeRange.y;
    this.time = pc.math.random(min, max);

    if (this.speedSettings.initialSpeed && this.count > this.speedSettings.initialBoxCount) {
        this.currentSpeed.x = this.speedSettings.slowBoxSpeed.x;
        this.currentSpeed.y = this.speedSettings.slowBoxSpeed.y;
        // console.log('PlatformGenerator:Initial Speed Changing:New Speed: ', this.currentSpeed);
        this.speedSettings.initialSpeed = false;
    }

    if (this.count > 0 && this.count % this.switchCount === 0 && !this.isRevived) {
        // console.log("PlatformGenerator: Updating Box Speed");
        let status = (Math.floor(pc.math.random(0, 100)) % 2) === 0 ? true : false;
        this.switchCount = Math.floor(pc.math.random(this.speedSettings.speedSwitch.x, this.speedSettings.speedSwitch.y));


        // Check whether speed is changing or not, count if it remains same
        if (status === this.speedSettings.isSlowSpeed) this.repeatCount++;
        else
            this.repeatCount = 0;

        // If same speed is repeated X times, forcefully change the speed
        if (this.repeatCount === this.speedSettings.repeatCount) {
            // console.log("PlatformGenerator: Speed forcefully changing")
            this.repeatCount = 0;
            this.speedSettings.isSlowSpeed = !status;
        }
        else {
            // console.log("PlatformGenerator: Speed not forcefully changing")
            this.speedSettings.isSlowSpeed = status;
        }

        if (this.speedSettings.isSlowSpeed) {
            this.currentSpeed.x = this.slowSpeed.x;
            this.currentSpeed.y = this.slowSpeed.y;
            // console.log('PlatformGenerator:NewSpeed:Slow: ', this.currentSpeed);
        }
        else {
            this.currentSpeed.x = this.fastSpeed.x;
            this.currentSpeed.y = this.fastSpeed.y;
            // console.log('PlatformGenerator:NewSpeed:Fast: ', this.currentSpeed);
        }
    }


    let speed = pc.math.random(this.currentSpeed.x, this.currentSpeed.y);
    this.generatePlatform(speed);

    // After Revival Speed
    if (this.isRevived) {
        this.countAfterRevive++;
        this.currentSpeed.x = this.speedSettings.revivalBox.x;
        this.currentSpeed.y = this.speedSettings.revivalBox.y;
        // console.log('PlatformGenerator:RevivalSpeed Set: ', this.currentSpeed);
        if (this.countAfterRevive === this.speedSettings.revivalBoxCount) {
            this.isRevived = false;
            this.currentSpeed.x = this.oldSpeed.x;
            this.currentSpeed.y = this.oldSpeed.y;
            // console.log('PlatformGenerator:Revival Speed Changed: ', this.currentSpeed);
        }
    }
    // Increment speed 
    else if (!((this.count - this.speedSettings.initialBoxCount) % this.settings.countLimit) && (this.count > this.speedSettings.initialBoxCount)) {

        let increment = this.speedSettings.isSlowSpeed ? this.speedSettings.slowSpeedIncrement : this.speedSettings.fastSpeedIncrement;
        this.currentSpeed.x += increment;
        this.currentSpeed.y += increment;

        if (this.speedSettings.isSlowSpeed) {
            this.slowSpeed.x = this.currentSpeed.x;
            this.slowSpeed.y = this.currentSpeed.y;
            // console.log('PlatformGenerator: Slow Speed incremented: ', this.currentSpeed);
        }
        else {
            this.fastSpeed.x = this.currentSpeed.x;
            this.fastSpeed.y = this.currentSpeed.y;
            // console.log('PlatformGenerator: Fast Speed incremented: ', this.currentSpeed);
        }
    }
};

PlatformGenerator.prototype.generatePlatform = function (speed) {
    var randomNo = this.testing.fixedSide !== 0 ? this.testing.fixedSide : Math.floor(pc.math.random(0, 100));
    var mul = randomNo % 2 ? -1 : 1;
    let angles = this.settings.angles;
    this.count++;
    // If mul is -1, Platform will be generated on the left side, otherwise it will be generated on the right side.
    this.settings.angles = new pc.Vec3(angles.x, Math.abs(angles.y) * mul, angles.z);

    var boxEntity = this.pool.get();
    if (!this.boxHeight) {
        this.boxHeight = this.settings.startingPos.y;
        this.playerInfo.boxHeight = this.boxHeight;
    }

    this.setBox(boxEntity, mul, speed);
    this.settings.startingPos.y += this.settings.heightIncrement;
};

PlatformGenerator.prototype.setBox = function (boxEntity, mul, speed) {
    boxEntity.setPosition(this.settings.startingPos);
    boxEntity.setEulerAngles(this.settings.angles);
    boxEntity.enabled = true;

    var box = boxEntity.script.box;
    box.player = this.refs.player;
    box.playerInfo = this.playerInfo;

    box.speed = speed * -mul;
    box.setEdge();
    box.isMoving = true;
};


// Box.js
var Box = pc.createScript('box');

Box.attributes.add("edge", { type: "entity", title: 'Edge', description: 'Edge of box which updates to right or left depending from where player is comming' });
Box.attributes.add("minimumCollisionPoint", { type: 'number' });
Box.attributes.add("standPoint", { type: 'number' });
Box.attributes.add("model", { type: 'entity' });
Box.attributes.add('collisionRange', { type: 'vec2', title: 'Collision Range', description: 'If player\'s y position is in this range, this means player is colliding with box' })

// When Box is coming from right side, edge.x is negative and when it is coming from left side, edge.x is positive
// Speed will be negative if Platform is coming from right side otherwise it will be positive.

// initialize code called once per entity
Box.prototype.initialize = function () {
    this.isMoving = false;
    this.player = null;
    this.playerInfo = null;
    this.speed = 0;
    this.app.on('Box:Stop', this.stop, this);
    this.app.on('Box:PlayerLanded', this.playerLanded, this);
};

Box.prototype.movement = function (dt) {

    let angles = this.entity.getEulerAngles();
    angles.y += this.speed * dt;
    this.entity.setEulerAngles(angles);

    // Checking if the platform has reached its maximum point i.e. the center.
    let mul = (this.speed > 0 ? 1 : -1);
    this.checkForCenter(mul);

};


Box.prototype.checkForCenter = function (mul) {
    let angles = this.entity.getEulerAngles();
    if (angles.y * mul >= 0) {
        // console.log('isPerfectJump: ', true);
        this.app.fire('PerfectJumpEffect:AddBox', this.model);
        this.isMoving = false;
        this.playerInfo.updateGroundPosition(this.entity.getPosition().y, true);
        this.entity.setEulerAngles(angles.x, 0, angles.z);
    }
}

Box.prototype.setEdge = function () {
    var multiplier = (this.speed > 0 ? 1 : -1);
    let pos = this.edge.getLocalPosition();
    pos.x = multiplier * Math.abs(pos.x);
    this.edge.setLocalPosition(pos);
};

Box.prototype.checkBounds = function () {
    let mul = this.speed > 0 ? 1 : -1;
    let x = this.playerInfo.getZBound(mul);
    let pos = this.edge.getPosition();
    if (Math.abs(pos.x) <= Math.abs(x)) {
        // If platform/box has reached the player's bounds
        return true;
    }
    return false;
};

Box.prototype.checkHeight = function () {
    var playerPosY = this.player.getPosition().y;
    var boxPosY = this.entity.getPosition().y;
    var distanceY = playerPosY - boxPosY;

    // Checking if player has reached the standing zone.
    if ((distanceY < this.collisionRange.x && distanceY >= this.collisionRange.y)) {
        this.successfulJump();
    }
    // Checking if player is below the platform. 
    else if (distanceY < this.collisionRange.y) {
        // console.log('distanceY: ', distanceY);
        this.death();
    }
    else {
        this.playerInfo.updateGroundPosition(this.entity.getPosition().y);
    }
};

Box.prototype.successfulJump = function () {
    // console.log("Success");
    this.playerInfo.updateGroundPosition(this.entity.getPosition().y);
    this.playerInfo.finishJump();
    this.isMoving = false;
};

Box.prototype.death = function () {
    this.playerInfo.dead(true);
   // this.isMoving = false;
    // console.log("Death");
    this.app.fire('Box:Stop');
    this.app.fire('Gameplay:OnPlayerHit', this.speed > 0 ? 1 : -1, this);
};

Box.prototype.update = function (dt) {
    if (!this.isMoving) return;
    this.movement(dt);

    if (!this.checkBounds()) return;
    this.checkHeight();

};

Box.prototype.stop = function () {
    if (!this.isMoving) return;
    this.isMoving = false;
    this.app.fire('Platform:AddKiller', this);
};

Box.prototype.playerLanded = function () {
    if (this.playerInfo != null && this.playerInfo.groundPosition == this.entity.getPosition().y) {
        this.isMoving = false;
    }
};




// PlayerController.js
var PlayerController = pc.createScript('playerController');

PlayerController.attributes.add('jumpDelay', { type: 'number', title: 'Jump Delay' });
PlayerController.attributes.add('landDelay', { type: 'number', title: 'Land Delay' });
PlayerController.attributes.add('movement', { type: 'entity', title: 'Movement' });
PlayerController.attributes.add('anim', { type: 'entity', title: 'Animator' });
PlayerController.attributes.add('mrBean', {
    type: 'json',
    title: 'Mr Bean',
    schema: [
        { name: 'old', type: 'entity', title: 'Old' },
        { name: 'new', type: 'entity', title: 'New' }
    ]
});

// initialize code called once per entity
PlayerController.prototype.initialize = function () {
    this.app.on('PlayerController:EnableOld', this.enableOld, this);
    this.app.on('PlayerController:Jump', this.jump, this);
    this.app.on('PlayerController:FinishJump', this.finishJump, this);
    this.app.on('PlayerController:Dead', this.dead, this);
    this.app.on('PlayerController:OnTap', this.onScreenTap.bind(this, true));
    this.app.on('PlayerController:OnTapReleased', this.onScreenTap.bind(this, false));

    this.entity.on('Start', this.start, this);
    this.entity.on('Revive', this.revive, this);
    this.entity.on('Reset', this.reset, this);

    this.isJumping = false;
    this.isStarted = false;
};

PlayerController.prototype.postInitialize = function () {
    this.finishJump();
};

// update code called every frame
PlayerController.prototype.update = function (dt) {
    if (!this.isStarted) return;

    if (this.app.keyboard.wasPressed(pc.KEY_SPACE)) {
        this.jump();
    }
};

PlayerController.prototype.enableOld = function() {
    if (!this.mrBean.new.enabled)
        this.mrBean.old.enabled = true;
};

PlayerController.prototype.onScreenTap = function (isPressed) {
    //  console.trace('PlayerController:OnScreenTap')
    if (this.isPressed === isPressed) return;
    this.isPressed = isPressed;
    if (isPressed)
        this.jump();

};

PlayerController.prototype.start = function (start) {
    this.isStarted = start;
    this.movement.fire('Start', start);
    this.isJumping = false;
}

PlayerController.prototype.revive = function () {
    this.anim.fire('Play', 'Idle');
    //  this.start(true);
    this.movement.fire('Revive');
};

PlayerController.prototype.reset = function () {
    this.anim.fire('Play', 'Idle');
    this.movement.fire('Reset');
};

PlayerController.prototype.jump = function (isforcedJump) {
    let isforced = isforcedJump != undefined ? isforcedJump : false;
    if ((!isforced && !this.isStarted) || this.isJumping) return;

    console.log('PlayerController:Jump', isforced);

    this.isJumping = true;
    CustomCoroutine.Instance.set(() => {
        this.movement.fire('Jump', isforcedJump);
        this.app.fire('Generate:Dust', 'Jump');
    }, this.jumpDelay);
    this.app.fire("SoundManager:Play", ['Jump1', 'Jump2', 'Jump3']);
    this.app.fire('SoundManager:Play', ['JumpTalk1', 'JumpTalk2', 'JumpTalk3', 'JumpTalk4']);
    this.anim.fire('Play', 'Jump');
};

PlayerController.prototype.finishJump = function (isForcedJump) {
    CustomCoroutine.Instance.set(() => {
        this.isJumping = false;
        if (this.isStarted || isForcedJump)
            this.anim.fire('Play', 'Idle');
    }, this.landDelay);
};

PlayerController.prototype.dead = function () {
    this.isJumping = false;
    this.anim.fire('Play', 'Death');
};

// swap method called for script hot-reloading
// inherit your script state here
// PlayerController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// PlayerAnim.js
var PlayerAnim = pc.createScript('playerAnim');

PlayerAnim.attributes.add('animator', { type: 'entity', title: 'Animator' });

PlayerAnim.attributes.add('animSettings', {
    title: 'Animations Settings',
    type: 'json',
    schema: [
        {
            name: 'type', type: 'number', title: 'Type',
            enum: [{ 'Fixed': 0 }, { 'Range': 1 }, { 'Array': 2 },], default: 0
        },
        { name: 'name', type: 'string', title: 'Name' },
        { name: 'loop', type: 'boolean', title: 'Loop' },
        { name: 'index', type: 'number', title: 'Index' },
        { name: 'indexRange', type: 'vec2', title: 'Index Range' },
        { name: 'indeces', type: 'number', title: 'Indeces', array: true },
    ],
    array: true,
});

PlayerAnim.attributes.add('anim', { 
    title: 'Animation Names',
    type: 'json', 
    schema: [
        { name: 'names', type: 'string', title: 'Animation Names', array: true }
    ],
});


// initialize code called once per entity
PlayerAnim.prototype.initialize = function() {

    for (let i = 0; i < this.animSettings.length; i++) {
        let j = i;        
        this.entity.on(this.animSettings[j].name, this.playAnim.bind(this, j));
    }
};   

// update code called every frame
PlayerAnim.prototype.update = function(dt) {

};

PlayerAnim.prototype.playAnim = function (i) {
    let index = this.getIndex(this.animSettings[i]);
    if (index === -1) return;
    let loop = this.animSettings[i].loop;
    
    // console.warn('playAnim: ', index, this.anim.names[index])
    this.animator.fire('PlayAnim:ByName', this.anim.names[index], loop, 0);
};

PlayerAnim.prototype.getIndex = function(settings) {
    if (settings.type === 0)
        return settings.index;
    
    if (settings.type === 1) {
        let min = settings.indexRange.x;
        let max = settings.indexRange.y;
        let random = (Math.round(pc.math.random(0, 100)) % (max - min)) + min;
        // console.log("Faiq: ", random)
        console.warn('playAnim: ',min, max, random, this.anim.names[random])
        // this.anim.names[index]
        return random;
    }
    
    if (settings.type === 3) {
        let length = settings.indeces.length;
        let rIndex = Math.round(pc.math.random(0, length));

        return settings.indeces[rIndex];
    }

    return -1;
};

// swap method called for script hot-reloading
// inherit your script state here
// PlayerAnim.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// scaleWithScreen.js
var ScaleWithScreen = pc.createScript('scaleWithScreen');

ScaleWithScreen.attributes.add('ratio', { type: 'entity' });

// initialize code called once per entity
ScaleWithScreen.prototype.initialize = function() {
    console.log(this.app._width);
};

// update code called every frame
ScaleWithScreen.prototype.update = function(dt) {
    console.log(window.innerWidth,window.outerWidth);

};

// swap method called for script hot-reloading
// inherit your script state here
// ScaleWithScreen.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// Gameplay.js
var Gameplay = pc.createScript('gameplay');

Gameplay.attributes.add('missions', {
    title: 'Mission References',
    type: 'json',
    schema: [
        { name: 'manager', type: 'entity', title: 'Manager' },
        { name: 'current', type: 'entity', title: 'Current' },
        { name: 'newMission', type: 'entity', title: 'New' }
    ]
});

Gameplay.attributes.add('refs', {
    title: 'References',
    type: 'json',
    schema: [
        { name: 'player', type: 'entity', title: 'Player' },
        { name: 'platformGenerator', type: 'entity', title: 'Platform Generator' },
        { name: 'bSL', type: 'entity', title: 'Best Score Line' },
        { name: 'bSLDest', type: 'entity', title: 'bSL Destination' },
        { name: 'incrementText', type: 'entity', title: 'Increment Text' },
    ],
});

Gameplay.attributes.add('parallax', {
    title: 'Parallax Settings',
    type: 'json',
    schema: [
        { name: 'initialY', type: 'number', title: 'Initial Y' },
        { name: 'increment', type: 'number', title: 'Increment' },
        { name: 'obj', type: 'entity', title: 'Entity' },
        { name: 'dest', type: 'entity', title: 'Destination' },
        { name: 'verticalInfinite', type: 'boolean' },
        { name: 'count', type: 'number' },
        { name: 'maxCount', type: 'number' },
        { name: 'textureSize', type: 'number' }
    ],
    array: true
});

// initialize code called once per entity
Gameplay.prototype.initialize = function () {
    this.app.on('Gameplay:Start', this.start, this);
    this.app.on('Gameplay:OnPlayerHit', this.onPlayerHit, this);
    this.app.on('Gameplay:Revive', this.revive, this);
    this.app.on('Gameplay:Reset', this.reset, this);
    this.app.on('Gameplay:OnPlayerJump', this.onPlayerJump, this);
    this.app.on('Gameplay:FixedToCamera', this.fixParallaxEffect, this);
    this.app.on('Gameplay:UnFixCamera', this.unParallaxEffect, this);
    this.timer = 1;
    this.bestScoreCheck = false;
    this.boxCount = 0;
    this.perfectCount = 0;
    this.bsLCurrPos = 0;
};



// update code called every frame
Gameplay.prototype.update = function (dt) {
    this.updateTimerTick(dt);
};


Gameplay.prototype.start = function () {
    this.app.fire('Tutorial:Start');
    this.gamePlayCount();
    this.timer = 1;
    this.setIsStarted(true);

    CustomCoroutine.Instance.set(() => {
        this.app.fire('MissionManager:InitMission');
        this.app.fire('SdkManager:SetChallenge');
    }, 1);

    this.setBestLine(0);
    this.bestScoreCheck = false;

    this.app.fire('Theme:CheckFixed', this.moveCamera.bind(this));

    this.app.fire("SoundManager:Stop", "TitleScreen");
    
    this.app.fire("CountDown:Start", () => {
        if (!MenuManager.Instance.isState(2)) return;
        this.app.fire("SoundManager:Play", "GamePlay")
        this.refs.platformGenerator.fire('Start', true);
        this.refs.player.fire('Start', true);
    });
};

Gameplay.prototype.moveCamera = function () {
    this.updateParallax();
    this.app.fire('Move:CameraZoom', 2, true, () => {
        this.app.fire('Move:CameraUp', pc.platform.desktop ? -1 : -4, this.unFixParallaxEffect.bind(this));
    });

};

Gameplay.prototype.fixParallaxEffect = function (onComplete) {
    console.log('Fixing Parallax');
    for (let i = 0; i < this.parallax.length; i++) {
        if (this.parallax[i].obj.tags.has('FixedWhenCameraMove')) {
            this.parallax[i].increment = pc.platform.desktop ? -3 : -6;
        }
    }
    if (onComplete) onComplete();

};

Gameplay.prototype.unFixParallaxEffect = function () {
    for (let i = 0; i < this.parallax.length; i++) {
        if (this.parallax[i].obj.tags.has('FixedWhenCameraMove')) {
            this.parallax[i].increment = 0;
        }
    }

};

Gameplay.prototype.gamePlayCount = function () {
    DataManager.Instance.gameCount += 1;
};

Gameplay.prototype.onPlayerHit = function (dir, box) {
    this.setIsStarted(false);
    this.perfectCount = 0;
    // this.killerBox = box;
    this.refs.player.setLocalScale(dir, 1, 1);
    this.refs.bSL.enabled = false;
    this.refs.platformGenerator.fire('Start', false);
    this.refs.player.fire('Start', false);
    this.app.fire('Tutorial:Finish', 3);
    this.app.fire('PerfectJumpEffect:ClearList');
    this.app.fire('Move:CameraZoom', this.boxCount, true, () => {
        CustomCoroutine.Instance.set(() => this.app.fire('GameplayMenu:OnGameOver'), 1);
    });

    this.app.fire("SoundManager:Stop", "GamePlay");
    this.app.fire('SoundManager:Play', ['GameOverOhno', 'GameOverRubbish', 'GameOverRidiculous']);
    this.app.fire('MissionManager:StartMission', false);

};


Gameplay.prototype.revive = function () {
    if (!MenuManager.Instance.isState(2)) return;

    this.perfectCount = 0;
    this.setIsStarted(true);
    this.refs.player.setLocalScale(1, 1, 1);
    this.setBestLine(0);
    this.bestScoreCheck = false;
    // this.app.fire('BoxPool:Restore', this.killerBox.entity);
    this.app.fire('Move:CameraZoom', this.boxCount, false);
    this.refs.player.fire('Revive');
    this.refs.platformGenerator.fire('RemoveKillers');

    this.app.fire("SoundManager:Play", "GamePlay", 0, false);
    let posY = this.refs.player.getPosition().y;
    this.app.fire("CountDown:Start", () => {
        this.refs.player.fire('Start', true);
        this.refs.platformGenerator.fire('Revive', posY);
        this.app.fire('MissionManager:StartMission', true);
    });
};

Gameplay.prototype.reset = function (start) {
    this.timer = 1;
    this.boxCount = 0;
    this.perfectCount = 0;
    this.refs.player.setLocalScale(1, 1, 1);
    this.setIsStarted(start === undefined || start);

    if (this.killerBox) this.app.fire('BoxPool:Restore', this.killerBox.entity);

    this.refs.player.fire('Reset');
    this.refs.platformGenerator.fire('Reset');
    this.app.fire('LoopBuilding:Reset');

    this.updateParallax(true);
};

Gameplay.prototype.setIsStarted = function(start) {
    console.warn('Gameplay:setIsStarted: ', start);
    this.isStarted = start;
};

Gameplay.prototype.updateTimerTick = function (dt) {
    if (!this.isStarted) return;

    this.timer -= dt;
    if (this.timer <= 0) {
        console.log('Gameplay:updateTimerTick');
        this.app.fire('MissionManager:TimerTick');
        this.timer = 1;
    }
};

Gameplay.prototype.onPlayerJump = function (isPerfect, pos, boxHeight) {
    this.boxCount++;
    this.app.fire('Tutorial:Finish', this.boxCount);
    let increment = ScoreManager.Instance.playerJumped(isPerfect && this.perfectCount + 1 > 1);
    this.setBestLine(increment);
    this.refs.incrementText.enabled = true;
    this.app.fire("ScoreIncrement:Display", increment, this.refs.player, () => this.refs.incrementText.enabled = false);
    if (isPerfect) {
        this.perfectCount++;
        if (this.perfectCount > 1) {
            this.app.fire('SoundManager:Play', 'PerfectJump');
            this.app.fire('MissionManager:PerfectJump', increment);
            this.app.fire('PerfectJumpEffect:Play', increment, pos);
        }
        else
            this.app.fire('MissionManager:SuccessJump');
    }
    else {
        this.perfectCount = 0;
        this.app.fire('PerfectJumpEffect:ClearList');
        this.app.fire('MissionManager:SuccessJump');
    }

    this.updateParallax();
    this.app.fire('FriendChallenge:UpdateProgress', ScoreManager.Instance.currentScore);
    this.app.fire('Move:CameraUp', boxHeight);
    this.app.fire('LoopBuilding:CheckHeight');
    this.app.fire('Generate:Dust', 'Fall');
};

Gameplay.prototype.setBestLine = function (increment) {
    let bestScore = ScoreManager.Instance.bestScore;
    if (bestScore <= 0) return;
    let newPos = this.refs.bSL.getLocalPosition();
    if (increment == 0) {
        this.bsLCurrPos = bestScore * 2;
        this.refs.bSL.setLocalPosition(newPos.x, this.bsLCurrPos, newPos.z);
        this.refs.bSLDest.setLocalPosition(newPos.x, this.bsLCurrPos, newPos.z);
        this.updateBestLine();
        return;
    }
    this.bsLCurrPos = this.bsLCurrPos - (2 * (increment - 1));
    this.refs.bSLDest.setLocalPosition(newPos.x, this.bsLCurrPos, newPos.z);
    this.refs.bSL.fire('Move', this.updateBestLine());
};

Gameplay.prototype.updateBestLine = function () {
    let bestScore = ScoreManager.Instance.bestScore;
    let currentScore = ScoreManager.Instance.currentScore;

    if (bestScore <= currentScore) {
        if (this.bestScoreCheck) return;
        this.bestScoreCheck = true;
        this.app.fire("ScoreLineEffect", () => this.refs.bSL.enabled = false);
    }
    else {
        this.refs.bSL.enabled = true
        this.app.fire("ResetScoreLine");
    }
};

Gameplay.prototype.updateParallax = function (reset) {

    for (let i = 0; i < this.parallax.length; i++) {
        let destPos = this.parallax[i].dest.getLocalPosition();

        if (this.parallax[i].verticalInfinite) {
            this.parallax[i].count++;
            if (this.parallax[i].count == this.parallax[i].maxCount) {
                destPos.y += this.parallax[i].textureSize;
                this.parallax[i].count = 0;

                this.parallax[i].dest.setLocalPosition(destPos.x, destPos.y, destPos.z);
                this.parallax[i].obj.setLocalPosition(destPos.x, destPos.y, destPos.z);
            }
        }

        if (reset) {
            this.parallax[i].count = 0;
            destPos.y = this.parallax[i].initialY;
            this.parallax[i].obj.fire('Set', 0, 'duration', 0);
        }
        else {
            destPos.y += this.parallax[i].increment;
            this.parallax[i].obj.fire('Set', 0, 'duration', 0.5);
        }

        this.parallax[i].dest.setLocalPosition(destPos.x, destPos.y, destPos.z);
        this.parallax[i].obj.fire('Move');

    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Gameplay.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// CountDown.js
var CountDown = pc.createScript('CountDown');

CountDown.attributes.add('startingDur', { type: 'number', title: 'Starting Duration' });
CountDown.attributes.add('startingTxt', { type: 'entity', title: 'Starting Counter' });
CountDown.attributes.add('timer', { type: 'entity' });

// initialize code called once per entity
CountDown.prototype.initialize = function () {
    this.on('enable', this.onEnable, this);
    this.timerRoutines = [];
    // this.app.on("Count:Start",this.startTimer,this);
    this.app.on("CountDown:Start", this.startTimer, this);
};

CountDown.prototype.postInitialize = function () {
    //  this.onEnable();
};

CountDown.prototype.onEnable = function () {
    this.startTimer();
};

// update code called every frame
CountDown.prototype.update = function (dt) {

};

CountDown.prototype.startTimer = function (onComplete) {
    this.timer.enabled = true;
    let dur = this.startingDur;
    // console.log("Starting Dur: ", this.startingDur);
    for (let i = dur; i >= 0; i--) {
        let j = i;
        CustomCoroutine.Instance.set(function (index) {
            this.startingTxt.element.text = index.toString();
            if (index === 0) {
                this.timer.enabled = false;
                if (onComplete) onComplete();
            }
        }.bind(this, j), dur - i);
    }
};
// swap method called for script hot-reloading
// inherit your script state here
// CountDown.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// rotationAnimator.js
var RotationAnimator = pc.createScript('rotationAnimator');

RotationAnimator.attributes.add('event', {
    title: 'Event Settings',
    type: 'json',
    schema: [
        {
            name: 'scope', title: 'Scope', type: 'number', enum:
                [{ 'Enable/Disable': 0 }, { 'App': 1 }, { 'Entity': 2 }]
        },
        { name: 'play', title: 'Play', type: 'string', default: 'RotationAnimator:Play' },
        { name: 'reverse', title: 'Reverse', type: 'string', default: 'RotationAnimator:Reverse' },
        { name: 'stop', title: 'Stop', type: 'string', default: 'RotationAnimator:Stop' },
          { name: 'setVal', title: 'Set Variable', type: 'string', default: 'RotationAnimator:Set', description: 'Fire this event to set values. Send index, name of variable and value as params respectivily' },
    ]
});

RotationAnimator.attributes.add('anims', {
    title: 'Animations',
    type: 'json',
    schema: [
        {
            name: 'type', title: 'Type', type: 'string', enum: [
                { "Linear": "Linear" }, { "Quadratic": "Quadratic" }, { "Cubic": "Cubic" }, 
                { "Quartic": "Quartic" }, { "Quintic": "Quintic" }, { "Sine": "Sine" }, 
                { "Exponential": "Exponential" }, { "Circular": "Circular" }, { "Back": "Back" }, 
                { "Bounce": "Bounce" }, { "Elastic": "Elastic" }
            ], default: "Linear"
        },
        {
            name: 'ease', type: 'string', title: 'Ease',
            enum: [{ 'In': 'In' }, { 'Out': 'Out' }, { 'InOut': 'InOut' } ], default: 'In',
            description: 'Ease will be automatically ignore incase of Linear type',
        },
        { name: 'loop', title: 'Loop', type: 'boolean' },
        { name: 'yoyo', title: 'Yoyo', type: 'boolean', description: 'If not looped, repeat must be greater than 1 inorder to make yoyo work' },
        { name: 'repeat', title: 'Repeat', type: 'number', default: 1 },
        { name: 'duration', title: 'Duration', type: 'number', default: 0.5 },
        { name: 'delay', title: 'Delay', type: 'number', default: 0 },
        { name: 'from', title: 'From', type: 'vec3', default: [0, 0, 0], description: 'If \'From Entity\' is not assigned these Euler Angles will be used' },
        { name: 'to', title: 'To', type: 'vec3', default: [90, 90, 90], description: 'If \'To Entity\' is not assigned these Euler Angles will be used' },
        { name: 'fromObj', title: 'From Entity', type: 'entity' },
        { name: 'toObj', title: 'To Entity', type: 'entity' },
        { name: 'obj', title: 'Entity', type: 'entity', description: 'Entity on which this animation will be applied' },
    ],
    array: true
});

// ************************
// * Playcanvas Callbacks *
// ************************

// initialize code called once per entity
RotationAnimator.prototype.initialize = function () {

    this.on('enable', this.onEnable, this);
    this.on('disable', this.onDisable, this);

    this.coroutines = [];
    this.tweens = [];
    this.duration = 0;
    this.rotCache = [];
};

RotationAnimator.prototype.postInitialize = function () {
    this.onEnable();
};

RotationAnimator.prototype.onEnable = function () {
    if (this.event.scope === 0)
        this.play();

    this.registerEvents('on');
};

RotationAnimator.prototype.onDisable = function() {
    this.registerEvents('off');
};

RotationAnimator.prototype.registerEvents = function (action) {
    let scope = this.event.scope === 1 ? this.app : this.entity;

    if (this.event.scope === 0) {
        this[action]('enable', this.play, this);
        this.entity[action]('disable', this.reverse, this);
    }
    else {
        scope[action](this.event.play, this.play, this);
        scope[action](this.event.reverse, this.reverse, this);
    }

    scope[action](this.event.stop, this.stop, this);
    scope[action](this.event.setVal, this.setVal, this);
};

// *************
// * Functions *
// *************

RotationAnimator.prototype.play = function (onComplete) {
    this.animate(true);
    CustomCoroutine.Instance.set(() => {
        if (onComplete && typeof onComplete === 'function') onComplete()
    }, this.duration);
};

RotationAnimator.prototype.reverse = function (onComplete) {
    this.animate(false);
    CustomCoroutine.Instance.set(() => {
        if (onComplete && typeof onComplete === 'function') onComplete()
    }, this.duration);
};

RotationAnimator.prototype.stop = function () {
    for (let i = 0; i < this.tweens.length; i++) {
        if (this.tweens[i]) TweenWrapper.StopTween(this.tweens[i]);
    };

    for (let i = 0; i < this.coroutines.length; i++) {
        if (this.coroutines[i]) CustomCoroutine.Instance.clear(this.coroutines[i]);
    };

    this.coroutines = [];
    this.tweens = [];
};

RotationAnimator.prototype.animate = function (enable) {

    this.stop();

    for (let i = 0; i < this.anims.length; i++) {
        let anim = this.anims[i];
        this.updateRotCache(i);

        let fromEntityRot = anim.fromObj ? anim.fromObj.getLocalPosition() : undefined;
        let toEntityRot = anim.toObj ? anim.toObj.getLocalPosition() : undefined;

        let from = enable ? fromEntityRot || anim.from : toEntityRot || anim.to;
        let to = enable ? toEntityRot || anim.to : fromEntityRot || anim.from;

        anim.obj.setLocalEulerAngles(from.x, from.y, from.z);
        this.rotCache[i].set(to.x, to.y, to.z);

        let coroutine = CustomCoroutine.Instance.set(() => {
            let tween = TweenWrapper.TweenRotation(
                anim.obj, anim.obj.getLocalEulerAngles(), this.rotCache[i], anim.duration,
                undefined, pc[this.getType(anim.type, anim.ease)], anim.loop, anim.yoyo, anim.repeat
            );
            this.tweens.push(tween);
        }, anim.delay);
        this.coroutines.push(coroutine);

        this.updateLargestDuration(anim.duration + anim.delay);
    }
};

RotationAnimator.prototype.getType = function (type, ease) {
    // console.log("getType: ", type, typeof type, ease, typeof ease);
    if (type == "Linear")
        return type;
    return type + ease;
};

RotationAnimator.prototype.updateRotCache = function (index) {
    if (index >= this.rotCache.length)
        this.rotCache.push(new pc.Vec3());
};

RotationAnimator.prototype.updateLargestDuration = function (duration) {
    if (this.duration < duration)
        this.duration = duration;
};
RotationAnimator.prototype.setVal = function (index, name, val) {
    // console.log('setVal: ', index, name, val, typeof val, this.anims[index][name]);
    let type = typeof this.anims[index][name];
    if (type !== typeof val) {
        console.error('Type of variable and value sent not matched!!!');
        return;
    }

    // if (typeof val === "Vec3") {
    //     this.anims[index][name].x = val.x;
    //     this.anims[index][name].y = val.y;
    //     this.anims[index][name].z = val.z;
    // }
    // else
    this.anims[index][name] = val;

};
// swap method called for script hot-reloading
// inherit your script state here
// RotationAnimator.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// positionAnimator.js
var PositionAnimator = pc.createScript('positionAnimator');

PositionAnimator.attributes.add('event', {
    title: 'Event Settings',
    type: 'json',
    schema: [
        {
            name: 'scope', title: 'Scope', type: 'number', enum:
                [{ 'Enable/Disable': 0 }, { 'App': 1 }, { 'Entity': 2 }]
        },
        { name: 'play', title: 'Play', type: 'string', default: 'PositionAnimator:Play' },
        { name: 'reverse', title: 'Reverse', type: 'string', default: 'PositionAnimator:Reverse' },
        { name: 'stop', title: 'Stop', type: 'string', default: 'PositionAnimator:Stop' },
        { name: 'setVal', title: 'Set Variable', type: 'string', default: 'PositionAnimator:Set', description: 'Fire this event to set values. Send index, name of variable and value as params respectivily' },
    ]
});

PositionAnimator.attributes.add('anims', {
    title: 'Animations',
    type: 'json',
    schema: [
        {
            name: 'type', title: 'Type', type: 'string', enum: [
                { "Linear": "Linear" }, { "Quadratic": "Quadratic" }, { "Cubic": "Cubic" },
                { "Quartic": "Quartic" }, { "Quintic": "Quintic" }, { "Sine": "Sine" },
                { "Exponential": "Exponential" }, { "Circular": "Circular" }, { "Back": "Back" },
                { "Bounce": "Bounce" }, { "Elastic": "Elastic" }
            ], default: "Linear"
        },
        {
            name: 'ease', type: 'string', title: 'Ease',
            enum: [{ 'In': 'In' }, { 'Out': 'Out' }, { 'InOut': 'InOut' }], default: 'In',
            description: 'Ease will be automatically ignore incase of Linear type',
        },
        { name: 'loop', title: 'Loop', type: 'boolean' },
        { name: 'yoyo', title: 'Yoyo', type: 'boolean', description: 'If not looped, repeat must be greater than 1 inorder to make yoyo work' },
        { name: 'repeat', title: 'Repeat', type: 'number', default: 1 },
        { name: 'duration', title: 'Duration', type: 'number', default: 0.5 },
        { name: 'delay', title: 'Delay', type: 'number', default: 0 },
        { name: 'from', title: 'From', type: 'vec3', default: [0, 0, 0], description: 'If \'From Entity\' is not assigned this Position will be used' },
        { name: 'to', title: 'To', type: 'vec3', default: [1, 1, 1], description: 'If \'To Entity\' is not assigned this Position will be used' },
        { name: 'fromObj', title: 'From Entity', type: 'entity' },
        { name: 'toObj', title: 'To Entity', type: 'entity' },
        { name: 'obj', title: 'Entity', type: 'entity', description: 'Entity on which this animation will be applied' },
    ],
    array: true
});

// ************************
// * Playcanvas Callbacks *
// ************************

// initialize code called once per entity
PositionAnimator.prototype.initialize = function () {

    this.on('enable', this.onEnable, this);
    this.on('disable', this.onDisable, this);
    this.on('destroy', this.onDisable, this);

    this.coroutines = [];
    this.tweens = [];
    this.duration = 0;
    this.posCache = [];
};

PositionAnimator.prototype.postInitialize = function () {
    this.onEnable();
};

PositionAnimator.prototype.onEnable = function () {
    this.registerEvents('on');

    if (this.event.scope === 0)
        this.play();
};

PositionAnimator.prototype.onDisable = function () {
    this.registerEvents('off');
};

PositionAnimator.prototype.registerEvents = function (action) {
    let scope = this.event.scope === 1 ? this.app : this.entity;

    if (this.event.scope === 0) {
        // this[action]('enable', this.play, this);
        this.entity[action]('disable', this.reverse, this);
    }
    else {
        scope[action](this.event.play, this.play, this);
        scope[action](this.event.reverse, this.reverse, this);
    }

    scope[action](this.event.stop, this.stop, this);
    scope[action](this.event.setVal, this.setVal, this);
};

// *************
// * Functions *
// *************

PositionAnimator.prototype.play = function (onComplete) {
    // console.log("po")
    this.animate(true);
   if (onComplete && typeof onComplete === 'function')
        this.playRoutine = CustomCoroutine.Instance.set(() => onComplete(), this.duration);
};

PositionAnimator.prototype.reverse = function (onComplete) {
    this.animate(false);
    if (onComplete && typeof onComplete === 'function')
        this.reverseRoutine = CustomCoroutine.Instance.set(() => onComplete(), this.duration);
};

PositionAnimator.prototype.stop = function () {
    if (this.reverseRoutine)
        CustomCoroutine.Instance.clear(this.reverseRoutine);

    if (this.playRoutine)
        CustomCoroutine.Instance.clear(this.playRoutine);

    for (let i = 0; i < this.tweens.length; i++) {
        if (this.tweens[i]) TweenWrapper.StopTween(this.tweens[i]);
    };

    for (let i = 0; i < this.coroutines.length; i++) {
        if (this.coroutines[i]) CustomCoroutine.Instance.clear(this.coroutines[i]);
    };

    this.coroutines = [];
    this.tweens = [];
};

PositionAnimator.prototype.animate = function (enable) {

    this.stop();

    for (let i = 0; i < this.anims.length; i++) {
        this.updatePosCache(i);
        let anim = this.anims[i];

        let fromEntityPos = anim.fromObj ? anim.fromObj.getLocalPosition() : undefined;
        let toEntityPos = anim.toObj ? anim.toObj.getLocalPosition() : undefined;

        let from = enable ? fromEntityPos || anim.from : toEntityPos || anim.to;
        let to = enable ? toEntityPos || anim.to : fromEntityPos || anim.from;

        anim.obj.setLocalPosition(from.x, from.y, from.z);
        this.posCache[i].set(to.x, to.y, to.z);

        let easeType = this.getType(anim.type, anim.ease);
        let tween = TweenWrapper.Tween(
            anim.obj, anim.obj.getLocalPosition(), this.posCache[i], anim.duration,
            undefined, pc[easeType], anim.loop, anim.yoyo, anim.repeat, anim.delay
        );
        this.tweens.push(tween);

        this.updateLargestDuration(anim.duration + anim.delay);
    }
};

PositionAnimator.prototype.getType = function (type, ease) {
    // console.log("getType: ", type, typeof type, ease, typeof ease);
    if (type == "Linear")
        return type;
    return type + ease;
};

PositionAnimator.prototype.updatePosCache = function (index) {
    if (index >= this.posCache.length)
        this.posCache.push(new pc.Vec3());
};

PositionAnimator.prototype.updateLargestDuration = function (duration) {
    if (this.duration < duration)
        this.duration = duration;
};

PositionAnimator.prototype.setVal = function (index, name, val) {
    // console.log('setVal: ', index, name, val, typeof val, this.anims[index][name]);
    let type = typeof this.anims[index][name];
    if (type !== typeof val) {
        console.error('Type of variable and value sent not matched!!!');
        return;
    }

    if (typeof val === "Vec3") {
        this.anims[index][name].x = val.x;
        this.anims[index][name].y = val.y;
        this.anims[index][name].z = val.z;
    }
    else
    this.anims[index][name] = val;
};

// swap method called for script hot-reloading
// inherit your script state here
// PositionAnimator.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// opacityAnimator.js
var OpacityAnimator = pc.createScript('opacityAnimator');

OpacityAnimator.attributes.add('event', {
    title: 'Event Settings',
    type: 'json',
    schema: [
        {
            name: 'scope', title: 'Scope', type: 'number', enum:
                [{ 'Enable/Disable': 0 }, { 'App': 1 }, { 'Entity': 2 }]
        },
        { name: 'play', title: 'Play', type: 'string', default: 'OpacityAnimator:Play' },
        { name: 'reverse', title: 'Reverse', type: 'string', default: 'OpacityAnimator:Reverse' },
        { name: 'stop', title: 'Stop', type: 'string', default: 'OpacityAnimator:Stop' },
        { name: 'setVal', title: 'Set Variable', type: 'string', default: 'OpacityAnimator:Set', description: 'Fire this event to set values. Send index, name of variable and value as params respectivily' },
    ]
});

OpacityAnimator.attributes.add('anims', {
    title: 'Animations',
    type: 'json',
    schema: [
        {
            name: 'type', title: 'Type', type: 'string', enum: [
                { "Linear": "Linear" }, { "Quadratic": "Quadratic" }, { "Cubic": "Cubic" },
                { "Quartic": "Quartic" }, { "Quintic": "Quintic" }, { "Sine": "Sine" },
                { "Exponential": "Exponential" }, { "Circular": "Circular" }, { "Back": "Back" },
                { "Bounce": "Bounce" }, { "Elastic": "Elastic" }
            ], default: "Linear"
        },
        {
            name: 'ease', type: 'string', title: 'Ease',
            enum: [{ 'In': 'In' }, { 'Out': 'Out' }, { 'InOut': 'InOut' }], default: 'In',
            description: 'Ease will be automatically ignore incase of Linear type',
        },
        { name: 'includeChildren', title: 'Apply on Children', type: 'boolean', default: false },
        { name: 'loop', title: 'Loop', type: 'boolean' },
        { name: 'yoyo', title: 'Yoyo', type: 'boolean', description: 'If not looped, repeat must be greater than 1 inorder to make yoyo work' },
        { name: 'repeat', title: 'Repeat', type: 'number', default: 1 },
        { name: 'excludedTag', title: 'Excluded Tag', type: 'string', default: "ExcludeOpacityAnim", description: 'Add this tag to children for them to be excluded from opacity animation if \'Apply on Children\' bool is true' },
        { name: 'from', title: 'From', min: 0, max: 1, type: 'number', default: 0 },
        { name: 'to', title: 'To', min: 0, max: 1, type: 'number', default: 1 },
        { name: 'duration', title: 'Duration', type: 'number', default: 0.5 },
        { name: 'delay', title: 'Delay', type: 'number', default: 0 },
        { name: 'obj', title: 'Entity', type: 'entity', description: 'Entity on which this animation will be applied' },
    ],
    array: true
});

// ************************
// * Playcanvas Callbacks *
// ************************

// initialize code called once per entity
OpacityAnimator.prototype.initialize = function () {

    this.on('enable', this.onEnable, this);
    this.on('disable', this.onDisable, this);

    this.coroutines = [];
    this.tweens = [];
    this.duration = 0;
};

OpacityAnimator.prototype.postInitialize = function () {
    this.onEnable();
};

OpacityAnimator.prototype.onEnable = function () {
    if (this.event.scope === 0)
        this.play();
    this.registerEvents('on');
};

OpacityAnimator.prototype.onDisable = function () {
    this.registerEvents('off');
};

OpacityAnimator.prototype.registerEvents = function (action) {
    let scope = this.event.scope === 1 ? this.app : this.entity;

    if (this.event.scope === 0) {
        this[action]('enable', this.play, this);
        this.entity[action]('disable', this.reverse, this);
    }
    else {
        scope[action](this.event.play, this.play, this);
        scope[action](this.event.reverse, this.reverse, this);
    }

    scope[action](this.event.stop, this.stop, this);
    scope[action](this.event.setVal, this.setVal, this);
};

// *************
// * Functions *
// *************

OpacityAnimator.prototype.play = function (onComplete) {
    // console.log(this.entity.name, ': play');
    this.animate(true);
    CustomCoroutine.Instance.set(() => {
        if (onComplete && typeof onComplete === 'function') onComplete()
    }, this.duration);
};

OpacityAnimator.prototype.reverse = function (onComplete) {
    // console.log(this.entity.name, ': reverse');
    this.animate(false);
    CustomCoroutine.Instance.set(() => {
        if (onComplete && typeof onComplete === 'function') onComplete()
    }, this.duration);
};

OpacityAnimator.prototype.stop = function () {
    for (let i = 0; i < this.tweens.length; i++) {
        if (this.tweens[i]) TweenWrapper.StopTween(this.tweens[i]);
    };

    for (let i = 0; i < this.coroutines.length; i++) {
        if (this.coroutines[i]) CustomCoroutine.Instance.clear(this.coroutines[i]);
    };

    this.coroutines = [];
    this.tweens = [];
};

OpacityAnimator.prototype.animate = function (enable) {

    this.stop();

    for (let i = 0; i < this.anims.length; i++) {
        let anim = this.anims[i];

        let from = enable ? anim.from : anim.to;
        let to = enable ? anim.to : anim.from;

        let coroutine = CustomCoroutine.Instance.set(() => {
            if (anim.includeChildren)
                this.applyOpacityOnChildren(enable, anim, from, to);
            else if (anim.obj.element) {
                let tween = TweenWrapper.TweenOpacity(
                    anim.obj.element, from, to, anim.duration, undefined,
                    pc[this.getType(anim.type, anim.ease)], anim.loop, anim.yoyo, anim.repeat
                );
                this.tweens.push(tween);
            }

        }, anim.delay);

        this.coroutines.push(coroutine);
        this.updateLargestDuration(anim.duration + anim.delay);
    }
};

OpacityAnimator.prototype.applyOpacityOnChildren = function (enable, anim, from, to) {
    let root = anim.obj;
    let toFade = [];

    toFade.push(root);

    let varNames = ['duration', 'type', 'ease', 'loop', 'yoyo', 'repeat'];
    let vars = {};

    while (toFade.length > 0) {
        let temp = toFade.pop();

        for (let i = 0; i < temp.children.length; i++) {
            if (temp.children[i])
                toFade.push(temp.children[i]);
        }

        if (temp && temp.element && !temp.tags.has(anim.excludedTag)) {

            for (let i = 0; i < varNames.length; i++) {
                vars[varNames[i]] = anim[varNames[i]];
            }

            if (temp.script && temp.script.opacityAnimatorChild && temp.script.opacityAnimatorChild.enabled) {
                // // console.log('Overide');
                let childAnim = temp.script.opacityAnimatorChild;

                for (let i = 0; i < varNames.length; i++) {
                    if (childAnim.overide[varNames[i]])
                        vars[varNames[i]] = childAnim.overideAnim[varNames[i]];
                }
                if (childAnim.overide.from) vars.from = enable ? childAnim.overideAnim.from : childAnim.overideAnim.to;
                if (childAnim.overide.to) vars.to = enable ? childAnim.overideAnim.to : childAnim.overideAnim.from;
            }
            else {
                vars.from = from;
                vars.to = to;
            }

            let tween = TweenWrapper.TweenOpacity(
                temp.element, vars.from, vars.to, vars.duration, undefined,
                pc[this.getType(vars.type, vars.ease)], vars.loop, vars.yoyo, vars.repeat
            );
            this.tweens.push(tween);
        }
    }
};

OpacityAnimator.prototype.getType = function (type, ease) {
    // // console.log("getType: ", type, typeof type, ease, typeof ease);
    if (type == "Linear")
        return type;
    return type + ease;
};

OpacityAnimator.prototype.updateLargestDuration = function (duration) {
    if (this.duration < duration)
        this.duration = duration;
};

OpacityAnimator.prototype.setVal = function (index, name, val) {
    // // console.log('setVal: ', index, name, val, typeof val, this.anims[index][name]);
    let type = typeof this.anims[index][name];

    if (type !== typeof val) {
        console.error('Type of variable and value sent not matched!!!');
        return;
    }

    // if (typeof val === "Vec3") {
    //     this.anims[index][name].x = val.x;
    //     this.anims[index][name].y = val.y;
    //     this.anims[index][name].z = val.z;
    // }
    // else
    this.anims[index][name] = val;

};

// scaleAnimator.js
var ScaleAnimator = pc.createScript('scaleAnimator');

ScaleAnimator.attributes.add('event', {
    title: 'Event Settings',
    type: 'json',
    schema: [
        {
            name: 'scope', title: 'Scope', type: 'number', enum:
                [{ 'Enable/Disable': 0 }, { 'App': 1 }, { 'Entity': 2 }]
        },
        { name: 'play', title: 'Play', type: 'string', default: 'ScaleAnimator:Play' },
        { name: 'reverse', title: 'Reverse', type: 'string', default: 'ScaleAnimator:Reverse' },
        { name: 'stop', title: 'Stop', type: 'string', default: 'ScaleAnimator:Stop' },
        { name: 'setVal', title: 'Set Variable', type: 'string', default: 'ScaleAnimator:Set', description: 'Fire this event to set values. Send index, name of variable and value as params respectivily' },
    ]
});

ScaleAnimator.attributes.add('anims', {
    title: 'Animations',
    type: 'json',
    schema: [
        {
            name: 'type', title: 'Type', type: 'string', enum: [
                { "Linear": "Linear" }, { "Quadratic": "Quadratic" }, { "Cubic": "Cubic" },
                { "Quartic": "Quartic" }, { "Quintic": "Quintic" }, { "Sine": "Sine" },
                { "Exponential": "Exponential" }, { "Circular": "Circular" }, { "Back": "Back" },
                { "Bounce": "Bounce" }, { "Elastic": "Elastic" }
            ], default: "Linear"
        },
        {
            name: 'ease', type: 'string', title: 'Ease',
            enum: [{ 'In': 'In' }, { 'Out': 'Out' }, { 'InOut': 'InOut' }], default: 'In',
            description: 'Ease will be automatically ignore incase of Linear type',
        },
        { name: 'loop', title: 'Loop', type: 'boolean' },
        { name: 'yoyo', title: 'Yoyo', type: 'boolean', description: 'If not looped, repeat must be greater than 1 inorder to make yoyo work' },
        { name: 'repeat', title: 'Repeat', type: 'number', default: 1 },
        { name: 'duration', title: 'Duration', type: 'number', default: 0.5 },
        { name: 'delay', title: 'Delay', type: 'number', default: 0 },
        { name: 'from', title: 'From', type: 'vec3', default: [0, 0, 0] },
        { name: 'to', title: 'To', type: 'vec3', default: [1, 1, 1] },
        { name: 'obj', title: 'Entity', type: 'entity', description: 'Entity on which this animation will be applied' },
    ],
    array: true
});

// ************************
// * Playcanvas Callbacks *
// ************************

// initialize code called once per entity
ScaleAnimator.prototype.initialize = function () {

    this.on('enable', this.onEnable, this);
    this.on('disable', this.onDisable, this);

    this.coroutines = [];
    this.tweens = [];
    this.duration = 0;
    this.scaleCache = [];
};

ScaleAnimator.prototype.postInitialize = function () {
    this.onEnable();
};

ScaleAnimator.prototype.onEnable = function () {
    if (this.event.scope === 0)
        this.play();

    this.registerEvents('on');
};

ScaleAnimator.prototype.onDisable = function () {
    this.registerEvents('off');
};

ScaleAnimator.prototype.registerEvents = function (action) {
    let scope = this.event.scope === 1 ? this.app : this.entity;

    if (this.event.scope === 0) {
        this[action]('enable', this.play, this);
        this.entity[action]('disable', this.reverse, this);
    }
    else {
        scope[action](this.event.play, this.play, this);
        scope[action](this.event.reverse, this.reverse, this);
    }

    scope[action](this.event.stop, this.stop, this);
    scope[action](this.event.setVal, this.setVal, this);
};

// *************
// * Functions *
// *************

ScaleAnimator.prototype.play = function (onComplete) {
    this.animate(true);
    CustomCoroutine.Instance.set(() => {
        if (onComplete && typeof onComplete === 'function') onComplete()
    }, this.duration);
};

ScaleAnimator.prototype.reverse = function (onComplete) {
    this.animate(false);
    CustomCoroutine.Instance.set(() => {
        if (onComplete && typeof onComplete === 'function') onComplete()
    }, this.duration);
};

ScaleAnimator.prototype.stop = function () {
    for (let i = 0; i < this.tweens.length; i++) {
        if (this.tweens[i]) TweenWrapper.StopTween(this.tweens[i]);
    };

    for (let i = 0; i < this.coroutines.length; i++) {
        if (this.coroutines[i]) CustomCoroutine.Instance.clear(this.coroutines[i]);
    };

    this.coroutines = [];
    this.tweens = [];
};

ScaleAnimator.prototype.animate = function (enable) {

    this.stop();

    for (let i = 0; i < this.anims.length; i++) {
        this.updateScaleCache(i);
        let anim = this.anims[i];

        let from = enable ? anim.from : anim.to;
        let to = enable ? anim.to : anim.from;

        anim.obj.setLocalScale(from.x, from.y, from.z);
        this.scaleCache[i].set(to.x, to.y, to.z);

        let coroutine = CustomCoroutine.Instance.set(() => {
            let tween = TweenWrapper.Tween(
                anim.obj, anim.obj.getLocalScale(), this.scaleCache[i], anim.duration,
                undefined, pc[this.getType(anim.type, anim.ease)], anim.loop, anim.yoyo, anim.repeat
            );
            this.tweens.push(tween);
        }, anim.delay);

        this.coroutines.push(coroutine);
        this.updateLargestDuration(anim.duration + anim.delay);
    }
};


ScaleAnimator.prototype.getType = function (type, ease) {
    // console.log("getType: ", type, typeof type, ease, typeof ease);
    if (type == "Linear")
        return type;
    return type + ease;
};

ScaleAnimator.prototype.updateScaleCache = function (index) {
    if (index >= this.scaleCache.length)
        this.scaleCache.push(new pc.Vec3());
};

ScaleAnimator.prototype.updateLargestDuration = function (duration) {
    if (this.duration < duration)
        this.duration = duration;
};

ScaleAnimator.prototype.setVal = function(index, name, val) {
    let type = typeof this.this.anims[index][name];

    if (type !== typeof val) 
    {
        console.error('Type of variable and value sent not matched!!!');
        return;
    }

    if (typeof val === "Vec3") {
        this.anims[index][name].x = val.x;
        this.anims[index][name].y = val.y;
        this.anims[index][name].z = val.z;
    }
    else
        this.anims[index][name] = val;

};

// swap method called for script hot-reloading
// inherit your script state here
// ScaleAnimator.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// swap method called for script hot-reloading
// inherit your script state here
// ScaleAnimator.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// TweenWrapper.js
/*jshint esversion: 6 */

const TweenWrapper_App = pc.Application.getApplication();

const TweenWrapper = {

    // * FOR *
    // SCALE
    // POSITION
    Tween: function (entity, start, end, duration, onComplete, type, isLoop, isYoyo, repeat) {
        return TweenWrapper.TweenBase('to', entity, start, end, duration, onComplete, type, isLoop, isYoyo, repeat);
    },

    TweenRotation: function (entity, start, end, duration, onComplete, type, isLoop, isYoyo, repeat) {
        return TweenWrapper.TweenBase('rotate', entity, start, end, duration, onComplete, type, isLoop, isYoyo, repeat);
    },

    TweenBase: function (action, entity, start, end, duration, onComplete, type, isLoop, isYoyo, repeat) {
        //  console.log("Tween Called: ", entity, start, end, duration, onComplete, type, isLoop, isYoyo, repeat);
        let tween = entity.tween(start)
        [action](end, duration, type || pc.Linear)
            .loop(isLoop)
            .yoyo(isYoyo)
            // .on('complete', function () { if (onComplete) onComplete(); })
            // .on('update', function() { console.log(entity.getLocalRotation()); })
            .onComplete(() => { if (onComplete) onComplete(); })
            .start();

        if (!isLoop)
            tween.repeat(repeat);

        return tween;
    },

    TweenOpacity: function (element, from, to, duration, onComplete, type, isLoop, isYoyo, repeat) {

        element.opacity = from;

        let obj = { opacity: from };
        let toIncrease = from < to;

        let tween = TweenWrapper_App.tween(obj)
            .to({ opacity: to }, duration, type || pc.Linear)
            .loop(isLoop)
            .yoyo(isYoyo)
            // .on('update', function () {
            //     element.opacity = obj.opacity;

            //     if (toIncrease ? element.opacity >= to : element.opacity <= to)
            //         if (onComplete) onComplete();
            // }, this)
            .onUpdate(() => {
                element.opacity = obj.opacity;

                if (toIncrease ? element.opacity >= to : element.opacity <= to)
                    if (onComplete) onComplete();
            })
            .start();

        if (!isLoop)
            tween.repeat(repeat);

        return tween;
    },

    TweenColor: function (element, oldColor, newColor, duration, onComplete) {

        if (element.color === newColor)
            return;

        var color = oldColor.clone();

        return TweenWrapper_App
            .tween(color)
            .to(newColor, duration, pc.Linear)
            // .on('update', function () {
            //     element.color = color;
            //     if (element.color === color)
            //         if (onComplete) onComplete();
            // }.bind(this))
            .onUpdate(() => {
                element.color = color;
                if (element.color === color)
                    if (onComplete) onComplete();
            })
            .start();
    },

    TweenNumberUpdate: function (from, to, duration, element, label) {

        // console.log(from + " -> " + to);
        if (from !== to) // if 'from' is not equal to 'to'
        {
            var eq1 = pc.math.lerp(from, to, duration);
            var eq2 = from < to ? from >= to : from <= to;
            from = from < to ? Math.ceil(eq1) : Math.floor(eq1);
            // console.log("visibleScore -> " + from);

            if (eq2) {
                from = to;
                if (element !== undefined)
                    element.text = label + from;
                return [false, from];
            }

            if (element !== undefined)
                element.text = label + from;
        }
        else
            return [false, from];

        return [true, from];
    },

    TweenNumber: function (from, to, duration, updateFunction, onComplete, type, isLoop, isYoyo) {

        // console.log(from + " -> " + to);
        if (from !== to) // if 'from' is not equal to 'to'
        {
            let obj = { number: from };
            return TweenWrapper_App.tween(obj)
                .to({ number: to }, duration, type ? type : pc.Linear)
                .loop(isLoop === true)
                .yoyo(isYoyo === true)
                // .on('update', updateFunction.bind(this, obj))
                .onUpdate(() => updateFunction(obj))
                // .on('complete', function () { if (onComplete) onComplete(); })
                .onComplete(() => {
                    if (onComplete) onComplete();
                })
                .start();
        }
        else if (onComplete) onComplete();
    },

    StopTween: function (tween) {
        if (tween)
            tween.stop();
    }
};

// MissionsManager.js
var MissionsManager = pc.createScript('missionsManager');

// Mission Types
// 1. Successful Jumps
// 2. Perfect Jumps
// 3. Survive for x seconds

MissionsManager.attributes.add('missionBases', {
    title: 'Mission Bases',
    type: 'json',
    schema: [
        { name: 'baseCount', type: 'number', title: 'Base Coint' },
        { name: 'title', type: 'string', title: 'Title' },
        { name: 'description', type: 'string', title: 'Description' },
    ],
    array: true
});

// initialize code called once per entity
MissionsManager.prototype.initialize = function () {
    MissionsManager.Instance = this;

    //  this.completedMissions = this.getItemFromLocalStorage('CompletedMissions', 0);
    this.on('enable', this.onEnable, this);
    this.on('disable', this.onDisable, this);
    this.currentMission = {};

    this.missions = [
        this.getSuccessMission.bind(this, 0),
        this.getPerfectMission.bind(this, 1),
        this.getTimedMission.bind(this, 2),
    ];
    this.onEnable();
};

MissionsManager.prototype.postInitialize = function () {

}

MissionsManager.prototype.getCompletedMissions = function () {
    this.completedMissions = DataManager.Instance.completedMissions;
};

MissionsManager.prototype.onEnable = function () {
    this.app.on('MissionManager:InitMission', this.initCurrentMission, this);
    this.app.on('MissionManager:SuccessJump', this.onSuccessJump, this);
    this.app.on('MissionManager:PerfectJump', this.onPerfectJump, this);
    this.app.on('MissionManager:TimerTick', this.onTimerTick, this);
    this.app.on('MissionManager:StartMission', this.startMission, this);
    this.app.on('MissionManager:GetCompletedMissions', this.getCompletedMissions, this);
    // this.getCompletedMissions();
};

MissionsManager.prototype.onDisable = function () {
    this.app.off('MissionManager:InitMission', this.initCurrentMission, this);
    this.app.off('MissionManager:SuccessJump', this.onSuccessJump, this);
    this.app.off('MissionManager:PerfectJump', this.onPerfectJump, this);
    this.app.off('MissionManager:TimerTick', this.onTimerTick, this);
    this.app.off('MissionManager:StartMission', this.startMission, this);
    this.app.off('MissionManager:GetCompletedMissions', this.getCompletedMissions, this);
};

MissionsManager.prototype.update = function (dt) {

};

// ******************************
// * Progress Mission Functions *
// ******************************

MissionsManager.prototype.onSuccessJump = function () {
    let mission = this.currentMission;
    // console.log('onSuccessJump: ', mission.type);
    if (mission && mission.isStarted && mission.type === 0)
        this.updateCurrentMission();

};

MissionsManager.prototype.onPerfectJump = function (increment) {
    let mission = this.currentMission;
    // console.log('onPerfectJump: ', mission.type);
    if (mission && mission.isStarted && (mission.type === 0 || mission.type === 1))
        this.updateCurrentMission(increment);

};

MissionsManager.prototype.onTimerTick = function () {
    let mission = this.currentMission;
    if (mission && mission.isStarted && mission.type === 2)
        this.updateCurrentMission();
};

// ****************************
// * Update Mission Functions *
// ****************************

MissionsManager.prototype.initCurrentMission = function () {
    // console.log("initCurrentMission: ", this.completedMissions);
    this.completedMissions = DataManager.Instance.completedMissions;
    let type = this.completedMissions % 3;
    let index = Math.floor(this.completedMissions / 3);
    let info = this.missions[type](index);

    this.currentMission = {
        type: type,
        count: info.count,
        total: info.total,
        title: info.title,
        desc: info.desc,
        progress: info.progress,
        isStarted: false
    }

    // console.log('---------- New Mission ----------');
    // console.log(info);
    // console.log(this.currentMission);
    this.app.fire('MissionManager:CurrentMission', this.currentMission);
};

MissionsManager.prototype.startMission = function (isStarted) {
    this.currentMission.isStarted = isStarted;
};


MissionsManager.prototype.updateCurrentMission = function (increment) {
    increment = increment && this.currentMission.type === 0 ? increment : 1;
    this.currentMission.count -= increment;
    if (this.currentMission.type === 2)
        progress = `${this.currentMission.count}s`;
    else
        progress = `${this.currentMission.total - this.currentMission.count}/${this.currentMission.total}`;

    let currProgress = (this.currentMission.total - this.currentMission.count) / this.currentMission.total;
    this.app.fire('MissionManager:Progress', progress, currProgress);
    // console.log('---------- Update Mission ----------');
    // console.log(progress);

    if (this.currentMission.count <= 0) {
        this.currentMission = undefined;
        // Mission Completed
        this.completedMissions++;
        // console.log('********** Mission Completed **********');
        this.app.fire('SoundManager:Play', 'MissionCompleted');
        // localStorage.setItem('CompletedMissions', this.completedMissions)
        DataManager.Instance.completedMissions = this.completedMissions;
        this.app.fire('MissionManager:OnMissionCompleted');
    }
};

// **************************
// * Mission Info Functions *
// **************************

MissionsManager.prototype.getSuccessMission = function (type, index) {
    let count = 1;
    if (index !== 0)
        count = this.missionBases[type].baseCount * index;

    // console.log("count: ", count, typeof count);
    // console.log("baseCount: ", this.missionBases[type].baseCount, typeof this.missionBases[type].baseCount);
    // console.log("index: ", count, typeof index);

    let v1 = count > 1 ? count : "a";
    let v2 = count > 1 ? "s" : "";

    return {
        count: count,
        total: count,
        title: this.missionBases[type].title,
        desc: this.formatString(this.missionBases[type].description, v1, v2),
        progress: `0/${count}`
    };;
};

MissionsManager.prototype.getPerfectMission = function (type, index) {
    let count = this.getFabonaciNumber(index);

    let v1 = count > 1 ? count : "a";
    let v2 = count > 1 ? "s" : "";

    return {
        count: count,
        total: count,
        title: this.missionBases[type].title,
        desc: this.formatString(this.missionBases[type].description, v1, v2),
        progress: `0/${count}`
    };
};

MissionsManager.prototype.getTimedMission = function (type, index) {
    if (index === 0)
        this.time = this.missionBases[type].baseCount;
    else {
        this.time = this.missionBases[type].baseCount;
        for (let i = 0; i < Math.floor(this.completedMissions / 3); i++)
            this.time *= 2;
    }
    console.log("Timed Mission time: ", this.time);
    return {
        count: this.time,
        total: this.time,
        title: this.missionBases[type].title,
        desc: this.formatString(this.missionBases[type].description, this.time),
        progress: `${this.time}s`
    };
};

// ********************
// * Helper Functions *
// ********************

MissionsManager.prototype.formatString = function (template, ...values) {
    return template.replace(/\{\d+\}/g, (match) => {
        const index = parseInt(match.match(/\d+/)[0]);
        return values[index] !== undefined ? values[index] : match;
    });
};

MissionsManager.prototype.getItemFromLocalStorage = function (key, defaultValue) {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
        return parseInt(storedValue);
    } else {
        return defaultValue;
    }
};

MissionsManager.prototype.getFabonaciNumber = function (index) {
    let number = 1;
    let last = 1;
    for (let i = 0; i < index; i++) {
        let temp = last;
        last = number;
        number += temp;
    };

    return number;
};

// swap method called for script hot-reloading
// inherit your script state here
// MissionsManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// MissionView.js
var MissionView = pc.createScript('missionView');

MissionView.attributes.add('root', { type: 'entity', title: 'Root' });
MissionView.attributes.add('title', { type: 'entity', title: 'Title' });
MissionView.attributes.add('description', { type: 'entity', title: 'Desciption' });
MissionView.attributes.add('body', { type: 'entity', title: 'Body' });
MissionView.attributes.add('progress', { type: 'entity', title: 'Progress' });
MissionView.attributes.add('progressBar', { type: 'entity', title: 'Progress Fill Bar' });
MissionView.attributes.add('barSpeed', { type: 'number', title: 'Progress Speed', default: 1 });

MissionView.attributes.add('colorSettings', {
    title: 'Color Settings',
    type: 'json',
    schema: [
        { name: 'completed', type: 'rgba', title: 'Completed' },
        { name: 'pending', type: 'rgba', title: 'Pending' },
    ]
});


// initialize code called once per entity
MissionView.prototype.initialize = function () {

    this.on('enable', this.onEnable, this);
    this.on('disable', this.onDisable, this);
    this.onEnable();
};

MissionView.prototype.postInitialize = function () {
    // CustomCoroutine.Instance.set(() => {// console.log(this.entity.name, ': 0 Tick');}, 0);

};

MissionView.prototype.onEnable = function () {
    this.entity.on('Show', this.show, this);
    this.entity.on('Set:Title', this.setTitle, this);
    this.entity.on('Set:Description', this.setDescription, this);
    this.entity.on('Set:Progress', this.setProgress, this);
    this.entity.on('Completed', this.onComplete, this);
    console.warn('Enable: ', this.entity.name);
};

MissionView.prototype.onDisable = function () {
    this.entity.off('Show', this.show, this);
    this.entity.off('Set:Title', this.setTitle, this);
    this.entity.off('Set:Description', this.setDescription, this);
    this.entity.off('Set:Progress', this.setProgress, this);
    this.entity.off('Completed', this.onComplete, this);
    console.warn('Disable: ', this.entity.name);
};

// update code called every frame
MissionView.prototype.update = function (dt) {

};

MissionView.prototype.show = function (show, animate) {
     console.warn(this.entity.name, ":show -> ", show, animate);
    if (show) {
        // // console.log("About to reset Opacity");
        this.entity.fire('Opacity:Reset');
        this.root.enabled = true;
    }
    else {
        if (animate) {
            this.root.fire('FadeOut', () => this.root.enabled = false);
            // // console.log(this.entity.name, ': FadeOut');
            // // console.log(this.root.hasEvent('FadeOut'), ': FadeOut');

        }
        else
            this.root.enabled = false;
    }
};

MissionView.prototype.setTitle = function (enable, title, animate) {
    if (!this.title) return;

    this.title.enabled = enable;
    this.title.element.text = title;
    if (enable && animate)
        this.title.fire('BounceOut');
};

MissionView.prototype.setDescription = function (description) {
    if (this.description) this.description.element.text = description;
};

MissionView.prototype.setProgress = function (progress, currProgress) {
    if (this.progress) {
        this.progress.element.text = progress;

        let scale = this.progressBar.getLocalScale();
        if (!currProgress)
            this.progressBar.setLocalScale(0, scale.y, scale.z);
        else
            TweenWrapper.TweenNumber(scale.x, currProgress, this.barSpeed, obj => this.progressBar.setLocalScale(obj.number, scale.y, scale.z));
    }
};

MissionView.prototype.onComplete = function (isCompleted) {
    this.title.element.color = isCompleted ? this.colorSettings.completed : this.colorSettings.pending;
    this.description.element.color = isCompleted ? this.colorSettings.completed : this.colorSettings.pending;
    this.progress.element.color = isCompleted ? this.colorSettings.completed : this.colorSettings.pending;
};

// swap method called for script hot-reloading
// inherit your script state here
// MissionView.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// opacityAnimatorChild.js
var OpacityAnimatorChild = pc.createScript('opacityAnimatorChild');

OpacityAnimatorChild.attributes.add('overide', {
    title: 'Overide Settings',
    type: 'json',
    schema: [
        { name: 'type', title: 'Type', type: 'boolean' },
        { name: 'ease', type: 'boolean', title: 'Ease' },
        { name: 'loop', title: 'Loop', type: 'boolean' },
        { name: 'yoyo', title: 'Yoyo', type: 'boolean',},
        { name: 'repeat', title: 'Repeat', type: 'boolean' },
        { name: 'excludedTag', title: 'Excluded Tag', type: 'boolean' },
        { name: 'from', title: 'From', min: 0, max: 1, type: 'boolean'},
        { name: 'to', title: 'To', min: 0, max: 1, type: 'boolean'},
        { name: 'duration', title: 'Duration', type: 'boolean' },
        { name: 'delay', title: 'Delay', type: 'boolean'},
        { name: 'obj', title: 'Entity', type: 'boolean'},
    ],
    description: 'Check variables which you want to overide from parent animator'
});

OpacityAnimatorChild.attributes.add('overideAnim', {
    title: 'Overide Animation',
    type: 'json',
    schema: [
        {
            name: 'type', title: 'Type', type: 'string', enum: [
                { "Linear": "Linear" }, { "Quadratic": "Quadratic" }, { "Cubic": "Cubic" },
                { "Quartic": "Quartic" }, { "Quintic": "Quintic" }, { "Sine": "Sine" },
                { "Exponential": "Exponential" }, { "Circular": "Circular" }, { "Back": "Back" },
                { "Bounce": "Bounce" }, { "Elastic": "Elastic" }
            ], default: "Linear"
        },
        {
            name: 'ease', type: 'string', title: 'Ease',
            enum: [{ 'In': 'In' }, { 'Out': 'Out' }, { 'InOut': 'InOut' }], default: 'In',
            description: 'Ease will be automatically ignore incase of Linear type',
        },
        { name: 'loop', title: 'Loop', type: 'boolean' },
        { name: 'yoyo', title: 'Yoyo', type: 'boolean', description: 'If not looped, repeat must be greater than 1 inorder to make yoyo work' },
        { name: 'repeat', title: 'Repeat', type: 'number', default: 1 },
        { name: 'excludedTag', title: 'Excluded Tag', type: 'string', default: "ExcludeOpacityAnim", description: 'Add this tag to children for them to be excluded from opacity animation if \'Apply on Children\' bool is true' },
        { name: 'from', title: 'From', min: 0, max: 1, type: 'number', default: 0 },
        { name: 'to', title: 'To', min: 0, max: 1, type: 'number', default: 1 },
        { name: 'duration', title: 'Duration', type: 'number', default: 0.5 },
        { name: 'delay', title: 'Delay', type: 'number', default: 0 },
        { name: 'obj', title: 'Entity', type: 'entity', description: 'Entity on which this animation will be applied' },
    ]
});

// swap method called for script hot-reloading
// inherit your script state here
// OpacityAnimatorChild.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// MissionsTestMenuEventListener.js
var MissionsTestMenuEventListener = pc.createScript('missionsTestMenuEventListener');

MissionsTestMenuEventListener.attributes.add('refs', {
    title: 'References',
    type: 'json',
    schema: [
        { name: 'currentMissionView', type: 'entity', title: 'Current Mission View' },
        { name: 'newMissionView', type: 'entity', title: 'New Mission View' },
    ],
});

// initialize code called once per entity
MissionsTestMenuEventListener.prototype.initialize = function() {
    this.missionsUiHanlder = new MissionsUiHandler(
        this.app, this.refs.newMissionView, this.refs.currentMissionView
    );

    this.app.on('MissionManager:CurrentMission', this.missionsUiHanlder.onCurrentMissionIntiated, this.missionsUiHanlder);
    this.app.on('MissionManager:Progress', this.missionsUiHanlder.onMissionProgress, this.missionsUiHanlder);
    this.app.on('MissionManager:OnMissionCompleted', this.missionsUiHanlder.onMissionCompleted, this.missionsUiHanlder);
};

MissionsTestMenuEventListener.prototype.postInitialize = function() {
    this.refs.newMissionView.fire('Show', false);
    this.refs.currentMissionView.fire('Show', false);
};

// update code called every frame
MissionsTestMenuEventListener.prototype.update = function(dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// MissionsTestMenuEventListener.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// MissionsUIHandler.js
class MissionsUiHandler {
    constructor(app, newMissionView, currentMissionView) {
        this.newMissionView = newMissionView;
        this.currentMissionView = currentMissionView;
        this.app = app;
    }

    setMission(entity, enable, enableTitle, title, desc, progress) {
        if (title) entity.fire('Set:Title', enableTitle, title);
        if (desc) entity.fire('Set:Description', desc);
        if (progress) entity.fire('Set:Progress', progress);
        // console.log('setMission:Show', true);
        entity.fire('Show', enable, true);
    }

    onCurrentMissionIntiated(mission) {
        this.setMission(
            this.newMissionView, true, true, "New Mission", mission.desc, mission.progress
        );

        CustomCoroutine.Instance.set(() => {
            this.setMission(this.newMissionView, false);
            this.currentMissionView.fire('Completed', false);
            this.setMission(
                this.currentMissionView, true, true, mission.title, mission.desc, mission.progress
            );
            this.app.fire('MissionManager:StartMission', true);

        }, 2);
    }

    onMissionProgress(progress,currProgress) {
        this.currentMissionView.fire('Set:Progress', progress, currProgress);
    }

    onMissionCompleted() {
        this.app.fire('MissionManager:InitMission');
        this.setMission(this.currentMissionView, false);
        this.currentMissionView.fire('Completed', true);
    }
}

// swap method called for script hot-reloading
// inherit your script state here
// MissionsUihandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// posteffect-brightnesscontrast.js
// --------------- POST EFFECT DEFINITION --------------- //
/**
 * @class
 * @name BrightnessContrastEffect
 * @classdesc Changes the brightness and contrast of the input render target.
 * @description Creates new instance of the post effect.
 * @augments PostEffect
 * @param {GraphicsDevice} graphicsDevice - The graphics device of the application.
 * @property {number} brightness Controls the brightness of the render target. Ranges from -1 to 1 (-1 is solid black, 0 no change, 1 solid white).
 * @property {number} contrast Controls the contrast of the render target. Ranges from -1 to 1 (-1 is solid gray, 0 no change, 1 maximum contrast).
 */
function BrightnessContrastEffect(graphicsDevice) {
    pc.PostEffect.call(this, graphicsDevice);

    // Shader author: tapio / http://tapio.github.com/
    var fshader = [
        "uniform sampler2D uColorBuffer;",
        "uniform float uBrightness;",
        "uniform float uContrast;",
        "",
        "varying vec2 vUv0;",
        "",
        "void main() {",
        "    gl_FragColor = texture2D( uColorBuffer, vUv0 );",
        "    gl_FragColor.rgb += uBrightness;",
        "",
        "    if (uContrast > 0.0) {",
        "        gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) / (1.0 - uContrast) + 0.5;",
        "    } else {",
        "        gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) * (1.0 + uContrast) + 0.5;",
        "    }",
        "}"
    ].join("\n");

    this.shader = pc.createShaderFromCode(graphicsDevice, pc.PostEffect.quadVertexShader, fshader, 'BrightnessContrastShader', {
        aPosition: pc.SEMANTIC_POSITION
    });

    // Uniforms
    this.brightness = 0;
    this.contrast = 0;
}

BrightnessContrastEffect.prototype = Object.create(pc.PostEffect.prototype);
BrightnessContrastEffect.prototype.constructor = BrightnessContrastEffect;

Object.assign(BrightnessContrastEffect.prototype, {
    render: function (inputTarget, outputTarget, rect) {
        var device = this.device;
        var scope = device.scope;

        scope.resolve("uBrightness").setValue(this.brightness);
        scope.resolve("uContrast").setValue(this.contrast);
        scope.resolve("uColorBuffer").setValue(inputTarget.colorBuffer);
        this.drawQuad(outputTarget, this.shader, rect);
    }
});

// ----------------- SCRIPT DEFINITION ------------------ //
var BrightnessContrast = pc.createScript('brightnessContrast');

BrightnessContrast.attributes.add('brightness', {
    type: 'number',
    default: 0,
    min: -1,
    max: 1,
    title: 'Brightness'
});

BrightnessContrast.attributes.add('contrast', {
    type: 'number',
    default: 0,
    min: -1,
    max: 1,
    title: 'Contrast'
});

BrightnessContrast.prototype.initialize = function () {
    this.effect = new BrightnessContrastEffect(this.app.graphicsDevice);
    this.effect.brightness = this.brightness;
    this.effect.contrast = this.contrast;

    this.on('attr', function (name, value) {
        this.effect[name] = value;
    }, this);

    var queue = this.entity.camera.postEffects;

    queue.addEffect(this.effect);

    this.on('state', function (enabled) {
        if (enabled) {
            queue.addEffect(this.effect);
        } else {
            queue.removeEffect(this.effect);
        }
    });

    this.on('destroy', function () {
        queue.removeEffect(this.effect);
    });
};


// PerfectJumpEffect.js
var PerfectJumpEffect = pc.createScript('perfectJumpEffect');

PerfectJumpEffect.attributes.add('root', { type: 'entity', title: 'Root' });
PerfectJumpEffect.attributes.add('offset', { type: 'vec3', title: 'Offset', default: [0, 1, 0] });
PerfectJumpEffect.attributes.add('dur', { type: 'number', title: 'Duration', default: 1 });
PerfectJumpEffect.attributes.add('flashMat', { type: 'asset', assetType: 'material', title: 'Material' });
PerfectJumpEffect.attributes.add('flashPow', { type: 'number', title: 'Flash Power', min: 0, max:1 });
PerfectJumpEffect.attributes.add('originalMat', { type: 'asset', assetType: 'material', title: 'Original Material' });

PerfectJumpEffect.attributes.add('squareSettings', {
    title: 'Square Settings',
    type: 'json',
    schema: [
        { name: 'model', type: 'entity', title: 'Square' },
        { name: 'delay', type: 'number', title: 'Delay' },
    ],array: true
});

// initialize code called once per entity
PerfectJumpEffect.prototype.initialize = function () {
    this.perfectBoxes = [];
    this.app.on('PerfectJumpEffect:Play', this.playEffect, this);
    this.app.on('PerfectJumpEffect:ClearList', this.clearBoxesList, this);
    this.app.on('PerfectJumpEffect:AddBox', this.addPerfectBox, this);
};

// update code called every frame
PerfectJumpEffect.prototype.update = function (dt) {
};

PerfectJumpEffect.prototype.playEffect = function (count, pos) {
    this.root.setPosition(pos.x + this.offset.x, pos.y + this.offset.y, pos.z + this.offset.z);
    let i = 0;
    while (i < count) {
        let j = i;
        CustomCoroutine.Instance.set(function (i) {
            this.squareSettings[i].model.setLocalScale(pc.Vec3.ZERO);
            this.squareSettings[i].model.element.opacity = 1;
            TweenWrapper.Tween(this.squareSettings[i].model, this.squareSettings[i].model.getLocalScale(), pc.Vec3.ONE, this.dur);
            this.squareSettings[i].model.fire('Play');
        }.bind(this, j), this.squareSettings[i].delay);
        i++;
    }
    CustomCoroutine.Instance.set(() => {
       // this.app.fire('SoundManager:Play', 'PerfectJumpSound');
        this.flashPerfectBoxes();
    }, 0.1);

};

PerfectJumpEffect.prototype.clearBoxesList = function () {
    for (i = this.perfectBoxes.length - 1; i >= 0; i--) {
        this.perfectBoxes[i].render.meshInstances[0].material = this.originalMat.resource;
        this.perfectBoxes.pop();
    }
}

PerfectJumpEffect.prototype.addPerfectBox = function (box) {
    this.perfectBoxes.push(box);
    let index = this.perfectBoxes.length - 1;
    this.perfectBoxes[index].render.meshInstances[0].material = this.flashMat.resource;
}

PerfectJumpEffect.prototype.flashPerfectBoxes = function () {
    TweenWrapper.TweenNumber(0, 1, 0.4, (obj) => {
        for (i = 0; i < this.perfectBoxes.length; i++) {
            this.perfectBoxes[i].render.meshInstances[0].material.emissiveIntensity = Math.sin(obj.number * Math.PI) * this.flashPow;
            this.perfectBoxes[i].render.meshInstances[0].material.update();
        }
    });
};

// swap method called for script hot-reloading
// inherit your script state here
// PerfectJumpEffect.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// scoreIncrement.js
var ScoreIncrement = pc.createScript('scoreIncrement');

ScoreIncrement.attributes.add('offset', { type: 'vec3', title: 'Offset', default: [1, 0, 0] });
ScoreIncrement.attributes.add('moveOffset', { type: 'vec3', title: 'Move Offset', default: [4, 1, 0] });
ScoreIncrement.attributes.add('dur', { type: 'number', title: 'Duration', default: 1});

// initialize code called once per entity
ScoreIncrement.prototype.initialize = function () {
    this.app.on("ScoreIncrement:Display", this.display, this);
    this.cacheVec3 = new pc.Vec3();
};

// update code called every frame
ScoreIncrement.prototype.update = function (dt) {

};

ScoreIncrement.prototype.display = function (increment, player, onComplete) {
    let pos = player.getLocalPosition();
    this.cacheVec3.set(pos.x, pos.y, pos.z);

    this.cacheVec3.x += this.offset.x;
    this.cacheVec3.y += this.offset.y;
    this.cacheVec3.z = this.entity.getLocalPosition().z + this.offset.z;

    this.entity.setLocalPosition(this.cacheVec3.x, this.cacheVec3.y, this.cacheVec3.z);
    this.entity.element.text = "+" + increment;

    this.cacheVec3.x += this.moveOffset.x;
    this.cacheVec3.y += this.moveOffset.y;

    if (this.scoreTween) TweenWrapper.StopTween(this.scoreTween);
    this.scoreTween = TweenWrapper.Tween(this.entity, this.entity.getLocalPosition(), this.cacheVec3, this.dur);
    
    this.entity.fire("play", onComplete);
};

// swap method called for script hot-reloading
// inherit your script state here
// ScoreIncrement.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// ScoreLineEffect.js
var ScoreLineEffect = pc.createScript('scoreLineEffect');

ScoreLineEffect.attributes.add("root", { type: 'entity', title: "Root" });
ScoreLineEffect.attributes.add("durRange", { type: 'vec2', title: 'Duration Range', default: [0.9, 2] });
ScoreLineEffect.attributes.add("boxes", { type: 'entity', title: 'Box', array: true });

// initialize code called once per entity
ScoreLineEffect.prototype.initialize = function () {
    this.app.on("ScoreLineEffect", this.breakLine, this);
    this.app.on("ResetScoreLine", this.resetLine, this);
    this.cacheVec3 = new pc.Vec3();
};

// update code called every frame
ScoreLineEffect.prototype.update = function (dt) {

};

ScoreLineEffect.prototype.breakLine = function () {
    // console.log("Breaking");
    this.app.fire("SoundManager:Play", ['NewHighScore1', 'NewHighScore2', 'NewHighScore3']);
    this.root.layoutgroup.enabled = false;
    for (i = 0; i < this.boxes.length; i++) {
        let currPos = this.boxes[i].getLocalPosition();
        this.cacheVec3.set(currPos.x, currPos.y + 2000, currPos.z);
        let dur = pc.math.random(this.durRange.x, this.durRange.y);

        TweenWrapper.Tween(this.boxes[i], currPos, this.cacheVec3, dur);
        this.boxes[i].fire("play"); // to fade opcaity
    }
};

ScoreLineEffect.prototype.resetLine = function () {
    // console.log("Resetting Line");
    for (i = 0; i < this.boxes.length; i++) {
        this.boxes[i].element.opacity = 1;
    }
    this.root.layoutgroup.enabled = true;
};

// swap method called for script hot-reloading
// inherit your script state here
// ScoreLineEffect.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// CloudController.js
var CloudController = pc.createScript('cloudController');

CloudController.attributes.add("speed", { type: 'number', title: "Movement Speed" });
CloudController.attributes.add('rangeSettings', {
    title: 'Movement Range Settings',
    type: 'json',
    schema: [
        { name: 'phone', type: 'vec2', title: "Phone", default: [-50, 50] },
        { name: 'desktop', type: 'vec2', title: "Desktop", default: [-60, 60] }
    ],
});

// initialize code called once per entity
CloudController.prototype.initialize = function () {
    this.range = pc.platform.desktop ? this.rangeSettings.desktop : this.rangeSettings.phone;
};

// update code called every frame
CloudController.prototype.update = function (dt) {
    this.moveCloudRight(dt);
};

CloudController.prototype.moveCloudRight = function (dt) {
    let newPos = this.entity.getLocalPosition();
    newPos.x += this.speed * dt;

    if (this.cloudTween) TweenWrapper.StopTween(this.cloudTween);
    this.entity.setLocalPosition(newPos.x, newPos.y, newPos.z);

    if (newPos.x > this.range.y) {
        this.speed = -1 * Math.abs(this.speed);
    }

    if (newPos.x < this.range.x) {
        this.speed = Math.abs(this.speed);
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// CloudController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// CameraBlend.js
var CameraBlend = pc.createScript('cameraBlend');

CameraBlend.attributes.add("dur", { type: 'number', title: 'Duration', default: 0.25 });
CameraBlend.attributes.add("zoomSize", { type: 'number', title: 'Zoom Size', default: 0.5 });
CameraBlend.attributes.add('dest', { type: 'entity', title: 'Destination' });
CameraBlend.attributes.add('limit', { type: 'number', title: 'Zoom Limit' });


// initialize code called once per entity
CameraBlend.prototype.initialize = function () {
    this.app.on('Move:CameraUp', this.moveCameraUp, this);
    this.app.on('Move:CameraZoom', this.cameraZoom, this);
    this.app.on('Move:CameraTo', this.moveCameraTo, this);
};

// update code called every frame
CameraBlend.prototype.update = function (dt) {

};

CameraBlend.prototype.moveCameraUp = function (amount, onComplete) {
    var newPos = this.entity.getPosition();
    newPos.y += amount;
    this.dest.setPosition(newPos.x, newPos.y, newPos.z);
    this.entity.fire("Move", onComplete);
};

CameraBlend.prototype.moveCameraTo = function (x, y, z, onComplete) {
    var newPos = this.entity.getPosition();
    newPos.x = x != undefined ? x : newPos.x;
    newPos.y = y != undefined ? y : newPos.y;
    newPos.z = z != undefined ? z : newPos.z;

    this.dest.setPosition(newPos.x, newPos.y, newPos.z);
    this.entity.fire("Move", onComplete);
}

CameraBlend.prototype.cameraZoom = function (boxCount, isZoomOut, onComplete) {
    mul = isZoomOut ? 1 : -1;
    boxCount = Math.min(this.limit, boxCount);
    var newPos = this.entity.getPosition();
    if (boxCount == 0) {
        newPos.z += (-mul * this.zoomSize);
    }
    else {
        newPos.z += (boxCount * mul * this.zoomSize);
    }
    this.dest.setPosition(newPos.x, newPos.y, newPos.z);
    this.entity.fire("Move", onComplete);
};



// swap method called for script hot-reloading
// inherit your script state here
// CameraBlend.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// SpineAnimPlayer.js
var SpineAnimPlayer = pc.createScript('spineAnimPlayer');

SpineAnimPlayer.attributes.add('event', {
    title: 'Events',
    type: 'json',
    schema: [
        {
            name: 'eventScope', type: 'number', title: 'Events Scope',
            enum: [{ 'App': 0 }, { 'Entity': 1 },], default: 0
        },
        { name: 'playByIndex', type: 'string', title: 'Play By Index', description: 'Call this event to play animation by index.', default: 'SpineAnimPlayer:PlayByIndex'},
        { name: 'playByName', type: 'string', title: 'Play By Name', description: 'Call this event to play animation by name.', default: 'SpineAnimPlayer:PlayByName'},
    ],
    description: "Parameters: (index/name, loop, track, dur). " +
                 "index/name: (Depending on which event you are calling you will send name or index of animation). " +
                 "loop: (Set this true if you want to loop animation otherwise false). " +
                 "track: (This is used to play 2 or more animations together, like play 1st on track 0, and 2nd on track 1). " +
                 "dur: (This is duration to transition from one animation to other). "
});

SpineAnimPlayer.attributes.add('settings', {
    title: 'Settings',
    type: 'json',
    schema: [
        { name: 'loop', type: 'boolean', title: 'Loop' },
        { name: 'track', type: 'number', title: 'Track', description: 'Tranck on which the animation will be played', },
        { name: 'dur', type: 'number', title: 'Duration' },
        { name: 'name', type: 'string', title: 'Play Name', description: 'Leave empty to not play animation on postInitialize'},
        { name: 'spineEntity', type: 'entity', title: 'Spine Entity', description: 'Entity to which spine.js is attached. Leave empty if spine.js is attached to this entity', },
    ]
});

SpineAnimPlayer.prototype.initialize = function() {
    this.entity.spine.layers = [this.app.scene.layers.getLayerByName('Spine World')];
    this.spineEntity = this.spineEntity || this.entity;
};

// initialize code called once per entity
SpineAnimPlayer.prototype.postInitialize = function() {

    let scope = this.event.eventScope === 0 ? this.app : this.entity;
    scope.on(this.event.playByIndex, this.playByIndex, this);
    scope.on(this.event.playByName, this.playByName, this);

    // this.spineEntity.spine.state.mixDuration = 1;
    if (this.settings.name.length !== 0) {
        let anim = this.settings;
        this.playByName(anim.name, anim.loop, anim.track, anim.dur);
    }
};

// update code called every frame
SpineAnimPlayer.prototype.update = function(dt) {
    
};

SpineAnimPlayer.prototype.playByIndex = function(index, loop, track, dur) {
    this.playByName(this.settings.animNames[index], track, loop, dur);
}

SpineAnimPlayer.prototype.playByName = function(name, loop, track, dur,timescale) {
    console.log('SpineAnimPlayer:playByName: ', name, loop, track, dur,timescale);
    if (!this.isDef(track)) track = 0;
    if (!this.isDef(dur)) dur = 0.2;
    let entry = this.spineEntity.spine.state.setAnimation(track, name, loop);
    entry.mixDuration = dur;
    entry.timeScale = timescale;
  //  console.log('2323: Anim Playing Name: ', name);
}

SpineAnimPlayer.prototype.isDef = function(val) {
    return val !== undefined && val !== null;
};

// swap method called for script hot-reloading
// inherit your script state here
// SpineAnimPlayer.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/

// SpineAnimator.js
var SpineAnimator = pc.createScript('spineAnimator');

SpineAnimator.attributes.add('animPlayer', { type: 'entity', title: 'Animation Player', description: 'Leave empty if spineAnimPlayer.js is attached to same entity' });

SpineAnimator.attributes.add('event', {
    title: 'Event Settings',
    type: 'json',
    schema: [
        {
            name: 'scope', type: 'string', title: 'Scope',
            enum: [{ 'App': 'app' }, { 'Entity': 'entity' },], default: 'app'
        },
        { name: 'name', type: 'string', title: 'Name', default: 'SpineAnimator', description: 'Fire this event as this.app.fire(eventName, animName)' },
    ]
});

SpineAnimator.attributes.add('anims', {
    title: 'Animations',
    type: 'json',
    schema: [
        { name: 'name', type: 'string', title: 'Name' },
        { name: 'timescale', type: 'number', title: 'Time Scale', default: 1 },
        { name: 'loop', type: 'boolean', title: 'Loop' },
        { name: 'track', type: 'number', title: 'Track' },
        { name: 'autoTrans', type: 'string', title: 'Auto Transition', description: 'If not looped and next state name is given then on complete animations will automatically tansite to this named state' },
        { name: 'randomNames', type: 'string', title: 'Random Names', array: true, description: 'Randomly play\'s one of the given animations' },
        { name: 'transitions', type: 'string', title: 'Transition Durations', array: true, description: 'Fill it with NameOfAnimation:Duration' },
    ],
    array: true,
});

SpineAnimator.prototype.initialize = function () {
    this.app.on('SpineAnimator:UpdateAnimator', this.updateAnimator, this);
    this.animator = this.animPlayer || this.entity;
    this.prevAnim = undefined;

    let scope = this[this.event.scope];
    scope.on(this.event.name, this.playAnim, this);

    this.nameToIndexMap = {};
    for (let i = 0; i < this.anims.length; i++) {
        this.nameToIndexMap[this.anims[i].name] = i;
    }
};

SpineAnimator.prototype.updateAnimator = function (entity) {
    this.animator = entity || this.animator;
    let name = this.prevAnim ? this.prevAnim.name : 'Idle';
    this.playAnim(name);
};

SpineAnimator.prototype.playAnim = function (name) {
    // console.log('playAnim', name, typeof name);
    let anim = this.anims[this.nameToIndexMap[name]];
    let animName = this.getRandomName(anim) || anim.name;
    let dur = this.getDuration(anim);
    // console.log('animName: ', animName);
    // console.log('dur: ', dur);
    this.prevAnim = anim;

    this.animator.fire('PlayByName', animName, anim.loop, anim.track, dur, anim.timescale);
};

SpineAnimator.prototype.getRandomName = function (anim) {
    if (anim.randomNames.length > 0) {
        let index = Math.floor(pc.math.random(0, 100));
        index = index % anim.randomNames.length;
        return anim.randomNames[index];
    }

    return undefined;
};

SpineAnimator.prototype.getDuration = function (anim) {
    if (this.prevAnim === undefined) return;
    for (let i = 0; i < this.prevAnim.transitions.length; i++) {
        let data = this.prevAnim.transitions[i].split(':');
        if (data[0] == anim.name)
            return parseInt(data[1]);
    }

    return undefined;
};

// swap method called for script hot-reloading
// inherit your script state here
// SpineAnimator.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// DustGenerator.js
var DustGenerator = pc.createScript('dustGenerator');

DustGenerator.attributes.add('dustPool', { type: 'entity', title: 'Dust Pool' });
DustGenerator.attributes.add('particles', { type: 'asset', assetType: 'texture', title: 'Particles', array: true });
DustGenerator.attributes.add('startingPos', { type: 'entity', title: 'Starting Position' });

DustGenerator.attributes.add('range', {
    title: 'Attribute Ranges',
    type: 'json',
    schema: [
        { name: 'opacity', type: 'vec2', title: 'Opacity Range' },
        { name: 'time', type: 'vec2', title: 'Time Range' },
        { name: 'particleFall', type: 'vec2', title: 'Particle Range 1' },
        { name: 'particleJump', type: 'vec2', title: 'Particle Range 2' },
        { name: 'distance', type: 'vec2', title: 'Distance Range' },
        { name: 'height', type: 'vec2', title: 'Height Range' }
    ],
});

// initialize code called once per entity
DustGenerator.prototype.initialize = function () {
    this.pool = this.dustPool.script.PoolController;
    this.app.on('Generate:Dust', this.generateDust, this);
};

// update code called every frame
DustGenerator.prototype.update = function (dt) {

};


DustGenerator.prototype.generateDust = function (dir) {
    let numberOfParticles = 0;
    if (dir === 'Fall') {
        numberOfParticles = Math.floor(pc.math.random(this.range.particleFall.x, this.range.particleFall.y));
    }
    else {
        numberOfParticles = Math.floor(pc.math.random(this.range.particleJump.x, this.range.particleJump.y));
    }
    for (i = 0; i < numberOfParticles; i++) {
        let particle = this.pool.get();

        let newPos = this.startingPos.getPosition();
        particle.setPosition(newPos.x, newPos.y, newPos.z);

        let index = Math.floor(pc.math.random(0, this.particles.length));
        particle.element.texture = this.particles[index].resource;

        particle.enabled = true;
        let dir = i >= numberOfParticles / 2 ? 1 : 0;
        this.moveParticle(particle, dir);
    }
};

DustGenerator.prototype.moveParticle = function (particle, dir) {

    let time = pc.math.random(this.range.time.x, this.range.time.y);
    let newOpacity = pc.math.random(this.range.opacity.x, this.range.opacity.y);
    let newPos = particle.getPosition();
    let mul = dir == 0 ? 1 : -1;

    particle.element.opacity = newOpacity;

    newPos.x = pc.math.random(this.range.distance.x, this.range.distance.y);
    newPos.x *= mul;
    newPos.y += pc.math.random(this.range.height.x, this.range.height.y);

    CustomCoroutine.Instance.set(() => {
        particle.fire('Opacity:Set', 0, 'duration', time);
        particle.fire('Opacity:Set', 0, 'from', newOpacity);

        particle.fire('Position:Set', 0, 'duration', time);
        particle.fire('Position:Set', 0, 'to', newPos);
        particle.fire('Rotate:Play');
        particle.fire('Play', () => this.app.fire('DustPool:Restore', particle));
    }, 0);
};

// swap method called for script hot-reloading
// inherit your script state here
// DustGenerator.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// tutorialManager.js
var TutorialManager = pc.createScript('tutorialManager');

TutorialManager.attributes.add('tutorialJumps', { type: 'number', title: 'Tutorial Jumps', description: "Number of Jumps for tutorial" });
TutorialManager.attributes.add('tutorial', { type: 'entity', title: 'Tutorial' });
TutorialManager.attributes.add('alwaysOn', { type: 'boolean', title: 'Always On' });

// initialize code called once per entity
TutorialManager.prototype.initialize = function () {
    this.app.on('Tutorial:Start', this.start, this);
    this.app.on('Tutorial:Finish', this.finish, this);
};

// update code called every frame
TutorialManager.prototype.update = function (dt) {

};

TutorialManager.prototype.start = function () {
    if (DataManager.Instance.gameCount <= 0 || this.alwaysOn) {
        this.tutorial.enabled = true;
        console.log('Tutorial: ', true);
    }
};


TutorialManager.prototype.finish = function (jumpCount) {
    if (jumpCount >= this.tutorialJumps) {
        this.tutorial.enabled = false;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// TutorialManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// stencil-subject.js
var StencilSubject = pc.createScript('stencilSubject');

StencilSubject.attributes.add('showInside', {
    title: 'Show',
    description: 'Determines whether this entity will be shown inside or outside of a mask with the given ID.\n' +
        'If multiple ID\'s are passed: \n' +
        '- If \'Inside\' is chosen, only the parts which are inside all of the given IDs will be shown.\n' +
        '- If \'Outside\' is chosen, the parts which are outside any of the given IDs will be shown.\n',
    type: 'boolean',
    default: true,
    enum: [
        { 'Inside': true },
        { 'Outside': false },
    ],
});

StencilSubject.attributes.add('maskIDs', {
    title: 'Mask IDs',
    description: 'These ID\'s have to be between 0 and 7.',
    type: 'number',
    array: true,
    default: [0],
});


StencilSubject.prototype.postInitialize = function () {
    var i = 0;
    var j = 0;
    this._meshInstances = [];
    
    var renders = this.entity.findComponents('render');

    for (i = 0; i < renders.length; ++i) {
        meshInstances = renders[i].meshInstances;
        for (j = 0; j < meshInstances.length; j++) {
            this._meshInstances.push(meshInstances[j]);
        }
    }

    var models = this.entity.findComponents('model');
    for (i = 0; i < models.length; ++i) {
        meshInstances = models[i].meshInstances;
        for (j = 0; j < meshInstances.length; j++) {
            this._meshInstances.push(meshInstances[j]);
        }
    }

    this._setStencil();

    this.on('attr', this._attributeReloading);
};


StencilSubject.prototype._setStencil = function () {
    if (!this._addMaskIDs()) {
        return;
    }

    var stencil = new pc.StencilParameters({
        readMask: this.maskID,
        writeMask: this.maskID,
        ref: this.maskID,
        func: this.showInside ? pc.FUNC_EQUAL : pc.FUNC_NOTEQUAL,
    });

    this._setStencilForModel(stencil);
    this._setStencilForParticle(stencil);
    this._setStencilForSpine(stencil);
    this._setStencilForSprite(stencil);
};


StencilSubject.prototype._addMaskIDs = function () {
    this.maskID = 0;

    // Check if the mask has the right length
    if (this.maskIDs.length > 8) {
        return false;
    }

    for (var i = 0; i < this.maskIDs.length; ++i) {
        var id = Math.floor(this.maskIDs[i]);

        if (id >= 0 && id < 8) {
            this.maskID += Math.pow(2, id);
        }
        else {
            // Check if the mask has the right length
            return false;
        }
    }

    return true;
};


StencilSubject.prototype._setStencilForModel = function (stencil) {
    for (var i = 0; i < this._meshInstances.length; i++) {
        this._meshInstances[i].layer = pc.LAYER_WORLD - 1;
        var mat = this._meshInstances[i].material.clone();
        mat.stencilBack = mat.stencilFront = stencil;
        this._meshInstances[i].material = mat;
    }
};


StencilSubject.prototype._setStencilForParticle = function (stencil) {
    if (this.entity.particlesystem) {
        this.entity.particlesystem.emitter.meshInstance.layer = pc.LAYER_WORLD - 1;
        var mat = this.entity.particlesystem.emitter.material;
        mat.stencilBack = mat.stencilFront = stencil;
    }
};


StencilSubject.prototype._setStencilForSpine = function (stencil) {
    if (this.entity.spine) {
        var model = this.entity.spine.spine._model;

    for (var i = 0; i < this._meshInstances.length; i++) {
            this._meshInstances[i].layer = pc.LAYER_WORLD - 1;
            var mat = this._meshInstances[i].material;
            mat.stencilBack = mat.stencilFront = stencil;
        }
    }
};


StencilSubject.prototype._setStencilForSprite = function (stencil) {
    if (this.entity.sprite) {
        // Waring: Private API
        var model = this.entity.sprite._model;

        model.meshInstances[0].layer = pc.LAYER_WORLD - 1;
        var mat = model.meshInstances[0].material.clone();
        mat.stencilBack = mat.stencilFront = stencil;
        model.meshInstances[0].material = mat;
    }
};


StencilSubject.prototype.swap = function (stencil) {
    this.on('attr', this._attributeReloading);
};


StencilSubject.prototype._attributeReloading = function (name, value, prev) {
    this._setStencil();
};

// stencil-mask.js
var StencilMask = pc.createScript('stencilMask');

StencilMask.attributes.add('maskID', {
    title: 'Mask ID',
    description: 'This mask id should be an integer between 0 and 7, as it relates as the power of 2 to the actual mask id.',
    type: 'number',
    default: 0,
    min: 0,
    max: 7,
    precision: 0,
});


StencilMask.prototype.initialize = function () {    
    this._setStencil();
    this.on('attr', this._attributeReloading);
};


StencilMask.prototype._setStencil = function () {
    var mask = Math.pow(2, this.maskID);

    var stencil = new pc.StencilParameters({
        readMask: mask,
        writeMask: mask,
        ref: mask,
        zpass: pc.STENCILOP_REPLACE
    });

    this._setModelAsStencil(stencil);
};


StencilMask.prototype._setModelAsStencil = function (stencilParameter) {
    var meshInstances = null;

    if (this.entity.render) {
        meshInstances = this.entity.render.meshInstances;
    }

    if (this.entity.model) {
        
        meshInstances = this.entity.model.meshInstances;
    }

    if (meshInstances && meshInstances.length > 0) {
        var mat = meshInstances[0].material.clone();
        mat.stencilBack = mat.stencilFront = stencilParameter;
        // Don't write to color, only to stencil
        mat.redWrite = mat.greenWrite = mat.blueWrite = mat.alphaWrite = false;
        meshInstances[0].material = mat;
        mat.update();
    }
};


StencilMask.prototype.swap = function (old) {
    this.on('attr', this._attributeReloading);
};


StencilMask.prototype._attributeReloading = function (name, value, prev) {
    this._setStencil();
};

// CustomizeSkin.js
var CustomizeSkin = pc.createScript('customizeSkin');

CustomizeSkin.attributes.add("character", { type: "entity" });

// initialize code called once per entity
CustomizeSkin.prototype.initialize = function () {
    this.spine = this.character.spine;
    this.updateSkin();
};

// update code called every frame
CustomizeSkin.prototype.update = function (dt) {

};

CustomizeSkin.prototype.updateSkin = function(){
  console.log(this.spine.skeleton.data.findSkin("default"));
};

// swap method called for script hot-reloading
// inherit your script state here
// CustomizeSkin.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// animateImage.js
var AnimateImage = pc.createScript('animateImage');

AnimateImage.attributes.add('image', { type: 'entity', title: 'Image' });
AnimateImage.attributes.add('textures', { type: 'asset', assetType: 'sprite', array: true });
AnimateImage.attributes.add('delay', { type: 'number', title: 'Delay' });
// initialize code called once per entity
AnimateImage.prototype.initialize = function () {
    this.on('enable', this.onEnable, this);
    this.onEnable();
};

AnimateImage.prototype.onEnable = function () {
    this.timer = this.delay;
    this.currentIndex = 0;
    this.image.element.sprite = this.textures[this.currentIndex].resource;
}

// update code called every frame
AnimateImage.prototype.update = function (dt) {
    this.timer -= dt;
    if (this.timer < 0) {
      //  console.log("Switch");
        this.image.element.sprite = this.textures[this.currentIndex].resource;
        this.currentIndex++;
        if (this.currentIndex >= this.textures.length) {
            this.currentIndex = 0;
        }
        this.timer = this.delay;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// AnimateImage.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// ThemeController.js
var ThemeController = pc.createScript('themeController');

ThemeController.attributes.add('bg', { type: 'entity', title: 'Background Screen' });

ThemeController.attributes.add('defaultTexture', {
    title: 'Default Texture',
    type: 'json',
    schema: [
        { name: 'pageID', type: 'number', title: 'Page ID', default: 0 },
        { name: 'itemID', type: 'number', title: 'Item ID', default: 3 },
    ]
})

ThemeController.attributes.add('refs', {
    title: 'References',
    type: 'json',
    schema: [
        { name: 'currentSky', type: 'entity', title: 'Sky' },
        { name: 'mat', type: 'asset', assetType: 'material', title: 'Model Material' },
        { name: 'flashMat', type: 'asset', assetType: 'material', title: 'Flash Model Material' },
        { name: 'bg', type: 'entity', title: "Backgrounds", array: true },
        { name: 'duplicateBG', type: 'entity', title: 'Duplicate Background', array: true },
        { name: 'textBG', type: 'entity', title: 'Text' }
    ],
});
ThemeController.attributes.add('textures', {
    title: 'Themes',
    type: 'json',
    schema: [
        { name: 'pos', type: 'vec3', title: 'Theme Position' },
        { name: 'phonePos', type: 'vec3', title: 'Theme Phone Position' },
        { name: 'offset', type: 'vec2', title: 'offset' },
        { name: 'box', type: 'asset', assetType: 'texture', title: 'Box Texture' },
        { name: 'sky', type: 'asset', assetType: 'texture', title: 'Sky' },
        { name: 'bg', type: 'asset', assetType: 'texture', title: 'Background', array: true },
        { name: 'doDuplicate', type: 'boolean', title: 'Duplicate Background', array: true },
        { name: 'isFixed', type: 'boolean', title: 'Is Fixed', array: true },
        { name: 'bgOffsets', type: 'vec2', title: 'Background Offsets', array: true },
        { name: 'duplicateBG', type: 'asset', assetType: 'texture', title: 'Duplicate Background' },
        { name: 'textBG', type: 'asset', assetType: 'texture', title: 'Text Background' },
        { name: 'textPos', type: 'number', title: 'Text Position' },
        { name: 'color', type: 'rgba', title: 'Background Color', array: true }
    ],
    array: true
});

// initialize code called once per entity
ThemeController.prototype.initialize = function () {
    ThemeController.Instance = this;
    this.app.on('Show:ThemePanel', this.themePanel, this);
    this.app.on('Theme:UpdateTexture', this.updateTexture, this);
    this.app.on('Theme:UpdateBox', this.updateBoxTexture, this);
    this.app.on('Theme:SetDefault', this.setDefaultTheme, this);
    this.app.on('Theme:CheckFixed', this.checkFixedBackgrounds, this);
    this.currentIndex = (this.defaultTexture.pageID * 8) + this.defaultTexture.itemID;
    this.nextIndex = this.currentIndex;
    this.currentBox = this.currentIndex;
    this.isBooted = false;
};

ThemeController.prototype.postInitialize = function () {

};
// update code called every frame
ThemeController.prototype.update = function (dt) {

};

ThemeController.prototype.setDefaultTheme = function (currTheme, currBox) {
    // console.log('Default Theme Loading', currTheme, currBox);
    // console.log("Default index: ", currTheme);
    let themeIndex = currTheme != null ? (currTheme.pageID * 8) + currTheme.itemID : (this.defaultTexture.pageID * 8) + this.defaultTexture.itemID;
    this.currentIndex = themeIndex;
    this.updateTexture(currTheme.pageID, currTheme.itemID);
    this.updateBoxTexture(currBox.pageID, currBox.itemID);
};

ThemeController.prototype.checkFixedBackgrounds = function (onComplete) {
    let index = this.currentIndex;
    let isFixed = false;
    for (let i = 0; i < this.textures[index].isFixed.length; i++) {
        if (this.textures[index].isFixed[i]) {
            this.app.fire('Gameplay:FixedToCamera', onComplete);
            isFixed = true;
        }
    }
    if (!isFixed) {
        if (onComplete) onComplete();
    }
};


ThemeController.prototype.themePanel = function () {
    this.app.fire('Update:CostumePanel', 1);
};

ThemeController.prototype.updateTexture = function (pageID, itemID) {
    if (this.textures.length < 0) return;
    DataManager.Instance.currentTheme.pageID = pageID;
    DataManager.Instance.currentTheme.itemID = itemID;
    // console.log('ThemeController:UpdateTexture: ', DataManager.Instance.currentTheme);
    DataManager.Instance.setData();
    let index = (pageID * 8) + itemID;
    // console.log("INDEX: ", index, this.currentIndex);
    this.nextIndex = index;
    if (this.currentIndex != this.nextIndex) {
        this.app.fire('Loading:Start', 0.7);
        this.app.fire('Assets:Count', [this.nextIndex], () => this.app.fire('Assets:Load', this.nextIndex, this.placeTextures.bind(this)));
    }
    else
        this.app.fire('Assets:Load', this.nextIndex, this.placeTextures.bind(this));
};

ThemeController.prototype.updateBoxTexture = function (pageID, itemID) {
    DataManager.Instance.currentBox.pageID = pageID;
    DataManager.Instance.currentBox.itemID = itemID;
    DataManager.Instance.setData();
    // console.log('ThemeController:UpdateBoxTexture: ', DataManager.Instance.currentBox);
    let index = (pageID * 8) + itemID;
    // console.log("Index: ", index, pageID, itemID);
    let material = this.refs.mat.resource;
    // console.log("Material: ", material, this.textures[index].box.resource);
    material.diffuseMap = this.textures[index].box.resource;
    material.update();

    material = this.refs.flashMat.resource;
    material.diffuseMap = this.textures[index].box.resource;
    material.update();
};

ThemeController.prototype.placeTextures = function () {
    //  this.updateBoxTexture(this.nextIndex);
    this.refs.currentSky.element.texture = this.textures[this.nextIndex].sky.resource;
    this.updateBackground(this.nextIndex);
    let newPos = pc.platform.desktop ? this.textures[this.nextIndex].pos : this.textures[this.nextIndex].phonePos;
    this.bg.setLocalPosition(newPos.x, newPos.y, newPos.z);
    if (this.currentIndex != this.nextIndex)
        this.app.fire('Assets:unLoad', this.currentIndex, () => this.app.fire('Loading:Stop'));
    else {
        // // console.log('Loading Home Menu from Theme Controller');
        this.app.fire('Loading:Stop', this.loadHomeMenu.bind(this));
    }
    this.currentIndex = this.nextIndex;
}

ThemeController.prototype.loadHomeMenu = function () {
    if (this.isBooted) return;
    this.isBooted = true;

    let isMobileSdk = SdkManager.Instance.isCurrentSDK([2]);
    let isFirstTimeOpened = DataManager.Instance.firstTimeOpened;
    console.log('ThemeController:loadHomeMenu: ', isMobileSdk, isFirstTimeOpened);
    if (isMobileSdk && isFirstTimeOpened) {
        MenuManager.Instance.changeState(MenuManager.States.TCMenu);
    }
    else {
        MenuManager.Instance.changeState(MenuManager.Instance.currentPanel);
        this.app.fire('HomeMenu:UpdateValues');
    }
};


ThemeController.prototype.updateBackground = function (index) {
    let size = this.refs.bg.length - 1;
    for (let i = 0; i <= size; i++) {
        if (i >= this.textures[index].bg.length) this.refs.bg[i].enabled = false;
        else {
            this.updateBackgroundChildren(this.refs.bg[i], this.textures[index].doDuplicate[i], this.textures[index].bg[i].resource, this.textures[index].offset.x, this.textures[index].color[i], undefined, undefined, this.textures[index].bgOffsets[i].y, this.textures[index].bgOffsets[i].x);
            this.refs.bg[i].enabled = true;
        }
    }
    if (this.textures[index].duplicateBG) {
        for (let i = 0; i < 5; i++) {
            this.refs.duplicateBG[i].enabled = true;
            // let posY = (this.textures[index].duplicateBG.resource.height / 40 - this.textures[index].offset.y) * (i + 1);
            let pos = this.refs.duplicateBG[i].getLocalPosition();
            // this.refs.duplicateBG[i].setLocalPosition(pos.x, pos.y, pos.z);
            this.updateBackgroundChildren(this.refs.duplicateBG[i], true, this.textures[index].duplicateBG.resource, this.textures[index].offset.x, undefined, pos.y, undefined, 0);
        }
    }
    else {
        for (let i = 0; i < 5; i++) {
            this.refs.duplicateBG[i].enabled = false;
        }
    }
    if (this.textures[index].textBG) {
        this.refs.textBG.enabled = true;
        this.updateBackgroundChildren(this.refs.textBG, true, this.textures[index].textBG.resource, this.textures[index].offset.x, undefined, undefined, this.textures[index].textPos, 0);
    }
    else {
        this.refs.textBG.enabled = false;
    }
};

ThemeController.prototype.updateBackgroundChildren = function (entity, doDuplicate, texture, offset, color, posY, posZ, offsetY, offsetX) {
    let size = entity.children.length;
    if (posY) size++;
    let diff = 0;
    let count = 1;
    let isLeft = true;
    diff = (texture.width / 40) - offset;


    entity.children[0].enabled = true;
    entity.children[0].element.texture = texture;
    entity.children[0].element.width = texture.width;
    entity.children[0].element.height = texture.height;

    // // // console.log('DIff: ', diff);
    let pos = entity.children[0].getLocalPosition();
    //  pos.y = posY === undefined ? pos.y : posY;
    pos.z = posZ === undefined ? pos.z : posZ;
    let newY = offsetY !== 0 && offsetY !== undefined ? 4 + offsetY : 4;
    let newX = offsetX !== 0 && offsetX !== undefined ? 0 + offsetX : 0;
    entity.children[0].setLocalPosition(newX, newY, pos.z);

    for (let i = 1; i < size - 1; i++) {
        entity.children[i].enabled = doDuplicate;
        if (!doDuplicate) continue;
        if (i >= size / 2 && isLeft) {
            isLeft = false;
            count = 1;
            diff = Math.abs(diff) * -1;
        }
        entity.children[i].element.opacity = 1;
        entity.children[i].element.texture = texture;
        entity.children[i].element.width = texture.width;
        entity.children[i].element.height = texture.height;

        pos = entity.children[i].getLocalPosition();
        // pos.y = posY === undefined ? pos.y : posY;
        pos.z = posZ === undefined ? pos.z : posZ;
        entity.children[i].setLocalPosition(newX + (-diff * count++), newY, pos.z);
    }
    if (color) {
        entity.children[size - 1].element.color = color;
    }
};
// swap method called for script hot-reloading
// inherit your script state here
// ThemeController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// costumeManager.js
var CostumeManager = pc.createScript('costumeManager');

// initialize code called once per entity
CostumeManager.prototype.initialize = function () {
    this.app.on('Show:CostumePanel', this.costumePanel, this);
    this.app.on('Costume:UpdateShirt', this.updateShirt, this);
    this.app.on('Costume:UpdateHat', this.updateHat, this);
};

// update code called every frame
CostumeManager.prototype.update = function (dt) {

};



CostumeManager.prototype.costumePanel = function () {
    console.log("SHOP");
    this.app.fire('Update:CostumePanel', 2);
};

// swap method called for script hot-reloading
// inherit your script state here
// CostumeManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// AssetLoader.js
var AssetLoader = pc.createScript('assetLoader');

AssetLoader.attributes.add('tags', { type: 'string', title: 'Tags', array: true });

// initialize code called once per entity
AssetLoader.prototype.initialize = function () {
    //  this.loadAssets(0);
    this.app.on('Assets:Load', this.loadAssets, this);
    this.app.on('Assets:unLoad', this.unloadAssets, this);
    this.app.on('Assets:Count', this.getAssetsCount, this);
    this.totalCount = 1;
    this.totalLoaded = 0;
};

// update code called every frame
AssetLoader.prototype.update = function (dt) {

};

AssetLoader.prototype.getAssetsCount = function (indexes, onComplete) {
    let tags = []
    this.totalCount = 0;
    this.totalLoaded = 0;
    for (let i = 0; i < indexes.length; i++) {
        tags[i] = this.tags[indexes[i]];
    }
    for (let i = 0; i < tags.length; i++) {
        let assests = this.app.assets.findByTag(tags[i]);
        this.totalCount += assests.length;
    }
    if (onComplete) onComplete();
}


AssetLoader.prototype.loadAssets = function (index, onComplete) {
    var tag = this.tags[index];
  // console.log('1122: Loading asset tag: ', tag);
    var assets = this.app.assets.findByTag(tag);
   // console.log(assets);
    var assetsLoaded = 0;
    var assestTotal = assets.length;
    var app = this.app;
    var self = this;


    // Callback function when an asset is loaded
    var onAssetReady = function () {
        assetsLoaded += 1;
        self.totalLoaded += 1;
        let percent = (self.totalLoaded / self.totalCount) * 100;
        //  console.log("234:Assets Loaded: ", percent, self.totalCount, self.totalLoaded);
        app.fire('Loading:Percentage', Math.floor(percent));
        // Once we have loaded all the assets
        if (assetsLoaded === assestTotal) {
         //   console.log("LOADED");
            if (onComplete) onComplete();
            // self.onAssetsLoaded(tag);
        }

    };

    // Start loading all the assets
    for (var i = 0; i < assets.length; i++) {
        //  console.log('Loading Asset....', i, " ", assets[i]);
        if (assets[i].resource) {
            onAssetReady();
        } else {
            assets[i].ready(onAssetReady);
            this.app.assets.load(assets[i]);
        }
    }
};

AssetLoader.prototype.unloadAssets = function (index, onComplete) {
    var tag = this.tags[index];
    var assets = this.app.assets.findByTag(tag);
    assets.forEach(function (asset) {
        //  console.warn("Asset unloading: ", tag, asset);
        asset.unload();
    });
    if (onComplete) {
        //   console.log("OnComplete: ", onComplete);
        onComplete();
    }

};

// swap method called for script hot-reloading
// inherit your script state here
// AssetLoader.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// graphicManager.js
var GraphicManager = pc.createScript('graphicManager');

GraphicManager.attributes.add('qualityDecrement', { type: 'number', title: 'Quality Decrement'});
GraphicManager.attributes.add('minFPS', { type: 'number', title: 'Min FPS'});
GraphicManager.attributes.add('decreaseDelay', { type: 'number', title: 'Decrease Delay'});
GraphicManager.attributes.add('startDelay', { type: 'number', title: 'Start Delay'});

// initialize code called once per entity
GraphicManager.prototype.initialize = function () {
    // this.manageDevicePixelRatio();
    this.entity.on('OnFpsTick', fps => this.fps = fps);
    this.devicePixelRatio = window.devicePixelRatio;

    this.timer = this.decreaseDelay;
    this.startTimer = this.startDelay;
    this.isFocused = true;

    window.addEventListener("blur", this.onfocus.bind(this, false));
    window.addEventListener("focus", this.onfocus.bind(this, true));
};

GraphicManager.prototype.onfocus = function (focusGained) {
    this.isFocused = focusGained;
    this.startTimer = this.startDelay;
    console.log('onfocus: ', this.startTimer, this.isFocused);
};

// update code called every frame
GraphicManager.prototype.update = function (dt) {
    if (!this.isFocused) return;
    this.startTimer -= dt;
    if (this.startTimer > 0) return;

    if (this.timer <= 0) return;
    this.timer -= dt;
    if (this.fps && this.timer <= 0) {
        this.timer = this.decreaseDelay;
        // console.log('fps: ', this.fps, this.minFPS);
        if (this.fps < this.minFPS) {
            this.devicePixelRatio -= this.qualityDecrement;
            pc.Application.getApplication().graphicsDevice.maxPixelRatio = this.devicePixelRatio;
            console.log('devicePixelRatio: ', this.devicePixelRatio, this.qualityDecrement);
        }
    }
};

GraphicManager.prototype.manageDevicePixelRatio = function () {
    let device = pc.Application.getApplication().graphicsDevice;
    let renderer = pc.Application.getApplication().graphicsDevice.unmaskedRenderer;

    if (this.isLowQualityDevice(renderer)) {
        // Use the default device pixel ratio of the device
        device.maxPixelRatio = 1;
    } else {
        // Use the CSS resolution device pixel ratio
        device.maxPixelRatio = window.devicePixelRatio;
    }

};

GraphicManager.prototype.isLowQualityDevice = function (renderer) {

    // Only check the GPU if we are on mobile
    if (renderer && pc.platform.mobile) {
        // low level GPU's
        if (renderer.search(/Adreno\D*3/) !== -1 ||
            renderer.search(/Adreno\D*4/) !== -1 ||
            renderer.search(/Adreno\D*505/) !== -1 ||
            renderer.search(/Adreno\D*506/) !== -1 ||
            renderer.search(/Mali\D*4/) !== -1 ||
            renderer.search(/Mali\D*5/) !== -1 ||
            renderer.search(/Mali\D*6/) !== -1 ||
            renderer.search(/Mali\D*T7/) !== -1 ||
            renderer.search(/Mali\D*T82/) !== -1 ||
            renderer.search(/Mali\D*T83/) !== -1) {
            return true;
        }
    }
    return false;
};

// swap method called for script hot-reloading
// inherit your script state here
// GraphicManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// DeviceChecker.js
var DeviceChecker = pc.createScript('deviceChecker');

// initialize code called once per entity
DeviceChecker.prototype.initialize = function () {
    this.app.deviceType = {
        Low: "Low",
        Mid: "Mid",
        High: "High",
        None: "None",
    };

    let deviceType = this.getDeviceType();
    let currentDevicePixelRatio = window.devicePixelRatio;

    // Set the pixel ratio according to the GPU detected
    if (pc.platform.mobile) {
        if (deviceType === this.app.deviceType.Low)
            this.app.graphicsDevice.maxPixelRatio = Math.min(currentDevicePixelRatio, 1);
        else if (deviceType === this.app.deviceType.Mid)
            this.app.graphicsDevice.maxPixelRatio = Math.min(currentDevicePixelRatio, 1.5);
        else
            this.app.graphicsDevice.maxPixelRatio = Math.min(currentDevicePixelRatio, 2);
    }
};

// update code called every frame
DeviceChecker.prototype.update = function (dt) {

};

DeviceChecker.prototype.getDeviceType = function () {
    var renderer = pc.Application.getApplication().graphicsDevice.unmaskedRenderer;

    // Android:

    // Adreno:
    // 6xx series are High End Ref: https://en.wikipedia.org/wiki/Adreno, 605 is the first in the series
    // 5xx series are mostly low end but some like 540 and 530 are used in mid range phones
    // 4xx and 3xx series are low end GPU's

    // Mali:
    // Ref: https://en.wikipedia.org/wiki/Mali_(GPU) for GPU and release date


    // iphones:
    // Todo: Detect low, mid and high end iphones

    // Only check the GPU if we are on mobile
    if (renderer && pc.platform.mobile) {
        // low level GPU's
        if (renderer.search(/Adreno\D*3/) !== -1 ||
            renderer.search(/Adreno\D*4/) !== -1 ||
            renderer.search(/Adreno\D*505/) !== -1 ||
            renderer.search(/Adreno\D*506/) !== -1 ||
            renderer.search(/Mali\D*2/) !== -1 ||
            renderer.search(/Mali\D*3/) !== -1 ||
            renderer.search(/Mali\D*4/) !== -1 ||
            renderer.search(/Mali\D*5/) !== -1 ||
            renderer.search(/Mali\D*6/) !== -1 ||
            renderer.search(/Mali\D*T6/) !== -1 ||
            renderer.search(/Mali\D*T7/) !== -1 ||
            renderer.search(/Mali\D*T82/) !== -1 ||
            renderer.search(/Mali\D*T83/) !== -1 ||
            renderer.search(/Mali\D*T86/) !== -1 ||
            renderer.search(/Adreno\D*508/) !== -1 ||
            renderer.search(/Adreno\D*512/) !== -1 ||
            renderer.search(/Adreno\D*510/) !== -1 ||
            renderer.search(/Adreno\D*509/) !== -1

        ) {
            return this.app.deviceType.Low;
        } else
            if (renderer.search(/Adreno\D*540/) !== -1 ||
                renderer.search(/Adreno\D*530/) !== -1 ||
                renderer.search(/Adreno\D*530/) !== -1 ||
                renderer.search(/Mali\D*T88/) !== -1 ||
                renderer.search(/Mali\D*G71/) !== -1 ||
                renderer.search(/Mali\D*G52/) !== -1 ||
                renderer.search(/Mali\D*G72/) !== -1

            ) {
                return this.app.deviceType.Mid;
            }
    }

    return this.app.deviceType.High;
};

// swap method called for script hot-reloading
// inherit your script state here
// DeviceChecker.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// sdkManager.js
var SdkManager = pc.createScript('sdkManager');

SdkManager.attributes.add('test', {
    title: 'Test Settings',
    type: 'json',
    schema: [
        { name: 'isEditor', type: 'boolean', title: 'Editor Mode' },
        { name: 'isSuccessful', type: 'boolean', title: 'Successful Test' },
    ],
});


SdkManager.attributes.add('currentSdk', {
    type: 'number',
    title: 'Current SDK',
    enum: [
        { 'Facebook': 0 },
        { 'GameDistribution': 1 },
        { 'Android/iOS': 2 },
    ],
});

SdkManager.attributes.add('sdks', { type: 'entity', title: 'SDKs', array: true });

// ************************
// * Playcanvas Callbacks *
// ************************

// initialize code called once per entity
SdkManager.prototype.initialize = function () {
    SdkManager.Instance = this;

    console.log('Is Android: ', pc.platform.android);
    console.log('Is iOS: ', pc.platform.ios);
    console.log('Platform: ', pc.platform);
    this.initVars();
    this.registerEvents();
};

SdkManager.prototype.postInitialize = function () {
    this.initAPI();
};

// **********************
// * initialize Helpers *
// **********************

SdkManager.prototype.initVars = function () {
    this.challengeMode = false;
    this.tournamentMode = false;
    this.entryData = null;
    this.isRewarededAdLoaded = false;
    this.isVibrationOn = true;
};

SdkManager.prototype.registerEvents = function () {
    // Ads
    this.app.on('SdkManager:ShowAd', this.showAd, this);
    this.app.on('SdkManager:RewaredAdLoaded', this.onRewaredAdLoaded, this);

    // IAP
    this.app.on('SdkManager:inAppCatalog', this.inAppCatalog, this);
    this.app.on('SdkManager:inAppPurchase', this.inAppPurchase, this);
    this.app.on('SdkManager:GetProductInfo', this.getProductInfo, this);
    this.app.on('SdkManager:IapRestore', this.iapRestore, this);
    this.entity.on('StoreReady', this.onStoreReady, this);

    // Social
    this.app.on('SdkManager:Sharing', this.sharing, this);
    this.app.on('SdkManager:InviteFriends', this.inviteFriends, this);
    this.app.on('SdkManager:CreateTournament', this.createTournament, this);
    this.app.on('SdkManager:UpdateVSMode', this.updateVSMode, this);
    this.app.on('SdkManager:CheckVSmode', this.checkVSmode, this);
    this.app.on('SdkManager:ChallengeFriend', this.challengeFriend, this);
    this.app.on('SdkManager:SetChallenge', this.setChallenge, this);
    this.app.on('SdkManager:ShowLeaderboard', this.showLeaderboard, this);
    this.app.on('SdkManager:SubmitLeaderboardScore', this.submitLeaderboardScore, this);

    // Data
    this.app.on('SdkManager:SetScore', this.setPlayerScore, this);
    this.app.on('SdkManager:StoreData', this.storeData, this);
    this.app.on('SdkManager:GetData', this.getData, this);
    this.app.on('SdkManager:GetEntryData', this.getEntryData, this);

    // Misc
    this.app.on('SdkManager:Vibrate', this.vibrate, this);
    this.app.on('SdkManager:IsCurrentSDK', this.isCurrentSDK, this);
    this.app.on('SdkManager:UserConsent', this.userConsent, this);
    this.app.on('SdkManager:RequestPermission', this.requestPermission, this);
    this.app.on('SdkManager:FirebaseReporting', this.requestFirebaseReport, this);

    if (this.test.isEditor && this.test.isSuccessful)
        this.onRewaredAdLoaded(true);
};

SdkManager.prototype.initAPI = function () {
    this.sdks[this.currentSdk].fire('Initialise:API', this.test, () => {
        this.getData((data, message) => this.app.fire('DataManager:OnDataFetched', data, message));
    });
};


// ****************
// * Ad Functions *
// ****************

SdkManager.prototype.showAd = function (adType, callback, enable, forSdks) {
    console.log('SdkManager:showAd: ', adType, DataManager.Instance.isOfferPurchased);
    enable = enable === undefined ? true : enable;
    if (this.notForThisSdk(forSdks) || this.isNoAdsPurchased(adType, callback, enable)) return;
    this.sdks[this.currentSdk].fire('Show:Ad', adType, this.test, callback, enable);
};

SdkManager.prototype.onRewaredAdLoaded = function (isLoaded) {
    console.log('SdkManager:onRewaredAdLoaded: ', isLoaded);
    this.isRewarededAdLoaded = isLoaded;
};

SdkManager.prototype.onAdsInitialized = function () {
    this.app.fire('SdkManager:OnAdsInitialized');
};

SdkManager.prototype.notForThisSdk = function (forSdks) {
    if (forSdks) {
        for (let i = 0; i < forSdks.length; i++) {
            console.log('SdkManager:notForThisSdk: ', forSdks[i], ' === ', this.currentSdk);
            if (forSdks[i] === this.currentSdk)
                return false;
        }

        return true;
    }

    return false;
};

SdkManager.prototype.isNoAdsPurchased = function (adType, callback, enable) {
    let isSpcialOfferPurchased = DataManager.Instance.isOfferPurchased;
    let isRewardedAd = adType != 'Rewarded';
    console.log('SdkManager:isNoAdsPurchased: ', adType, enable);
    if (enable && isSpcialOfferPurchased && isRewardedAd) {
        if (callback) callback(null);
        return true;
    }

    return false;
};

// **********************
// * IAP Functions *
// **********************

SdkManager.prototype.inAppCatalog = function (callback) {
    this.sdks[this.currentSdk].fire('App:ShowCatalog', this.test, callback);
};

SdkManager.prototype.inAppPurchase = function (callback) {
    this.sdks[this.currentSdk].fire('App:Purchase', this.test, callback);
};

SdkManager.prototype.getProductInfo = function (callback) {
    this.sdks[this.currentSdk].fire('App:ProductInfo', this.test, callback);
};

SdkManager.prototype.iapRestore = function (callback) {
    this.sdks[this.currentSdk].fire('App:IapRespre', this.test, callback);
};

SdkManager.prototype.onStoreReady = function (isStoreReady) {
    this.app.fire('SdkManager:StoreReady', isStoreReady)
};


// **********************
// * Social Functions *
// **********************

SdkManager.prototype.sharing = function (callback) {
    this.sdks[this.currentSdk].fire('Share:Image', this.test, callback);
};

SdkManager.prototype.inviteFriends = function (callback) {
    this.sdks[this.currentSdk].fire('Friends:Invite', this.test, callback);
};

SdkManager.prototype.createTournament = function (callback) {
    if (this.test.isEditor) {
        return;
    }
    this.sdks[this.currentSdk].fire('Tournament:Create', this.test, callback);
};

SdkManager.prototype.updateVSMode = function (status) {
    this.challengeMode = status;
};

SdkManager.prototype.checkVSmode = function () {
    if (this.test.isEditor) return;
    this.sdks[this.currentSdk].fire('Check:VSmode');
}

SdkManager.prototype.challengeFriend = function (callback) {
    this.sdks[this.currentSdk].fire('Friends:Challenge', this.test, callback);
};

SdkManager.prototype.setChallenge = function () {
    if (this.challengeMode && this.entryData && this.entryData.mode == "VS") {
        this.app.fire('FriendChallenge:NewChallenge', this.entryData.name, this.entryData.score);
    }
    else if (this.test.isEditor && !this.test.isSuccessful) {
        this.app.fire('FriendChallenge:NewChallenge', "Usama", 5);
    }
};

SdkManager.prototype.showLeaderboard = function (callback) {
    this.sdks[this.currentSdk].fire('Leaderboard:Show', this.test, callback);
};

SdkManager.prototype.submitLeaderboardScore = function (score) {
    console.log('SdkManager:SubmitScore: ', score);
    this.sdks[this.currentSdk].fire('Leaderboard:SubmitScore', this.test, score);
};


// **********************
// * Data Functions *
// **********************

SdkManager.prototype.setPlayerScore = function (newScore) {
    this.sdks[this.currentSdk].fire('Tournament:SetScore', this.test, newScore);
};

SdkManager.prototype.storeData = function (data, callback) {
    this.sdks[this.currentSdk].fire('Data:Set', this.test, data, callback);
};

SdkManager.prototype.getData = function (callback) {
    this.sdks[this.currentSdk].fire('Data:Get', this.test, callback);
};

SdkManager.prototype.getEntryData = function (callback) {
    this.sdks[this.currentSdk].fire('Get:EntryData', this.test, callback);
};

// **********************
// * Misc Functions *
// **********************

SdkManager.prototype.vibrate = function () {
    if (this.isVibrationOn)
        this.sdks[this.currentSdk].fire('Haptic:Feedback', this.test);
}

SdkManager.prototype.isCurrentSDK = function (sdkIndeces, callback) {
    let result = false;

    for (let i = 0; i < sdkIndeces.length; i++) {
        if (sdkIndeces[i] === this.currentSdk) {
            result = true;
            break;
        }
    }

    if (callback) callback(result);
    return result;
};


SdkManager.prototype.userConsent = function (isAccept) {
    console.log('SdkManager:userConsent: ', isAccept);
    this.sdks[this.currentSdk].fire('UserConsent', isAccept);
};

SdkManager.prototype.requestPermission = function (callback) {
    console.log('SdkManager:requestPermission');
    this.sdks[this.currentSdk].fire('RequestPermission', this.test, callback);
};

SdkManager.prototype.requestFirebaseReport = function (isAllowed) {
    this.sdks[this.currentSdk].fire('RequestFirebase', isAllowed, this.test);
};

// facebookManager.js
var FacebookManager = pc.createScript('facebookManager');
// <script src='https://connect.facebook.net/en_US/fbinstant.7.1.js'></script>

FacebookManager.attributes.add('adHandler', { type: 'entity', title: 'Ad Handler' });
FacebookManager.attributes.add('dataHandler', { type: 'entity', title: 'Data Handler' });
FacebookManager.attributes.add('inviteHandler', { type: 'entity', title: 'Invite Handler' });
FacebookManager.attributes.add('tournamentHandler', { type: 'entity', title: 'Tournament Handler' });
FacebookManager.attributes.add('iAPHandler', { type: 'entity', title: 'IAP Handler' });
FacebookManager.attributes.add('sharingHandler', { type: 'entity', title: 'Sharing Handler' });

// ************************
// * Playcanvas Callbacks *
// ************************

FacebookManager.prototype.initialize = function () {
        this.supportedAPIs = null;
        this.registerEvents();
};

// **********************
// * initialize Helpers *
// **********************

FacebookManager.prototype.registerEvents = function () {
        // Initialise
        this.entity.on('Initialise:API', this.initAPI, this);

        // Ads
        this.entity.on('Show:Ad', this.showAd, this);
        this.entity.on('RewaredAdLoaded', this.onRewaredAdLoaded, this);
        
        // IAP
        this.entity.on('App:ShowCatalog', this.showCatalog, this);
        this.entity.on('App:Purchase', this.purchase, this);
        
        // Socials
        this.entity.on('Share:Image', this.sharing, this);
        this.entity.on("Friends:Invite", this.inviteFriends, this);
        this.entity.on("Friends:Challenge", this.challengeFriend, this);
        this.entity.on('Tournament:Create', this.createTournament, this);
        this.entity.on('Tournament:Join', this.joinTournament, this);
        this.entity.on('Check:VSmode', this.checkVSmode, this);

        // Data
        this.entity.on('Tournament:SetScore', this.setPlayerScore, this);
        this.entity.on('Data:Set', this.setData, this);
        this.entity.on('Data:Get', this.getData, this);
        this.entity.on('EntryData:Get', this.getEntryData, this);
        
        // Misc
        this.entity.on('Haptic:Feedback', this.vibrate, this);
};

FacebookManager.prototype.initAPI = function (testSettings, callback) {
        console.log('Initialising Facebook Manager');
        this.adHandler.fire('SdkManager:EditorMode', testSettings.isEditor);
        if (!testSettings.isEditor) {
                this.supportedAPIs = FBInstant.getSupportedAPIs();
                this.checkContext();
              //  console.log('Supported APIs: ', this.supportedAPIs);
                this.adHandler.fire('Ads:Preload');
                console.log('Facebook:Preloading Ads');
        }

        if (callback) callback();
};

FacebookManager.prototype.checkContext = function () {
        let contextType = FBInstant.context.getType();
        console.log('FacebookManager:ContextType: ', contextType);
        if (contextType == 'THREAD') {
                let data = FBInstant.getEntryPointData();
                SdkManager.Instance.entryData = data;
                if (data && data.mode === 'VS') {
                        if (!data.isGameEnded) {
                                this.app.fire('GameManager:UpdateMissions', true);
                                this.app.fire('SdkManager:UpdateVSMode', true);
                        }
                }
                else {
                        SdkManager.Instance.tournamentMode = true;
                }
                console.log('FacebookManager:EntryData: ', SdkManager.Instance.entryData);
        }

        if (SdkManager.Instance.entryData != null) {
                console.log('FacebookManager:CheckContext:EntryData: ', SdkManager.Instance.entryData);
                if (SdkManager.Instance.entryData.isGameEnded || SdkManager.Instance.entryData.name === FBInstant.player.getName()) {
                        FBInstant.context.switchAsync('SOLO', true).then(() => {
                                this.app.fire('GameManager:UpdateMissions', false);
                                this.app.fire('SdkManager:UpdateVSMode', false);
                                SdkManager.Instance.tournamentMode = false;
                                SdkManager.Instance.entryData = null;
                                console.log('FacebookManager:Successfully switched back to context: ', FBInstant.context.getType());
                        }).catch(err => {
                                console.log('FacebookManager:Failed to switch back to old context: ', err);
                        })
                }
        }
};

// **********************
// * Ad Functions *
// **********************

FacebookManager.prototype.showAd = function (adType, testSettings, callback, enable) {
        console.log('FacebookManager:showAd: ', adType, testSettings);
        this.adHandler.fire('Show:Ad', adType, testSettings, callback, enable)
};

FacebookManager.prototype.onRewaredAdLoaded = function (isLoaded) {
        this.app.fire('SdkManager:RewaredAdLoaded', isLoaded);
};

// **********************
// * IAP Functions *
// **********************

FacebookManager.prototype.showCatalog = function (testSettings, callback) {
        this.iAPHandler.fire('ShowCatalog', testSettings, callback);
};

FacebookManager.prototype.purchase = function (product_id, testSettings, callback) {
        this.iAPHandler.fire('Purchase', product_id, testSettings, callback);
};

// **********************
// * Social Functions *
// **********************

FacebookManager.prototype.sharing = function (testSettings, callback) {
        this.sharingHandler.fire('Share', testSettings, callback);
};

FacebookManager.prototype.inviteFriends = function (testSettings, callback) {
        console.log('FacebookManager:Invite');
        this.inviteHandler.fire('InviteFriends', testSettings, callback);
};

FacebookManager.prototype.challengeFriend = function (testSettings, callback) {
        console.log('FacebookManager:ChallengeFriend');
        if (SdkManager.Instance.challengeMode)
                this.inviteHandler.fire('ChallengeMessage', testSettings, callback);
}

FacebookManager.prototype.createTournament = function (testSettings, callback) {
        this.tournamentHandler.fire('Tournament:Create', testSettings, callback);
};

FacebookManager.prototype.joinTournament = function (testSettings, callback) {
        this.tournamentHandler.fire('Tournament:Join', testSettings, callback);
};

FacebookManager.prototype.checkVSmode = function () {
        console.log('CheckVSmode: ', SdkManager.Instance.entryData);
        if (SdkManager.Instance.challengeMode && SdkManager.Instance.entryData && SdkManager.Instance.entryData.mode == "VS") {
                if (!SdkManager.Instance.entryData.isGameEnded && SdkManager.Instance.entryData.name !== FBInstant.player.getName()) {
                        this.app.fire('Show:Loading', () => this.app.fire('HomeMenu:OnClick', 'Play'), "Loading VS Mode...", 3);
                }
        }
};

// **********************
// * Data Functions *
// **********************

FacebookManager.prototype.setPlayerScore = function (testSettings, newScore) {
        console.log("FacebookManager:SetPlayerScore", newScore);
        this.tournamentHandler.fire('Tournament:SetScore', testSettings, newScore);
};

FacebookManager.prototype.setData = function (testSettings, data, callback) {
        this.dataHandler.fire('Data:Set', testSettings, data, callback);
};

FacebookManager.prototype.getData = function (testSettings, callback) {
        this.dataHandler.fire('Data:Get', testSettings, callback);
};

FacebookManager.prototype.getEntryData = function (testSettings, callback) {
        if (testSettings && testSettings.isEditor) {
                if (callback) callback(null);
                return;
        }

        let data = FBInstant.getEntryPointData();
        console.log('FacebookManager:EntryData: ', data);
        if (callback) callback(data);
};

// **********************
// * Misc Functions *
// **********************

FacebookManager.prototype.vibrate = function (testSettings) {
        if (testSettings.isEditor) return;
        FBInstant.performHapticFeedbackAsync()
                .then(() => {
                }).catch(err => console.log(err));
}


// FacebookManager.prototype.getLeaderBoard = function (testSettings, callback) {
//         console.log('FacebookManager:getleaderboard');
//         this.app.fire('FacebookTournament:GetLeaderBoard', testSettings, callback);
// };



// swap method called for script hot-reloading
// inherit your script state here
// FacebookManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// facebookAdHandler.js
var FacebookAdHandler = pc.createScript('facebookAdHandler');

FacebookAdHandler.attributes.add('manager', { type: 'entity', title: 'FB Manager' });

FacebookAdHandler.attributes.add('adID', {
    title: 'Ad IDs',
    type: 'json',
    schema: [
        { name: 'banner', type: 'string', title: 'Banner', default: '347468974318517_354672813598133' },
        { name: 'interstitial', type: 'string', title: 'Interstitial', default: '347468974318517_354672960264785' },
        { name: 'rewarded', type: 'string', title: 'Rewarded', default: '347468974318517_354673263598088' },
    ],
});

// initialize code called once per entity
FacebookAdHandler.prototype.initialize = function () {
    this.entity.on('Show:Ad', this.showAd, this);
    this.entity.on('Ads:Preload', this.preload, this);
    this.entity.on('SdkManager:EditorMode', this.switchMode, this);
    this.isEditorMode = true;
    this.rewardedAd = new FbRewardedAdhandler(this.adID.rewarded, this.app);
    this.interstitialAd = new FbInterstitialAdhandler(this.adID.interstitial);
    this.bannerAd = new FbBannerAdhandler(this.adID.banner);
};

// update code called every frame
FacebookAdHandler.prototype.update = function (dt) {
    if (this.isEditorMode) return;
    this.rewardedAd.updateCoolDown(dt);
    this.interstitialAd.updateCoolDown(dt);
    this.bannerAd.updateCoolDown(dt);
};

FacebookAdHandler.prototype.switchMode = function (status) {
    console.log('FacebookAdHandler:isEditor: ', status);
    this.isEditorMode = status;
};

FacebookAdHandler.prototype.preload = function () {
    console.log('Facebook: AD Handler Preload');
    this.loadInterstitialAd();
    this.loadRewardedAd();
};

FacebookAdHandler.prototype.showAd = function (adType, testSettings, callback, enable) {
    console.log('FacebookAdHandler:showAd', adType, testSettings);

    switch (adType) {
        case 'Interstitial': return this.showInterstitialAd(testSettings, callback);
        case 'Rewarded': return this.showRewardedAd(testSettings, callback);
        case 'Banner': return this.showBannerAd(testSettings, callback, enable);
        default: return console.error('Invalid Ad Type');
    }
}

// ****************
// * Interstitial *
// ****************

FacebookAdHandler.prototype.loadInterstitialAd = function () {
    console.log('FB:Loading Interstitial Ad');
    this.interstitialAd.load();
}

FacebookAdHandler.prototype.showInterstitialAd = function (testSettings, callback) {
    if (testSettings.isEditor) {
        AdsManager.Instance.showAd(() => { if (callback) callback(testSettings.isSuccessful ? null : "Failed to show add. Unknown reason") });
        return;
    }
    this.interstitialAd.show(callback);
};

// ************
// * Rewarded *
// ************

FacebookAdHandler.prototype.loadRewardedAd = function () {
    console.log('FacebookAdHandler:loadRewardedAd');
    this.rewardedAd.load(isLoaded => { this.manager.fire('RewaredAdLoaded', isLoaded) });
};

FacebookAdHandler.prototype.showRewardedAd = function (testSettings, callback) {
    console.log('FacebookAdHandler:showRewardedAd', testSettings);

    if (testSettings.isEditor) {
        AdsManager.Instance.showAd(() => { if (callback) callback(testSettings.isSuccessful ? null : "Failed to show add. Unknown reason") });
        return;
    }

    this.manager.fire('RewaredAdLoaded', false);
    this.rewardedAd.show(callback);
};

// **********
// * Banner *
// **********

FacebookAdHandler.prototype.showBannerAd = function (testSettings, callback, enable) {
    if (testSettings.isEditor) {
        if (callback) callback(testSettings.isSuccessful ? null : "Failed to show add. Unknown reason");
        return;
    }

    console.log('Show Banner Ad: ', enable);
    this.bannerAd.show(enable);
};

// swap method called for script hot-reloading
// inherit your script state here
// FacebookAdHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// facebookIAPHandler.js
var FacebookIaphandler = pc.createScript('facebookIaphandler');

// initialize code called once per entity
FacebookIaphandler.prototype.initialize = function () {
    this.entity.on('Purchase', this.purchase, this);
    this.entity.on('ShowCatalog', this.showCatalog, this);
};

// update code called every frame
FacebookIaphandler.prototype.update = function (dt) {

};
FacebookIaphandler.prototype.showCatalog = function (testSettings, callback) {
    if (testSettings.isEditor) {
        console.log('Facebook:ShowCatalog');
        if (callback) return callback(testSettings.isSuccessful ? null : "Failed to show catalog. Unknown reason");
        return;
    }
    FBInstant.payments.getCatalogAsync();
};


FacebookIaphandler.prototype.purchase = function (product_id, testSettings, callback) {
    if (testSettings.isEditor) {
        if (callback) return callback(testSettings.isSuccessful ? null : "Failed to purchase the item. Unknown reason");
        return;
    }
    console.log("Facebook:Purchase");
    FBInstant.payments.purchaseAsync(
        {
            productID: product_id,
            //  developerPayload: payload,
        }).then((purchase) => {
            console.log('Product ID: ', product_id);
            if (callback) return callback(null);
        }).catch((err) => {
            if (callback) return callback(err);
        });

};

// swap method called for script hot-reloading
// inherit your script state here
// FacebookIaphandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// facebookSharingHandler.js
var FacebookSharingHandler = pc.createScript('facebookSharingHandler');

FacebookSharingHandler.attributes.add('imageB64', { type: 'string', title: 'Image B64' });


// initialize code called once per entity
FacebookSharingHandler.prototype.initialize = function () {
    this.entity.on('Share', this.sharing, this);
    this.currentImage = null;
    this.testSettings = null;
    this.callback = null;
};

// update code called every frame
FacebookSharingHandler.prototype.update = function (dt) {

};

FacebookSharingHandler.prototype.sharing = function (testSettings, callback) {
    this.testSettings = testSettings;
    this.callback = callback;
    this.shareImage();
   // this.app.fire('TakeScreenshot', this.shareImage.bind(this));
};

FacebookSharingHandler.prototype.shareImage = function () {
    if (this.testSettings.isEditor) {
        
        if (this.testSettings.isSuccessful) {
            console.log('IMAGE: ', this.imageB64);
            var link = document.getElementById('link');
            link.setAttribute('download', 'Test' + '.png');
            link.setAttribute('href', this.imageB64);
            link.click();
            return;
        }
        else {
            console.warn('Failed to take image');
            if (this.callback) this.callback(this.testSettings.isSuccessful);
            return;
        }
    }
    console.log('Facebook:Share');
    FBInstant.shareAsync({
        image: this.imageB64,
        text: 'My Mr.Bean!',
        data: {},
        shareDestination: ['NEWSFEED', 'GROUP', 'COPY_LINK', 'MESSENGER'],
        switchContext: false,
    });
};

// swap method called for script hot-reloading
// inherit your script state here
// FacebookSharingHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// facebookInviteFriendsHandler.js
var FacebookInviteFriendsHandler = pc.createScript('facebookInviteFriendsHandler');

FacebookInviteFriendsHandler.attributes.add('imageB64', { type: 'string', title: 'Image B64' });

// initialize code called once per entity
FacebookInviteFriendsHandler.prototype.initialize = function () {
    this.callback = null;
    this.testSettings = null;
    this.txt = null;
    this.playerData = null;
    this.entity.on('InviteFriends', this.invite, this);
    this.entity.on('ChallengeMessage', this.challenge, this);
};

// update code called every frame
FacebookInviteFriendsHandler.prototype.update = function (dt) {

};

FacebookInviteFriendsHandler.prototype.invite = function (testSettings, callback) {
    this.testSettings = testSettings;
    this.callback = callback;
    console.log('InviteFriends:CreatingChallenge');
    this.inviteFriends();
    // this.app.fire('TakeScreenshot', this.inviteFriends.bind(this));
};

FacebookInviteFriendsHandler.prototype.inviteFriends = function () {
    if (this.testSettings.isEditor) {
        if (this.callback) this.callback(this.testSettings.isSucessful ? null : 'Failed to invite Friend.');
        return;
    }
    console.log("Facebook:InviteFriends", this.callback);
    this.oldContext = FBInstant.context.getID();
    FBInstant.context
        .chooseAsync()
        .then(() => {
            console.log("Facebook:InviteFriends:VSmode: ", FBInstant.context.getID());
            this.app.fire('GameManager:UpdateMissions', true);
            this.app.fire('SdkManager:UpdateVSMode', true);
            this.app.fire('ChallengeFriend:Play');
            SdkManager.Instance.tournamentMode = false;
        }).catch(err => {
            console.log("Facebook:InviteFriends:VSmode:Failed ", err);
        })

};

FacebookInviteFriendsHandler.prototype.challenge = function (testSettings, callback) {
    if (testSettings.isEditor) {
        if (callback) callback();
        if (testSettings.isSucessful)
            console.log('FacebookInviteFriendsHandler:EditorMode:Success');
        else
            console.log('FacebookInviteFriendsHandler:EditorMode:Failed');
        return;
    }

    console.log('FacebookInviteFriendsHandler:challengeSending...');
    let name = FBInstant.player.getName();
    if (SdkManager.Instance.entryData !== null) {
        this.playerData = {
            isGameEnded: true,
            mode: 'VS'
        };
        if (SdkManager.Instance.entryData.score < ScoreManager.Instance.currentScore) {
            this.txt = `I beat your score by making ${ScoreManager.Instance.currentScore}. Want to play again?`;
        }
        else if (SdkManager.Instance.entryData.score > ScoreManager.Instance.currentScore) {
            this.txt = `I scored less than ${SdkManager.Instance.entryData.score}.You won - let's play again!`
        }
        else {
            this.txt = `I scored ${ScoreManager.Instance.currentScore} as well, Let's Play again`;
        }
    }
    else {
        this.txt = `I scored ${ScoreManager.Instance.currentScore}, Can you beat it?`;
        this.playerData = {
            score: ScoreManager.Instance.currentScore,
            name: FBInstant.player.getName(),
            mode: 'VS'
        };
    }
    // this.app.fire('TakeScreenshot', this.sendChallenge.bind(this));
    this.sendChallenge();
};

FacebookInviteFriendsHandler.prototype.sendChallenge = function () {

    FBInstant.updateAsync({
        action: 'CUSTOM',
        cta: 'Play now',
        image: this.imageB64,
        text: this.txt,
        template: 'challenge',
        data: this.playerData,
        notification: 'PUSH'
    }).then(function () {
        this.switchContext();
        console.log('FacebookInviteFriendsHandler:SendChallenge:Success');
    }).catch(err => {
        this.switchContext();
        console.log('FacebookInviteFriendsHandler:SendChallenge:Failed: ', err);
    });
};

FacebookInviteFriendsHandler.prototype.switchContext = function () {
    console.log('FacebookInviteFriendsHandler:Switching context');
    FBInstant.context.switchAsync('SOLO', true).then(() => {
        // SdkManager.Instance.challengeMode = false;
        this.app.fire('SdkManager:UpdateVSMode', false);
        this.app.fire('GameManager:UpdateMissions', false);
        SdkManager.Instance.entryData = null;
        console.log('FacebookInviteFriendsHandler:Successfully switched back to context: ', FBInstant.context.getType());
    }).catch(err => {
        console.log('FacebookInviteFriendsHandler:Failed to switch back to old context: ', FBInstant.context.getType(), " Error: ", err);
    })
};




// swap method called for script hot-reloading
// inherit your script state here
// FacebookInviteFriendsHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// facebookTournamentHandler.js
var FacebookTournamentHandler = pc.createScript('facebookTournamentHandler');

FacebookTournamentHandler.attributes.add('imageB64', { type: 'string', title: 'Image B64' });


// initialize code called once per entity
FacebookTournamentHandler.prototype.initialize = function () {
    this.leaderBoardName = "Local.";
    this.entity.on('Tournament:Create', this.createTournament, this);
    this.entity.on('Tournament:SetScore', this.updateScore, this);
    //  this.app.on('FacebookTournament:GetLeaderBoard', this.getLeaderBoard, this);
};

// update code called every frame
FacebookTournamentHandler.prototype.update = function (dt) {

};

FacebookTournamentHandler.prototype.createTournament = function (testSettings, callback) {
    if (testSettings.isEditor) {
        console.log("FacebookTournament:Create");
        if (callback) return callback(testSettings.isSuccessful ? null : 'Failed to create the tournament');
        return;
    }

    FBInstant.tournament.createAsync({
        initialScore: 0,
        data: { tournamentLevel: 'hard' },
        config: {
            title: 'Mr.Bean Stack Jump',
            image: this.imageB64,
            sortOrder: 'HIGHER_IS_BETTER',
            scoreFormat: 'NUMERIC',
            // endTime: Date.now(),
        },
    })
        .then(() => {
            // user successfully created tournament and switch into tournament context
            console.log("FacebookTournamentHandler:CreateTournament:Success");
            SdkManager.Instance.tournamentMode = true;
            SdkManager.Instance.entryData = null;
        }).catch(err => {
            console.log("FacebookTournamentHandler:CreateTournament:Failed: ");
            console.log(err);
        });
};

FacebookTournamentHandler.prototype.shareTournament = function () {
    FBInstant.tournament.shareAsync({
        //  score: this.getPlayerScore(),
        //  data: { myReplayData: '...' }
    }).then(() => {
        // continue with the game.
    });
}

FacebookTournamentHandler.prototype.updateScore = function (testSettings, newScore) {
    if (!SdkManager.Instance.tournamentMode) return;
    if (testSettings.isEditor) {
        console.log("FacebookTournamentHandler:PostScore:EditorMode: ", testSettings.isSuccessful);
        return;
    }
    console.log("FacebookTournamentHandler:UpdateScore");
    FBInstant.postSessionScoreAsync(newScore).then(() => {
        console.log("FacebookTournamentHandler:PostSessionScoreAsync:Success: ", newScore);
        //  this.setLeaderBoardScore(newScore);
    }).catch(err => {
        console.log("FacebookTournamentHandler:PostSessionScoreAsync:Failed: ", err);
    })
};

// FacebookTournamentHandler.prototype.setLeaderBoardScore = function (newScore) {
//     console.log('FacebookTournamentHandler:SetLeaderBoardScore');
//     console.log("LeaderBoard name: ", this.leaderBoardName + FBInstant.context.getID());
//     FBInstant.getLeaderboardAsync(this.leaderBoardName + FBInstant.context.getID()).then(leaderBoard => {
//         console.log('FacebookTournamentHandler:LeaderBoard Score Updating: ', leaderBoard);
//         return leaderBoard.setScoreAsync(newScore);
//     }).then(() => {
//         console.log('FacebookTournamentHandler:LeaderBoard Score Updated: ', newScore);
//         this.updateLeaderBoard();
//     }).catch(err => {
//         console.log('FacebookTournamentHandler:Failed updating: ', err);
//         console.log(err);
//     });
// };

// FacebookTournamentHandler.prototype.getLeaderBoard = function (testSettings, callback) {
//     console.log('FacebooktournamentHandler:getleaderboard');
//     if (testSettings.isEditor) {
//         console.log("FacebookTournamentHandler:GetLeaderBoard: ", testSettings.isSuccessful, callback);
//         return;
//     }
//     // GetEntriesAsync can have count(number of entries), and offset(starting index) as parameters
//     FBInstant.getLeaderboardAsync(this.leaderBoardName + FBInstant.context.getID())
//         .then(leaderboard => {
//             return leaderboard.getEntriesAsync(10,0);
//         })
//         .then(entries => {
//             console.log('FacebookTournamentHandler:GetLeaderBoard:Success: ', entries);
//             for (var i = 0; i < entries.length; i++) {
//                 console.log(
//                     entries[i].getRank() + '. ' +
//                     entries[i].getPlayer().getName() + ': ' +
//                     entries[i].getScore()
//                 );
//             }
//             if (callback) callback(entries);
//         }).catch(error => {
//             console.log('FacebookTournamentHandler:GetLeaderBoard:Failed: ');
//             console.error(error)
//         });
// };

// FacebookTournamentHandler.prototype.updateLeaderBoard = function () {
//     let name = this.leaderBoardName + FBInstant.context.getID();
//     FBInstant.updateAsync({
//         action: 'LEADERBOARD',
//         name: this.leaderBoardName + FBInstant.context.getID()
//     })
//         .then(() => console.log('FacebookTournamentHandler:updateLeaderBoard:Success'))
//         .catch(error => console.error('FacebookTournamentHandler:updateLeaderBoard:Failed:', error));
// };



// swap method called for script hot-reloading
// inherit your script state here
// FacebookTournamentHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// specialOfferMenuListener.js
var SpecialOfferMenuListener = pc.createScript('specialOfferMenuListener');

SpecialOfferMenuListener.attributes.add('popup', { type: 'entity', title: 'Popup' });
SpecialOfferMenuListener.attributes.add('cross', { type: 'entity', title: 'Cross' });
SpecialOfferMenuListener.attributes.add('crossBtn', { type: 'entity', title: 'Cross Btn' });
SpecialOfferMenuListener.attributes.add('fade', { type: 'entity', title: 'Fade' });
SpecialOfferMenuListener.attributes.add('dealDescription', { type: 'entity', title: 'Deal Description' });
SpecialOfferMenuListener.attributes.add('purchaseBtn', { type: 'entity', title: 'Purchase Button' });
SpecialOfferMenuListener.attributes.add('btnText', { type: 'entity', title: 'Purchase Btn Text' });
SpecialOfferMenuListener.attributes.add('restoreBtn', { type: 'entity', title: 'Restore Button' });

SpecialOfferMenuListener.attributes.add('resultPopUp', {
    title: 'Result Popup',
    type: 'json',
    schema: [
        { name: 'entity', type: 'entity', title: 'Container' },
        { name: 'heading', type: 'entity', title: 'Heading txt' },
        { name: 'description', type: 'entity', title: 'Description txt' },
    ]
});


SpecialOfferMenuListener.prototype.initialize = function () {
    this.wasPurchaseSuccessfull = false;

    this.on('enable', this.onEnable, this);
    this.app.on('SpecialOfferMenu:OnClick', this.onClickButton, this);
    this.app.on('SpecialOfferMenu:CheckPurchase', this.checkPurchase, this);
};

SpecialOfferMenuListener.prototype.postInitialize = function () {
    this.onEnable();
};

SpecialOfferMenuListener.prototype.onEnable = function () {
    this.popup.enabled = true;
    this.cross.enabled = true;
    this.crossBtn.enabled = true;
    this.fade.enabled = true;
    this.app.fire('SdkManager:GetProductInfo', this.setProductInfo.bind(this));
    this.restoreBtn.enabled = pc.platform.ios;
};

// update code called every frame
SpecialOfferMenuListener.prototype.update = function (dt) {

};

SpecialOfferMenuListener.prototype.setProductInfo = function (price, enableBtn) {
    // console.log("Special Offer Price: ", price, this.dealDescription);
    // this.dealDescription.element.text = deal;
    this.btnText.element.text = "BUY " + price;
};

SpecialOfferMenuListener.prototype.updatePurchaseBtn = function (isActive) {
    this.purchaseBtn.button.active = isActive;
    this.purchaseBtn.script.enabled = isActive;
};

SpecialOfferMenuListener.prototype.onClickButton = function (name, product_id) {
    switch (name) {
        case "Cross":
            this.closeMenu();
            this.showResultPopup(false);
            break;
        case "OK":
            this.showResultPopup(false);
            if (this.wasPurchaseSuccessfull) this.closeMenu();
            break;
        case "Buy":
            this.app.fire('Loading:Show', true, undefined, undefined, true, 0.5);
            this.app.fire('SdkManager:inAppPurchase', this.checkPurchase.bind(this));
            break;
        case "Restore":
            // this.app.fire('Loading:Show', true, undefined, undefined, true, 0.5);
            this.app.fire('SdkManager:IapRestore', this.checkPurchase.bind(this));
            break;

    }
};

SpecialOfferMenuListener.prototype.closeMenu = function () {
    console.log("Closing Special Offer");
    // this.entity.enabled = false;
    this.popup.fire('disable', () => this.popup.enabled = false);
    this.cross.fire('disable', () => this.cross.enabled = false);
    this.crossBtn.fire('disable', () => this.crossBtn.enabled = false);
    this.fade.fire('disable', () => { this.fade.enabled = false; this.entity.enabled = false; });
};

SpecialOfferMenuListener.prototype.checkPurchase = function (message) {
    this.wasPurchaseSuccessfull = message == null || message == undefined;
    this.app.fire('Loading:Show', false);

    if (this.wasPurchaseSuccessfull) {
        // Unlock stuff 
        console.log('Purchase Success!');
        this.app.fire('SdkManager:ShowAd', 'Banner', undefined, false);

        this.showResultPopup(true, "PURCHASE SUCCESSFUL", "Check out your new items\nin the shop and we hope\nyou are enjoying the game.");
        this.app.fire('HomeMenu:SetProductInfo', 0, false);
    }
    else {
        console.log("SpecialOfferMenuListener:checkPurchase:Error: ", message);
        this.showResultPopup(true, "PURCHASE FAILED", "Try again in a moment and we hope\nyou are enjoying the game..");
    }
};


SpecialOfferMenuListener.prototype.showResultPopup = function (enable, title, desc) {
    // this.resultPopUp.entity.enabled = enable;
    // if (title) this.resultPopUp.heading.element.text = title;
    // if (desc) this.resultPopUp.description.element.text = desc;
    this.app.fire('PopupView:Show', enable, title, desc, () => {
        this.app.fire('PopupView:Show', false);
        if (this.wasPurchaseSuccessfull) this.closeMenu();
    })
};
// swap method called for script hot-reloading
// inherit your script state here
// SpecialOfferMenuListener.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// LoadingScreen.js
var LoadingScreen = pc.createScript('loadingScreen');

LoadingScreen.attributes.add('circle', { type: 'entity', title: 'Circle' });
LoadingScreen.attributes.add('textBody', { type: 'entity', title: 'Loading Text' });
LoadingScreen.attributes.add('percent', { type: 'entity', title: 'Loading %age' });
LoadingScreen.attributes.add('container', { type: 'entity', title: 'Container' });
LoadingScreen.attributes.add('fadeBG', { type: 'entity', title: 'FadeBG' });


// initialize code called once per entity
LoadingScreen.prototype.initialize = function () {
    this.app.on('Loading:UpdateText', this.updateText, this);
    this.app.on('Loading:Percentage', this.updatePercent, this);
    this.app.on('Loading:Start', this.start, this);
    this.app.on('Loading:Stop', this.stop, this);
    this.app.on('Loading:OnClick', this.onClick, this);
    this.app.on('Loading:Show', this.showLoading, this);

    this.on('enable', this.onEnable, this);
};

// update code called every frame
LoadingScreen.prototype.update = function (dt) {

};

LoadingScreen.prototype.postInitialize = function () {
    this.onEnable();
}

LoadingScreen.prototype.onEnable = function () {
    this.updatePercent(0);
}

LoadingScreen.prototype.showLoading = function(enable, txt, percentage, enableCircle, opacity) {
    this.container.enabled = enable;

    this.textBody.enabled = txt !== undefined;
    this.updateText(txt);

    this.percent.enabled = percentage !== undefined;
    this.updatePercent(percentage);

    this.circle.enabled = enableCircle;
    this.fadeBG.element.opacity = opacity || 0.7;
};

LoadingScreen.prototype.updateText = function (newText) {
    if (newText)
    this.textBody.element.text = newText;
};

LoadingScreen.prototype.updatePercent = function (number) {
    //  console.log('234:New Percent: ', number);
    if (number)
    this.percent.element.text = number;
};

LoadingScreen.prototype.start = function (opacity) {
    if (this.container.enabled) return;
    this.container.enabled = true;
    this.updatePercent(0);
    this.circle.enabled = true;
    this.fadeBG.element.opacity = opacity;
};

LoadingScreen.prototype.stop = function (onComplete) {

    this.container.enabled = false;
    if (onComplete) onComplete();
};



LoadingScreen.prototype.onClick = function() {
    GameManager.FirstClick = true;
    console.log('LoadingScreen:onClick: ', GameManager.FirstClick);
};

// swap method called for script hot-reloading
// inherit your script state here
// LoadingScreen.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// facebookDataHandler.js
var FacebookDataHandler = pc.createScript('facebookDataHandler');

// initialize code called once per entity
FacebookDataHandler.prototype.initialize = function () {
    this.entity.on('Data:Set', this.setData, this);
    this.entity.on('Data:Get', this.getData, this);

    this.localStorage = new LocalStorageHandler();
};

// update code called every frame
FacebookDataHandler.prototype.update = function (dt) {

};

FacebookDataHandler.prototype.setData = function (testSettings, data, callback) {
    if (testSettings.isEditor)
        return this.localStorage.save(testSettings, data, callback);

    this.save(data, callback);
};

FacebookDataHandler.prototype.save = function (data, callback) {
    FBInstant.player
        .setDataAsync({
            CompletedMissions: data['CompletedMissions'],
            GameCount: data['GameCount'],
            BestScore: data['BestScore'],
            Coins: data['Coins'],
            CurrentTheme: data['CurrentTheme'],
            CurrentBox: data['CurrentBox'],
            CurrentShirt: data['CurrentShirt'],
            CurrentHat: data['CurrentHat'],
            UnlockedItems: data['UnlockedItems'],
            RandomUnlockPrice: data['RandomUnlockPrice']
        })
        .then(() => {
            console.log('Current Data: ', data);
            if (callback) callback(null);
        }).catch((err) => {
            if (callback) callback(err);
        });
};

FacebookDataHandler.prototype.getData = function (testSettings, callback) {
    if (testSettings.isEditor)
        return this.localStorage.load(testSettings, callback);

    this.load(callback);
};

FacebookDataHandler.prototype.load = function (callback) {
    FBInstant.player
        .getDataAsync(['CompletedMissions', 'GameCount', 'BestScore', 'Coins', 'CurrentTheme', 'CurrentBox', 'CurrentHat', 'CurrentShirt', 'UnlockedItems', 'RandomUnlockPrice'])
        .then((data) => {
            console.log("Get Data: ", data);
            if (data === null || data === undefined)
                data = {}

            data.CompletedMissions = data.CompletedMissions || 0;
            data.GameCount = data.GameCount || 0;
            data.BestScore = data.BestScore || 0;
            data.Coins = data.Coins || EconomyManager.Instance.defaultCoins;
            data.CurrentTheme = data.CurrentTheme || ThemeController.Instance.defaultTexture;
            data.CurrentBox = data.CurrentBox || ThemeController.Instance.defaultTexture;
            data.CurrentShirt = data.CurrentShirt || DataManager.Instance.currentShirt;
            data.CurrentHat = data.CurrentHat || DataManager.Instance.currentHat;
            data.UnlockedItems = data.UnlockedItems || null;
            data.RandomUnlockPrice = data.RandomUnlockPrice || EconomyManager.Instance.randomUnlockSettings[0].basePrice;

            if (callback) callback(data, null);
        }).catch((err) => {
            console.log("Get Data Err: ");
            if (callback) callback(null, err);
        });
};

// swap method called for script hot-reloading
// inherit your script state here
// FacebookDataHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// DataManager.js
var DataManager = pc.createScript('dataManager');

DataManager.attributes.add('itemsUnlocked', { type: 'boolean', title: 'Everything unlocked' });
// initialize code called once per entity
DataManager.prototype.initialize = function () {
    // localStorage.clear();
    DataManager.Instance = this;
    this.completedMissions = 0;
    this.gameCount = 0;
    this.bestScore = 0;
    this.firstTimeOpened = true;
    this.isOfferPurchased = false;
    this.currentTheme = { 'pageID': 0, 'itemID': 3 };
    this.currentBox = { 'pageID': 0, 'itemID': 3 };
    this.currentShirt = { 'pageID': 0, 'itemID': 0, 'name': 'main' };
    this.currentHat = { 'pageID': 0, 'itemID': 0, 'name': 'main' };
    this.randomUnlockPrice = 0;
    this.shopItems = ['themes', 'boxes', 'shirts', 'hats'];
    this.unlockedItems = {
        themes: { 0: [], 1: [] },
        boxes: { 0: [], 1: [] },
        shirts: { 0: [], 1: [], 2: [], 3: [] },
        hats: { 0: [], 1: [], 2: [], 3: [] }
    };

    // console.log('1122: ', this.unlockedItems.themes)
    this.app.on('DataManager:StoreData', this.setData, this);
    this.app.on('DataManager:OnDataFetched', this.onDataFetched, this);
};

DataManager.prototype.postInitialize = function () {
    this.coinsAmount = EconomyManager.Instance.defaultCoins || 0;
    this.randomUnlockPrice = EconomyManager.Instance.randomUnlockSettings[0].basePrice || 300;
    this.currentBox = ThemeController.Instance.defaultTexture || this.currentBox;
    this.currentTheme = ThemeController.Instance.defaultTexture || this.currentTheme;
    this.currentShirt = SpineSkinHandler.Instance.defaultShirt || this.currentShirt;
    this.currentHat = SpineSkinHandler.Instance.defaultHat || this.currentHat;
    for (let i = 0; i < this.shopItems.length; i++) {
        let size = Object.keys(this.unlockedItems[this.shopItems[i]]).length
        for (let k = 0; k < size; k++)
            for (let j = 0; j < 8; j++)
                this.unlockedItems[this.shopItems[i]][k][j] = false;
    }

    this.allItemsUnlocked = {
        themes: { 0: [], 1: [] },
        boxes: { 0: [], 1: [] },
        shirts: { 0: [], 1: [], 2: [], 3: [] },
        hats: { 0: [], 1: [], 2: [], 3: [] }
    };

    for (let i = 0; i < this.shopItems.length; i++) {
        let size = Object.keys(this.allItemsUnlocked[this.shopItems[i]]).length
        for (let k = 0; k < size; k++)
            for (let j = 0; j < 8; j++)
                this.allItemsUnlocked[this.shopItems[i]][k][j] = true;
    }


    this.unlockedItems.themes[this.currentTheme.pageID][this.currentTheme.itemID] = true;
    this.unlockedItems.boxes[this.currentBox.pageID][this.currentBox.itemID] = true;
    this.unlockedItems.shirts[this.currentShirt.pageID][this.currentShirt.itemID] = true;
    this.unlockedItems.hats[this.currentHat.pageID][this.currentHat.itemID] = true;
};

DataManager.prototype.onDataFetched = function (data, message) {
    if (message != null) {
        console.log("DataManager:onDataFetched:error: ", message);
    }
    else {
        console.log("DataManager:onDataFetched: ", JSON.stringify(data));
        this.completedMissions = data.CompletedMissions;
        this.gameCount = data.GameCount;
        this.bestScore = data.BestScore;
        this.coinsAmount = data.Coins;
        this.randomUnlockPrice = data.RandomUnlockPrice;
        this.firstTimeOpened = data.FirstTimeOpened != undefined ? data.FirstTimeOpened : this.firstTimeOpened;
        this.isOfferPurchased = data.IsOfferPurchased != undefined ? data.IsOfferPurchased : this.isOfferPurchased;
        if (this.itemsUnlocked) {
            this.unlockedItems = this.allItemsUnlocked;
        }
        else if (data.UnlockedItems) {
            let unlockedItems = null;
            if (typeof (data.UnlockedItems) == 'string')
                unlockedItems = JSON.parse(data.UnlockedItems);
            else
                unlockedItems = data.UnlockedItems;
            this.checkUnlockedItems(unlockedItems);
        }
        if (data.CurrentTheme) {
            if (typeof (data.CurrentTheme) == 'string')
                this.currentTheme = JSON.parse(data.CurrentTheme);
            else
                this.currentTheme = data.CurrentTheme;
        }
        if (data.CurrentBox) {
            if (typeof (data.CurrentBox) == 'string')
                this.currentBox = JSON.parse(data.CurrentBox);
            else
                this.currentBox = data.CurrentBox;
        }
        if (data.CurrentShirt) {
            if (typeof (data.CurrentShirt) == 'string')
                this.currentShirt = JSON.parse(data.CurrentShirt);
            else
                this.currentShirt = data.CurrentShirt;
        }
        if (data.CurrentHat) {
            if (typeof (data.CurrentHat) == 'string')
                this.currentHat = JSON.parse(data.CurrentHat);
            else
                this.currentHat = data.CurrentHat;
        }
        if (data.FirstTimeOpened) {
            if (typeof (data.FirstTimeOpened) == 'string')
                this.firstTimeOpened = JSON.parse(data.FirstTimeOpened);
            else
                this.firstTimeOpened = data.FirstTimeOpened;
        }
        
        // // console.log('2233: ', data.CurrentTheme, this.currentTheme);
    }

    this.app.fire('GameManager:LoadAssets');
    this.app.fire('ScoreManager:SetBestScore');
    this.app.fire('MissionManager:GetCompletedMissions');
    //  this.app.fire('SpineSkin:SetDefault');

};

DataManager.prototype.checkUnlockedItems = function (list) {

    if (list.costumes == undefined) {
        list['costumes'] = this.unlockedItems.costumes;
    }
    if (list.shirts == undefined) {
        list['shirts'] = this.unlockedItems.shirts;
    }
    if (list.hats == undefined) {
        list['hats'] = this.unlockedItems.hats;
    }
    if (list.boxes == undefined) {
        list['boxes'] = this.unlockedItems.boxes;
    }

    for (let i = 0; i < this.shopItems.length; i++) {
        let size = Object.keys(list[this.shopItems[i]]).length
        for (let k = 0; k < size; k++)
            for (let j = 0; j < 8; j++)
                this.unlockedItems[this.shopItems[i]][k][j] = list[this.shopItems[i]][k][j];
    }
};

DataManager.prototype.setData = function () {
    const unlockedItems = JSON.stringify(this.unlockedItems);
    const currentTheme = JSON.stringify(this.currentTheme);
    const currentBox = JSON.stringify(this.currentBox);
    const currentShirt = JSON.stringify(this.currentShirt);
    const currentHat = JSON.stringify(this.currentHat);
    let data = {
        CompletedMissions: this.completedMissions,
        GameCount: this.gameCount,
        BestScore: this.bestScore,
        Coins: this.coinsAmount,
        CurrentTheme: currentTheme,
        CurrentBox: currentBox,
        CurrentShirt: currentShirt,
        CurrentHat: currentHat,
        UnlockedItems: unlockedItems,
        RandomUnlockPrice: this.randomUnlockPrice,
        FirstTimeOpened: this.firstTimeOpened,
        IsOfferPurchased: this.isOfferPurchased,
    }

    // console.log("SET DATA: ", data);
    this.app.fire('SdkManager:StoreData', data, this.storeStatus.bind(this));
};

DataManager.prototype.storeStatus = function (message) {
    if (message != null) {
        console.log("DataManager:storeStatus:error: ", JSON.stringify(message));
    }
};

DataManager.prototype.updateUnlockedItems = function (panel, pageID, itemID) {

    if (panel === 'Themes') {
        this.unlockedItems.themes[pageID][itemID] = true;
    }
    else if (panel === 'Boxes') {
        this.unlockedItems.boxes[pageID][itemID] = true;
    }
    else if (panel == 'Shirts') {
        this.unlockedItems.shirts[pageID][itemID] = true;
    }
    else if (panel == 'Hats') {
        this.unlockedItems.hats[pageID][itemID] = true;
    }

    // // // console.log('2233:UnlockedThemes', this.unlockedThemes);
    this.setData();
}

DataManager.prototype.getCurrentItem = function (index) {
    switch (index) {
        case 0:
            return this.currentBox;
        case 1:
            return this.currentTheme;
        case 2:
            return this.currentShirt;
        case 3:
            return this.currentHat;
    }
};

DataManager.prototype.unlockAllItems = function () {
    this.unlockedItems = this.allItemsUnlocked;
    this.setData();
};

// update code called every frame
DataManager.prototype.update = function (dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// DataManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// LoopBuilding.js
var LoopBuilding = pc.createScript('loopBuilding');

LoopBuilding.attributes.add('player', { type: 'entity', title: 'Player' });
LoopBuilding.attributes.add('center', { type: 'entity', title: 'Center Point' });
LoopBuilding.attributes.add('offsetY', { type: 'number', title: 'Move up By' });
LoopBuilding.attributes.add('initialY', { type: 'number', title: 'Initial Height' });

// initialize code called once per entity
LoopBuilding.prototype.initialize = function () {
    this.app.on('LoopBuilding:Reset', this.reset, this);
    this.app.on('LoopBuilding:CheckHeight', this.checkHeight, this);
};

// update code called every frame
LoopBuilding.prototype.update = function (dt) {

};

LoopBuilding.prototype.reset = function () {
    let pos = this.entity.getPosition();
    this.entity.setPosition(pos.x, this.initialY, pos.z);
};

LoopBuilding.prototype.checkHeight = function () {
    let playerHeight = this.player.getPosition().y;
    let threshold = this.center.getPosition().y;
    if (playerHeight >= threshold) {
        this.moveUp();
    }

};

LoopBuilding.prototype.moveUp = function () {
    let pos = this.entity.getPosition();
    this.entity.setPosition(pos.x, pos.y + this.offsetY, pos.z);
};

// swap method called for script hot-reloading
// inherit your script state here
// LoopBuilding.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// specialOfferManager.js
var SpecialOfferManager = pc.createScript('specialOfferManager');

// initialize code called once per entity
SpecialOfferManager.prototype.initialize = function () {
    SpecialOfferManager.Instance = this;
    this.noAds = false;
};

// update code called every frame
SpecialOfferManager.prototype.update = function (dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// SpecialOfferManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// screenshot.js
var Screenshot = pc.createScript('screenshot');
Screenshot.attributes.add('cameraEntity', {
    type: 'entity',
    description: 'The camera entity to use for taking the screenshot with. Whatever, this camera renders will be in the screen capture.'
});


Screenshot.prototype.initialize = function () {
    this.createNewRenderTexture();

    this.app.graphicsDevice.on('resizecanvas', function (w, h) {
        this.secsSinceSameSize = 0;
    }, this);

    var device = this.app.graphicsDevice;
    this.lastWidth = device.width;
    this.lastHeight = device.height;

    this.secsSinceSameSize = 0;

    this.triggerScreenshot = false;
    this.callBack = null;
    var onTakeScreenshot = function (callBack) {
        this.triggerScreenshot = true;
        this.cameraEntity.enabled = true;
        this.callBack = callBack;
    };

    this.app.on('TakeScreenshot', onTakeScreenshot, this);
    this.app.on('postrender', this.postRender, this);

    // Disable the screenshot camera as we only want it enabled when we take the screenshot itself
    this.cameraEntity.enabled = false;

    // Ensure it gets rendered first so not to interfere with other cameras
    this.cameraEntity.camera.priority = -1;

    // Add a <a> to use to download an image file
    var linkElement = document.createElement('a');
    linkElement.id = 'link';
    window.document.body.appendChild(linkElement);

    // Clean up resources if script is destroyed
    this.on('destroy', function () {
        this.app.off('TakeScreenshot', onTakeScreenshot, this);
        this.app.off('postrender', this.postRender, this);

        window.document.body.removeChild(linkElement);

        if (this.renderTarget) {
            this.renderTarget.destroy();
            this.renderTarget = null;
        }

        if (this.colorTexture) {
            this.colorTexture.destroy();
            this.colorTexture = null;
        }

        if (this.depthTexture) {
            this.depthTexture.destroy();
            this.depthTexture = null;
        }

        this.canvas = null;
        this.context = null;

    }, this);
};


// update code called every frame
Screenshot.prototype.update = function (dt) {
    // We don't want to be constantly creating an new texture if the window is constantly
    // changing size (e.g a user that is dragging the corner of the browser over a period)
    // of time. 

    // We wait for the the canvas width and height to stay the same for short period of time
    // before creating a new texture to render against.

    var device = this.app.graphicsDevice;

    if (device.width == this.lastWidth && device.height == this.lastHeight) {
        this.secsSinceSameSize += dt;
    }

    if (this.secsSinceSameSize > 0.25) {
        if (this.unScaledTextureWidth != device.width || this.unScaledTextureHeight != device.height) {
            this.createNewRenderTexture();
        }
    }

    this.lastWidth = device.width;
    this.lastHeight = device.height;
};


Screenshot.prototype.postRender = function () {
    if (this.triggerScreenshot) {
        this.takeScreenshot('screenshot');
        this.triggerScreenshot = false;
        this.cameraEntity.enabled = false;
    }
};


Screenshot.prototype.createNewRenderTexture = function () {
    var device = this.app.graphicsDevice;

    // Make sure we clean up the old textures first and remove 
    // any references
    if (this.colorTexture && this.depthTexture && this.renderTarget) {
        var oldRenderTarget = this.renderTarget;
        var oldColorTexture = this.colorTexture;
        var oldDepthTexture = this.depthTexture;

        this.renderTarget = null;
        this.colorTexture = null;
        this.depthTexture = null;

        oldRenderTarget.destroy();
        oldColorTexture.destroy();
        oldDepthTexture.destroy();
    }

    // Create a new texture based on the current width and height
    var colorBuffer = new pc.Texture(device, {
        width: device.width,
        height: device.height,
        format: pc.PIXELFORMAT_R8_G8_B8_A8,
        autoMipmap: true
    });

    var depthBuffer = new pc.Texture(device, {
        format: pc.PIXELFORMAT_DEPTHSTENCIL,
        width: device.width,
        height: device.height,
        mipmaps: false,
        addressU: pc.ADDRESS_CLAMP_TO_EDGE,
        addressV: pc.ADDRESS_CLAMP_TO_EDGE
    });

    colorBuffer.minFilter = pc.FILTER_LINEAR;
    colorBuffer.magFilter = pc.FILTER_LINEAR;
    var renderTarget = new pc.RenderTarget({
        colorBuffer: colorBuffer,
        depthBuffer: depthBuffer,
        samples: 4 // Enable anti-alias 
    });

    this.cameraEntity.camera.renderTarget = renderTarget;

    this.unScaledTextureWidth = device.width;
    this.unScaledTextureHeight = device.height;

    this.colorTexture = colorBuffer;
    this.depthTexture = depthBuffer;
    this.renderTarget = renderTarget;

    var cb = this.renderTarget.colorBuffer;

    if (!this.canvas) {
        // Create a canvas context to render the screenshot to
        this.canvas = window.document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    }

    this.canvas.width = cb.width;
    this.canvas.height = cb.height;

    // The render is upside down and back to front so we need to correct it
    this.context.globalCompositeOperation = "copy";
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.scale(1, -1);
    this.context.translate(0, -this.canvas.height);

    this.pixels = new Uint8Array(colorBuffer.width * colorBuffer.height * 4);
};


// From https://forum.playcanvas.com/t/save-specific-rendered-entities-to-image/2855/4
Screenshot.prototype.takeScreenshot = function (filename) {
    var colorBuffer = this.renderTarget.colorBuffer;
    var depthBuffer = this.renderTarget.depthBuffer;

    // Fix for WebKit: https://github.com/playcanvas/developer.playcanvas.com/issues/268
    // context must be cleared otherwise the first screenshot is always used

    // https://stackoverflow.com/a/6722031/8648403
    // Store the current transformation matrix
    this.context.save();

    // Use the identity matrix while clearing the canvas
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, colorBuffer.width, colorBuffer.height);

    // Restore the transform
    this.context.restore();

    var gl = this.app.graphicsDevice.gl;
    var fb = this.app.graphicsDevice.gl.createFramebuffer();
    var pixels = this.pixels;

    // We are accessing a private property here that has changed between
    // Engine v1.51.7 and v1.52.2
    var colorGlTexture = colorBuffer.impl ? colorBuffer.impl._glTexture : colorBuffer._glTexture;
    var depthGlTexture = depthBuffer.impl ? depthBuffer.impl._glTexture : depthBuffer._glTexture;

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorGlTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, depthGlTexture, 0);
    gl.readPixels(0, 0, colorBuffer.width, colorBuffer.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    gl.deleteFramebuffer(fb);

    // first, create a new ImageData to contain our pixels
    var imgData = this.context.createImageData(colorBuffer.width, colorBuffer.height); // width x height
    var data = imgData.data;

    // Get a pointer to the current location in the image.
    var palette = this.context.getImageData(0, 0, colorBuffer.width, colorBuffer.height); //x,y,w,h

    // Wrap your array as a Uint8ClampedArray
    palette.data.set(new Uint8ClampedArray(pixels)); // assuming values 0..255, RGBA, pre-mult.

    // Repost the data.
    this.context.putImageData(palette, 0, 0);
    this.context.drawImage(this.canvas, 0, 0);

    var image = this.canvas.toDataURL('image/png');
    var b64 = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    if (this.callBack) this.callBack(b64, filename);
    this.callBack = null;
    // Thanks https://stackoverflow.com/a/44487883
    // var link = document.getElementById('link');
    // link.setAttribute('download', filename + '.png');
    // link.setAttribute('href', b64);
    // link.click();
};


// change-horizontal-fov.js
var ChangeHorizontalFov = pc.createScript('changeHorizontalFov');

// initialize code called once per entity
ChangeHorizontalFov.prototype.initialize = function () {
    var self = this; 
    var onResize = function(w, h) {
        self.entity.camera.horizontalFov = h > w;
    };

    this.app.graphicsDevice.on('resizecanvas', onResize, this);

    this.on('destroy', function() {
        this.app.graphicsDevice.off('resizecanvas', onResize, this);
    });

    onResize(this.app.graphicsDevice.width, this.app.graphicsDevice.height);
};

// swap method called for script hot-reloading
// inherit your script state here
// ChangeHorizontalFov.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// CoinsAnimController.js
var CoinsAnimController = pc.createScript('coinsAnimController');

CoinsAnimController.attributes.add('radius', { type: 'number', title: 'Radius'});
CoinsAnimController.attributes.add('target', { type: 'entity', title: 'Target'});
CoinsAnimController.attributes.add('moveDelay', { type: 'vec2', title: 'Move Delay'});
CoinsAnimController.attributes.add('coins', { type: 'entity', title: 'Coins', array: true});

// initialize code called once per entity
CoinsAnimController.prototype.initialize = function() {
    this.app.fire('CoinsAnimController:Show', this.show, this)
};

// update code called every frame
CoinsAnimController.prototype.show = function(startPos, rewardedCoins) {
    let count = rewardedCoins < this.coins.length ? rewardedCoins : Math.floor(pc.math.random(5, this.coins.length));

    for (let i = 0 ; i < count; i++) {
        this.coins[i].setLocalPosition(0, 0, 0);
        this.coins[i].enabled = true;
        this.coins[i].fire('Set', )
    };
};

// swap method called for script hot-reloading
// inherit your script state here
// CoinsAnimController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// CustomRootEnabler.js
var CustomRootEnabler = pc.createScript('customRootEnabler');

CustomRootEnabler.attributes.add('customRoot', { type: 'entity'})

// initialize code called once per entity
CustomRootEnabler.prototype.initialize = function() {
  //  console.log('CustomRootEnabler:initialize');
    this.app.on('CustomRoot:SetActive', this.setActive, this);
    this.app.fire('CustomRootEnabler:initialized');
};

// update code called every frame
CustomRootEnabler.prototype.setActive = function (active) {
   // console.log('CustomRootEnabler:setActive', active);
    this.customRoot.enabled = active;
};

// swap method called for script hot-reloading
// inherit your script state here
// CustomRootEnabler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// tween.js
pc.extend(pc, function () {

    /**
     * @name pc.TweenManager
     * @description Handles updating tweens
     * @param {pc.AppBase} app - The AppBase instance.
     */
    var TweenManager = function (app) {
        this._app = app;
        this._tweens = [];
        this._add = []; // to be added
    };

    TweenManager.prototype = {
        add: function (tween) {
            this._add.push(tween);
            return tween;
        },

        update: function (dt) {
            var i = 0;
            var n = this._tweens.length;
            while (i < n) {
                if (this._tweens[i].update(dt)) {
                    i++;
                } else {
                    this._tweens.splice(i, 1);
                    n--;
                }
            }

            // add any tweens that were added mid-update
            if (this._add.length) {
                for (let i = 0; i < this._add.length; i++) {
                    if (this._tweens.indexOf(this._add[i]) > -1) continue;
                    this._tweens.push(this._add[i]);
                }
                this._add.length = 0;
            }
        }
    };

    /**
     * @name  pc.Tween
     * @param {object} target - The target property that will be tweened
     * @param {pc.TweenManager} manager - The tween manager
     * @param {pc.Entity} entity - The pc.Entity whose property we are tweening
     */
    var Tween = function (target, manager, entity) {
        pc.events.attach(this);

        this.manager = manager;

        if (entity) {
            this.entity = null; // if present the tween will dirty the transforms after modify the target
        }

        this.time = 0;

        this.complete = false;
        this.playing = false;
        this.stopped = true;
        this.pending = false;

        this.target = target;

        this.duration = 0;
        this._currentDelay = 0;
        this.timeScale = 1;
        this._reverse = false;

        this._delay = 0;
        this._yoyo = false;

        this._count = 0;
        this._numRepeats = 0;
        this._repeatDelay = 0;

        this._from = false; // indicates a "from" tween

        // for rotation tween
        this._slerp = false; // indicates a rotation tween
        this._fromQuat = new pc.Quat();
        this._toQuat = new pc.Quat();
        this._quat = new pc.Quat();

        this.easing = pc.Linear;

        this._sv = {}; // start values
        this._ev = {}; // end values
    };

    var _parseProperties = function (properties) {
        var _properties;
        if (properties instanceof pc.Vec2) {
            _properties = {
                x: properties.x,
                y: properties.y
            };
        } else if (properties instanceof pc.Vec3) {
            _properties = {
                x: properties.x,
                y: properties.y,
                z: properties.z
            };
        } else if (properties instanceof pc.Vec4) {
            _properties = {
                x: properties.x,
                y: properties.y,
                z: properties.z,
                w: properties.w
            };
        } else if (properties instanceof pc.Quat) {
            _properties = {
                x: properties.x,
                y: properties.y,
                z: properties.z,
                w: properties.w
            };
        } else if (properties instanceof pc.Color) {
            _properties = {
                r: properties.r,
                g: properties.g,
                b: properties.b
            };
            if (properties.a !== undefined) {
                _properties.a = properties.a;
            }
        } else {
            _properties = properties;
        }
        return _properties;
    };
    Tween.prototype = {
        // properties - js obj of values to update in target
        to: function (properties, duration, easing, delay, repeat, yoyo) {
            this._properties = _parseProperties(properties);
            this.duration = duration;

            if (easing) this.easing = easing;
            if (delay) {
                this.delay(delay);
            }
            if (repeat) {
                this.repeat(repeat);
            }

            if (yoyo) {
                this.yoyo(yoyo);
            }

            return this;
        },

        from: function (properties, duration, easing, delay, repeat, yoyo) {
            this._properties = _parseProperties(properties);
            this.duration = duration;

            if (easing) this.easing = easing;
            if (delay) {
                this.delay(delay);
            }
            if (repeat) {
                this.repeat(repeat);
            }

            if (yoyo) {
                this.yoyo(yoyo);
            }

            this._from = true;

            return this;
        },

        rotate: function (properties, duration, easing, delay, repeat, yoyo) {
            this._properties = _parseProperties(properties);

            this.duration = duration;

            if (easing) this.easing = easing;
            if (delay) {
                this.delay(delay);
            }
            if (repeat) {
                this.repeat(repeat);
            }

            if (yoyo) {
                this.yoyo(yoyo);
            }

            this._slerp = true;

            return this;
        },

        start: function () {
            var prop, _x, _y, _z;

            this.playing = true;
            this.complete = false;
            this.stopped = false;
            this._count = 0;
            this.pending = (this._delay > 0);

            if (this._reverse && !this.pending) {
                this.time = this.duration;
            } else {
                this.time = 0;
            }

            if (this._from) {
                for (prop in this._properties) {
                    if (this._properties.hasOwnProperty(prop)) {
                        this._sv[prop] = this._properties[prop];
                        this._ev[prop] = this.target[prop];
                    }
                }

                if (this._slerp) {
                    this._toQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z);

                    _x = this._properties.x !== undefined ? this._properties.x : this.target.x;
                    _y = this._properties.y !== undefined ? this._properties.y : this.target.y;
                    _z = this._properties.z !== undefined ? this._properties.z : this.target.z;
                    this._fromQuat.setFromEulerAngles(_x, _y, _z);
                }
            } else {
                for (prop in this._properties) {
                    if (this._properties.hasOwnProperty(prop)) {
                        this._sv[prop] = this.target[prop];
                        this._ev[prop] = this._properties[prop];
                    }
                }

                if (this._slerp) {
                    _x = this._properties.x !== undefined ? this._properties.x : this.target.x;
                    _y = this._properties.y !== undefined ? this._properties.y : this.target.y;
                    _z = this._properties.z !== undefined ? this._properties.z : this.target.z;

                    if (this._properties.w !== undefined) {
                        this._fromQuat.copy(this.target);
                        this._toQuat.set(_x, _y, _z, this._properties.w);
                    } else {
                        this._fromQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z);
                        this._toQuat.setFromEulerAngles(_x, _y, _z);
                    }
                }
            }

            // set delay
            this._currentDelay = this._delay;

            // add to manager when started
            this.manager.add(this);

            return this;
        },

        pause: function () {
            this.playing = false;
        },

        resume: function () {
            this.playing = true;
        },

        stop: function () {
            this.playing = false;
            this.stopped = true;
        },

        delay: function (delay) {
            this._delay = delay;
            this.pending = true;

            return this;
        },

        repeat: function (num, delay) {
            this._count = 0;
            this._numRepeats = num;
            if (delay) {
                this._repeatDelay = delay;
            } else {
                this._repeatDelay = 0;
            }

            return this;
        },

        loop: function (loop) {
            if (loop) {
                this._count = 0;
                this._numRepeats = Infinity;
            } else {
                this._numRepeats = 0;
            }

            return this;
        },

        yoyo: function (yoyo) {
            this._yoyo = yoyo;
            return this;
        },

        reverse: function () {
            this._reverse = !this._reverse;

            return this;
        },

        chain: function () {
            var n = arguments.length;

            while (n--) {
                if (n > 0) {
                    arguments[n - 1]._chained = arguments[n];
                } else {
                    this._chained = arguments[n];
                }
            }

            return this;
        },

        onUpdate: function (callback) {
            this.on('update', callback);
            return this;
        },

        onComplete: function (callback) {
            this.on('complete', callback);
            return this;
        },

        onLoop: function (callback) {
            this.on('loop', callback);
            return this;
        },

        update: function (dt) {
            if (this.stopped) return false;

            if (!this.playing) return true;

            if (!this._reverse || this.pending) {
                this.time += dt * this.timeScale;
            } else {
                this.time -= dt * this.timeScale;
            }

            // delay start if required
            if (this.pending) {
                if (this.time > this._currentDelay) {
                    if (this._reverse) {
                        this.time = this.duration - (this.time - this._currentDelay);
                    } else {
                        this.time -= this._currentDelay;
                    }
                    this.pending = false;
                } else {
                    return true;
                }
            }

            var _extra = 0;
            if ((!this._reverse && this.time > this.duration) || (this._reverse && this.time < 0)) {
                this._count++;
                this.complete = true;
                this.playing = false;
                if (this._reverse) {
                    _extra = this.duration - this.time;
                    this.time = 0;
                } else {
                    _extra = this.time - this.duration;
                    this.time = this.duration;
                }
            }

            var elapsed = (this.duration === 0) ? 1 : (this.time / this.duration);

            // run easing
            var a = this.easing(elapsed);

            // increment property
            var s, e;
            for (var prop in this._properties) {
                if (this._properties.hasOwnProperty(prop)) {
                    s = this._sv[prop];
                    e = this._ev[prop];
                    this.target[prop] = s + (e - s) * a;
                }
            }

            if (this._slerp) {
                this._quat.slerp(this._fromQuat, this._toQuat, a);
            }

            // if this is a entity property then we should dirty the transform
            if (this.entity) {
                this.entity._dirtifyLocal();

                // apply element property changes
                if (this.element && this.entity.element) {
                    this.entity.element[this.element] = this.target;
                }

                if (this._slerp) {
                    this.entity.setLocalRotation(this._quat);
                }
            }

            this.fire("update", dt);

            if (this.complete) {
                var repeat = this._repeat(_extra);
                if (!repeat) {
                    this.fire("complete", _extra);
                    if (this.entity)
                        this.entity.off('destroy', this.stop, this);
                    if (this._chained) this._chained.start();
                } else {
                    this.fire("loop");
                }

                return repeat;
            }

            return true;
        },

        _repeat: function (extra) {
            // test for repeat conditions
            if (this._count < this._numRepeats) {
                // do a repeat
                if (this._reverse) {
                    this.time = this.duration - extra;
                } else {
                    this.time = extra; // include overspill time
                }
                this.complete = false;
                this.playing = true;

                this._currentDelay = this._repeatDelay;
                this.pending = true;

                if (this._yoyo) {
                    // swap start/end properties
                    for (var prop in this._properties) {
                        var tmp = this._sv[prop];
                        this._sv[prop] = this._ev[prop];
                        this._ev[prop] = tmp;
                    }

                    if (this._slerp) {
                        this._quat.copy(this._fromQuat);
                        this._fromQuat.copy(this._toQuat);
                        this._toQuat.copy(this._quat);
                    }
                }

                return true;
            }
            return false;
        }

    };


    /**
     * Easing methods
     */

    var Linear = function (k) {
        return k;
    };

    var QuadraticIn = function (k) {
        return k * k;
    };

    var QuadraticOut = function (k) {
        return k * (2 - k);
    };

    var QuadraticInOut = function (k) {
        if ((k *= 2) < 1) {
            return 0.5 * k * k;
        }
        return -0.5 * (--k * (k - 2) - 1);
    };

    var CubicIn = function (k) {
        return k * k * k;
    };

    var CubicOut = function (k) {
        return --k * k * k + 1;
    };

    var CubicInOut = function (k) {
        if ((k *= 2) < 1) return 0.5 * k * k * k;
        return 0.5 * ((k -= 2) * k * k + 2);
    };

    var QuarticIn = function (k) {
        return k * k * k * k;
    };

    var QuarticOut = function (k) {
        return 1 - (--k * k * k * k);
    };

    var QuarticInOut = function (k) {
        if ((k *= 2) < 1) return 0.5 * k * k * k * k;
        return -0.5 * ((k -= 2) * k * k * k - 2);
    };

    var QuinticIn = function (k) {
        return k * k * k * k * k;
    };

    var QuinticOut = function (k) {
        return --k * k * k * k * k + 1;
    };

    var QuinticInOut = function (k) {
        if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
        return 0.5 * ((k -= 2) * k * k * k * k + 2);
    };

    var SineIn = function (k) {
        if (k === 0) return 0;
        if (k === 1) return 1;
        return 1 - Math.cos(k * Math.PI / 2);
    };

    var SineOut = function (k) {
        if (k === 0) return 0;
        if (k === 1) return 1;
        return Math.sin(k * Math.PI / 2);
    };

    var SineInOut = function (k) {
        if (k === 0) return 0;
        if (k === 1) return 1;
        return 0.5 * (1 - Math.cos(Math.PI * k));
    };

    var ExponentialIn = function (k) {
        return k === 0 ? 0 : Math.pow(1024, k - 1);
    };

    var ExponentialOut = function (k) {
        return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
    };

    var ExponentialInOut = function (k) {
        if (k === 0) return 0;
        if (k === 1) return 1;
        if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
        return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
    };

    var CircularIn = function (k) {
        return 1 - Math.sqrt(1 - k * k);
    };

    var CircularOut = function (k) {
        return Math.sqrt(1 - (--k * k));
    };

    var CircularInOut = function (k) {
        if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
        return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    };

    var ElasticIn = function (k) {
        var s, a = 0.1, p = 0.4;
        if (k === 0) return 0;
        if (k === 1) return 1;
        if (!a || a < 1) {
            a = 1; s = p / 4;
        } else s = p * Math.asin(1 / a) / (2 * Math.PI);
        return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
    };

    var ElasticOut = function (k) {
        var s, a = 0.1, p = 0.4;
        if (k === 0) return 0;
        if (k === 1) return 1;
        if (!a || a < 1) {
            a = 1; s = p / 4;
        } else s = p * Math.asin(1 / a) / (2 * Math.PI);
        return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
    };

    var ElasticInOut = function (k) {
        var s, a = 0.1, p = 0.4;
        if (k === 0) return 0;
        if (k === 1) return 1;
        if (!a || a < 1) {
            a = 1; s = p / 4;
        } else s = p * Math.asin(1 / a) / (2 * Math.PI);
        if ((k *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
        return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
    };

    var BackIn = function (k) {
        var s = 1.70158;
        return k * k * ((s + 1) * k - s);
    };

    var BackOut = function (k) {
        var s = 1.70158;
        return --k * k * ((s + 1) * k + s) + 1;
    };

    var BackInOut = function (k) {
        var s = 1.70158 * 1.525;
        if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
        return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    };

    var BounceOut = function (k) {
        if (k < (1 / 2.75)) {
            return 7.5625 * k * k;
        } else if (k < (2 / 2.75)) {
            return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
        } else if (k < (2.5 / 2.75)) {
            return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
        }
        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;

    };

    var BounceIn = function (k) {
        return 1 - BounceOut(1 - k);
    };

    var BounceInOut = function (k) {
        if (k < 0.5) return BounceIn(k * 2) * 0.5;
        return BounceOut(k * 2 - 1) * 0.5 + 0.5;
    };

    return {
        TweenManager: TweenManager,
        Tween: Tween,
        Linear: Linear,
        QuadraticIn: QuadraticIn,
        QuadraticOut: QuadraticOut,
        QuadraticInOut: QuadraticInOut,
        CubicIn: CubicIn,
        CubicOut: CubicOut,
        CubicInOut: CubicInOut,
        QuarticIn: QuarticIn,
        QuarticOut: QuarticOut,
        QuarticInOut: QuarticInOut,
        QuinticIn: QuinticIn,
        QuinticOut: QuinticOut,
        QuinticInOut: QuinticInOut,
        SineIn: SineIn,
        SineOut: SineOut,
        SineInOut: SineInOut,
        ExponentialIn: ExponentialIn,
        ExponentialOut: ExponentialOut,
        ExponentialInOut: ExponentialInOut,
        CircularIn: CircularIn,
        CircularOut: CircularOut,
        CircularInOut: CircularInOut,
        BackIn: BackIn,
        BackOut: BackOut,
        BackInOut: BackInOut,
        BounceIn: BounceIn,
        BounceOut: BounceOut,
        BounceInOut: BounceInOut,
        ElasticIn: ElasticIn,
        ElasticOut: ElasticOut,
        ElasticInOut: ElasticInOut
    };
}());

// Expose prototype methods and create a default tween manager on the AppBase
(function () {
    // Add pc.AppBase#addTweenManager method
    pc.AppBase.prototype.addTweenManager = function () {
        this._tweenManager = new pc.TweenManager(this);

        this.on("update", function (dt) {
            this._tweenManager.update(dt);
        });
    };

    // Add pc.AppBase#tween method
    pc.AppBase.prototype.tween = function (target) {
        return new pc.Tween(target, this._tweenManager);
    };

    // Add pc.Entity#tween method
    pc.Entity.prototype.tween = function (target, options) {
        var tween = this._app.tween(target);
        tween.entity = this;

        this.once('destroy', tween.stop, tween);

        if (options && options.element) {
            // specifiy a element property to be updated
            tween.element = options.element;
        }
        return tween;
    };

    // Create a default tween manager on the AppBase
    var AppBase = pc.AppBase.getApplication();
    if (AppBase) {
        AppBase.addTweenManager();
    }
})();


// ShineEffect.js
var ShineEffect = pc.createScript('shineEffect');

ShineEffect.attributes.add('delay', { type: 'number', title: 'Delay' });
ShineEffect.attributes.add('btn', { type: 'entity', title: 'Button' });
ShineEffect.attributes.add('shineStrip', { type: 'entity', title: 'Shine Strip' });


// initialize code called once per entity
ShineEffect.prototype.initialize = function () {
    this.timer = this.delay;

};

ShineEffect.prototype.postInitialize = function () {
    this.onEnable();
};

ShineEffect.prototype.onEnable = function () {
    this.timer = 0;
};

// update code called every frame
ShineEffect.prototype.update = function (dt) {
    this.timer -= dt;
    this.shineStrip.enabled = this.btn.button.active;
    if (this.timer < 0 && this.btn.button.active) {
        this.app.fire('ShineEffect:Play');
        this.timer = this.delay;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// ShineEffect.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// FbRewardedAdHandler.js
class FbRewardedAdhandler {
    constructor(adID, app) {
        this.cooldownTimer = 30;
        this.instance = null;
        this.adID = adID;
        this.app = app;
        this.retryCount = 0;
    }

    load(onComplete) {
        this.stopTimer = true;
        console.log('FbRewardedAdhandler:load: ', this.instance);
        FBInstant.getRewardedVideoAsync(this.adID).then((rewarded) => {
            this.instance = rewarded;
            return this.instance.loadAsync();
        }).then(() => {
            if (onComplete) onComplete(true);
            console.log('FbRewardedAdhandler:load:Success');
        }).catch(err => {
            this.instance = null;
            console.error('FbRewardedAdhandler:load:Failed: ', err);
        });
    }

    show(callback) {
        console.log('FbRewardedAdhandler:show: ', this.instance);
        if (!this.instance) return this.onShowResult('FbRewardedAdhandler: No Instance', callback);

        this.instance.showAsync()
            .then(() => this.onShowResult(null, callback))
            .catch(err => this.onShowResult(err, callback));
    }

    onShowResult(err, callback) {
        console.log('FbRewardedAdhandlerResult: ', err);
        this.cooldownTimer = 0;
        this.instance = null;
        this.retryCount = err === null ? 0 : this.retryCount;
        if (callback) callback(err);
        this.stopTimer = false;
    }

    updateCoolDown(dt) {
        if (this.instance !== null) return;

        this.cooldownTimer -= dt;
        if (!this.stopTimer && this.cooldownTimer <= 0) {
            if (this.retryCount++ > 3) return;
            this.load();
            this.cooldownTimer = 30;
        }
    }
}

// swap method called for script hot-reloading
// inherit your script state here
// FbRewardedAdhandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// FbInterstitialAdHandler.js
class FbInterstitialAdhandler {

    constructor(adID) {
        this.cooldownTimer = 30;
        this.instance = null;
        this.adID = adID;
        this.retryCount = 0;
    }

    load() {
        console.log('FbInterstitialAdhandler:load');
        this.stopTimer = true;
        FBInstant.getInterstitialAdAsync(this.adID).then((interstitial) => {
            this.instance = interstitial;
            return this.instance.loadAsync();
        }).then(() => {
            console.log('FbInterstitialAdhandler:load:Success');
        }).catch(err => {
            console.log('FbInterstitialAdhandler:load:Failed: ', err);
            this.instance = null;
        });
    }

    show(callback) {
        console.log('FbInterstitialAdhandler:show');
        if (!this.instance) return this.onResultShow('FbInterstitialAdhandler: No Instance', callback);

        this.instance.showAsync()
            .then(() => this.onResultShow(null, callback))
            .catch(err => this.onResultShow(err, callback));
    }

    onResultShow(err, callback) {
        console.log('FbInterstitialAdhandler:show:result: ', err);
        this.cooldownTimer = 0;
        this.instance = null;
        this.stopTimer = false;
        this.retryCount = err === null ? 0 : this.retryCount;
        if (callback) callback(err);
    }

    updateCoolDown(dt) {
        if (this.instance !== null) return;

        this.cooldownTimer -= dt;
        if (!this.stopTimer && this.cooldownTimer <= 0) {
            if (this.retryCount++ > 3) return;
            this.load();
            this.cooldownTimer = 30;
        }
    }
};


// swap method called for script hot-reloading
// inherit your script state here
// FbInterstitialAdhandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// FBBannerAdHandler.js
class FbBannerAdhandler {
    constructor(adID) {
        this.cooldownTimer = 45;
        this.adID = adID;
        this.retryCount = 0;
        this.isShowing = false;
        this.canShow = false;
    }

    show(enable) {
        if (!enable) return this.hide();

        console.log('FbBannerAdhandler:show');
        FBInstant.loadBannerAdAsync(this.adID).then(() => {
            this.isShowing = true;
            this.retryCount = 0;
            console.log('FbBannerAdhandler:loadResult:success:');
        }).catch(err => {
            console.log('FbBannerAdhandler:loadResult:failed: ', err);
            this.canShow = true;
            this.cooldownTimer = 45;
        });
    }

    hide() {
        console.log("FbBannerAdhandler:hide: ", this.isShowing, this.instance);
        if (this.isShowing) {
            this.isShowing = false;
            this.canShow = false;
            this.retryCount = 0;
            FBInstant.hideBannerAdAsync();
        }
    }

    updateCoolDown(dt) {
        if (!this.canShow) return;

        this.cooldownTimer -= dt;
        if (!this.isShowing && this.cooldownTimer <= 0) {
            if (this.retryCount++ > 3) return;
            this.show();
            this.cooldownTimer = 45;
        }
    }


}
// swap method called for script hot-reloading
// inherit your script state here
// FbbannerAdhandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// friendChallengeManager.js
var FriendChallengeManager = pc.createScript('friendChallengeManager');

FriendChallengeManager.attributes.add('challenge', { type: 'entity', title: 'Friend Challenge' });
FriendChallengeManager.attributes.add('newChallenge', { type: 'entity', title: 'New Friend Challenge' });



// initialize code called once per entity
FriendChallengeManager.prototype.initialize = function () {
    this.app.loader.getHandler("texture").crossOrigin = "anonymous";
    this.progressText = null;
    this.target = 0;
    this.challengeCompleted = true;
    this.on('enable', this.onEnable, this);
    this.on('disable', this.onDisable, this);
};

FriendChallengeManager.prototype.postInitialize = function () {
    this.onEnable();
};

FriendChallengeManager.prototype.onEnable = function () {
    this.app.on('FriendChallenge:NewChallenge', this.setNewChallenge, this);
    this.app.on('FriendChallenge:Set', this.setChallenge, this);
    this.app.on('FriendChallenge:UpdateProgress', this.updateProgress, this);
};

FriendChallengeManager.prototype.onDisable = function () {
    this.app.off('FriendChallenge:NewChallenge', this.setNewChallenge, this);
    this.app.off('FriendChallenge:Set', this.setChallenge, this);
    this.app.off('FriendChallenge:UpdateProgress', this.updateProgress, this);
};

// update code called every frame
FriendChallengeManager.prototype.update = function (dt) {

};

FriendChallengeManager.prototype.setChallenge = function (name, target) {
    console.log('FriendChallenge:SetChallenge: ', name, target);
    this.progressText = null;
    this.target = target+1;
    this.progressText = `${0}/${this.target}`;
    let description = `Beat ${name}'s score`;
    this.challenge.fire('Set:Progress', this.progressText);
    this.challenge.fire('Set:Title', true, "VS MODE", true);
    this.challenge.fire('Set:Description', description);
    this.challenge.fire('Show', true, true);
};

FriendChallengeManager.prototype.setNewChallenge = function (name, target) {
    console.log('FriendChallenge:SetNewChallenge: ', name, target);
    let description = `Beat ${name}'s score`;
    this.newChallenge.fire('Set:Title', true, "VS MODE", true);
    this.newChallenge.fire('Set:Description', description);
    this.newChallenge.fire('Show', true, true);
    this.challengeCompleted = false;
    CustomCoroutine.Instance.set(() => {
        this.newChallenge.fire('Show', false, true);
        this.challenge.fire('Completed', false);
        this.setChallenge(name, target);
    }, 2);
};

FriendChallengeManager.prototype.updateProgress = function (currProgress) {
    if (!SdkManager.Instance.challengeMode) return;
    if (currProgress > this.target) currProgress = this.target;
    if(this.challengeCompleted) return;
    let currScore = currProgress;
    console.log('FriendChallenge:Updating Progress Bar');

    this.progressText = `${currProgress}/${this.target}`;
    currProgress = this.target - currProgress;
    currProgress = (this.target - currProgress) / this.target;
    console.log('FriendChallenge:Current Progress: ', currProgress);
    this.challenge.fire('Set:Progress', this.progressText, currProgress);

    if (this.target <= currScore) {
        this.app.fire('SoundManager:Play', 'MissionCompleted');
        this.challenge.fire('Completed', true);
        this.challenge.fire('Show', false, true);
        this.challengeCompleted = true;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// FriendChallengeManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// GameAnalyticsManager.js
var GameAnalyticsManager = pc.createScript('gameAnalyticsManager');

GameAnalyticsManager.attributes.add('key', {
    title: 'Keys',
    type: 'json',
    schema: [
        { name: "game", type: 'string', title: 'Game', default: '462983d024432959bf0205b2fa31486d'},
        { name: "secret", type: 'string', title: 'Secret', default: '22cc38c4c0098cd7d378cf1c0c74f1af4f9917b4'},
    ]
});

// initialize code called once per entity
GameAnalyticsManager.prototype.initialize = function() {
    // gameanalytics.GameAnalytics.setEnabledInfoLog(true);
    // gameanalytics.GameAnalytics.setEnabledVerboseLog(true);
    gameanalytics.GameAnalytics.configureBuild("0.10");

    gameanalytics.GameAnalytics.initialize(this.key.game, this.key.secret);
    console.log("GameAnalyticsManager:initialize");
};

// update code called every frame
GameAnalyticsManager.prototype.update = function(dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// GameAnalyticsManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// GDAdHandler.js
var GdadHandler = pc.createScript('gdadHandler');

GdadHandler.attributes.add('manager', { type: 'entity', title: 'GD Manager' });

// initialize code called once per entity
GdadHandler.prototype.initialize = function () {
    this.entity.on('Show:Ad', this.showAd, this);
    this.entity.on('Ads:Preload', this.preload, this);
    this.entity.on('SdkManager:EditorMode', this.switchMode, this);
    this.entity.on('GDAdResult', this.onResultShow, this);
    // this.isEditorMode = true;
    this.currentAd = null;
    this.rewardedAd = new GdRewardedAdhandler(this);
    this.interstitialAd = new GdInterstitialAdhandler(this);
    this.bannerAd = new GdBannerAdhandler(this);
};

GdadHandler.prototype.postInitialize = function () {
    this.managerScript = this.manager.script.gameDistributionManager;
};

// update code called every frame
GdadHandler.prototype.update = function (dt) {
    if (this.isEditorMode) return;
    this.rewardedAd.updateCoolDown(dt);
    this.interstitialAd.updateCoolDown(dt);
    // this.bannerAd.updateCoolDown(dt);
};

GdadHandler.prototype.switchMode = function (mode) {
    console.log('%cGD%c:AdHandler:switchMode: ', "color: cyan;", "", mode);
    this.isEditorMode = mode;
};

GdadHandler.prototype.preload = function () {
    console.log('%cGD%c:AdHandler:preload', "color: cyan;", "");
    this.loadInterstitialAd();
    this.loadRewardedAd();
};

GdadHandler.prototype.showAd = function (adType, testSettings, callback, enable) {
    console.log('%cGD%c:AdHandler:showAd', "color: cyan;", "", adType, enable);
    if (adType != 'Banner') {
        this.currentAd = adType;
        AdsManager.Instance.showAdLoading('Loading Ad...', true);
    }
    switch (adType) {
        case 'Interstitial': return this.showInterstitialAd(testSettings, callback);
        case 'Rewarded': return this.showRewardedAd(testSettings, callback);
        case 'Banner': return this.showBannerAd(testSettings, callback, enable);
        default: return console.error('Invalid Ad Type');
    }
}

// ****************
// * Interstitial *
// ****************

GdadHandler.prototype.loadInterstitialAd = function () {
    this.interstitialAd.load();
}

GdadHandler.prototype.showInterstitialAd = function (testSettings, callback) {
    if (testSettings.isEditor) {
        // this.app.fire('SoundManager:Mute', true);
        this.app.fire('SoundManager:PauseGameSound', true);
        // this.app.fire('SoundManager:Stop', 'TitleScreen');
        AdsManager.Instance.showAd(() => {
            if (callback) callback(testSettings.isSuccessful ? null : "Failed to show add. Unknown reason")
            this.app.fire('SoundManager:PauseGameSound', false);

        });
        return;
    }
    this.interstitialAd.show(callback);
};

// ************
// * Rewarded *
// ************

GdadHandler.prototype.loadRewardedAd = function () {
    this.rewardedAd.load();
};

GdadHandler.prototype.showRewardedAd = function (testSettings, callback) {

    if (testSettings.isEditor) {
        // this.app.fire('SoundManager:Mute', true);
        this.app.fire('SoundManager:PauseGameSound', true);
        //  this.app.fire('SoundManager:Stop', 'TitleScreen');
        AdsManager.Instance.showAd(() => {
            if (callback) callback(testSettings.isSuccessful ? null : "Failed to show add. Unknown reason")
            this.app.fire('SoundManager:PauseGameSound', false);
            // this.app.fire('SoundManager:Mute', false);
            // this.app.fire('SoundManager:Resume', 'TitleScreen');
        });
        return;
    }

    this.manager.fire('RewaredAdLoaded', false);
    this.rewardedAd.show(callback);
};

GdadHandler.prototype.onResultShow = function (isSuccess) {
    if (this.currentAd == null) return;
    if (this.currentAd == 'Rewarded') {
        this.rewardedAd.onShowResult(isSuccess);
    }
    else if (this.currentAd == 'Interstitial')
        this.interstitialAd.onShowResult(isSuccess);
    this.currentAd = null;
}

// **********
// * Banner *
// **********

GdadHandler.prototype.showBannerAd = function (testSettings, callback, enable) {
    // if (testSettings.isEditor) {
    //     if (callback) callback(testSettings.isSuccessful ? null : "Failed to show add. Unknown reason");
    //     if (enable) {
    //         GameDistributionManager.Instance.container.style.display = 'block';
    //     }
    //     else {
    //         GameDistributionManager.Instance.container.style.display = 'none';
    //     }
    //     return;
    // }
    // this.bannerAd.show(enable);
};

// swap method called for script hot-reloading
// inherit your script state here
// GdadHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// GDDataHandler.js
var GddataHandler = pc.createScript('gddataHandler');

GddataHandler.prototype.initialize = function () {
    this.entity.on('Data:Set', this.setData, this);
    this.entity.on('Data:Get', this.getData, this);
};

// update code called every frame
GddataHandler.prototype.update = function (dt) {

};

GddataHandler.prototype.setData = function (testSettings, data, callback) {
    //  if (testSettings.isEditor)
    return this.localStorageSave(testSettings, data, callback);

    //this.save(data, callback);
};

GddataHandler.prototype.localStorageSave = function (testSettings, data, callback) {
    console.log('%cGD%c:Data:Set', "color: cyan;", "");
  //  console.log('Saving...CurrentShirt: ', data['CurrentShirt'], data['CurrentHat']);
    localStorage.setItem('CompletedMissions', data['CompletedMissions']);
    localStorage.setItem('GameCount', data['GameCount']);
    localStorage.setItem('BestScore', data['BestScore']);
    localStorage.setItem('Coins', data['Coins']);
    localStorage.setItem('CurrentTheme', data['CurrentTheme']);
    localStorage.setItem('CurrentBox', data['CurrentBox']);
    localStorage.setItem('CurrentShirt', data['CurrentShirt']);
    localStorage.setItem('CurrentHat', data['CurrentHat']);
    localStorage.setItem('UnlockedItems', data['UnlockedItems']);
    localStorage.setItem('RandomUnlockPrice', data['RandomUnlockPrice']);
    if (callback) return callback(testSettings.isSuccessful ? null : "Failed to store Data. Unknown reason");
};

GddataHandler.prototype.save = function (data, callback) {
    console.log('GddataHandler:Save: ', data, callback);
};

GddataHandler.prototype.getData = function (testSettings, callback) {
    //  if (testSettings.isEditor)
    return this.localStorageLoad(testSettings, callback);

    //   this.load(callback);
};

GddataHandler.prototype.localStorageLoad = function (testSettings, callback) {
    console.log('%cGD%c:Data:Get', "color: cyan;", "");
    let data = {
        CompletedMissions: this.getItemFromLocalStorage('CompletedMissions', 0),
        GameCount: this.getItemFromLocalStorage('GameCount', 0),
        BestScore: this.getItemFromLocalStorage('BestScore', 0),
        RandomUnlockPrice: this.getItemFromLocalStorage('RandomUnlockPrice', EconomyManager.Instance.randomUnlockSettings[0].basePrice),
        Coins: this.getItemFromLocalStorage('Coins', EconomyManager.Instance.defaultCoins),
        CurrentTheme: this.getItemFromLocalStorage('CurrentTheme', ThemeController.Instance.defaultTexture),
        CurrentBox: this.getItemFromLocalStorage('CurrentBox', ThemeController.Instance.defaultTexture),
        CurrentShirt: this.getItemFromLocalStorage('CurrentShirt', DataManager.Instance.currentShirt),
        CurrentHat: this.getItemFromLocalStorage('CurrentHat', DataManager.Instance.currentHat),
        UnlockedItems: this.getItemFromLocalStorage('UnlockedItems', null),
    }
    if (callback) callback(testSettings.isSuccessful ? data : null, testSettings.isSuccessful ? null : "Failed to retrieve data. Unknown reason");
    return;
};

GddataHandler.prototype.load = function (callback) {
    console.log('GddataHandler:Load: ', callback);
};

GddataHandler.prototype.getItemFromLocalStorage = function (key, defaultValue) {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
        if (key == 'UnlockedItems' || key == 'CurrentBox' || key == 'CurrentTheme' || key == 'CurrentHat' || key == 'CurrentShirt') {
            return storedValue;
        }
        return parseInt(storedValue);
    } else {
        return defaultValue;
    }
};
// swap method called for script hot-reloading
// inherit your script state here
// GddataHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// GameDistributionManager.js
var GameDistributionManager = pc.createScript('gameDistributionManager');

GameDistributionManager.attributes.add('gameID', { type: 'string', title: 'Game ID', default: '21e669394e34431197b6689fd8f9b064' });
GameDistributionManager.attributes.add('adHandler', { type: 'entity', title: 'Ad Handler' });
GameDistributionManager.attributes.add('dataHandler', { type: 'entity', title: 'Data Handler' });

// ************************
// * Playcanvas Callbacks *
// ************************

GameDistributionManager.prototype.initialize = function () {
    GameDistributionManager.Instance = this;
    this.container = null;

    this.registerEvents();
};

// **********************
// * initialize Helpers *
// **********************

GameDistributionManager.prototype.registerEvents = function () {
    // Initialising
    this.entity.on('Initialise:API', this.initAPI, this);

    // Ads
    this.entity.on('Show:Ad', this.showAd, this);
    this.entity.on('RewaredAdLoaded', this.onRewaredAdLoaded, this);
    this.entity.on('AdContainer:SetDisplay', this.adContainerDisplay, this);

    // Data
    this.entity.on('Data:Set', this.setData, this);
    this.entity.on('Data:Get', this.getData, this);
};


GameDistributionManager.prototype.initAPI = function (testSettings, callback) {
    console.log('%cGD%c:Manager:initAPI: ', "color: cyan;", "", testSettings);
    this.adHandler.fire('SdkManager:EditorMode', testSettings.isEditor);

    if (callback) callback();
    // this.createContainer();
    if (testSettings.isEditor) return;

    this.setupEvents(testSettings);

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://html5.api.gamedistribution.com/main.min.js';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'gamedistribution-jssdk'));
};

GameDistributionManager.prototype.setupEvents = function (testSettings) {
    window["GD_OPTIONS"] = {
        "gameId": this.gameID,
        "onEvent": (event) => {
            console.log("%cGD%c:OnEvent: ", 'color: cyan', "", event);
            switch (event.name) {
                case "SDK_READY":
                    return this.onEvent_SDK_READY(testSettings);
                case "SDK_GAME_START":
                    return this.onEvent_SDK_GAME_START();
                case "SDK_GAME_PAUSE":
                    return this.onEvent_SDK_GAME_PAUSE();
                case "SDK_REWARDED_WATCH_COMPLETE":
                    return this.onEvent_SDK_REWARDED_WATCH_COMPLETE();
                case "SKIPPED": case "AD_SDK_CANCELED": case "USER_CLOSE":
                    return this.onEvent_SDK_AD_SKIPPED_CLOSED_CANCELED();
                case "AD_ERROR":
                    return this.onEvent_AD_ERROR(event);
                case "COMPLETE":
                    return this.onEvent_COMPLETE();
            }
        },
    };
};

GameDistributionManager.prototype.onEvent_SDK_READY = function (testSettings) {
    if (!testSettings.isEditor)
        this.adHandler.fire('Ads:Preload');
};

GameDistributionManager.prototype.onEvent_SDK_GAME_START = function () {
    // advertisement done, resume game logic and unmute audio
    this.app.timeScale = 1;
    AdsManager.Instance.showAdLoading('Loading Ad...', false);
    this.adHandler.fire('GDAdResult', false);
    this.app.fire('SoundManager:PauseGameSound', false);
};

GameDistributionManager.prototype.onEvent_SDK_GAME_PAUSE = function () {
    // pause game logic / mute audio
    this.app.fire('SoundManager:PauseGameSound', true);
    this.app.timeScale = 0;
};

GameDistributionManager.prototype.onEvent_SDK_REWARDED_WATCH_COMPLETE = function () {
    // this event is triggered when your user completely watched rewarded ad
    this.adHandler.fire('GDAdResult', true);
};

GameDistributionManager.prototype.onEvent_SDK_AD_SKIPPED_CLOSED_CANCELED = function () {
    this.adHandler.fire('GDAdResult', false);
};

GameDistributionManager.prototype.onEvent_AD_ERROR = function (event) {
    let letOnComplete = true;

    // if Ad_Error event is only warning
    if (event && event.name === 'AD_ERROR')
        letOnComplete = event.status !== 'warning';

    if (letOnComplete) this.adHandler.fire('GDAdResult', false);
};

GameDistributionManager.prototype.onEvent_COMPLETE = function () {
    this.adHandler.fire('GDAdResult', true);
};

GameDistributionManager.prototype.createContainer = function () {
    var container = document.createElement('div');

    // Set attributes or styles
    container.style.position = 'fixed';
    container.style.bottom = '1%';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.width = '728px';
    container.style.height = '90px';
    container.style.backgroundColor = '#f0f0f0';
    // Add any additional styles as needed

    // Assign an id to the container
    container.id = 'banner';

    // Append the container to the body
    document.body.appendChild(container);
    this.container = container;
    this.container.style.display = 'None';
};

// **********************
// * Ad Functions *
// **********************

GameDistributionManager.prototype.showAd = function (adType, testSettings, callback, enable) {
    this.adHandler.fire('Show:Ad', adType, testSettings, callback, enable)
};

GameDistributionManager.prototype.onRewaredAdLoaded = function (isLoaded) {
    this.app.fire('SdkManager:RewaredAdLoaded', isLoaded);
};

GameDistributionManager.prototype.adContainerDisplay = function (mode) {
    console.log("%cGD%c:Manager:adContainerDisplay: ", "color: cyan;", "", mode);
    this.container.style.display = mode;
}

// **********************
// * Data Functions *
// **********************

GameDistributionManager.prototype.setData = function (testSettings, data, callback) {
    this.dataHandler.fire('Data:Set', testSettings, data, callback);
};

GameDistributionManager.prototype.getData = function (testSettings, callback) {
    this.dataHandler.fire('Data:Get', testSettings, callback);
};



// swap method called for script hot-reloading
// inherit your script state here
// GameDistributionManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// GDBannerAdHandler.js
class GdBannerAdhandler {
    constructor(handler) {
        this.cooldownTimer = 45;
        this.retryCount = 0;
        this.isShowing = false;
        this.canShow = false;
        this.manager = handler.manager;
        this.isLoaded = false;
    }

    show(enable) {
        if (!enable) return this.hide();
        this.manager.fire('AdContainer:SetDisplay', 'block');
        this.isShowing = true;
        this.canShow = true;
        if (!this.isLoaded) {
            window.gdsdk
                .showAd(window.gdsdk.AdType.Display, { containerId: "banner" })
                .then(() => {
                    this.isLoaded = true;
                    console.log('%cGD%c:Banner:show: ', "color: cyan;", "", this.isShowing)
                })
                .catch(error => console.log('%cGD%c:Banner:show:Err: ', "color: cyan;", "", error));
        }
    }

    hide() {
        console.log("%cGD%c:Banner:hide: ", "color: cyan;", "", this.isShowing);
        if (this.isShowing) {
            this.isShowing = false;
            this.canShow = false;
            this.retryCount = 0;
            this.manager.fire('AdContainer:SetDisplay', 'None');
        }
    }

    updateCoolDown(dt) {
        if (!this.canShow) return;

        this.cooldownTimer -= dt;
        if (!this.isShowing && this.cooldownTimer <= 0) {
            if (this.retryCount++ > 3) return;
            this.show();
            this.cooldownTimer = 45;
        }
    }


}
// swap method called for script hot-reloading
// inherit your script state here
// GD:Banner.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// GDRewardedAdHandler.js
class GdRewardedAdhandler {
    constructor(handler) {
        this.app = handler.app;
        this.manager = handler.manager;
        this.handler = handler;

        this.cooldownTimer = 30;
        this.retryCount = 0;
        this.isLoaded = false;
        this.stopTimer = false;

        this.callback = null;
        this.err = null;
    }

    load() {
        this.stopTimer = true;
       // console.log('%cGD%c:Rewarded:load: ', gdsdk);
        if (gdsdk != undefined && gdsdk.preloadAd != undefined) {
            gdsdk
                .preloadAd('rewarded')
                .then(response => {
                    console.log('%cGD%c:Rewarded:load:Success ', "color: cyan;", "", response);
                    this.manager.fire('RewaredAdLoaded', true);
                    this.isLoaded = true;
                    // A rewarded ad can be shown to user when he/she clicked it.
                })
                .catch(error => {
                    console.log('%cGD%c:Rewarded:load:Failed ', "color: cyan;", "", error);
                    // Any Rewarded ad is not available to user.
                });
        }
        else {
            if (gdsdk) {
                console.log('%cGD%c:Rewarded:PRELOADAD: ', "color: cyan;", "", gdsdk.preloadAd);
            }
        }
    }

    show(callback) {
        console.log('%cGD%c:Rewarded:show: ', "color: cyan;", "", {callback: callback});
        if (gdsdk != undefined && gdsdk.showAd != undefined) {
            this.callback = callback;
            this.err = null;
            this.isLoaded = false;
            gdsdk.showAd('rewarded')
                .then(response => {
                    console.log('%cGD%c:Rewarded:show:success: ', "color: cyan;", "", response);
                    this.handler.onResultShow(true);

                })
                .catch(error => {
                    console.log('%cGD%c:Rewarded:show:error: ', "color: cyan;", "", error);
                    this.err = error;
                    this.handler.onResultShow(false);
                });
        }
        else {
            console.log('%cGD%c:Rewarded:show: ', "color: cyan;", "", gdsdk);
            if (gdsdk) {
                console.log('%cGD%c:Rewarded:show:SHOWAD: ', "color: cyan;", "", gdsdk.showAd);
            }
        }
    }

    onShowResult(isSuccess) {
        if (isSuccess) this.err = null;
        else if (this.err == null) this.err = "User did not watch the whole ad.";
        console.log('%cGD%c:RewardedResult: ', "color: cyan;", "", this.err, this.callback);
        this.cooldownTimer = 0;
        this.retryCount = this.err === null ? 0 : this.retryCount;
        if (this.callback) this.callback(this.err);
        this.callback = null;
        this.err = null;
        this.stopTimer = false;
    }

    updateCoolDown(dt) {
        if (this.isLoaded) return;
        this.cooldownTimer -= dt;
        if (!this.stopTimer && this.cooldownTimer <= 0) {
            if (this.retryCount++ > 3) return;
            this.load();
            this.cooldownTimer = 30;
        }
    }
}

// swap method called for script hot-reloading
// inherit your script state here
// %cGD%c:Rewarded.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// GDInterstitialAdHandler.js
class GdInterstitialAdhandler {

    constructor(handler) {
        this.handler = handler;

        this.showCooldown = 0;
        this.cooldownTimer = 30;
        this.retryCount = 0;
        this.callback = null;
        this.err = null;
        this.isLoaded = false;
    }

    load() {
        console.log('%cGD%c:Interstitial:load: ', "color: cyan;", "", gdsdk);
        if (gdsdk != undefined && gdsdk.preloadAd != undefined) {
            gdsdk
                .preloadAd()
                .then(response => {
                    this.isLoaded = true;
                    console.log('%cGD%c:Interstitial:load:Sucess ', "color: cyan;", "", response);
                    // A rewarded ad can be shown to user when he/she clicked it.
                })
                .catch(error => {
                    console.log('%cGD%c:Interstitial:load:Failed ', "color: cyan;", "", error);
                    // Any Rewarded ad is not available to user.
                });
        }
        else {
            if (gdsdk) {
                console.log('%cGD%c:Interstitial:load:preload: ', "color: cyan;", "", gdsdk.showAd);
            }
        }
        this.stopTimer = true;
    }

    show(callback) {
        console.log('%cGD%c:Interstitial:show: ', "color: cyan;", "", gdsdk);

        this.callback = callback;
        this.isLoaded = false;

        if (gdsdk === undefined || gdsdk.showAd === undefined) {
            if (gdsdk) {
                console.log('%cGD%c:Interstitial:show:AD: ', "color: cyan;", "", gdsdk.showAd);
            }
            return;
        }

        gdsdk.showAd()
            .then(response => {
                console.log('%cGD%c:Interstitial:show:success: ', "color: cyan;", "", response);
                this.handler.onResultShow(true);
            })
            .catch(error => {
                console.log('%cGD%c:Interstitial:show:error: ', "color: cyan;", "", error);
                this.err = error;
                this.handler.onResultShow(false);
            });
    }

    onShowResult(isSuccess) {
        if (isSuccess) this.err = null;
        else if (this.err === null) this.err = "User did not watch the whole ad.";

        console.log('%cGD%c:Interstitial:onShowResult: ', "color: cyan;", "", this.err, {callback: this.callback});

        this.cooldownTimer = 0;
        this.stopTimer = false;
        this.retryCount = this.err === null ? 0 : this.retryCount;
        if (this.callback) this.callback(this.err);
        this.callback = null;
        this.err = null;
    }

    updateCoolDown(dt) {
        this.updatePreloadCooldown(dt);
    }

    updatePreloadCooldown(dt) {
        if (this.isLoaded) return;
        this.cooldownTimer -= dt;
        if (!this.stopTimer && this.cooldownTimer <= 0) {
            if (this.retryCount++ > 3) return;
            this.load();
            this.cooldownTimer = 30;
        }
    }
};


// swap method called for script hot-reloading
// inherit your script state here
// %cGD%c:Interstitial.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// loading.js
pc.script.createLoadingScreen(function (app) {
    var showSplash = function () {
        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'none';

        var logo = document.createElement('img');
        logo.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABDYAAAESCAYAAAAG1lXLAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAUrZJREFUeJztnQncblPZ/6/nec7sOKNzHGfmOMeZDxlfFJI5yVCmvOhFhgzhHw2yUygKFUlFImSolHlWvamQIRHJXJEpCRneWv91Pfs8OY7nee697nvvva597+/38/l+KnHsdd37HtZvr3UtEQAAgHrT4R3jneFdzbuJ9/3efZZyR+/W3vW887xTvSMiXC9A3RnsneCd7V1H0vflzvLW9+vekr6Pt/Su6V1l8T8zOML1AgAAAAAA5M5o7xre/b2nem/wPux9w+sy+IL3Xu8V3hO8u3vf4R1b5iAAasJASYPETb2f8J7n/ZX3Kcn2fv2398nF/8wF3qO87/PO8g4tcRwAAAAAAAAtMcS7wHuI93rvq5JtUpTVF703Sjrx0qfIy5YzLIC2ZaT3PZKGjxok/kvyfc8+4T3fu6d3pndAOcMCAAAAAAAIQwONdb2nS/YnvK2qKzoulnRSNqz4IQK0Fbqianvv5d7XpZz3rK7Y0tVXus2ss/ghAgAAAAAANEZ7Z8z3ftX7nJQzOVraf0q6bF6DFZ4GA/TPIEl7Ylwt+a/OyKpuWUm8U4odKgAAAAAAQP/oNpC9vA9KnMnR0v7Ne7R3fJGDBqgwGiScImkYGPv9qt4jaR+OQUUOGgAAAAAAoDdW9H7T+4rEnxwtqTYwvMq7SNLVJACQspH3Lon/Hl1aDVmOl7TXBwAAAAAAQCnoka03SRoixJ4U9eVDkp7uwD5+qDsa8O0k8baKZfVCSY+KBQAAAAAAKJTVvH+U+JOgLP7Du7MQbkB90VBjH8l+xHJsH/BOK6QSAAAAAAAAkh7jqqcaxJ78hIYbmwvbUqB+9IQar0n892GId3iHF1APAAAAAACoOdp08LcSf9LTjH/xzsm/JACm2VaqF2r0+G3hhCMAAAAAAMgRfXp6vcSf7LTixd5ReRcGwCirel+U+O+7ZtVjaPfMvSoAAAAAAFBLurzHSTrRiD3ZaXWidJDQbwPaHz1d5HcS/z3XqhrMrJhzbQAAAAAAoIZs4H1J4k9y8vAR77x8ywNgjpMl/nstL38o9McBAADIhO7hHOGdKOkRhrO8qy9258Xu7U0y+knvrov/ufcu/nMWLf5zp0p6lJku6+apIQBYZ1nv7RJ/cpOnXxb27kP7spZU5wSULOpKq/VzrRAAAEBF0aRfl2VOk7Sj//u8h3u/5b3Oe5f3D5I2l/ubFLMn9Y3Ff+7T3j9575e06/dPvCd695P0qehcSQOWYYVUAgAgjH29/yfxJzd5+oykR9YCtBu6beynEv89lrfXCqs2AACgZujTRX1aoSsmjvGe573F+6CkP2atdwd/RdKA5T7vjd5vev+fdztJO/rzlBEAykJD1scl/udiER4v6SQQoJ3YWuK/t4pQV22snWOdAAAATKHp/SRJv8g1xLhE0tUXT4r9ACPUl72Pen/tPUfSsOOd3tGtFhEAoA8O9v5b4n/+FaGGx9PyKxVAdDSou1Xiv7eK8oz8SgUAABCf8ZIGGcd6r/Y+INU+zqwVdQWKdj2/yHuEpEHHkOZLCwDwH3T1290S/3OuKPUJ8E65VQsgPrqioeonF/XnC5J+LgEAAFQSfQKxUNIj+i6Q9ClbXYOMRmrQoU3+TvfuJukycgCAZtBJ0j8l/udakZ4qbO+D9uGrEv89VbTvya1aAAAAJaA/NLWxmzb4vMr7hLT3U4gi1K04uppFe4zsISy5BoAwviLxP8eK9jdCAAztga7W1Obksd9TRXtCXgUDAAAoCl2ZMdt7qKRhhp4cQpiRj69KGnKcK+nS6+UyviYAUE/0OGrd5hb7s6toX/euk1PNAGKyhsR/P5XhPXkVDAAAIG+0+eUukm4zeVTa6+x1i+qpK9pg9UuS9uQY2PAVAoC6MUvqs+Vvt5xqBhCTAyT+e6kM9TcifTYAAMAUujrjU5J28NYTP2J/WdZNPelAe3JoA9YPecf0/3IBQI3QfeztehrK0h6XU80AYqK9tWK/l8py9ZxqBgAA0BKbeL8p6eqMuvxwtq6u4tC95kdJ+qQWAOrNgRL/c6ksz/cOyqdsANG4QeK/l8pyu5xqBgAAEIw2tdLlvg9K/C9E7F9d5vk975rejt5eTABoe06S+J9FZflToe8QVJvx3t9L/PdSWR6aT9kAAACyM8y7t/cpif9FiGFq49ZrvRtJ2tgVAOrBUO/FEv8zqCz1CPFpuVQOIA66NeMvEv+9VJan5FM2AACAxugKjX2EQKNdvMy7thBwANQB7bdTp2XtOiFkCx5UmS28L0j891KZv0kAAAAKRU/Y2NH7kMT/4sN81S0qelzsfGGLCkA7M9F7u8T/zClLPQ57US6VA4jDNt6XJP57qSwJNgAAoFC0KegdEv8LD4tVJwG6DHSSAEA7Mtl7t8T/rClTTlmAKqMrZGO/h8r0gXzKBgAA8FZ0Ca+m57G/6LBcddnrIcJ58gDthn6m12m/vkqwAVWGYAMAAKAFdEL7OYn/BYdxvde7qXeAAEA7QLABUC0INgAAAJpEt53ohDb2lxva8RzvSAGAqjPNe7/E/0wpU4INqDJ1CzZ+m0/ZAACgzmhTubO8r0n8Lza057Pe9woAVJm6NQ/9u6RNkQGqyg7eVyT+e6ksaR4KAABNo9sMPup9RuJ/oaF9f+adIgBQRSZ4fyXxP0fKkuNeoeps7X1R4r+XyvKcfMoGAAB1Y5r3au+/JP6XGVZH/ZG1vwBA1dD+SXVqCK2rUybmUjmAOKzjfUriv5fK8vh8ygYAAHViJ++fJf6XGFZXnSCNFgCoCl2SbjmM/dlRlld4R+RSOYA4rOx9WOK/l8py93zKBgAAdWCQ93Shlwbm4+PejQUAqsKxEv9zoyy/mlPNAGIxzHu3xH8vleU78ykbAAC0O5O8N0n8Ly5sL1/37iUAUAX2lvifGWV5UE41A4iJbhmO/V4qy0k51QwAANoYTcEfk/hfWti+atOvIQIAltHvgtifFWXJ019oB06S+O+lMnwkr4IBAEB70ilpo8eXJf6XFra/t3mXFwCwiu7Zf0Hif1YU7T3CCU7QHuwr8d9PZcjWMQAA6BN9en6G9w2J/4WF9VE7uK8hAGCR4d77Jf7nRNHqd9+AnGoGEJO1Jf77qQw3zatgAADQXszxXi/xv6iwnr7kPUDYmgJgkS9L/M+IItUjzN+fW7UA4jLQ+7TEf18VqY6P3wsAAPAWOiQ99/wuif9FhfVWVwodI+kTYgCwg35HvCrxPyOK8k7v5NyqBRAf3aYR+31VpCfmVyoAAGgHtJ/G+lKvM8/RvrokfIQAgBVGeu+T+J8NRXmkpCE/QLuwnsR/XxWlPgSZk1+pAACg6nR5N/Y+IPG/pBCXVsON5QQArPAp778l/mdD3mqwPzvHOgFYQLej3Cvx319FeGmOdQIAgIqjDdJ0PzHHuaJV9YnM2UK4AWCFqZI2+o392ZCnGtR8WtKgH6Dd2E3iv8fy9p/e1fIsEgAAVBcNNbbz/kXif0Eh9ifhBoAddKvGSdJeqzbu9s7Is0gAhlhW2m9V7um5VggAACoLoQZWTcINADtM8z4i8T8X8vAVSZ9oA7QzO0p66k/s91se6irjifmWBwAAqog2Cn2fEGpg9STcALDDvt7XJf7nQivqqhN98ssJTNDuaK+N6yT+e65VX/NunXNtAACggmiosaH3QYn/5YTYjBpunCXp6QwAEI9h3kuk2ltS9ISXFfMuDIBRZkn1++N8MfeqAABA5dB90Xr6ydMS/4sJsRV7Vm7ovmEAiMc4760S/zOhGf/kXZB/SQBM825JG2/Gfv8142WSbqUGAICas5b3IYn/xYSYhxpuaAPDIQIAMZkj6VGpsT8TQtSAf+MiigFQAfaSdEtH7PdhiL8SHmYAAICkyw9/I/G/mBDzVJ86fVx4ggMQGz12sSrhhi7F11Cjo5BKANhH7/19pDrhxs+9YwupBAAAVIpB3ssl/hcTYhG+IJxoAGCBRd7fSfzPhP6837umEGoA9IQblrelaP8e7ePDSg0AAOhGGy1VubkbYiN1r7wuhweAuEzy3uz9P4n/ubCkej16IsS0wkYOUD003NjB+6zEf48urR7D/HlJH84BAADIHpL2Ioj9BYVYtLr/drQAQGz0ffgF798k/ueC+pz3COFIV4C+0O3K13j/JfHfr+rvvRsVOmIAAKgU2u39RYn/BYVYhroq6XvC0x0AC3R51/BeIemT1xifCa8t/vcvFLaeADRCG3Hv7n1A4q3y1RBSV2nQTwMAAP7DSEm/nGJPNhHLVFcnHeLtFACwgE6W9MnrVd6/SzmfAy97f+rdxju4+CECtBW64kpPTblXylvxqw19zxCOXwYAgKXQSZ02W4o9yUSMoS5/X18AwBIDJe2Dc4z3bu9Lku/7/lXvH72nSbpShGOgAVpDG3ZqKHm+93HJP+TQxt+6hfRg73RJV3kBAAC8haOFZqFYb/XkgxUFACwyzDtb0qaFn/VeIOkE5y+S7f2tIcYfJO0JcLJ3T0mPmx1T5iAAasR47zqSruTQ99xlkp6ApFtHsrxnn/He7r3Ym3jf550prKgCAIB+eKfk/yQMsWr2HBGnEygAsI1ObiZI2sBwdUmfEm/tfb+kx1Gq2y3+a/odp8fKanA5SuidAVA2+p7T1RxTvHO9a3k3k/T9ubOk79c9F//vrbxrS7paa6J3aITrBQCACqJ9Ne6R+JNKRAu+7j1AAAAAAAAAoDKcKvEnk4iW/LOkT5QAAAAAAADAOJtLvCP1EC37E2FLCgAAAAAAgGm0+/t9En8CiWhRtqQAAAAAAAAYZz+JP3lEtOwTwikpAAAAAAAAJtHJ2tMSf+KIaFk9JeXz3oECAAAAAAAApjhP4k8aEavgM5IeFQkAAAAANhkjbx7/vfUS7rOE/73EX99k8d87W9JjhQFC0D58k70LvWt4t5A37y09an6fpdxB3npfrifp/af37EShr1/TaOFjTxYRq+RV3tECAAAAALHQ/oB6at223iO9F3h/6/2n5PN77yFJf/N91ruTdy3vsqWMDKyh99ocSQ/a+Ij3JO8V3t97X5Ji5huveh/wXuM9y3uU90Pejb0zhRXkb0MLom/a2BNFxKq5pwAA5MgvvjPbPX/zqqNiXwe0Hw/9ZL674/w5LvZ1ALSIPsVe13uo91rJL8AI8Q3vPd5TJH0SP7nQEUMMNMR4h6QhwqneOyR93WPPPXpTg5VzJH1PaOiysrcr/5JUA10KE/sFQayidwlfZgCQI5OXH+SGD+tym607wp1w8CT3Gz8R/ev1i/aIfV1QPR6+bL677vRZ7hMfnuBWnzPMdXSI+8Amo13s6wJoguW9u3ovljhBRiP/JekqkY9Juo2go5gyQIHog37dBnKQ92axG2JkVVeQ6CqP/+fdwDsyt0oZRgf5vMQvPmJVPUyK/QLTL8i/GBhnLPdpvYSFonsgdYlg7DpV5fU5w8A1x/IyybB8WYONnn9m6JBON2/GUPfhbca6q06d6RqXF0Dk6RsWvf/7x6/ktnrnSDfF308DB3T8555qMti4Xcp/v1gxoU5v85mAmrSCzlF2kXRVRtUmmXd6P+qdkHtVIE/GSrqFSftMFrWVxIr6HtJVJ7qlagNp0+1UH5f4hUassg9LusetKAg2bEOwEQbBRgOWDDaWVoOO975rpEv2nehu+c4q7vc/nOca/XnQ3jxz46INbz9vjvvRSTPc4f+9fPfKDOnnPiTYCDahTr1aFLp8foGkWzyeNTDOVn1N0i0Ca0mNtwYYQ8OMHSX9To59f8T0n4trsIekJ6NWHk1C2z2dQizDT0lxqzYINmxDsBEGwUYD+gs2ehw8sMPp37dg5aFumw1HuhM/NtndeMYstqzUhCeuWnDzhV9cyX3ywxPcRmss61aaNNgtN2qAG7DEyoy+JNgINqFOvZr3RGiQpL0BrjUwtqL8mXdtIeCIgW4z0RNH9DfI6xL/XrCmbqW6xbuXd3pzJY4PqzUQ87HIVRsEG7Yh2AiDYKMBWYKN3hw0sKN7kvvJ/5ngLjtlZXfHBTSJbBeeum7hIb/87mz3nWS6O2jn8W6Nuf2vyuhPgo1gE+rUq2sF1KU/tEHj9t67DYypLC+V9DhQ+nAUz3Le/SRtrhn7da+KPSHH7pKubqkErNaw7QuSTmaX9Emx2TAJU4tatUGwYRuCjTAINhrQbLDRoz61Hzd6gFt5ymC3xXojuifC+nT/rgvnukb/brDBszctWvVX353tvvnpaW63rca4d71juJu2wiA3YniX6+ps7T4k2Ag2oU69um1AXfrifVKvQGNJtd+BbrdZvuUqQm/oiqIvCn0kW7VnK9UG3gFBr0DJsFojrhpc3CbpWdtHe3eQ9Eihcf29aIvR5Xp6jM8m3gO9X5f0DOVHJE3ZYo+trha1aoNgwzYEG2EQbDSg1WCjL/WklXkzhrgt1x/pjj9worvsKyvTo8MIurrm3M+t6I7cY0J3iLHS5MHdK3CkgPuAYCPYhDr16mEBdVmaOd6rDIzBgo9JelzswBbqCW+i99ZZwoPgItTGo3oykbnTVfSCXpX4BaqTGmR8U9KEu8gGLXq29xreQ7y/kup1ka66RzZ+iYIh2LANwUYYBBsNKCrYWNIO7zJDO7t7dGy70Sh33IGTnJ6i8duLWdVRNI9fteCu2743252VTHeH7DrebbX+yO7VNZ0trsTIKsFGsAl16tWvBtSlB12dcKHwEK43NehZuYmaQspsSbf40D+jeHVO+21J5ycm0Kf8sYtSB7Wb85e860q85Ts66dJ07UYh5CjDP0j+wRXBhm0INsIg2GhAGcFGXw4f1ulm+En2ollD3QfeM7q7X4duY7nmtJnuru/PdY9evuAF3SbRaAx15q83LNrjwR/Pd78+d7a78msru28dNc0d8MFx3Uevzp4+xE0eP9ANGdQZ7TUm2Ag2oU69+v2AuijalPA5A9dt2Se8WwfWte7oSndWaMTxZe+5Ejng0An2UxK/GO2shghbStoQyRKaBOvZxbz+xbpX1hckIwQbtiHYCINgowExg43e1JUEI4d3uVlTh7i15i3jdnjPaPfRnca7Lxw02Z3zuenulrNnu0cvn/9Co3G1I/deMtfdcMYsd8anp7mj95no9tp2Obf1u0a61VYZ1t0TY/jQTtfREf81XFKCjWAT6tSrV2asia7SYNtJdnWCfkTG2tYZnWN9wvs3if+a1d2egGNGv69YQWwZeLGYXf3ROj/7SxEN3Yq0p9R7MlakN3jHZH41GkOwYRuCjTAINhpgLdjI6rAhnW79VYe74w6c6H588gzXaJxV4+kbFr3/oi+u5Pb/4Lju4KKrq5geGEVLsBFsQp169fYM9dDTTp4xcK1VU7fqnJChvnVlU+89Ev91wreqDzh0p8Kgvl+6/Dk350Fg+mO1iudSaz+Og4TTcfJWv5C2CHgdGkGwYRuCjTAINhpQ1WBjabs6O9z4MQPd/JWHunevuWz3hHrfHca5j+++vDvuo5PcKYdPcWcl07qPpr3+GzPd/561itMjTW/73hz3u0vmdXv/j+a5x69ccNcTVy24uVkfvWLBC9oktefP1NNGdJXJz85cxV13+iynYcWZR09zJx4y2X1+/0nu0A8t7/bYemz39WpQoytVtPFq7HrmJcFGsAl16tXHGtRCe47RS6M1z2tQ47qhD2a/K/TRsO7jks+pSQ3RxiqPljiwdvde71ZS/U7GesbzyRK/nu3kN4Negf4h2LANwUYYBBsNaJdgoy87O8QNHtTRvcJDt7gsN2qAGz96gJs4bqCb4se+4qTBbu5KQ7tdOGuoW2fBMu6/FjbvWvOX6W6S2vNnTp0wyGmNV1huYPexuGNGdHUfozp0cGf3SSTWto7kLcFGsAl16tW/91GD4d6LDVxfu3hhH3WuGxtJ2oMk9uuB2dUtaIUeZ/wp778NDLTq6oky2qvC3HE3LaKrTup6nnjePh1Y+/4g2LANwUYYBBsNaPdgA+NKsBFsQp36dGl0EnOngetqN+scbuh35heF5qBV9UVJDy3JHW2ycouBAVZdnfjrKScdYeWvDLo95USJX+d28IOBte8Lgg3bEGyEQbDRAIINLFKCjWAT6tSnS56GoP/9TwauqV1t5njdqqM7DX4h8WuPrXud5Lx6Q/e6vGhgYFVVk8KTvONDC19RdMkXqXtr/iy46r1DsGEbgo0wCDYaQLCBRUqwEWxCnfp0E0kf9H1AOHGvDHW1eKe0PyMkfcrPPdVeaiPhvSWnFg7fMDCgqqpHCf0/sXd8a9FM8f5c2L7UrK8vrmGrEGzYhmAjDIKNBhBsYJESbASbUKc+1RP2NNSgCX056u/KXaW90d/NpwsNQttVbSh8rHeUtID+8L7PwGCqqDaq2UXad+tJI3TZkDaBItxozk+Fl/xtEGzYhmAjDIKNBhBsYJESbASbUKc+1eaAhBrlqk+9V5P2Q+dZC7xXS/waY/H+0DtDmkTTvVcMDKJq6nE1mzdR73ZDO1zrKR9vSPzXpGre2kS9l4ZgwzYEG2EQbDSAYAOLlGAj2IQ6oTFv8w6V9mJDYQt83dTXe01pgrMNXHzVJNR4KwO8pwnhRqh5bEch2LANwUYYBBsNINjAIiXYCDahTmjQw6V9eKf3MYlfUyxfbTi8sQTsjBjrvcfAhVdJQo3e0XBDJyVsSwnzE80UewkINmxDsBEGwUYDCDawSAk2gk2oExpUtwDNl+qzndT7Ny6KPCtpr55M4YbeMOx/y67uXdsqS2Frim5L+YHEf52q5E1NVfpNCDZsQ7ARBsFGAwg2sEgJNoJNqBMaVftRDJLqonPUFyR+HTG+mlVkCje+ZOBiq6IWdc8sRa05I723SPzXqyq+vLhmzUKwYRuCjTAINhpAsIFFSrARbEKd0LA7STUh1MClbRhuaIr3CwMXWgW1d8TnJN1uAY3RyfbDEv91q4qtfPEQbNiGYCMMgo0GEGxgkRJsBJtQJzTsQ94xUi0INbAvNdzoc+fEut6/GrhI62rPiPOk2su5YqDHMrHNKZsXNVljhWDDNgQbYRBsNIBgA4uUYCPYhDqhcY+S6qAr4/8p8WuGdtXP0eWlFw71/svABVr3/r4KCA05WGgmmsVHmi2wEGwQbNiWYCO7BBsYXYKNYBPqhMbVh4zTxD5bCA9EsX81t+hzlfv5Bi7QuvoG26OvAkJDOr3XSPzX0boa/kxrssYEG7Yh2AiDYKMBBBtYpAQbwSbUCStgIrZZzfs3iV8ntO0x0kePjRHeuw1coGV1snm2d2BvBYTM6PnTfFg1dv8m60uwYRuCjTAINhpAsIFFSrARbEKdsALqg9rlxCZjvY9K/BqhbfttC0F/jcb+UdrjDOjYaMPVz0r819O6lzRZX4IN2xBshEGw0QCCDSxSgo1gE+qEFfEgsccQSb/7YtcGbfsrafD76CNCf43+1FNQPtFfASGI6d67JP7ratk/NFlbgg3bEGyEQbDRAIINLFKCjWAT6oQV8QmxdRCCbik4VuLXBW37mHeqNOAbBi7Usr/0jm5URMiMfnjtLYRp/am1aTip6QWCDdsQbIRBsNEAgg0sUoKNYBPqhBVSG3RaYXtJHyTHrgna9UVJ+6/0i04ybzJwsVZ9VexPlqqI7u3jvuvfPs9m7geCDdsQbIRBsNEAgg0sUoKNYBPqhBVSv2cssLL3BYlfD7Tra96tJQOTpN4/tBv5C0mbq0L+7Cqs2ujP45qoKcGGbQg2wiDYaADBBhYpwUawCXXCCqkrJCZIXIZ6b5X4tUC76lzxY9LHCShLs7mQkvXly97dsxQRmmKM91qJ/zpb9ZomakqwYRuCjTAINhpAsIFFSrARbEKdsGIeLHGhHQI28mhJD5/IxEeFp+Z9qV1X6a1RHJq87SnxX2erPtxETQk2bEOwEQbBRgMINrBICTaCTagTVkxt5h+LbSTdYhC7BmjX70q6qiczJxu4aItq2MNJKMUzzXu3xH+9LapLBIcH1pNgwzYEG2EQbDSAYAOLlGAj2IQ6YcXU+Y72uCgb/T30WBPXi/XxHklX9wfBecG9+6h3TmgxIZgu7zES//W26hqB9STYsA3BRhgEGw0g2MAiJdgINqFOWEH3kPL5VpPXivVQ5zLzJZAh3t8YuHiLXiDppBuKZz1Jj/CJ/ZpbdK/AWhJs2IZgIwyCjQYQbGCREmwEm1AnrKDflHLZWNiCgn2rvT+bOop4hvchAwOw5itC09AyGSVpo8zYr7tFTwqsJcGGbQg2wiDYaMAUgg0sUIKNYBPqhBVUH3I3/L7JiWGS9vWIPWa0qW6NCn2o+x829D5rYBDW/IN3crNFhWC0iejhEv91t+ilgbUk2LANwUYYBBsNOOCD49yEsQNjXyu2mZ0d4labPcydduRU/d+h1HnCnlAnrKDPeDeQcjikpDFhNT3O2ylNsrOwFKg3L5SMZ+VCbqzv/afEf+2teVtgHQk2bEOwEQbBRkb+9zuz3ecOmOjeveaybuqEQW5AV0fs68cKOWhgh5u70hC3/caj3dc/MdXd/6N5+tebpc4T9oQ6YQXVp+RlHPuqD415oI59qfNvXdHTNIcZGIQ1y3pzw1tZQdJJfOzX35qPB9aRYMM2BBthEGwE8viVC+765Xdnu8/uO9GtPmcYAQf2aUeHuGWX6XKbrzfSnf7Jqe7uC+e6p29Y9H5pnTpP2BPqhBX1LCkeDgvAvvy5d6y0yAkGBmLNJ71rtVJUaBqOHu7dEAg2bEOwEQbBRovccf4c993PTXe7bjmmezXHjMmD3TJDO7sntQbGiCWpAdfI4V1u3owhbrt3j3YH7jTOXXLiSu6hy+Y7yZ86T9gT6oQVVfte6KESRbHQ+4SBcaI9tQXEaMmB7xoYjDV11UCRb2zomw9J/NffoisG1JBgwzYEG2EQbOTEszctWvXRKxa8cNv35rhvHz3NHbbb8m6jNZZ101YY5IYOJuhoN7s6xY1atsvNnDrYbbX+SPe5/Sd2Bxm6KuOp6xYeIsVS5wl7Qp2womrooOFDUZxqYIxoz+ckPcwkFy4zMCBrntNSRaEVVhf6bPTm+gE1JNiwDcFGGAQbBfPHn8x3F35xpe6J73vWHtG9okOf7Hd1soWlSg4c0OHGjhrgFqw81G3/ntHu5MMmu5u+Ncv9+ZoFZ/f+yhdKnSfsCXXCiqq/v3eUYmC1Bvam3nPvlBzhQ/XtHtlSRaEVpnh/J/HvAWtuG1BDgg3bEGyEQbBRIg/8aL679dzZ7uzPTndH7b2C22bDUW7RrKHdp67o9pXOzug1QUm3lYwe0eUmjR/o1l003H1oyzHu+AMnuR+dNMPd9f057pHLF7iGL3ax1Pm3ZUKdsMJ+UoqB1Rq4tNrT8gjJEe06ereBgVlzh1aKCi0x1HuxxL8HrHlYQA0JNmxDsBEGwUZknrlh0Ybap+Pyr6zszvj0VPeJD6/gtnv3KPeu1Ya72dOHdE+udaXA8KGd3SdrdLKlpSV1pcyQwZ1u2WGd3YHS9ImD3PwZQ93Gay3rdt96rEv2nei+89np7qZvznK/u3iua+IlLYM6T9gT6oQVVlsU5M0c76MGxoa2PE1aPAFlaer+A7svi9xfBo05UeLfA9Y8JqB+BBu2qfvnLsFGdk0EG72h/Tr+dPXCS++4YI778ckru7OPme6O2W+i22f75dzm645wq88d5iYvP6h7SwtBR//q6ovlRg1wK00e7NZZsIzbdqNR7uBdxrsvHDTJXXTCDHfDGTPdPRfPdX+5duEpLbxkZVPnCXtCnbDC/lTy51gD40JbXiE5nICyNPMlPUoy9uCsOaaVokLLHCTx7wFrnhFQP4IN2xBshEGwUTE08Ljnornuyq+t7L537HR30mGT3ZEfnuB23WKM22zdEW7Necu4hTOHdje11PBjzIgut+ywru4GpoMHdXT3iujqSld+dMR/DTKpjVd1m46GFHr9Q/w4hg3pdCOW6XLjRg/obtC6yrQhbtVVhnWHF1u/a6Tbe7vluldfnHrEVHfxCSu5G86Y5e7/0fwyGnuWQZ0n7Al1wgp7r+Q7D9LJ628NjAvtqKfvhByKkBlt1FjnCVBvvtRSRSEP3i/x7wNrnhtQP4IN2xBshEGw0SY8f/OiUU9etzB5+PIF7v4fznO/OX+Ou/brM7v7eZx25FR37AGT3Cc+PMHt94FxbsdNx7jN/2uEWzhzWHcz04njBrrxYwa4MSMHdK8C0X4fGoTo1pcBGoR0drhOrwYM/Z3u0vP/Z/l79M/TP1eDCg1chg7pdMOHdXafNDLWX8eEsQO6gxkNaDSseN8Go7qP1D1op/HuM3uv4E44eLL7xqemuQuOX9H99FuruLu+P9f94dL5Tk+m+ev1i/aI8iKUR50n7Al1KtxnvDd4T/ceKGkfso0k/f2jq6639u7h/bL3cqn3b6JQ/+RdJPmxn/cNA+NCG+p78R1SEBtLesRK7EFa8o6WKgp5sI7Evw+seVlA/Qg2bEOwEQbBRo14/qerjnrmxkUb/vmahWdrAPDApfPdfT+Y191L4rcXzXW/OW9Od2+Ja74+s/vo0nM/v6I7K5nuvnbEFHfsARO7G55qD5CPfWh599Edx7mP7DCuOyg5cKdx7pBdxrtD/V8/fLflu//z4J3Hd/89++6QepD/3/r/ffJ/VnBH77OC++LBk93XPznVffeY6e48/+/58Ukz3HXfmOl+duYqTrfg6KqU310yr/v69GSZx69acNeT1y5MdJtO7DoaoM4T9oQ6FeJD3n29KwfUd0mmez/qfdDAWCz7d++WzZX4bQzw3mRgTGjDp7wbSIFoovmigYFaMmQCWWeGF/hnzxOOfG3lviTYsA3BRhgEGwDVo84T9oQ65ao+cNzC2xVQ1/4YKOlqDo4e7d1/e/dqtrhL8R7v8wbG1A7qqhcN926U9LdBb966+O+Jfa19Xf/O3g4pEIKNt1ul5lwx0PT1S94nvcsX9O/QiTn35Vv9ZWD9CDbsQrARBsEGQPWo84Q9oU65+Lr3w5JfoLE0+l18vqRHTsYeqzXzOvL1FANjqaKvSdpcU/st6RaryRL+Phgv6Zai7byfkjQQeSnimA6XdA5ZKAQbb/dLLVW0vZnm/ZW8WasbC/r3TJI0OIl9L1jy9oD6EWzYhmAjDIINgOpR5wl7Qp1a9vfeGQF1bBadLH5c4k74LHpyK0VdzEjvnQbGUhV1pfo53s2luFXxulpJ+2smUu7v0FO9Qwsa01vYU0gql3b/liravmji95i8vV5HFfDv0olfnSfmvUmwkV2CDdsSbGSXYAOqSp0n7Al1aslbJJ0Ul4k2IH0lh2tvF89srZzdbC/UNIvPeo+W9OFx2azmPc77QsD1hnqpd3RZA9qnwIFUVeuTorLR1PA06bvnhf71NXL+dxJsvF2Cjexafw8TbIRBsAFQPeo8YU+oU9PGCDUUXbmhJ6jwsDc1j36DpxkYh2V1x0QixW3rD2GIdzfJv7HubVLQsa59QbDxdq1PispkLcm2jEwb1QzK8d+7nPfRDP/eOkmwkV3r72GCjTAINgCqR50n7Al1akp9ajwxoHZ5o5+1V/dyXXX0Zy3WUh+K/sbAOCyq4Zn2z5jVdHWLQ3tg7CDpkb+tjlODmzXLvXyCjd60PikqA72xD/X+TbLX7bs5/vv1y6XOE7/eJNjIrvX3MMFGGAQbANWjzhP2hDo15TYBdSuKDb3PSPxaxDbkN2dvbCphc4i6qJN9bQg6pPnSloJe3wneV6W5cWrz011Kv2oh2OhN65OiopkmaZLYzHK8vG7iCZJPWthOEmxk1/p7mGAjDIINgOpR5wl7Qp2CvTCgZkWjD+pi1yO2v5XWGlgmBsZgTe1TuFELNS0bPZZVV+7rccsh49T541FS8LGufbG3pOcVx36xLWl9UlQUms7t631cmq/dc96VcrgWemy8XYKN7Fp/DxNshEGwAVA96jxhT6hTkPp7JUZfjb5Y2/uUxK9LTPU3SrPbgnTV9/UGxmDJe7xzmqxnbLTxZ+J9WhqP8w3vSZJve4IgdB8NHWvfahGnfFhniver0neD0BAv9w5r8XoINt4uwUZ2CTZsS7CRXYINqCp1nrAn1ClIa7+7tZGo/paNXZeYthJszBb65C3pfYtrUmU0rNrWe6/0PU5dqXGxRP7NsrWk+31iv+iW/FJLFa0W+uGty6J+KfnW8EhpbQmSdtB9Ludrqrq3BtSPYMM2BBthEGwAVI86T9gT6pRZPerS0mqNHg6X+LWJ6R+8k5us3a6Sz4PSdlB/i7+jyTpaZHXvzdL7bo//lbSVQFQINt7uuS1VtDqMkvSDu4gAQZvNrNvCtWmy+VIB11Vlrw6oH8GGbQg2wiDYAOiFi764klPP+dx0d9v3ZrvY17MUdZ6wJ9Qps+cH1KpM1pP4tYnpE96FTdbuBAPXb0ENd97fZA0tM837E0m3nfSMVY+JNbEqZXNJj1eK/eJb8saWKmofXUmxwHuJFHte993e8U1eoyaC9H55qyFnihNs2IZgIwyCDag9f7h0fneI8bn9J7r3vnOkGzyo4z/3yfYbj3axr68X6jxhT6hTZncIqFWZ6OfukhO3uqm/IVdvsnZXGLh+C36hyfpVAf0de7ak80jtR/OeqFezBHrT1nkC1JuPtVRR22iD0J28D0k5tfy2d2AT17lpSddXJX8QUD+CDdsQbIRBsAFtyT0XzXU3fXOW61l5saS6CuOEgye7/3n/cm7+jKF93iMrTxnsnrtp0fSIw+iLOk/YE+qUSQ0OLG5D6aG/fgLtbrPBhvbYu8/A9cf2Lmn/7+7lJF1NvqdEOgGlN1YTjtXszWYm49bJs0FoiLs2ca17lHyNVfCMgPoRbNiGYCMMgg0wz6NXLHihv///3M+v6L511LTuFRcf2nKMmzl1cMv3xzJDO90d589xRY2pReo8YU+oUyatP0jUremxaxTLZoONqZLt9Ix2VgO7jZuoXRXRYHJA7ItYkmmS7ouJfRNYc8VWimoMbRCq5xDn3SA0q9oYKnTf1aciXatlvxJQP4IN2xBshEGwAf/hp9+e5X5+1iru9vPmRPPSk2a4739hJXfK4VPcfh8Y594xe1jp90Znp7hvf2aaK6fqTVHnCXtCnTL5i4A6xUBPa4ldo1g2G2zoUbl13sKjXtpE3SAndBkJS4be7katFNUQ+oN4L0lT8Zj1vNk7POM1axBT54lMXx6WsX4KwYZtCDbCqPPnAcHGEqwWIUCw6r47jHOt1rNg6jxhT6hTJkN6h8VAv6ti1yiWzQYb+xm49pi+0WTdIEfq/KHalx9pqaLx0b1OukriSrGTnH5Fsu3B0oajtxi4XmvukqF2PRBs2IZgIwyCDZBtNxoV+7Uw46JZ3T03rFPn35YJdcqk9WBjO4lfo1g2G2ycbeDaY3pOEzWDnNHGH7FvBGt+raWKxmWwpH0t9Kim2HVcUu2cu3WG658r6faV2NdrzU0y1K4Hgg3bEGyEQbBRc47aewXX0RH9tTDhyOFd7sEfz3ctF7V46jxhT6hTJq0HG/qbNXaNYtlMsKEPL39l4NpjukZgzaAA9Azp2DeCNa8VQx1eA1jB+3XvKxK/hr35vKSNhfpjKwPXadEZDeq2JAQbtiHYCINgo8acd+yKbuCAjtivgwkHdHV09/douajlUOcJe0KdMkmwYddmgg39rqrzbxs9RacrsGZQAKdK/JvBmn/0Tm+hpmWjb6QNJD1eKHbtGnmVd1A/Y/mEgWu0aEjXYYIN2xBshEGwUVP0xI9lh3XFfg3M+Mn/meBarWmJ1HnCnlCnTBJs2LWZYGOS90kD1x7LjwXWCwri0xL/ZrDmy97tWylqiWhIcIRXj5qLXbes7tvHWJbx/tDA9VnzmT7q1RcEG7Yh2AiDYKOG/OXahadMW2FQ7PqbceO1lnWt1rRk6jxhT6hTJgk27NpMsLGK9x8Grj2W8wPrBQWhp2Zo/4PYN4Q1T2ylqCUxwfsjsdMgNKuPSO8fmNrwtM4T8r68u5da9QfBhm0INsIg2Kgh73rH8Ni1N+PEcQPdY1cueLTFkpZNnSfsCXXKJMGGXZsJNrS/xL8NXHsM/yZsQzHDFlKtp/1l+b/S/5aJmHR6N5P4x7i24vXe0UuNaycD12XRqyUMgg3bEGyEQbBRM/Z839jYdTfjkEGd7sYzZrlWaxqBOk/YE+qUSYINuzYTbOxg4LpjeWNgraBAFoq9EzQsqCdzbNh8WQtDf+TqahKrDUKzqqtMjpM3E079T/q99O63JQyCDdsQbIRBsFEjjj9wkuvsjF53M5582BTXak0jUecJe0KdMkmwYddmgo0DDVx3LE8OrBUUyDBJl7rHvimsqcuprG1H2dJ7p8SvTV7qSqHdF49N9+Y9buCaLHqghEGwYRuCjTAINmrCNafN7F6hIPHrbsKdNhvjWq1pROo8YU+oUyYJNuzaTLCRGLjuWG4RWCsoGF3qHvumsOht3jEt1DUvhns/L+kertg1yVud4K3m3dvAtVh1AwmDYMM2BBthEGzUgHsumuvGjhwQu95mnDl1sHvupkXTWyxrTOo8YU+oUyYJNuzaTLDxHQPXHcsVAmsFBXOaxL8pLKqno+zcQl3zQCf910n1GoRmVVfG3LjY2Ndi1ZESBsGGbQg2wiDYaHOev3nVUfNnDI1dazMuM7TT3XnBHNdqXSNT5wl7Qp0ySbBh12aCjfMNXHcM/xFYJyiBwyX+jWHViyVep1ttplmH7Rl6Kk+7Bjetql8uoRBs2IZgIwyCjTZn83VHxK6zGbW/yJlHT3Ot1tQAdZ6wJ9QpkwQbdm0m2LjBwHXH8I+BdYIS2Mb7ksS/OSz6lHfd5kvbFLr9RRvRvNjitWP1/ZmEQ7BhG4KNMAg22phDdhkfu8am3HeHca7FklqhzhP2hDplkmDDrs0EG3W9l28PrBOUwBzvoxL/5rCobpU4venKhrOOpJPZf+U8DqymX5NwCDZsQ7ARBsFGm/Ltz0xzA7o6YtfYjGvOW8a1WlND1HWSoybUKZMEG3Yl2MjutYF1ghIY6P2lxL85rKrH4Ya+wUMZ4j3U+2TksaIt/1vCIdiwDcFGGAQbbcjPzlylu5eExK+xCUeP6HIP/ni+a7WuhqjrJEdNqFMmCTbsSrDRPvdxbTlH4t8cVtVVG9+Q4nptTJe0l8drBsaKtpwi4RBs2IZgIwyCjTbj8asW3DVx3MDYtTWjrlr5ySkru1braoy6TnLUhDpl0vqEkGAjjLrey9bv49pyhMS/OSyrvTY2arq6ffNB7/0Gxof2bKZxqEKwYRuCjTAINtqM1ecMi11XUx619wquxZJapK6THDWhTpm0PiEk2Aijrvey9fu4tmzufUHi3yBW1VUbP/IOa7bAvbCj0CAU+/YaaQ6CDdsQbIRBsNFG7Ljp6Ng1NeXGay3rWiypVeo6yVET6pRJ6xNCgo0w6novW7+Pa8t47+8l/g1iWd0qcnCzBe6FSd5nDYwLbaqrqJqBYMM2BBthEGy0CclHJrqOjug1NaNux/nzNQvPbrGsVqnrJEdNqFMmrU8ICTbCqOu9TPNQw+iKhNg3iHUf9y5otsC9sKWBMaFN15DmINiwDcFGGAQbbcDFJ6zkBg3kBJQehwzqdDeeMcu1WlfD1HWSoybUKZMEG3Yl2Mgux70a5tMS/wapgj/2Dmiyxr3xZQNjQlvqSp5mIdiwDcFGGAQbFeeu7891o5btil1LU5582BTXYlmtU9dJjppQp0wSbNiVYCO7DwfWCUpkU+/fJP5NYt03vLs3WePe0KNe7zEwLrTjFdI8BBu2IdgIg2Cj4kyfOCh2HU2502ZjXIslrQJ1neSoCXXKJMGGXZsJNn5i4Lpj+FJgnaBERnrvlvg3SRV8XvLdkjLH+6qBcaEND5TmIdiwDcFGGAQbFWaXLcbErqEpZ04d7J67adH01qpaCeo8YU+oUyYJNuzaTLBxvoHrjuWkwFpBiZwt8W+QqqiTk/FNVbl3/sfAmNCGU6R5CDZsQ7ARBsFGRdFmoRK/hmZcZminu/OCOa7FslaFOk/YE+qUSYINuzYTbJxu4LpjuU1graBE9EenbrWIfZNUxask3x+ePzAwJoyrbktqBYIN2xBshEGwUUEu+iLNQpe0s1PcmUdPc63WtULUecKeUKdMEmzYtZlgIzFw3bH8QmCtoERmeB+S+DdJlTxb0j4ZeTDW+ycDY8J4niatQbBhG4KNMAg2KsYd589xyw6jWeiS7rvDONdiWatGnSfsCXXKJMGGXZsJNnY3cN2xvCGwVlAyl0j8m6Rq6kkpw5spdi+s5n3dwJgwjhpMtALBhm0INsIg2KgQf75m4dlTJ9AsdEnXnLeMa7GsVaTOE/aEOmWSYMOuzQQb7zZw3bF8MbBWUDJsR2nOPMONgwyMB8v3Xmkdgg3bEGyEQbBRITZea9nYNTPl6BFd7sEfz3ctlrWK1HnCnlCnTBJs2LWZYGOR1HvuuCiwXlAibEdpXu25MTq85G+ja/GfFXs8WK5fltYh2LANwUYYBBsVYa9tl4tdL1MO6OpwPzllZddiWatKnSfsCXXKJMGGXZsJNlb2vmDg2mN5aGC9oGTYjtK8d3inhZf8bSwn6fnIsceD5dnqNhQRgg2CDdsSbGS3MsHGVz8+pbtBpsSvmRmP2nsF12JZq0ydJ+wJdcokwYZdmwk29JTIxw1ceywfCawXlMwe3tck/o1SVf/sXSe06L2wp4GxYDneLflAsGEbgo0wCDaMc81pMzkBZSkXb8mpM3WesCfUKZMEG3ZtJtgYKul26tjXHtO1A2sGJaLJ2+8l/k1SZXVJ1gHeQYG1X5qLDYwFi/cTkg8EG7Yh2AiDYMMwv//hPDd25IDYdTLlxHEDnTZRba2ylafOE/aEOmWSYMOuzQQbynUGrj2mFzRRMygRPXYy9k1Sdf/l/ZG0tjVFG5I+ZmAsWJyvSnrUbx7UPdiwvs+RYCMMgg2jPHfTounzZgyNXSNTDhnU6W48Y5ZrsbTtQJ0n7Al1yiTBhl2bDTZONHDtMdXmqSs2UTcoiY29z0n8G6Ud1A+J/bxDgl6BN1lD6t1tuN29QvKj7sFG0nIFi4VgIwyCDaNs/a6RsetjzpMPm+Jaq2rbUOcJe0KdMkmwYddmg40dDVx7bL/eRN2gJAZ6L5f4N0k7+Uvvh7xjAl6HHvQIWMKN9lNX9ewq+VH3YENXmnW0XMXiWOh9QuLXKZYEG9k1G2wcueeE2LUx506bjXGtVbWtqPOEPaFOmSTYsGuzwcY87z8NXH9s39lE7aAkPizxb5B283VJn9Bv5x2Z/aWQAd4fGLh+zNd7vFMkP+oebOjWr2VarmJx6I+lFyV+nWJJsJFdk8HGWcl0TkBZyplTBzvdmtNaZduKOk/YE+qUSYINuzYbbEzw/snA9cf2Vu+IJupXJTolPSQjr230paFHjtb5XOIi1YBDV8To0/rJGV+PSd6HDFw75uenJd8VBnUPNvR0mazvpxgcIfFrFFOCjeyaCzZuOXu2W2ZoZ+y6mFLrcecFc1yLpW036jxhT6hTJgk27NpssKEr/X9j4PotmIjt1cOtoOPS+0Pvk9MlPRGnUpwk8W+QdvcuSd8E63lHN3g93ut9xcA1Y+s+6V0k+VL3YONlae4LuQz0y+BCiV+jmBJsZNdUsPHoFQte0BM/JH5dzKgrV848epprsbTtSJ0n7Al1yiTBhl2bDTaU8w1cvwW1dcBmTdbQMvo7djVJV6XoOPUhvT6wGxDzokLRiRJ7pspR63y9pF+Mm0p6msrAXl6TE7z/NnC92JqnSuvHAS+NdmT+o4GxxXTvlqtYDBpa1n3FFcFGdk0FG2vNXyZ2Pcy57w7jXGtVbVvqPGFPqFMmCTbs2kqwcaQwP+lRt+XMa7KOFtHtJ2vJm6FGj7q9eofF/39lqPtTxlje5z1X0jRMbxp9uq8TVz1Zoc5fiO2gfhCsL/nDvSFytndwi3Usgi0kTbdj1yemBBvZNRNs7L712Ni1MOea87qDHuidOn8HJdQpkwQbdm0l2NjE+zcDY7DiHdIeR8Dqigz9DdvXqX66An3daFfXBHqDcyJHfF/1/sF7g6S9BGJfDzavBlbDJX8INtJTR+a2Wsic0ZU5V0v82sSWYCO7JoKN4w+cFLsO5hw9oss9+OP5rrXKtjV1/g5KqFMmCTbs2kqwob0Zf2dgDJbUEzGnN1lPC+jvkP28T0n/49TXfUaka2yKSyX+zYHYDupqjfdIMazgvc3AGGN7uNhaFqdby7T/R+y6xJZgI7vRg41LT5rhBg3siF0HUw7o6nA/OWVl12Jp2506T9gT6pRJgg27thJsKBcZGIM19YF03j31ikb7acz0fkOyt6TQUz+Xi3GxzcCqDcR8LGq1hqJ9HK41MMbYWkqOR0ma2MeuiQUJNrIbNdjQkz5GDu+KXQNzHrX3Cq61ytaCOk/YE+qUSYINu7YabBzi/T8D47Cm/i7dUnrvnWgN/e2xo/dOCRuj9lep1EkprNpAbM0iV2so+mF0mYFxWvAoif8FMmDxdfxL4tfDggQb2Y0WbOg2i6kTBsUevzl32myMa62ytaHOE/aEOmWSYMOurQYbPUeBxh6HRZ/xfsI7vunqFouudNaVJedJ8weHVOqklDne1yT+jYFYVXVJV5GNLbu8ZxkYpwV168dWEu8scf337iKcKrWkBBvZjRJsPHfToun/tZATUJZ24cyh7snrFiYtFbc+1HnCnlCnTBJs2LXVYEN/h95gYBxW1QddunpjO7GzskH7wK0t6Taif0jrY9SsYHuxtSW8T74i8W8KxCqqSe07pHhOjzQ+i97rXdBaOZtCQ42Nvc8HXm+7S7CR3SjBxuJVCbiEuiXn1nNnu9YqWyvqPGFPqFMmCTbs2mqwoXxKOPa1kXoghG4df7cUtz29ERMkPXXz55L/Q7jHveuUN5TmmeR9SeLfEIhV8xgpZ2nWMZHGZ9VfeMe2VNEwNNTQ7UZP5zyOdpBgI7ulBxtHf2QF19kZfdzm/E4y3bVW2dpR5wl7Qp0ySbBh1zyCDZ3QNjpFA1M1UPi194PeyVLsKgddTTPFu433fO+fpNgASg8zsNLvrl9070zsGwGxSurZz7OkHA4uaUxV8leSHoVbNNrTYzfhHPe+JNjIbqnBxve/sJIbMqgz9pjN+dEdx7vWKltL6jxhT6hTJgk27JpHsKEP8a43MJYqqQGDhkFXeff2zpO0F0ezD0QHL/7nde6hq0KOk3Rlxl+l3NU0F3vHNDmG0hjmfUTi3wSIVVD30+0r5fV62K2EMVXRJ7xbSDGrZvS11eDkbEkbJ8Ueq1UJNrJbWrDx63Nmu7EjB8QerznXX3W4e/7mVUe1Vt1aUucJe0KdMkmwYdc8gg3lMOF0lFZ8RdLtHHoyifa+0GBiP+/OfXigpJ8/uhLjOu89i//5FyOPQ0OUL4udfiJ9ostYYr/oiFXwGin3XOfNChpHO6gNjS6RtO9GHsv9egKNQ70PGxifdQk2sltKsPHEVQtuXmX6kNhjNeeArg537udXdLefN6fWPnPjog2buK3qPGFPqFMmCTbsmlewMVt4CI6p+tv7IDF+Uoru0+H4V8T+1af3m0i5rCqsGmikdn3W5X4a0GrfoK6A+urfqw2XNpD0lJui9yi2kwQb2S0l2NhknRGxx2lS7TWywnIDa6+GO03cVnWesCfUKZMEG3bNK9jQBz/fMzAetKGuHHmfxDupMBMrCkcZIvbnjyTtu1AmK3kfyuHa66AGEk9Kuu/wRO+e3vUk/VLXpw2zFv/3/1r8/31l8d+rYcYbBq6/ahJsZLfwYOMj24+LPUY07hmfnqb/GUqdJ+wJdcokwYZd8wo2FJ3I/t3AmNCGj3nXEuPokT6xC4Vo0T96p0n5aJMezhBvXT39KfbexHaTYCO7hQYbXz50cvd2CwPjRMMSbASbUKdMEmzYNc9gY4ik27FjjwntqL0/FolhtJGoHlMTu1CIltSmPx+QOEuudA/bWYHXi1iGBBvZLSzYuOrUmW6ZoZyAgo0l2Ag2oU6ZJNiwa57BhrKXsLof3+q1kh5ta5bVhCebiEuqwYIetRSLT/dxXYgxJdjIbiHBxm8vmusmjR8Ye2xYEQk2gk2oUyYJNuyad7Chq4hvMTAutKNuA9d50kgxzOESv1CIFrzPO0XispPErwPi0hJsZDf3YOOp6xYesvqcYbHHhRWSYCPYhDplkmDDrnkHG4oe/UpTe1xSPSnlaDEM+6gQ074M75X4rCEs/UN7EmxkN/dg430bjIo9JqyYBBvBJtQpkwQbdi0i2JjovdPA2NCWuttjSzGMnpLyhMQvFGIM/+U9Rmyc0zzVe6/ErwnikhJsZDfXYOPju0+IPR6soAQbwSbUKZMEG3YtIthQdNXGawbGh7bUUwYXimG2FZ4UYz29UuzsF9MVVBdJ/JogLinBRnZzCzbO/ux0N2ggJ6BguAQbwSbUKZMEG3YtKtgYK/TawN7V1TzLi1E6vZ+V+EVCLNOHvauILTiKGa1JsJHdXIKNm781y40e0RV7LFhRCTaCTahTJgk27FpUsKHsaWB8aNPLJX0oaxI9AvYKiV8kxDL8u6R9NWIc7dofum8tdm0Ql5RgI7stBxsPXzbfrThpcOxxYIUl2Ag2oU6ZJNiwa5HBhn6nsU0ae1NPSvmqGGaQ0CgG21/dL6gJtEW0580fJX6NEHsk2Mhuy8HGuouGxx4DVlyCjWAT6pRJgg27FhlsKOsYGCPaNRHD6JGXT0n8IiEWoaaLZ0q6/coiuqTrfIlfJ8QeCTay21KwsdtWY2NfP7aBBBvBJtQpkwQbdi062FC+ZWCcaFd9/5llB+/LEr9IiHl7tXe42OZAiV8nxB4JNrLbdLDx+QMmus7O6NePbSDBRrAJdcokwYZdywg2tFHkCwbGijZ9yTtfjKJPs/eX9CjM2IVCzEv9QTJN7LO2cEoR2pFgI7tNBRsXn7CSGzq4M/a1Y5tIsBFsQp0ySbBh1zKCDWWXSOPDaviYGD4pRfttHC2EG9gePuhdINVglPcaiV8zRJVgI7vBwcZvzp/jlh87MPZ1YxtJsBFsQp0ySbBh17KCDeX6ksaE1VSPB+4So+iS/dMlfpEQW/ERSRsfVYkjJH7dEFWCjewGBRt/vmbh2XNWHBL7mrHNJNgINqFOmSTYsGuZwcYkYUsK9u/xYhjCDayyT4vxhjZ9wHYUtCLBRnaDgo0t1hsZ+3qxDSXYCDahTpkk2LBrmcGGskNB48D2cXcxzGjvJRK/SIghVjXUUEZ6r5T4NUQk2Mhu5mDjozuOj32t2KYSbASbUKdMEmzYtexgQzkrp2vH9vR171pimLHeSyV+oRCz+lfv+lJddEIZu4aIBBvZzRRsnHrkVDdoYEfsa8U2lWAj2IQ6ZZJgw64xgg1d0f9QDteO7evz3iliGP3BdqrELxRiVu+UdD9gFZnmvV/i1xDrLcFGdjMFG/NnDI19ndjGEmwEm1CnTBJs2DVGsKHopPX5Jq4X66Ppk1KUId5jJH6hELN6nneAVI8O77ESv35Ybwk2spsp2Jg1jYahWJwEG8Em1CmTBBt2jRVsKO/MeI1YX/WkFNPzMA03jhKOgsVqqE0495dqsprQRBTjSrCRXYINjC7BRrAJdcokwYZdYwYbyv59XBdij98W42jy8hnvGxK/WIiNfELifug3y0DvtRK/flhfCTayS7CB0SXYCDahTpkk2LBr7GBD+YHErwPa9nAxji6V/7D3FYlfLMRG3iTpaSNVY1MhQMR4Emxkl2ADo0uwEWxCnTJJsGFXC8GGNhPVLQexa4F21bnMZlIBdOL1rMQvGGJ/6tapk6R66NavGyR+/bCeEmxkl2ADo0uwEWxCnTJJsGFXC8GGoidoPiDx64F2fck7RyrAbO/vJH7BEPvzBe+2Uj3WE3ptYBwJNrJLsIHRJdgINqFOmSTYsKuVYEPREzA4Bhb780ypCGO8l0j8giH2533e0VIttKfNDyV+7bB+Emxkl2ADo0uwEWxCnTJJsGFXS8GGMsv7lMSvC9pTex5OlAoxyPsxSd9ksYuH2JfnSrrFo0pMl/QDIXbtsF4SbGSXYAOjS7ARbEKdMkmwYVdrwYai4cZdEr82aMd7JN3hUTm0qeh7vHcLR8KiTV+TdMLWKdXiEKGRKJYrwUZ2CTYwugQbwSbUKZMEG3a1GGwoGm7cKPHrg/G9QyoaaizJfO9FQm8AtOmT3lWlWuikieNfsUwJNrJLsIHRJdgINqFOmSTYsKvVYEPRnhv6u/XfEr9OGMefScW2n/SH/sg7QtIl9NzUaM2fStobpkosErZ6xfJlqd++UYKN7BJsYHQJNoJNqFMmCTbsajnYUEZ6LxVWHNdN3bWh/QHbJtRYknd6r/a+KvELjdijhm3HS9qcs0rsJ6yEKtvXJb1XTjVwLWVKsJFdgg2MLsFGsAl1yiTBhl2tBxvKct5vCb9d66Ju+f+6pKFW26JPxj8trN5AW+qZyvqFqL1hqoI2Pj1L6GFTlm8srreepnOYgespU4KN7BJsYHQJNoJNqFMmCTbsWoVgQ9HvR50HPifxa4bF+bz3SG+X1ARdvaEfkK9I/OIjqg94V5JqofsWfyHxa9fuaqhxtqRPG5QPSbp6I/Z1lSXBRnYJNjC6BBvBJtQpkwQbdq1KsKHoCukPev8g8euG+fuQdyupIfrjb3/vIxL/RUBUL/QOk2oxz/ugxK9du6orYs6WN0MNZRPv3wxcW1kSbGSXYAOjS7ARbEKdMkmwYdcqBRs9vEPSFgX03WgP9XW8zrtAao4eBaRLvOs0UUCb6lP4A6V6R8Dq0co0E81f/ZDWZldLhhrKQkm308W+vrIk2MguwQZGl2Aj2IQ6ZZJgw65VDDaU8d4vCXPAqvus9/Pe4QLdaG8DDTi0cypNZTCm//C+W6rHTpJ+sMSuX7uoTY/0y3ZQL7XWL+LfG7jGsiTYyC7BBkaXYCPYhDplkmDDrlUNNhTtw7Ce99dC/8WqqQ8Ar5F0Dg+9oPuu9Oa+QViahPG83ztBqoWGg7sJ4UYe/l3SU2f6OilHa32rgessS4KN7BJsYHQJNoJNqFMmCTbsWuVgowc9YOI0of9iVXxU0nnHkF5eS1gKLdKmkqZ3BBxYtpoYH+cdKNVCJ9zv9T4u8WtYVR+VdGtPo+1Ilxu41rIk2MguwQZGl2Aj2IQ6ZZJgw67tEGwounpjY+/dwuoNq77o/ZpU7wGwCXoCjruEYy2xXF/2bifVOgK2hw0lPeUldg2r5P9JulJsZsYan2ngmsuSYCO7BBsYXYKNYBPqlEmCDbu2S7DRw2jvZ7zPSPzaYqq2irjSu24/rxtkRJuR6AeWHm2pe99jv7hYD3VLyhypJrO9PxUCwSxqX5WjJazp0bEGrrssCTayS7CB0SXYCDahTpkk2LBruwUbij5Y1N+y3xf6L8ZUa3+jpAsNhvb7ikEwuoJjHe9PJN0HH/vFxvb3fO8IqSa6X/F04QuhL3WZ433ed0n4STgHG7j+siTYyC7BBkaXYCPYhDplkmDDru0YbPSg/c429N4stCcoUwKNEtFJiC4ZP1HSPfHsw8Ki1A/RgyTd91dF9FSPPb2PSfxaWlKD0VO8yzdZ112kPqvHCDayS7CB0SXYCDahTpkk2LBrOwcbPejD7fdJ2p6AgKM49ehdPaV0AyHQiMJy3j0k3abyksS/IbD9fM77Tqk2K0uavNZ9a4qGEddKuvKrlbBKG4w+b2A8ZUiwkV2CDYwuwUawCXXKJMGGXesQbPQwUtLTOPS9WJcHTEWrCwT+7P2Cd670fSoglIgmeat5T5C0NwI3O+bpz72TpNpo8qpfBk9I/HqWrab7mvLv6B3WaiE9C6U+dSTYyC7BBkaXYCPYhDplkmDDrnUKNnrQvmibe6+WtFda7NegimrdbvF+yLuCVPPAhLZHX5RR3rW9h3uvkfRomtg3D1bfb0mGSUsF0O0Xur3mdxK/pkWrewQvlXT54sg8ircY7V9yr4HxlSHBRnYJNjC6BBvBJtQpkwQbdq1jsNGDbrme7z1M0kn66xL/9bCsbjXRhqy6TX3u4vpBRVg65NAPZX1BY99UWE1f8X5EqttvY2mmSPsGHK9Kukcw70CjB/1s+ZWBcZYhwUZ2CTYwugQbwSbUKZMEG3atc7CxJPrgbktJf4c8IvFfFys+6b3E+2HvIsln5TIYQH9wLvDu6v2a9zYh2evxBUlXt3zeu5f3ZQPXZNHHpf3OcNaAY3dpj+Nh9fU5WdKmRyHHtzbDZZHHWpYEG9kl2MDoEmwEm1CnTBJs2JVg461oj4gZkvZgrGPIoQ9ib/V+VdI5r67MKPo3MURGT1bR/URrSfrD/VRJn8DqBD/2DVmG2iTmeu/xkvYdmCfp6pYejjJwjVbV2rTLqo0l0Ua8m0h6Wsg9Er/OWX1W3kyitUlqWa/NZyT9kdvubhdYl08ZuOZYaqjW8EkIwQYWaZPBxrkS//0Ty5Dwts51OjmgTjHQJu+xaxRL7TMxp/UStiU9IYcGX8d5b5L2O2xCVynrw/pvePeWdG47QdpzrgIZ0aBDbwJtCri9pJPX73p/KenEKfZN24oPS3oihoY3h0o6eZ3lHd1PPfTH+TUGrt2S2qtFV7Q0e0RoVdD3gq7i0C+BL0ka+Gmvitj1X1J9OnG+pD9I50ucZXW6xWViDQytbV3q0pvae6Vh863vf2Gl7sknYhHe94N5LssbdSmWM/D+iWVI76w612lMQJ1ioIcIxK5RLPV36cDWS1gLxnpXlfRhmIZ1Oj96RuL/rs2qhhi6hfwHkj6c1hUZ75D0YT2nmUC/6IeEfljoEp53S7pF41hJA48bvPeJjRUeun3gae/d3iskTez0qane7OtJmlSObWL8+vT7LwbGZ8EHJF3ZMqSJOlYdDfx0iaN+CeiSPm3OpEfglll/Ded+7D3Gu42kwRwNjwAAAACgWXR+pKtd9KHvAZKGHRoaaHgQc46n869bF1/LSd5DJF1Bqz0y9OEjfTIgNzQR0+R6mqRbODQ80MmWPj3WlR4nSjoBvFjSPYk/kzeXi/1R0pu1P3WbyF2L/35dWnTl4j/nLO/pkk7utPvv7t4tvGt4Z3sne0dI+sQ9Lz4o9CHR2utRwnnWtarovT9e0rBPvwT0ntfEWJfnatin4Zo2KdLjVUPrrIn5fYv/HP3zPivpPd4Tzg0vYXwAAAAAUF80NNDwQOd4G3p3ljRY0IfbOr/TU0Uul3RFs87V9JS8RnO7B+TNuaD+ztW5hf7W1XldIumKej2pRJuf6sNEfYA3QQgwwBBDJV3iuOTSxRUlvVkbOXnx369Li0Yu/nNi7JXSybyuUIkdLsSwLltP8kBXN2nYp/ftKpIGQbrHTz+gt16sfmDvs9idl/jrui9WP8Q1MZ+2+M9hSSUAAAAAWENXb+u8TIMHnatNlcbzuuny1m1d+s/zWxcgAroaRJ/Exw4ayrTOW08AAAAAAAAA2o4NxEY/kTK8SdKVMgAAAAAAAADQJuiWlMMlfuhQpK9J2i+CppQAAAAAAAAAbYj2+vihxA8gilAbXm6VX6kAAAAAAAAAwCLaGPIRiR9E5OlN3kl5FgkAAAAAAAAA7LKD958SP5BoVbaeAAAAAAAAANQQDQJOkPjBRCuy9QQAAAAAAACgxoz3/lziBxTNeKuw9QQAAAAAAACg9qzjfUbiBxVZ1a0np3uHF1EMAAAAAAAAAKge+3n/JfFDi0b+1btHMSUAAAAAAAAAgKoyxPtViR9c9OfV3mlFFQAAAAAAAAAAqs1E758kfoCxtK94j5Y0fAEAAAAAAAAA6JMtxdYRsI94Ny10xAAAAAAAAADQNnR4T5T4gQZbTwAAAAAAAACgKZb1/lrihhpsPQEAAAAAAACAppnvfU7KDzRe8m5TwvgAAAAAAAAAoM3ZU8o9AvZ27/QyBgYAAAAAAAAA7c9A77lSTqhxsrD1BAAAAAAAAAByZqwU22/jXu9WpY0GAAAAAAAAAGrHf3mflnwDjTe8PxS2ngAAAAAAAABAwegRsId4X5f8GoQeLWw9AQAAAAAAAICSGOa9yPtvaS3UeMi7a8nXDgAAAAAAAAAgUyQNJpoJNPR0leu8C0q/agAAAAAAAACAxezr/YeEbz05yTs8wvUCAAAAAAAAAPwH7Ytxlvf/hK0nAAAAAAAAAFBBpnlvFbaeAAAAAAAAAEBF2dL7lLD1BAAAAAAAAAAqykHef8pbQ42HvdvEvCgAAAAAAAAAgCxov40LJD0CVreeXOldxdsR86IAAAAAAAAAALKi/Tb+13uMd2TkawEAAAAAAAAACGaMd0DsiwAAAAAAAIBy+P9HQQZ+8X2nOwAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC';
        splash.appendChild(logo);
        logo.onload = function () {
            splash.style.display = 'block';
        };

        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);

        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);

    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        splash.parentElement.removeChild(splash);
        
      //  console.log('hideSplash');
    };

    app.on('CustomRootEnabler:initialized', () => {
          //  console.log('app.root.fire');
            app.fire('CustomRoot:SetActive', true);
        })

    var setProgress = function (value) {
        var bar = document.getElementById('progress-bar');
        if(bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
        }
    };

    var createCss = function () {
        var css = [
            'body {',
            '    background-color: #283538;',
            '}',
            '',
            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '    background-color: #FACD42;',
            '}',
            '',
            '#application-splash {',
            '    position: absolute;',
            '    top: calc(50% - 28px);',
            '    width: 264px;',
            '    left: calc(50% - 132px);',
            '}',
            '',
            '#application-splash img {',
            '    width: 100%;',
            '}',
            '',
            '#progress-bar-container {',
            '    margin: 20px auto 0 auto;',
            '    height: 2px;',
            '    width: 100%;',
            '    background-color: #1d292c;',
            '}',
            '',
            '#progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    background-color: #f60;',
            '}',
            '',
            '@media (max-width: 480px) {',
            '    #application-splash {',
            '        width: 170px;',
            '        left: calc(50% - 85px);',
            '    }',
            '}'
        ].join('\n');

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    };

    createCss();
    showSplash();

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});

// SdkBasedEntity.js
var SdkBasedEntity = pc.createScript('sdkBasedEntity');

SdkBasedEntity.attributes.add('sdkIndeces', { title: 'SDK Indeces', type: 'number', array: true });

// initialize code called once per entity
SdkBasedEntity.prototype.initialize = function () {
    // this.on('enable', this.onEnable, this);
};

SdkBasedEntity.prototype.postInitialize = function () {
    this.onEnable();
};

SdkBasedEntity.prototype.onEnable = function () {
    // console.log('SdkBasedEntity:onEnable: ', this.entity.name);
    this.app.fire('SdkManager:IsCurrentSDK', this.sdkIndeces, enable => {
        // console.log(this.entity.enabled, enable);
        this.entity.enabled = enable;
        // console.log(this.entity.enabled, enable);
    });
};


// swap method called for script hot-reloading
// inherit your script state here
// SdkBasedEntity.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// firstDetect.js
var FirstDetect = pc.createScript('firstDetect');

// initialize code called once per entity
FirstDetect.prototype.initialize = function () {
    this.on('disable', this.onDisable, this);
};

FirstDetect.prototype.onDisable = function () {
   this.app.fire('HomeMenu:FirstTouch');
};

// update code called every frame
FirstDetect.prototype.update = function (dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// FirstDetect.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// SpineSkinHandler.js
var SpineSkinHandler = pc.createScript('spineSkinHandler');

SpineSkinHandler.attributes.add('mrBean', { type: 'entity', title: 'Mr Bean' });
SpineSkinHandler.attributes.add('defaultBean', { type: 'entity', title: 'Default Bean' });

SpineSkinHandler.attributes.add('defaultShirt', {
    title: 'Default Shirt',
    type: 'json',
    schema: [
        { name: 'pageID', type: 'number', title: 'Page ID', default: 0 },
        { name: 'itemID', type: 'number', title: 'Item ID', default: 0 },
        { name: 'name', type: 'string', title: 'Name', default: 'main' },
    ]
})

SpineSkinHandler.attributes.add('defaultHat', {
    title: 'Default Hat',
    type: 'json',
    schema: [
        { name: 'pageID', type: 'number', title: 'Page ID', default: 0 },
        { name: 'itemID', type: 'number', title: 'Item ID', default: 0 },
        { name: 'name', type: 'string', title: 'Name', default: 'main' },
    ]
})

SpineSkinHandler.attributes.add('skins', {
    title: 'Skins',
    type: 'json',
    schema: [
        { name: 'costumes', type: 'string', title: 'Costumes', array: true },
        { name: 'isDress', type: 'boolean', title: 'isDress' },
        { name: 'hatExists', type: 'boolean', title: 'Hat', default: true }
    ],
    array: true
})

// initialize code called once per entity
SpineSkinHandler.prototype.initialize = function () {
    SpineSkinHandler.Instance = this;
    this.app.on('Spine:UpdateHat', this.updateHat, this);
    this.app.on('Spine:UpdateCostume', this.updateCostume, this);
    this.app.on('SpineSkin:SetDefault', this.setDefault, this);
    this.currentHatName = null;
    this.currentCostumeName = null;
};

SpineSkinHandler.prototype.postInitialize = function () {

};

// update code called every frame
SpineSkinHandler.prototype.update = function (dt) {

};

SpineSkinHandler.prototype.setDefault = function () {
    this.mrBean.enabled = true;
    this.defaultBean.enabled = false;
    this.app.fire('SpineAnimator:UpdateAnimator', this.mrBean);
    var skeleton = this.mrBean.spine.skeleton;
    var skeletonData = skeleton.data;

    let hatName = DataManager.Instance.currentHat.name;
    let costumeName = DataManager.Instance.currentShirt.name;
    this.currentHatName = hatName;
    this.currentCostumeName = costumeName;

    var mixAndMatchSkin = new spine.Skin("custom-boy");

    this.currentCostumes = [];
    this.currentHands = skeletonData.findSkin("hands/main_hands");
    this.currentHead = skeletonData.findSkin("head/head");
    this.currentHair = skeletonData.findSkin("head/main_hair");
    this.currentHat = null;

    mixAndMatchSkin.addSkin(this.currentHands);
    mixAndMatchSkin.addSkin(this.currentHair);
    mixAndMatchSkin.addSkin(this.currentHead);

    for (let i = 0; i < this.skins.length; i++) {
        if (this.skins[i].costumes[0] == hatName && this.skins[i].hatExists) {
            let name = null;
            if (hatName == "renaissence_artist")
                name = "hats/renassence_artist_hat";
            else
                name = "hats/" + this.skins[i].costumes[0] + "_hat";
            this.currentHat = skeletonData.findSkin(name);
            mixAndMatchSkin.addSkin(this.currentHat);
            break;
        }
    }

    for (let i = 0; i < this.skins.length; i++) {
        if (this.skins[i].costumes[0] == costumeName) {

            for (let j = 0; j < this.skins[i].costumes.length; j++) {
                let prefix = this.skins[i].isDress ? 'dresses/' : "costumes/";
                let name = prefix + this.skins[i].costumes[j];
                this.currentCostumes.push(skeletonData.findSkin(name));
                mixAndMatchSkin.addSkin(this.currentCostumes[j]);
            }
            break;
        }
    }
    skeleton.setSkin(mixAndMatchSkin);
    skeleton.setSlotsToSetupPose();
};

SpineSkinHandler.prototype.updateHat = function (hatName, pageID, itemID) {
    console.log('updating hat...');
    if (hatName == this.currentHatName) return;
    this.currentHatName = hatName;
    DataManager.Instance.currentHat.pageID = pageID;
    DataManager.Instance.currentHat.itemID = itemID;
    DataManager.Instance.currentHat.name = hatName;
    DataManager.Instance.setData();

    if (!this.mrBean.enabled) return;

    var skeleton = this.mrBean.spine.skeleton;
    var skeletonData = skeleton.data;
    var mixAndMatchSkin = new spine.Skin("custom-boy");

    for (let i = 0; i < this.currentCostumes.length; i++)
        mixAndMatchSkin.addSkin(this.currentCostumes[i]);

    mixAndMatchSkin.addSkin(this.currentHands);
    mixAndMatchSkin.addSkin(this.currentHair);
    mixAndMatchSkin.addSkin(this.currentHead);

    if (hatName == 'main') {
        this.currentHat = null;
    }


    for (let i = 0; i < this.skins.length; i++) {
        if (this.skins[i].costumes[0] == hatName && this.skins[i].hatExists) {
            let name = null;
            if (hatName == "renaissence_artist")
                name = "hats/renassence_artist_hat";
            else
                name = "hats/" + this.skins[i].costumes[0] + "_hat";
            this.currentHat = skeletonData.findSkin(name);
            mixAndMatchSkin.addSkin(this.currentHat);
            break;
        }
    }

    skeleton.setSkin(mixAndMatchSkin);
    skeleton.setSlotsToSetupPose();
};

SpineSkinHandler.prototype.updateCostume = function (costumeName, pageID, itemID) {
    if (this.currentCostumeName == costumeName) return;
    this.currentCostumeName = costumeName;
    console.log('updating costume...');
    DataManager.Instance.currentShirt.pageID = pageID;
    DataManager.Instance.currentShirt.itemID = itemID;
    DataManager.Instance.currentShirt.name = costumeName;
    DataManager.Instance.setData();

    if (!this.mrBean.enabled) return;


    var skeleton = this.mrBean.spine.skeleton;
    var skeletonData = skeleton.data;
    var mixAndMatchSkin = new spine.Skin("custom-boy");

    this.currentCostumes = [];

    mixAndMatchSkin.addSkin(this.currentHands);
    mixAndMatchSkin.addSkin(this.currentHair);
    mixAndMatchSkin.addSkin(this.currentHead);

    if (this.currentHat)
        mixAndMatchSkin.addSkin(this.currentHat);

    for (let i = 0; i < this.skins.length; i++) {
        if (this.skins[i].costumes[0] == costumeName) {

            for (let j = 0; j < this.skins[i].costumes.length; j++) {
                let prefix = this.skins[i].isDress ? 'dresses/' : "costumes/";
                let name = prefix + this.skins[i].costumes[j];
                this.currentCostumes.push(skeletonData.findSkin(name));
                mixAndMatchSkin.addSkin(this.currentCostumes[j]);
            }
            break;
        }
    }
    skeleton.setSkin(mixAndMatchSkin);
    skeleton.setSlotsToSetupPose();
}

// swap method called for script hot-reloading
// inherit your script state here
// SpineSkinHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// Android_iOS_Manager.js
var AndroidIOsManager = pc.createScript('androidIOsManager');

AndroidIOsManager.attributes.add('adHandler', { type: 'entity', title: 'Ad Handler' });
AndroidIOsManager.attributes.add('iAPHandler', { type: 'entity', title: 'IAP Handler' });
AndroidIOsManager.attributes.add('dataHandler', { type: 'entity', title: 'Data Handler' });
AndroidIOsManager.attributes.add('leaderboardHandler', { type: 'entity', title: 'Leaderboard Handler' })
AndroidIOsManager.attributes.add('gAHandler', { type: 'entity', title: 'Game Analytics Handler' })
AndroidIOsManager.attributes.add('idfaPermissionHandler', { type: 'entity', title: 'IDFA Permission Handler' })
AndroidIOsManager.attributes.add('manager', { type: 'entity', title: 'Sdk Manager' })
AndroidIOsManager.attributes.add('firebase', { type: 'entity', titel: 'Firebase' });
// ************************
// * Playcanvas Callbacks *
// ************************

AndroidIOsManager.prototype.initialize = function () {
        this.registerEvents();
};


// update code called every frame
AndroidIOsManager.prototype.update = function (dt) {

};

// **********************
// * initialize Helpers *
// **********************

AndroidIOsManager.prototype.registerEvents = function () {
        // Initialise
        this.entity.on('Initialise:API', this.initAPI, this);

        // Ads
        this.entity.on('Show:Ad', this.showAd, this);
        this.entity.on('RewaredAdLoaded', this.onRewaredAdLoaded, this);
        this.entity.on('OnAdStarted', this.onAdStarted, this);

        // Data
        this.entity.on('Data:Set', this.setData, this);
        this.entity.on('Data:Get', this.getData, this);

        // Leaderboard
        this.entity.on('Leaderboard:Show', this.showLeaderboard, this);
        this.entity.on('Leaderboard:SubmitScore', this.submitLeaderboardScore, this);

        // IAP 
        this.entity.on('App:Purchase', this.purchaseItem, this);
        this.entity.on('App:ProductInfo', this.getProductInfo, this);
        this.entity.on('App:IapRespre', this.iapRestore, this);
        this.entity.on('StoreReady', this.onStoreReady, this);

        // Misc
        // this.entity.on('Haptic:Feedback', this.vibrate, this);
        this.entity.on('UserConsent', this.userConsent, this);
        this.entity.on('RequestPermission', this.requestPermission, this);
        this.entity.on('RequestFirebase', this.requestFirebase, this);

};

AndroidIOsManager.prototype.initAPI = function (testSettings, callback) {
        console.log('Initialising AndroidIOsManager Manager');
        this.dataHandler.fire('Initialize', testSettings.isEditor, callback);
        if (testSettings.isEditor) {
                if (callback) callback();
                return;
        }

        this.leaderboardHandler.fire('Initialize');
        this.iAPHandler.fire('Initialize');
        this.gAHandler.fire('Initialize');
        this.initAds(testSettings);
};

AndroidIOsManager.prototype.initAds = function (testSettings) {
        let sdk_key = "ImvuHsyHnDgUJlSEoaoGqi55vsokSQJWhEbtHsRk0ECd1dWG3L9oDsrIfhNZD6TyMnFRafWJdKasPf5JblEzyL";
        AndroidIOsManager.AppLovinMAX = cordova.require('cordova-plugin-applovin-max.AppLovinMAX');

        AndroidIOsManager.AppLovinMAX.initialize(sdk_key, configuration => {
                console.log(DataManager.Instance.firstTimeOpened);
                if (!DataManager.Instance.firstTimeOpened)
                        AndroidIOsManager.AppLovinMAX.setHasUserConsent(true);
                this.adHandler.fire('Initialize', testSettings.isEditor);
                this.manager.onAdsInitialized();
        });
};

AndroidIOsManager.prototype.showAd = function (adType, testSettings, callback, enable) {
        console.log('AndroidIOsManager:showAd: ', adType, testSettings);
        this.adHandler.fire('Show:Ad', adType, testSettings, callback, enable)
};

AndroidIOsManager.prototype.onRewaredAdLoaded = function (isLoaded) {
        this.app.fire('SdkManager:RewaredAdLoaded', isLoaded);
};

AndroidIOsManager.prototype.onAdStarted = function (isStared) {
        AdsManager.Instance.showAdLoading('Loading Ad...', isStared);
        this.app.fire('SoundManager:PauseGameSound', isStared);
        this.app.timeScale = isStared ? 0 : 1;
};

// **********************
// * Data Functions *
// **********************

AndroidIOsManager.prototype.setPlayerScore = function (testSettings, newScore) {
        console.log("AndroidIOsManager:SetPlayerScore", newScore);
        this.tournamentHandler.fire('Tournament:SetScore', testSettings, newScore);
};

AndroidIOsManager.prototype.setData = function (testSettings, data, callback) {
        this.dataHandler.fire('Data:Set', testSettings, data, callback);
};

AndroidIOsManager.prototype.getData = function (testSettings, callback) {
        this.dataHandler.fire('Data:Get', testSettings, callback);
};

// *************************
// * Leaderboard Functions *
// *************************

AndroidIOsManager.prototype.submitLeaderboardScore = function (testSettings, score) {
        console.log("AndroidIOsManager:SetLeaderboardScore", score);
        this.leaderboardHandler.fire('Leaderboard:SubmitScore', testSettings, score);
}

AndroidIOsManager.prototype.showLeaderboard = function (testSettings, callback) {
        console.log("AndroidIOsManager:ShowLeaderboard");
        this.leaderboardHandler.fire('Show', testSettings, callback);
};

// *****************
// * IAP Functions *
// *****************

AndroidIOsManager.prototype.purchaseItem = function (testSettings, callback) {
        console.log('AndroidIOsManager:PurchaseItem: ', callback);
        this.iAPHandler.fire('Purchase', testSettings, callback);
}

AndroidIOsManager.prototype.getProductInfo = function (testSettings, callback) {
        console.log('AndroidIOsManager:getProductInfo');
        this.iAPHandler.fire('ProductInfo', testSettings, callback);

};

AndroidIOsManager.prototype.onStoreReady = function (isStoreReady) {
        console.log('AndroidIOsManager:onStoreReady: ', isStoreReady);
        this.manager.fire('StoreReady', isStoreReady);
};

AndroidIOsManager.prototype.iapRestore = function (testSettings, callback) {
        console.log('AndroidIOsManager:iapRestore');
        this.iAPHandler.fire('Restore', testSettings, callback);

};

// *****************
// * Miscellaneous *
// *****************

AndroidIOsManager.prototype.userConsent = function (isAccept) {
        console.log('AndroidIOsManager:userConsent: ', isAccept);
        if (AndroidIOsManager.AppLovinMAX)
                AndroidIOsManager.AppLovinMAX.setHasUserConsent(isAccept);
};

AndroidIOsManager.prototype.requestFirebase = function (isAllowed, testSettings) {
        this.firebase.fire('RequestPermission', isAllowed, testSettings);
};

AndroidIOsManager.prototype.requestPermission = function (testSettings, callback) {
        console.log('AndroidIOsManager:requestPermission');
        this.idfaPermissionHandler.fire('RequestPermission', testSettings, callback);
};


// swap method called for script hot-reloading
// inherit your script state here
// AndroidIOsManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// AIBannerAdHandler.js
// Banner Ads are under development in Cordova ironsource
// https://github.com/charlesbodman/cordova-plugin-ironsource-ads/?tab=readme-ov-file#state-of-development
class AiBannerAdhandler {
    constructor(unit_id) {
        // console.log('AI:Banner:createBanner: ', unit_id);

        this.unitId = unit_id;
        AndroidIOsManager.AppLovinMAX.createBanner(this.unitId, AndroidIOsManager.AppLovinMAX.AdViewPosition.BOTTOM_CENTER);
        AndroidIOsManager.AppLovinMAX.setBannerBackgroundColor(this.unitId, '#000000');
    }

    show(enable) {
        // console.log('AI:Banner:show: ', enable, AndroidIOsManager.AppLovinMAX.showBanner);
        if (enable)
            AndroidIOsManager.AppLovinMAX.showBanner(this.unitId);
        else this.hide();
    }

    hide() {
        // console.log('AI:Banner:hide: ', AndroidIOsManager.AppLovinMAX.hideBanner);
        AndroidIOsManager.AppLovinMAX.hideBanner(this.unitId);
    }

    updateCoolDown(dt) {

    }
}
// swap method called for script hot-reloading
// inherit your script state here
// GD:Banner.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// AIRewardedAdHandler.js
class AiRewardedAdhandler {
    constructor(handler, unit_id) {
        this.app = handler.app;
        this.manager = handler.manager;
        this.handler = handler;
        this.unit_id = unit_id;

        this.cooldownTimer = 30;
        this.retryCount = 0;
        this.isLoaded = false;
        this.stopTimer = false;

        this.callback = null;
        this.err = null;

        this.addEventListeners();
    }

    addEventListeners() {
        console.log('AI:Rewarded:addEventListeners');

        window.addEventListener("OnRewardedAdLoadedEvent", this.onLoaded.bind(this));
        window.addEventListener("OnRewardedAdLoadFailedEvent", this.onLoadFailed.bind(this));
        window.addEventListener("OnRewardedAdReceivedRewardEvent", this.onReceivedReward.bind(this));
        window.addEventListener("OnRewardedAdFailedToDisplayEvent", this.onDisplayFailed.bind(this));
        window.addEventListener("rewardedVideoClosed", this.onClosed.bind(this));
    };

    onLoaded(e) {
        console.log('AI:Rewarded:Loaded');
        this.isLoaded = true;
        this.stopTimer = true;
        this.manager.fire('RewaredAdLoaded', true);
    }

    onLoadFailed(e) {
        console.log('AI:Rewarded:LoadFailed');
        this.stopTimer = false;
    }

    onReceivedReward(e) {
        console.log('AI:Rewarded:ReceivedReward');
        this.handler.onResultShow(true);
    }

    onDisplayFailed() {
        console.log('AI:Rewarded:DisplayFailed');
        this.handler.onResultShow(false);
    }

    onClosed() {
        console.log('AI:Rewarded:Closed');
        this.handler.onResultShow(false);
    }


    load() {
        console.log('AI:Rewarded:load: ', this.unit_id);
        AndroidIOsManager.AppLovinMAX.loadRewardedAd(this.unit_id);
    }

    show(callback) {
        let isReady = AndroidIOsManager.AppLovinMAX.isRewardedAdReady(this.unit_id);
        console.log('AI:Rewarded:show: ', isReady, callback);
        this.callback = callback;
        this.err = null;
        this.isLoaded = false;

        if (isReady) {
            this.handler.onAdStarted(true);
            AndroidIOsManager.AppLovinMAX.showRewardedAd(this.unit_id);
        }
        else this.onShowResult(false);
    }

    onShowResult(isSuccess) {
        if (isSuccess) this.err = null;
        else if (this.err == null) this.err = "User did not watch the whole ad.";
        console.log('AI:RewardedResult: ', this.err, this.callback);
        this.cooldownTimer = 5;
        this.retryCount = this.err === null ? 0 : this.retryCount;
        if (this.callback) this.callback(this.err);
        this.callback = null;
        this.err = null;
        this.handler.onAdStarted(false);
        this.stopTimer = false;
    }

    updateCoolDown(dt) {
        // console.log('AI:updateCoolDown: ', this.isLoaded, this.stopTimer, this.cooldownTimer);
        if (this.isLoaded || this.stopTimer) return;
        this.cooldownTimer -= dt;
        if (this.cooldownTimer <= 0) {
            if (this.retryCount++ > 3) return;
            this.load();
            this.cooldownTimer = 30;
        }
    }
}

// swap method called for script hot-reloading
// inherit your script state here
// %cGD%c:Rewarded.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// AIInterstitialAdHandler.js
class AiInterstitialAdhandler {

    constructor(handler, unit_id) {
        this.handler = handler;
        this.unit_id = unit_id;

        this.showCooldown = 0;
        this.cooldownTimer = 30;
        this.retryCount = 0;
        this.callback = null;
        this.err = null;
        this.isLoaded = false;

        this.addEventListeners();
    }

    addEventListeners() {
        console.log('AI:Interstitial:addEventListeners');

        window.addEventListener("OnInterstitialLoadedEvent", this.onLoaded.bind(this));
        window.addEventListener("OnInterstitialLoadFailedEvent", this.onLoadFailed.bind(this));
        window.addEventListener("OnInterstitialDisplayedEvent", this.onDisplayed.bind(this));
        window.addEventListener("OnInterstitialAdFailedToDisplayEvent", this.onDisplayFailed.bind(this));
        window.addEventListener("OnInterstitialHiddenEvent", this.onHidden.bind(this));
    }

    onLoaded(adInfo) {
        console.log('AI:Interstitial:Loaded');
        this.isLoaded = true;
        this.stopTimer = true;
    }

    onLoadFailed(adInfo) {
        console.log('AI:Interstitial:LoadFailed');
        this.stopTimer = false;
    }

    onDisplayed(adInfo) {
        console.log('AI:Interstitial:Displayed');
        this.handler.onResultShow(true);
    }

    onDisplayFailed(adInfo) {
        console.log('AI:Interstitial:DisplayFailed');
        // this.handler.onResultShow(false);
    }

    onHidden(adInfo) {
        console.log('AI:Interstitial:Hidden');
        this.handler.onResultShow(false);
        this.handler.onAdStarted(false);
    }

    load() {
        console.log('AI:Interstitial:show: ', AndroidIOsManager.AppLovinMAX.loadInterstitial, this.unit_id);
        AndroidIOsManager.AppLovinMAX.loadInterstitial(this.unit_id);
    }

    show(callback) {
        let isReady = AndroidIOsManager.AppLovinMAX.isInterstitialReady(this.unit_id);
        console.log('AI:Interstitial:show: ', isReady, this.unit_id);

        this.callback = callback;
        this.isLoaded = false;

        if (isReady) {
            this.handler.onAdStarted(true);
            AndroidIOsManager.AppLovinMAX.showInterstitial(this.unit_id);
        }
        else this.onShowResult(false);
    }

    onShowResult(isSuccess) {
        if (isSuccess) this.err = null;
        else if (this.err === null) this.err = "User did not watch the whole ad.";

        console.log('AI:Interstitial:onShowResult: ', this.err, { callback: this.callback });

        this.cooldownTimer = 0;
        this.stopTimer = false;
        this.retryCount = this.err === null ? 0 : this.retryCount;
        if (this.callback) this.callback(this.err);
        this.callback = null;
        this.err = null;
    }

    updateCoolDown(dt) {
        this.updatePreloadCooldown(dt);
    }

    updatePreloadCooldown(dt) {
        if (this.isLoaded) return;
        this.cooldownTimer -= dt;
        if (!this.stopTimer && this.cooldownTimer <= 0) {
            if (this.retryCount++ > 3) return;
            this.load();
            this.cooldownTimer = 30;
        }
    }
};

// AINativeStorageHandler.js
class AiNativeStorageHandler {
    constructor(callback) {
        console
        this.initCallback = callback;
        this.name = "PlayerData";
        this.defaultData = {
            CompletedMissions: 0,
            GameCount: 0,
            BestScore: 0,
            RandomUnlockPrice: EconomyManager.Instance.randomUnlockSettings[0].basePrice,
            Coins: EconomyManager.Instance.defaultCoins,
            CurrentTheme: ThemeController.Instance.defaultTexture,
            CurrentBox: ThemeController.Instance.defaultTexture,
            CurrentShirt: DataManager.Instance.currentShirt,
            CurrentHat: DataManager.Instance.currentHat,
            UnlockedItems: null,
            FirstTimeOpened: DataManager.Instance.firstTimeOpened,
            IsOfferPurchased: DataManager.Instance.isOfferPurchased,
        };

        if (document.readyState === 'complete')
            this.onDeviceReady();
        else
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    }

    onDeviceReady() {
        // console.log('NativeStorage:onDeviceReady: ');
        // NativeStorage.clear();
        this.isReady = true;
        if (this.initCallback) this.initCallback();
        this.initCallback = null;
    }

    setData(data, callback) {
        let d = JSON.stringify(data);
        let t = typeof data;
        // console.log('NativeStorage:setData: ', t, typeof d, d);
        this.setCallback = callback;
        NativeStorage.setItem(this.name, d, this.setSuccess.bind(this), this.setError.bind(this));
    }

    setSuccess(data) {
        // console.log('NativeStorage:setSuccess: ', typeof data, this.setCallback, data);
        if(this.setCallback) this.setCallback(JSON.parse(data));
        this.setCallback = null;
    }

    setError(error) {
        // console.log('NativeStorage:setError: ', error);
        if(this.setCallback) this.setCallback();
        this.setCallback = null;
    }

    getData(callback) {
        // console.log('NativeStorage:getData: ', callback);
        this.getCallback = callback;
        NativeStorage.getItem(this.name, this.getSuccess.bind(this), this.getError.bind(this));
    }

    getSuccess(data) {
        // console.log('NativeStorage:getSuccess: ', data);
        if (this.getCallback) this.getCallback(JSON.parse(data));
        this.getCallback = null;
    }

    getError(error) {
        // console.log('NativeStorage:getError: ', error);
        if (error.code === 2) {
            this.setData(this.defaultData, this.getCallback);
        }
    }
}

// swap method called for script hot-reloading
// inherit your script state here
// AinativeStorageHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// LocalStorageHandler.js
class LocalStorageHandler {
    constructor() {

    }

    save(testSettings, data, callback) {
        console.log('%cAI%c:Data:Set', "color: yellow;", "");
        //  console.log('Saving...CurrentShirt: ', data['CurrentShirt'], data['CurrentHat']);
        localStorage.setItem('CompletedMissions', data['CompletedMissions']);
        localStorage.setItem('GameCount', data['GameCount']);
        localStorage.setItem('BestScore', data['BestScore']);
        localStorage.setItem('Coins', data['Coins']);
        localStorage.setItem('CurrentTheme', data['CurrentTheme']);
        localStorage.setItem('CurrentBox', data['CurrentBox']);
        localStorage.setItem('CurrentShirt', data['CurrentShirt']);
        localStorage.setItem('CurrentHat', data['CurrentHat']);
        localStorage.setItem('UnlockedItems', data['UnlockedItems']);
        localStorage.setItem('RandomUnlockPrice', data['RandomUnlockPrice']);
        if (data['FirstTimeOpened'] !== undefined)
            localStorage.setItem('FirstTimeOpened', data['FirstTimeOpened']);
        localStorage.setItem('IsOfferPurchased', data['IsOfferPurchased']);
        if (callback) return callback(testSettings.isSuccessful ? null : "Failed to store Data. Unknown reason");
    }

    load(testSettings, callback) {
        console.log('%cAI%c:Data:Get', "color: yellow;", "");
        let data = {
            CompletedMissions: this.getItem('CompletedMissions', 0),
            GameCount: this.getItem('GameCount', 0),
            BestScore: this.getItem('BestScore', 0),
            RandomUnlockPrice: this.getItem('RandomUnlockPrice', EconomyManager.Instance.randomUnlockSettings[0].basePrice),
            Coins: this.getItem('Coins', EconomyManager.Instance.defaultCoins),
            CurrentTheme: this.getItem('CurrentTheme', ThemeController.Instance.defaultTexture),
            CurrentBox: this.getItem('CurrentBox', ThemeController.Instance.defaultTexture),
            CurrentShirt: this.getItem('CurrentShirt', DataManager.Instance.currentShirt),
            CurrentHat: this.getItem('CurrentHat', DataManager.Instance.currentHat),
            UnlockedItems: this.getItem('UnlockedItems', null),
            FirstTimeOpened: this.getItem('FirstTimeOpened', true),
            IsOfferPurchased: this.getItem('IsOfferPurchased', false),
        }
        if (callback) callback(testSettings.isSuccessful ? data : null, testSettings.isSuccessful ? null : "Failed to retrieve data. Unknown reason");
        return;
    }

    getItem(key, defaultValue) {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
            if (key == 'UnlockedItems' || key == 'CurrentBox' || key == 'CurrentTheme' || key == 'CurrentHat' || key == 'CurrentShirt' || key == 'FirstTimeOpened' || key == 'IsOfferPurchased') {
                return storedValue;
            }
            return parseInt(storedValue);
        } else {
            return defaultValue;
        }
    }
}

// swap method called for script hot-reloading
// inherit your script state here
// LocalStorageHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// AIAdHandler.js
var AIAdhandler = pc.createScript('aIAdhandler');

AIAdhandler.attributes.add('manager', { type: 'entity', title: 'Android/iOS Manager' });

AIAdhandler.attributes.add('appKeys', {
    title: 'App Keys',
    type: 'json',
    schema: [
        { name: 'banner', type: 'string', title: 'Banner' },
        { name: 'interstitial', type: 'string', title: 'Interstitial' },
        { name: 'rewarded', type: 'string', title: 'Rewarded' },
    ],
    array: true,
    description: 'It is important to keep sequence same as Current Platform variable.'
});

AIAdhandler.prototype.initialize = function () {
    this.entity.on('Initialize', this.initAds, this);
    this.entity.on('Show:Ad', this.showAd, this);
    this.entity.on('Ads:Preload', this.preload, this);

    this.currentPlatform = pc.platform.android ? 0 : 1;
    this.isEditorMode = true;
    this.isReady = false;
    this.currentAd = null;
};

AIAdhandler.prototype.initAds = function (isEditor) {
    this.isEditorMode = isEditor;
    if (this.isEditorMode) return;
    this.onDeviceReady();
};

AIAdhandler.prototype.onDeviceReady = function () {
    let appKey = this.appKeys[this.currentPlatform];

    this.rewardedAd = new AiRewardedAdhandler(this, appKey.rewarded);
    this.interstitialAd = new AiInterstitialAdhandler(this, appKey.interstitial);
    this.bannerAd = new AiBannerAdhandler(appKey.banner);
    this.preload();
    this.isReady = true;
};

// update code called every frame
AIAdhandler.prototype.update = function (dt) {
    if (this.isEditorMode || !this.isReady) return;
    this.rewardedAd.updateCoolDown(dt);
    this.interstitialAd.updateCoolDown(dt);
    // this.bannerAd.updateCoolDown(dt);
};

AIAdhandler.prototype.preload = function () {
    console.log('AIAdhandler: AD Handler Preload');
    this.loadInterstitialAd();
    this.loadRewardedAd();
};

AIAdhandler.prototype.showAd = function (adType, testSettings, callback, enable) {
    // console.log('AIAdhandler:showAd', adType, testSettings);
    switch (adType) {
        case 'Interstitial': return this.showInterstitialAd(testSettings, callback);
        case 'Rewarded': return this.showRewardedAd(testSettings, callback);
        case 'Banner': return this.showBannerAd(testSettings, callback, enable);
        default: return console.error('Invalid Ad Type');
    }
}

// ****************
// * Interstitial *
// ****************

AIAdhandler.prototype.loadInterstitialAd = function () {
    // console.log('FB:Loading Interstitial Ad');
    this.interstitialAd.load();
}

AIAdhandler.prototype.showInterstitialAd = function (testSettings, callback) {
    this.currentAd = "Interstitial";
    if (testSettings.isEditor) {
        AdsManager.Instance.showAd(() => { if (callback) callback(testSettings.isSuccessful ? null : "Failed to show add. Unknown reason") });
        return;
    }

    this.interstitialAd?.show(callback);
};

// ************
// * Rewarded *
// ************

AIAdhandler.prototype.loadRewardedAd = function () {
    console.log('AIAdhandler:loadRewardedAd');
    this.rewardedAd.load(isLoaded => { this.manager.fire('RewaredAdLoaded', isLoaded) });
};

AIAdhandler.prototype.showRewardedAd = function (testSettings, callback) {
    // console.log('AIAdhandler:showRewardedAd', testSettings);
    this.currentAd = "Rewarded";

    if (testSettings.isEditor) {
        AdsManager.Instance.showAd(() => { if (callback) callback(testSettings.isSuccessful ? null : "Failed to show add. Unknown reason") });
        return;
    }

    this.manager.fire('RewaredAdLoaded', false);
    this.rewardedAd?.show(callback);
};

AIAdhandler.prototype.onResultShow = function (isSuccess) {
    if (this.currentAd == null) return;
    if (this.currentAd == 'Rewarded') {
        this.rewardedAd.onShowResult(isSuccess);
    }
    else if (this.currentAd == 'Interstitial')
        this.interstitialAd.onShowResult(isSuccess);
    this.currentAd = null;
}

// **********
// * Banner *
// **********

AIAdhandler.prototype.showBannerAd = function (testSettings, callback, enable) {
    if (testSettings.isEditor) {
        if (callback) callback(testSettings.isSuccessful ? null : "Failed to show add. Unknown reason");
        return;
    }

    // console.log('Show Banner Ad: ', enable);
    this.bannerAd?.show(enable);
};

AIAdhandler.prototype.onAdStarted = function (isStarted) {
    this.manager.fire('OnAdStarted', isStarted);
};

// AIDataHandler.js
var AidataHandler = pc.createScript('aidataHandler');

// initialize code called once per entity
AidataHandler.prototype.initialize = function () {
    this.entity.on('Initialize', this.initData, this);
    this.entity.on('Data:Set', this.setData, this);
    this.entity.on('Data:Get', this.getData, this);
    this.callback = null;
    this.testSettings = null;
    this.tempData = null;
};

AidataHandler.prototype.initData = function (isEditor, callback) {
    // console.log('AidataHandler:initData: ')
    this.isEditorMode = isEditor;
    if (this.isEditorMode) {
        this.localStorage = new LocalStorageHandler();
        if (callback) callback();
        return;
    }

    this.storage = new AiNativeStorageHandler(() => {
        this.isStorageInitializedB = true;
        this.onStorageInitialized(callback);
    });
    this.isStorageInitializedA = true;
    this.onStorageInitialized(callback);
};

AidataHandler.prototype.onStorageInitialized = function(callback) {
    if (!this.isStorageInitializedA || !this.isStorageInitializedB) return;
    if (callback) callback();
};

// ************************
// * Get/Set Data Functions *
// ************************

AidataHandler.prototype.setData = function (testSettings, data, callback) {

    if (testSettings.isEditor)
        return this.localStorage.save(testSettings, data, callback);

    this.storage.setData(data, callback);
};

AidataHandler.prototype.getData = function (testSettings, callback) {
    if (testSettings.isEditor)
        return this.localStorage.load(testSettings, callback);

    this.storage.getData(callback);
};

// AIIAPHandler.js
var Aiiaphandler = pc.createScript('aiiaphandler');

Aiiaphandler.attributes.add('disable', { type: 'boolean', title: 'Disable' });
Aiiaphandler.attributes.add('manager', { type: 'entity', title: 'Mobile Manager' })
Aiiaphandler.attributes.add('productIds', { type: 'string', title: 'Product IDs', array: true });

// initialize code called once per entity
Aiiaphandler.prototype.initialize = function () {
    if (this.disable) return;
    this.entity.on('Initialize', this.initIAP, this);
    this.entity.on('Purchase', this.purchase, this);
    this.entity.on('Restore', this.restore, this);
    this.entity.on('ProductInfo', this.getProductInfo, this);

    this.currentAction = "";
};

Aiiaphandler.prototype.initIAP = function () {
    if (document.readyState === 'complete')
        this.onDeviceReady();
    else
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
};

Aiiaphandler.prototype.onDeviceReady = function () {
    this.store = CdvPurchase.store;
    this.platform = CdvPurchase.Platform;
    this.productType = CdvPurchase.ProductType;
    this.currentStore = pc.platform.android ? this.platform.GOOGLE_PLAY : this.platform.APPLE_APPSTORE;

    this.store.register([
        {
            type: this.productType.NON_CONSUMABLE,
            id: this.productIds[0],
            platform: this.platform.GOOGLE_PLAY
        },
        {
            type: this.productType.NON_CONSUMABLE,
            id: this.productIds[0],
            platform: this.platform.APPLE_APPSTORE
        },
    ]);

    this.addEventListeners();

    this.store.initialize([
        this.platform.APPLE_APPSTORE,
        this.platform.GOOGLE_PLAY
    ]).then(() => {
        console.log('IAP:Store is ready!');
        this.isStoreReady = true;
        if (pc.platform.android) this.manager.fire('StoreReady');
    });

};

Aiiaphandler.prototype.addEventListeners = function () {
    this.store.when()
        .approved(transaction => {
            console.log('Aiiaphandler:approved');
            transaction.verify();
        })
        .verified(receipt => {
            console.log('Aiiaphandler:verified');
            receipt.finish();
        })
        .finished(transaction => {
            console.log('Aiiaphandler:finished');
            // console.log('Products owned: ' + transaction.products.map(p => p.id).join(','));
            this.checkForPurchaseSuccess();
        })
        .receiptUpdated(r => {
            console.log('Aiiaphandler:receiptUpdated');

            let isRestored = this.currentAction === "Restore"; // for iOS to manual restore
            let isAndroid = pc.platform.android; // for android to auto restore
            if (isRestored || isAndroid)
                this.checkForPurchaseSuccess(isAndroid);
        })
        .productUpdated(p => {
            console.log('Aiiaphandler:productUpdated: ', JSON.stringify(p));
            let isRestored = this.currentAction === "Restore"; // for iOS to manual restore
            let isAndroid = pc.platform.android; // for android to auto restore
            if (isRestored || isAndroid)
                this.checkForPurchaseSuccess(isAndroid);
        });
};

Aiiaphandler.prototype.checkForPurchaseSuccess = function (isAndroid) {
    // const product = this.store.get(this.productIds[0], this.currentStore);
    // console.log('checkForPurchaseSuccess: ', product.owned, product.title, this.purchaseCallback);
    // const isPurchased = product.owned;

    if (this.purchaseCallback) {
        const isPurchased = this.isItemPurchased();
        console.log('checkForPurchaseSuccess: ', isPurchased);

        if (isPurchased)
            this.purchaseCallback();
        else
            this.purchaseCallback("Error");
        this.purchaseCallback = null;
    }
    else if (isAndroid) {
        const product = this.store.get(this.productIds[0], this.currentStore);

        if (product.owned) {
            DataManager.Instance.isOfferPurchased = true;
            DataManager.Instance.unlockAllItems();
            DataManager.Instance.setData();
            this.app.fire('HomeMenu:SetProductInfo', 0, false);
        }
    }
};

Aiiaphandler.prototype.updatePurchases = function (receipt) {
    receipt.transactions.forEach(transaction => {
        transaction.products.forEach(trProduct => {
            console.log(`IAP:UpdatePurchase:product owned: ${trProduct.id}`);
        });
    });
};

Aiiaphandler.prototype.updateUI = function (product) {
    console.log(`IAP:UpdateUI:- title: ${product.title}, ${product.owned}`);
    const pricing = product.pricing;
    DataManager.Instance.isOfferPurchased = product.owned;
    if (DataManager.Instance.isOfferPurchased) {
        DataManager.Instance.unlockAllItems();
    }
    if (pricing) {
        console.log(`IAP:UpdateUI:price: ${pricing.price} ${pricing.currency}`);
    }
};

Aiiaphandler.prototype.purchase = function (testSettings, callback) {
    if (testSettings.isEditor) {
        console.log("IAP:Purchase:TestingMode")
        CustomCoroutine.Instance.set(() => {
            if (callback)
                callback(
                    testSettings.isSuccessful ?
                        null : 'IAP:Purchase:ERROR. Failed to place order. '
                );
        }, 2);
        return;
    };

    if (!this.isStoreReady) return;

    this.currentAction = "Purchase";
    this.purchaseCallback = callback;
    const product = this.store.get(this.productIds[0], this.currentStore);
    product.getOffer().order().then(result => {
        if (result) {
            console.log("IAP:Purchase:ERROR. Failed to place order. " + result.code + ": " + result.message);
            if (callback) callback('IAP:Purchase:ERROR. Failed to place order. ');
            this.purchaseCallback = null;
        }
        else {
            console.log("IAP:Purchase:purchase ordered successfully");
            if (callback) callback();
            this.purchaseCallback = null;
        }
    }).catch(error => {
        console.log("IAP Purchase:Error: ", error);
        if (callback) callback('IAP:Purchase:ERROR. Failed to place order.');
        this.purchaseCallback = null;
    })
};

Aiiaphandler.prototype.restore = function (testSettings, callback) {
    if (testSettings.isEditor) {
        if (callback) callback();
        console.log("IAP:Restore:TestingMode")
        return;
    };

    console.log('Aiiaphandler:restore: ', this.isStoreReady);
    if (!this.isStoreReady) return;

    this.currentAction = "Restore";
    this.purchaseCallback = callback;
    this.store.restorePurchases();
};

Aiiaphandler.prototype.isItemPurchased = function () {
    const product = this.store.get(this.productIds[0], this.currentStore);
    console.log('isItemPurchased: ', product.owned, product.title);
    return product.owned;
};


Aiiaphandler.prototype.getProductInfo = function (testSettings, callback) {
    if (testSettings.isEditor) {
        let p = "PKR200";
        // let deal = "ALL HATS, COSTUMES, BACKGROUNDS AND BOXES.PLUS: NO MORE ADS!"
        if (callback) callback(testSettings.isSuccessful ? p : undefined, !DataManager.Instance.isOfferPurchased);
        return;
    };
    console.log('Aiiaphandler:getProductInfo: ', this.isStoreReady);
    if (!this.isStoreReady) return;
    const product = this.store.get(this.productIds[0], this.currentStore);
    const price = `${product.pricing.currency}${product.pricing.price}`;
    // const deal = product.description;
    console.log('product: ', product.owned, product.title);
    const isPurchased = !product.owned;
    if (callback) callback(price, isPurchased);
}

// swap method called for script hot-reloading
// inherit your script state here
// Aiiaphandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// TCMenuEventListener.js
var TcmenuEventListener = pc.createScript('tcmenuEventListener');

TcmenuEventListener.attributes.add('root', { type: 'entity', title: 'Root' });

TcmenuEventListener.attributes.add('btns', {
    title: 'Buttons',
    type: 'json',
    schema: [
        { name: 'active', type: 'asset', title: 'active' },
        { name: 'inactive', type: 'asset', title: 'Inactive' },
        { name: 'btns', type: 'entity', title: 'Buttons', array: true },
    ],
    array: true,
    description: 'Sequence of this array is very crucial for the logic. Please do not change.'
});

TcmenuEventListener.attributes.add('links', {
    title: 'Links',
    type: 'json',
    schema: [
        { name: 'terms', type: 'string', title: 'Terms of services' },
        { name: 'privacy', type: 'string', title: 'Privacy Policy' },
    ]
});

// initialize code called once per entity
TcmenuEventListener.prototype.initialize = function () {
    this.app.on('T&CMenu:OnClick', this.onClickButton, this);
    this.inactiveAllBtns();
    this.isOverTheAgeOf16 = false;
    this.isConsentOptionSelected = false;
    this.isReportingOptionSelected = false;
    this.isReportingAllowed = false;
};

TcmenuEventListener.prototype.inactiveAllBtns = function () {
    for (let i = 0; i < this.btns.length; i++) {
        for (let j = 0; j < this.btns[i].btns.length; j++) {
            this.btns[i].btns[j].element.texture = this.btns[i].inactive.resource;
        }
    }
    this.btns[2].btns[0].button.active = false;
};

// update code called every frame
TcmenuEventListener.prototype.update = function (dt) {

};

TcmenuEventListener.prototype.onClickButton = function (name, id) {
    console.log('TC:onClickButton: ', name);
    switch (name) {
        case "Start":
            this.onClickStartButton();
            break;
        case "Terms":
            window.open(this.links.terms, '_blank', 'location=yes');
            break;
        case "Privacy":
            window.open(this.links.privacy, '_blank', 'location=yes');
            break;
        case "Accept": case "Reject":
            this.onAction(name, parseInt(id));
            break;
    }
};

TcmenuEventListener.prototype.onClickStartButton = function () {
    console.log('TcmenuEventListener:onClickStartButton');
    if (!pc.platform.ios)
        this.onComplete();
    else {
        this.root.enabled = false;
        this.app.fire('SdkManager:RequestPermission', consent => this.onComplete(consent));
    }
};

TcmenuEventListener.prototype.onComplete = function (consent) {
    MenuManager.Instance.changeState(MenuManager.States.Home);
    DataManager.Instance.firstTimeOpened = false;
    DataManager.Instance.setData();
    this.app.fire('SdkManager:UserConsent', consent);
    this.app.fire('HomeMenu:UpdateValues');
    this.app.fire('PlayerController:EnableOld');
    this.app.fire('SdkManager:FirebaseReporting', this.isReportingAllowed);
    console.log('TcmenuEventListener:onClickButton: ', name, " completed");
};

// ID === 0: User Consent
// ID === 1: User is over the age of 16
TcmenuEventListener.prototype.onAction = function (action, id) {
    let isAccept = action === "Accept";
    let state1 = isAccept ? "active" : "inactive";
    let state2 = isAccept ? "inactive" : "active";

    // Accept Button
    this.btns[0].btns[id].element.texture = this.btns[0][state1].resource;
    // Reject Button
    this.btns[1].btns[id].element.texture = this.btns[1][state2].resource;

    if (id === 0) this.isConsentOptionSelected = true;
    if (id === 1) this.isOverTheAgeOf16 = isAccept;
    if (id === 2) {
        this.isReportingOptionSelected = true;
        this.isReportingAllowed = isAccept;
    }
    let canStart = this.isConsentOptionSelected && this.isOverTheAgeOf16 && this.isReportingOptionSelected;
    let state3 = canStart ? "active" : "inactive";
    console.log(canStart, this.isConsentOptionSelected, this.isOverTheAgeOf16)

    // Start Button
    this.btns[2].btns[0].element.texture = this.btns[2][state3].resource;
    this.btns[2].btns[0].button.active = canStart;
};

// swap method called for script hot-reloading
// inherit your script state here
// TcmenuEventListener.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// AILeaderboardHandler.js
var AileaderboardHandler = pc.createScript('aileaderboardHandler');

AileaderboardHandler.attributes.add('disable', { type: 'boolean', title: 'Disable' });
AileaderboardHandler.attributes.add('globalID', { name: 'Global Leaderboard ID', type: 'string' })

// initialize code called once per entity
AileaderboardHandler.prototype.initialize = function () {
    if (this.disable) return;
    this.entity.on('Initialize', this.initLeaderboard, this);
    this.entity.on('Submit:Score', this.submitScore, this);
    this.entity.on('Show', this.displayLeaderboard, this);
    this.isLoggedin = false;
};

// update code called every frame
AileaderboardHandler.prototype.update = function (dt) {

};

AileaderboardHandler.prototype.initLeaderboard = function () {
    if (document.readyState === 'complete')
        this.onDeviceReady();
    else
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
};

AileaderboardHandler.prototype.onDeviceReady = function (callback) {
    let self = this;
    this.isDeviceReady = true;
    console.log('AileaderboardHandler:onDeviceReady');
    leaderboard.init(
      function () { 
            console.log("Leaderboard:init:success");
            self.isLoggedin = true;
            if (callback) self.displayLeaderboard(null, callback);
        },
      function (error) { 
            console.log("Leaderboard:init:failed: ", error);
            self.isLoggedin = false;
            if (callback) self.displayLeaderboard(null, callback);
        }
    );
};

AileaderboardHandler.prototype.submitScore = function (testSettings, score) {

    if (testSettings.isEditor) {
        if (testSettings.isSuccessful)
            console.log("Leaderboard:Score Updated: ", score);
        else
            console.log('Leaderboard:Score update failed');
    }

    console.log("Leaderboard:Log in status: ", this.isLoggedin);

    if (!this.isLoggedin) {
        console.log('Leaderboard:Score update failed, not logged in: ', this.isLoggedin);
        return;
    }

    leaderboard.setScore(
        this.globalID, // Leaderboard id
        score, // score to be submitted to that leaderboard
        () => { console.log("Leaderboard:Score Updated: ", score); }, //successCallback
        () => { console.log('Leaderboard:Score update failed') } // errorCallback
    );

};

AileaderboardHandler.prototype.displayLeaderboard = function (testSettings, callback) {

    if (testSettings.isEditor) {
        if (testSettings.isSuccessful) {
            CustomCoroutine.Instance.set(() => { if (callback) callback(true); }, 2);
            console.log('Leaderboard:Successfully showed')
        }
        else {
            CustomCoroutine.Instance.set(() => { if (callback) callback(false); }, 2);
            console.log('Leaderboard:Failed to show')
        }
    }
    console.log("Leaderboard:Log in status: ", this.isLoggedin);
    if (!this.isLoggedin) {
        if (callback) callback(false);
        return;
    }

    leaderboard.showLeaderboard(
        this.globalID, // Leaderboard id
        function() {
            // On success
            if (callback) callback(true);
            console.log('Leaderboard:Successfully showed')
        },
        function() {
            // On error
            if (callback) callback(false);
            console.log('Leaderboard:Failed to show')
        });
};


// swap method called for script hot-reloading
// inherit your script state here
// AileaderboardHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// aspectRatioFitter.js
var AspectRatioFitter = pc.createScript('aspectRatioFitter');

AspectRatioFitter.attributes.add('resizeOn', {
    type: 'number', title: 'Resize On', default: 0,
    enum: [
        { 'Initialize': 0 },
        { 'Post Intialize': 1 },
        { 'Enable': 2 },
        { 'Update': 3 },
        { 'Post Update': 4 },
        { 'None': 5 },
    ],
});

AspectRatioFitter.attributes.add('aspectMode', {
    type: 'number', title: 'Aspect Mode', default: 0,
    enum: [
        { 'Width Controls Height': 0 },
        { 'Height Controls Width': 1 },
        { 'Cover': 2 },
        { 'Envelope': 3 },
        { 'Match Height Only': 4 },
        { 'Match Width Only': 5 },
    ]
});

AspectRatioFitter.attributes.add('event', {
    title: 'Event Settings',
    type: 'json',
    schema: [
        {
            name: 'scope', type: 'string', title: 'Scope', default: 'app',
            enum: [{ 'App': 'app' }, { 'Entity': 'entity' }]
        },
        { name: 'name', type: 'string', title: 'Name' },
    ],
});

AspectRatioFitter.attributes.add('orignal', {
    title: 'Orignal Image Settings',
    type: 'json',
    schema: [
        { name: 'size', type: 'vec2', title: 'Size' },
        { name: 'img', type: 'entity', title: 'Entity' },

    ],
    description: 'If Image is given, size will not be used'
});

AspectRatioFitter.attributes.add('reference', {
    title: 'Reference Image Settings',
    type: 'json',
    schema: [
        { name: 'size', type: 'vec2', title: 'Size' },
        { name: 'padding', type: 'vec2', title: 'Padding', description: 'x: Width | y: Height' },
        { name: 'max', type: 'vec2', title: 'Max Size', description: 'x: Width | y: Height' },
        { name: 'img', type: 'entity', title: 'Entity' },

    ],
    description: 'If Image is given, size will not be used'
});

// initialize code called once per entity
AspectRatioFitter.prototype.initialize = function () {
    if (this.event.name.length > 0)
        this[this.event.scope].on(this.event.name, this.implement, this);

    this.initSizes();
    this.on('enable', this.onEnable, this);

    if (this.resizeOn === 0) this.implement();
};

AspectRatioFitter.prototype.postInitialize = function () {
    if (this.resizeOn === 1) this.implement();
    this.onEnable();
};

AspectRatioFitter.prototype.onEnable = function () {
    if (this.resizeOn === 2) this.implement();
};

// update code called every frame
AspectRatioFitter.prototype.update = function (dt) {
    if (this.resizeOn === 3) {
        console.log('update: ', this.aspectMode);
        this.updateReferenceSize();
        this.implement();
    }
};

AspectRatioFitter.prototype.postUpdate = function (dt) {
    if (this.resizeOn === 4) {
        this.updateReferenceSize();
        this.implement();
    }
};

AspectRatioFitter.prototype.initSizes = function () {
    this.oSize = {
        width: this.orignal.img ? this.orignal.img.element.width : this.orignal.size.x,
        height: this.orignal.img ? this.orignal.img.element.height : this.orignal.size.y,
    };
    this.rSize = {
        width: (this.reference.img ? this.reference.img.element.width : this.reference.size.x) + this.reference.padding.x,
        height: (this.reference.img ? this.reference.img.element.height : this.reference.size.y) + this.reference.padding.x,
    };
}

AspectRatioFitter.prototype.implement = function () {
    if (!this.entity.element) {
        console.error('Please Attach element for AspectRatioFitter to work');
        return;
    }

    switch (this.aspectMode) {
        case 0: // Width Controls Height
            return this.matchWidth(this.oSize.width, this.oSize.height);
        case 1: // Height Controls Width
            return this.matchHeight(this.oSize.width, this.oSize.height);
        case 2: // Cover
            return this.updateSize(this.rSize.width, this.rSize.height);
        case 3: // Envelope
            return this.envelope();
        case 4: // Match Height Only
            return this.matchHeightOnly();
        case 5: // Match Width Only
            return this.matchWidthOnly();
    }
};

AspectRatioFitter.prototype.updateReferenceSize = function () {
    this.rSize.width = (this.reference.img ? this.reference.img.element.width : this.reference.size.x) + this.reference.padding.x;
    this.rSize.width = Math.min(this.rSize.width, this.reference.max.x);
    
    this.rSize.height = (this.reference.img ? this.reference.img.element.height : this.reference.size.y) + this.reference.padding.x;
    this.rSize.height = Math.min(this.rSize.height, this.reference.max.y);
};

AspectRatioFitter.prototype.updateSize = function (width, height) {
    this.entity.element.height = height;
    this.entity.element.width = width;
    console.log('updateSize: ', this.entity.element.height, ' x ', this.entity.element.width)

};

AspectRatioFitter.prototype.matchWidth = function (width, height) {
    let ratio = height / width;
    this.updateSize(this.rSize.width, this.rSize.width * ratio);
};

AspectRatioFitter.prototype.matchHeight = function (width, height) {
    let ratio = width / height;
    this.updateSize(this.rSize.height * ratio, this.rSize.height);
};

AspectRatioFitter.prototype.envelope = function () {
    let w = this.oSize.width;
    let h = this.oSize.height;

    if (w < this.rSize.width)
        this.matchWidth(w, h);

    w = this.entity.element.width;
    h = this.entity.element.height;

    if (h < this.rSize.height)
        this.matchHeight(w, h);
};

AspectRatioFitter.prototype.matchWidthOnly = function () {
    this.updateSize(this.rSize.width, this.oSize.height);
};

AspectRatioFitter.prototype.matchHeightOnly = function () {
    console.log('matchHeightOnly: ', this.oSize.width, this.rSize.height)
    this.updateSize(this.oSize.width, this.rSize.height);
};

// swap method called for script hot-reloading
// inherit your script state here
// AspectRatioFitter.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// AIGameAnalyticsHandler.js
var AigameAnalyticsHandler = pc.createScript('aigameAnalyticsHandler');

AigameAnalyticsHandler.attributes.add('disable', { type: 'boolean', title: 'Disable' });

AigameAnalyticsHandler.attributes.add('keys', {
    title: 'Keys',
    type: 'json',
    schema: [
        { name: 'game', type: 'string', title: 'Game' },
        { name: 'secret', type: 'string', title: 'Secret' },
    ],
    array: true,
    description: 'It is important to keep sequence same as Current Platform variable.'
});

// initialize code called once per entity
AigameAnalyticsHandler.prototype.initialize = function () {
    if (this.disable) return;
    this.currentPlatform = pc.platform.android ? 0 : 1;
    console.log('Is Android: ', pc.platform.android);
    console.log('Is iOS: ', pc.platform.ios);
    
    this.entity.on('Initialize', this.initGA, this);
};

// update code called every frame
AigameAnalyticsHandler.prototype.update = function (dt) {

};


AigameAnalyticsHandler.prototype.initGA = function () {
    if (document.readyState === 'complete')
        this.onDeviceReady();
    else
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
};

AigameAnalyticsHandler.prototype.onDeviceReady = function (callback) {
    console.log('AigameAnalyticsHandler:onDeviceReady');
    this.isDeviceReady = true;
    GameAnalytics.setEnabledInfoLog(true);
    GameAnalytics.setEnabledVerboseLog(true);
    GameAnalytics.configureBuild("0.0.1");

    let keys = this.keys[this.currentPlatform];
    GameAnalytics.initialize({
        gameKey: keys.game,
        secretKey: keys.secret
    });
};

// swap method called for script hot-reloading
// inherit your script state here
// AigameAnalyticsHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// mobile-safe-area.js
var MobileSafeArea = pc.createScript('mobileSafeArea');
MobileSafeArea.attributes.add('debugConfig', {
    type: 'json',
    name: 'Debug Config',
    description: 'Force safe areas to be applied to the UI. Useful testing layouts without a device.',
    schema: [
        { name: 'enabled', type: 'boolean', default: false },
        { name: 'top', type: 'number', default: 0 },
        { name: 'bottom', type: 'number', default: 0 },
        { name: 'left', type: 'number', default: 0 },
        { name: 'right', type: 'number', default: 0 }
    ]
});


// Add the CSS needed to get the safe area values
// https://benfrain.com/how-to-get-the-value-of-phone-notches-environment-variables-env-in-javascript-from-css/
(function () {
    if (window.document) {
        document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)');
        document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
        document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)');
        document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)');
    }
})();

// initialize code called once per entity
MobileSafeArea.prototype.initialize = function () {
    this.app.graphicsDevice.on('resizecanvas', this._onCanvasResize, this);

    this.on('attr:debugConfig', function (value, prev) {
        this._safeAreaUpdate();
    }, this);

    this.on('destroy', function () {
        this.app.graphicsDevice.off('resizecanvas', this._onCanvasResize, this);
    }, this);

    this._onCanvasResize();
};


MobileSafeArea.prototype._onCanvasResize = function () {
    // Reset the margins to get the element size
    this.entity.element.margin = pc.Vec4.ZERO;
    this._initialHeight = this.entity.element.height;
    this._initialWidth = this.entity.element.width;

    this._safeAreaUpdate();
};


MobileSafeArea.prototype._safeAreaUpdate = function () {
    var topPixels = 0;
    var bottomPixels = 0;
    var leftPixels = 0;
    var rightPixels = 0;

    if (this.debugConfig.enabled) {
        topPixels = this.debugConfig.top;
        bottomPixels = this.debugConfig.bottom;
        leftPixels = this.debugConfig.left;
        rightPixels = this.debugConfig.right;
    } else {
        // Getting the safe areas from CSS
        // https://benfrain.com/how-to-get-the-value-of-phone-notches-environment-variables-env-in-javascript-from-css/
        topPixels = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sat"));
        bottomPixels = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sab"));
        leftPixels = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sal"));
        rightPixels = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sar"));
    }

    var screenResHeight = window.innerHeight;
    var screenResWidth = window.innerWidth;

    // Get the % height/width to the screen height/width
    var topPercentage = topPixels / screenResHeight;
    var bottomPercentage = bottomPixels / screenResHeight;
    var leftPercentage = leftPixels / screenResWidth;
    var rightPercentage = rightPixels / screenResWidth;

    var topMargin = this._initialHeight * topPercentage;
    var bottomMargin = this._initialHeight * bottomPercentage;
    var leftMargin = this._initialWidth * leftPercentage;
    var rightMargin = this._initialWidth * rightPercentage;

    var margin = this.entity.element.margin;
    margin.x = leftMargin;
    margin.y = bottomMargin;
    margin.z = rightMargin;
    margin.w = topMargin;

    this.entity.element.margin = margin;
};


// CustomLogger.js
var CustomLogger = pc.createScript('customLogger');

CustomLogger.attributes.add('overrideLogs', { type: 'boolean', title: 'Override Logs' });
CustomLogger.attributes.add('outputField', { type: 'entity', title: 'Output Field' });
CustomLogger.attributes.add('container', { type: 'entity', title: 'Container' });

CustomLogger.attributes.add('timeSettings', {
    title: 'Time Settings',
    type: 'json',
    schema: [
        { name: 'hour', type: 'boolean', title: 'Show Hours' },
        { name: 'min', type: 'boolean', title: 'Show Minutes', default: true },
        { name: 'sec', type: 'boolean', title: 'Show Seconds', default: true },
        { name: 'miliSec', type: 'boolean', title: 'Show Mili Seconds', default: true },
    ],
});

CustomLogger.attributes.add('logEvent', {
    title: 'Log Event Settings',
    type: 'json',
    schema: [
        {
            name: 'scope', type: 'string', title: 'Scope', default: 'app',
            enum: [{ 'App': 'app' }, { 'Entity': 'entity' }]
        },
        { name: 'name', type: 'string', title: 'Name', default: 'CustomLogger:Log' },
    ],
});

CustomLogger.attributes.add('logSettings', {
    title: 'Log Settings',
    type: 'json',
    schema: [
        { name: 'type', type: 'string', title: 'Type' },
        { name: 'clr', type: 'rgba', title: 'Color' },

    ],
    array: true
});
// initialize code called once per entity
CustomLogger.prototype.initialize = function () {

    this.entity.on('OnClickCloseBtn', this.show.bind(this, false));
    this.entity.on('OnClickOpenBtn', this.show.bind(this, true));
    this.entity.on('OnClickClearBtn', this.clearLogs, this);

    this.htmlLogger = new HtmlLogger();
    if (this.overrideLogs)
        new LogOverrider(this);

    if (this.logEvent.name.length > 0)
        this[this.logEvent.scope].on(this.logEvent.name, this.printLog, this);

    this.logsCount = 0;
};

CustomLogger.prototype.postInitialize = function () {

    // let text = "a new test"
    // for (let i = 0; i < 50; i++) {
    //     console.log("asdsa: ", i);
    // }


    // CustomCoroutine.Instance.set(() => {
    //     // this.printLog('Log', "This is a log");
    //     console.log('This is a log')
    // }, 5);

    // CustomCoroutine.Instance.set(() => {
    //     // this.printLog('Log', "This is a log a very very very very very very very very very very long long long long long long log");
    //     console.log("This is a log a very very very very very very very very very very long long long long long long log");
    // }, 6);

    // CustomCoroutine.Instance.set(() => {
    //     // this.printLog('Warn', "This is a warn");
    //     console.warn('Warn', "This is a warn");
    // }, 7);

    // CustomCoroutine.Instance.set(() => {
    //     // this.printLog('Error', "This is a error");
    //     for(let i = 0; i < 50; i++) console.error('Error', "This is a error" + i);
    // }, 8);

};

CustomLogger.prototype.show = function (show) {
    if (show === "true") show = true;
    if (show === "false") show = false;
    this.container.enabled = show;
};

CustomLogger.prototype.printLog = function (type, text) {
    let color = pc.Color.WHITE;
    for (let i = 0; i < this.logSettings.length; i++) {
        if (type == this.logSettings[i].type) {
            color = this.logSettings[i].clr.toString();
            break;
        }
    }
    let endLine = this.logsCount++ === 0 ? "" : "\n";
    let time = this.getCurrentTime();
    if (typeof text !== 'string')
        text = text.toString();

    let msg = `${endLine}(${time}): [color="${color}"]${text}[/color]`;
    // this.outputField.element.text += msg;
    if (this.htmlLogger)
        this.htmlLogger.addText(color, time, text);
    // console.log(endLine, time, msg)
};

CustomLogger.prototype.clearLogs = function () {
    this.logsCount = 0;
    this.outputField.element.text = "";
};

CustomLogger.prototype.getCurrentTime = function () {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    const formattedMilliseconds = String(milliseconds).padStart(3, '0');

    let formattedTime = "";

    if (this.timeSettings.hours) formattedTime += `${formattedHours}:`;
    if (this.timeSettings.min) formattedTime += `${formattedMinutes}:`;
    if (this.timeSettings.sec) formattedTime += `${formattedSeconds}:`;
    if (this.timeSettings.miliSec) formattedTime += `${formattedMilliseconds}`;

    return formattedTime;
};

// swap method called for script hot-reloading
// inherit your script state here
// CustomLogger.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// LogOverrider.js
class LogOverrider {
    constructor(logger) {
        // Override the console.log, console.warn, and console.error functions
        console.log = function () {
            logger.printLog("Log", Array.from(arguments).join(', '));
            // Call the original console.log function
            // Function.prototype.apply.call(console.log, console, arguments);
        };

        console.warn = function () {
            logger.printLog("Warn", Array.from(arguments).join(', '));
            // Call the original console.warn function
            // Function.prototype.apply.call(console.warn, console, arguments);
        };

        console.error = function () {
            logger.printLog("Error", Array.from(arguments).join(', '));
            // Call the original console.error function
            // Function.prototype.apply.call(console.error, console, arguments);
        };
    }
}

// swap method called for script hot-reloading
// inherit your script state here
// LogOverrider.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// HtmlLogger.js
class HtmlLogger {
    constructor() {
        this.overlay = document.createElement('div');

        // set the CSS properties of the element
        this.overlay.style.backgroundColor = 'rgba(0,0,0,0.5)'; // set the background color to black
        // overlay.style.opacity = '0.5'; // set the opacity to 0.5
        this.overlay.style.position = 'fixed'; // make the element fixed
        this.overlay.style.top = '0'; // position the element at the top
        this.overlay.style.left = '0'; // position the element at the left
        this.overlay.style.width = '100%'; // set the width to 100%
        this.overlay.style.height = '100%'; // set the height to 100%
        this.overlay.style.zIndex = '9999'; // make sure the element is on top of everything else
        this.overlay.style.overflowY = 'auto';
        this.overlay.style.overflowX = 'hidden';
        this.overlay.style.display = "none"

        // append the element to the document body
        document.body.appendChild(this.overlay);
        this.logs = document.createElement('div');
        this.logs.style.position = 'fixed'; // make the element fixed
        this.logs.style.top = '5%'; // position the element at the top
        this.logs.style.left = '0'; // position the element at the left
        this.logs.style.width = '100%'; // set the width to 100%
        this.logs.style.height = '100%'; // set the height to 100%
        this.logs.style.zIndex = '9999'; // make sure the element is on top of everything else
        this.logs.style.overflowY = 'auto';
        this.logs.style.overflowX = 'hidden';
        this.overlay.appendChild(this.logs)

        this.addScroll();
        this.createOpenButton();
        this.createCloseButton();
        this.createClearButton();
        // this.createDropdown();
    }

    show(show) {
        this.overlay.style.display = show ? "block" : "none";
    }

    addText(color, time, msg) {

        let timeSpan = document.createElement('span');
        timeSpan.style.color = "cyan";
        timeSpan.innerHTML = `(${time}): `;

        let span = document.createElement('span');
        span.style.color = color;
        span.innerHTML = msg;

        let br = document.createElement('br');

        this.logs.appendChild(timeSpan);
        this.logs.appendChild(span);
        this.logs.appendChild(br);
    }

    addScroll() {
        var mouseX = 0;
        var mouseY = 0;
        var scrollX = 0;
        var scrollY = 0;

        // define a flag to indicate whether the mouse is pressed or not
        var isPressed = false;
        let self = this;

        // listen for the mousedown event on the overlay element
        this.overlay.addEventListener('mousedown', function (event) {
            // set the flag to true
            isPressed = true;

            // store the current mouse position
            mouseX = event.clientX;
            mouseY = event.clientY;

            // store the current scroll offset
            scrollX = self.overlay.scrollLeft;
            scrollY = self.overlay.scrollTop;

            // prevent the default scrolling behavior
            event.preventDefault();
        });

        // listen for the mousemove event on the overlay element
        this.overlay.addEventListener('mousemove', function (event) {
            // check if the mouse is pressed
            if (isPressed) {
                // calculate the difference between the current and the previous mouse position
                var deltaX = event.clientX - mouseX;
                var deltaY = event.clientY - mouseY;

                // adjust the scroll offset by the difference
                self.overlay.scrollLeft = scrollX - deltaX;
                self.overlay.scrollTop = scrollY - deltaY;

                // prevent the default scrolling behavior
                event.preventDefault();
            }
        });

        // listen for the mouseup event on the overlay element
        this.overlay.addEventListener('mouseup', function (event) {
            // set the flag to false
            isPressed = false;

            // prevent the default scrolling behavior
            event.preventDefault();
        });
    };

    createOpenButton() {
        var button = document.createElement('input');

        button.style.position = 'fixed'; // make the element fixed
        button.style.top = '100px'; // position the element at the top
        button.style.right = '10px'; // position the element at the left
        button.style.width = '80px'; // set the width to 100%
        button.style.height = '40';
        // set the attributes of the element
        button.setAttribute('type', 'button'); // set the type to button
        button.setAttribute('value', 'Click Me'); // set the value to Click Me
        button.setAttribute('id', 'myButton'); // set the id to myButton

        // add a click event listener to the element
        button.addEventListener('click', () => this.show(true));

        button.value = 'Open Logs';

        // append the element to the document body
        document.body.appendChild(button);
    }

    createCloseButton() {
        var button = document.createElement('input');

        button.style.position = 'absolute'; // make the element fixed
        button.style.top = '100px'; // position the element at the top
        button.style.right = '10px'; // position the element at the left
        button.style.width = '80px'; // set the width to 100%
        button.style.height = '40';
        button.style.zIndex = "999999";
        // set the attributes of the element
        button.setAttribute('type', 'button'); // set the type to button
        button.setAttribute('value', 'Click Me'); // set the value to Click Me
        button.setAttribute('id', 'myButton'); // set the id to myButton

        // add a click event listener to the element
        button.addEventListener('click', () => this.show(false));

        button.value = 'Close Logs';

        // append the element to the document body
        this.overlay.appendChild(button);
    }

    createClearButton() {
        var button = document.createElement('input');

        button.style.position = 'absolute'; // make the element fixed
        button.style.top = '100px'; // position the element at the top
        button.style.right = '90px'; // position the element at the left
        button.style.width = '80px'; // set the width to 100%
        button.style.height = '40';
        button.style.zIndex = "999999";
        // set the attributes of the element
        button.setAttribute('type', 'button'); // set the type to button
        button.setAttribute('value', 'Click Me'); // set the value to Click Me
        button.setAttribute('id', 'myButton'); // set the id to myButton

        // add a click event listener to the element
        button.addEventListener('click', () => this.logs.innerHTML = "");

        button.value = 'Clear Logs';

        // append the element to the document body
        this.overlay.appendChild(button);
    }

    createDropdown() {
        // create a HTML element that will trigger the dropdown
        var dropdownTrigger = document.createElement('input');
        dropdownTrigger.setAttribute('type', 'button');
        dropdownTrigger.setAttribute('value', 'Select an option');
        dropdownTrigger.setAttribute('id', 'dropdownTrigger');

        // create a HTML element that will contain the dropdown options
        var dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'dropdown-content';

        // create HTML elements for each dropdown option
        var errorsOption = document.createElement('a');
        errorsOption.innerHTML = 'Errors';
        var warnsOption = document.createElement('a');
        warnsOption.innerHTML = 'Warns';
        var logsOption = document.createElement('a');
        logsOption.innerHTML = 'Logs';
        var allOption = document.createElement('a');
        allOption.innerHTML = 'All';

        // append the dropdown options to the dropdown container
        dropdownContainer.appendChild(errorsOption);
        dropdownContainer.appendChild(warnsOption);
        dropdownContainer.appendChild(logsOption);
        dropdownContainer.appendChild(allOption);

        // append the dropdown container to the document body
        document.body.appendChild(dropdownContainer);

        // hide the dropdown container by default
        dropdownContainer.style.display = 'none';

        // add a click event listener to the dropdown trigger
        dropdownTrigger.addEventListener('click', function () {
            // toggle the display of the dropdown container
            if (dropdownContainer.style.display === 'none') {
                // if the display value is none, set it to block
                dropdownContainer.style.display = 'block';
            } else {
                // if the display value is not none, set it to none
                dropdownContainer.style.display = 'none';
            }
        });

        this.overlay.appendChild(dropdownTrigger);
    }
}

// swap method called for script hot-reloading
// inherit your script state here
// HtmlLogger.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// IdfaPermissionHandler.js
var IdfaPermissionHandler = pc.createScript('idfaPermissionHandler');

// initialize code called once per entity
IdfaPermissionHandler.prototype.initialize = function () {
    this.entity.on('RequestPermission', this.requestPermission, this);
};

// update code called every frame
IdfaPermissionHandler.prototype.requestPermission = function (testSettings, callback) {

    console.log('IdfaPermissionHandler:RequestPermission')
    if (testSettings.isEditor) {
        if (callback) callback(testSettings.isSuccessful);
        console.log("IdfaPermissionHandler:requestPermission:TestingMode")
        return;
    };

    const idfaPlugin = cordova.plugins.idfa;
    idfaPlugin.requestPermission().then(result => {
        if (callback)
            callback(result === idfaPlugin.TRACKING_PERMISSION_AUTHORIZED);
    });
};
// swap method called for script hot-reloading
// inherit your script state here
// IdfaPermissionHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// PopupView.js
var PopupView = pc.createScript('popupView');

PopupView.attributes.add('root', { type: 'entity', title: 'Root' });
PopupView.attributes.add('fadeBG', { type: 'entity', title: 'Fade Background' });
PopupView.attributes.add('title', { type: 'entity', title: 'Title' });
PopupView.attributes.add('desc', { type: 'entity', title: 'Description' });

// initialize code called once per entity
PopupView.prototype.initialize = function () {
    console.log('PopupView:initialize');
    this.app.on('PopupView:Show', this.show, this)
    this.app.on('PopupView:OnClick', this.onClickBtn, this);
};

// update code called every frame
PopupView.prototype.show = function (show, title, desc, onClickOkBtn, animate) {
    console.log('PopupView:show: ', show, title, desc, onClickOkBtn, animate);
    this.enableRoot(show);
    this.enableBG(show);

    if (title) this.title.element.text = title;
    if (desc) this.desc.element.text = desc;
    this.okBtnCallBack = onClickOkBtn;
};

PopupView.prototype.onClickBtn = function (name) {
    switch (name) {
        case "OK":
            this.onClickOkBtn();
            break;
    }
};

PopupView.prototype.onClickOkBtn = function () {
    if (this.okBtnCallBack) this.okBtnCallBack();
};

PopupView.prototype.enableRoot = function (enable) {
    if (enable)
        this.root.enabled = enable;
    else {
        this.root.fire('disable', () => this.root.enabled = false);
    }
};

PopupView.prototype.enableBG = function (enable) {
    if (enable)
        this.fadeBG.enabled = enable;
    else {
        this.fadeBG.fire('disable', () => this.fadeBG.enabled = false);
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// PopupView.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// FirebaseManager.js
var FirebaseManager = pc.createScript('firebaseManager');

// initialize code called once per entity
FirebaseManager.prototype.initialize = function () {
    this.entity.on('RequestPermission', this.requestPermission, this);
};

// update code called every frame
FirebaseManager.prototype.update = function (dt) {

};

FirebaseManager.prototype.requestPermission = function (isAllowed, testSettings) {
    if (testSettings.isEditor) {
        console.log('Firebase:Editor Mode:Enable ', isAllowed);
        return;
    }
    this.enableAnalytics(isAllowed);
    this.enableCrashlytics(isAllowed);
    this.enablePerformanceCollection(isAllowed);
};

FirebaseManager.prototype.enableAnalytics = function (enable) {
    FirebasePlugin.setAnalyticsCollectionEnabled(enable);
    console.log('Firebase:Analytics enabled: ', enable);
};

FirebaseManager.prototype.enableCrashlytics = function (enable) {

    FirebasePlugin.setCrashlyticsCollectionEnabled(enable, function () {
        console.log("FireBase:Crashlytics data collection is enabled");
    }, function (error) {
        console.error("FireBase:Crashlytics data collection couldn't be enabled: " + error);
    });
}

FirebaseManager.prototype.enablePerformanceCollection = function (enable) {
    FirebasePlugin.setPerformanceCollectionEnabled(enable);
    console.log('Firebase:Performance Collection enabled: ', enable);

};

// swap method called for script hot-reloading
// inherit your script state here
// FirebaseManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

