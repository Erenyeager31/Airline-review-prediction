import React, { useState } from 'react';
import axios from 'axios';
import './PredictionForm.css'; // Import a CSS file for styling

const PredictionForm = () => {
  const [inputData, setInputData] = useState({
    gender: 'Male',
    age: 9,
    customerType: 'Returning',
    typeOfTravel: 'Personal',
    travelClass: 'Business',
    flightDistance: 853,
    departureDelay: 68,
    arrivalDelay: 76,
    departureArrivalConvenience: 5,
    onboardService: 4,
    seatComfort: 5,
    legRoomService: 3,
    cleanliness: 5,
    foodAndDrink: 5,
    inflightService: 5,
    inflightWifiService: 1,
    inflightEntertainment: 5,
    baggageHandling: 4,
    gateLocation: 2, // Add default value for Gate Location
  });

  const [result, setResult] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  // Handle model selection
  const handleModelSelection = (modelType) => {
    inputData.typeOfTravel = modelType == "personal" ? "Personal" : "Business"
    setSelectedModel(modelType);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Creating a new JSON object with the exact keys for the API request
    const payload = {
      Gender: inputData.gender,
      Age: inputData.age,
      'Customer Type': inputData.customerType,
      'Type of Travel': inputData.typeOfTravel,
      Class: inputData.travelClass,
      'Flight Distance': inputData.flightDistance,
      'Departure Delay': inputData.departureDelay,
      'Arrival Delay': inputData.arrivalDelay,
      'Departure and Arrival Time Convenience': inputData.departureArrivalConvenience,
      'Ease of Online Booking': 1, // Add this value to match your earlier schema
      'Check-in Service': 5, // Default value for Check-in Service (can be adjusted)
      'Online Boarding': inputData.onboardService,
      'Gate Location': inputData.gateLocation, // Add Gate Location here
      'On-board Service': inputData.onboardService,
      'Seat Comfort': inputData.seatComfort,
      'Leg Room Service': inputData.legRoomService,
      Cleanliness: inputData.cleanliness,
      'Food and Drink': inputData.foodAndDrink,
      'In-flight Service': inputData.inflightService,
      'In-flight Wifi Service': inputData.inflightWifiService,
      'In-flight Entertainment': inputData.inflightEntertainment,
      'Baggage Handling': inputData.baggageHandling,
    };

    try {
      const response = await axios.post(`http://localhost:5000/predict/${selectedModel}`, payload);
      setResult(response.data);
    } catch (error) {
      console.error("Error during prediction:", error);
    }
  };

  return (
    <div className="prediction-form">
      <h2>Flight Satisfaction Prediction</h2>
      {selectedModel && (
        <div className="model-indicator">
          Selected Model: <strong>{selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)}</strong>
        </div>
      )}
      <form onSubmit={handleSubmit} className="form-layout">
      <div className="form-column">
          <label>Gender:</label>
          <select name="gender" value={inputData.gender} onChange={handleChange} required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <label>Age:</label>
          <input
            type="range"
            name="age"
            min="18"
            max="100"
            value={inputData.age}
            onChange={handleChange}
            required
          />
          <span>{inputData.age}</span>

          <label>Customer Type:</label>
          <select name="customerType" value={inputData.customerType} onChange={handleChange} required>
            <option value="Returning">Returning</option>
            <option value="New">New</option>
          </select>

          {/* <label>Type of Travel:</label>
          <select name="typeOfTravel" value={inputData.typeOfTravel} disabled>
            <option value="Personal">Personal</option>
            <option value="Business">Business</option>
          </select> */}

          <label>Class:</label>
          <select name="travelClass" value={inputData.travelClass} onChange={handleChange} required>
            <option value="Business">Business</option>
            <option value="Economy">Economy</option>
          </select>

          <label>Flight Distance:</label>
          <input
            type="range"
            name="flightDistance"
            min="0"
            max="5000"
            value={inputData.flightDistance}
            onChange={handleChange}
            required
          />
          <span>{inputData.flightDistance}</span>

          <label>Departure Delay:</label>
          <input
            type="range"
            name="departureDelay"
            min="-60"
            max="300"
            value={inputData.departureDelay}
            onChange={handleChange}
            required
          />
          <span>{inputData.departureDelay}</span>

          <label>Gate Location:</label>
          <input
            type="number"
            name="gateLocation"
            value={inputData.gateLocation}
            onChange={handleChange}
            required
          />

<label>In-flight Entertainment:</label>
          <input
            type="range"
            name="inflightEntertainment"
            min="1"
            max="5"
            value={inputData.inflightEntertainment}
            onChange={handleChange}
            required
          />
          <span>{inputData.inflightEntertainment}</span>

          <label>Baggage Handling:</label>
          <input
            type="range"
            name="baggageHandling"
            min="1"
            max="5"
            value={inputData.baggageHandling}
            onChange={handleChange}
            required
          />
          <span>{inputData.baggageHandling}</span>
        </div>

        <div className="form-column">
          <label>Arrival Delay:</label>
          <input
            type="range"
            name="arrivalDelay"
            min="-60"
            max="300"
            value={inputData.arrivalDelay}
            onChange={handleChange}
            required
          />
          <span>{inputData.arrivalDelay}</span>

          <label>Departure and Arrival Time Convenience:</label>
          <input
            type="range"
            name="departureArrivalConvenience"
            min="1"
            max="10"
            value={inputData.departureArrivalConvenience}
            onChange={handleChange}
            required
          />
          <span>{inputData.departureArrivalConvenience}</span>

          <label>On-board Service:</label>
          <input
            type="range"
            name="onboardService"
            min="1"
            max="5"
            value={inputData.onboardService}
            onChange={handleChange}
            required
          />
          <span>{inputData.onboardService}</span>

          <label>Seat Comfort:</label>
          <input
            type="range"
            name="seatComfort"
            min="1"
            max="5"
            value={inputData.seatComfort}
            onChange={handleChange}
            required
          />
          <span>{inputData.seatComfort}</span>

          <label>Leg Room Service:</label>
          <input
            type="range"
            name="legRoomService"
            min="1"
            max="5"
            value={inputData.legRoomService}
            onChange={handleChange}
            required
          />
          <span>{inputData.legRoomService}</span>

          <label>Cleanliness:</label>
          <input
            type="range"
            name="cleanliness"
            min="1"
            max="5"
            value={inputData.cleanliness}
            onChange={handleChange}
            required
          />
          <span>{inputData.cleanliness}</span>

          <label>Food and Drink:</label>
          <input
            type="range"
            name="foodAndDrink"
            min="1"
            max="5"
            value={inputData.foodAndDrink}
            onChange={handleChange}
            required
          />
          <span>{inputData.foodAndDrink}</span>

          <label>In-flight Service:</label>
          <input
            type="range"
            name="inflightService"
            min="1"
            max="5"
            value={inputData.inflightService}
            onChange={handleChange}
            required
          />
          <span>{inputData.inflightService}</span>

          <label>In-flight Wifi Service:</label>
          <input
            type="range"
            name="inflightWifiService"
            min="1"
            max="5"
            value={inputData.inflightWifiService}
            onChange={handleChange}
            required
          />
          <span>{inputData.inflightWifiService}</span>
        </div>

        {/* Move buttons below the input fields */}
        {/* <div className="model-selection">
          <button
            type="button"
            className={`model-button ${selectedModel === 'business' ? 'selected' : ''}`}
            onClick={() => handleModelSelection('business')}
          >
            Business Model
          </button>
          <button
            type="button"
            className={`model-button ${selectedModel === 'personal' ? 'selected' : ''}`}
            onClick={() => handleModelSelection('personal')}
          >
            Personal Model
          </button>
        </div> */}

      </form>

      <div className="model-selection">
        <button
          type="button"
          className={`model-button ${selectedModel === 'business' ? 'selected' : ''}`}
          onClick={() => handleModelSelection('business')}
        >
          Business Model
        </button>
        <button
          type="button"
          className={`model-button ${selectedModel === 'personal' ? 'selected' : ''}`}
          onClick={() => handleModelSelection('personal')}
        >
          Personal Model
        </button>
      </div>

      {/* Submit button below model selection */}
      <button type="submit" onClick={handleSubmit} className="predict-button">Predict</button>

      {/* Display prediction result */}
      {result && (
        <div className="result">
          <h3>Prediction Result:</h3>
          <p className="result-value" style={{
            color:result.prediction == "Satisfied" ? "green" : "red"
          }}>{result.prediction}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
