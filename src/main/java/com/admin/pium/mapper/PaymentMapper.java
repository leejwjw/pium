package com.admin.pium.mapper;

import com.admin.pium.entity.Payment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface PaymentMapper {

    void insert(Payment payment);

    void update(Payment payment);

    void deleteById(@Param("id") Long id);

    Payment findById(@Param("id") Long id);

    List<Payment> findAll();

    List<Payment> findByStudentId(@Param("studentId") Long studentId);

    List<Payment> findByYearMonth(@Param("yearMonth") String yearMonth);

    List<Payment> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    Integer sumByYearMonth(@Param("yearMonth") String yearMonth);
}
