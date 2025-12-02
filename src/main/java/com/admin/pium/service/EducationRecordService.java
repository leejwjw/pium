package com.admin.pium.service;

import com.admin.pium.entity.EducationRecord;
import com.admin.pium.mapper.EducationRecordMapper;
import com.admin.pium.security.AdminContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EducationRecordService {

    private final EducationRecordMapper educationRecordMapper;
    private final AdminContext adminContext;

    @Value("${spring.servlet.multipart.location:./uploads}")
    private String uploadPath;

    public List<EducationRecord> getAllRecords() {
        Long adminId = adminContext.getCurrentAdminId();
        return educationRecordMapper.findAll(adminId);
    }

    public List<EducationRecord> getRecordsByYearMonth(String yearMonth) {
        Long adminId = adminContext.getCurrentAdminId();
        return educationRecordMapper.findByYearMonth(yearMonth, adminId);
    }

    public List<EducationRecord> getRecordsByWeek(String yearMonth, Integer weekNumber) {
        Long adminId = adminContext.getCurrentAdminId();
        return educationRecordMapper.findByYearMonthAndWeek(yearMonth, weekNumber, adminId);
    }

    public List<EducationRecord> getRecordsBySubject(String subject) {
        Long adminId = adminContext.getCurrentAdminId();
        return educationRecordMapper.findBySubjectContaining(subject, adminId);
    }

    public EducationRecord createRecord(EducationRecord record) {
        Long adminId = adminContext.getCurrentAdminId();
        record.setAdminId(adminId);
        educationRecordMapper.insert(record);
        return record;
    }

    public EducationRecord updateRecord(Long id, EducationRecord record) {
        Long adminId = adminContext.getCurrentAdminId();
        EducationRecord existing = educationRecordMapper.findById(id, adminId);
        if (existing == null) {
            throw new RuntimeException("Record not found: " + id);
        }

        existing.setYearMonth(record.getYearMonth());
        existing.setWeekNumber(record.getWeekNumber());
        existing.setSubject(record.getSubject());
        existing.setContent(record.getContent());
        existing.setImagePath(record.getImagePath());
        educationRecordMapper.update(existing);
        return existing;
    }

    public void deleteRecord(Long id) {
        Long adminId = adminContext.getCurrentAdminId();
        educationRecordMapper.deleteById(id, adminId);
    }

    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        // Create uploads directory if it doesn't exist
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        // Return relative path
        return "/uploads/" + filename;
    }
}
