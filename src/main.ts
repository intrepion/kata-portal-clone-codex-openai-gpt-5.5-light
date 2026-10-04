import * as THREE from 'three';
import { transformThroughPortal, type PortalPose, type PortalSide } from './portalMath';
import './styles.css';

interface TestApi {
  snapshot: () => GameSnapshot;
  completeTraversalSmoke: () => Promise<GameSnapshot>;
  movePlayerTo: (side: PortalSide) => GameSnapshot;
}

interface GameSnapshot {
  chamber: number;
  bluePlaced: boolean;
  orangePlaced: boolean;
  traversals: number;
  player: { x: number; y: number; z: number };
  portalViewsReady: boolean;
  pointerLocked: boolean;
}

declare global {
  interface Window {
    portalCloneTest?: TestApi;
  }
}

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('Missing #app');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdde5e8);

const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 1.65, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
app.append(renderer.domElement);

const overlay = document.createElement('button');
overlay.className = 'start-overlay';
overlay.textContent = 'Begin Test Chamber';
app.append(overlay);

const hud = document.createElement('div');
hud.className = 'hud';
hud.innerHTML = `
  <div class="crosshair" aria-hidden="true"></div>
  <div class="portal-indicators" aria-label="Portal color indicators">
    <span class="indicator blue">Blue ready</span>
    <span class="indicator orange">Orange fixed</span>
  </div>
  <button class="reset" type="button">Reset</button>
`;
app.append(hud);

const message = document.createElement('div');
message.className = 'system-message';
message.textContent = 'Test chamber 01: connect the room to itself.';
app.append(message);

const ambient = new THREE.HemisphereLight(0xffffff, 0x8aa0aa, 1.9);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 2.4);
sun.position.set(4, 9, 6);
sun.castShadow = true;
scene.add(sun);

const chamber = new THREE.Group();
scene.add(chamber);

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf2f5f4, roughness: 0.78 });
const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x374046, roughness: 0.85 });
const portalSurfaceMaterial = new THREE.MeshStandardMaterial({ color: 0xe9eeee, roughness: 0.55 });

function box(name: string, size: THREE.Vector3, position: THREE.Vector3, material: THREE.Material): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), material);
  mesh.name = name;
  mesh.position.copy(position);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  chamber.add(mesh);
  return mesh;
}

box('floor', new THREE.Vector3(14, 0.25, 14), new THREE.Vector3(0, -0.12, 0), wallMaterial);
box('ceiling', new THREE.Vector3(14, 0.25, 14), new THREE.Vector3(0, 5.1, 0), wallMaterial);
box('back-wall', new THREE.Vector3(14, 5, 0.25), new THREE.Vector3(0, 2.5, -7), wallMaterial);
box('front-wall', new THREE.Vector3(14, 5, 0.25), new THREE.Vector3(0, 2.5, 7), wallMaterial);
box('left-wall', new THREE.Vector3(0.25, 5, 14), new THREE.Vector3(-7, 2.5, 0), wallMaterial);
box('right-wall', new THREE.Vector3(0.25, 5, 14), new THREE.Vector3(7, 2.5, 0), wallMaterial);
box('observation-band', new THREE.Vector3(5, 1.1, 0.16), new THREE.Vector3(0, 3.3, -6.86), darkMaterial);
box('blue portal surface', new THREE.Vector3(3.1, 3.1, 0.08), new THREE.Vector3(-3.5, 2.05, -6.72), portalSurfaceMaterial);
box('orange portal surface', new THREE.Vector3(3.1, 3.1, 0.08), new THREE.Vector3(3.5, 2.05, 6.72), portalSurfaceMaterial);

const portalRenderTargets = {
  blue: new THREE.WebGLRenderTarget(512, 512),
  orange: new THREE.WebGLRenderTarget(512, 512),
};

const portals: Record<PortalSide, PortalPose> = {
  blue: {
    side: 'blue',
    position: new THREE.Vector3(-3.5, 1.65, -6.55),
    normal: new THREE.Vector3(0, 0, 1),
  },
  orange: {
    side: 'orange',
    position: new THREE.Vector3(3.5, 1.65, 6.55),
    normal: new THREE.Vector3(0, 0, -1),
  },
};

const portalMeshes: Record<PortalSide, THREE.Mesh> = {
  blue: makePortalMesh('blue', 0x3cb7ff, portalRenderTargets.blue.texture),
  orange: makePortalMesh('orange', 0xff9d22, portalRenderTargets.orange.texture),
};
scene.add(portalMeshes.blue, portalMeshes.orange);
placePortalMesh(portalMeshes.blue, portals.blue);
placePortalMesh(portalMeshes.orange, portals.orange);

const viewCameras: Record<PortalSide, THREE.PerspectiveCamera> = {
  blue: camera.clone(),
  orange: camera.clone(),
};

const keys = new Set<string>();
const clock = new THREE.Clock();
let yaw = Math.PI;
let pitch = 0;
let velocity = new THREE.Vector3();
let traversals = 0;
let lastTraversalAt = 0;

function makePortalMesh(side: PortalSide, color: number, texture: THREE.Texture): THREE.Mesh {
  const material = new THREE.MeshBasicMaterial({
    color,
    map: texture,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.15, 2.75), material);
  mesh.name = `${side} visible portal`;
  return mesh;
}

function placePortalMesh(mesh: THREE.Mesh, portal: PortalPose): void {
  mesh.position.copy(portal.position);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), portal.normal);
}

