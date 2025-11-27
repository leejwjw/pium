package com.admin.pium.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EducationRecord {

    private Long id;
    private String yearMonth; // Format: YYYY-MM
    private Integer weekNumber; // 1-5
    private String subject;
    private String content;
    private String imagePath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
