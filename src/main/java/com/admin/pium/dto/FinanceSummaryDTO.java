package com.admin.pium.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinanceSummaryDTO {
    private String yearMonth;
    private Integer totalIncome;
    private Integer totalExpense;
    private Integer netProfit;
    private Integer totalPaidPayments;
    private Integer totalPendingPayments;
}
