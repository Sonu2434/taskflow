const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query;
    const query = {};

    // Members can only see projects they belong to
    if (req.user.role !== 'admin') {
      query.$or = [{ members: req.user._id }, { createdBy: req.user._id }];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('members', 'name email avatar role')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Attach task counts
    const projectsWithStats = await Promise.all(projects.map(async (project) => {
      const tasks = await Task.find({ projectId: project._id });
      const completedTasks = tasks.filter(t => t.status === 'done').length;
      const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
      return { ...project.toObject(), taskCount: tasks.length, completedTasks, progress };
    }));

    res.json({
      success: true,
      data: projectsWithStats,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email avatar role')
      .populate('createdBy', 'name email avatar');

    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const tasks = await Task.find({ projectId: project._id }).populate('assignedTo', 'name email avatar');
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    res.json({ success: true, data: { ...project.toObject(), tasks, taskCount: tasks.length, completedTasks, progress } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res) => {
  try {
    const { title, description, status, priority, deadline, members } = req.body;
    const project = await Project.create({
      title, description, status, priority, deadline,
      members: members || [],
      createdBy: req.user._id
    });

    const populated = await Project.findById(project._id)
      .populate('members', 'name email avatar role')
      .populate('createdBy', 'name email avatar');

    res.status(201).json({ success: true, message: 'Project created successfully.', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('members', 'name email avatar role')
      .populate('createdBy', 'name email avatar');

    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.json({ success: true, message: 'Project updated.', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    await Task.deleteMany({ projectId: project._id });
    await project.deleteOne();
    res.json({ success: true, message: 'Project and related tasks deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
