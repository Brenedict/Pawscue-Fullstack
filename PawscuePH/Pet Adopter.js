// Global variables for data management
let allAdopterData = []; // Stores all fetched adopter records (full DTOs)
let filteredAdopterData = []; // Stores data after search and filter are applied
let itemsPerPage = 10; // Number of items to display per page (default)
let currentPage = 1; // Current active page
let currentSearchQuery = ''; // Stores the current search box value
let currentFilters = {}; // Stores the currently applied filters from the modal

// Global variables for sorting
let currentSortColumn = 'adopter.adopterId'; // Default sort column for Pet Adopter
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

// Get references for the filter modal elements
const filterModal = document.getElementById('filterModal');
const openFilterBtn = document.getElementById('openFilterBtn');
const closeFilterBtn = document.getElementById('closeFilterBtn');
const applyFilterBtn = document.getElementById('applyFilterBtn');
const clearFilterBtn = document.getElementById('clearFilterBtn');
const filterForm = document.getElementById('filterForm');

// --- Initial States and Event Listeners ---

// Initialize modal states
filterModal.style.display = 'none';
sortModal.style.display = 'none';

// Search functionality
searchBox.addEventListener('input', function() {
    currentSearchQuery = this.value.toLowerCase().trim();
    currentPage = 1; // Reset to first page on new search
    applyFiltersAndSearch();
    displayItems();
});

// Items per page dropdown functionality
itemsPerPageSelect.addEventListener('change', function() {
    itemsPerPage = parseInt(this.value);
    currentPage = 1; // Reset to first page
    applyFiltersAndSearch();
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

// Filter Modal Functionality
openFilterBtn.addEventListener('click', () => {
    filterModal.style.display = 'flex';
});

closeFilterBtn.addEventListener('click', () => {
    filterModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === filterModal) {
        filterModal.style.display = 'none';
    }
});

applyFilterBtn.addEventListener('click', () => {
    currentFilters = {}; // Reset filters before collecting new ones
    const formData = new FormData(filterForm);

    for (let [name, value] of formData.entries()) {
        if (filterForm.elements[name] && filterForm.elements[name].type === 'checkbox') {
            currentFilters[name] = filterForm.elements[name].checked ? value.toLowerCase().trim() : '';
        } else {
            currentFilters[name] = value.toLowerCase().trim();
        }
    }

    console.log('Applying Filters:', currentFilters);
    currentPage = 1;
    applyFiltersAndSearch();
    displayItems();
    filterModal.style.display = 'none';
});

clearFilterBtn.addEventListener('click', () => {
    filterForm.reset();
    currentFilters = {};
    currentPage = 1;
    applyFiltersAndSearch();
    displayItems();
    console.log('Filters Cleared');
});

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
    applyFiltersAndSearch();
    displayItems();
    sortModal.style.display = 'none';
});

clearSortSortBtn.addEventListener('click', () => {
    currentSortColumn = 'adopter.adopterId'; // Reset to default sort column
    currentSortDirection = 'asc';
    sortForm.reset();
    sortColumnSelect.value = currentSortColumn;
    sortDirectionAsc.checked = true;

    console.log('Sort Cleared');
    currentPage = 1;
    applyFiltersAndSearch();
    displayItems();
    sortModal.style.display = 'none';
});

// Custom message box display (Removed delete functions as requested)
function displayMessage(message, type = 'info') {
    const messageBox = document.getElementById('messageBox'); // Ensure you have a div with id="messageBox" in your HTML
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

// Utility function to get nested property values from an object using a dot-separated path.
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// --- Core Data Fetching, Filtering, and Display Logic ---

async function fetchAndDisplayAdopters() {
    console.log("Attempting to fetch adopter records...");
    try {
        const response = await fetch('http://localhost:8080/api/adoption-record/full-application/all');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
        }

        allAdopterData = await response.json();
        console.log("Adopter records fetched successfully:", allAdopterData);

        applyFiltersAndSearch(); // Apply initial filters and search
        displayItems(); // Display items for the current page
        updateSortStatusDisplay(); // Update sort status on load
    } catch (error) {
        console.error('Error fetching adopter data:', error);
        // Adjusted colspan to 13 (since Actions column is removed)
        dataTableBody.innerHTML = `<tr><td colspan="13" style="text-align: center; color: red;">Error loading adopter data: ${error.message}. Please check server logs and CORS configuration.</td></tr>`;
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
            paginationContainer.style.display = 'none';
        }
        if (currentSortStatus) {
            currentSortStatus.style.display = 'none';
        }
    }
}

