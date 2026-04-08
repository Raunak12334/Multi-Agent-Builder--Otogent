"use client";

import dynamic from "next/dynamic";
import { EditorLoading } from "./editor";

// dynamic() with ssr:false must live in a Client Component
export const EditorDynamic = dynamic(
  () => import("./editor").then((mod) => mod.Editor),
  { ssr: false, loading: () => <EditorLoading /> }
);

export const EditorErrorDynamic = dynamic(
  () => import("./editor").then((mod) => mod.EditorError),
  { ssr: false }
);
