// Global variables for data management
let allAdopterData = []; // All adopter records loaded from backend or storage
let filteredAdopterData = []; // Filtered adopter records for display
let itemsPerPage = 10; // Number of items per page for pagination
let currentPage = 1; // Current page in pagination
let currentSearchQuery = ''; // Current search string
let currentFilters = {}; // Current filter criteria

let currentSortColumn = 'adopter.adopterId'; // Default sort column
let currentSortDirection = 'asc'; // Default sort direction

// DOM element references
const tableBody = document.querySelector('.data-table tbody');
const paginationContainer = document.querySelector('.pagination');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const searchBox = document.querySelector('.search-box');

// Sort modal elements
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


const totalUsersCountElement = document.getElementById('totalUsersCount');

// --- Search functionality ---
searchBox.addEventListener('input', function() {
    currentSearchQuery = this.value.toLowerCase().trim(); 
    currentPage = 1;
    applyFiltersAndSearch();
    displayItems(); 
});

// --- Pagination functionality ---
itemsPerPageSelect.addEventListener('change', function() {
    itemsPerPage = parseInt(this.value); 
    currentPage = 1; 
    applyFiltersAndSearch(); 
    displayItems();
});

// --- Button hover effects ---
document.querySelectorAll('.control-btn, .filter-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// --- Filter Modal Functionality ---
const filterModal = document.getElementById('filterModal');
const openFilterBtn = document.getElementById('openFilterBtn');
const closeFilterBtn = document.getElementById('closeFilterBtn');
const applyFilterBtn = document.getElementById('applyFilterBtn');
const clearFilterBtn = document.getElementById('clearFilterBtn');
const filterForm = document.getElementById('filterForm');

filterModal.style.display = 'none'; // Hide filter modal by default

openFilterBtn.addEventListener('click', () => {
    filterModal.style.display = 'flex';
});

closeFilterBtn.addEventListener('click', () => {
    filterModal.style.display = 'none';
});

// Hide modal when clicking outside modal content
window.addEventListener('click', (event) => {
    if (event.target === filterModal) {
        filterModal.style.display = 'none';
    }
});

// Apply filter logic and update table
applyFilterBtn.addEventListener('click', () => {
    currentFilters = {}; 
    const formData = new FormData(filterForm);

    for (let [name, value] of formData.entries()) {
        if (filterForm.elements[name] && filterForm.elements[name].type === 'radio') {
            const checkedRadio = filterForm.querySelector(`input[name="${name}"]:checked`);
            if (checkedRadio) {
                currentFilters[name] = checkedRadio.value.toLowerCase().trim();
            }
        }
        else if (filterForm.elements[name] && filterForm.elements[name].type === 'checkbox') {
            currentFilters[name] = filterForm.elements[name].checked ? value.toLowerCase().trim() : '';
        }
        else {
            currentFilters[name] = value.toLowerCase().trim();
        }
    }

    console.log('Applying Filters:', currentFilters);
    currentPage = 1; 
    applyFiltersAndSearch(); 
    displayItems(); 
    filterModal.style.display = 'none'; 
});

// Clear filter form and reset table
clearFilterBtn.addEventListener('click', () => {
    filterForm.reset(); 
    currentFilters = {}; 
    currentPage = 1; 
    applyFiltersAndSearch(); 
    displayItems(); 
    console.log('Filters Cleared');
});

// --- Sort Modal Functionality ---
sortModal.style.display = 'none';

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

// Hide sort modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === sortModal) {
        sortModal.style.display = 'none';
    }
});

// Apply sort logic and update table
applySortBtn.addEventListener('click', () => {
    currentSortColumn = sortColumnSelect.value;
    currentSortDirection = sortDirectionAsc.checked ? 'asc' : 'desc';

    console.log('Applying Sort:', currentSortColumn, currentSortDirection);
    currentPage = 1; 
    applyFiltersAndSearch(); 
    displayItems(); 
    sortModal.style.display = 'none'; 
});

