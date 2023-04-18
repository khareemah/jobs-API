const express = require('express');
const router = express();

const {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobsController');
router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').get(getSingleJob).patch(updateJob).delete(deleteJob);

module.exports = router;
