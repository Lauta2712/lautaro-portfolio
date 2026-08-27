import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from '../../shaders/particleField';
import styles from './GlobalField.module.css';

// Ambient, viewport-fixed sibling of HeroCanvas — same shader, sparser than
// the hero's own field and no pointer interaction. Gives the page continuity
// after the hero instead of going flat once the hero's canvas scrolls out.
const DENSITY = 3200;
const MAX_POINTS = 900;
const MIN_POINTS = 200;

export default function GlobalField() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return undefined;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -200, 200);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(9999, 9999) },
        uPixelRatio: { value: dpr },
        uColorBase: { value: new THREE.Color('#8a8a92') },
        uColorAccent: { value: new THREE.Color('#8a8a92') },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    let geometry = null;
    let points = null;
    let width = 0;
    let height = 0;

    function buildField() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (width === 0 || height === 0) return;

      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();

      const count = Math.max(MIN_POINTS, Math.min(MAX_POINTS, Math.floor((width * height) / DENSITY)));

      const positions = new Float32Array(count * 3);
      const phases = new Float32Array(count);
      const scales = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * width * 1.1;
        positions[i * 3 + 1] = (Math.random() - 0.5) * height * 1.1;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        phases[i] = Math.random() * Math.PI * 2;
        scales[i] = 1.8 + Math.random() * 2.2;
      }

      if (points) {
        scene.remove(points);
        geometry.dispose();
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
      geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

      points = new THREE.Points(geometry, material);
      scene.add(points);

      renderer.setSize(width, height, false);
    }

    buildField();

    const clock = new THREE.Clock();
    let rafId = null;

    function tick() {
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }

    renderer.render(scene, camera);
    if (!reduceMotion) {
      rafId = requestAnimationFrame(tick);
    }

    function onVisibilityChange() {
      if (document.hidden) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else if (!reduceMotion && rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    function onResize() {
      buildField();
      if (reduceMotion) renderer.render(scene, camera);
    }
    window.addEventListener('resize', onResize);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      geometry?.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={styles.field} aria-hidden="true" />;
}
