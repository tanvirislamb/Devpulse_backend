import express, { json } from "express"
import { response } from "./Utils/res"

const app = express()

app.use(json())

app.get('/', (req, res) => {
    response(res, true, 200, "Server is running")
})

export default app