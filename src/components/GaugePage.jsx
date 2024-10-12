import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import axios from 'axios';
import Papa from 'papaparse';
import './GaugePage.css';

const GaugePage = () => {
  const [avgSentimentBusiness, setAvgSentimentBusiness] = useState(0);
  const [avgSentimentPersonal, setAvgSentimentPersonal] = useState(0);
  const [selectedSentimentBusiness, setSelectedSentimentBusiness] = useState('None');
  const [selectedSentimentPersonal, setSelectedSentimentPersonal] = useState('None');
  const [selectedFeaturesBusiness, setSelectedFeaturesBusiness] = useState([]);
  const [selectedFeaturesPersonal, setSelectedFeaturesPersonal] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [personalData, setPersonalData] = useState([]);
  const [reasonsBusiness, setReasonsBusiness] = useState({});
  const [reasonsPersonal, setReasonsPersonal] = useState({});

  useEffect(() => {
    // Fetch business sentiments
    axios.get('/Data/business_sentiments.csv')
      .then(response => {
        const data = Papa.parse(response.data, { header: true }).data;
        setBusinessData(data);
        setReasonsBusiness(extractReasons(data));
        const avgSentiment = calculateAverageSentiment(data);
        setAvgSentimentBusiness(avgSentiment);
      });

    // Fetch personal sentiments
    axios.get('/Data/personal_sentiments.csv')
      .then(response => {
        const data = Papa.parse(response.data, { header: true }).data;
        setPersonalData(data);
        setReasonsPersonal(extractReasons(data));
        const avgSentiment = calculateAverageSentiment(data);
        setAvgSentimentPersonal(avgSentiment);
      });
  }, []);

  const extractReasons = (data) => {
    const reasons = {};
    data.forEach(entry => {
      const sentimentScore = Math.round(parseFloat(entry['Sentiment Score']) * 10); // Scale to 0-10
      if (!reasons[sentimentScore]) {
        reasons[sentimentScore] = [];
      }
      reasons[sentimentScore].push(entry['Reasons']); // Assuming Reasons is a comma-separated string
    });
    return reasons;
  };

  const calculateAverageSentiment = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return 0;
    }
    const totalSentiment = data.reduce((sum, entry) => {
      const sentimentScore = parseFloat(entry['Sentiment Score']);
      return sum + (isNaN(sentimentScore) ? 0 : sentimentScore);
    }, 0);
    return totalSentiment / data.length * 10; // Scale to 0-10
  };

  const getSentimentFeatures = (score, type) => {
    const reasons = type === 'business' ? reasonsBusiness : reasonsPersonal;
    return reasons[score] ? reasons[score].flat().map(reason => reason.trim())[0] : ''; // Get only the first reason
  };

  const handleSentimentClick = (score, type) => {
    const feature = getSentimentFeatures(score, type);
    if (type === 'business') {
      setSelectedSentimentBusiness(score);
      setSelectedFeaturesBusiness([feature]);
    } else {
      setSelectedSentimentPersonal(score);
      setSelectedFeaturesPersonal([feature]);
    }
  };

  const createGaugeData = () => {
    return Array.from({ length: 11 }, (_, index) => ({
      name: index === 0 ? 'Dissatisfied' : index === 10 ? 'Satisfied' : '',
      value: 1 // Each segment represents 1 point
    }));
  };

  const gaugeData = createGaugeData();

  const renderGauge = (avgSentiment, type) => (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={gaugeData}
          startAngle={180}
          endAngle={0}
          innerRadius="70%"
          outerRadius="90%"
          dataKey="value"
          onClick={(event, index) => {
            handleSentimentClick(index, type); // Index corresponds to the sentiment score
          }}
        >
          {gaugeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`hsl(${(index / 10) * 120}, 100%, 50%)`} /> // Solid color from red to green
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip avgSentiment={avgSentiment} />} />
        {renderNeedle(avgSentiment / 10)} {/* Normalize for needle rendering */}
      </PieChart>
    </ResponsiveContainer>
  );

  const renderNeedle = (value) => {
    const normalizedValue = Math.max(0, Math.min(1, value));
    const needleLength = 80;
    const needleRadius = 15;
    const thetaRad = Math.PI * normalizedValue;
    const centerX = 240;
    const centerY = 120;
    const topX = centerX - needleLength * Math.cos(thetaRad);
    const topY = centerY - needleLength * Math.sin(thetaRad);

    return (
      <g>
        <circle cx={centerX} cy={centerY} r={needleRadius} fill="#000000" />
        <path
          d={`M ${topX} ${topY} L ${centerX - needleRadius} ${centerY} L ${centerX + needleRadius} ${centerY} Z`}
          fill="#000000"
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, avgSentiment }) => {
    if (active && payload && payload.length) {
      const sentimentValue = payload[0].payload.name;
      return (
        <div className="custom-tooltip">
          <p>{`Sentiment Rating: ${sentimentValue}`}</p>
        </div>
      );
    }
    return null;
  };

  const getReasonsForAverageSentiment = (avgSentiment, type) => {
    const roundedScore = Math.round(avgSentiment); // Round average sentiment score
    const reasons = type === 'business' ? reasonsBusiness : reasonsPersonal;
    return reasons[roundedScore] && reasons[roundedScore].length > 0
        ? reasons[roundedScore].flat().map(reason => reason.trim())[0] // Get the first reason
        : 'No reasons available'; // Return a message if no reasons are found
};


  return (
    <div className="gauge-container">
      <div className="gauge-box">
        <h2 style={{ color: 'black' }}>Business Class Travel Sentiment</h2>
        {renderGauge(avgSentimentBusiness, 'business')}
        <div className="sentiment-details">
          <h4>Average Sentiment: {avgSentimentBusiness.toFixed(2)}</h4>
          <h4 style={{
            background: 'yellow',
            borderRadius: '20px',
            padding: '10px',
            marginBottom:'20px'
          }}>Reasons for Average Sentiment: {getReasonsForAverageSentiment(avgSentimentBusiness, 'business')}</h4> {/* Display reasons */}
          <h4>Selected Sentiment: {selectedSentimentBusiness}</h4>
          <h4 style={{
            background: 'aqua',
            borderRadius: '20px',
            padding: '10px'
          }}>First Reason: {selectedFeaturesBusiness[0] || 'N/A'}</h4> {/* Show first reason */}
        </div>
      </div>

      <div className="gauge-box">
        <h2 style={{ color: 'black' }}>Personal Class Travel Sentiment</h2>
        {renderGauge(avgSentimentPersonal, 'personal')}
        <div className="sentiment-details">
          <h4>Average Sentiment: {avgSentimentPersonal.toFixed(2)}</h4>
          <h4 style={{
            background: 'yellow',
            borderRadius: '20px',
            padding: '10px',
            marginBottom:'20px'
          }}>Reasons for Average Sentiment: {getReasonsForAverageSentiment(avgSentimentPersonal, 'personal')}</h4> {/* Display reasons */}

          <h4>Selected Sentiment: {selectedSentimentPersonal}</h4>
          <h4 style={{
            background: 'aqua',
            borderRadius: '20px',
            padding: '10px'
          }}>First Reason: {selectedFeaturesPersonal[0] || 'N/A'}</h4> {/* Show first reason */}
        </div>
      </div>
    </div>
  );
};

export default GaugePage;
