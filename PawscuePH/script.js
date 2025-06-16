document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('adoptionForm'); 
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmSubmissionButton = document.getElementById('confirmSubmission');
    const cancelSubmissionButton = document.getElementById('cancelSubmission');
    const closeModalButton = confirmationModal.querySelector('.close-button');
    const formCloseButton = document.querySelector('.form-close-button');
    const applyNowBtn = document.getElementById('applyNowBtn');
    const heroSection = document.getElementById('heroSection');
    const howToApplySection = document.getElementById('howToApplySection');
    const applicationFormContainer = document.getElementById('applicationFormContainer');

    const signInLink = document.getElementById('signInLink');
    const logInLink = document.getElementById('logInLink');
    const logoutContainer = document.getElementById('logoutContainer');
    const logoutBtn = document.getElementById('logoutBtn');

    const editSubmissionButton = document.getElementById('editSubmissionButton');
    const deleteSubmissionButton = document.getElementById('deleteSubmissionButton');
    const saveChangesButton = document.getElementById('saveChangesButton');
    const submitApplicationButton = document.getElementById('submitApplicationButton'); 

    const deleteWarningModal = document.getElementById('deleteWarningModal');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');

    const updateConfirmationModal = document.getElementById('updateConfirmationModal'); 
    const confirmUpdateButton = document.getElementById('confirmUpdateButton');
    const cancelUpdateButton = document.getElementById('cancelUpdateButton');

    let isFormSubmitting = false;
    const applicationDataKey = 'lastApplicationData'; // Key for localStorage

    function checkLoginStatus() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    function setLoginStatus(status) {
        localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
        updateNavigationVisibility(); 
    }

    function setFormSubmittedStatus(status) {
        localStorage.setItem('applicationSubmitted', status ? 'true' : 'false');
    }

    // function getFormSubmittedStatus() {
    //     return localStorage.getItem('applicationSubmitted') === 'true';
    // }

    function getFormSubmittedStatus() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        return user && user.adopterId != null;
    }

    
    function showDefaultSections() {
        heroSection.classList.remove('hidden');
        howToApplySection.classList.remove('hidden');
        applicationFormContainer.classList.add('hidden');
        applyNowBtn.textContent = 'Apply Now';
        if (editSubmissionButton) editSubmissionButton.classList.add('hidden');
        if (deleteSubmissionButton) deleteSubmissionButton.classList.add('hidden');
        if (saveChangesButton) saveChangesButton.classList.add('hidden');
        if (submitApplicationButton) submitApplicationButton.classList.remove('hidden'); 
        form.reset(); 
        form.querySelectorAll('input, select, textarea').forEach(element => {
            element.disabled = false; 
        });
    }

    function initializeAdoptNowPage() {
        
        console.log('Running initializeAdoptNowPage...');
        console.log('currentUser:', localStorage.getItem('currentUser'));

        if (getFormSubmittedStatus()) {
            console.log('Detected form already submitted');
        
        } else {
            console.log('No adopterId found, showing form.');
        
        }

        if (getFormSubmittedStatus()) {
            applyNowBtn.textContent = 'View Form';
            heroSection.classList.remove('hidden'); 
            howToApplySection.classList.remove('hidden');
            applicationFormContainer.classList.add('hidden'); 
            if (formCloseButton) {
                formCloseButton.classList.add('hidden');
            }
        } else {
            applicationFormContainer.classList.add('hidden');
            heroSection.classList.remove('hidden'); 
            howToApplySection.classList.remove('hidden');
            if (formCloseButton) {
                formCloseButton.classList.remove('hidden');
            }
        }
        updateNavigationVisibility(); 
    }

    function updateNavigationVisibility() {
        if (checkLoginStatus()) {
            if (signInLink) signInLink.classList.add('hidden');
            if (logInLink) logInLink.classList.add('hidden');
            if (logoutContainer) logoutContainer.classList.remove('hidden');
        } else {
            if (signInLink) signInLink.classList.remove('hidden');
            if (logInLink) logInLink.classList.remove('hidden');
            if (logoutContainer) logoutContainer.classList.add('hidden');
        }
    }

    function collectFormData() {
        const hasSpouse = document.querySelector('input[name="hasSpouse"]:checked')?.value === "Yes";

        // --- Adult Household Members ---
        const adults = [];
        const allAdultEntries = document.querySelectorAll('#adultInformationSection .adult-info-entry');
        console.log("ALL ADULT ENTRIE: ", allAdultEntries);
        allAdultEntries.forEach(entry => {
            const adult = {
                householdadultid: null,
                adopterid: null,
                adultname: entry.querySelector('.adult-name')?.value || '',
                adultemployer: entry.querySelector('.adult-employer-name')?.value || '',
                workcontactnum: entry.querySelector('.adult-work-contact-number')?.value || '',
                adultworkaddress: entry.querySelector('.adult-company-address')?.value || '',
                adultallergy: false
            };

            const allergicRadio = entry.querySelector('.adult-allergic:checked');
            adult.adultallergy = allergicRadio ? allergicRadio.value === "true" : false;

            // Push only if at least one of the main fields is filled
            if (adult.adultname || adult.adultemployer || adult.workcontactnum || adult.adultworkaddress) {
                // Avoid duplicates (by comparing all values)
                const isDuplicate = adults.some(a =>
                    a.adultname === adult.adultname &&
                    a.adultemployer === adult.adultemployer &&
                    a.workcontactnum === adult.workcontactnum &&
                    a.adultworkaddress === adult.adultworkaddress
                );
                if (!isDuplicate) {
                    adults.push(adult);
                }
                console.log(adults)
            }
        });

        // --- Adopter Pets ---
        const adopterPets = [];
        const ownsPets = document.querySelector('input[name="ownedDog"]:checked')?.value === "Yes";

        if (ownsPets) {
            // Include the static first pet ()
            const baseIndex = 0;
            const staticPet = {
                adopterid: null,
                petid: null,
                petbreed: document.getElementById(`petBreed_${baseIndex}`)?.value || '',
                petage: parseInt(document.getElementById(`petAge_${baseIndex}`)?.value || 0, 10),
                petspayneuterstatus: document.querySelector(`input[name="spayNeuter_${baseIndex}"]:checked`)?.value || 'None',
                petyrsowned: parseInt(document.getElementById(`yearsOwned_${baseIndex}`)?.value || 0, 10),
                petcurrentstatus: document.querySelector(`input[name="petStatus_${baseIndex}"]:checked`)?.value || '',
                petvaccination: document.querySelector(`input[name="vaccinated_${baseIndex}"]:checked`)?.value === "true"
            };
            adopterPets.push(staticPet);

            // Dynamic pets
            const dynamicPetEntries = document.querySelectorAll('#additionalPetsContainer .pet-info-entry');
            dynamicPetEntries.forEach((entry, idx) => {
                const petIndex = idx + 1;
                const pet = {
                    adopterid: null,
                    petid: null,
                    petbreed: document.getElementById(`petBreed_${petIndex}`)?.value || '',
                    petage: parseInt(document.getElementById(`petAge_${petIndex}`)?.value || 0, 10),
                    petspayneuterstatus: document.querySelector(`input[name="spayNeuter_${petIndex}"]:checked`)?.value || '',
                    petyrsowned: parseInt(document.getElementById(`yearsOwned_${petIndex}`)?.value || 0, 10),
                    petcurrentstatus: document.querySelector(`input[name="petStatus_${petIndex}"]:checked`)?.value || '',
                    petvaccination: document.querySelector(`input[name="vaccinated_${petIndex}"]:checked`)?.value === "true"
                };
                adopterPets.push(pet);
            });
        }

        // --- Final Return Object ---
        return {
            adopter: {
                adopterId: null,
                adopterName: document.getElementById("adopterName").value,
                contactNum: document.getElementById("contactNumber").value,
                emailAddress: document.getElementById("emailAddress").value,
                employmentStatus: document.querySelector('input[name="employmentStatus"]:checked')?.value || "Working",
                workingHrs: parseInt(document.getElementById("workingHours").value, 10) || 0,
                workContactNum: document.getElementById("workContactNumber").value || null,
                employerName: document.getElementById("employerName").value || null,
                workAddress: document.getElementById("companyAddress").value || null,
                petAloneHours: parseInt(document.getElementById("maxHoursAlone").value, 10) || 0,
                petCareTaker: document.querySelector('input[name="caretaker"]:checked')?.value || "Self",

                addressDetails: {
                    adopterAddressId: null,
                    zipcode: document.getElementById("zipcode").value,
                    homeAddress: document.getElementById("homeAddress").value,
                    city: document.getElementById("city").value,
                    state: document.getElementById("state").value,
                    housingStatus: document.querySelector('input[name="doYou"]:checked')?.value || "Rent",
                    homePetPolicy: document.querySelector('input[name="landlordPets"]:checked')?.value || "ALLOWED",
                    windowScreens: document.querySelector('input[name="hasScreens"]:checked')?.value === "true",
                    homeChildrenNum: parseInt(document.getElementById("numChildren").value, 10) || 0,
                    petLivingArea: document.querySelector('input[name="petKept"]:checked')?.value || "Indoors"
                },

                spouse: hasSpouse ? {
                    spouseId: null,
                    adopterId: null,
                    spouseName: document.getElementById("spouseName").value || "",
                    workingHrs: parseInt(document.getElementById("spouseWorkingHours").value, 10) || 0,
                    workContactNum: document.getElementById("spouseWorkContactNumber").value || null,
                    employerName: document.getElementById("spouseEmployerName").value || null,
                    workAddress: document.getElementById("spouseCompanyAddress").value || null
                } : null,
            },

            householdAdults: adults,
            adopterPets: adopterPets
        };
    }

    function addHouseholdAdult() {
        const container = document.getElementById('additionalAdultsContainer');
        const index = container.children.length + 1; // Start at 1 since 0 is static
        console.log(index)
        const entry = document.createElement("div");
        entry.className = "adult-info-entry";
        entry.innerHTML = `
            <div class="form-group full-width">
                <label for="adultName_${index}">Name<span class="required">*</span></label>
                <input type="text" id="adultName_${index}" class="adult-name" placeholder="First Name MI. Last Name" required>
            </div>
            <div class="form-group full-width">
                <label>Working?<span class="required">*</span></label>
                <div class="radio-group">
                    <input type="radio" id="adultWorkingYes_${index}" name="adultWorking_${index}" value=true class="adult-working" required>
                    <label for="adultWorkingYes_${index}">Yes</label>
                    <input type="radio" id="adultWorkingNo_${index}" name="adultWorking_${index}" value=false class="adult-working">
                    <label for="adultWorkingNo_${index}">No</label>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group half-width">
                    <label for="adultEmployerName_${index}">Employer's name<span class="required">*</span></label>
                    <input type="text" id="adultEmployerName_${index}" class="adult-employer-name" placeholder="Employer Name" required>
                </div>
                <div class="form-group half-width">
                    <label for="adultWorkContactNumber_${index}">Work Contact Number<span class="required">*</span></label>
                    <input type="text" id="adultWorkContactNumber_${index}" class="adult-work-contact-number" placeholder="Phone Number" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group large-width">
                    <label for="adultCompanyAddress_${index}">Company Address<span class="required">*</span></label>
                    <input type="text" id="adultCompanyAddress_${index}" class="adult-company-address" placeholder="Address" required>
                </div>
            </div>
            <div class="form-group">
                <label>Are you allergic to pets?<span class="required">*</span></label>
                <div class="radio-group">
                    <input type="radio" id="adultAllergicYes_${index}" name="adultAllergic_${index}" value=true class="adult-allergic" required>
                    <label for="adultAllergicYes_${index}">Yes</label>
                    <input type="radio" id="adultAllergicNo_${index}" name="adultAllergic_${index}" value=false class="adult-allergic">
                    <label for="adultAllergicNo_${index}">No</label>
                </div>
            </div>
        `;
        attachAdultWorkingListeners(entry)
        container.appendChild(entry);
        return entry;
    }


    function addPetInfo() {
        const container = document.getElementById("additionalPetsContainer");
        console.log(container);
        const index = container.children.length + 1; // +1 to account for static pet at index 0
        
        const entry = document.createElement("div");
        entry.className = "pet-info-entry";
        entry.innerHTML = `
            <div class="form-row">
            <div class="form-group third-width">
              <label for="petBreed_${index}">Breed<span class="required">*</span></label>
              <input type="text" id="petBreed_${index}" class="pet-breed" required>
            </div>
            <div class="form-group third-width">
              <label for="petAge_${index}">Age<span class="required">*</span></label>
              <input type="number" id="petAge_${index}" class="pet-age" min="0" required>
            </div>
            <div class="form-group third-width">
              <label>Spay/Neuter?<span class="required">*</span></label>
              <div class="radio-group">
                <input type="radio" id="spay_${index}" name="spayNeuter_${index}" value="Spayed" required>
                <label for="spay_${index}">Spay</label>
                <input type="radio" id="neuter_${index}" name="spayNeuter_${index}" value="Neutered">
                <label for="neuter_${index}">Neuter</label>
                <input type="radio" id="neither_${index}" name="spayNeuter_${index}" value="None">
                <label for="neither_${index}">None</label>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group half-width">
              <label for="yearsOwned_${index}">Years owned<span class="required">*</span></label>
              <input type="number" id="yearsOwned_${index}" class="pet-years-owned" min="0" required>
            </div>
            <div class="form-group half-width">
              <label>Pet Status<span class="required">*</span></label>
              <div class="radio-group">
                <input type="radio" id="alive_${index}" name="petStatus_${index}" value="Alive" required>
                <label for="alive_${index}">Alive</label>
                <input type="radio" id="deceased_${index}" name="petStatus_${index}" value="Deceased">
                <label for="deceased_${index}">Deceased</label>
                <input type="radio" id="rehomed_${index}" name="petStatus_${index}" value="Rehomed">
                <label for="rehomed_${index}">Rehomed</label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Is it Vaccinated?<span class="required">*</span></label>
            <div class="radio-group">
              <input type="radio" id="vaccinatedYes_${index}" name="vaccinated_${index}" value=true required>
              <label for="vaccinatedYes_${index}">Yes</label>
              <input type="radio" id="vaccinatedNo_${index}" name="vaccinated_${index}" value=false>
              <label for="vaccinatedNo_${index}">No</label>
            </div>
          </div>
        `;
        console.log(entry);
        container.appendChild(entry);
        return entry;
    }

    function fillFormWithData(data) {
        console.log('Filling form with:', data);
        const adopter = data.adopter;
        const address = adopter.addressDetails || {};
        const spouse = adopter.spouse;
        const adults = data.householdAdults || [];
        const pets = data.adopterPets || [];
        console.log(adults, pets);

        // --- Adopter Basic Info ---
        document.getElementById("adopterName").value = adopter.adopterName || '';
        document.getElementById("contactNumber").value = adopter.contactNum || '';
        document.getElementById("emailAddress").value = adopter.emailAddress || '';

        const empRadio = document.querySelector(`input[name="employmentStatus"][value="${adopter.employmentStatus}"]`);
        if (empRadio) empRadio.checked = true;

        document.getElementById("workingHours").value = adopter.workingHrs || '';
        document.getElementById("workContactNumber").value = adopter.workContactNum || '';
        document.getElementById("employerName").value = adopter.employerName || '';
        document.getElementById("companyAddress").value = adopter.workAddress || '';
        document.getElementById("maxHoursAlone").value = adopter.petAloneHours || '';

        const caretakerRadio = document.querySelector(`input[name="caretaker"][value="${adopter.petCareTaker}"]`);
        if (caretakerRadio) caretakerRadio.checked = true;

        // --- Address Details ---
        document.getElementById("zipcode").value = address.zipcode || '';
        document.getElementById("homeAddress").value = address.homeAddress || '';
        document.getElementById("city").value = address.city || '';
        document.getElementById("state").value = address.state || '';

        const housingStatusRadio = document.querySelector(`input[name="doYou"][value="${address.housingStatus}"]`);
        if (housingStatusRadio) housingStatusRadio.checked = true;

        const homePetPolicyRadio = document.querySelector(`input[name="landlordPets"][value="${address.homePetPolicy}"]`);
        if (homePetPolicyRadio) homePetPolicyRadio.checked = true;

        const windowScreensRadio = document.querySelector(`input[name="hasScreens"][value="${String(address.windowScreens)}"]`);
        if (windowScreensRadio) windowScreensRadio.checked = true;

        document.getElementById("numChildren").value = address.homeChildrenNum || '';

        const petLivingAreaRadio = document.querySelector(`input[name="petKept"][value="${address.petLivingArea}"]`);
        if (petLivingAreaRadio) petLivingAreaRadio.checked = true;

        // --- Spouse ---
        if (spouse) {
            document.querySelector('input[name="hasSpouse"][value="Yes"]').checked = true;
            toggleSection('spouseInformationSection', true);
            document.getElementById("spouseName").value = spouse.spouseName || '';
            document.getElementById("spouseWorkingHours").value = spouse.workingHrs || '';
            document.getElementById("spouseWorkContactNumber").value = spouse.workContactNum || '';
            document.getElementById("spouseEmployerName").value = spouse.employerName || '';
            document.getElementById("spouseCompanyAddress").value = spouse.workAddress || '';
        } else {
            document.querySelector('input[name="hasSpouse"][value="No"]').checked = true;
            toggleSection('spouseInformationSection', false);
        }
        
        // --- Household Adults ---
        // If adults exist, show the section and select “Yes”
        if (adults.length > 0) {
            const otherAdultsYesRadio = document.querySelector('input[name="otherAdults"][value="Yes"]');
            if (otherAdultsYesRadio) otherAdultsYesRadio.checked = true;
            toggleSection('adultInformationSection', true);
        } else {
            const otherAdultsNoRadio = document.querySelector('input[name="otherAdults"][value="No"]');
            if (otherAdultsNoRadio) otherAdultsNoRadio.checked = true;
            toggleSection('adultInformationSection', false);
        }

        document.getElementById("otherAdultsYes").addEventListener("change", function () {
            document.getElementById("adultInformationSection").classList.remove("hidden");
        });

        document.getElementById("otherAdultsNo").addEventListener("change", function () {
            document.getElementById("adultInformationSection").classList.add("hidden");
        });

        const adultContainer = document.getElementById("additionalAdultsContainer");
        if (adultContainer) {
            adultContainer.innerHTML = ''; // Clear existing
        } else {
            console.warn("Element #additionalAdultsContainer not found.");
        }
        
        adults.forEach((adult, index) => {
            console.log("Error: ", index)
            if(index === 0) {
                document.getElementById(`adultName_0`).value = adult.adultname || ''; 
                document.getElementById(`adultEmployerName_0`).value = adult.adultemployer || ''; 
                document.getElementById(`adultWorkContactNumber_0`).value = adult.workcontactnum || ''; 
                document.getElementById(`adultCompanyAddress_0`).value = adult.adultworkaddress || ''; 
                
                const value = (adult.adultemployer && adult.workcontactnum && adult.adultworkaddress) ? true : false;
                
                const workingRadio = document.querySelector(`input[name="adultWorking_0"][value="${String(value)}"]`);
                if (workingRadio) workingRadio.checked = true;

                if(adult.adultallergy) document.getElementById(`adultAllergicYes_0`).checked = true; 
                else document.getElementById(`adultAllergicNo_0`).checked = true; 

                
            } else {   
                const newAdult = addHouseholdAdult(); // should return the new adult container element

                newAdult.querySelector('.adult-name').value = adult.adultname || '';
                newAdult.querySelector('.adult-employer-name').value = adult.adultemployer || '';
                newAdult.querySelector('.adult-work-contact-number').value = adult.workcontactnum || '';
                newAdult.querySelector('.adult-company-address').value = adult.adultworkaddress || '';

                const allergicRadio = newAdult.querySelector(`input[name="adultAllergic_${index}"][value="${String(adult.adultallergy)}"]`);
                if (allergicRadio) allergicRadio.checked = true;

                const value = (adult.adultemployer && adult.workcontactnum && adult.adultworkaddress) ? true : false;

                const workingRadio = newAdult.querySelector(`input[name="adultWorking_${index}"][value="${String(value)}"]`);
                if (workingRadio) workingRadio.checked = true;
                
            }
            
        });

        // --- Adopter Pets ---
        if (pets.length > 0) {
            document.querySelector('input[name="ownedDog"][value="Yes"]').checked = true;
            toggleSection('petInformationSection', true);

            // Static pet (index 0)
            const firstPet = pets[0];
            document.getElementById("petBreed_0").value = firstPet.petbreed || '';
            document.getElementById("petAge_0").value = firstPet.petage || '';

            const spay0 = document.querySelector(`input[name="spayNeuter_0"][value="${firstPet.petspayneuterstatus}"]`);
            if (spay0) spay0.checked = true;

            document.getElementById("yearsOwned_0").value = firstPet.petyrsowned || '';

            const status0 = document.querySelector(`input[name="petStatus_0"][value="${firstPet.petcurrentstatus}"]`);
            if (status0) status0.checked = true;

            const vacc0 = document.querySelector(`input[name="vaccinated_0"][value="${String(firstPet.petvaccination)}"]`);
            if (vacc0) vacc0.checked = true;

            // Dynamic pets
            for (let i = 1; i < pets.length; i++) {
                const pet = pets[i];
                const newPet = addPetInfo();

                const breedInput = newPet.querySelector(`#petBreed_${i}`);
                if (breedInput) breedInput.value = pet.petbreed || '';

                const ageInput = newPet.querySelector(`#petAge_${i}`);
                if (ageInput) ageInput.value = pet.petage || '';

                const spayInput = newPet.querySelector(`input[name="spayNeuter_${i}"][value="${pet.petspayneuterstatus}"]`);
                if (spayInput) spayInput.checked = true;

                const yearsOwnedInput = newPet.querySelector(`#yearsOwned_${i}`);
                if (yearsOwnedInput) yearsOwnedInput.value = pet.petyrsowned || '';

                const statusInput = newPet.querySelector(`input[name="petStatus_${i}"][value="${pet.petcurrentstatus}"]`);
                if (statusInput) statusInput.checked = true;

                const vaccInput = newPet.querySelector(`input[name="vaccinated_${i}"][value="${String(pet.petvaccination)}"]`);
                if (vaccInput) vaccInput.checked = true;
            }
        } else {
            document.querySelector('input[name="ownedDog"][value="No"]').checked = true;
            toggleSection('petInformationSection', false);
        }

        // Setting additional buttons
        const addPetButton = document.getElementById('addPetButton');
        const removePetButton = document.getElementById(`removePetButton`)

        if(addPetButton) {
            addPetButton.disabled = true;
            addPetButton.style.opacity = "80%";
        } 

        if(removePetButton) {
            removePetButton.disabled = true;
            removePetButton.style.opacity = "80%";
        }

        const addAdultButton = document.getElementById('addAdultButton');
        const removeAdultButton = document.getElementById(`removeAdultButton`)

        if(addAdultButton) {
            addAdultButton.disabled = true;
            addAdultButton.style.opacity = "80%";
        } 

        if(removeAdultButton) {
            removeAdultButton.disabled = true;
            removeAdultButton.style.opacity = "80%";
        }
    }


    function saveApplicationData(data) {
        localStorage.setItem(applicationDataKey, JSON.stringify(data));
        console.log('Application data saved:', data);
    }

    function loadApplicationData() {
        const data = localStorage.getItem(applicationDataKey);
        return data ? JSON.parse(data) : null;
    }

    function toggleEditMode(enable) {
        form.querySelectorAll('input, select, textarea').forEach(element => {
            if (element.id !== 'confirmSubmission' && element.id !== 'cancelSubmission' &&
                element.id !== 'applyNowBtn' && element.id !== 'editSubmissionButton' &&
                element.id !== 'deleteSubmissionButton' && element.id !== 'saveChangesButton' &&
                element.id !== 'submitApplicationButton') {
                element.disabled = !enable;
            }
        });

        if (enable) { // Entering edit mode
            if (editSubmissionButton) editSubmissionButton.classList.add('hidden');
            if (deleteSubmissionButton) deleteSubmissionButton.classList.add('hidden');
            if (saveChangesButton) saveChangesButton.classList.remove('hidden');
            if (formCloseButton) formCloseButton.classList.remove('hidden');

            // Setting additional buttons
            const addPetButton = document.getElementById('addPetButton');
            const removePetButton = document.getElementById(`removePetButton`)

            if(addPetButton) {
                addPetButton.disabled = false;
                addPetButton.style.opacity = "100%";
            } 

            if(removePetButton) {
                removePetButton.disabled = false;
                removePetButton.style.opacity = "100%";
            }

            const addAdultButton = document.getElementById('addAdultButton');
            const removeAdultButton = document.getElementById(`removeAdultButton`)

            if(addAdultButton) {
                addAdultButton.disabled = false;
                addAdultButton.style.opacity = "100%";
            } 

            if(removeAdultButton) {
                removeAdultButton.disabled = false;
                removeAdultButton.style.opacity = "100%";
            }
            
        } else {
            if (editSubmissionButton) editSubmissionButton.classList.remove('hidden');
            if (deleteSubmissionButton) deleteSubmissionButton.classList.remove('hidden');
            if (saveChangesButton) saveChangesButton.classList.add('hidden');
            form.querySelectorAll('input, select, textarea').forEach(element => {
                if (element.id !== 'confirmSubmission' && element.id !== 'cancelSubmission' &&
                    element.id !== 'applyNowBtn' && element.id !== 'editSubmissionButton' &&
                    element.id !== 'deleteSubmissionButton' && element.id !== 'saveChangesButton' &&
                    element.id !== 'submitApplicationButton') {
                    element.disabled = true;
                }
                
            });
            if (formCloseButton) formCloseButton.classList.add('hidden'); 
        }
    }

    async function saveChangesToAppData() {
        const currentAdopterId = JSON.parse(localStorage.getItem('currentUser')).adopterId;
        
        const reply = await fetch(`http://127.0.0.1:8080/api/adoption-record/full-application/${currentAdopterId}`);
        const adopterRecord = await reply.json();
        const updatedData = collectFormData();

        updatedData.adopter.adopterId = currentAdopterId;
        updatedData.adopter.addressDetails.adopterAddressId = adopterRecord.adopter.addressDetails.adopterAddressId

        console.log(updatedData)

        const response = await fetch('http://localhost:8080/api/adoption-record/full-application/update', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedData)
                    });

        toggleEditMode(false); 
        
        // Setting additional buttons
        const addPetButton = document.getElementById('addPetButton');
        const removePetButton = document.getElementById(`removePetButton`)

        if(addPetButton) {
            addPetButton.disabled = true;
            addPetButton.style.opacity = "80%";
        } 

        if(removePetButton) {
            removePetButton.disabled = true;
            removePetButton.style.opacity = "80%";
        }

        const addAdultButton = document.getElementById('addAdultButton');
        const removeAdultButton = document.getElementById(`removeAdultButton`)

        if(addAdultButton) {
            addAdultButton.disabled = true;
            addAdultButton.style.opacity = "80%";
        } 

        if(removeAdultButton) {
            removeAdultButton.disabled = true;
            removeAdultButton.style.opacity = "80%";
        }
    }

    async function viewSubmittedForm(adopterId) {
        if (applicationFormContainer.classList.contains('hidden')) {
            // --- Show the form and hide other sections ---
            heroSection.classList.add('hidden');
            howToApplySection.classList.add('hidden');
            applicationFormContainer.classList.remove('hidden');
            applyNowBtn.textContent = 'Hide Form';

            try {
                // FETCH data from backend using adopterId
                const response = await fetch(`http://127.0.0.1:8080/api/adoption-record/full-application/${adopterId}`);
                if (!response.ok) throw new Error('Failed to fetch adopter data.');

                const savedData = await response.json();
                
                // Fill the form with fetched data
                fillFormWithData(savedData);

                // Disable all inputs
                form.querySelectorAll('input, select, textarea').forEach(element => {
                    element.disabled = true;
                });

                // Show/hide buttons as needed
                if (editSubmissionButton) editSubmissionButton.classList.remove('hidden');
                if (deleteSubmissionButton) deleteSubmissionButton.classList.remove('hidden');
                if (submitApplicationButton) submitApplicationButton.classList.add('hidden');
                if (saveChangesButton) saveChangesButton.classList.add('hidden');
                if (formCloseButton) formCloseButton.classList.add('hidden');

            } catch (error) {
                console.error('Error loading adopter data:', error);
                alert('Failed to load submitted form. Please try again later.');
            }

        } else {
            // --- Hide the form and return to landing sections ---
            showDefaultSections();
            applyNowBtn.textContent = 'View Form';

            if (editSubmissionButton) editSubmissionButton.classList.add('hidden');
            if (deleteSubmissionButton) deleteSubmissionButton.classList.add('hidden');
            if (submitApplicationButton) submitApplicationButton.classList.remove('hidden');
            if (saveChangesButton) saveChangesButton.classList.add('hidden');
        }
    }


    function toggleFormVisibility() {
        if (applicationFormContainer.classList.contains('hidden')) {
            heroSection.classList.add('hidden');
            howToApplySection.classList.add('hidden');
            applicationFormContainer.classList.remove('hidden');
            applyNowBtn.textContent = 'Hide Form';
            form.querySelectorAll('input, select, textarea').forEach(element => {
                element.disabled = false; 
            });
            if (formCloseButton) {
                formCloseButton.classList.remove('hidden');
            }
            if (editSubmissionButton) editSubmissionButton.classList.add('hidden');
            if (deleteSubmissionButton) deleteSubmissionButton.classList.add('hidden');
            if (saveChangesButton) saveChangesButton.classList.add('hidden');
            if (submitApplicationButton) submitApplicationButton.classList.remove('hidden');
            form.reset(); 
        } else {
            showDefaultSections(); 
        }
    }

    

    if (applyNowBtn) {
        console.log(localStorage.getItem('currentUser'));
        applyNowBtn.addEventListener('click', function(event) {
            event.preventDefault();

            if (!checkLoginStatus()) {
                localStorage.setItem('redirectAfterLogin', 'AdoptNow.html');
                window.location.href = 'SignIn.html';
            } else {
                if (getFormSubmittedStatus()) {
                    const currentAdopterId = JSON.parse(localStorage.getItem('currentUser')).adopterId;
                    viewSubmittedForm(currentAdopterId); 
                } else {
                    toggleFormVisibility(); 
                }
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault();

            setLoginStatus(false); 
            localStorage.removeItem('applicationSubmitted'); 
            localStorage.removeItem(applicationDataKey); 

            // Clear adopterId from currentUser
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                delete currentUser.adopterId;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

            console.log('User logged out. Application data cleared.');
            window.location.href = 'HomePage.html'; 
        });
    }

    if (form && confirmationModal) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            if (form.checkValidity()) {
                confirmationModal.style.display = 'flex';
            } else {
                form.reportValidity();
            }
        });

        confirmSubmissionButton.addEventListener('click', async function() {
            if (!isFormSubmitting) {
                isFormSubmitting = true;
                confirmationModal.style.display = 'none';
                setFormSubmittedStatus(true);
                applyNowBtn.textContent = 'View Form';
                
                console.log('Application submitted successfully!');
                const submittedData = collectFormData(); // Should return a full AdoptionApplicationDTO
                console.log(submittedData);
                try {
                    const response = await fetch('http://localhost:8080/api/adoption-record/full-application/save', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(submittedData)
                    });

                    if (!response.ok) throw new Error('Failed to submit application');

                    const savedData = await response.json();
                    console.log('Application saved to DB:', savedData);

                    const adopterIdFromServer = savedData.adopter.adopterId; // Replace with actual value from backend
                    
                    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

                    if (!currentUser.userId) {
                        // You may have just set 'isLoggedIn' without setting user info
                        // This shouldn't happen if you always store user after login
                        alert('User info is missing in localStorage. Please sign in again.');
                        return;
                    }

                    currentUser.adopterId = adopterIdFromServer;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));

                    try {
                        const reply = await fetch(`http://localhost:8080/api/appdata/userId=${currentUser.userId}&adopterId=${adopterIdFromServer}`, {
                            method: 'POST'
                        });
                        
                        if (!response.ok) throw new Error('Failed to set adopterId in appdata');


                        console.log(reply.json);
                        // Optionally update localStorage if needed
                        // localStorage.setItem(applicationDataKey, JSON.stringify(savedData));
    
                        submitApplicationButton.classList.add('hidden');
                        editSubmissionButton.classList.remove('hidden');
                        deleteSubmissionButton.classList.remove('hidden');
                        
                        
                        // window.location.href = 'AdoptNow.html';
                        
                    } catch (error) {
                        console.error('Error saving adopterId in appdata:', error);
                        alert('There was an error submitting the form. Please try again.');
                    }
                } catch (error) {
                    console.error('Error submitting application:', error);
                    alert('There was an error submitting the form. Please try again.');
                } finally {
                    isFormSubmitting = false;
                }
            }
        });

        cancelSubmissionButton.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
            console.log('Application submission cancelled by user.');
        });

        closeModalButton.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
            console.log('Application submission cancelled by closing modal.');
        });

        window.addEventListener('click', function(event) {
            if (event.target == confirmationModal) {
                confirmationModal.style.display = 'none';
                console.log('Application submission cancelled by clicking outside modal.');
            }
        });
    }

    if (formCloseButton) {
        formCloseButton.addEventListener('click', function() {
            showDefaultSections();
        });
    }

    if (editSubmissionButton) {
        editSubmissionButton.addEventListener('click', function() {
            toggleEditMode(true); 
        });
    }

    if (saveChangesButton) {
        saveChangesButton.addEventListener('click', function() {
            if(updateConfirmationModal) {
                updateConfirmationModal.style.display = 'flex';
            }
        });
    }

    if (confirmUpdateButton) {
        confirmUpdateButton.addEventListener('click', function() {
            saveChangesToAppData();
            updateConfirmationModal.style.display = 'none';
        });
    }
    if (cancelUpdateButton) {
        cancelDeleteButton.addEventListener('click', () => {
            updateConfirmationModal.style.display = 'none';
        });
    }

    if (deleteSubmissionButton) {
        deleteSubmissionButton.addEventListener('click', function() {
            if (deleteWarningModal) deleteWarningModal.style.display = 'flex'; 
        });
    }

    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', async function () {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const adopterId = currentUser.adopterId; // Assuming this is set after login or form submit

            if (!adopterId) {
                console.warn("No adopterId found in currentUser.");
                return;
            }

            try {
                // 1. Call backend to delete record
                const response = await fetch(`http://127.0.0.1:8080/api/adoption-record/full-application/${adopterId}/delete-record`, {
                    method: "DELETE"
                }).then(response => response.text())

                .then(data => {
                    console.log("Success:", data);
                    alert("Adopter deleted successfully!");
                })

                .catch(error => {
                    console.error("Error:", error);
                    alert("Failed to delete adopter.");
                });

                // 2. Remove local form data
                localStorage.removeItem(applicationDataKey);

                // 3. Update session state
                setFormSubmittedStatus(false);

                // 4. Remove adopterId from currentUser (frontend logic)
                currentUser.adopterId = null;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                console.log('Application data deleted successfully!');

                // 5. Reset form and UI
                deleteWarningModal.style.display = 'none';
                form.reset();
                showDefaultSections();
                applyNowBtn.textContent = 'Apply Now';

                const userResponse = await fetch(`http://localhost:8080/api/appdata/${currentUser.userId}`);
                const userData = await userResponse.json();
                userData.adopterId = null;
                const reply = await fetch('http://localhost:8080/api/appdata/update', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                });
                
                if (!reply.ok) throw new Error('Failed to set adopterId to null in appdata');

            } catch (error) {
                console.error('Error deleting application:', error);
                alert('Something went wrong while deleting your application.');
            }
        });
    }

    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', () => {
            deleteWarningModal.style.display = 'none';
        });
    }

    initializeAdoptNowPage(); 

    const spouseYesRadio = document.getElementById('spouseYes');
    const spouseNoRadio = document.getElementById('spouseNo');
    const spouseInformationSection = document.getElementById('spouseInformationSection');

    const otherAdultsYesRadio = document.getElementById('otherAdultsYes');
    const otherAdultsNoRadio = document.getElementById('otherAdultsNo');
    const adultInformationSection = document.getElementById('adultInformationSection');
    const additionalAdultsContainer = document.getElementById('additionalAdultsContainer');
    const addAdultButton = document.getElementById('addAdultButton');
    const adultButtonContainer = adultInformationSection ? adultInformationSection.querySelector('.button-container') : null;
    let adultCount = 0; 
    
    const ownedDogYesRadio = document.getElementById('ownedDogYes');
    const ownedDogNoRadio = document.getElementById('ownedDogNo');
    const petInformationSection = document.getElementById('petInformationSection');
    const additionalPetsContainer = document.getElementById('additionalPetsContainer');
    const addPetButton = document.getElementById('addPetButton');
    const petButtonContainer = petInformationSection ? petInformationSection.querySelector('.button-container') : null;
    let petCount = 0; 

    function toggleSection(sectionElementOrId, isVisible, manageDynamicFields = false) {
        const sectionElement = typeof sectionElementOrId === 'string'
            ? document.getElementById(sectionElementOrId)
            : sectionElementOrId;

        if (!sectionElement) {
            console.warn('toggleSection: Element not found for', sectionElementOrId);
            return;
        }

        if (isVisible) {
            sectionElement.classList.remove('hidden');
            sectionElement.querySelectorAll('input, select, textarea').forEach(input => {
                if (sectionElement.id === 'spouseInformationSection' && input.id === 'spouseName') {
                    input.required = true;
                } else if (sectionElement.id === 'adultInformationSection' && input.closest('.adult-info-entry') && !input.classList.contains('adult-employer-name') && !input.classList.contains('adult-work-contact-number') && !input.classList.contains('adult-company-address') && !input.classList.contains('adult-working-hours')) {
                    input.required = true;
                } else if (sectionElement.id === 'petInformationSection' && input.closest('.pet-info-entry')) {
                    if (input.required !== false) {
                        input.required = true;
                    }
                }
            });
            if (manageDynamicFields && sectionElement.id === 'adultInformationSection' && adultButtonContainer) {
                adultButtonContainer.style.display = 'flex';
                updateAdultButtonsVisibility();
            } else if (manageDynamicFields && sectionElement.id === 'petInformationSection' && petButtonContainer) {
                petButtonContainer.style.display = 'flex';
                updatePetButtonsVisibility();
            }
        } else {
            sectionElement.classList.add('hidden');
            sectionElement.querySelectorAll('input, select, textarea').forEach(input => {
                input.required = false;
                input.value = '';
                if (input.type === 'radio' || input.type === 'checkbox') {
                    input.checked = false;
                }
            });
            if (manageDynamicFields && sectionElement.id === 'adultInformationSection') {
                additionalAdultsContainer.innerHTML = '';
                adultCount = 0;
                if (adultButtonContainer) adultButtonContainer.style.display = 'none';
            } else if (manageDynamicFields && sectionElement.id === 'petInformationSection') {
                additionalPetsContainer.innerHTML = '';
                petCount = 0;
                if (petButtonContainer) petButtonContainer.style.display = 'none';
            }
        }
    }

    if (spouseYesRadio && spouseInformationSection) {
        spouseYesRadio.addEventListener('change', () => toggleSection(spouseInformationSection, true));
    }
    if (spouseNoRadio && spouseInformationSection) {
        spouseNoRadio.addEventListener('change', () => toggleSection(spouseInformationSection, false));
    }

    if (otherAdultsYesRadio && adultInformationSection) {
        otherAdultsYesRadio.addEventListener('change', () => toggleSection(adultInformationSection, true, true));
    }
    if (otherAdultsNoRadio && adultInformationSection) {
        otherAdultsNoRadio.addEventListener('change', () => toggleSection(adultInformationSection, false, true));
    }

    if (ownedDogYesRadio && petInformationSection) {
        ownedDogYesRadio.addEventListener('change', () => toggleSection(petInformationSection, true, true));
    }
    if (ownedDogNoRadio && petInformationSection) {
        ownedDogNoRadio.addEventListener('change', () => toggleSection(petInformationSection, false, true));
    }

    // Dynamic adult fields
    if (addAdultButton) {
        addAdultButton.addEventListener('click', () => {
            adultCount++;
            const newAdultEntry = document.createElement('div');
            newAdultEntry.classList.add('adult-info-entry');
            newAdultEntry.innerHTML = `
                <div class="form-group full-width">
                    <label for="adultName_${adultCount}">Name<span class="required">*</span></label>
                    <input type="text" id="adultName_${adultCount}" class="adult-name" placeholder="First Name MI. Last Name">
                    </div>
                    <div class="form-group full-width">
                        <label>Working?<span class="required">*</span></label>
                        <div class="radio-group">
                        <input type="radio" id="adultWorkingYes_${adultCount}" name="adultWorking_${adultCount}" value=true class="adult-working" required>
                        <label for="adultWorkingYes_${adultCount}">Yes</label>
                        <input type="radio" id="adultWorkingNo_${adultCount}" name="adultWorking_${adultCount}" value=false class="adult-working">
                        <label for="adultWorkingNo_${adultCount}">No</label>
                        </div>
                    </div>
                    </div>
                    <div class="form-row">
                    <div class="form-group half-width">
                        <label for="adultEmployerName_${adultCount}">Employer's name<span class="required">*</span></label>
                        <input type="text" id="adultEmployerName_${adultCount}" class="adult-employer-name" placeholder="First Name MI. Last Name">
                    </div>
                    <div class="form-group half-width">
                        <label for="adultWorkContactNumber_${adultCount}">Work Contact Number<span class="required">*</span></label>
                        <input type="text" id="adultWorkContactNumber_${adultCount}" class="adult-work-contact-number" placeholder="Telephone/Cellular Phone Number">
                    </div>
                    </div>
                    <div class="form-row">
                    <div class="form-group large-width">
                        <label for="adultCompanyAddress_${adultCount}">Company Address<span class="required">*</span></label>
                        <input type="text" id="adultCompanyAddress_${adultCount}" class="adult-company-address" placeholder="Street, Barangay/Subdivision, City/Municipality, Province">
                    </div>

                    <div class="form-group">
                    <label>Are you allergic to pets?<span class="required">*</span></label>
                    <div class="radio-group">
                        <input type="radio" id="adultAllergicYes_${adultCount}" name="adultAllergic_${adultCount}" value=true class="adult-allergic" required>
                        <label for="adultAllergicYes_${adultCount}">Yes</label>
                        <input type="radio" id="adultAllergicNo_${adultCount}" name="adultAllergic_${adultCount}" value=false class="adult-allergic">
                        <label for="adultAllergicNo_${adultCount}">No</label>
                    </div>
                </div>
                `;
            console.log(additionalAdultsContainer.childNodes);
            additionalAdultsContainer.appendChild(newAdultEntry);
            updateAdultButtonsVisibility();
        });
    }

    function updateAdultButtonsVisibility() {
        const currentAdultEntries = additionalAdultsContainer.querySelectorAll('.adult-info-entry').length;
        if (currentAdultEntries > 0 && !document.getElementById('removeAdultButton')) {
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.id = 'removeAdultButton';
            removeButton.classList.add('remove-button');
            removeButton.textContent = '-';
            if (adultButtonContainer) adultButtonContainer.appendChild(removeButton);

            removeButton.addEventListener('click', () => {
                const lastAdultEntry = additionalAdultsContainer.lastElementChild;
                if (lastAdultEntry) {
                    additionalAdultsContainer.removeChild(lastAdultEntry);
                    adultCount--;
                    updateAdultButtonsVisibility();
                }
            });
        } else if (currentAdultEntries === 0 && document.getElementById('removeAdultButton')) {
            const removeButton = document.getElementById('removeAdultButton');
            if (removeButton && removeButton.parentNode === adultButtonContainer) {
                adultButtonContainer.removeChild(removeButton);
            }
        }
    }

    // Dynamic pet fields
    if (addPetButton) {
        addPetButton.addEventListener('click', () => {
            petCount++;
            const newPetEntry = document.createElement('div');
            newPetEntry.classList.add('pet-info-entry');
            newPetEntry.innerHTML = `
                <div class="form-row">
                <div class="form-group third-width">
                    <label for="petBreed_${petCount}">Breed<span class="required">*</span></label>
                    <input type="text" id="petBreed_${petCount}" class="pet-breed" required>
                </div>
                <div class="form-group third-width">
                    <label for="petAge_${petCount}">Age<span class="required">*</span></label>
                    <input type="number" id="petAge_${petCount}" class="pet-age" min="0" required>
                </div>
                <div class="form-group third-width">
                    <label>Spay/Neuter?<span class="required">*</span></label>
                    <div class="radio-group">
                    <input type="radio" id="spay_${petCount}" name="spayNeuter_${petCount}" value="Spayed" required>
                    <label for="spay_${petCount}">Spay</label>
                    <input type="radio" id="neuter_${petCount}" name="spayNeuter_${petCount}" value="Neutered">
                    <label for="neuter_${petCount}">Neuter</label>
                    <input type="radio" id="neither_${petCount}" name="spayNeuter_${petCount}" value="None">
                    <label for="neither_${petCount}">None</label>
                    </div>
                </div>
                </div>

                <div class="form-row">
                <div class="form-group half-width">
                    <label for="yearsOwned_${petCount}">Years owned<span class="required">*</span></label>
                    <input type="number" id="yearsOwned_${petCount}" class="pet-years-owned" min="0" required>
                </div>
                <div class="form-group half-width">
                    <label>Pet Status<span class="required">*</span></label>
                    <div class="radio-group">
                    <input type="radio" id="alive_${petCount}" name="petStatus_${petCount}" value="Alive" required>
                    <label for="alive_${petCount}">Alive</label>
                    <input type="radio" id="deceased_${petCount}" name="petStatus_${petCount}" value="Deceased">
                    <label for="deceased_${petCount}">Deceased</label>
                    <input type="radio" id="rehomed_${petCount}" name="petStatus_${petCount}" value="Rehomed">
                    <label for="rehomed_${petCount}">Rehomed</label>
                    </div>
                </div>
                </div>

                <div class="form-group">
                <label>Is it Vaccinated?<span class="required">*</span></label>
                <div class="radio-group">
                    <input type="radio" id="vaccinatedYes_${petCount}" name="vaccinated_${petCount}" value="true" required>
                    <label for="vaccinatedYes_${petCount}">Yes</label>
                    <input type="radio" id="vaccinatedNo_${petCount}" name="vaccinated_${petCount}" value="false">
                    <label for="vaccinatedNo_${petCount}">No</label>
                </div>
                </div>
            `;

            additionalPetsContainer.appendChild(newPetEntry);
            updatePetButtonsVisibility(); // optional: if you manage a Remove button
        });
    }

    function updatePetButtonsVisibility() {
        const currentPetEntries = additionalPetsContainer.querySelectorAll('.pet-info-entry').length;
        if (currentPetEntries > 0 && !document.getElementById('removePetButton')) {
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.id = 'removePetButton';
            removeButton.classList.add('remove-button');
            removeButton.textContent = '-';
            if (petButtonContainer) petButtonContainer.appendChild(removeButton);

            removeButton.addEventListener('click', () => {
                const lastPetEntry = additionalPetsContainer.lastElementChild;
                if (lastPetEntry) {
                    additionalPetsContainer.removeChild(lastPetEntry);
                    petCount--;
                    updatePetButtonsVisibility();
                }
            });
        } else if (currentPetEntries === 0 && document.getElementById('removePetButton')) {
            const removeButton = document.getElementById('removePetButton');
            if (removeButton && removeButton.parentNode === petButtonContainer) {
                petButtonContainer.removeChild(removeButton);
            }
        }
    }
    
    document.querySelectorAll('.heart').forEach(heart => {
        heart.addEventListener('click', () => {
            heart.classList.toggle('active');
            const icon = heart.querySelector('i');
            icon.classList.toggle('fa-regular');
            icon.classList.toggle('fa-solid');
        });
    });

    function setAdultWorkingFieldsEnabled(adultEntry, enabled) {
        const employer = adultEntry.querySelector('.adult-employer-name');
        const contact = adultEntry.querySelector('.adult-work-contact-number');
        const address = adultEntry.querySelector('.adult-company-address');
        if (employer) {
            employer.disabled = !enabled;
            employer.value = '';
        } 

        if (contact) {
            contact.disabled = !enabled;
            contact.value = '';
        } 

        if (address) {
            address.disabled = !enabled;
            address.value = '';
        } 
    }

    function attachAdultWorkingListeners(adultEntry) {
        const yesRadio = adultEntry.querySelector('.adult-working[id^="adultWorkingYes"]');
        const noRadio = adultEntry.querySelector('.adult-working[id^="adultWorkingNo"]');
        if (yesRadio) {
            yesRadio.addEventListener('change', function() {
                setAdultWorkingFieldsEnabled(adultEntry, true);
            });
        }
        if (noRadio) {

            noRadio.addEventListener('change', function() {
                setAdultWorkingFieldsEnabled(adultEntry, false);
            });
        }
    }

    const mainAdultEntry = document.querySelector('.adult-info-entry');
    if (mainAdultEntry) {
        attachAdultWorkingListeners(mainAdultEntry);
    }

    if (addAdultButton) {
        addAdultButton.addEventListener('click', () => {
            setTimeout(() => {
                const newAdultEntry = additionalAdultsContainer.lastElementChild;
                if (newAdultEntry) {
                    attachAdultWorkingListeners(newAdultEntry);
                }
            }, 0);
        });
    }
});

