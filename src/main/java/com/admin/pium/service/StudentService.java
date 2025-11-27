package com.admin.pium.service;

import com.admin.pium.dto.StudentDTO;
import com.admin.pium.entity.Payment;
import com.admin.pium.entity.Student;
import com.admin.pium.mapper.PaymentMapper;
import com.admin.pium.mapper.StudentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentService {

    private final StudentMapper studentMapper;
    private final PaymentMapper paymentMapper;

    public List<Student> getAllStudents() {
        return studentMapper.findAll();
    }

    public List<Student> getAllActiveStudents() {
        return studentMapper.findAllActive();
    }

    public long getActiveStudentCount() {
        return studentMapper.findAllActive().size();
    }

    public Student getStudentById(Long id) {
        Student student = studentMapper.findById(id);
        if (student == null) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        return student;
    }

    public Student createStudent(Student student) {
        studentMapper.insert(student);
        return student;
    }

    public Student updateStudent(Long id, Student student) {
        Student existing = getStudentById(id);
        existing.setName(student.getName());
        existing.setBirthDate(student.getBirthDate());
        existing.setSchool(student.getSchool());
        existing.setSpecialNotes(student.getSpecialNotes());
        existing.setMon(student.getMon());
        existing.setTue(student.getTue());
        existing.setWed(student.getWed());
        existing.setThu(student.getThu());
        existing.setFri(student.getFri());
        existing.setParentContact(student.getParentContact());
        existing.setStudentContact(student.getStudentContact());
        existing.setStatus(student.getStatus());
        existing.setSessionsPerWeek(student.getSessionsPerWeek());
        studentMapper.update(existing);
        return existing;
    }

    public void deleteStudent(Long id) {
        studentMapper.deleteById(id);
    }

    public List<Student> searchStudents(String keyword) {
        return studentMapper.searchByName(keyword);
    }

    public List<StudentDTO> getStudentsWithPaymentStatus(String yearMonth) {
        List<Student> students = studentMapper.findAll();
        return students.stream().map(student -> {
            StudentDTO dto = new StudentDTO();
            dto.setId(student.getId());
            dto.setName(student.getName());
            dto.setBirthDate(student.getBirthDate());
            dto.setSchool(student.getSchool());
            dto.setSpecialNotes(student.getSpecialNotes());
            dto.setMon(student.getMon());
            dto.setTue(student.getTue());
            dto.setWed(student.getWed());
            dto.setThu(student.getThu());
            dto.setFri(student.getFri());
            dto.setParentContact(student.getParentContact());
            dto.setStudentContact(student.getStudentContact());

            // Check payment status for the month
            List<Payment> payments = paymentMapper.findByYearMonth(yearMonth).stream()
                    .filter(p -> p.getStudentId().equals(student.getId()))
                    .collect(Collectors.toList());
            boolean hasPaid = payments.stream().anyMatch(p -> "PAID".equals(p.getStatus()));
            dto.setPaymentStatus(hasPaid ? "PAID" : "UNPAID");

            return dto;
        }).collect(Collectors.toList());
    }
}
