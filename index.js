// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Select DOM Elements
const stateInput = document.getElementById('state-input'); // Adjust IDs if your HTML uses different names
const fetchBtn = document.getElementById('fetch-btn');
const alertsSummary = document.getElementById('alerts-summary');
const alertsList = document.getElementById('post-list'); // Or 'alerts-list' based on your boilerplate HTML
const errorMessage = document.getElementById('error-message');

// Event Listener for the button click
fetchBtn.addEventListener('click', handleFetchAlerts);

async function handleFetchAlerts() {
  const stateAbbr = stateInput.value.trim().toUpperCase();

  // Clear previous data & hide error messages at the start of a new request
  clearUI();

  // Input Validation Bonus: Check for exactly two capital letters
  const stateRegex = /^[A-Z]{2}$/;
  if (!stateRegex.test(stateAbbr)) {
    displayError(new Error('Please enter a valid 2-letter state abbreviation (e.g., NY).'));
    stateInput.value = ''; // Ensure input clears even on validation failure
    return;
  }

  // Clear input field immediately upon starting a valid request
  stateInput.value = '';

  try {
    const response = await fetch(`https://api.weather.gov/alerts/active?area=${stateAbbr}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch alerts. Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    displayAlerts(data);
  } catch (error) {
    displayError(error);
  }
}

// Function to display alerts data dynamically
function displayAlerts(data) {
  const title = data.title || 'Current watches, warnings, and advisories';
  const count = data.features ? data.features.length : 0;

  // 1. Display summary text
  alertsSummary.textContent = `${title}: ${count}`;

  // 2. Loop through features array and display headlines
  if (data.features && data.features.length > 0) {
    data.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature.properties.headline || 'No headline available';
      alertsList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No active alerts for this state.';
    alertsList.appendChild(li);
  }
}

// Helper to clear and reset UI lists/summaries
function clearUI() {
  alertsSummary.textContent = '';
  alertsList.innerHTML = '';
  errorMessage.textContent = '';
  errorMessage.style.display = 'none';
  errorMessage.classList.remove('error');
}

// Helper to gracefully show error messages
function displayError(errorObject) {
  console.log(errorObject.message);
  errorMessage.textContent = errorObject.message;
  errorMessage.style.display = 'block';
  errorMessage.classList.add('error'); // Bonus error styling class
}