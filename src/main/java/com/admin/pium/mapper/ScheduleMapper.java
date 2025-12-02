package com.admin.pium.mapper;

import com.admin.pium.entity.Schedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ScheduleMapper {

    void insert(Schedule schedule);

    void update(Schedule schedule);

    void deleteById(@Param("id") Long id, @Param("adminId") Long adminId);

    Schedule findById(@Param("id") Long id, @Param("adminId") Long adminId);

    List<Schedule> findAll(@Param("adminId") Long adminId);

    List<Schedule> findByScheduleDate(@Param("scheduleDate") String scheduleDate, @Param("adminId") Long adminId);

    List<Schedule> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate,
            @Param("adminId") Long adminId);
}
