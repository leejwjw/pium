package com.admin.pium.mapper;

import com.admin.pium.entity.EducationRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface EducationRecordMapper {

    void insert(EducationRecord educationRecord);

    void update(EducationRecord educationRecord);

    void deleteById(@Param("id") Long id);

    EducationRecord findById(@Param("id") Long id);

    List<EducationRecord> findAll();

    List<EducationRecord> findByYearMonth(@Param("yearMonth") String yearMonth);

    List<EducationRecord> findByYearMonthAndWeek(@Param("yearMonth") String yearMonth,
            @Param("weekNumber") Integer weekNumber);

    List<EducationRecord> findBySubjectContaining(@Param("subject") String subject);
}
