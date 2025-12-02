package com.admin.pium.mapper;

import com.admin.pium.entity.Expense;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ExpenseMapper {

    void insert(Expense expense);

    void update(Expense expense);

    void deleteById(@Param("id") Long id, @Param("adminId") Long adminId);

    Expense findById(@Param("id") Long id, @Param("adminId") Long adminId);

    List<Expense> findAll(@Param("adminId") Long adminId);

    List<Expense> findByExpenseType(@Param("expenseType") String expenseType, @Param("adminId") Long adminId);

    List<Expense> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate,
            @Param("adminId") Long adminId);

    Integer sumByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate,
            @Param("adminId") Long adminId);

    List<Expense> searchByKeyword(@Param("keyword") String keyword, @Param("adminId") Long adminId);
}
