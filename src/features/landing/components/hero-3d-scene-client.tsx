"use client";

import dynamic from "next/dynamic";

const Hero3DScene = dynamic(
  () =>
    import("@/features/landing/components/hero-3d-scene").then(
      (module) => module.Hero3DScene,
    ),
  {
    ssr: false,
  },
);

export function Hero3DSceneClient() {
  return <Hero3DScene />;
}
