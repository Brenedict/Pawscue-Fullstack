package com.T4BAM.PawscuePh.Backend.TableRepositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.T4BAM.PawscuePh.Backend.TableClasses.Spouse;

@Repository
public interface Spouse_Repository extends JpaRepository<Spouse, String> {
    // Retrieves the last SpouseId
    @Query(value = "SELECT SpouseId FROM pawscueadoptions.spouse ORDER BY SpouseId desc LIMIT 1", nativeQuery = true)
    String getLastId();

    // General tuple deletion query
    @Modifying
    @Query(value = "DELETE FROM pawscueadoptions.spouse WHERE AdopterId = :adopterId", nativeQuery = true)
    void deleteSpouseRecord(@Param("adopterId") String adopterId);
}
