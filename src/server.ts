import app from "./app"
import config from "./Config/config"
import { initDB } from "./DB/database"

const port = config.port || 3000


const main = () => {
    initDB()
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    })
}

main()