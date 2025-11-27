package com.admin.pium.controller;

import com.admin.pium.dto.FinanceSummaryDTO;
import com.admin.pium.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    @GetMapping("/summary")
    public ResponseEntity<FinanceSummaryDTO> getMonthlySummary(@RequestParam String yearMonth) {
        return ResponseEntity.ok(financeService.getMonthlySummary(yearMonth));
    }

    @GetMapping("/export-excel")
    public ResponseEntity<byte[]> exportToExcel(@RequestParam String yearMonth) {
        try {
            byte[] excelData = financeService.generateExcelReport(yearMonth);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment",
                    "financial_report_" + yearMonth + ".xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelData);
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate Excel report: " + e.getMessage());
        }
    }
}
