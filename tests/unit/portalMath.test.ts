import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { transformThroughPortal, type PortalPose } from '../../src/portalMath';

describe('portal traversal math', () => {
  it('moves the player from the entry portal to the paired exit portal', () => {
    const from: PortalPose = {
      side: 'blue',
      position: new THREE.Vector3(0, 1.5, -5),
      normal: new THREE.Vector3(0, 0, 1),
    };
    const to: PortalPose = {
      side: 'orange',
      position: new THREE.Vector3(4, 1.5, 5),
      normal: new THREE.Vector3(0, 0, -1),
    };

    const result = transformThroughPortal(
      new THREE.Vector3(0.25, 1.5, -4.9),
      new THREE.Vector3(0, 0, -3),
      from,
      to,
    );

    expect(result.position.x).toBeCloseTo(4.25);
    expect(result.position.z).toBeLessThan(5);
    expect(result.velocity.length()).toBeGreaterThanOrEqual(3);
  });
});
