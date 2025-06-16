package com.T4BAM.PawscuePh.Backend.TableClasses;

import jakarta.persistence.*;

@Entity
@Table(name = "adopter_pets")
public class AdopterPets {

    @Id
    @Column(name = "petid")
    private String petid;

    @Column(name = "petbreed")
    private String petbreed;

    @Column(name = "petage")
    private int petage = 0;

    @Column(name = "petspayneuterstatus")
    private String petspayneuterstatus = "None";

    @Column(name = "petyrsowned")
    private int petyrsowned = 0;

    @Column(name = "petcurrentstatus")
    private String petcurrentstatus = "Alive";

    @Column(name = "petvaccination")
    private boolean petvaccination = false;

    @Column(name = "adopterid")
    private String adopterid;

    // Default constructor
    public AdopterPets() {
    }

    // Getters and Setters

    public String getPetid() {
        return petid;
    }

    public void setPetid(String petid) {
        this.petid = petid;
    }

    public String getPetbreed() {
        return petbreed;
    }

    public void setPetbreed(String petbreed) {
        this.petbreed = petbreed;
    }

    public int getPetage() {
        return petage;
    }

    public void setPetage(int petage) {
        this.petage = petage;
    }

    public String getPetspayneuterstatus() {
        return petspayneuterstatus;
    }

    public void setPetspayneuterstatus(String petspayneuterstatus) {
        this.petspayneuterstatus = petspayneuterstatus;
    }

    public int getPetyrsowned() {
        return petyrsowned;
    }

    public void setPetyrsowned(int petyrsowned) {
        this.petyrsowned = petyrsowned;
    }

    public String getPetcurrentstatus() {
        return petcurrentstatus;
    }

    public void setPetcurrentstatus(String petcurrentstatus) {
        this.petcurrentstatus = petcurrentstatus;
    }

    public boolean isPetvaccination() {
        return petvaccination;
    }

    public void setPetvaccination(boolean petvaccination) {
        this.petvaccination = petvaccination;
    }

    public String getAdopterid() {
        return adopterid;
    }

    public void setAdopterid(String adopterid) {
        this.adopterid = adopterid;
    }
}
