package com.T4BAM.PawscuePh.Backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;

// Entity Imports
import com.T4BAM.PawscuePh.Backend.TableClasses.Adopter;
import com.T4BAM.PawscuePh.Backend.TableClasses.AdopterHomeDetails;
import com.T4BAM.PawscuePh.Backend.TableClasses.AdopterPets;
import com.T4BAM.PawscuePh.Backend.TableClasses.AdoptionApplicationDTO;
import com.T4BAM.PawscuePh.Backend.TableClasses.HouseholdAdults;
import com.T4BAM.PawscuePh.Backend.TableClasses.Spouse;

// Entity Repository Imports
import com.T4BAM.PawscuePh.Backend.TableRepositories.Adopter_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.AdopterHomeDetails_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.AdopterPets_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.HouseholdAdults_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.Spouse_Repository;
import com.T4BAM.PawscuePh.Backend.service.AdoptionFormInsertionLogic;
import com.T4BAM.PawscuePh.Backend.service.IdGeneration;

import jakarta.transaction.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/adoption-record")
public class MainController {

    private final Adopter_Repository adopterRepository;
    private final AdopterHomeDetails_Repository adopterHomeDetailsRepository;
    private final AdopterPets_Repository adopterPetsRepository;
    private final HouseholdAdults_Repository householdAdultsRepository;
    private final Spouse_Repository spouseRepository;
    private final IdGeneration idGeneration;
    private final AdoptionFormInsertionLogic adoptionFormInsertionLogic;

    @Autowired
    public MainController(
            Adopter_Repository adopterRepository, 
            AdopterHomeDetails_Repository adopterHomeDetailsRepository,
            AdopterPets_Repository adopterPetsRepository,
            HouseholdAdults_Repository householdAdultsRepository,
            Spouse_Repository spouseRepository,
            IdGeneration idGeneration,
            AdoptionFormInsertionLogic adoptionFormInsertionLogic) 
    {
        this.adopterRepository = adopterRepository;
        this.adopterHomeDetailsRepository = adopterHomeDetailsRepository;
        this.adopterPetsRepository = adopterPetsRepository;
        this.householdAdultsRepository = householdAdultsRepository;
        this.spouseRepository = spouseRepository;
        this.idGeneration = idGeneration;
        this.adoptionFormInsertionLogic = adoptionFormInsertionLogic;
    }

    // General Fetch GET method requests
    @CrossOrigin(origins = "*")
    @GetMapping(path = "/adopter")
    public List<Adopter> getAdopters() {
        return adopterRepository.findAll();
    }
    
    @CrossOrigin(origins = "*")
    @GetMapping(path = "/adopter-home-details")
    public List<AdopterHomeDetails> getAdopterHomeDetails() {
        return adopterHomeDetailsRepository.findAll();
    }

    @CrossOrigin(origins = "*")
    @GetMapping(path = "/adopter-pets") 
    public List<AdopterPets> getAdopterPets() {
        return adopterPetsRepository.findAll();
    }

    @CrossOrigin(origins = "*")
    @GetMapping(path = "/household-adults")
    public List<HouseholdAdults> getHouseholdAdults() {
        return householdAdultsRepository.findAll();
    }

    @CrossOrigin(origins = "*")
    @GetMapping(path = "/spouse")
    public List<Spouse> getSpouse() {
        return spouseRepository.findAll();
    }

    @CrossOrigin(origins = "*")
    @GetMapping(path = "/adopter/{adopterId}")
    public Adopter getAdopterById(@PathVariable String adopterId) {
        return adopterRepository.getAdopterById(adopterId);
    }

    // >> CRUD Function Operations

    // DELETE Function. WARNING: DELETES ALL RECORDS!
    @CrossOrigin(origins = "*")
    @Transactional
    @DeleteMapping(path = "/delete-all-records")
    public void deleteAllRecords() {
        adopterRepository.deleteAllAdopterRecords();
        adopterHomeDetailsRepository.deleteAllAdopterHomeDetailsRecords();
    }

