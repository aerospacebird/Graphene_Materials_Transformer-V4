import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Box,
  RotateCcw,
  Play,
  Pause,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Atom
} from 'lucide-react';
import crystalPresetsData from '../data/crystal_presets.json';
import { CrystalPreset, CrystalAtom } from '../types';

export const Crystal3DViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentPresetKey, setCurrentPresetKey] = useState<string>('graphene');
  const [isRotating, setIsRotating] = useState(true);
  const [showBonds, setShowBonds] = useState(true);
  const [selectedAtom, setSelectedAtom] = useState<CrystalAtom | null>(null);

  const presets = (crystalPresetsData as unknown) as Record<string, CrystalPreset>;
  const activePreset = presets[currentPresetKey] || presets['graphene'];

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Mouse interaction state
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16);

    // 2. Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // 5. Build Atoms & Bonds Group
    const rootGroup = new THREE.Group();
    groupRef.current = rootGroup;
    scene.add(rootGroup);

    buildStructure(rootGroup, activePreset, showBonds);

    // 6. Animation loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (isRotating && rootGroup && !isDragging.current) {
        rootGroup.rotation.y += 0.006;
      }
      renderer.render(scene, camera);
    };
    animate();

    // 7. Mouse Orbit interaction handlers
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !rootGroup) return;
      const deltaX = e.clientX - prevMouse.current.x;
      const deltaY = e.clientY - prevMouse.current.y;
      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!camera) return;
      camera.position.z = Math.max(5, Math.min(30, camera.position.z + e.deltaY * 0.015));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Window resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update structure on preset change or bond toggle
  useEffect(() => {
    if (groupRef.current && activePreset) {
      buildStructure(groupRef.current, activePreset, showBonds);
      setSelectedAtom(null);
    }
  }, [currentPresetKey, showBonds]);

  function buildStructure(group: THREE.Group, preset: CrystalPreset, withBonds: boolean) {
    // Clear old children
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
    }

    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);

    // Add atoms
    preset.atoms.forEach((atom) => {
      const colorNum = parseInt(atom.color.replace('#', '0x'), 16);
      const mat = new THREE.MeshStandardMaterial({
        color: colorNum,
        roughness: 0.25,
        metalness: 0.2,
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.scale.setScalar(atom.radius);
      mesh.position.set(atom.x, atom.y, atom.z);
      mesh.userData = { atom };
      group.add(mesh);
    });

    // Add bonds
    if (withBonds && preset.bonds) {
      const cylinderGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
      const bondMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.4,
      });

      preset.bonds.forEach(([i, j]) => {
        const a1 = preset.atoms[i];
        const a2 = preset.atoms[j];
        if (!a1 || !a2) return;

        const p1 = new THREE.Vector3(a1.x, a1.y, a1.z);
        const p2 = new THREE.Vector3(a2.x, a2.y, a2.z);
        const dist = p1.distanceTo(p2);

        const bondMesh = new THREE.Mesh(cylinderGeo, bondMat);
        bondMesh.scale.set(1, dist, 1);

        // Position at midpoint
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        bondMesh.position.copy(mid);

        // Orient cylinder
        const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
        const axis = new THREE.Vector3(0, 1, 0);
        bondMesh.quaternion.setFromUnitVectors(axis, dir);

        group.add(bondMesh);
      });
    }
  }

  const handleResetCamera = () => {
    if (groupRef.current && cameraRef.current) {
      groupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(0, 0, 14);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-emerald-500" />
            <span>3D 결정 격자 구조 시각화 (Interactive 3D Crystal Viewer)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Three.js WebGL 기반으로 그래핀(sp2 탄소 벌집 격자) 및 발견된 2D/3D 결정 구조를 3차원으로 회전, 확대 및 원자간 결합을 탐색합니다.
          </p>
        </div>

        {/* Structure Presets Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {Object.entries(presets).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setCurrentPresetKey(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPresetKey === key
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p.formula}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas and Control Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Area (2 cols) */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#090d16]">
          {/* Canvas container */}
          <div ref={containerRef} className="w-full h-[480px] cursor-grab active:cursor-grabbing" />

          {/* Canvas Overlay Controls */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-white">
            <span className="font-bold text-emerald-400">{activePreset.name}</span>
            <span className="text-slate-500">|</span>
            <span className="text-[11px] font-mono text-slate-300">{activePreset.system}</span>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white hover:text-emerald-400 transition-colors shadow-lg"
              title={isRotating ? '자동 회전 일시정지' : '자동 회전 시작'}
            >
              {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowBonds(!showBonds)}
              className={`px-3 py-2 rounded-xl backdrop-blur-md border border-slate-700/60 text-xs font-semibold transition-colors shadow-lg ${
                showBonds ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900/80 text-white'
              }`}
              title="원자 결합선 표시 전환"
            >
              결합선 {showBonds ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleResetCamera}
              className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white hover:text-emerald-400 transition-colors shadow-lg"
              title="카메라 시점 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Mouse interaction tip */}
          <div className="absolute bottom-4 left-4 text-[10px] text-slate-400 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 pointer-events-none">
            🖱️ 마우스 드래그: 360° 회전 | 휠: 확대/축소
          </div>
        </div>

        {/* Structure Properties and Insights (1 col) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                결정 구조 분석
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                유사도: {activePreset.similarity.toFixed(3)}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {activePreset.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {activePreset.description}
            </p>
          </div>

          {/* Metrics */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500">결정계 (Space Group)</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {activePreset.system}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500">원자 배위수 (Coordination)</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {activePreset.coordination.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500">전자 밴드갭</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {activePreset.band_gap}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500">슈퍼셀 표시 원자수</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {activePreset.atoms.length}개 원자
              </span>
            </div>
          </div>

          {/* Elemental Color Legend */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-700 dark:text-slate-300">
              원소 색상 범례 (Atomic Color Code)
            </h4>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {Array.from(new Set(activePreset.atoms.map((a) => a.element))).map((elem) => {
                const sampleAtom = activePreset.atoms.find((a) => a.element === elem);
                return (
                  <span
                    key={elem}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: sampleAtom?.color }}
                    ></span>
                    <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{elem}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
