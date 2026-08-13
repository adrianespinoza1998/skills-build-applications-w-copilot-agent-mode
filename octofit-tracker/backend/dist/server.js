"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./config/database");
const models_1 = require("./models");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get(['/api/health', '/api/health/'], (_req, res) => {
    res.json({
        status: 'ok',
        service: 'octofit-backend',
        apiBaseUrl,
        environment: process.env.NODE_ENV || 'development'
    });
});
app.get(['/api/users', '/api/users/'], async (_req, res) => {
    try {
        const users = await models_1.User.find().sort({ points: -1, name: 1 }).lean();
        res.json({
            count: users.length,
            apiBaseUrl,
            results: users
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to fetch users.', error: error.message });
    }
});
app.post(['/api/users', '/api/users/'], async (req, res) => {
    const { name, email, team, points = 0, workouts = 0 } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }
    try {
        const user = await models_1.User.create({
            name,
            email,
            team: team || 'Unassigned',
            points,
            workouts
        });
        return res.status(201).json(user);
    }
    catch (error) {
        return res.status(400).json({ message: 'Unable to create user.', error: error.message });
    }
});
app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
    try {
        const teams = await models_1.Team.find().sort({ totalPoints: -1, name: 1 }).lean();
        res.json({
            count: teams.length,
            apiBaseUrl,
            results: teams
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to fetch teams.', error: error.message });
    }
});
app.post(['/api/teams', '/api/teams/'], async (req, res) => {
    const { name, captain, totalPoints = 0 } = req.body;
    if (!name || !captain) {
        return res.status(400).json({ message: 'Team name and captain are required.' });
    }
    try {
        const team = await models_1.Team.create({ name, captain, totalPoints });
        return res.status(201).json(team);
    }
    catch (error) {
        return res.status(400).json({ message: 'Unable to create team.', error: error.message });
    }
});
app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
    try {
        const activities = await models_1.Activity.find().sort({ date: -1 }).populate('userId', 'name email').lean();
        res.json({
            count: activities.length,
            apiBaseUrl,
            results: activities
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to fetch activities.', error: error.message });
    }
});
app.post(['/api/activities', '/api/activities/'], async (req, res) => {
    const { userId, type, duration, calories, date } = req.body;
    if (!userId || !type) {
        return res.status(400).json({ message: 'userId and type are required.' });
    }
    try {
        const activity = await models_1.Activity.create({
            userId,
            type,
            duration: duration || 0,
            calories: calories || 0,
            date: date || new Date().toISOString().slice(0, 10)
        });
        return res.status(201).json(activity);
    }
    catch (error) {
        return res.status(400).json({ message: 'Unable to create activity.', error: error.message });
    }
});
app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
    try {
        let leaderboard = await models_1.LeaderboardEntry.find().sort({ rank: 1 }).populate('userId', 'name team points').lean();
        if (!leaderboard.length) {
            const users = await models_1.User.find().sort({ points: -1 }).lean();
            leaderboard = users.map((user, index) => ({
                _id: user._id,
                userId: user._id,
                name: user.name,
                team: user.team,
                points: user.points,
                rank: index + 1
            }));
        }
        res.json({
            apiBaseUrl,
            count: leaderboard.length,
            results: leaderboard
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to fetch leaderboard.', error: error.message });
    }
});
app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
    try {
        const workouts = await models_1.Workout.find().sort({ difficulty: 1, title: 1 }).lean();
        res.json({
            count: workouts.length,
            apiBaseUrl,
            results: workouts
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to fetch workouts.', error: error.message });
    }
});
app.post(['/api/workouts', '/api/workouts/'], async (req, res) => {
    const { title, focus, duration, difficulty } = req.body;
    if (!title || !focus) {
        return res.status(400).json({ message: 'Title and focus are required.' });
    }
    try {
        const workout = await models_1.Workout.create({
            title,
            focus,
            duration: duration || 0,
            difficulty: difficulty || 'moderate'
        });
        return res.status(201).json(workout);
    }
    catch (error) {
        return res.status(400).json({ message: 'Unable to create workout.', error: error.message });
    }
});
app.listen(port, () => {
    const serverUrl = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev`
        : `http://localhost:${port}`;
    console.log(`Octofit backend running on ${serverUrl}`);
});
