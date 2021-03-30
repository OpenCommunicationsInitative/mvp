import { EventDispatcher } from 'strongly-typed-events';

export class EventBus {
    private _eventHandler = new EventDispatcher<EventBus, string>();
    static eventBus = new EventBus();

    constructor() {
        this._eventHandler = new EventDispatcher<EventBus, string>();
    }

    emit(eventName: string) {
        this._eventHandler.dispatch(this, eventName);
    }

    get eventHandler() {
        return this._eventHandler.asEvent();
    }

    static get Instance() {
        return this.eventBus;
    }
}
