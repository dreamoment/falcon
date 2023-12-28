import {EventType} from './types'


const eventTypes: EventType[] = [
    EventType.click,
    EventType.dblclick,
    EventType.contextmenu,
    EventType.wheel,
    EventType.mousemove,
    EventType.mousedown,
    EventType.mouseup,
    EventType.mouseenter,
    EventType.mouseleave,
    EventType.touchmove,
    EventType.touchstart,
    EventType.touchend,
    EventType.touchcancel,
]

// no need to listen
const eventTypesCustom: EventType[] = [
    EventType.mouseenter,
    EventType.mouseleave,
]


export {
    eventTypes,
    eventTypesCustom,
}