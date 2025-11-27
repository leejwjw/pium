package com.admin.pium.service;

import com.admin.pium.dto.AttendanceDTO;
import com.admin.pium.entity.Attendance;
import com.admin.pium.entity.Student;
import com.admin.pium.mapper.AttendanceMapper;
import com.admin.pium.mapper.StudentMapper;
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

    public List<AttendanceDTO> getAllAttendance() {
        return attendanceMapper.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendanceByDate(LocalDate date) {
        return attendanceMapper.findByDateRange(date, date).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendanceByDateRange(LocalDate startDate, LocalDate endDate) {
        return attendanceMapper.findByDateRange(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getRecentAttendanceByStudent(Long studentId) {
        return attendanceMapper.findByStudentId(studentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Attendance createOrUpdateAttendance(Attendance attendance) {
        if (attendance.getId() == null) {
            attendanceMapper.insert(attendance);
        } else {
            attendanceMapper.update(attendance);
        }
        return attendance;
    }

    public void deleteAttendance(Long id) {
        attendanceMapper.deleteById(id);
    }

    private AttendanceDTO convertToDTO(Attendance attendance) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(attendance.getId());
        dto.setStudentId(attendance.getStudentId());
        dto.setAttendanceDate(attendance.getAttendanceDate());
        dto.setIsPresent(attendance.getIsPresent());
        dto.setProgressMemo(attendance.getProgressMemo());

        // Get student name
        Student student = studentMapper.findById(attendance.getStudentId());
        if (student != null) {
            dto.setStudentName(student.getName());
        }

        return dto;
    }
}
