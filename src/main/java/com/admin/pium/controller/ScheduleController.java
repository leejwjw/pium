package com.admin.pium.controller;

import com.admin.pium.entity.Schedule;
import com.admin.pium.mapper.ScheduleMapper;
import com.admin.pium.security.AdminContext;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleMapper scheduleMapper;
    private final AdminContext adminContext;

    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        Long adminId = adminContext.getCurrentAdminId();
        return ResponseEntity.ok(scheduleMapper.findAll(adminId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        Long adminId = adminContext.getCurrentAdminId();
        Schedule schedule = scheduleMapper.findById(id, adminId);
        if (schedule == null) {
            throw new RuntimeException("Schedule not found");
        }
        return ResponseEntity.ok(schedule);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Schedule>> getSchedulesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String date) {
        Long adminId = adminContext.getCurrentAdminId();
        return ResponseEntity.ok(scheduleMapper.findByScheduleDate(date, adminId));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Schedule>> getSchedulesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long adminId = adminContext.getCurrentAdminId();
        return ResponseEntity.ok(scheduleMapper.findByDateRange(startDate, endDate, adminId));
    }

    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@RequestBody Schedule schedule) {
        Long adminId = adminContext.getCurrentAdminId();
        schedule.setAdminId(adminId);
        scheduleMapper.insert(schedule);
        return ResponseEntity.ok(schedule);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @RequestBody Schedule schedule) {
        Long adminId = adminContext.getCurrentAdminId();
        schedule.setId(id);
        schedule.setAdminId(adminId);
        scheduleMapper.update(schedule);
        return ResponseEntity.ok(schedule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        Long adminId = adminContext.getCurrentAdminId();
        scheduleMapper.deleteById(id, adminId);
        return ResponseEntity.ok().build();
    }
}
