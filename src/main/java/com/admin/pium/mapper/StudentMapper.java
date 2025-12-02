package com.admin.pium.mapper;

import com.admin.pium.entity.Student;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StudentMapper {

    void insert(Student student);

    void update(Student student);

    void deleteById(@Param("id") Long id, @Param("adminId") Long adminId);

    Student findById(@Param("id") Long id, @Param("adminId") Long adminId);

    List<Student> findAll(@Param("adminId") Long adminId);

    List<Student> findAllActive(@Param("adminId") Long adminId); // 정상 상태 학생만 조회

    List<Student> searchByName(@Param("name") String name, @Param("adminId") Long adminId);

    List<Student> searchBySchool(@Param("school") String school, @Param("adminId") Long adminId);
}
