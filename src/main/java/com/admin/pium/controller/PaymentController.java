package com.admin.pium.controller;

import com.admin.pium.entity.Payment;
import com.admin.pium.mapper.PaymentMapper;
import com.admin.pium.security.AdminContext;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentMapper paymentMapper;
    private final AdminContext adminContext;

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        Long adminId = adminContext.getCurrentAdminId();
        return ResponseEntity.ok(paymentMapper.findAll(adminId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Long adminId = adminContext.getCurrentAdminId();
        Payment payment = paymentMapper.findById(id, adminId);
        if (payment == null) {
            throw new RuntimeException("Payment not found");
        }
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Payment>> getPaymentsByStudent(@PathVariable Long studentId) {
        Long adminId = adminContext.getCurrentAdminId();
        return ResponseEntity.ok(paymentMapper.findByStudentId(studentId, adminId));
    }

    @GetMapping("/month/{yearMonth}")
    public ResponseEntity<List<Payment>> getPaymentsByYearMonth(@PathVariable String yearMonth) {
        Long adminId = adminContext.getCurrentAdminId();
        return ResponseEntity.ok(paymentMapper.findByYearMonth(yearMonth, adminId));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Payment>> getPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long adminId = adminContext.getCurrentAdminId();
        return ResponseEntity.ok(paymentMapper.findByDateRange(startDate, endDate, adminId));
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        Long adminId = adminContext.getCurrentAdminId();
        payment.setAdminId(adminId);
        paymentMapper.insert(payment);
        return ResponseEntity.ok(payment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Long id, @RequestBody Payment payment) {
        Long adminId = adminContext.getCurrentAdminId();
        payment.setId(id);
        payment.setAdminId(adminId);
        paymentMapper.update(payment);
        return ResponseEntity.ok(payment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        Long adminId = adminContext.getCurrentAdminId();
        paymentMapper.deleteById(id, adminId);
        return ResponseEntity.ok().build();
    }
}
