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

    void deleteById(@Param("id") Long id);

    Schedule findById(@Param("id") Long id);

    List<Schedule> findAll();

    List<Schedule> findByScheduleDate(@Param("scheduleDate") String scheduleDate);

    List<Schedule> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
