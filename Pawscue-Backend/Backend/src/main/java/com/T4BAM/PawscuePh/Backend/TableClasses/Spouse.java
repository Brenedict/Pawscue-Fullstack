package com.T4BAM.PawscuePh.Backend.TableClasses;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "spouse")
public class Spouse {
    @Id
    @Column(name = "spouseid")
    private String SpouseId; 

    @Column(name = "spousename")
    private String SpouseName; 

    @Column(name = "workinghrs")
    private int WorkingHrs = 0; 

    @Column(name = "workcontactnum")
    private String WorkContactNum; 

    @Column(name = "employername")
    private String EmployerName; 

    @Column(name = "workaddress")
    private String WorkAddress;  

    // @OneToOne
    // @JoinColumn(name = "adopterid")
    @Column(name = "adopterid")
    private String AdopterId;

    public Spouse() {}

    public String getSpouseId() {
    return SpouseId;
    }

    public void setSpouseId(String spouseId) {
        this.SpouseId = spouseId;
    }

    public String getSpouseName() {
        return SpouseName;
    }

    public void setSpouseName(String spouseName) {
        this.SpouseName = spouseName;
    }

    public int getWorkingHrs() {
        return WorkingHrs;
    }

    public void setWorkingHrs(int workingHrs) {
        this.WorkingHrs = workingHrs;
    }

    public String getWorkContactNum() {
        return WorkContactNum;
    }

    public void setWorkContactNum(String workContactNum) {
        this.WorkContactNum = workContactNum;
    }

    public String getEmployerName() {
        return EmployerName;
    }

    public void setEmployerName(String employerName) {
        this.EmployerName = employerName;
    }

    public String getWorkAddress() {
        return WorkAddress;
    }

    public void setWorkAddress(String workAddress) {
        this.WorkAddress = workAddress;
    }

    public String getAdopterId() {
        return AdopterId;
    }

    public void setAdopterId(String adopterId) {
        this.AdopterId = adopterId;
    }

}
