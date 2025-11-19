import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMeals } from '../contexts/MealsContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const ProgressView = () => {
  const { user } = useAuth();
  const { getProgressData } = useMeals();
  const [progressData, setProgressData] = useState([]);
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 250, fat: 67 });
  const [timeframe, setTimeframe] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Get progress data from meals context
        const data = await getProgressData(timeframe);
        setProgressData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching progress data:', error);
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [user, timeframe, getProgressData]);

  const filteredData = progressData.slice(-7); // Last 7 days

  const averageProgress = filteredData.length > 0 ? filteredData.reduce((acc, day) => ({
    calories: acc.calories + day.calories,
    protein: acc.protein + day.protein,
    carbs: acc.carbs + day.carbs,
    fat: acc.fat + day.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  Object.keys(averageProgress).forEach(key => {
    averageProgress[key] = filteredData.length > 0 ? Math.round(averageProgress[key] / filteredData.length) : 0;
  });

  const progressPercentage = (current, goal) => Math.round((current / goal) * 100);

  const CircularProgressRing = ({ percentage, label, value, goal, color, delay }) => {
    const radius = 60;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="progress-ring-container" style={{ animationDelay: `${delay}s` }}>
        <div className="progress-ring">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#e0e0e0"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
              className="progress-circle"
            />
          </svg>
          <div className="ring-text">
            <div className="ring-percentage">{percentage}%</div>
            <div className="ring-label">{label}</div>
            <div className="ring-value">{value} / {goal}</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="progress-view">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your progress data...</p>
        </div>
      </div>
    );
  }

  if (progressData.length === 0) {
    return (
      <div className="progress-view">
        <div className="empty-state">
          <h1>Progress Overview</h1>
          <div className="empty-content">
            <div className="empty-icon">📊</div>
            <h2>No Progress Data Yet</h2>
            <p>Start logging your meals to see your nutrition progress here!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-view">
      <h1>Progress Overview</h1>

      <div className="timeframe-selector">
        <label>Timeframe:</label>
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      <div className="average-progress">
        <h2>Average Daily Intake (Last 7 Days)</h2>
        <div className="progress-rings">
          <CircularProgressRing
            percentage={progressPercentage(averageProgress.calories, goals.calories)}
            label="Calories"
            value={averageProgress.calories}
            goal={goals.calories}
            color="#4CAF50"
            delay={0}
          />
          <CircularProgressRing
            percentage={progressPercentage(averageProgress.protein, goals.protein)}
            label="Protein"
            value={`${averageProgress.protein}g`}
            goal={`${goals.protein}g`}
            color="#FF9800"
            delay={0.2}
          />
          <CircularProgressRing
            percentage={progressPercentage(averageProgress.carbs, goals.carbs)}
            label="Carbs"
            value={`${averageProgress.carbs}g`}
            goal={`${goals.carbs}g`}
            color="#2196F3"
            delay={0.4}
          />
          <CircularProgressRing
            percentage={progressPercentage(averageProgress.fat, goals.fat)}
            label="Fat"
            value={`${averageProgress.fat}g`}
            goal={`${goals.fat}g`}
            color="#9C27B0"
            delay={0.6}
          />
        </div>
      </div>

      <div className="progress-chart">
        <h2>Progress Chart</h2>
        <Line
          data={{
            labels: filteredData.map(day => day.date),
            datasets: [
              {
                label: 'Calories',
                data: filteredData.map(day => day.calories),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
              {
                label: 'Protein (g)',
                data: filteredData.map(day => day.protein),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
              {
                label: 'Carbs (g)',
                data: filteredData.map(day => day.carbs),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
              },
              {
                label: 'Fat (g)',
                data: filteredData.map(day => day.fat),
                borderColor: 'rgb(255, 205, 86)',
                backgroundColor: 'rgba(255, 205, 86, 0.5)',
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Daily Nutrient Intake Over Time',
              },
            },
          }}
        />
      </div>

      <div className="daily-breakdown">
        <h2>Daily Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Calories</th>
              <th>Protein (g)</th>
              <th>Carbs (g)</th>
              <th>Fat (g)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(day => (
              <tr key={day.date}>
                <td>{day.date}</td>
                <td>{day.calories}</td>
                <td>{day.protein}</td>
                <td>{day.carbs}</td>
                <td>{day.fat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressView;
