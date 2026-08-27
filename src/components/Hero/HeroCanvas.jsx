import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './particleField';
import styles from './Hero.module.css';

const DENSITY = 1300;
const MAX_POINTS = 2600;
const MIN_POINTS = 260;

export default function HeroCanvas() {
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
        uColorBase: { value: new THREE.Color('#6b6b73') },
        uColorAccent: { value: new THREE.Color('#ff6a3d') },
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
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
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
        scales[i] = 1.2 + Math.random() * 2.1;
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

    const mouse = new THREE.Vector2(9999, 9999);
    const targetMouse = new THREE.Vector2(9999, 9999);

    function onPointerMove(e) {
      const rect = container.getBoundingClientRect();
      targetMouse.set(e.clientX - rect.left - width / 2, height / 2 - (e.clientY - rect.top));
    }
    function onPointerLeave() {
      targetMouse.set(9999, 9999);
    }

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    const clock = new THREE.Clock();
    let rafId = null;

    function tick() {
      material.uniforms.uTime.value = clock.getElapsedTime();
      mouse.lerp(targetMouse, 0.08);
      material.uniforms.uMouse.value.copy(mouse);
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

    const resizeObserver = new ResizeObserver(() => {
      buildField();
      if (reduceMotion) renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      geometry?.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={styles.canvasWrap} aria-hidden="true" />;
}
