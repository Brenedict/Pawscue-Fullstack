// const adopterData1 = {
//     // Contains adopter, adopterhomedetails, and spouse
//     adopter: {
//         adopterId: null,                            // PK (auto generated)
//         adopterName: "Garcia, Juan, M.",
//         contactNum: "0917-111-2222",
//         emailAddress: "juan.garcia@example.com",
//         addressDetails: {
//             adopterAddressId: null,                 // PK (auto generated)
//             zipcode: "1100",
//             homeAddress: "123 Main St",
//             city: "Manila",
//             state: "NCR",
//             housingStatus: "Own",
//             homePetPolicy: "ALLOWED",
//             windowScreens: true,
//             homeChildrenNum: 2,
//             petLivingArea: "Indoors"
//         },
//         employmentStatus: "Working",
//         workingHrs: 9,
//         workContactNum: "0917-222-3333",
//         employerName: "Tech Solutions",
//         workAddress: "123 Main St, Manila",
//         petAloneHours: 5,
//         petCareTaker: "Self",
//         spouse: {
//             adopterId: null,                        // FK
//             workAddress: "123 Main St, Manila",
//             workingHrs: 8,
//             spouseId: null,                         // PK (auto generated)
//             spouseName: "Garcia, Maria, S.",
//             employerName: "Tech Solutions",
//             workContactNum: "0917-333-4444"
//         }
//     },

//     // Multivalued adopterpets
//     adopterPets: [
//         {
//             petid: null,                            // PK (auto generated)
//             petbreed: "Aspin",
//             petage: 10,
//             petspayneuterstatus: "None",
//             petyrsowned: 10,
//             petcurrentstatus: "Alive",
//             petvaccination: false,
//             adopterid: null                         // FK
//         },
//         {
//             petid: null,                            // PK (auto generated)
//             petbreed: "Belgian Malinois",
//             petage: 3,
//             petspayneuterstatus: "None",
//             petyrsowned: 2,
//             petcurrentstatus: "Rehomed",
//             petvaccination: true,
//             adopterid: null                         // FK
//         },
//         {
//             petid: null,                            // PK (auto generated)
//             petbreed: "Golden Retriever",
//             petage: 5,
//             petspayneuterstatus: "Spayed",
//             petyrsowned: 3,
//             petcurrentstatus: "Alive",
//             petvaccination: true,
//             adopterid: null                         // FK
//         },
//         {
//             petid: null,                            // PK (auto generated)
//             petbreed: "Siberian Husky",
//             petage: 4,
//             petspayneuterstatus: "Neutered",
//             petyrsowned: 2,
//             petcurrentstatus: "Alive",
//             petvaccination: true,
//             adopterid: null                         // FK
//         }
//     ],

//     // Multivalued householdadults
//     householdAdults: [
//         {
//             householdadultid: null,                 // PK (auto generated)
//             adultname: "San Juan, Mario N.",
//             adultallergy: true,
//             workcontactnum: null,
//             adultemployer: null,
//             adultworkaddress: null,
//             adopterid: null                         // FK
//         },
//         {
//             householdadultid: null,                 // PK (auto generated)
//             adultname: "Rails, Ruby, E.",
//             adultallergy: false,
//             workcontactnum: "(02) 8741 1692",
//             adultemployer: "Puregold",
//             adultworkaddress: "J297+8JR G. Araneta Avenue, Quezon City",
//             adopterid: null                         // FK
//         },
//         {
//             householdadultid: null,                 // PK (auto generated)
//             adultname: "Dela Cruz, Ana P.",
//             adultallergy: false,
//             workcontactnum: "0917-123-4567",
//             adultemployer: "Tech Solutions",
//             adultworkaddress: "123 Main St, Manila",
//             adopterid: null                         // FK
//         },
//         {
//             householdadultid: null,                 // PK (auto generated)
//             adultname: "Santos, Luis M.",
//             adultallergy: true,
//             workcontactnum: null,
//             adultemployer: null,
//             adultworkaddress: null,
//             adopterid: null                         // FK
//         }
//     ]
// }

// // EXAMPLE OF DATA INSERTION WITHOUT SPOUSE, HOUSEHOLD ADULT, ADOPTER PETS
// const adopterData = {
//     // Contains adopter, adopterhomedetails, and spouse
//     adopter: {
//         adopterId: "ADP-0000",                            // PK (auto generated)
//         adopterName: "King",
//         contactNum: "0917-111-2222",
//         emailAddress: "juan.garcia@example.com",
//         addressDetails: {
//             adopterAddressId: "HOME-0000",                 // PK (auto generated)
//             zipcode: "1100",
//             homeAddress: "123 Main St",
//             city: "Manila",
//             state: "NCR",
//             housingStatus: "Own",
//             homePetPolicy: "ALLOWED",
//             windowScreens: true,
//             homeChildrenNum: 2,
//             petLivingArea: "Indoors"
//         },
//         employmentStatus: "Working",
//         workingHrs: 9,
//         workContactNum: "0917-222-3333",
//         employerName: "Tech Solutions",
//         workAddress: "123 Main St, Manila",
//         petAloneHours: 5,
//         petCareTaker: "Self",
//         spouse: null // Adopter without spouse
//     },

//     // Multivalued adopterpets
//     adopterPets: [
//         // Adopter without pets
//     ],

