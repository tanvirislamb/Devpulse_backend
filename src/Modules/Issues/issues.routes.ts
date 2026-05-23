import { Router } from "express"
import authMiddle from "../../Middleware/authMiddle"
import { issuesController } from "./issues.controller"

const router = Router()

router.post('/', authMiddle(), issuesController.createIssues)
router.get('/', issuesController.getAllIssues)
router.get('/:id', issuesController.getSingleIssue)
router.patch('/:id', authMiddle(), issuesController.updateIssue)
router.delete('/:id', authMiddle(), issuesController.deleteIssues)


export const issuesRouter = router