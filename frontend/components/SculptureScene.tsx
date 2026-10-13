"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  MoveUpRight,
} from "lucide-react";

export default function SculptureScene() {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<{ turn: (v: number) => void; reset: () => void }>({
    turn: () => {},
    reset: () => {},
  });
  const motion = useRef(true);
  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cleanup = () => {},
      cancelled = false;
    async function init() {
      const T = await import("three");
      const { createSculpture, disposeObject } = await import("./art-models");
      const { RoomEnvironment } =
        await import("three/addons/environments/RoomEnvironment.js");
      const { OrbitControls } =
        await import("three/addons/controls/OrbitControls.js");
      if (cancelled) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      motion.current = !reduced;
      setPlaying(!reduced);
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.setClearColor("#e7e4db");
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.9;
      el!.appendChild(renderer.domElement);
      renderer.domElement.setAttribute(
        "aria-label",
        "드래그하여 회전하는 두 개의 고리 조형물",
      );
      const scene = new T.Scene();
      const pmrem = new T.PMREMGenerator(renderer);
      const roomEnvironment = new RoomEnvironment();
      const environment = pmrem.fromScene(roomEnvironment, 0.04);
      scene.environment = environment.texture;
      scene.environmentIntensity = 0.4;
      roomEnvironment.dispose();
      pmrem.dispose();
      scene.fog = new T.Fog("#e7e4db", 10, 24);
      const camera = new T.PerspectiveCamera(34, 1, 0.1, 60);
      camera.position.set(4, 2.5, 6);
      const orbit = new OrbitControls(camera, renderer.domElement);
      orbit.target.set(0, 0.3, 0);
      orbit.enablePan = false;
      orbit.enableZoom = false;
      orbit.enableDamping = true;
      orbit.minPolarAngle = 0.6;
      orbit.maxPolarAngle = 1.65;
      orbit.autoRotate = motion.current;
      orbit.autoRotateSpeed = 0.55;
      scene.add(new T.HemisphereLight(0xfffaf0, 0x716452, 0.85));
      const key = new T.DirectionalLight(0xfff6e4, 2.5);
      key.position.set(-3, 7, 5);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.normalBias = 0.035;
      scene.add(key);
      const fill = new T.DirectionalLight(0xffffff, 0.7);
      fill.position.set(4, 3, -3);
      scene.add(fill);
      const group = createSculpture();
      group.position.y = -1.33;
      scene.add(group);
      const floor = new T.Mesh(
        new T.PlaneGeometry(100, 100),
        new T.MeshStandardMaterial({ color: 0xe7e4db, roughness: 1 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -1.33;
      floor.receiveShadow = true;
      scene.add(floor);
      let visible = true,
        raf = 0;
      const size = () => {
        const w = el!.clientWidth,
          h = el!.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const resize = new ResizeObserver(size);
      resize.observe(el!);
      size();
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      observer.observe(el!);
      const render = () => {
        raf = requestAnimationFrame(render);
        if (visible && !document.hidden) {
          orbit.autoRotate = motion.current;
          orbit.update();
          renderer.render(scene, camera);
        }
      };
      render();
      controls.current = {
        turn: (v) => {
          group.rotation.y += v;
        },
        reset: () => {
          group.rotation.y = 0;
          camera.position.set(4, 2.5, 6);
          orbit.target.set(0, 0.3, 0);
          orbit.update();
        },
      };
      setReady(true);
      cleanup = () => {
        cancelAnimationFrame(raf);
        observer.disconnect();
        resize.disconnect();
        orbit.dispose();
        disposeObject(scene);
        environment.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }
    init().catch(() => setFailed(true));
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);
  return (
    <div className="scene-shell">
      <div ref={host} className="scene-canvas">
        {!ready && (
          <img src="/artworks/sculpture.png" alt="석고 조형물 사이의 형태" />
        )}
      </div>
      <div className="scene-top">
        <span className="dot-label">FORM STUDY / 001</span>
        <MoveUpRight size={19} />
      </div>
      <div className="scene-caption">
        <span>
          {failed
            ? "조형 스터디"
            : ready
              ? "드래그해서 다른 시선으로 만나보세요"
              : "공간을 준비하고 있어요"}
        </span>
        <small>
          석고의 입자와 석재의 결을 담은 3D 스터디 · 사진 기반 재해석
        </small>
      </div>
      {ready && (
        <div className="scene-controls">
          <button
            aria-label="왼쪽으로 회전"
            onClick={() => controls.current.turn(-0.3)}
          >
            <ArrowLeft size={16} />
          </button>
          <button
            aria-label={playing ? "자동 회전 멈추기" : "자동 회전 시작"}
            onClick={() => {
              motion.current = !playing;
              setPlaying(!playing);
            }}
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </button>
          <button
            aria-label="오른쪽으로 회전"
            onClick={() => controls.current.turn(0.3)}
          >
            <ArrowRight size={16} />
          </button>
          <button
            aria-label="시점 초기화"
            onClick={() => controls.current.reset()}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
