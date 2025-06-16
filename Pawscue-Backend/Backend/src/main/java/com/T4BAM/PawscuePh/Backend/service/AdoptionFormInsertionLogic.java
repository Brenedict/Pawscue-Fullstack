package com.T4BAM.PawscuePh.Backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.T4BAM.PawscuePh.Backend.TableClasses.Adopter;
import com.T4BAM.PawscuePh.Backend.TableClasses.AdopterHomeDetails;
import com.T4BAM.PawscuePh.Backend.TableClasses.AdopterPets;
import com.T4BAM.PawscuePh.Backend.TableClasses.HouseholdAdults;
import com.T4BAM.PawscuePh.Backend.TableClasses.Spouse;
import com.T4BAM.PawscuePh.Backend.TableRepositories.AdopterHomeDetails_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.AdopterPets_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.Adopter_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.HouseholdAdults_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.Spouse_Repository;

@Service
public class AdoptionFormInsertionLogic {
    private final Adopter_Repository adopterRepository;
    private final AdopterHomeDetails_Repository adopterHomeDetailsRepository;
    private final AdopterPets_Repository adopterPetsRepository;
    private final HouseholdAdults_Repository householdAdultsRepository;
    private final Spouse_Repository spouseRepository;
    private final IdGeneration idGeneration;

    @Autowired
    public AdoptionFormInsertionLogic(
            Adopter_Repository adopterRepository, 
            AdopterHomeDetails_Repository adopterHomeDetailsRepository,
            AdopterPets_Repository adopterPetsRepository,
            HouseholdAdults_Repository householdAdultsRepository,
            Spouse_Repository spouseRepository,
            IdGeneration idGeneration) 
    {
        this.adopterRepository = adopterRepository;
        this.adopterHomeDetailsRepository = adopterHomeDetailsRepository;
        this.adopterPetsRepository = adopterPetsRepository;
        this.householdAdultsRepository = householdAdultsRepository;
        this.spouseRepository = spouseRepository;
        this.idGeneration = idGeneration;
    }

    public Adopter save_Adopter_and_HomeDetails_and_Spouse(Adopter adopter, String adopterId) {
        String adopterAddressId = idGeneration.generateAdopterAddressId();
        String spouseId = idGeneration.generateSpouseId();

        adopter.setAdopterId(adopterId);
        
        AdopterHomeDetails tempAdopterHomeDetails = adopter.getAddressDetails();
        adopter.setAddressDetails(null);

        Spouse tempSpouse = adopter.getSpouse();
        adopter.setSpouse(null);

        // Inserts the JSON into the DBMS without the Adopter class FK's: AdopterAddressId and SpouseId due to their parent and children relation
        adopterRepository.save(adopter);

        // Attaches the adopterAddressId to the AdopterHomeDetails Class
        tempAdopterHomeDetails.setAdopterAddressId(adopterAddressId);
        
        System.out.println(tempAdopterHomeDetails.toString());
        // Saves the home details to its respective relation
        adopterHomeDetailsRepository.save(tempAdopterHomeDetails);

        // Handles logic when the adopter has no spouse
        if(tempSpouse != null) {

            // Attaches the spouseId to the Spouse Class
            tempSpouse.setSpouseId(spouseId);
            
            // Attaches the adopterId to the Spouse Class that references the adopter
            tempSpouse.setAdopterId(adopterId);   
            
            spouseRepository.save(tempSpouse);
        } else {
            spouseId = null;
        }

        // Updates the adopter's foreign keys to correspond to the spouse and adopter home details entities
        adopterRepository.updateAdopterForeignKeys(adopterAddressId, spouseId, adopterId);
        
        // Properly sets the adopter entity to contain it's spouse and home details which was previously removed
        adopter.setAddressDetails(tempAdopterHomeDetails);
        adopter.setSpouse(tempSpouse);


        return adopter;
    }

    public Spouse saveSpouse(Spouse spouse, String adopterId, String adopterAddressId) {
        String spouseId = idGeneration.generateSpouseId();

        // Set PK and FK
        spouse.setSpouseId(spouseId);
        spouse.setAdopterId(adopterId);

        // Saves newly updated spouse
        spouseRepository.save(spouse);

        // Updates the adopter's foreign keys to correspond to the spouse and adopter home details entities
        adopterRepository.updateAdopterForeignKeys(adopterAddressId, spouseId, adopterId);
        
        return spouse;
    }

    public List<AdopterPets> saveAdopterPets(List<AdopterPets> adopterPets, String adopterId) {
        for(int i = 0 ; i < adopterPets.size() ; i++) {
            String petId = idGeneration.generateAdopterPetsId();
            
            adopterPets.get(i).setPetid(petId);
            adopterPets.get(i).setAdopterid(adopterId);

            adopterPetsRepository.save(adopterPets.get(i));
        }

        return adopterPets;
    }

    public List<HouseholdAdults> saveHouseholdAdults(List<HouseholdAdults> householdAdults, String adopterId) {
        for(int i = 0 ; i < householdAdults.size() ; i++) {
            String householdAdultsId = idGeneration.generateHouseholdAdultsId();
            
            householdAdults.get(i).setHouseholdadultid(householdAdultsId);
            householdAdults.get(i).setAdopterid(adopterId);

            householdAdultsRepository.save(householdAdults.get(i));
        }

        return householdAdults;
    }
}
