package com.T4BAM.PawscuePh.Backend.TableClasses;

import jakarta.persistence.*;

@Entity
@Table(name = "adopter_home_details")
public class AdopterHomeDetails {
    @Id
    @Column(name = "adopteraddressid")
    private String adopterAddressId;

    @Column(name = "zipcode")
    private String zipcode;

    @Column(name = "homeaddress")
    private String homeAddress;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "housingstatus")
    private String housingStatus = "Rent";

    @Column(name = "homepetpolicy")
    private String homePetPolicy = "ALLOWED";

    @Column(name = "windowscreens")
    private Boolean windowScreens = false;

    @Column(name = "homechildrennum")
    private int homeChildrenNum = 0;

    @Column(name = "petlivingarea")
    private String petLivingArea = "Indoors";

    public AdopterHomeDetails() {
    }

    public String getAdopterAddressId() {
        return adopterAddressId;
    }

    public void setAdopterAddressId(String adopterAddressId) {
        this.adopterAddressId = adopterAddressId;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }

    public String getHomeAddress() {
        return homeAddress;
    }

    public void setHomeAddress(String homeAddress) {
        this.homeAddress = homeAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getHousingStatus() {
        return housingStatus;
    }

    public void setHousingStatus(String housingStatus) {
        this.housingStatus = housingStatus;
    }

    public String getHomePetPolicy() {
        return homePetPolicy;
    }

    public void setHomePetPolicy(String homePetPolicy) {
        this.homePetPolicy = homePetPolicy;
    }

    public boolean isWindowScreens() {
        return windowScreens;
    }

    public void setWindowScreens(boolean windowScreens) {
        this.windowScreens = windowScreens;
    }

    public int getHomeChildrenNum() {
        return homeChildrenNum;
    }

    public void setHomeChildrenNum(int homeChildrenNum) {
        this.homeChildrenNum = homeChildrenNum;
    }

    public String getPetLivingArea() {
        return petLivingArea;
    }

    public void setPetLivingArea(String petLivingArea) {
        this.petLivingArea = petLivingArea;
    }

    @Override
public String toString() {
    return "AdopterHomeDetails{" +
            "adopterAddressId='" + adopterAddressId + '\'' +
            ", zipcode='" + zipcode + '\'' +
            ", homeAddress='" + homeAddress + '\'' +
            ", city='" + city + '\'' +
            ", state='" + state + '\'' +
            ", housingStatus='" + housingStatus + '\'' +
            ", homePetPolicy='" + homePetPolicy + '\'' +
            ", windowScreens=" + windowScreens +
            ", homeChildrenNum=" + homeChildrenNum +
            ", petLivingArea='" + petLivingArea + '\'' +
            '}';
    }
}
