const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const selectedName = document.getElementById("selected-name");
const joystick = document.getElementById("joystick-left");
const joystickStick = joystick.querySelector(".stick");

const interactables = [];

const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0.05, 0.08, 0.12, 1);

const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 1.6, -6), scene);
camera.setTarget(new BABYLON.Vector3(0, 1.4, 0));
camera.attachControl(canvas, true);
camera.speed = 0.18;
camera.angularSensibility = 4000;
camera.keysUp.push(87);
camera.keysDown.push(83);
camera.keysLeft.push(65);
camera.keysRight.push(68);

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.8;
const spot = new BABYLON.SpotLight("spot", new BABYLON.Vector3(0, 5.5, -2), new BABYLON.Vector3(0, -1, 0.2), Math.PI / 2.5, 8, scene);
spot.intensity = 0.9;

const roomMaterial = new BABYLON.StandardMaterial("roomMaterial", scene);
roomMaterial.diffuseColor = new BABYLON.Color3(0.65, 0.69, 0.72);
const floorMaterial = new BABYLON.StandardMaterial("floorMaterial", scene);
floorMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.22, 0.26);
const equipmentMaterial = new BABYLON.StandardMaterial("equipmentMaterial", scene);
equipmentMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.35, 0.4);
const accentMaterial = new BABYLON.StandardMaterial("accentMaterial", scene);
accentMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.6, 0.85);
const screenMaterial = new BABYLON.StandardMaterial("screenMaterial", scene);
screenMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.8, 0.9);

function markInteractable(mesh, label) {
  mesh.metadata = { label };
  mesh.isPickable = true;
  interactables.push(mesh);
}

function getInteractableLabel(mesh) {
  let current = mesh;
  while (current) {
    if (current.metadata && current.metadata.label) {
      return current.metadata.label;
    }
    current = current.parent;
  }
  return null;
}

function updateSelected(label) {
  selectedName.textContent = label || "None";
}

function pickInteractable(x, y) {
  const pickResult = scene.pick(x, y);
  if (pickResult.hit && pickResult.pickedMesh) {
    const label = getInteractableLabel(pickResult.pickedMesh);
    if (label) {
      updateSelected(label);
      return;
    }
  }
  updateSelected(null);
}

function pickFromCenter() {
  pickInteractable(engine.getRenderWidth() / 2, engine.getRenderHeight() / 2);
}

function createRoom() {
  const floor = BABYLON.MeshBuilder.CreateGround("floor", { width: 12, height: 10 }, scene);
  floor.material = floorMaterial;

  const wallHeight = 3.2;
  const wallThickness = 0.3;
  const backWall = BABYLON.MeshBuilder.CreateBox("backWall", { width: 12, height: wallHeight, depth: wallThickness }, scene);
  backWall.position = new BABYLON.Vector3(0, wallHeight / 2, 5);
  backWall.material = roomMaterial;

  const frontWall = BABYLON.MeshBuilder.CreateBox("frontWall", { width: 12, height: wallHeight, depth: wallThickness }, scene);
  frontWall.position = new BABYLON.Vector3(0, wallHeight / 2, -5);
  frontWall.material = roomMaterial;

  const leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", { width: wallThickness, height: wallHeight, depth: 10 }, scene);
  leftWall.position = new BABYLON.Vector3(-6, wallHeight / 2, 0);
  leftWall.material = roomMaterial;

  const rightWall = BABYLON.MeshBuilder.CreateBox("rightWall", { width: wallThickness, height: wallHeight, depth: 10 }, scene);
  rightWall.position = new BABYLON.Vector3(6, wallHeight / 2, 0);
  rightWall.material = roomMaterial;
}

function createBed() {
  const base = BABYLON.MeshBuilder.CreateBox("bedBase", { width: 2.2, height: 0.4, depth: 3 }, scene);
  base.position = new BABYLON.Vector3(-2.5, 0.2, 1.5);
  base.material = equipmentMaterial;
  markInteractable(base, "Bed");

  const mattress = BABYLON.MeshBuilder.CreateBox("mattress", { width: 2.1, height: 0.25, depth: 2.8 }, scene);
  mattress.position = new BABYLON.Vector3(-2.5, 0.55, 1.5);
  mattress.material = roomMaterial;
  markInteractable(mattress, "Bed");

  const headboard = BABYLON.MeshBuilder.CreateBox("headboard", { width: 2.2, height: 0.9, depth: 0.2 }, scene);
  headboard.position = new BABYLON.Vector3(-2.5, 0.85, 2.9);
  headboard.material = equipmentMaterial;
  markInteractable(headboard, "Bed");
}

