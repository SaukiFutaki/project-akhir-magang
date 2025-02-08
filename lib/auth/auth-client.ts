import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: "https://project-akhir-magang.vercel.app/", // the base url of your auth server
    plugins : [
        adminClient()
    ]
})