function applyFiltersAndSearch() {
    let tempFilteredData = [...allAdopterData];

    // Apply search query filter
    if (currentSearchQuery) {
        tempFilteredData = tempFilteredData.filter(record => {
            const adopter = record.adopter || {};
            const addressDetails = adopter.addressDetails || {};
            const spouse = adopter.spouse || {};

            // Combine all relevant text fields for broad search
            const searchTerms = [
                adopter.adopterId, adopter.adopterName, adopter.contactNum, adopter.emailAddress,
                adopter.employmentStatus, adopter.employerName, adopter.workContactNum,
                adopter.workAddress, adopter.workingHrs, adopter.petAloneHours, adopter.petCareTaker,

                addressDetails.adopterAddressId, spouse.spouseId,
            ].filter(Boolean).map(String).join(' ').toLowerCase();

            return searchTerms.includes(currentSearchQuery);
        });
    }

    // Apply modal filters
    for (const key in currentFilters) {
        const filterValue = currentFilters[key];
        if (filterValue) { // Only apply filter if a value is selected/entered
            tempFilteredData = tempFilteredData.filter(record => {
                const adopter = record.adopter || {};

                switch (key) {
                    case 'petCaretaker':
                        return (adopter.petCareTaker || '').toLowerCase() === filterValue;
                    case 'adopterStatus':
                        return (adopter.employmentStatus || '').toLowerCase() === filterValue;
                    default:
                        return true;
                }
            });
        }
    }

    filteredAdopterData = tempFilteredData;
    applySorting(); // Apply sorting after filtering
    updatePaginationButtons();
}

function applySorting() {
    if (!currentSortColumn) {
        return;
    }

    filteredAdopterData.sort((a, b) => {
        const valA = getNestedValue(a, currentSortColumn);
        const valB = getNestedValue(b, currentSortColumn);

        if (valA === undefined || valA === null) return currentSortDirection === 'asc' ? 1 : -1;
        if (valB === undefined || valB === null) return currentSortDirection === 'asc' ? -1 : 1;

        const isNumericA = !isNaN(parseFloat(valA)) && isFinite(valA);
        const isNumericB = !isNaN(parseFloat(valB)) && isFinite(valB);

        if (isNumericA && isNumericB) {
            return currentSortDirection === 'asc' ? valA - valB : valB - valA;
        } else {
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
        if (currentSortColumn !== 'adopter.adopterId' || currentSortDirection !== 'asc') {
            const selectedOption = Array.from(sortColumnSelect.options).find(option => option.value === currentSortColumn);
            const displayColumnName = selectedOption ? selectedOption.text : currentSortColumn; 
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
    const itemsToDisplay = filteredAdopterData.slice(startIndex, endIndex);

    populateAdopterTable(itemsToDisplay);

    const totalItems = filteredAdopterData.length;
    const displayCount = itemsToDisplay.length;
    const startRange = totalItems > 0 ? startIndex + 1 : 0;
    const endRange = totalItems > 0 ? startRange + displayCount - 1 : 0; // Corrected endRange for empty data

    const paginationTextSpan = document.querySelector('.pagination-text');
    if (paginationTextSpan) {
        paginationTextSpan.textContent = `${startRange} - ${endRange} of ${totalItems}`;
    }
}

function updatePaginationButtons() {
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredAdopterData.length / itemsPerPage);
    paginationContainer.innerHTML = ''; // Clear existing buttons

    if (totalPages <= 1 && filteredAdopterData.length === 0) {
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


function populateAdopterTable(adoptionApplications) {
    dataTableBody.innerHTML = ''; // Clear existing rows

    if (adoptionApplications.length === 0) {
        // Adjusted colspan to 13 (since Actions column is removed)
        dataTableBody.innerHTML = '<tr><td colspan="13">No adopter records found.</td></tr>';
        return;
    }

    adoptionApplications.forEach(applicationDTO => {
        const row = dataTableBody.insertRow();
        const adopter = applicationDTO.adopter || {};
        const addressDetails = adopter.addressDetails || {};
        const spouse = adopter.spouse || {};

        row.insertCell().textContent = adopter.adopterId || '';
        row.insertCell().textContent = adopter.adopterName || '';
        row.insertCell().textContent = adopter.contactNum || '';
        row.insertCell().textContent = adopter.emailAddress || '';
        row.insertCell().textContent = addressDetails.adopterAddressId || '';
        row.insertCell().textContent = spouse.spouseId || '';
        row.insertCell().textContent = adopter.employmentStatus || '';
        row.insertCell().textContent = adopter.employerName || '';
        row.insertCell().textContent = adopter.workContactNum || '';
        row.insertCell().textContent = adopter.workAddress || '';
        row.insertCell().textContent = adopter.workingHrs || '';
        row.insertCell().textContent = adopter.petAloneHours || '';
        row.insertCell().textContent = adopter.petCareTaker || '';
    });
}

// Call the function to fetch and display data when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayAdopters);

// Navigation functionality (existing, kept as is)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
        }
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});
