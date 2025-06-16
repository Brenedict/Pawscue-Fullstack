package com.T4BAM.PawscuePh.Backend;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.T4BAM.PawscuePh.Backend.TableClasses.AdoptionApplicationDTO;
import com.T4BAM.PawscuePh.Backend.TableClasses.AppData;

import com.T4BAM.PawscuePh.Backend.TableRepositories.AppData_Repository;
import com.T4BAM.PawscuePh.Backend.service.IdGeneration;

import jakarta.transaction.Transactional;


@RestController
@RequestMapping("/api/appdata")
public class AppDataController {
    private final AppData_Repository appDataRepository;

    private final IdGeneration idGeneration;

    @Autowired
    public AppDataController(AppData_Repository appDataRepository, IdGeneration idGeneration) {
        this.appDataRepository = appDataRepository;
        this.idGeneration = idGeneration;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/login")
    public ResponseEntity<AppData> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        AppData user = appDataRepository.findByEmailAndPasswordHash(email, password);
        if (user != null) {
            return ResponseEntity.ok(user); // Send user data (sanitize in real app)
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }  
    
    @CrossOrigin(origins = "*")
    @GetMapping("/email={email}")
    public boolean checkUniqueEmail(@PathVariable String email) {
        return appDataRepository.checkUniqueEmail(email) == 0;
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{userId}")
    public AppData getUserData(@PathVariable String userId) {
        return appDataRepository.findByUserId(userId);
    }

    @CrossOrigin(origins = "*")
    @Transactional
    @PostMapping("/save")
    public ResponseEntity<AppData> postUserData(@RequestBody AppData appData) {
        appData.setUserId(idGeneration.generateUserId());
        appDataRepository.save(appData);
        return ResponseEntity.ok(appData);
    }

    @CrossOrigin(origins = "*")
    @Transactional
    @PostMapping("/update")
    public ResponseEntity<AppData> postUpdatedUserData(@RequestBody AppData appData) {
        appDataRepository.save(appData);
        return ResponseEntity.ok(appData);
    }

    @CrossOrigin(origins = "*")
    @Transactional
    @Modifying
    @PostMapping("/userId={userId}&adopterId={adopterId}")
    public ResponseEntity<Void> saveAdopterId(@PathVariable String userId, @PathVariable String adopterId) {
        if(adopterId == "null") adopterId = null;

        appDataRepository.setAdopterId(adopterId, userId);
        return ResponseEntity.ok().build();
    }

    @CrossOrigin(
        origins = "http://127.0.0.1:5500",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
    )
    @PutMapping("/appdata/remove-adopter/{userId}")
    public void removeAdopterFromUser(@PathVariable String userId) {
        AppData user = appDataRepository.findById(userId).orElseThrow();
        user.setAdopterId(null); // Or user.setAdopter(null) if it's an object ref
        appDataRepository.save(user);
    }
}   
