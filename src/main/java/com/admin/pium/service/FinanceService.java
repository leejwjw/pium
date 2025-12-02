package com.admin.pium.service;

import com.admin.pium.dto.FinanceSummaryDTO;
import com.admin.pium.entity.Expense;
import com.admin.pium.entity.Payment;
import com.admin.pium.mapper.ExpenseMapper;
import com.admin.pium.mapper.PaymentMapper;
import com.admin.pium.security.AdminContext;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final PaymentMapper paymentMapper;
    private final ExpenseMapper expenseMapper;
    private final AdminContext adminContext;

    public FinanceSummaryDTO getMonthlySummary(String yearMonth) {
        Long adminId = adminContext.getCurrentAdminId();

        // Calculate date range for the month
        YearMonth ym = YearMonth.parse(yearMonth, DateTimeFormatter.ofPattern("yyyy-MM"));
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        // Get total income (payments)
        Integer totalIncome = paymentMapper.sumByYearMonth(yearMonth, adminId);
        if (totalIncome == null)
            totalIncome = 0;

        // Get total expenses
        Integer totalExpense = expenseMapper.sumByDateRange(startDate, endDate, adminId);
        if (totalExpense == null)
            totalExpense = 0;

        // Calculate net profit
        Integer netProfit = totalIncome - totalExpense;

        // Get payment counts
        List<Payment> payments = paymentMapper.findByYearMonth(yearMonth, adminId);
        Integer totalPaid = (int) payments.stream().filter(p -> "PAID".equals(p.getStatus())).count();
        Integer totalPending = (int) payments.stream().filter(p -> "PENDING".equals(p.getStatus())).count();

        return new FinanceSummaryDTO(yearMonth, totalIncome, totalExpense, netProfit, totalPaid, totalPending);
    }

    public byte[] generateExcelReport(String yearMonth) throws IOException {
        Long adminId = adminContext.getCurrentAdminId();
        YearMonth ym = YearMonth.parse(yearMonth, DateTimeFormatter.ofPattern("yyyy-MM"));
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        Workbook workbook = new XSSFWorkbook();

        // Create summary sheet
        Sheet summarySheet = workbook.createSheet("요약");
        createSummarySheet(summarySheet, yearMonth);

        // Create payments sheet
        Sheet paymentsSheet = workbook.createSheet("결제내역");
        createPaymentsSheet(paymentsSheet, yearMonth, adminId);

        // Create expenses sheet
        Sheet expensesSheet = workbook.createSheet("지출내역");
        createExpensesSheet(expensesSheet, startDate, endDate, adminId);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return outputStream.toByteArray();
    }

    private void createSummarySheet(Sheet sheet, String yearMonth) {
        FinanceSummaryDTO summary = getMonthlySummary(yearMonth);

        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("구분");
        headerRow.createCell(1).setCellValue("금액");

        int rowNum = 1;
        Row row1 = sheet.createRow(rowNum++);
        row1.createCell(0).setCellValue("총 수입");
        row1.createCell(1).setCellValue(summary.getTotalIncome());

        Row row2 = sheet.createRow(rowNum++);
        row2.createCell(0).setCellValue("총 지출");
        row2.createCell(1).setCellValue(summary.getTotalExpense());

        Row row3 = sheet.createRow(rowNum++);
        row3.createCell(0).setCellValue("순이익");
        row3.createCell(1).setCellValue(summary.getNetProfit());

        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
    }

    private void createPaymentsSheet(Sheet sheet, String yearMonth, Long adminId) {
        List<Payment> payments = paymentMapper.findByYearMonth(yearMonth, adminId);

        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("결제일");
        headerRow.createCell(1).setCellValue("학생ID");
        headerRow.createCell(2).setCellValue("금액");
        headerRow.createCell(3).setCellValue("상태");

        int rowNum = 1;
        for (Payment payment : payments) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(payment.getPaymentDate().toString());
            row.createCell(1).setCellValue(payment.getStudentId());
            row.createCell(2).setCellValue(payment.getAmount());
            row.createCell(3).setCellValue(payment.getStatus());
        }

        for (int i = 0; i < 4; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void createExpensesSheet(Sheet sheet, LocalDate startDate, LocalDate endDate, Long adminId) {
        List<Expense> expenses = expenseMapper.findByDateRange(startDate, endDate, adminId);

        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("지출일");
        headerRow.createCell(1).setCellValue("구분");
        headerRow.createCell(2).setCellValue("금액");
        headerRow.createCell(3).setCellValue("설명");

        int rowNum = 1;
        for (Expense expense : expenses) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(expense.getExpenseDate().toString());
            row.createCell(1).setCellValue(expense.getExpenseType());
            row.createCell(2).setCellValue(expense.getAmount());
            row.createCell(3).setCellValue(expense.getDescription());
        }

        for (int i = 0; i < 4; i++) {
            sheet.autoSizeColumn(i);
        }
    }
}
