const class_event_emitter = require("events").EventEmitter;

const STATE = {
    ERROR: 0,
    READY: 3,
    STOP_BOT: -1,
    START: null
};

const EVENTS = {
    CHANGE_STATUS: "change_status"
};

class manager_state extends class_event_emitter {
    constructor (params) {
        super(params);
        this._status = STATE.START;
        this.registerHandler();
    }

    registerHandler () {
        this.on(EVENTS.CHANGE_STATUS, (status) => {
            this._status = status;
        });
    }

    getStatus () {
        return this._status;
    }

    isError () {
        return this._status === STATE.ERROR;
    }

    isReady () {
        return this._status === STATE.READY;
    }

    isStopBot () {
        return this._status === STATE.STOP_BOT;
    }

    isStart () {
        return this._status === STATE.START;
    }

}

module.exports = {
    STATE: STATE,
    EVENTS: EVENTS,
    manager_state: manager_state
};