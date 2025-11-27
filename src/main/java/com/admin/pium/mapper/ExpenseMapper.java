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

    void deleteById(@Param("id") Long id);

    Expense findById(@Param("id") Long id);

    List<Expense> findAll();

    List<Expense> findByExpenseType(@Param("expenseType") String expenseType);

    List<Expense> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    Integer sumByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Expense> searchByKeyword(@Param("keyword") String keyword);
}
