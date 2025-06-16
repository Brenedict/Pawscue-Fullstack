package com.T4BAM.PawscuePh.Backend.TableRepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.T4BAM.PawscuePh.Backend.TableClasses.AppData;
import java.util.List;


public interface AppData_Repository extends JpaRepository<AppData, String> {
    @Query(value = "SELECT * FROM pawscueadoptions.appdata WHERE email = :email AND password = :password", nativeQuery = true)
    AppData checkCredentials(@Param("email") String email, @Param("password") String password);

    @Query(value = "SELECT COUNT(*) FROM pawscueadoptions.appdata WHERE email = :email", nativeQuery = true)
    int checkUniqueEmail(@Param("email") String email);

    // Retrieves the last AdopterId
    @Query(value = "SELECT userId FROM pawscueadoptions.appdata ORDER BY userId desc LIMIT 1", nativeQuery = true)
    String getLastId();

    @Modifying
    @Query(value = "UPDATE pawscueadoptions.appdata SET adopterId = :adopterId WHERE userId = :userId", nativeQuery = true)
    void setAdopterId(@Param("adopterId") String adopterId, @Param("userId") String userId);

    AppData findByEmailAndPasswordHash(String email, String passwordHash);

    AppData findByUserId(String userId);

    
}