    // DELETE Function. Deletes the record of an adopter specified by {adopterId}
    @CrossOrigin(origins = "*")
    @Transactional
    @DeleteMapping(path = "/full-application/{adopterId}/delete-record")
    public void deleteRecord(@PathVariable String adopterId) {
        // Queries the adopterAddressId from adopter record since home details is not affected by cascade deletion
        String adopterAddressId = adopterRepository.getAdopterById(adopterId).getAddressDetails().getAdopterAddressId();
        
        adopterRepository.deleteAdopterRecord(adopterId);
        adopterHomeDetailsRepository.deleteAdopterHomeDetailsRecord(adopterAddressId);
    }

    // POST Function. Saves adoption record by API requests with the use of JSON.
    @CrossOrigin(origins = "*")
    @Transactional
    @PostMapping("/full-application/save")
    public ResponseEntity<AdoptionApplicationDTO> postFullAdoptionApplication(@RequestBody AdoptionApplicationDTO fullAdoptionForm) {
        // Generates the main adopterId
        String adopterId = idGeneration.generateAdopterId();

        // Handles adopter, spouse, home details primary key IDs, foreign keys logic, and insertion
        fullAdoptionForm.setAdopter(adoptionFormInsertionLogic.save_Adopter_and_HomeDetails_and_Spouse(fullAdoptionForm.getAdopter(), adopterId));
        
        // Handles single/multiple adopter pets id generation, foreign key logic and insertion
        fullAdoptionForm.setAdopterPets(adoptionFormInsertionLogic.saveAdopterPets(fullAdoptionForm.getAdopterPets(), adopterId));
        
        // Handles single/multiple household adults id generation, foreign key logic and insertion
        fullAdoptionForm.setHouseholdAdults(adoptionFormInsertionLogic.saveHouseholdAdults(fullAdoptionForm.getHouseholdAdults(), adopterId));
    
        return ResponseEntity.ok(fullAdoptionForm);
    }

    // GET Function. Gets the record of an adopter specified by {adopterId}
    @CrossOrigin(origins = "*")
    @GetMapping("/full-application/{adopterId}")
    public ResponseEntity<AdoptionApplicationDTO> getFullAdoptionApplication(@PathVariable String adopterId) {
        AdoptionApplicationDTO adopterFullApplicationForm = new AdoptionApplicationDTO();

        adopterFullApplicationForm.setAdopter(adopterRepository.getAdopterById(adopterId));
        adopterFullApplicationForm.setAdopterPets(adopterPetsRepository.getAdopterPetsById(adopterId));
        adopterFullApplicationForm.setHouseholdAdults(householdAdultsRepository.getHouseholdAdultsById(adopterId));

        return ResponseEntity.ok(adopterFullApplicationForm);
    }
    
    @CrossOrigin(origins = "*")
    @GetMapping("/full-application")
    public List<AdoptionApplicationDTO> getAllAdoptionApplication() {
        List<AdoptionApplicationDTO> adopterFullApplicationForm = new ArrayList<>();

        List<Adopter> adopters = adopterRepository.findAll();

        for (Adopter adopter : adopters) {
            AdoptionApplicationDTO dto = new AdoptionApplicationDTO();

            dto.setAdopter(adopter);
            // Add other fields accordingly...

            List<AdopterPets> pets = adopterPetsRepository.getAdopterPetsById(adopter.getAdopterId());
            List<HouseholdAdults> adults = householdAdultsRepository.getHouseholdAdultsById(adopter.getAdopterId());

            dto.setAdopterPets(pets);;
            dto.setHouseholdAdults(adults);

            adopterFullApplicationForm.add(dto);
        }

        return adopterFullApplicationForm;
    }

