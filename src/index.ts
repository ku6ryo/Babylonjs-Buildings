import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  MeshBuilder,
  Color4,
  Color3,
  PBRMetallicRoughnessMaterial,
  HDRCubeTexture,
  DirectionalLight,
} from "babylonjs"
import "babylonjs-loaders"
import envHdr from "./environment.hdr"


const canvas = document.createElement("canvas")
document.body.appendChild(canvas)
const engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})


const createScene = function(){
  const scene = new Scene(engine)
  const camera = new FreeCamera("camera1", new Vector3(0, 4, 0), scene)
  camera.setTarget(Vector3.Zero())
  camera.attachControl(canvas, false)
  scene.clearColor = new Color4(1, 1, 1, 1)
  return scene
}

const scene = createScene()
const sun = new DirectionalLight("sun1", new Vector3(1, -1, 1), scene)
const sun2 = new DirectionalLight("sun1", new Vector3(-1, -1, -1), scene)

const envTex = new HDRCubeTexture(envHdr, scene, 512)

const plane = MeshBuilder.CreatePlane("plane", { size: 1000 }, scene)
plane.rotation = new Vector3(Math.PI / 2, 0, 0)
plane.receiveShadows = true

const white = new PBRMetallicRoughnessMaterial("white", scene)
white.baseColor = new Color3(1, 1, 1)
white.roughness = 1
white.metallic = 0
white.environmentTexture = envTex

const purple = new PBRMetallicRoughnessMaterial("purple", scene)
purple.emissiveColor = new Color3(0.5, 0, 0.5)

plane.material = white

const numX = 50
const numY = 50
for (let i = 0; i < numX; i++) {
  for (let j = 0; j < numY; j++) {
    const x = i - numX / 2
    const z = j - numY / 2
    const b = MeshBuilder.CreateBox("box", { size: 0.5 }, scene)
    b.position = new Vector3(x, 0, z)
    const sy = 1 + Math.random() * 7
    b.scaling.y = sy
    b.material = white
    const b2 = MeshBuilder.CreateBox("box2", { size: 0.51 }, scene)
    b2.scaling.y = 0.1
    b2.position = new Vector3(x, sy / 4 - 0.2, z)
    b2.material = purple
  }
}

let time = 0

engine.runRenderLoop(function() {
  console.log(engine.getFps().toFixed())
    purple.baseColor = new Color3(1, 0, 1 * Math.abs(Math.sin(time / 100)))
    time += 1
  scene.render()
})

window.addEventListener("resize", function(){
  engine.resize()
})