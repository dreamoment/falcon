import * as THREE from 'three'
import Falcon from './index'
import { EventType } from './types'


declare module 'three' {
    interface Object3D {
        falcon?: Falcon
        on<T extends EventType>(type: T, listener: THREE.EventListener<{}, T, this>): this
        off<T extends EventType>(type?: T, listener?: THREE.EventListener<{}, T, this>): this
        enable(type?: EventType): this
        disable(type?: EventType): this
        enableDeep(type?: EventType): this
        disableDeep(type?: EventType): this
    }
}


const getFalcon = (object3D: THREE.Object3D): Falcon | void => {
    if (object3D.falcon) {
        return object3D.falcon
    }
    else {
        const parent = object3D.parent
        if (parent) {
            return getFalcon(parent)
        }
    }
}


THREE.Object3D.prototype.on = function<T extends EventType>(type: T, listener: THREE.EventListener<{}, T, THREE.Object3D>): THREE.Object3D {
    this.userData.falcon.enabled[type] = true
    this.addEventListener(type, listener)
    return this
}

THREE.Object3D.prototype.off = function<T extends EventType>(type?: T, listener?: THREE.EventListener<{}, T, THREE.Object3D>): THREE.Object3D {

    const func = (type: T, listener: THREE.EventListener<{}, T, THREE.Object3D>) => {
        this.removeEventListener(type, listener)
        const listeners = (this as any)._listeners[type]
        if (listeners.length === 0) {
            this.userData.falcon.enabled[type] = false
            delete (this as any)._listeners[type]
        }
    }

    if (type) {
        if (listener) {
            func(type, listener)
        }
        else {
            const listeners = (this as any)._listeners[type]
            for (let i = listeners.length - 1; i >=0; i--) {
                func(type, listeners[i])
            }
        }
    }
    else {
        const listeners = (this as any)._listeners
        for (const type in listeners) {
            const listeners = (this as any)._listeners[type]
            for (let i = listeners.length - 1; i >=0; i--) {
                func(type as T, listeners[i])
            }
        }
        if (Object.keys(listeners).length === 0) {
            delete (this as any)._listeners
        }
    }

    return this
}

THREE.Object3D.prototype.enable = function(type?: EventType): THREE.Object3D {
    const falcon = getFalcon(this)
    if (falcon) {
        falcon._enableTarget(this, type)
    }
    return this
}

THREE.Object3D.prototype.disable = function(type?: EventType): THREE.Object3D {
    const falcon = getFalcon(this)
    if (falcon) {
        falcon._disableTarget(this, type)
    }
    return this
}

THREE.Object3D.prototype.enableDeep = function(type?: EventType): THREE.Object3D {
    const falcon = getFalcon(this)
    if (falcon) {
        falcon._enableDeepTarget(this, type)
    }
    return this
}

THREE.Object3D.prototype.disableDeep = function(type?: EventType): THREE.Object3D {
    const falcon = getFalcon(this)
    if (falcon) {
        falcon._disableDeepTarget(this, type)
    }
    return this
}
