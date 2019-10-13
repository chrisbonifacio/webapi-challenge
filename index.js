const express = require("express")

const server = express()

const projectRouter = require("./routes/projectRouter")
const actionRouter = require("./routes/actionRouter")

const { errorHandler } = require("./middleware/index")

server.use(express.json())

server.use("/api/projects", projectRouter, errorHandler)
server.use("/api/actions", actionRouter, errorHandler)

server.get("/", (req, res) => {
  res.status(200).json({ app: "is running" })
})

const port = 4000
server.listen(port, () => console.log(`listening on port ${port}`))
