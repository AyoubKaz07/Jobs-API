const Job = require('../models/Job')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');


const GetAllJobs = async (req, res) => {
    // only looking for jobs created by the user who is logged in
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    console.log(jobs)
    console.log(req.user)
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const GetJob = async (req, res) => {
    // only looking for a certain job (id in params) created by the user who is logged in
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.user.userId })
    if (!job) {
        throw new NotFoundError('Job not found')
    }
    res.status(StatusCodes.OK).json({ job })
}

const CreateJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const UpdateJob = async (req, res) => {
    const { company, position } = req.body
    if (!company || !position) {
        throw new BadRequestError('Company or Position fields not provided')
    }
    const job = await Job.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.userId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!job) {
        throw new NotFoundError('Job not found')
    }
    res.status(StatusCodes.OK).json({ job })
}

const DeleteJob = async (req, res) => {
    const job = await Job.findOneAndDelete({_id: req.params.id, createdBy: req.user.userId})
    if (!job) {
        throw new NotFoundError('Job not found')
    }
    res.status(StatusCodes.OK).json(`Job with id ${req.params.id} deleted`)
}

module.exports = {
    GetAllJobs,
    GetJob,
    CreateJob,
    UpdateJob,
    DeleteJob
}