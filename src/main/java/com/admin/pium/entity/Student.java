package com.admin.pium.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    private Long id;
    private String name;
    private String birthDate;
    private String school;
    private String specialNotes;
    private Boolean mon = false;
    private Boolean tue = false;
    private Boolean wed = false;
    private Boolean thu = false;
    private Boolean fri = false;
    private String parentContact;
    private String studentContact;
    private String status = "ACTIVE"; // ACTIVE, SUSPENDED, WITHDRAWN
    private Integer sessionsPerWeek = 1; // 1 or 2
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
