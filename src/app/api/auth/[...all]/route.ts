import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth"; // path to your auth file

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const { POST, GET } = toNextJsHandler(auth);