function resize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function applyCameraRotation(): void {
  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
}

function snapshot(): GameSnapshot {
  return {
    chamber: 1,
    bluePlaced: true,
    orangePlaced: true,
    traversals,
    player: {
      x: Number(camera.position.x.toFixed(2)),
      y: Number(camera.position.y.toFixed(2)),
      z: Number(camera.position.z.toFixed(2)),
    },
    portalViewsReady: Boolean(portalRenderTargets.blue.texture && portalRenderTargets.orange.texture),
    pointerLocked: document.pointerLockElement === renderer.domElement,
  };
}

function movePlayerTo(side: PortalSide): GameSnapshot {
  const portal = portals[side];
  camera.position.copy(portal.position).add(portal.normal.clone().multiplyScalar(0.34));
  velocity.copy(portal.normal).multiplyScalar(-3.5);
  checkPortalTraversal(performance.now() / 1000);
  return snapshot();
}

async function completeTraversalSmoke(): Promise<GameSnapshot> {
  movePlayerTo('blue');
  await new Promise((resolve) => window.setTimeout(resolve, 420));
  movePlayerTo('orange');
  await new Promise((resolve) => window.setTimeout(resolve, 50));
  return snapshot();
}

function paired(side: PortalSide): PortalSide {
  return side === 'blue' ? 'orange' : 'blue';
}

function checkPortalTraversal(now: number): void {
  if (now - lastTraversalAt < 0.35) {
    return;
  }
  for (const side of ['blue', 'orange'] as const) {
    const portal = portals[side];
    const toPlayer = camera.position.clone().sub(portal.position);
    const distance = toPlayer.dot(portal.normal);
    const lateral = toPlayer.clone().sub(portal.normal.clone().multiplyScalar(distance));
    if (Math.abs(distance) < 0.42 && Math.abs(lateral.x) < 1.15 && Math.abs(lateral.y) < 1.45) {
      const next = transformThroughPortal(camera.position, velocity, portal, portals[paired(side)]);
      camera.position.copy(next.position);
      velocity.copy(next.velocity);
      yaw += Math.PI;
      traversals += 1;
      lastTraversalAt = now;
      message.textContent = traversals > 1
        ? 'Two-way traversal confirmed. The chamber is listening.'
        : 'Portal traversal registered. Return through the linked surface.';
      break;
    }
  }
}

function updatePortalViews(): void {
  for (const side of ['blue', 'orange'] as const) {
    const destination = portals[paired(side)];
    const source = portals[side];
    const viewCamera = viewCameras[side];
    const transformed = transformThroughPortal(camera.position, velocity, source, destination);
    viewCamera.position.copy(transformed.position);
    viewCamera.rotation.copy(camera.rotation);
    viewCamera.rotateY(Math.PI);
    viewCamera.aspect = 1;
    viewCamera.updateProjectionMatrix();

    portalMeshes[side].visible = false;
    renderer.setRenderTarget(portalRenderTargets[side]);
    renderer.render(scene, viewCamera);
    renderer.setRenderTarget(null);
    portalMeshes[side].visible = true;
  }
}

function update(delta: number, now: number): void {
  const speed = keys.has('ShiftLeft') ? 6.2 : 3.8;
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3(forward.z, 0, -forward.x);
  const input = new THREE.Vector3();
  if (keys.has('KeyW')) input.add(forward);
  if (keys.has('KeyS')) input.sub(forward);
  if (keys.has('KeyD')) input.add(right);
  if (keys.has('KeyA')) input.sub(right);
  if (input.lengthSq() > 0) {
    input.normalize().multiplyScalar(speed);
    velocity.x = input.x;
    velocity.z = input.z;
  } else {
    velocity.x *= 0.82;
    velocity.z *= 0.82;
  }
  camera.position.addScaledVector(velocity, delta);
  camera.position.x = THREE.MathUtils.clamp(camera.position.x, -6.3, 6.3);
  camera.position.y = 1.65;
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, -6.3, 6.3);
  checkPortalTraversal(now);
  applyCameraRotation();
}

function reset(): void {
  camera.position.set(0, 1.65, 5);
  velocity.set(0, 0, 0);
  yaw = Math.PI;
  pitch = 0;
  traversals = 0;
  lastTraversalAt = 0;
  message.textContent = 'Test chamber 01: connect the room to itself.';
  applyCameraRotation();
}

function animate(): void {
  const delta = Math.min(clock.getDelta(), 0.05);
  const now = performance.now() / 1000;
  update(delta, now);
  updatePortalViews();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

overlay.addEventListener('click', () => {
  overlay.classList.add('hidden');
  renderer.domElement.requestPointerLock?.().catch(() => {
    message.textContent = 'Pointer lock unavailable; test chamber remains active.';
  });
});

hud.querySelector<HTMLButtonElement>('.reset')?.addEventListener('click', reset);

window.addEventListener('resize', resize);
window.addEventListener('keydown', (event) => keys.add(event.code));
window.addEventListener('keyup', (event) => keys.delete(event.code));
window.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement !== renderer.domElement) {
    return;
  }
  yaw -= event.movementX * 0.0025;
  pitch = THREE.MathUtils.clamp(pitch - event.movementY * 0.0025, -1.2, 1.2);
});

window.portalCloneTest = {
  snapshot,
  completeTraversalSmoke,
  movePlayerTo,
};

applyCameraRotation();
animate();
