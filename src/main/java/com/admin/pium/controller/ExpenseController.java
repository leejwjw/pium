package com.admin.pium.controller;

import com.admin.pium.entity.Expense;
import com.admin.pium.mapper.ExpenseMapper;
import com.admin.pium.security.AdminContext;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseMapper expenseMapper;
    private final AdminContext adminContext;

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        Long adminId = adminContext.getCurrentAdminId();
        return ResponseEntity.ok(expenseMapper.findAll(adminId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        Long adminId = adminContext.getCurrentAdminId();
        Expense expense = expenseMapper.findById(id, adminId);
        if (expense == null) {
            throw new RuntimeException("Expense not found");
        }
        return ResponseEntity.ok(expense);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Expense>> getExpensesByType(@PathVariable String type) {
        Long adminId = adminContext.getCurrentAdminId();
        return ResponseEntity.ok(expenseMapper.findByExpenseType(type, adminId));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Expense>> getExpensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long adminId = adminContext.getCurrentAdminId();
        return ResponseEntity.ok(expenseMapper.findByDateRange(startDate, endDate, adminId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Expense>> searchExpenses(@RequestParam String keyword) {
        Long adminId = adminContext.getCurrentAdminId();
        return ResponseEntity.ok(expenseMapper.searchByKeyword(keyword, adminId));
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        Long adminId = adminContext.getCurrentAdminId();
        expense.setAdminId(adminId);
        expenseMapper.insert(expense);
        return ResponseEntity.ok(expense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        Long adminId = adminContext.getCurrentAdminId();
        expense.setId(id);
        expense.setAdminId(adminId);
        expenseMapper.update(expense);
        return ResponseEntity.ok(expense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        Long adminId = adminContext.getCurrentAdminId();
        expenseMapper.deleteById(id, adminId);
        return ResponseEntity.ok().build();
    }
}
