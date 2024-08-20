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
    tripTypeSingle.checked ? returnDateInput.style.display = 'none': returnDateInput.style.display = 'block';
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