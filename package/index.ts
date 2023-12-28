import * as THREE from 'three'
import { EventType, FalconUserData, Handler, InterceptorEvent, Map, HandlerMouseEvent } from './types'
import { eventTypes, eventTypesCustom } from './eventTypes'
import AbortController from './AbortController'
import './EventDispatcher'


const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(1, 1)

const getFalconParent = (object3D: THREE.Object3D) => {
    return (!object3D.userData.falconParent || object3D.userData.falconParent === 'self') ? object3D : object3D.userData.falconParent
}

const getTypeEnabled = (type: EventType, object3D: THREE.Object3D) => {
    return object3D.falcon && (object3D.userData.falcon && object3D.userData.falcon.enabled[type])
}

const getDeepEnabled = (type: EventType, object3D: THREE.Object3D) => {
    return object3D.falcon && (object3D.userData.falcon && object3D.userData.falcon.deep[type])
}

class Falcon {

    camera: THREE.Camera
    dom: HTMLElement
    targets: THREE.Object3D[] = []
    intersections: THREE.Object3D[] = []
    handlerInterceptor: Map<Handler<InterceptorEvent>> = {}
    targetEnter: THREE.Object3D | null = null
    targetLeave: THREE.Object3D | null = null
    handlersMouseEvent: HandlerMouseEvent[] = []

    constructor(camera: THREE.Camera, dom: HTMLElement) {
        const onMouseMove = this._onMouseMove.bind(this)
        this.handlersMouseEvent.push({ type: 'mousemove', handler: onMouseMove })
        this.camera = camera
        this.dom = dom
        this.dom.addEventListener('mousemove', onMouseMove)
        this._init()
    }

    _init() {
        eventTypes.forEach(type => {
            if (!eventTypesCustom.includes(type)) {
                const handler = this._dispatch.bind(this)
                this.handlersMouseEvent.push({ type, handler: handler })
                this.dom.addEventListener(type, handler)
            }
        })
    }

    _onMouseMove() {
        if (event instanceof MouseEvent) {
            event.preventDefault()
            const rect = this.dom.getBoundingClientRect()
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1
        }
    }

    _launch = (target: THREE.Object3D | null, type: EventType, event?: Event) => {
        const func = (type: EventType, target: THREE.Object3D) => {
            const enabled = getTypeEnabled(type, target)
            if (enabled) {
                const payload = {
                    type,
                    event,
                    object3D: target,
                    abortController: new AbortController(),
                }
                if (event instanceof MouseEvent) {
                    this.handlerInterceptor[type] && this.handlerInterceptor[type](payload)
                }
                if (payload.abortController.able) {
                    // @ts-ignore
                    target.dispatchEvent({ type, event, object3D: target })
                }
            }
        }

        if (type === EventType.mousemove) {

            if (target) {

                // mousemove
                func(EventType.mousemove, target)

                // mouseenter
                if (target !== this.targetEnter) {
                    func(EventType.mouseenter, target)
                    this.targetEnter = target
                }
            }

            // mouseleave
            if (target !== this.targetLeave) {
                if (this.targetLeave) {
                    func(EventType.mouseleave, this.targetLeave)
                    if (target) {
                        const enabled = getTypeEnabled(EventType.mouseleave, target)
                        target = enabled ? target : null
                    }
                    this.targetEnter = target
                }
            }

            this.targetLeave = target
        }
        else {
            if (target) {
                func(type, target)
            }
        }
    }

    _dispatch() {
        if (event instanceof MouseEvent) {
            const type = event.type
            const func = (type: EventType) => {
                if (this.intersections.length > 0) {
                    let object = this.intersections[0]
                    for (let i = 0; i < this.intersections.length; i++) {
                        const _object = this.intersections[i]
                        const deep = getDeepEnabled(type, _object)
                        if (deep) {
                            object = _object
                            break
                        }
                    }
                    this._launch(object, type, event)
                }
                else {
                    this._launch(null, type, event)
                }
            }

            func(type as EventType)
        }
    }

    _enableTarget(object3D: THREE.Object3D, type?: EventType) {
        const func = (type: EventType) => {
            object3D.userData.falcon.enabled[type] = true
        }
        if (type) {
            func(type)
        }
        else {
            for (const type of eventTypes) {
                func(type as EventType)
            }
        }
    }

    _disableTarget(object3D: THREE.Object3D, type?: EventType) {
        const func = (type: EventType) => {
            object3D.userData.falcon.enabled[type] = false
        }
        if (type) {
            func(type)
        }
        else {
            for (const type of eventTypes) {
                func(type as EventType)
            }
        }
    }

    _enableDeepTarget(object3D: THREE.Object3D, type?: EventType) {
        const func = (type: EventType) => {
            object3D.userData.falcon.deep[type] = true
        }
        if (type) {
            func(type)
        }
        else {
            for (const type of eventTypes) {
                func(type as EventType)
            }
        }
    }

    _disableDeepTarget(object3D: THREE.Object3D, type?: EventType) {
        const func = (type: EventType) => {
            object3D.userData.falcon.deep[type] = false
        }
        if (type) {
            func(type)
        }
        else {
            for (const type of eventTypes) {
                func(type as EventType)
            }
        }
    }

    update() {
        raycaster.setFromCamera(mouse, this.camera)
        let objects: THREE.Object3D[] = []
        const intersections = raycaster.intersectObjects(this.targets, true)
        intersections.forEach(intersection => {
            const falconParent = getFalconParent(intersection.object)
            objects.push(falconParent)
        })
        objects = Array.from(new Set(objects))
        this.intersections = objects
    }

    setCamera(camera: THREE.Camera) {
        this.camera = camera
    }

    setDom(dom: HTMLElement) {
        this.dom = dom
    }

    dispose() {
        this.remove(this.targets)
        this.handlersMouseEvent.forEach(item => {
            this.dom.removeEventListener(item.type, item.handler)
        })
    }

    add(target: THREE.Object3D | THREE.Object3D[]) {
        const func = (target: THREE.Object3D) => {
            let index = this.targets.indexOf(target)
            if (index === -1) {
                this.targets.push(target)

                target.falcon = this

                const falconUserData: FalconUserData = {
                    enabled: {},
                    deep: {},
                }
                eventTypes.forEach(_type => {
                    falconUserData.enabled[_type] = false
                    falconUserData.deep[_type] = false
                })
                target.userData.falcon = falconUserData

                target.traverse((e: THREE.Object3D) => {
                    if (e instanceof THREE.Mesh) {
                        e.userData.falconParent = (e === target) ? 'self' : target
                    }
                })
            }
        }

        if (target instanceof THREE.Object3D) {
            func(target)
        }
        else if (Array.isArray(target)) {
            target.forEach(_target_target => {
                func(_target_target)
            })
        }
    }

    remove(target: THREE.Object3D | THREE.Object3D[]) {
        const func = (target: THREE.Object3D) => {
            let index = this.targets.indexOf(target)
            if (index !== -1) {
                target.off()
                this.targets.splice(index, 1)
                delete target.falcon
                delete target.userData.falcon
                target.traverse((e: THREE.Object3D) => {
                    if (e instanceof THREE.Mesh) {
                        delete target.userData.falconParent
                    }
                })
            }
        }
        if (target instanceof THREE.Object3D) {
            func(target)
        }
        else if (Array.isArray(target)) {
            for (let i = target.length - 1; i >=0; i--) {
                func(target[i])
            }
        }
    }

    intercept(type: EventType, handlerInterceptor: Handler<InterceptorEvent>) {
        this.handlerInterceptor[type] = handlerInterceptor
    }
}


export default Falcon
export {
    EventType,
}