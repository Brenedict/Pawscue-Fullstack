package com.T4BAM.PawscuePh.Backend.TableRepositories;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.T4BAM.PawscuePh.Backend.TableClasses.Adopter;

@Repository
public interface Adopter_Repository extends JpaRepository<Adopter, String> {
    // Adopterid specified tuple selection query
    @Query(value = "SELECT * FROM pawscueadoptions.adopter WHERE AdopterId = :adopterId", nativeQuery = true)
    Adopter getAdopterById(@Param("adopterId") String adopterId);

    // General tuple deletion query
    @Modifying
    @Query(value = "DELETE FROM pawscueadoptions.adopter WHERE AdopterId = :adopterId", nativeQuery = true)
    void deleteAdopterRecord(@Param("adopterId") String adopterId);

    // Retrieves the last AdopterId
    @Query(value = "SELECT AdopterId FROM pawscueadoptions.adopter ORDER BY AdopterId desc LIMIT 1", nativeQuery = true)
    String getLastId();

    @Modifying
    @Query(value = "UPDATE pawscueadoptions.adopter SET AdopterAddressId = :adopterAddressId, SpouseId = :spouseId WHERE adopterId = :adopterId", nativeQuery = true)
    void updateAdopterForeignKeys(@Param("adopterAddressId") String adopterAddressId, @Param("spouseId") String spouseId, @Param("adopterId") String adopterId);

    // All tuple deletion query
    @Modifying
    @Query(value = "DELETE FROM pawscueadoptions.adopter", nativeQuery = true)
    void deleteAllAdopterRecords();
}
