// ---------------------FRONT PAGE FUNCTIONALITY
const tripTypeSingle = document.getElementById('trip-type-single');
const tripTypeRound = document.getElementById('trip-type-round');
const returnDateInput = document.getElementById('return-date-input');


/**
 * Checks if round trip is checked and if true, shows the return date input box.
 */
const tripTypeShowReturn = () => {
    tripTypeSingle.checked ? returnDateInput.style.display = 'none': returnDateInput.style.display = 'block';
}

tripTypeSingle.addEventListener('change', tripTypeShowReturn);
tripTypeRound.addEventListener('change', tripTypeShowReturn);

tripTypeShowReturn();