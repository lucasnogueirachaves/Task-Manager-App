import { app } from "./app.js";
import { env } from "./env/index.js";
import { routes } from "./http/controller/routes.js";

app.register(routes)

app.listen({
    host: env.HOST,
    port: env.PORT
}).then(() => {
    const url = `http://localhost:${env.PORT}`
    console.log(`HTTP Server Running at ${url}`)
})