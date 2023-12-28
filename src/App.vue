<script setup lang="ts">
import { onUnmounted } from 'vue'
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

onUnmounted(() => {
  falcon.dispose()
})

renderer.setAnimationLoop(animate)
</script>

<template>
</template>

<style scoped>
</style>
