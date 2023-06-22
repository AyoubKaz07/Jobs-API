const express = require('express');
const router = express.Router();

const {GetAllJobs, GetJob, CreateJob, UpdateJob, DeleteJob} = require('../controllers/jobs')

router.route('/').get(GetAllJobs).post(CreateJob)
router.route('/:id').get(GetJob).patch(UpdateJob).delete(DeleteJob)

module.exports = router;