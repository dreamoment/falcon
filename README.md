<h1 align="center">falcon</h1>

![](/docs/preview.gif)

Language: English | [中文简体](README_zh_cn.md)

## What is falcon ?

`threejs` mouse event listener.

> Event Penetration: Based on a single event, jump over obstacles, directly trigger the target object event.
>
> Only objects that do not register or deactivate corresponding events are allowed to be skipped.

## Features

- lightweight and easy to use

- object-based events

- global event interceptor

- supports event penetration

- support`typescript`

## Install

```
npm i @dreamoment/falcon
```

## Examples

```
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Falcon, { EventType } from '@dreamoment/falcon'


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const ambientLight = new THREE.AmbientLight(0xffffff)
const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(1, 1, 1)
scene.add(ambientLight, directionalLight)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

camera.position.set(0, 3, 3)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material1 = new THREE.MeshStandardMaterial({ color: 0xffffff })
const material2 = new THREE.MeshStandardMaterial({ color: 0xffffff })
const cube1 = new THREE.Mesh(geometry, material1)
const cube2= new THREE.Mesh(geometry, material2)
cube2.position.x += 2
scene.add(cube1, cube2)


const falcon = new Falcon(camera, renderer.domElement)
falcon.intercept(EventType.click, payload => {
  // don't send messages to cube2
  // if (payload.object3D === cube2) {
  //   payload.abortController.abort()
  // }
})
falcon.intercept(EventType.mouseenter, payload => {
  renderer.domElement.style.cursor = 'pointer'
})
falcon.intercept(EventType.mouseleave, payload => {
  renderer.domElement.style.cursor = 'auto'
})

falcon.add(cube1)
falcon.add(cube2)
// or
// falcon.add([cube1, cube2])

cube1
    .on(EventType.mouseenter, event => {
      cube1.material.color = new THREE.Color(0x00ff00)
    })
    .on(EventType.mouseleave, event => {
      cube1.material.color = new THREE.Color(0xffffff)
    })
cube2
    .on(EventType.click, event => {
      cube1.material.color = new THREE.Color(0x0000ff)
    })
    .on(EventType.mouseenter, () => {
      cube2.material.color = new THREE.Color(0xff0000)
    })
    .on(EventType.mouseleave, () => {
      cube2.material.color = new THREE.Color(0xffffff)
    })


const animate = () => {
  controls.update()
  falcon.update()
  renderer.render(scene, camera)
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowResize)

renderer.setAnimationLoop(animate)
```

## Event types

```
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
```

## Falcon API

```
mew Falcon(camera: THREE.Camera, dom: HTMLElement)
```

### update

Update the set of objects touched by the ray. Should always be used in the render loop.

```
update(): void
```

### setCamera

Set the camera.

```
setCamera(camera: THREE.Camera): void
```

### setDom

Sets the interactive element node.

```
setDom(dom: HTMLElement): void
```

### dispose

Destroy the `falcon` instance and cancel the related event listening.

```
dispose(): void
```

### add

Add object interactivity.

```
add(target: THREE.Object3D | THREE.Object3D[]): void
```

### remove

Removes object interactivity and cleans up all event listening for that object.

```
remove(target: THREE.Object3D | THREE.Object3D[]): void
```

### intercept

Global event interceptor.

```
type Handler = (event: MouseEvent) => void
interface InterceptorEvent {
    type: EventType
    event: MouseEvent
    object3D: THREE.Object3D
    abortController: AbortController
}

intercept(type: EventType, handlerInterceptor: Handler<InterceptorEvent>): void
```

## AbortController API

### abort

Intercept event, this event is no longer distributed to the corresponding object.

```
abort(): void
```

## Object3D API

> Only objects added to `falcon` can activate the following methods.

### on

Register object event listening.

```
on(type: EventType, handler: THREE.EventListener): this
```

### off

Remove object event listening based on an object event.

```
off(type: EventType, handler: THREE.EventListener): this
```

Remove object event listening based on an object event type.

```
off(type: EventType): this
```

Remove object event listening based on all events of the object.

```
off(): this
```

### enable

Activate event listener based on an event type of an object.

```
enable(type: EventType): this
```

Activate event listener based on all events of the object.

```
enable(): this
```

### disable

Inactivate event listener based on an event type of object.

```
disable(type: EventType): this
```

Inactivate event listener based on all events of the object.

```
disable(): this
```

### enableDeep

Enables event penetration based on an event type for an object.

```
enableDeep(type: EventType): this
```

Enables event penetration based on all events of the object.

```
enableDeep(): this
```

### disableDeep

Turns off event penetration based on an object event type.

```
disableDeep(type: EventType): this
```

Turns off event penetration based on all events of the object.

```
disableDeep(): this
```