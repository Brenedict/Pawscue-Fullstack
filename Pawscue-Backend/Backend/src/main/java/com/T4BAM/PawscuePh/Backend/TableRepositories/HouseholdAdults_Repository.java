package com.T4BAM.PawscuePh.Backend.TableRepositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.T4BAM.PawscuePh.Backend.TableClasses.Adopter;
import com.T4BAM.PawscuePh.Backend.TableClasses.AdopterPets;
import com.T4BAM.PawscuePh.Backend.TableClasses.HouseholdAdults;

@Repository
public interface HouseholdAdults_Repository extends JpaRepository<HouseholdAdults, String> {
    // Adopterid specified tuple selection query
    @Query(value = "SELECT * FROM pawscueadoptions.household_adults WHERE AdopterId = :adopterId", nativeQuery = true)
    List<HouseholdAdults> getHouseholdAdultsById(@Param("adopterId") String adopterId);
    
    // Retrieves the last HouseholdAdultId
    @Query(value = "SELECT HouseholdAdultId FROM pawscueadoptions.household_adults ORDER BY HouseholdAdultId desc LIMIT 1", nativeQuery = true)
    String getLastId();

    // General tuple deletion query
    @Modifying
    @Query(value = "DELETE FROM pawscueadoptions.household_adults WHERE AdopterId = :adopterId", nativeQuery = true)
    void deleteHouseholdAdultsRecord(@Param("adopterId") String adopterId);
}
