package com.T4BAM.PawscuePh.Backend.TableClasses;

import jakarta.persistence.*;

@Entity
@Table(name = "household_adults")
public class HouseholdAdults {

    @Id
    @Column(name = "householdadultid")
    private String householdadultid;

    @Column(name = "adultname")
    private String adultname;

    @Column(name = "adultallergy")
    private boolean adultallergy;

    @Column(name = "workcontactnum")
    private String workcontactnum;

    @Column(name = "adultemployer")
    private String adultemployer;

    @Column(name = "adultworkaddress")
    private String adultworkaddress;

    @Column(name = "adopterid")
    private String adopterid;

    // Default constructor
    public HouseholdAdults() {
    }

    // Getters and Setters

    public String getHouseholdadultid() {
        return householdadultid;
    }

    public void setHouseholdadultid(String householdadultid) {
        this.householdadultid = householdadultid;
    }

    public String getAdultname() {
        return adultname;
    }

    public void setAdultname(String adultname) {
        this.adultname = adultname;
    }

    public boolean isAdultallergy() {
        return adultallergy;
    }

    public void setAdultallergy(boolean adultallergy) {
        this.adultallergy = adultallergy;
    }

    public String getWorkcontactnum() {
        return workcontactnum;
    }

    public void setWorkcontactnum(String workcontactnum) {
        this.workcontactnum = workcontactnum;
    }

    public String getAdultemployer() {
        return adultemployer;
    }

    public void setAdultemployer(String adultemployer) {
        this.adultemployer = adultemployer;
    }

    public String getAdultworkaddress() {
        return adultworkaddress;
    }

    public void setAdultworkaddress(String adultworkaddress) {
        this.adultworkaddress = adultworkaddress;
    }

    public String getAdopterid() {
        return adopterid;
    }

    public void setAdopterid(String adopterid) {
        this.adopterid = adopterid;
    }
}
