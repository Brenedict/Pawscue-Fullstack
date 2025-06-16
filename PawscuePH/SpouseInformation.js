// Global variables for data management
let allSpouseData = []; // Stores all fetched spouse information records
let filteredSpouseData = []; // Stores data after search, filter, and sort are applied
let itemsPerPage = 10; // Number of items to display per page (default)
let currentPage = 1; // Current active page
let currentSearchQuery = ''; // Stores the current search box value

// Global variables for sorting
let currentSortColumn = 'spouseId'; // Default sort column for Spouse Information
let currentSortDirection = 'asc'; // Default sort direction ('asc' or 'desc')

// Get references to key DOM elements
const dataTableBody = document.querySelector('.data-table tbody');
const paginationContainer = document.querySelector('.pagination');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const searchBox = document.querySelector('.search-box');

// Get references for the sort modal elements
const sortModal = document.getElementById('sortModal');
const openSortBtn = document.querySelector('.sort-btn');
const closeSortBtn = document.getElementById('closeSortBtn');
const applySortBtn = document.getElementById('applySortBtn');
const clearSortSortBtn = document.getElementById('clearSortSortBtn');
const sortForm = document.getElementById('sortForm');
const sortColumnSelect = document.getElementById('sortColumn');
const sortDirectionAsc = document.getElementById('sortDirectionAsc');
const sortDirectionDesc = document.getElementById('sortDirectionDesc');
const currentSortStatus = document.getElementById('currentSortStatus');

// Removed filter modal references and functionality as per request
// const filterModal = document.getElementById('filterModal');
// const openFilterBtn = document.getElementById('openFilterBtn');
// const closeFilterBtn = document.getElementById('closeFilterBtn');
// const applyFilterBtn = document.getElementById('applyFilterBtn');
// const clearFilterBtn = document.getElementById('clearFilterBtn');
// const filterForm = document.getElementById('filterForm');

// --- Initial States and Event Listeners ---

// Initialize modal states
// Removed filter modal initialization as per request
sortModal.style.display = 'none';

// Search functionality
searchBox.addEventListener('input', function() {
    currentSearchQuery = this.value.toLowerCase().trim();
    currentPage = 1; // Reset to first page on new search
    applySearchAndSort(); // Renamed function
    displayItems();
});

// Items per page dropdown functionality
itemsPerPageSelect.addEventListener('change', function() {
    itemsPerPage = parseInt(this.value);
    currentPage = 1; // Reset to first page
    applySearchAndSort(); // Renamed function
    displayItems();
});

// Button hover effects (existing logic)
document.querySelectorAll('.control-btn, .action-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Removed Filter Modal Functionality (open, close, apply, clear) as per request
// openFilterBtn.addEventListener('click', () => { filterModal.style.display = 'flex'; });
// closeFilterBtn.addEventListener('click', () => { filterModal.style.display = 'none'; });
// window.addEventListener('click', (event) => { if (event.target === filterModal) { filterModal.style.display = 'none'; } });
// applyFilterBtn.addEventListener('click', () => { /* ... filter logic removed ... */ });
// clearFilterBtn.addEventListener('click', () => { /* ... filter logic removed ... */ });

// Sort Modal Functionality
openSortBtn.addEventListener('click', () => {
    sortColumnSelect.value = currentSortColumn;
    if (currentSortDirection === 'asc') {
        sortDirectionAsc.checked = true;
    } else {
        sortDirectionDesc.checked = true;
    }
    sortModal.style.display = 'flex';
});

closeSortBtn.addEventListener('click', () => {
    sortModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === sortModal) {
        sortModal.style.display = 'none';
    }
});

applySortBtn.addEventListener('click', () => {
    currentSortColumn = sortColumnSelect.value;
    currentSortDirection = sortDirectionAsc.checked ? 'asc' : 'desc';

    console.log('Applying Sort:', currentSortColumn, currentSortDirection);
    currentPage = 1;
    applySearchAndSort(); // Renamed function
    displayItems();
    sortModal.style.display = 'none';
});

clearSortSortBtn.addEventListener('click', () => {
    currentSortColumn = 'spouseId'; // Reset to default sort column for Spouse Information
    currentSortDirection = 'asc';
    sortForm.reset();
    sortColumnSelect.value = currentSortColumn;
    sortDirectionAsc.checked = true;

    console.log('Sort Cleared');
    currentPage = 1;
    applySearchAndSort(); // Renamed function
    displayItems();
    sortModal.style.display = 'none';
});

// Custom message box display
function displayMessage(message, type = 'info') {
    const messageBox = document.getElementById('messageBox');
    if (!messageBox) {
        console.error('Message box element with ID "messageBox" not found!');
        return;
    }
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';

    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 5000);
}

// Utility function to get property values from an object (for flat objects)
function getPropertyValue(obj, key) {
    return obj[key];
}


// --- Core Data Fetching, Searching, and Display Logic ---

