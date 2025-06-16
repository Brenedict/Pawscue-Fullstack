package com.T4BAM.PawscuePh.Backend.TableRepositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.T4BAM.PawscuePh.Backend.TableClasses.AdopterHomeDetails;

@Repository
public interface AdopterHomeDetails_Repository extends JpaRepository<AdopterHomeDetails, String> {
    // General tuple deletion query
    @Modifying
    @Query(value = "DELETE FROM pawscueadoptions.adopter_home_details WHERE AdopterAddressId = :adopterAddressId", nativeQuery = true)
    void deleteAdopterHomeDetailsRecord(@Param("adopterAddressId") String adopterAddressId);

    // Retrieves the last AdopterAddressId
    @Query(value = "SELECT AdopterAddressId FROM pawscueadoptions.adopter_home_details ORDER BY AdopterAddressId desc LIMIT 1", nativeQuery = true)
    String getLastId();

    // All tuple deletion query
    @Modifying
    @Query(value = "DELETE FROM pawscueadoptions.adopter_home_details", nativeQuery = true)
    void deleteAllAdopterHomeDetailsRecords();
}