// Clear sort form and reset table
clearSortSortBtn.addEventListener('click', () => {
    currentSortColumn = 'adopter.adopterId'; 
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

// --- Custom Delete Confirmation Modal Logic --- 
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const deleteModalMessage = document.getElementById('deleteModalMessage');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

deleteConfirmModal.style.display = 'none'; // Hide delete modal by default

let currentAdopterIdToDelete = null; // Track which adopter is being deleted

// Show delete confirmation modal
function showDeleteConfirmModal(adopterId) {
    currentAdopterIdToDelete = adopterId;
    deleteModalMessage.textContent = `Are you sure you want to delete adopter record ID: ${adopterId}? This action cannot be undone.`;
    deleteConfirmModal.style.display = 'flex'; 
}

// Hide delete confirmation modal
function hideDeleteConfirmModal() {
    deleteConfirmModal.style.display = 'none';
    currentAdopterIdToDelete = null; 
}

confirmDeleteBtn.addEventListener('click', async () => {
    if (currentAdopterIdToDelete) {
        try {
            const response = await fetch(`http://localhost:8080/api/adoption-record/full-application/${currentAdopterIdToDelete}/delete-record`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            hideDeleteConfirmModal();
            fetchAndDisplayAdopterData();
            displayMessage(`Adopter record ${currentAdopterIdToDelete} deleted successfully.`, 'info');
        } catch (error) {
            console.error('Error deleting adopter record:', error);
            displayMessage(`Failed to delete adopter record ${currentAdopterIdToDelete}. Error: ${error.message}`, 'error');
            hideDeleteConfirmModal(); 
        }
    }
});

cancelDeleteBtn.addEventListener('click', () => {
    hideDeleteConfirmModal();
});

window.addEventListener('click', (event) => {
    if (event.target === deleteConfirmModal) {
        hideDeleteConfirmModal();
    }
});

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


// --- Utility Function for Nested Property Access ---
/**
 @param {object} obj 
 @param {string} path 
 @returns {any} 
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}


async function fetchAndDisplayAdopterData() {
    try {
        const response = await fetch('http://localhost:8080/api/adoption-record/full-application/all');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allAdopterData = await response.json(); 
        updateDashboardStats(); 
        applyFiltersAndSearch(); 
        displayItems(); 
        updateSortStatusDisplay(); 
    } catch (error) {
        console.error('Error fetching adopter data:', error);
        tableBody.innerHTML = '<tr><td colspan="40">Error loading data. Please try again later.</td></tr>';
        if (paginationContainer) {
             paginationContainer.innerHTML = '';
             paginationContainer.style.display = 'none';
        }
        if (currentSortStatus) { 
            currentSortStatus.style.display = 'none';
        }
        if (totalUsersCountElement) totalUsersCountElement.textContent = 'N/A';
    }
}

function updateDashboardStats() {
    if (totalUsersCountElement) {
        totalUsersCountElement.textContent = allAdopterData.length;
    }
}

function applyFiltersAndSearch() {
    let tempFilteredData = [...allAdopterData]; 

    if (currentSearchQuery) {
        tempFilteredData = tempFilteredData.filter(record => {
            const adopter = record.adopter || {};
            const addressDetails = adopter.addressDetails || {};
            const spouse = adopter.spouse || {};
            const householdAdults = record.householdAdults || [];
            const adopterPets = record.adopterPets || [];

            const searchTerms = [
                adopter.adopterId,
                adopter.adopterName,
                adopter.contactNum,
                adopter.emailAddress,
                adopter.employmentStatus,
                adopter.employerName,
                adopter.workContactNum,
                adopter.workAddress,
                adopter.workingHrs,
                adopter.petAloneHours,
                adopter.petCareTaker,

                addressDetails.adopterAddressId,
                addressDetails.homeAddress,
                addressDetails.city,
                addressDetails.state,
                addressDetails.zipcode,
                addressDetails.homeChildrenNum,
                addressDetails.housingStatus,
                addressDetails.homePetPolicy,
                typeof addressDetails.windowScreens === 'boolean' ? (addressDetails.windowScreens ? 'yes' : 'no') : '',
                addressDetails.petLivingArea,

                spouse.spouseId,
                spouse.spouseName,
                spouse.employerName,
                spouse.workContactNum,
                spouse.workAddress,
                spouse.workingHrs,

                ...(householdAdults.map(adult => [
                    adult.householdadultid,
                    adult.adultname,
                    typeof adult.adultallergy === 'boolean' ? (adult.adultallergy ? 'yes' : 'no') : '',
                    adult.workcontactnum,
                    adult.adultemployer,
                    adult.adultworkaddress
                ]).flat()), 

                ...(adopterPets.map(pet => [
                    pet.petid,
                    pet.petbreed,
                    pet.petage,
                    pet.petspayneuterstatus,
                    pet.petyrsowned,
                    pet.petcurrentstatus,
                    typeof pet.petvaccination === 'boolean' ? (pet.petvaccination ? 'yes' : 'no') : ''
                ]).flat()) 
            ].flat().filter(Boolean).map(String).join(' ').toLowerCase();

            return searchTerms.includes(currentSearchQuery);
        });
    }

    for (const key in currentFilters) {
        const filterValue = currentFilters[key]; 
        if (filterValue) { 
            tempFilteredData = tempFilteredData.filter(record => {
                const adopter = record.adopter || {};
                const addressDetails = adopter.addressDetails || {};
                const householdAdults = record.householdAdults || [];
                const adopterPets = record.adopterPets || [];

                switch (key) {
                    case 'city':
                        return (addressDetails.city || '').toLowerCase().includes(filterValue);
                    case 'state':
                        return (addressDetails.state || '').toLowerCase().includes(filterValue);
                    case 'adopterStatus':
                        return (adopter.employmentStatus || '').toLowerCase() === filterValue;
                    case 'withAdults':
                        return filterValue === 'yes' ? householdAdults.length > 0 : householdAdults.length === 0;
                    case 'allergicAdults':
                        if (filterValue === 'yes') {
                            return householdAdults.some(adult => adult.adultallergy === true);
                        }
                        return true;
                    case 'petCaretaker':
                        return (adopter.petCareTaker || '').toLowerCase() === filterValue;
                    case 'houseStatus':
                        return (addressDetails.housingStatus || '').toLowerCase() === filterValue;
                    case 'allowedDogsPolicy':
                        const policy = (addressDetails.homePetPolicy || '').toLowerCase();
                        if (filterValue === 'yes') {
                            return policy === 'allowed';
                        } else if (filterValue === 'no') {
                            return policy === 'not allowed';
                        }
                        return true;
                    case 'windowScreens':
                        const windowScreensStatus = typeof addressDetails.windowScreens === 'boolean' ? (addressDetails.windowScreens ? 'yes' : 'no') : '';
                        return windowScreensStatus === filterValue;
                    case 'petHousePolicy':
                        return (addressDetails.petLivingArea || '').toLowerCase() === filterValue;
                    case 'vaccinatedPet':
                        return filterValue === 'yes' ? adopterPets.some(pet => pet.petvaccination === true) : true;
                    case 'sterilization':
                        return adopterPets.some(pet => (pet.petspayneuterstatus || '').toLowerCase() === filterValue);
                    case 'petStatus':
                        return adopterPets.some(pet => (pet.petcurrentstatus || '').toLowerCase() === filterValue);
                    default:
                        return true;
                }
            });
        }
    }

    filteredAdopterData = tempFilteredData;
    applySorting(); 
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
            return 0; 
        }
    });
    updateSortStatusDisplay(); 
}


function updateSortStatusDisplay() {
    if (currentSortStatus) {
        if (currentSortColumn && currentSortColumn !== 'adopter.adopterId' || currentSortDirection !== 'asc') { 
            const displayColumnName = sortColumnSelect.options[sortColumnSelect.selectedIndex].text;
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

    populateTable(itemsToDisplay); 

    const totalItems = filteredAdopterData.length;
    const displayCount = itemsToDisplay.length;
    const startRange = totalItems > 0 ? startIndex + 1 : 0;
    const endRange = startRange + displayCount -1 ;

    const paginationTextSpan = document.querySelector('.pagination-text');
    if (paginationTextSpan) {
        paginationTextSpan.textContent = `${startRange} - ${endRange} of ${totalItems}`;
    }
}

function updatePaginationButtons() {
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredAdopterData.length / itemsPerPage);
    paginationContainer.innerHTML = ''; 

    if (totalPages <= 1 && filteredAdopterData.length === 0) {
        paginationContainer.style.display = 'none';
        return;
    } else {
        paginationContainer.style.display = 'flex'; 
    }

    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.classList.add('pagination-btn');
    prevBtn.dataset.action = 'prev';
    prevBtn.disabled = currentPage === 1;
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
    nextBtn.dataset.action = 'next';
    nextBtn.disabled = currentPage === totalPages;
    paginationContainer.appendChild(nextBtn);

    prevBtn.addEventListener('click', function() {
        currentPage = Math.max(1, currentPage - 1);
        displayItems();
        updatePaginationButtons();
    });

    nextBtn.addEventListener('click', function() {
        currentPage = Math.min(totalPages, currentPage + 1);
        displayItems();
        updatePaginationButtons();
    });
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayAdopterData);

function populateTable(adopters) {
    const tableBody = document.querySelector('.data-table tbody');
    tableBody.innerHTML = ''; 

    if (adopters.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="40">No adopter records found.</td></tr>';
        return;
    }

    adopters.forEach(adopterRecord => {
        const adopter = adopterRecord.adopter || {};
        const addressDetails = adopter.addressDetails || {};
        const spouse = adopter.spouse || {};
        let householdAdults = adopterRecord.householdAdults || []; 
        let adopterPets = adopterRecord.adopterPets || []; 

        if (currentFilters['allergicAdults'] === 'yes') {
            householdAdults = householdAdults.filter(adult => adult.adultallergy === true);
        }

        if (currentFilters['vaccinatedPet'] === 'yes') {
            adopterPets = adopterPets.filter(pet => pet.petvaccination === true);
        }

        if (currentFilters['sterilization']) {
            adopterPets = adopterPets.filter(pet => (pet.petspayneuterstatus || '').toLowerCase() === currentFilters['sterilization']);
        }

        if (currentFilters['petStatus']) {
            adopterPets = adopterPets.filter(pet => (pet.petcurrentstatus || '').toLowerCase() === currentFilters['petStatus']);
        }

        const rowspan = Math.max(1, householdAdults.length, adopterPets.length);

        const firstRow = tableBody.insertRow();
        let currentCell;

        currentCell = firstRow.insertCell();
        currentCell.textContent = adopter.adopterId || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = adopter.adopterName || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = adopter.contactNum || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = adopter.emailAddress || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = addressDetails.adopterAddressId || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = addressDetails.homeAddress || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = addressDetails.city || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = addressDetails.state || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = addressDetails.zipcode || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = adopter.employmentStatus || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = adopter.employerName || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = adopter.workContactNum || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = adopter.workAddress || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = adopter.workingHrs || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = spouse.spouseId || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = spouse.spouseName || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = spouse.employerName || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = spouse.workContactNum || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = spouse.workAddress || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = spouse.workingHrs || '';
        currentCell.rowSpan = rowspan;

        const firstAdult = householdAdults.length > 0 ? householdAdults[0] : null;

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstAdult ? (firstAdult.householdadultid || '') : '';

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstAdult ? (firstAdult.adultname || '') : '';

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstAdult ? (typeof firstAdult.adultallergy === 'boolean' ? (firstAdult.adultallergy ? 'Yes' : 'No') : '') : '';

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstAdult ? (firstAdult.workcontactnum || '') : '';

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstAdult ? (firstAdult.adultemployer || '') : '';

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstAdult ? (firstAdult.adultworkaddress || '') : '';

        currentCell = firstRow.insertCell();
        currentCell.textContent = adopter.petAloneHours || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = adopter.petCareTaker || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = addressDetails.homeChildrenNum || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = addressDetails.housingStatus || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = addressDetails.homePetPolicy || '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = typeof addressDetails.windowScreens === 'boolean' ? (addressDetails.windowScreens ? 'Yes' : 'No') : '';
        currentCell.rowSpan = rowspan;

        currentCell = firstRow.insertCell();
        currentCell.textContent = addressDetails.petLivingArea || '';
        currentCell.rowSpan = rowspan;

        const firstPet = adopterPets.length > 0 ? adopterPets[0] : null;

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstPet ? (firstPet.petid || '') : '';

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstPet ? (firstPet.petbreed || '') : '';

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstPet ? (firstPet.petage || '') : '';

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstPet ? (firstPet.petspayneuterstatus || '') : '';

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstPet ? (firstPet.petyrsowned || '') : '';

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstPet ? (firstPet.petcurrentstatus || '') : '';

        currentCell = firstRow.insertCell();
        currentCell.textContent = firstPet ? (typeof firstPet.petvaccination === 'boolean' ? (firstPet.petvaccination ? 'Yes' : 'No') : '') : '';

        currentCell = firstRow.insertCell();
        currentCell.rowSpan = rowspan;
        const rowDeleteButton = document.createElement('button');
        rowDeleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
        rowDeleteButton.classList.add('delete-btn');

        rowDeleteButton.addEventListener('click', () => {
            showDeleteConfirmModal(adopter.adopterId);
        });
        currentCell.appendChild(rowDeleteButton);

        for (let i = 1; i < rowspan; i++) {
            const newRow = tableBody.insertRow();

            const currentAdult = householdAdults[i] || null;
            const currentPet = adopterPets[i] || null;

            newRow.insertCell().textContent = currentAdult ? (currentAdult.householdadultid || '') : '';
            newRow.insertCell().textContent = currentAdult ? (currentAdult.adultname || '') : '';
            newRow.insertCell().textContent = currentAdult ? (typeof currentAdult.adultallergy === 'boolean' ? (currentAdult.adultallergy ? 'Yes' : 'No') : '') : '';
            newRow.insertCell().textContent = currentAdult ? (currentAdult.workcontactnum || '') : '';
            newRow.insertCell().textContent = currentAdult ? (currentAdult.adultemployer || '') : '';
            newRow.insertCell().textContent = currentAdult ? (currentAdult.adultworkaddress || '') : '';


            newRow.insertCell().textContent = currentPet ? (currentPet.petid || '') : '';
            newRow.insertCell().textContent = currentPet ? (currentPet.petbreed || '') : '';
            newRow.insertCell().textContent = currentPet ? (currentPet.petage || '') : '';
            newRow.insertCell().textContent = currentPet ? (currentPet.petspayneuterstatus || '') : '';
            newRow.insertCell().textContent = currentPet ? (currentPet.petyrsowned || '') : '';
            newRow.insertCell().textContent = currentPet ? (currentPet.petcurrentstatus || '') : '';
            newRow.insertCell().textContent = currentPet ? (typeof currentPet.petvaccination === 'boolean' ? (currentPet.petvaccination ? 'Yes' : 'No') : '') : '';
        }
    });
}
