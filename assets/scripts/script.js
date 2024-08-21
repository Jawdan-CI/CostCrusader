// ---------------------FRONT PAGE FUNCTIONALITY
const tripTypeSingle = document.getElementById('trip-type-single');
const tripTypeRound = document.getElementById('trip-type-round');
const returnDateInput = document.getElementById('return-date-input');


const tripForm = document.getElementById('trip-form')
const mainForm = document.getElementById('toggleForm')
const budgetBtn = document.getElementById('yes-budget-btn');
const noBudgetBtn = document.getElementById('no-budget-btn');
const budgetDisplay = document.getElementById('budget-display');
const budgetText = document.getElementById('budget-text');

// Function to show or hide the budget form 
function toggleBudgetForm(haveBudget) {
    tripForm.classList.add('hidden');
    mainForm.classList.remove('hidden');

    if (haveBudget) {
        const budgetInput = document.getElementById('budget');
        const budgetValue = parseFloat(budgetInput.value);

        if (!isNaN(budgetValue) && budgetValue > 0) {
            budgetText.textContent = `Budget: £${budgetValue.toFixed(2)}`;
        } else {
            budgetText.textContent = 'Please enter a valid budget.';
        }
    } else {
        budgetText.textContent = 'Travel Cost Calculator';
    }
}

budgetBtn.addEventListener('click', () => toggleBudgetForm(true));
noBudgetBtn.addEventListener('click', () => toggleBudgetForm(false));


/**
 * Checks if round trip is checked and if true, shows the return date input box.
 */
const tripTypeShowReturn = () => {
    tripTypeSingle.checked ? returnDateInput.style.display = 'none' : returnDateInput.style.display = 'block';
}

tripTypeSingle.addEventListener('change', tripTypeShowReturn);
tripTypeRound.addEventListener('change', tripTypeShowReturn);

tripTypeShowReturn();

/**
 * Function to handle the change in travel mode (flight, train, car) 
 */
function handleTravelModeChange() {

}
/**
 * Function to calculate the fuel cost (if car travel mode is selected)
 */
function calculateFuelCost() {

}
/**
 * Function to calculate the total trip cost
 */
function calculateTripCost() {

}

/**
 * Function to display the results
 */
function displayResults(totalCost) {

}

document.addEventListener('DOMContentLoaded', () => {

    const fromSelectButton = document.getElementById('fromSelect');
    const toSelectButton = document.getElementById('toSelect');
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const fromMap = document.querySelector('.gmaps-container gmp-map');
    const toMap = document.querySelectorAll('.gmaps-container gmp-map')[1];

    const googleMapsApiKey = 'AIzaSyA8E7zGJjH1l_l95SNHh14d9shdWxzuYxg';

    // Function to update the map center based on the address in the input
    function updateMapFromAddress(addressInput, map) {
        const address = addressInput.value;

        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapsApiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    const location = data.results[0].geometry.location;
                    map.center = { lat: location.lat, lng: location.lng };
                    map.zoom = 5;
                } else {
                    console.error('Geocode was not successful for the following reason: ' + data.status);
                }
            })
            .catch(error => {
                console.error('Error fetching geocoding data:', error);
            });
    }

    fromInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent page refresh on Enter
            updateMapFromAddress(fromInput, fromMap);
        }
    });


    toInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            updateMapFromAddress(toInput, toMap);
        }
    });

    fromSelectButton.addEventListener('click', (event) => {
        event.preventDefault();
        updateMapFromAddress(fromInput, fromMap);
    });

    toSelectButton.addEventListener('click', (event) => {
        event.preventDefault(); //
        updateMapFromAddress(toInput, toMap);
    });
});