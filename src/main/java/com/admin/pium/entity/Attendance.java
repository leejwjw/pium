package com.admin.pium.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {

    private Long id;
    private Long adminId;
    private Long studentId;
    private LocalDate attendanceDate;
    private Boolean isPresent = true;
    private String progressMemo;
    private String absenceReason; // 결석 사유
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
