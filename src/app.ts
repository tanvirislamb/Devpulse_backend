import express, { json } from "express"

const app = express()
const port = 3000

app.use(json())

app.get('/', (req, res) => {
    console.log("run")
})

export default app