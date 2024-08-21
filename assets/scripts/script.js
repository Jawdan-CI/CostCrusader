const tripTypeSingle = document.getElementById('trip-type-single');
const tripTypeRound = document.getElementById('trip-type-round');
const returnDateInput = document.getElementById('return-date-input');

const tripForm = document.getElementById('trip-form')
const mainForm = document.getElementById('toggleForm')
const resultsDiv = document.getElementById('results');
const budgetBtn = document.getElementById('yes-budget-btn');
const noBudgetBtn = document.getElementById('no-budget-btn');
const budgetDisplay = document.getElementById('budget-display');
const budgetText = document.getElementById('budget-text');

const fromSelectButton = document.getElementById('fromSelect');
const toSelectButton = document.getElementById('toSelect');
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');
const fromMap = document.querySelector('.gmaps-container gmp-map');
const toMap = document.querySelectorAll('.gmaps-container gmp-map')[1];

let fromLocation = null;
let toLocation = null;

const travelersInput = document.getElementById('travelers');
const travelModeFlight = document.getElementById('travel-mode-flight');
const travelModeTrain = document.getElementById('travel-mode-train');
const travelModeCar = document.getElementById('travel-mode-car');

const googleMapsApiKey = 'AIzaSyA8E7zGJjH1l_l95SNHh14d9shdWxzuYxg';

document.addEventListener('DOMContentLoaded', () => {

    // ---------------------FRONT PAGE FUNCTIONALITY

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

    // --------------------------------FUNCTIONALITY AND LOGIC

    // Calculating the Distance between the two destinations and getting an estimate price.
    function calculateDistanceAndEstimateCost() {
        const origin = fromMap.center;
        const destination = toMap.center;

        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL

        }, (response, status) => {
            if (status === 'OK') {
                const distance = response.rows[0].elements[0].distance.value;
                console.log('Estimated Distance (miles):', distance);

                // Trigger cost estimations for flight and train if they are selected
                if (travelModeFlight.checked) {
                    handleFlightSelection(distance);
                } else if (travelModeTrain.checked) {
                    handleTrainSelection(distance);
                }
                // You can add similar logic for other travel modes if needed
            } else {
                console.error('Error fetching distance:', status);
                // Handle the error appropriately (e.g., display an error message to the user)
            }
        });
    }

    // TRAVEL COST FUNCTIONS BASED ON TRASNPORT
    function handleFlightSelection(distance) {
        if (travelModeFlight.checked) {
            const origin = fromInput.value;
            const destination = toInput.value;
            const numTravelers = parseInt(travelersInput.value) || 1;

            if (!distance && fromMap.center && toMap.center) {
                calculateDistanceAndEstimateCost();
                return; // Wait for distance calculation
            }

            const estimatedCostPerMile = 0.15;
            const estimatedFlightCost = distance * numTravelers * estimatedCostPerMile;

            resultsDiv.innerHTML = `<h3>Estimated Flight Cost</h3><p><strong>From:</strong> ${origin}</p><p><strong>To:</strong> ${destination}</p><p><strong>Estimated Cost:</strong> £${estimatedFlightCost.toFixed(2)}</p>`;
        }
    }

    function handleTrainSelection(distance) {
        if (travelModeTrain.checked) {
            const origin = fromInput.value;
            const destination = toInput.value;
            const numTravelers = parseInt(travelersInput.value) || 1;

            if (!distance && fromMap.center && toMap.center) {
                calculateDistanceAndEstimateCost();
                return; // Wait for distance calculation
            }

            const estimatedCostPerMile = 0.08;
            const estimatedTrainCost = distance * numTravelers * estimatedCostPerMile;

            resultsDiv.innerHTML = `
            <h3>Estimated Train Cost</h3>
            <p><strong>From:</strong> ${origin}</p>
            <p><strong>To:</strong> ${destination}</p>
            <p><strong>Estimated Cost:</strong> £${estimatedTrainCost.toFixed(2)}</p>
          `;
        }
    }

    function handleCarSelection() {
        if (travelModeCar.checked) {
            const fuelCalculator = document.getElementById('fuel-calculator');
            fuelCalculator.style.display = 'block';

            // Get references to the input fields within the fuel calculator
            const distanceInput = document.getElementById('distance');
            const mpgInput = document.getElementById('mpg');
            const fuelPriceInput = document.getElementById('fuel-price');
            const fuelCostResult = document.getElementById('fuel-cost-result');

            // Add event listeners to the input fields to trigger calculation on change
            distanceInput.addEventListener('input', calculateFuelCost);
            mpgInput.addEventListener('input', calculateFuelCost);
            fuelPriceInput.addEventListener('input', calculateFuelCost);

            // Function to calculate and display fuel cost
            function calculateFuelCost() {
                const distance = parseFloat(distanceInput.value) || 0;
                const mpg = parseFloat(mpgInput.value) || 0;
                const fuelPrice = parseFloat(fuelPriceInput.value) || 0;

                if (mpg === 0) {
                    fuelCostResult.textContent = 'Please enter a valid MPG.';
                    return;
                }

                const gallonsNeeded = distance / mpg;
                const litresNeeded = gallonsNeeded * 3.78541; // Convert gallons to litres
                const totalFuelCost = litresNeeded * fuelPrice;

                fuelCostResult.textContent = `Estimated Fuel Cost: £${totalFuelCost.toFixed(2)}`;
            }
        }
    }


    travelModeFlight.addEventListener('change', handleFlightSelection);
    travelModeTrain.addEventListener('change', handleTrainSelection);
    travelModeCar.addEventListener('change', handleCarSelection);



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

    // Function to update the map center based on the address in the input
    function updateMapFromAddress(addressInput, map) {
        const address = addressInput.value;
        console.log(address);

        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapsApiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'OK') {
                    const location = data.results[0].geometry.location;
                    map.center = { lat: location.lat, lng: location.lng };
                    map.zoom = 5;

                    if (map === fromMap) {
                        fromLocation = location;
                    } else if (map === toMap) {
                        toLocation = location;
                    }
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