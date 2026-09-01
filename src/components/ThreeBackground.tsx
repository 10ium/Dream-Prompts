import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050508, 0.002);

      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 80;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Particles Constellation
      const particleCount = 220;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const color1 = new THREE.Color(0x6366f1); // Indigo
      const color2 = new THREE.Color(0xa855f7); // Purple
      const color3 = new THREE.Color(0x38bdf8); // Sky blue

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 150;

        const mixedColor = Math.random() > 0.4 ? color1 : (Math.random() > 0.5 ? color2 : color3);
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 2.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // 3D Floating Wireframe Meshes
      const meshes: THREE.Mesh[] = [];
      const geometries = [
        new THREE.IcosahedronGeometry(7, 0),
        new THREE.TorusGeometry(8, 2, 8, 20),
        new THREE.OctahedronGeometry(6, 0),
        new THREE.DodecahedronGeometry(6, 0),
      ];

      const wireMaterials = [
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.22 }),
        new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true, transparent: true, opacity: 0.2 }),
        new THREE.MeshBasicMaterial({ color: 0x2dd4bf, wireframe: true, transparent: true, opacity: 0.18 }),
        new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true, transparent: true, opacity: 0.2 }),
      ];

      const meshPositions = [
        { x: -50, y: 25, z: -20 },
        { x: 55, y: -20, z: -30 },
        { x: 45, y: 30, z: -15 },
        { x: -45, y: -25, z: -25 },
      ];

      for (let i = 0; i < 4; i++) {
        const mesh = new THREE.Mesh(geometries[i], wireMaterials[i]);
        mesh.position.set(meshPositions[i].x, meshPositions[i].y, meshPositions[i].z);
        scene.add(mesh);
        meshes.push(mesh);
      }

      // Mouse interaction
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // Window resize handler
      const handleResize = () => {
        if (!container || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      // Animation loop
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth camera interpolation
        targetX += (mouseX - targetX) * 0.03;
        targetY += (mouseY - targetY) * 0.03;

        camera.position.x = targetX * 0.3;
        camera.position.y = -targetY * 0.3;
        camera.lookAt(scene.position);

        // Rotate particles
        particles.rotation.y = elapsedTime * 0.03;
        particles.rotation.x = elapsedTime * 0.015;

        // Rotate 3D floating wireframes
        meshes.forEach((mesh, index) => {
          mesh.rotation.x = elapsedTime * (0.15 + index * 0.05);
          mesh.rotation.y = elapsedTime * (0.2 + index * 0.04);
          mesh.position.y += Math.sin(elapsedTime * 1.2 + index) * 0.03;
        });

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (container && renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (e) {
      console.warn('ThreeBackground WebGL fallback:', e);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