//     // Multivalued householdadults
//     householdAdults: [
//         // Adopter without other adults in the household
//     ]
// }

function sendAdopter(adopterData) {
    fetch("http://127.0.0.1:8080/api/adoption-record/full-application/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(adopterData)
    })

    .then(response => response.text())

    .then(data => {
        console.log("Success:", data);
        alert("Adopter submitted successfully!");
    })

    .catch(error => {
        console.error("Error:", error);
        alert("Failed to submit adopter.");
    });
}

function deleteAllAdopter() {
    fetch(`http://127.0.0.1:8080/api/adoption-record/delete-all-records`, {
        method: "DELETE"
    })

    .then(response => response.text())

    .then(data => {
        console.log("Success:", data);
        alert("Adopter deleted successfully!");
    })

    .catch(error => {
        console.error("Error:", error);
        alert("Failed to delete adopter.");
    });
}

function deleteAdopter(adopterId) {
    fetch(`http://127.0.0.1:8080/api/adoption-record/full-application/${adopterId}/delete-record`, {
        method: "DELETE"
    })

    .then(response => response.text())

    .then(data => {
        console.log("Success:", data);
        alert("Adopter deleted successfully!");
    })

    .catch(error => {
        console.error("Error:", error);
        alert("Failed to delete adopter.");
    });
}

function getAdopter(adopterId) {
    fetch(`http://127.0.0.1:8080/api/adoption-record/full-application/${adopterId}`, {
        method: "GET"
    })

    .then(response => response.json())

    .then(data => {
        console.log("Success:", data);
        alert("Adopter retrieved successfully!");
    })

    .catch(error => {
        console.error("Error:", error);
        alert("Failed to retrieve adopter.");
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // Collect data from form fields
        const adopterName = document.getElementById("adopterName").value.trim();
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        const adopterData = {
            adopter: {
                adopterId: null,
                adopterName: adopterName,
                contactNum: contactNumber,
                emailAddress: emailAddress,
                addressDetails: {
                    adopterAddressId: null,
                    zipcode: document.getElementById("zipcode").value,
                    homeAddress: document.getElementById("homeAddress").value,
                    city: document.getElementById("city").value,
                    state: document.getElementById("state").value,
                    housingStatus: (document.querySelector('input[name="housingStatus"]:checked') || {}).value || "",
                    homePetPolicy: (document.querySelector('input[name="homePetPolicy"]:checked') || {}).value || "",
                    WindowScreens: (document.querySelector('input[name="WindowScreens"]:checked') || {}).value || "",
                    homeChildrenNum: parseInt((document.getElementById("numChildren") || {value: ""}).value, 10) || 0,
                    petLivingArea: (document.querySelector('input[name="petKeepingArea"]:checked') || {}).value || ""
                },
                employmentStatus: (document.querySelector('input[name="employmentStatus"]:checked') || {}).value || "",
                adultWorkingHours: parseInt(document.getElementById("adultWorkingHours").value, 10) || 0,
                adultWorkContactNumber: document.getElementById("adultWorkContactNumber").value,
                employerName: document.getElementById("employerName").value,
                adultCompanyAddress: document.getElementById("adultCompanyAddress").value,
                maxHoursAlone: parseInt(document.getElementById("maxHoursAlone").value, 10) || 0,
                petCareTaker: (document.querySelector('input[name="petCareTaker"]:checked') || {}).value || "",
                spouse: {
                    adopterId: null,
                    spouseCompanyAddress: (document.getElementById("spouseWorkAddress") || {value: ""}).value,
                    spouseWorkingHours: parseInt((document.getElementById("spouseWorkingHrs") || {value: ""}).value, 10) || 0,
                    spouseId: null,
                    spouseName: document.getElementById("spouseName").value,
                    spouseEmployerName: (document.getElementById("spouseEmployerName") || {value: ""}).value,
                    spouseWorkContactNumber: (document.getElementById("spouseContactNum") || {value: ""}).value
                }
            },
            adopterPets: [
                {
                    petid: null,
                    petbreed: document.getElementById("petBreed").value,
                    petage: parseInt((document.getElementById("petAge") || {value: ""}).value, 10) || 0,
                    petspayneuterstatus: (document.querySelector('input[name="petSpayNeuterStatus"]:checked') || {}).value || "",
                    petyrsowned: parseInt((document.getElementById("petYearsOwned") || {value: ""}).value, 10) || 0,
                    petcurrentstatus: (document.querySelector('input[name="petCurrentStatus"]:checked') || {}).value || "",
                    petvaccination: (document.getElementById("petVaccination") || {checked: false}).checked,
                    adopterid: null
                }
            ],
            householdAdults: [
                {
                    householdadultid: null,
                    adultName: (document.getElementById("adultName") || {value: ""}).value,
                    adultAllergy: (document.getElementById("adultAllergy") || {checked: false}).checked,
                    adultWorkContactNum: (document.getElementById("adultWorkContactNum") || {value: ""}).value,
                    adultEmployerName: (document.getElementById("adultEmployerName") || {value: ""}).value,
                    adultCompanyAddress: (document.getElementById("adultCompanyAddress") || {value: ""}).value,
                    adultWorkingHours: parseInt((document.getElementById("adultWorkingHrs") || {value: ""}).value, 10) || 0,
                    adopterid: null
                }
            ]
        };
        
        sendAdopter(adopterData);
    });
});