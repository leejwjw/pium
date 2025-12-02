package com.admin.pium.service;

import com.admin.pium.dto.AttendanceDTO;
import com.admin.pium.entity.Attendance;
import com.admin.pium.entity.Student;
import com.admin.pium.mapper.AttendanceMapper;
import com.admin.pium.mapper.StudentMapper;
import com.admin.pium.security.AdminContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceMapper attendanceMapper;
    private final StudentMapper studentMapper;
    private final AdminContext adminContext;

    public List<AttendanceDTO> getAllAttendance() {
        Long adminId = adminContext.getCurrentAdminId();
        return attendanceMapper.findAll(adminId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendanceByDate(LocalDate date) {
        Long adminId = adminContext.getCurrentAdminId();
        return attendanceMapper.findByDateRange(date, date, adminId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendanceByDateRange(LocalDate startDate, LocalDate endDate) {
        Long adminId = adminContext.getCurrentAdminId();
        return attendanceMapper.findByDateRange(startDate, endDate, adminId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getRecentAttendanceByStudent(Long studentId) {
        Long adminId = adminContext.getCurrentAdminId();
        return attendanceMapper.findByStudentId(studentId, adminId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Attendance createOrUpdateAttendance(Attendance attendance) {
        Long adminId = adminContext.getCurrentAdminId();
        attendance.setAdminId(adminId);
        if (attendance.getId() == null) {
            attendanceMapper.insert(attendance);
        } else {
            attendanceMapper.update(attendance);
        }
        return attendance;
    }

    public void deleteAttendance(Long id) {
        Long adminId = adminContext.getCurrentAdminId();
        attendanceMapper.deleteById(id, adminId);
    }

    private AttendanceDTO convertToDTO(Attendance attendance) {
        Long adminId = adminContext.getCurrentAdminId();
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(attendance.getId());
        dto.setStudentId(attendance.getStudentId());
        dto.setAttendanceDate(attendance.getAttendanceDate());
        dto.setIsPresent(attendance.getIsPresent());
        dto.setProgressMemo(attendance.getProgressMemo());

        // Get student name - use adminId to ensure we only access our own students
        Student student = studentMapper.findById(attendance.getStudentId(), adminId);
        if (student != null) {
            dto.setStudentName(student.getName());
        }

        return dto;
    }
}
