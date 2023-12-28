import AbortController from './AbortController'

enum EventType {
    click = 'click',
    dblclick = 'dblclick',
    contextmenu = 'contextmenu',
    wheel = 'wheel',
    mousemove = 'mousemove',
    mousedown = 'mousedown',
    mouseup = 'mouseup',
    mouseenter = 'mouseenter',
    mouseleave = 'mouseleave',
    touchstart = 'touchstart',
    touchmove = 'touchmove',
    touchend = 'touchend',
    touchcancel = 'touchcancel',
}

type Handler<T> = (event: T) => void

interface Map<T> {
    [key: string]: T
}

interface FalconUserData {
    enabled: Map<boolean>
    deep: Map<boolean>
}

interface InterceptorEvent {
    type: string
    event: Event | undefined
    object3D: THREE.Object3D
    abortController: AbortController
}

interface HandlerMouseEvent {
    type: string
    handler: () => void
}


export {
    EventType,
    type Handler,
    type Map,
    type FalconUserData,
    type InterceptorEvent,
    type HandlerMouseEvent,
}