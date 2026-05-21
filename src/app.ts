import express, { json } from "express"
import { response } from "./Utils/res"
import { authRouter } from "./Modules/Auth/auth.routes"

const app = express()

app.use(json())

app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
    response(res, true, 200, "Server is running")
})

export default app