package com.T4BAM.PawscuePh.Backend.TableRepositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.T4BAM.PawscuePh.Backend.TableClasses.Adopter;
import com.T4BAM.PawscuePh.Backend.TableClasses.AdopterPets;

@Repository
public interface AdopterPets_Repository extends JpaRepository<AdopterPets, String> {
    // Adopterid specified tuple selection query
    @Query(value = "SELECT * FROM pawscueadoptions.adopter_pets WHERE AdopterId = :adopterId", nativeQuery = true)
    List<AdopterPets> getAdopterPetsById(@Param("adopterId") String adopterId);
    
    // Retrieves the last PetId
    @Query(value = "SELECT PetId FROM pawscueadoptions.adopter_pets ORDER BY PetId desc LIMIT 1", nativeQuery = true)
    String getLastId();

    // General tuple deletion query
    @Modifying
    @Query(value = "DELETE FROM pawscueadoptions.adopter_pets WHERE AdopterId = :adopterId", nativeQuery = true)
    void deleteAdopterPetsRecord(@Param("adopterId") String adopterId);
}
