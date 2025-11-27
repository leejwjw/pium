package com.admin.pium.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Subject {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
