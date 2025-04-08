import { 
  Chart, 
  CategoryScale,
  LinearScale, 
  BarController,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
  DoughnutController,
  RadarController,
  RadialLinearScale,
  Filler
} from 'chart.js';

// Register all Chart.js components globally
Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
  DoughnutController,
  RadarController,
  RadialLinearScale,
  Filler
);

// Export in case we need direct access
export default Chart;