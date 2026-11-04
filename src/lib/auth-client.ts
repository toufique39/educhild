import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "https://fancy-bienenstitch-f8f9d5.netlify.app/",
    plugins: [
  jwtClient(),
],
})

export const { signIn, signUp, useSession } = authClient
