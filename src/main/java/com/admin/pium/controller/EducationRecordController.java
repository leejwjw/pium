package com.admin.pium.controller;

import com.admin.pium.entity.EducationRecord;
import com.admin.pium.service.EducationRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/education")
@RequiredArgsConstructor
public class EducationRecordController {

    private final EducationRecordService educationRecordService;

    @GetMapping
    public ResponseEntity<List<EducationRecord>> getAllRecords() {
        return ResponseEntity.ok(educationRecordService.getAllRecords());
    }

    @GetMapping("/year-month/{yearMonth}")
    public ResponseEntity<List<EducationRecord>> getRecordsByYearMonth(@PathVariable String yearMonth) {
        return ResponseEntity.ok(educationRecordService.getRecordsByYearMonth(yearMonth));
    }

    @GetMapping("/week")
    public ResponseEntity<List<EducationRecord>> getRecordsByWeek(
            @RequestParam String yearMonth,
            @RequestParam Integer weekNumber) {
        return ResponseEntity.ok(educationRecordService.getRecordsByWeek(yearMonth, weekNumber));
    }

    @GetMapping("/subject")
    public ResponseEntity<List<EducationRecord>> getRecordsBySubject(@RequestParam String subject) {
        return ResponseEntity.ok(educationRecordService.getRecordsBySubject(subject));
    }

    @PostMapping
    public ResponseEntity<EducationRecord> createRecord(@RequestBody EducationRecord record) {
        return ResponseEntity.ok(educationRecordService.createRecord(record));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imagePath = educationRecordService.uploadImage(file);
            Map<String, String> response = new HashMap<>();
            response.put("imagePath", imagePath);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EducationRecord> updateRecord(@PathVariable Long id, @RequestBody EducationRecord record) {
        return ResponseEntity.ok(educationRecordService.updateRecord(id, record));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        educationRecordService.deleteRecord(id);
        return ResponseEntity.ok().build();
    }
}
