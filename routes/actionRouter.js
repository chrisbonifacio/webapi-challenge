const express = require("express")

const router = express.Router()

const Actions = require("../data/helpers/actionModel")
const Projects = require("../data/helpers/projectModel")

const { errorHandler } = require("../middleware/index")
router.use(errorHandler)

// GET all actions
router.get("/", async (req, res) => {
  try {
    const actions = await Actions.get()
    res.status(200).json(actions)
  } catch (error) {
    res.status(400).json({ errorMessage: "Could not retrieve actions" })
  }
})

// GET an action by id
router.get("/:id", async (req, res) => {
  const id = req.params.id

  const action = await Actions.get(id)
  if (!action) {
    res
      .status(400)
      .json({ errorMessage: "Action with specified ID does not exist" })
  } else {
    res.status(200).json(action)
  }
})

// POST a new action to a project
router.post("/:id", validateProjectID, async (req, res) => {
  const action = req.body
  const id = req.params.id
  try {
    const newAction = await Actions.insert({
      ...action,
      project_id: id
    })
    res.status(201).json(newAction)
  } catch (error) {
    res.status(400).json({ errorMessage: "Could not create new action" })
  }
})

// PUT to update an action
router.put("/:id", async (req, res) => {
  const id = req.params.id
  const changes = req.body
  try {
    const oldAction = await Actions.get(id)
    const newAction = await Actions.update(id, changes)
    res.status(200).json({ was: oldAction, now: newAction })
  } catch (error) {
    res
      .status(400)
      .json({ errorMessage: "Could not update action with specified ID" })
  }
})

// DELETE an action by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id

  try {
    const action = await Actions.get(id)
    await Actions.remove(id)
    res.status(200).json({ deleted: action })
  } catch (error) {
    res
      .status(400)
      .json({ errorMessage: "Could not delete action with specified ID" })
  }
})

async function validateProjectID(req, res, next) {
  const id = req.params.id
  const project = await Projects.get(id)
  if (!project) {
    next({ code: 400, message: "Project with specified ID does not exist" })
  } else {
    next()
  }
}

module.exports = router
