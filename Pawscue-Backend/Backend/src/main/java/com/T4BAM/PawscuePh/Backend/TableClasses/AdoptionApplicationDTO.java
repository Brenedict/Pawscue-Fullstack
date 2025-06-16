package com.T4BAM.PawscuePh.Backend.TableClasses;

import java.util.List;

public class AdoptionApplicationDTO {
    private Adopter adopter;
    private List<AdopterPets> adopterPets;
    private List<HouseholdAdults> householdAdults;

    public Adopter getAdopter() {
        return adopter;
    }

    public void setAdopter(Adopter adopter) {
        this.adopter = adopter;
    }

    public List<AdopterPets> getAdopterPets() {
        return adopterPets;
    }

    public void setAdopterPets(List<AdopterPets> adopterPets) {
        this.adopterPets = adopterPets;
    }

    public List<HouseholdAdults> getHouseholdAdults() {
        return householdAdults;
    }

    public void setHouseholdAdults(List<HouseholdAdults> householdAdults) {
        this.householdAdults = householdAdults;
    }
}