    // UPDATE (POST) Function. Updates the details of the adopter
    @CrossOrigin(origins = "*")
    @Transactional
    @PostMapping("full-application/update")
    public ResponseEntity<AdoptionApplicationDTO> updateFullAdoptionApplication(@RequestBody AdoptionApplicationDTO updated_fullAdoptionForm) {
        System.out.println(updated_fullAdoptionForm);

        String adopterId = updated_fullAdoptionForm.getAdopter().getAdopterId();
        String adopterAddressId = updated_fullAdoptionForm.getAdopter().getAddressDetails().getAdopterAddressId();

        Spouse tempSpouse = updated_fullAdoptionForm.getAdopter().getSpouse();
        List<AdopterPets> tempAdopterPets = updated_fullAdoptionForm.getAdopterPets();
        List<HouseholdAdults> tempHouseholdAdults = updated_fullAdoptionForm.getHouseholdAdults();

        //Clear previous FK dependencies FIRST
        spouseRepository.deleteSpouseRecord(adopterId);
        adopterPetsRepository.deleteAdopterPetsRecord(adopterId);
        householdAdultsRepository.deleteHouseholdAdultsRecord(adopterId);

        // Set spouse to null *after FK rows are deleted*
        updated_fullAdoptionForm.getAdopter().setSpouse(null);

        // Save the adopter core data
        adopterRepository.save(updated_fullAdoptionForm.getAdopter());

        // Save new FK dependencies (spouse/pets/adults)
        if (tempSpouse != null) {
            tempSpouse = adoptionFormInsertionLogic.saveSpouse(tempSpouse, adopterId, adopterAddressId);
            updated_fullAdoptionForm.getAdopter().setSpouse(tempSpouse);
        }

        if (tempAdopterPets != null && !tempAdopterPets.isEmpty()) {
            tempAdopterPets = adoptionFormInsertionLogic.saveAdopterPets(tempAdopterPets, adopterId);
        }

        if (tempHouseholdAdults != null && !tempHouseholdAdults.isEmpty()) {
            tempHouseholdAdults = adoptionFormInsertionLogic.saveHouseholdAdults(tempHouseholdAdults, adopterId);
        }

        // Update DTO before sending response
        updated_fullAdoptionForm.setAdopterPets(tempAdopterPets);
        updated_fullAdoptionForm.setHouseholdAdults(tempHouseholdAdults);

        return ResponseEntity.ok(updated_fullAdoptionForm);
    }
    
    // NEW/MODIFIED GET endpoint to fetch all full adoption applications
    @CrossOrigin(origins = "*")
    @GetMapping("/full-application/all")
    public ResponseEntity<List<AdoptionApplicationDTO>> getAllFullAdoptionApplications() {
        List<AdoptionApplicationDTO> allApplications = new ArrayList<>();
        List<Adopter> adopters = adopterRepository.findAll(); // Get all basic Adopter entities

        for (Adopter adopter : adopters) {
            AdoptionApplicationDTO applicationDTO = new AdoptionApplicationDTO();

            // Re-fetch the Adopter by ID to ensure all lazily loaded relationships (like addressDetails and spouse) are fully initialized.
            // This mirrors the behavior of getFullAdoptionApplication which loads all related data for a single ID.
            Adopter fullyLoadedAdopter = adopterRepository.getAdopterById(adopter.getAdopterId());
            if (fullyLoadedAdopter != null) {
                applicationDTO.setAdopter(fullyLoadedAdopter); // Set the fully loaded adopter object
            } else {
                // Fallback if for some reason the adopter is not found by ID (shouldn't happen if findAll() returned it)
                applicationDTO.setAdopter(adopter); // Use the original potentially incomplete adopter object
                System.err.println("Warning: Adopter with ID " + adopter.getAdopterId() + " not found when re-fetching for full details.");
            }

            // Fetch and set AdopterPets and HouseholdAdults using the adopterId
            applicationDTO.setAdopterPets(adopterPetsRepository.getAdopterPetsById(adopter.getAdopterId()));
            applicationDTO.setHouseholdAdults(householdAdultsRepository.getHouseholdAdultsById(adopter.getAdopterId()));

            allApplications.add(applicationDTO);
        }
        return ResponseEntity.ok(allApplications);
    }
}
