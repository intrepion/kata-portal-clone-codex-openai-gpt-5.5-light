import * as THREE from 'three';

export type PortalSide = 'blue' | 'orange';

export interface PortalPose {
  side: PortalSide;
  position: THREE.Vector3;
  normal: THREE.Vector3;
}

export function transformThroughPortal(
  position: THREE.Vector3,
  velocity: THREE.Vector3,
  from: PortalPose,
  to: PortalPose,
): { position: THREE.Vector3; velocity: THREE.Vector3 } {
  const fromBasis = portalBasis(from.normal);
  const toBasis = portalBasis(to.normal.clone().multiplyScalar(-1));
  const local = position.clone().sub(from.position);
  const localVelocity = velocity.clone();
  const localPosition = new THREE.Vector3(
    local.dot(fromBasis.right),
    local.dot(fromBasis.up),
    local.dot(fromBasis.forward),
  );
  const velocityInPortal = new THREE.Vector3(
    localVelocity.dot(fromBasis.right),
    localVelocity.dot(fromBasis.up),
    localVelocity.dot(fromBasis.forward),
  );

  const exitOffset = to.normal.clone().multiplyScalar(0.9);
  return {
    position: to.position
      .clone()
      .addScaledVector(toBasis.right, localPosition.x)
      .addScaledVector(toBasis.up, localPosition.y)
      .add(exitOffset),
    velocity: new THREE.Vector3()
      .addScaledVector(toBasis.right, velocityInPortal.x)
      .addScaledVector(toBasis.up, velocityInPortal.y)
      .addScaledVector(toBasis.forward, Math.max(Math.abs(velocityInPortal.z), velocity.length())),
  };
}

export function portalBasis(normal: THREE.Vector3): {
  right: THREE.Vector3;
  up: THREE.Vector3;
  forward: THREE.Vector3;
} {
  const forward = normal.clone().normalize();
  const worldUp = Math.abs(forward.dot(new THREE.Vector3(0, 1, 0))) > 0.95
    ? new THREE.Vector3(0, 0, 1)
    : new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(worldUp, forward).normalize();
  const up = new THREE.Vector3().crossVectors(forward, right).normalize();
  return { right, up, forward };
}
