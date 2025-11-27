package com.admin.pium.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    private Long id;
    private Long studentId;
    private LocalDate paymentDate;
    private Integer amount;
    private String yearMonth; // Format: YYYY-MM
    private String status = "PAID"; // PAID, PENDING, CANCELLED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
