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

    void deleteById(@Param("id") Long id, @Param("adminId") Long adminId);

    Payment findById(@Param("id") Long id, @Param("adminId") Long adminId);

    List<Payment> findAll(@Param("adminId") Long adminId);

    List<Payment> findByStudentId(@Param("studentId") Long studentId, @Param("adminId") Long adminId);

    List<Payment> findByYearMonth(@Param("yearMonth") String yearMonth, @Param("adminId") Long adminId);

    List<Payment> findByDateRange(@Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("adminId") Long adminId);

    Integer sumByYearMonth(@Param("yearMonth") String yearMonth, @Param("adminId") Long adminId);
}
