package com.T4BAM.PawscuePh.Backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.T4BAM.PawscuePh.Backend.TableRepositories.AdopterHomeDetails_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.AdopterPets_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.Adopter_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.HouseholdAdults_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.Spouse_Repository;
import com.T4BAM.PawscuePh.Backend.TableRepositories.AppData_Repository;

@Service
public class IdGeneration {
    private final Adopter_Repository adopterRepository;
    private final AdopterHomeDetails_Repository adopterHomeDetailsRepository;
    private final AdopterPets_Repository adopterPetsRepository;
    private final HouseholdAdults_Repository householdAdultsRepository;
    private final Spouse_Repository spouseRepository;
    private final AppData_Repository appDataRepository;

    @Autowired
    public IdGeneration(
            Adopter_Repository adopterRepository, 
            AdopterHomeDetails_Repository adopterHomeDetailsRepository,
            AdopterPets_Repository adopterPetsRepository,
            HouseholdAdults_Repository householdAdultsRepository,
            Spouse_Repository spouseRepository,
            AppData_Repository appDataRepository
        ) 
    {
        this.adopterRepository = adopterRepository;
        this.adopterHomeDetailsRepository = adopterHomeDetailsRepository;
        this.adopterPetsRepository = adopterPetsRepository;
        this.householdAdultsRepository = householdAdultsRepository;
        this.spouseRepository = spouseRepository;
        this.appDataRepository = appDataRepository;
    }

    public String generateAdopterId() {
        String lastId = adopterRepository.getLastId();
        if(lastId != null && !lastId.isEmpty()) {
            int numericPart = Integer.parseInt(lastId.substring(lastId.indexOf("-")+1));
            return "ADP-" + String.format("%04d", numericPart + 1);
        }
        else {
            return "ADP-0000";
        }
    }

    public String generateAdopterAddressId() {
        String lastId = adopterHomeDetailsRepository.getLastId();
        if(lastId != null && !lastId.isEmpty()) {
            int numericPart = Integer.parseInt(lastId.substring(lastId.indexOf("-")+1));
            return "HOME-" + String.format("%04d", numericPart + 1);
        }
        else {
            return "HOME-0000";
        }
    }

    public String generateAdopterPetsId() {
        String lastId = adopterPetsRepository.getLastId();
        if(lastId != null && !lastId.isEmpty()) {
            int numericPart = Integer.parseInt(lastId.substring(lastId.indexOf("-")+1));
            return "PET-" + String.format("%04d", numericPart + 1);
        }
        else {
            return "PET-0000";
        }
    }

    public String generateHouseholdAdultsId() {
        String lastId = householdAdultsRepository.getLastId();
        if(lastId != null && !lastId.isEmpty()) {
            int numericPart = Integer.parseInt(lastId.substring(lastId.indexOf("-")+1));
            return "HA-" + String.format("%04d", numericPart + 1);
        }
        else {
            return "HA-0000";
        }
    }

    public String generateSpouseId() {
        String lastId = spouseRepository.getLastId();
        if(lastId != null && !lastId.isEmpty()) {
            int numericPart = Integer.parseInt(lastId.substring(lastId.indexOf("-")+1));
            return "AS-" + String.format("%04d", numericPart + 1);
        }
        else {
            return "AS-0000";
        }
    }

    public String generateUserId() {
        String lastId = appDataRepository.getLastId();
        if(lastId != null && !lastId.isEmpty()) {
            int numericPart = Integer.parseInt(lastId.substring(lastId.indexOf("-")+1));
            return "USER-" + String.format("%04d", numericPart + 1);
        }
        else {
            return "USER-0000";
        }
    }
}
