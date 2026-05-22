import { Router } from "express"
import authMiddle from "../../Middleware/authMiddle"
import { issuesController } from "./issues.controller"

const router = Router()

router.post('/', authMiddle(), issuesController.createIssues)
router.get('/', issuesController.getAllIssues)
router.get('/:id', issuesController.getSingleIssue)


export const issuesRouter = router