function createMonitor() {
  const stand = BABYLON.MeshBuilder.CreateCylinder("monitorStand", { height: 1.4, diameter: 0.2 }, scene);
  stand.position = new BABYLON.Vector3(-0.2, 0.7, 0.5);
  stand.material = equipmentMaterial;
  markInteractable(stand, "Monitor");

  const screen = BABYLON.MeshBuilder.CreateBox("monitorScreen", { width: 1, height: 0.6, depth: 0.08 }, scene);
  screen.position = new BABYLON.Vector3(-0.2, 1.4, 0.5);
  screen.material = screenMaterial;
  markInteractable(screen, "Monitor");

  const consoleBox = BABYLON.MeshBuilder.CreateBox("monitorConsole", { width: 0.6, height: 0.2, depth: 0.4 }, scene);
  consoleBox.position = new BABYLON.Vector3(-0.2, 0.25, 0.9);
  consoleBox.material = accentMaterial;
  markInteractable(consoleBox, "Monitor");
}

function createVentilator() {
  const base = BABYLON.MeshBuilder.CreateBox("ventBase", { width: 0.9, height: 0.9, depth: 0.8 }, scene);
  base.position = new BABYLON.Vector3(2.6, 0.45, 1.6);
  base.material = equipmentMaterial;
  markInteractable(base, "Ventilator");

  const screen = BABYLON.MeshBuilder.CreateBox("ventScreen", { width: 0.6, height: 0.4, depth: 0.05 }, scene);
  screen.position = new BABYLON.Vector3(2.6, 1.05, 1.3);
  screen.material = screenMaterial;
  markInteractable(screen, "Ventilator");

  const tube = BABYLON.MeshBuilder.CreateCylinder("ventTube", { height: 1, diameter: 0.08 }, scene);
  tube.position = new BABYLON.Vector3(2.95, 1.35, 1.6);
  tube.rotation.z = Math.PI / 3;
  tube.material = accentMaterial;
  markInteractable(tube, "Ventilator");
}

function createIVPole() {
  const pole = BABYLON.MeshBuilder.CreateCylinder("ivPole", { height: 2.4, diameter: 0.08 }, scene);
  pole.position = new BABYLON.Vector3(1.8, 1.2, 3.2);
  pole.material = equipmentMaterial;
  markInteractable(pole, "IV Pole/Pump");

  const pump = BABYLON.MeshBuilder.CreateBox("ivPump", { width: 0.4, height: 0.6, depth: 0.3 }, scene);
  pump.position = new BABYLON.Vector3(1.8, 1.4, 3.2);
  pump.material = accentMaterial;
  markInteractable(pump, "IV Pole/Pump");

  const bag = BABYLON.MeshBuilder.CreateBox("ivBag", { width: 0.2, height: 0.35, depth: 0.1 }, scene);
  bag.position = new BABYLON.Vector3(1.9, 2.1, 3.2);
  bag.material = screenMaterial;
  markInteractable(bag, "IV Pole/Pump");
}

function createDefibZone() {
  const cart = BABYLON.MeshBuilder.CreateBox("defibCart", { width: 1.2, height: 0.8, depth: 0.8 }, scene);
  cart.position = new BABYLON.Vector3(2.7, 0.4, -2.2);
  cart.material = equipmentMaterial;
  markInteractable(cart, "Defib/Cart Zone");

  const cartTop = BABYLON.MeshBuilder.CreateBox("defibTop", { width: 1.1, height: 0.15, depth: 0.7 }, scene);
  cartTop.position = new BABYLON.Vector3(2.7, 0.85, -2.2);
  cartTop.material = accentMaterial;
  markInteractable(cartTop, "Defib/Cart Zone");

  const paddles = BABYLON.MeshBuilder.CreateCylinder("defibPaddles", { height: 0.3, diameter: 0.12 }, scene);
  paddles.position = new BABYLON.Vector3(2.4, 0.95, -2.1);
  paddles.rotation.x = Math.PI / 2;
  paddles.material = screenMaterial;
  markInteractable(paddles, "Defib/Cart Zone");
}

createRoom();
createBed();
createMonitor();
createVentilator();
createIVPole();
createDefibZone();

let lookPointerId = null;
let lookLast = null;
let lookDelta = { x: 0, y: 0 };
let tapStart = null;
let tapMoved = false;

function onPointerDown(evt) {
  if (evt.pointerType === "touch") {
    const rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const isRight = x > rect.width / 2;
    if (isRight) {
      lookPointerId = evt.pointerId;
      lookLast = { x: evt.clientX, y: evt.clientY };
    }
    tapStart = { x: evt.clientX, y: evt.clientY, time: performance.now() };
    tapMoved = false;
    return;
  }

  if (evt.button === 0) {
    pickInteractable(evt.clientX, evt.clientY);
  }
}

