package com.admin.pium.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expense {

    private Long id;
    private Long adminId; // 관리자 ID
    private String expenseType;
    private String category; // 품목 분류 (인건비, 재료비, 임대료 등)
    private Integer amount;
    private LocalDate expenseDate;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
