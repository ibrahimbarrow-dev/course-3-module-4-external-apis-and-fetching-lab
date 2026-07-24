// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Select DOM Elements exactly matching your HTML IDs
const button = document.getElementById('fetch-alerts');
const input = document.getElementById('state-input');
const alertContainer = document.getElementById('alerts-display');
const errorDiv = document.getElementById('error-message');

// Event Listener for the button click
button.addEventListener('click', function () {
  // Get and trim the user input
  const stateAbbr = input.value.trim();

  // Basic validation: Check if input is empty
  if (stateAbbr === '') {
    displayError({ message: 'Please enter a state abbreviation.' });
    return;
  }

  // Clear previous errors if any before making a new request
  clearError();

  // Construct the API URL
  const url = `https://api.weather.gov/alerts/active?area=${stateAbbr}`;

  // Fetch the data from the Weather API
  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(function (data) {
      // Clear the input field after a successful fetch as required by the tests
      input.value = '';
      
      // Update the weather alerts display with fresh data
      displayAlerts(data);
    })
    .catch(function (errorObject) {
      // Handle network and API errors using the message key as instructed
      displayError(errorObject);
    });
});

// Function to handle displaying alerts dynamically in the DOM
function displayAlerts(data) {
  // Clear any previous data inside the alert display container
  alertContainer.innerHTML = '';

  // Extract the title and features array
  const title = data.title;
  const features = data.features;
  const numberOfAlerts = features.length;

  // 1. Create and append the summary message heading
  const summaryElement = document.createElement('h2');
  summaryElement.textContent = `${title}: ${numberOfAlerts}`;
  alertContainer.append(summaryElement);

  // 2. Create a list to host the alert headlines
  const ulElement = document.createElement('ul');

  // Loop through each alert feature to extract the headline
  for (let i = 0; i < features.length; i++) {
    const alertHeadline = features[i].properties.headline;

    // Create a list item for each headline
    const liElement = document.createElement('li');
    liElement.textContent = alertHeadline;
    
    // Append the list item to the unordered list
    ulElement.append(liElement);
  }

  // Append the full list to the main container
  alertContainer.append(ulElement);
}

// Function to display error messages when something goes wrong
function displayError(errorObject) {
  // Show the message using the message key
  errorDiv.textContent = errorObject.message;
  
  // Ensure the error element is visible by removing the 'hidden' class or setting display
  errorDiv.classList.remove('hidden');
  errorDiv.style.display = 'block'; 
}

// Function to hide and clear the error element on a successful next request
function clearError() {
  errorDiv.textContent = '';
  errorDiv.classList.add('hidden');
  errorDiv.style.display = 'none';
}