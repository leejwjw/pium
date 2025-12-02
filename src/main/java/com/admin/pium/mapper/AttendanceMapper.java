package com.admin.pium.mapper;

import com.admin.pium.entity.Attendance;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface AttendanceMapper {

    void insert(Attendance attendance);

    void update(Attendance attendance);

    void deleteById(@Param("id") Long id, @Param("adminId") Long adminId);

    Attendance findById(@Param("id") Long id, @Param("adminId") Long adminId);

    List<Attendance> findAll(@Param("adminId") Long adminId);

    List<Attendance> findByStudentId(@Param("studentId") Long studentId, @Param("adminId") Long adminId);

    List<Attendance> findByDateRange(@Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("adminId") Long adminId);

    Attendance findByStudentIdAndDate(@Param("studentId") Long studentId,
            @Param("attendanceDate") LocalDate attendanceDate,
            @Param("adminId") Long adminId);
}
