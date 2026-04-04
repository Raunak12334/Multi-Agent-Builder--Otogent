"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

function createGearGeometry() {
  const shape = new THREE.Shape();
  const teeth = 12;
  const innerRadius = 1.2;
  const outerRadius = 1.6;
  const toothWidth = 0.18;
  const holeRadius = 0.6;

  for (let index = 0; index < teeth; index += 1) {
    const angle = (index / teeth) * Math.PI * 2;
    const nextAngle = ((index + 1) / teeth) * Math.PI * 2;
    const midAngle = (angle + nextAngle) / 2;
    const startAngle = midAngle - toothWidth;
    const endAngle = midAngle + toothWidth;

    if (index === 0) {
      shape.moveTo(
        Math.cos(angle) * innerRadius,
        Math.sin(angle) * innerRadius,
      );
    }

    shape.lineTo(
      Math.cos(startAngle) * innerRadius,
      Math.sin(startAngle) * innerRadius,
    );
    shape.lineTo(
      Math.cos(startAngle) * outerRadius,
      Math.sin(startAngle) * outerRadius,
    );
    shape.lineTo(
      Math.cos(endAngle) * outerRadius,
      Math.sin(endAngle) * outerRadius,
    );
    shape.lineTo(
      Math.cos(endAngle) * innerRadius,
      Math.sin(endAngle) * innerRadius,
    );
    shape.lineTo(
      Math.cos(nextAngle) * innerRadius,
      Math.sin(nextAngle) * innerRadius,
    );
  }

  shape.closePath();

  const hole = new THREE.Path();
  hole.absellipse(0, 0, holeRadius, holeRadius, 0, Math.PI * 2, true, 0);
  shape.holes.push(hole);

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.4,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 3,
  });
}

export function Hero3DScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 5, 5);
    const accentLight = new THREE.DirectionalLight("#7c3aed", 0.4);
    accentLight.position.set(-3, -2, 2);
    const tealLight = new THREE.PointLight("#0d9488", 0.6);
    tealLight.position.set(0, 2, 3);

    scene.add(ambientLight, keyLight, accentLight, tealLight);

    const gearMaterial = new THREE.MeshPhysicalMaterial({
      color: "#0d9488",
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.55,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.5,
    });

    const floatMaterialTeal = new THREE.MeshPhysicalMaterial({
      color: "#0d9488",
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.7,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.25,
    });

    const floatMaterialPurple = new THREE.MeshPhysicalMaterial({
      color: "#7c3aed",
      roughness: 0.1,
      metalness: 0.05,
      transparent: true,
      opacity: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.15,
    });

    const gear = new THREE.Mesh(createGearGeometry(), gearMaterial);
    gear.position.set(0.18, -0.12, -0.2);
    gear.scale.setScalar(0.96);
    gear.rotation.set(0.22, -0.08, 0);
    scene.add(gear);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.35, 20, 48),
      floatMaterialTeal,
    );
    torus.position.set(-3.2, 1.55, -1);
    torus.scale.setScalar(0.35);
    torus.rotation.set(0.95, 0.4, 0.88);
    scene.add(torus);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      floatMaterialPurple,
    );
    sphere.position.set(3.05, 2.65, -1);
    sphere.scale.setScalar(0.22);
    scene.add(sphere);

    const purpleTorus = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.35, 20, 48),
      floatMaterialPurple.clone(),
    );
    purpleTorus.position.set(3.7, -1.55, -0.5);
    purpleTorus.scale.setScalar(0.25);
    purpleTorus.rotation.set(0.72, 0.42, 0.38);
    scene.add(purpleTorus);

    const lowerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      floatMaterialTeal.clone(),
    );
    lowerSphere.position.set(-2.5, -1.8, 0);
    lowerSphere.scale.setScalar(0.3);
    scene.add(lowerSphere);

    const pill = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      floatMaterialTeal.clone(),
    );
    pill.position.set(0, -2.5, -0.5);
    pill.scale.setScalar(0.18);
    scene.add(pill);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) {
        return;
      }

      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };

    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      gear.position.y = -0.12 + Math.sin(elapsed * 1.5) * 0.06;
      gear.rotation.x = 0.22 + Math.sin(elapsed * 0.24) * 0.02;
      gear.rotation.y = -0.08 + Math.cos(elapsed * 0.18) * 0.02;
      gear.rotation.z = elapsed * 0.15;

      torus.rotation.x = elapsed * 0.3;
      torus.rotation.y = 0.4 + elapsed * 0.2;
      torus.rotation.z = 0.88 + Math.sin(elapsed * 0.8) * 0.1;
      torus.position.y = 1.55 + Math.sin(elapsed * 2) * 0.12;

      sphere.position.y = 2.65 + Math.sin(elapsed * 0.8) * 0.3;

      purpleTorus.rotation.x = 0.72 + elapsed * 0.3;
      purpleTorus.rotation.y = 0.42 + elapsed * 0.2;
      purpleTorus.position.y = -1.55 + Math.sin(elapsed * 2) * 0.12;

      lowerSphere.position.y = -1.8 + Math.sin(elapsed * 0.8) * 0.3;

      pill.position.y = -2.5 + Math.sin(elapsed * 0.8) * 0.3;

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      window.removeEventListener("resize", resize);
      renderer.setAnimationLoop(null);

      gear.geometry.dispose();
      torus.geometry.dispose();
      sphere.geometry.dispose();
      purpleTorus.geometry.dispose();
      lowerSphere.geometry.dispose();
      pill.geometry.dispose();

      gearMaterial.dispose();
      floatMaterialTeal.dispose();
      floatMaterialPurple.dispose();
      (lowerSphere.material as THREE.Material).dispose();
      (pill.material as THREE.Material).dispose();
      (purpleTorus.material as THREE.Material).dispose();

      renderer.dispose();
      pmremGenerator.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}
