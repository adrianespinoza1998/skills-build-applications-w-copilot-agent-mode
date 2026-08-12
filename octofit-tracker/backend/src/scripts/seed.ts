import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({})
    ]);

    const users = await User.insertMany([
      { name: 'Ava Martinez', email: 'ava@example.com', team: 'Red Falcons', points: 420, workouts: 8 },
      { name: 'Leo Kim', email: 'leo@example.com', team: 'Blue Sharks', points: 390, workouts: 7 },
      { name: 'Mia Johnson', email: 'mia@example.com', team: 'Red Falcons', points: 360, workouts: 6 },
      { name: 'Noah Lee', email: 'noah@example.com', team: 'Green Hawks', points: 335, workouts: 5 }
    ]);

    const teams = await Team.insertMany([
      { name: 'Red Falcons', captain: 'Ava Martinez', totalPoints: 420 },
      { name: 'Blue Sharks', captain: 'Leo Kim', totalPoints: 390 },
      { name: 'Green Hawks', captain: 'Noah Lee', totalPoints: 335 }
    ]);

    const teamMap = new Map(teams.map((team) => [team.name, team]));

    const activities = await Activity.insertMany([
      { userId: users[0]._id, type: 'Run', duration: 35, calories: 280, date: '2026-08-09' },
      { userId: users[1]._id, type: 'Strength', duration: 45, calories: 320, date: '2026-08-10' },
      { userId: users[2]._id, type: 'Cycling', duration: 60, calories: 410, date: '2026-08-11' },
      { userId: users[3]._id, type: 'HIIT', duration: 25, calories: 240, date: '2026-08-12' }
    ]);

    const leaderboardEntries = await LeaderboardEntry.insertMany(
      users
        .sort((a, b) => Number(b.points) - Number(a.points))
        .map((user, index) => ({
          userId: user._id,
          name: user.name,
          team: user.team,
          points: user.points,
          rank: index + 1
        }))
    );

    const workouts = await Workout.insertMany([
      { title: 'Cardio Blast', focus: 'endurance', duration: 30, difficulty: 'moderate' },
      { title: 'Core Circuit', focus: 'core', duration: 20, difficulty: 'easy' },
      { title: 'Power Lift', focus: 'strength', duration: 40, difficulty: 'advanced' },
      { title: 'Sprint Intervals', focus: 'speed', duration: 25, difficulty: 'moderate' }
    ]);

    console.log('Database seeding complete');
    console.log(JSON.stringify({
      users: users.length,
      teams: teams.length,
      activities: activities.length,
      leaderboardEntries: leaderboardEntries.length,
      workouts: workouts.length,
      teamNames: Array.from(teamMap.keys())
    }, null, 2));

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
