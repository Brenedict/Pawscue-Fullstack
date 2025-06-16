const p_tag = document.getElementById("return-requests");

// EXAMPLE OF COMPLETE INSERTION
const adopterData1 = {
    // Contains adopter, adopterhomedetails, and spouse
    adopter: {
        adopterId: null,                            // PK (auto generated)
        adopterName: "Garcia, Juan, M.",
        contactNum: "0917-111-2222",
        emailAddress: "juan.garcia@example.com",
        addressDetails: {
            adopterAddressId: null,                 // PK (auto generated)
            zipcode: "1100",
            homeAddress: "123 Main St",
            city: "Manila",
            state: "NCR",
            housingStatus: "Own",
            homePetPolicy: "ALLOWED",
            windowScreens: true,
            homeChildrenNum: 2,
            petLivingArea: "Indoors"
        },
        employmentStatus: "Working",
        workingHrs: 9,
        workContactNum: "0917-222-3333",
        employerName: "Tech Solutions",
        workAddress: "123 Main St, Manila",
        petAloneHours: 5,
        petCareTaker: "Self",
        spouse: {
            adopterId: null,                        // FK
            workAddress: "123 Main St, Manila",
            workingHrs: 8,
            spouseId: null,                         // PK (auto generated)
            spouseName: "Garcia, Maria, S.",
            employerName: "Tech Solutions",
            workContactNum: "0917-333-4444"
        }
    },

    // Multivalued adopterpets
    adopterPets: [
        {
            petid: null,                            // PK (auto generated)
            petbreed: "Aspin",
            petage: 10,
            petspayneuterstatus: "None",
            petyrsowned: 10,
            petcurrentstatus: "Alive",
            petvaccination: false,
            adopterid: null                         // FK
        },
        {
            petid: null,                            // PK (auto generated)
            petbreed: "Belgian Malinois",
            petage: 3,
            petspayneuterstatus: "None",
            petyrsowned: 2,
            petcurrentstatus: "Rehomed",
            petvaccination: true,
            adopterid: null                         // FK
        },
        {
            petid: null,                            // PK (auto generated)
            petbreed: "Golden Retriever",
            petage: 5,
            petspayneuterstatus: "Spayed",
            petyrsowned: 3,
            petcurrentstatus: "Alive",
            petvaccination: true,
            adopterid: null                         // FK
        },
        {
            petid: null,                            // PK (auto generated)
            petbreed: "Siberian Husky",
            petage: 4,
            petspayneuterstatus: "Neutered",
            petyrsowned: 2,
            petcurrentstatus: "Alive",
            petvaccination: true,
            adopterid: null                         // FK
        }
    ],

    // Multivalued householdadults
    householdAdults: [
        {
            householdadultid: null,                 // PK (auto generated)
            adultname: "San Juan, Mario N.",
            adultallergy: true,
            workcontactnum: null,
            adultemployer: null,
            adultworkaddress: null,
            adopterid: null                         // FK
        },
        {
            householdadultid: null,                 // PK (auto generated)
            adultname: "Rails, Ruby, E.",
            adultallergy: false,
            workcontactnum: "(02) 8741 1692",
            adultemployer: "Puregold",
            adultworkaddress: "J297+8JR G. Araneta Avenue, Quezon City",
            adopterid: null                         // FK
        },
        {
            householdadultid: null,                 // PK (auto generated)
            adultname: "Dela Cruz, Ana P.",
            adultallergy: false,
            workcontactnum: "0917-123-4567",
            adultemployer: "Tech Solutions",
            adultworkaddress: "123 Main St, Manila",
            adopterid: null                         // FK
        },
        {
            householdadultid: null,                 // PK (auto generated)
            adultname: "Santos, Luis M.",
            adultallergy: true,
            workcontactnum: null,
            adultemployer: null,
            adultworkaddress: null,
            adopterid: null                         // FK
        }
    ]
}



// EXAMPLE OF DATA INSERTION WITHOUT SPOUSE, HOUSEHOLD ADULT, ADOPTER PETS
const adopterData = {
    // Contains adopter, adopterhomedetails, and spouse
    adopter: {
        adopterId: "ADP-0000",                            // PK (auto generated)
        adopterName: "King",
        contactNum: "0917-111-2222",
        emailAddress: "juan.garcia@example.com",
        addressDetails: {
            adopterAddressId: "HOME-0000",                 // PK (auto generated)
            zipcode: "1100",
            homeAddress: "123 Main St",
            city: "Manila",
            state: "NCR",
            housingStatus: "Own",
            homePetPolicy: "ALLOWED",
            windowScreens: true,
            homeChildrenNum: 2,
            petLivingArea: "Indoors"
        },
        employmentStatus: "Working",
        workingHrs: 9,
        workContactNum: "0917-222-3333",
        employerName: "Tech Solutions",
        workAddress: "123 Main St, Manila",
        petAloneHours: 5,
        petCareTaker: "Self",
        spouse: null // Adopter without spouse
    },

    // Multivalued adopterpets
    adopterPets: [
        // Adopter without pets
    ],

    // Multivalued householdadults
    householdAdults: [
        // Adopter without other adults in the household
    ]
}

const bt_POST = document.getElementById("bt-POST");
const bt_UPDATE = document.getElementById("bt-UPDATE");

bt_POST.addEventListener("click", () => {
    sendAdopter(adopterData1);
});

bt_UPDATE.addEventListener("click", () => {
    // updateAdopter(adopterData1);
})

// INCOMPLETE DO NOT TOUCH UPDATE FUNCTION
function updateAdopter(adopterData) {
    fetch("http://localhost:8080/api/adoption-record/full-application/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(adopterData)
    })

    .then(response => response.text())

    .then(data => {
        console.log("Success:", data);
        p_tag.textContent = data;
    })

    .catch(error => {
        console.error("Error:", error);
    });
}

// Example POST fetch request
function sendAdopter(adopterData) {
    fetch("http://localhost:8080/api/adoption-record/full-application/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(adopterData)
    })

    .then(response => response.text())

    .then(data => {
        console.log("Success:", data);
        p_tag.textContent = data;
        alert("Adopter submitted successfully!");
    })

    .catch(error => {
        console.error("Error:", error);
        alert("Failed to submit adopter.");
    });
}

// Example DELETE fetch request
function deleteAdopterRecord() {
    const adopterId = document.getElementById("adopterid-textbox").value;
    fetch(`http://localhost:8080/api/adoption-record/adopter/${adopterId}/delete-record`, {
        method: "DELETE"
    })
}