async function fetchAndDisplaySpouseInformation() {
    console.log("Attempting to fetch spouse information...");
    try {
        const response = await fetch('http://localhost:8080/api/adoption-record/spouse');

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
        }

        allSpouseData = await response.json();
        console.log("Spouse information data fetched successfully:", allSpouseData);

        applySearchAndSort(); // Renamed function call
        displayItems(); // Display items for the current page
        updateSortStatusDisplay(); // Update sort status on load
    } catch (error) {
        console.error('Error fetching spouse information data:', error);
        // colspan for 7 columns as per your table header
        dataTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Error loading spouse information: ${error.message}. Please check server logs and CORS configuration.</td></tr>`;
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
            paginationContainer.style.display = 'none';
        }
        if (currentSortStatus) {
            currentSortStatus.style.display = 'none';
        }
    }
}

/**
 * Applies search and sort to allSpouseData and updates filteredSpouseData.
 * Filter logic has been removed.
 */
function applySearchAndSort() {
    let tempFilteredData = [...allSpouseData]; // Start with all data

    // Apply search query filter
    if (currentSearchQuery) {
        tempFilteredData = tempFilteredData.filter(spouse => {
            // Combine all relevant text fields for broad search
            const searchTerms = [
                spouse.spouseId,
                spouse.spouseName,
                spouse.employerName,
                spouse.workContactNum,
                spouse.workAddress,
                spouse.workingHrs,
                spouse.adopterId
            ].filter(Boolean).map(String).join(' ').toLowerCase();

            return searchTerms.includes(currentSearchQuery);
        });
    }

    // Removed modal filter application logic as per request
    // for (const key in currentFilters) { /* ... */ }

    filteredSpouseData = tempFilteredData; // Update data after search
    applySorting(); // Apply sorting after searching
    updatePaginationButtons();
}

function applySorting() {
    if (!currentSortColumn) {
        return;
    }

    filteredSpouseData.sort((a, b) => {
        const valA = getPropertyValue(a, currentSortColumn);
        const valB = getPropertyValue(b, currentSortColumn);

        // Handle null/undefined values
        if (valA === undefined || valA === null) return currentSortDirection === 'asc' ? 1 : -1;
        if (valB === undefined || valB === null) return currentSortDirection === 'asc' ? -1 : 1;

        // Numeric comparison for numbers, string comparison for others
        const isNumericA = !isNaN(parseFloat(valA)) && isFinite(valA);
        const isNumericB = !isNaN(parseFloat(valB)) && isFinite(valB);

        if (isNumericA && isNumericB) {
            return currentSortDirection === 'asc' ? valA - valB : valB - valA;
        } else {
            // Fallback to string comparison for non-numeric or mixed types
            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();

            if (strA < strB) {
                return currentSortDirection === 'asc' ? -1 : 1;
            }
            if (strA > strB) {
                return currentSortDirection === 'asc' ? 1 : -1;
            }
            return 0; // Values are equal
        }
    });
    updateSortStatusDisplay();
}

function updateSortStatusDisplay() {
    if (currentSortStatus) {
        // Only show status if a column other than the default 'spouseId' is selected or direction is not 'asc'
        if (currentSortColumn !== 'spouseId' || currentSortDirection !== 'asc') {
            const selectedOption = Array.from(sortColumnSelect.options).find(option => option.value === currentSortColumn);
            const displayColumnName = selectedOption ? selectedOption.text : currentSortColumn; // Fallback to value if text not found
            const displayDirection = currentSortDirection === 'asc' ? 'Ascending' : 'Descending';
            currentSortStatus.textContent = `Sorted by: ${displayColumnName} (${displayDirection})`;
            currentSortStatus.style.display = 'block';
        } else {
            currentSortStatus.textContent = '';
            currentSortStatus.style.display = 'none';
        }
    }
}

function displayItems() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = filteredSpouseData.slice(startIndex, endIndex);

    populateSpouseInformationTable(itemsToDisplay);

    const totalItems = filteredSpouseData.length;
    const displayCount = itemsToDisplay.length;
    const startRange = totalItems > 0 ? startIndex + 1 : 0;
    const endRange = totalItems > 0 ? startRange + displayCount - 1 : 0;

    const paginationTextSpan = document.querySelector('.pagination-text');
    if (paginationTextSpan) {
        paginationTextSpan.textContent = `${startRange} - ${endRange} of ${totalItems}`;
    }
}

function updatePaginationButtons() {
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredSpouseData.length / itemsPerPage);
    paginationContainer.innerHTML = ''; // Clear existing buttons

    if (totalPages <= 1 && filteredSpouseData.length === 0) {
        paginationContainer.style.display = 'none';
        return;
    } else {
        paginationContainer.style.display = 'flex';
    }

    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.classList.add('pagination-btn');
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        currentPage = Math.max(1, currentPage - 1);
        displayItems();
        updatePaginationButtons();
    });
    paginationContainer.appendChild(prevBtn);

    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons && totalPages > maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.add('pagination-btn');
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.addEventListener('click', function() {
            currentPage = parseInt(this.textContent);
            displayItems();
            updatePaginationButtons();
        });
        paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.classList.add('pagination-btn');
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        currentPage = Math.min(totalPages, currentPage + 1);
        displayItems();
        updatePaginationButtons();
    });
    paginationContainer.appendChild(nextBtn);
}


function populateSpouseInformationTable(spouseDetails) {
    dataTableBody.innerHTML = ''; // Clear existing rows

    if (!spouseDetails || spouseDetails.length === 0) {
        // Use 7 columns for the colspan
        dataTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No spouse information records found.</td></tr>';
        return;
    }

    spouseDetails.forEach(spouse => {
        const row = dataTableBody.insertRow();

        // Ensure property names match your backend's JSON response exactly
        row.insertCell().textContent = spouse.spouseId || '';
        row.insertCell().textContent = spouse.spouseName || '';
        row.insertCell().textContent = spouse.employerName || '';
        row.insertCell().textContent = spouse.workContactNum || '';
        row.insertCell().textContent = spouse.workAddress || '';
        row.insertCell().textContent = spouse.workingHrs || '';
        row.insertCell().textContent = spouse.adopterId || '';
    });
}

// Call the function to fetch and display data when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplaySpouseInformation);

// Navigation functionality (re-used from Admin.js/HouseInformation.js)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
        }
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});
