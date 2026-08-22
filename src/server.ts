import { app } from "./app.js";
import { env } from "./env/index.js";

app.listen({
    host: env.HOST,
    port: env.PORT
}).then(() => {
    const url = `http://localhost:${env.PORT}`
    console.log(`HTTP Server Running at ${url}`)
})