import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { audioService } from '../../services/audioService';

interface AudioVisualizer3DProps {
  color?: string;
  height?: number;
  interactive?: boolean;
}

export const AudioVisualizer3D: React.FC<AudioVisualizer3DProps> = ({
  color = '#a855f7',
  height = 200,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(new THREE.Color(color), 2, 50);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 1.5, 50);
    cyanLight.position.set(-2, -3, -2);
    scene.add(cyanLight);

    // 3. Central 3D Audio Orb Mesh
    const orbGeometry = new THREE.IcosahedronGeometry(1.2, 4);
    const orbMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.2,
    });
    const orbMesh = new THREE.Mesh(orbGeometry, orbMaterial);
    scene.add(orbMesh);

    // Inner Core Glow Sphere
    const innerGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.6,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // 4. Orbiting 3D Frequency Rings
    const ringGeometry = new THREE.TorusGeometry(1.8, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      wireframe: false,
    });
    const ringMesh1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh1.rotation.x = Math.PI / 3;
    scene.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeometry, new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
    ringMesh2.rotation.y = Math.PI / 4;
    scene.add(ringMesh2);

    // 5. 3D Particle Cloud
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xa855f7,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Interactive Mouse Orbiting
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 7. Render & Audio Frequency Animation Loop
    let animId: number;
    const bufferLength = 32;
    const dataArray = new Uint8Array(bufferLength);
    const originalPositions = orbGeometry.attributes.position.clone();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Fetch real-time frequency data
      audioService.getFrequencyData(dataArray);
      const avgFreq = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
      const normFreq = avgFreq / 255; // 0.0 to 1.0

      // Deform 3D Orb Vertices to Audio Frequency
      const posAttribute = orbGeometry.attributes.position;
      for (let i = 0; i < posAttribute.count; i++) {
        const u = originalPositions.getX(i);
        const v = originalPositions.getY(i);
        const w = originalPositions.getZ(i);

        const freqIndex = i % bufferLength;
        const scale = 1 + (dataArray[freqIndex] / 255) * 0.45;

        posAttribute.setXYZ(i, u * scale, v * scale, w * scale);
      }
      posAttribute.needsUpdate = true;

      // Rotate meshes
      orbMesh.rotation.y += 0.008 + normFreq * 0.02;
      orbMesh.rotation.x += 0.005;

      ringMesh1.rotation.z += 0.01;
      ringMesh2.rotation.z -= 0.012;

      innerMesh.scale.setScalar(1 + normFreq * 0.3);

      particles.rotation.y += 0.002;

      // Smooth mouse lerp
      if (interactive) {
        camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 1.2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      if (interactive) window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [color, height, interactive]);

  return <div ref={containerRef} className="w-full relative overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing" style={{ height }} />;
};
