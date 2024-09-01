
//Trip Type Select
const tripTypeSingle = document.getElementById('trip-type-single');
const tripTypeRound = document.getElementById('trip-type-round');
const returnDateInput = document.getElementById('return-date-input');

// Budget Form / Trip Form Switch
const tripForm = document.getElementById('trip-form')
const mainForm = document.getElementById('toggleForm')
const resultsDiv = document.getElementById('results');
const budgetBtn = document.getElementById('yes-budget-btn');
const noBudgetBtn = document.getElementById('no-budget-btn');
const budgetDisplay = document.getElementById('budget-display');
const budgetText = document.getElementById('budget-text');

// Destinations GMAPs and AutoComplete

//const fromSelectButton = document.getElementById('fromSelect');
//const toSelectButton = document.getElementById('toSelect');

let fromMap, toMap;
var map;
var service;
var infowindow;

//Travel Mode Selection
const travelersInput = document.getElementById('travelers');
const travelModeFlight = document.getElementById('travel-mode-flight');
const travelModeTrain = document.getElementById('travel-mode-train');
const travelModeCar = document.getElementById('travel-mode-car');

let address;

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
    async function initMap() {
        // Locations
        const fromPosition = { lat: -25.344, lng: 131.031 }; // Uluru
        const toPosition = { lat: 51.5074, lng: 0.1278 }; // London (example)
      
        // Request needed libraries.
        //@ts-ignore
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      
        // The fromMap, centered at fromPosition
        fromMap = new Map(document.getElementById("fromMap"), {
          zoom: 4,
          center: fromPosition,
          mapId: "DEMO_MAP_ID",
        });
      
        // The toMap, centered at toPosition
        toMap = new Map(document.getElementById("toMap"), {
          zoom: 4,
          center: toPosition,
          mapId: "DEMO_MAP_ID",
        });
      
        // Markers
        let fromMarker = new AdvancedMarkerElement({
          map: fromMap,
          position: fromPosition,
          title: "Uluru",
        });
      
        let toMarker = new AdvancedMarkerElement({
          map: toMap,
          position: toPosition,
          title: "London",
        });
      
        //Request AutoComplete
        const { Autocomplete } = await google.maps.importLibrary("places");
      
        //retrieve inputs
        const fromSearchField = document.getElementById("fromSearchField");
        const toSearchField = document.getElementById("toSearchField");
      
        const fromAutocomplete = new Autocomplete(fromSearchField);
        const toAutocomplete = new Autocomplete(toSearchField);
      
        fromAutocomplete.addListener("place_changed", () => {
          const place = fromAutocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            fromMap.setCenter(place.geometry.location);
            fromMap.setZoom(12); // Adjust zoom as needed
      
            fromMarker.position = place.geometry.location;
          }
        });
      
        toAutocomplete.addListener("place_changed", () => {
          const place = toAutocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            toMap.setCenter(place.geometry.location);
            toMap.setZoom(12); // Adjust zoom as needed
      
            toMarker.position = place.geometry.location;
          }
        });
      
      }
      
      initMap();

    mainForm.addEventListener('submit', (event) => {
        event.preventDefault();
    });


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

console.log(address);