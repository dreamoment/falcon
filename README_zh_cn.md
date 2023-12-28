<h1 align="center">falcon</h1>

![](/docs/preview.gif)

语言: [English](README.md) | 中文简体

## falcon 是什么 ?

`threejs` mouse event listener.

> 事件穿透：基于单一事件，跳过障碍物，直接触发目标物体的事件。
> 
> 只有 未注册或失活 对应事件的物体，才允许被跳过。

## 特性

- 轻量易用

- 基于物体的事件

- 全局事件拦截器

- 支持事件穿透

- 支持`typescript`

## 安装

```
npm i @dreamoment/falcon
```

## 示例

```
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Falcon, { EventType } from '../package/index'


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

## 事件类型

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

更新射线触碰的物体集合。应该始终在渲染循环中被使用。

```
update(): void
```

### setCamera

设置相机。

```
setCamera(camera: THREE.Camera): void
```

### setDom

设置交互元素节点。

```
setDom(dom: HTMLElement): void
```

### dispose

销毁`falcon`实例，并取消相关的事件监听。

```
dispose(): void
```

### add

添加物体交互性。

```
add(target: THREE.Object3D | THREE.Object3D[]): void
```

### remove

移除物体交互性，并清理该物体所有的事件监听。

```
remove(target: THREE.Object3D | THREE.Object3D[]): void
```

### intercept

全局事件拦截器。

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

拦截事件，这次事件不再被分发至对应物体。

```
abort(): void
```

## Object3D API

> 只有被添加至`falcon`的物体，才能激活以下方法。

### on

注册物体事件监听。

```
on(type: EventType, handler: THREE.EventListener): this
```

### off

基于物体某一事件，移除物体事件监听。

```
off(type: EventType, handler: THREE.EventListener): this
```

基于物体某一事件类型，移除物体事件监听。

```
off(type: EventType): this
```

基于物体所有事件，移除物体事件监听。

```
off(): this
```

### enable

基于物体某一事件类型，激活事件监听。

```
enable(type: EventType): this
```

基于物体所有事件，激活事件监听。

```
enable(): this
```

### disable

基于物体某一事件类型，失活事件监听。

```
disable(type: EventType): this
```

基于物体所有事件，失活事件监听。

```
disable(): this
```

### enableDeep

基于物体某一事件类型，开启事件穿透。

```
enableDeep(type: EventType): this
```

基于物体所有事件，关闭事件穿透。

```
enableDeep(): this
```

### disableDeep

基于物体某一事件类型，开启事件穿透。

```
disableDeep(type: EventType): this
```

基于物体所有事件，关闭事件穿透。

```
disableDeep(): this
```