import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchDailyRevenue,
  fetchWeeklyRevenue,
  fetchMonthlyRevenue,
  fetchTopSellingProducts,
  fetchTotalOrder,
  fetchTotalRevenue,
  getTotalOrder,
  getTotalRevenue
} from '../../../store/AnalysisSlice/AnalysisSlice';
import { STATUS } from "../../../utils/status";
import { Typography, Grid, Paper, Breadcrumbs, Link } from '@mui/material';
import { Loading } from "../../../components";
import { Bar, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { addDays, format, startOfMonth, endOfMonth, getWeekOfMonth, eachWeekOfInterval, getWeek, addWeeks } from 'date-fns';

const useStyles = (isActive) => ({
  color: isActive ? "#006fc4" : "black",
  "&:hover": {
    color: "#006fc4",
  },
  backgroundColor: isActive ? "#4bc0c0" : "white",
});

const AdminHome = () => {
  const dispatch = useDispatch();
  const [lineChart, setLineChart] = useState(true);
  const [barChart, setBarChart] = useState(false);
  const [chartView, setChartView] = useState('daily');
  const totalOrder = useSelector(getTotalOrder);
  const totalRevenue = useSelector(getTotalRevenue);
  const currentDate = new Date();
  const startOfMonthDate = startOfMonth(currentDate);
  const endOfMonthDate = endOfMonth(currentDate);
  const weekNumber = getWeekOfMonth(currentDate, { weekStartsOn: 1 });
  const startOfWeekDate = addWeeks(startOfMonthDate, weekNumber - 1);
  const weeksOfMonth = eachWeekOfInterval({ start: startOfMonthDate, end: endOfMonthDate }, { weekStartsOn: 1 });
  const weekNumbersOfMonth = weeksOfMonth.map(week => 'Week ' + getWeek(week, { weekStartsOn: 1 }));
  const weekList = weeksOfMonth.map(week => new Date().getFullYear().toString() + '-' + (getWeek(week, { weekStartsOn: 1 }) < 10 ? `0${getWeek(week, { weekStartsOn: 1 })}` : `${getWeek(week, { weekStartsOn: 1 })}`));
  const daysList = Array.from({ length: 7 }, (_, i) => format(addDays(startOfWeekDate, i), 'dd-MM-yyyy'));
  const monthsList = Array.from({ length: 12 }, (_, i) => new Date(new Date().getFullYear(), i, 1).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit' }).split('/').reverse().join('-'));

  const [lineChartData, setLineChartData] = useState({
    labels: daysList,
    datasets: [
      {
        label: 'Revenue',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });

  const [barChartData, setBarChartData] = useState({
    labels: daysList,
    datasets: [
      {
        label: 'Total Sales',
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });

  useEffect(() => {
    dispatch(fetchDailyRevenue()).then((fetchedData) => {
      const formattedData = formatDailyRevenue(fetchedData.payload.data);
      setLineChartData(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: formattedData,
        }],
      }));
      setLineChart(true);
      setBarChart(false);
    });
    dispatch(fetchTotalRevenue());
    dispatch(fetchTotalOrder());
  }, []);

  const handleBreadcrumbClick = (viewType) => {
    switch (viewType) {
      case 'daily':
        setBarChart(false);
        setChartView('daily');
        dispatch(fetchDailyRevenue()).then((fetchedData) => {
          const formattedData = formatDailyRevenue(fetchedData.payload.data);
          setLineChartData(prevData => ({
            labels: daysList,
            datasets: [{
              ...prevData.datasets[0],
              data: formattedData,
            }],
          }));
          setLineChart(true);
        });
        break;
      case 'weekly':
        setBarChart(false);
        setChartView('weekly');
        dispatch(fetchWeeklyRevenue()).then((fetchedData) => {
          const formattedData = formatWeeklyRevenue(fetchedData.payload.data);
          setLineChartData(prevData => ({
            labels: weekNumbersOfMonth,
            datasets: [{
              ...prevData.datasets[0],
              data: formattedData,
            }],
          }));
          setLineChart(true);
        });
        break;
      case 'monthly':
        setBarChart(false);
        setChartView('monthly');
        dispatch(fetchMonthlyRevenue()).then((fetchedData) => {
          const formattedData = formatMonthlyRevenue(fetchedData.payload.data);
          setLineChartData(prevData => ({
            labels: monthsList,
            datasets: [{
              ...prevData.datasets[0],
              data: formattedData,
            }],
          }));
          setLineChart(true);
        });
        break;
      case 'topselling':
        setLineChart(false);
        setChartView('topselling');
        dispatch(fetchTopSellingProducts()).then((fetchedData) => {
          formatTopSelling(fetchedData.payload.data);
          setBarChart(true);
        });
        break;
      default:
        break;
    }
  };

  const formatDailyRevenue = (data) => {
    return daysList.map(date => {
      const matchingDate = data.find(item => item._id === date);
      return matchingDate ? matchingDate.total : 0;
    });
  };

  const formatWeeklyRevenue = (data) => {
    return weekList.map(week => {
      const matchingWeek = data.find(item => item._id === week);
      return matchingWeek ? matchingWeek.total : 0;
    });
  };
  
  const formatMonthlyRevenue = (data) => {
    return monthsList.map(month => {
      const matchingMonth = data.find(item => item._id === month);
      return matchingMonth ? matchingMonth.total : 0;
    });
  };

  const formatTopSelling = (data) => {
    const products = data.map(entry => entry.product.name);
    const totals = data.map(entry => entry.total);
    setBarChartData(prevData => ({
      labels: products,
      datasets: [{
        ...prevData.datasets[0],
        data: totals,
      }],
    }));
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 5, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <div className="flex flex-col bg-grey-100 items-center gap-y-[30px] pb-[50px]">
      <div className="max-h-[520px] max-w-[1200px] w-[1200px] bg-white mt-[20px] border border-grey-300 rounded-lg shadow-sm flex gap-2">
        <Grid container>
          <Grid item xs={6} sm={4} md={2}>
            <Breadcrumbs>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', color: 'tomato',  border: '1px solid tomato' }}><strong>Total Order: {totalOrder}</strong></div>
                <div style={{ padding: '20px', color: 'tomato',  border: '1px solid tomato', marginBottom: '10px' }}><strong>Total Revenue: {totalRevenue}</strong></div>
                <Link
                  style={{ padding: '20px', border: '1px solid #006fc4' }}
                  key={'daily'}
                  color="inherit"
                  underline="none"
                  href="#"
                  sx={useStyles(chartView === 'daily')}
                  onClick={() => handleBreadcrumbClick('daily')}>
                  <strong>Daily Revenue</strong>
                </Link>
                <Link
                  style={{ padding: '20px', border: '1px solid #006fc4' }}
                  key={'weekly'}
                  color="inherit"
                  underline="none"
                  href="#"
                  sx={useStyles(chartView === 'weekly')}
                  onClick={() => handleBreadcrumbClick('weekly')}>
                  <strong>Weekly Revenue</strong>
                </Link>
                <Link
                  style={{ padding: '20px', border: '1px solid #006fc4' }}
                  key={'monthly'}
                  color="inherit"
                  underline="none"
                  href="#"
                  sx={useStyles(chartView === 'monthly')}
                  onClick={() => handleBreadcrumbClick('monthly')}>
                  <strong>Monthly Revenue</strong>
                </Link>
                <Link
                  style={{ padding: '20px', border: '1px solid #006fc4' }}
                  key={'topselling'}
                  color="inherit"
                  underline="none"
                  href="#"
                  sx={useStyles(chartView === 'topselling')}
                  onClick={() => handleBreadcrumbClick('topselling')}>
                  <strong>Top Selling</strong>
                </Link>
              </div>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={6} sm={8} md={10}>
            {lineChart && <Paper elevation={3} style={{ padding: '20px'}}>
              <Typography variant="h6" gutterBottom>
                <strong>
                Revenue Statistics
                </strong>
              </Typography>
              <Line data={lineChartData} />
            </Paper>}
            {barChart && <Paper elevation={3} style={{ padding: '20px'}}>
              <Typography variant="h6" gutterBottom>
                <strong>
                Top Selling Statistic
                </strong>
              </Typography>
              <Bar data={barChartData} />
            </Paper>}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AdminHome;