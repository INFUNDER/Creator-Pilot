import { cn } from "../../libs/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

interface CanvasRevealEffectProps {
  animationSpeed?: number;
  opacities?: number[];
  colors?: [number, number, number][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}

export const CanvasRevealEffect: React.FC<CanvasRevealEffectProps> = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}) => {
  return (
    <div className={cn("h-full relative bg-white w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors}
          dotSize={dotSize ?? 3}
          opacities={opacities}
          shader={`float animation_speed_factor = ${animationSpeed.toFixed(1)};`}
          center={["x", "y"]}
        />
      </div>
      {showGradient && <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" />}
    </div>
  );
};

interface DotMatrixProps {
  colors?: [number, number, number][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({ colors = [[0, 0, 0]], opacities = [...Array(10)].map(() => 0.04), totalSize = 4, dotSize = 2, shader = "", center = ["x", "y"] }) => {
  const uniforms = useMemo(() => {
    let colorsArray = colors.length === 1
      ? Array(6).fill(colors[0])
      : colors.length === 2
      ? [...Array(3).fill(colors[0]), ...Array(3).fill(colors[1])]
      : [...Array(2).fill(colors[0]), ...Array(2).fill(colors[1]), ...Array(2).fill(colors[2])];

    return {
      u_colors: { value: colorsArray.map((c) => c.map((v) => v / 255)), type: "uniform3fv" },
      u_opacities: { value: opacities, type: "uniform1fv" },
      u_total_size: { value: totalSize, type: "uniform1f" },
      u_dot_size: { value: dotSize, type: "uniform1f" },
    };
  }, [colors, opacities, totalSize, dotSize]);

  return (
    <Shader
      source={`fragment shader with logic`} // Will replace full shader later.
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

interface ShaderProps {
  source: string;
  uniforms: any;
  maxFps?: number;
}

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

const ShaderMaterial: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    if (timestamp - lastFrameTime < 1 / maxFps) return;
    lastFrameTime = timestamp;

    const material = ref.current.material as THREE.ShaderMaterial;
    material.uniforms.u_time.value = timestamp;
  });

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: `...`,
      fragmentShader: source,
      uniforms: uniforms,
      glslVersion: THREE.GLSL3,
    });
    return mat;
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};
