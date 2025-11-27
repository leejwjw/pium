package com.admin.pium.service;

import com.admin.pium.entity.EducationRecord;
import com.admin.pium.mapper.EducationRecordMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EducationRecordService {

    private final EducationRecordMapper educationRecordMapper;

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    public List<EducationRecord> getAllRecords() {
        return educationRecordMapper.findAll();
    }

    public List<EducationRecord> getRecordsByYearMonth(String yearMonth) {
        return educationRecordMapper.findByYearMonth(yearMonth);
    }

    public List<EducationRecord> getRecordsByWeek(String yearMonth, Integer weekNumber) {
        return educationRecordMapper.findByYearMonthAndWeek(yearMonth, weekNumber);
    }

    public List<EducationRecord> getRecordsBySubject(String subject) {
        return educationRecordMapper.findBySubjectContaining(subject);
    }

    public EducationRecord createRecord(EducationRecord record) {
        educationRecordMapper.insert(record);
        return record;
    }

    public EducationRecord updateRecord(Long id, EducationRecord record) {
        EducationRecord existing = educationRecordMapper.findById(id);
        if (existing == null) {
            throw new RuntimeException("Record not found");
        }
        existing.setYearMonth(record.getYearMonth());
        existing.setWeekNumber(record.getWeekNumber());
        existing.setSubject(record.getSubject());
        existing.setContent(record.getContent());
        if (record.getImagePath() != null) {
            existing.setImagePath(record.getImagePath());
        }
        educationRecordMapper.update(existing);
        return existing;
    }

    public void deleteRecord(Long id) {
        educationRecordMapper.deleteById(id);
    }

    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String filename = UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + filename;
    }
}