function onPointerMove(evt) {
  if (evt.pointerType === "touch") {
    if (tapStart) {
      const dist = Math.hypot(evt.clientX - tapStart.x, evt.clientY - tapStart.y);
      if (dist > 12) {
        tapMoved = true;
      }
    }

    if (evt.pointerId === lookPointerId && lookLast) {
      const dx = evt.clientX - lookLast.x;
      const dy = evt.clientY - lookLast.y;
      lookLast = { x: evt.clientX, y: evt.clientY };
      lookDelta.x += dx;
      lookDelta.y += dy;
    }
  }
}

function onPointerUp(evt) {
  if (evt.pointerType === "touch") {
    if (evt.pointerId === lookPointerId) {
      lookPointerId = null;
      lookLast = null;
    }

    if (tapStart && !tapMoved) {
      const duration = performance.now() - tapStart.time;
      if (duration < 250) {
        pickInteractable(evt.clientX, evt.clientY);
      }
    }

    tapStart = null;
  }
}

canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointermove", onPointerMove);
canvas.addEventListener("pointerup", onPointerUp);

window.addEventListener("keydown", (evt) => {
  if (evt.key === "e" || evt.key === "E") {
    pickFromCenter();
  }
});

const joystickState = {
  active: false,
  origin: { x: 0, y: 0 },
  vector: { x: 0, y: 0 },
};

function updateJoystickVisual() {
  const maxDistance = 40;
  const dx = joystickState.vector.x * maxDistance;
  const dy = joystickState.vector.y * maxDistance;
  joystickStick.style.transform = `translate(${dx}px, ${dy}px)`;
}

joystick.addEventListener("pointerdown", (evt) => {
  joystickState.active = true;
  joystick.setPointerCapture(evt.pointerId);
  const rect = joystick.getBoundingClientRect();
  joystickState.origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  joystickState.vector = { x: 0, y: 0 };
  updateJoystickVisual();
});

joystick.addEventListener("pointermove", (evt) => {
  if (!joystickState.active) return;
  const maxDistance = 40;
  const dx = evt.clientX - joystickState.origin.x;
  const dy = evt.clientY - joystickState.origin.y;
  const distance = Math.min(Math.hypot(dx, dy), maxDistance);
  const angle = Math.atan2(dy, dx);
  joystickState.vector = {
    x: Math.cos(angle) * (distance / maxDistance),
    y: Math.sin(angle) * (distance / maxDistance),
  };
  updateJoystickVisual();
});

joystick.addEventListener("pointerup", () => {
  joystickState.active = false;
  joystickState.vector = { x: 0, y: 0 };
  updateJoystickVisual();
});

function applyJoystickMovement() {
  if (!joystickState.active) return;
  const moveX = joystickState.vector.x;
  const moveY = joystickState.vector.y;
  const forward = camera.getDirection(BABYLON.Axis.Z);
  const right = camera.getDirection(BABYLON.Axis.X);
  const move = forward.scale(moveY).add(right.scale(moveX));
  camera.cameraDirection.addInPlace(move.scale(camera.speed));
}

function applyTouchLook() {
  const sensitivity = 0.0025;
  if (lookDelta.x !== 0 || lookDelta.y !== 0) {
    camera.rotation.y += lookDelta.x * sensitivity;
    camera.rotation.x += lookDelta.y * sensitivity;
    camera.rotation.x = Math.max(-1.3, Math.min(1.3, camera.rotation.x));
    lookDelta = { x: 0, y: 0 };
  }
}

function configureAdaptiveScaling() {
  let scaling = 1;
  if (navigator.deviceMemory && navigator.deviceMemory <= 4) {
    scaling = 1.6;
  } else if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    scaling = 1.4;
  }
  if (window.matchMedia("(pointer: coarse)").matches) {
    scaling = Math.max(scaling, 1.4);
  }
  engine.setHardwareScalingLevel(scaling);

  let lastSample = performance.now();
  let frameCount = 0;
  scene.onAfterRenderObservable.add(() => {
    frameCount += 1;
    const now = performance.now();
    if (now - lastSample > 2000) {
      const fps = (frameCount * 1000) / (now - lastSample);
      frameCount = 0;
      lastSample = now;
      let nextScaling = engine.getHardwareScalingLevel();
      if (fps < 45 && nextScaling < 2.5) {
        nextScaling = Math.min(2.5, nextScaling + 0.2);
      } else if (fps > 58 && nextScaling > 1) {
        nextScaling = Math.max(1, nextScaling - 0.1);
      }
      if (Math.abs(nextScaling - engine.getHardwareScalingLevel()) > 0.01) {
        engine.setHardwareScalingLevel(nextScaling);
      }
    }
  });
}

configureAdaptiveScaling();

engine.runRenderLoop(() => {
  applyJoystickMovement();
  applyTouchLook();
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
