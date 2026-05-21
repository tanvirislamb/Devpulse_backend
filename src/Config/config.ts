import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env") })

const config = {
    port: process.env.PORT,
    db_string: process.env.DB_STRING,
    secret: process.env.SECRET
}

export default config