const express = require("express")

const router = express.Router()

const Projects = require("../data/helpers/projectModel")

// GET all posts
router.get("/", async (req, res) => {
  console.log("GET request made")
  try {
    const projects = await Projects.get()
    res.status(200).json(projects)
  } catch (error) {
    res.status(400).json({ errorMessage: "Could not retrieve projects" })
  }
})

// GET project by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id

  try {
    const project = await Projects.get(id)
    if (project) {
      res.status(200).json(project)
    } else {
      res
        .status(400)
        .json({ errorMessage: "Project with specified ID does not exist" })
    }
  } catch (error) {
    res
      .status(400)
      .json({ errorMessage: "Could not retrieve post by specified ID" })
  }
})

// GET project actions by ID
router.get("/:id/actions", async (req, res) => {
  const id = req.params.id

  const actions = await Projects.getProjectActions(id)
  if (!actions.length) {
    res.status(400).json({
      errorMessage:
        "Project with specified ID does not exist. No actions to retrieve"
    })
  } else {
    res.status(200).json(actions)
  }
})

// POST new project
router.post("/", validateProject, async (req, res) => {
  const project = req.body

  const newProject = await Projects.insert(project)
  res.status(201).json(newProject)
})

// PUT to update project by ID
router.put("/:id", validateProject, async (req, res) => {
  const id = req.params.id
  const changes = req.body

  const oldProject = await Projects.get(id)
  await Projects.update(id, changes)
  const newProject = await Projects.get(id)

  res.status(200).json({ was: oldProject, now: newProject })
})

// DELETE project by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id

  try {
    const project = await Projects.get(id)
    if (project) {
      await Projects.remove(id)
      res.status(200).json({ deleted: project })
    } else {
      res
        .status(400)
        .json({ errorMessage: "Project with specified ID does not exist" })
    }
  } catch (error) {
    res.status(400).json({ errorMessage: "Could not delete project" })
  }
})

// middleware
function validateProject(req, res, next) {
  if (!req.body.name || !req.body.description) {
    next({
      code: 400,
      message: "Please provide a name and description for the project"
    })
  } else {
    next()
  }
}

module.exports = router
