package com.admin.pium.mapper;

import com.admin.pium.entity.Student;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StudentMapper {

    void insert(Student student);

    void update(Student student);

    void deleteById(@Param("id") Long id);

    Student findById(@Param("id") Long id);

    List<Student> findAll();

    List<Student> findAllActive(); // 정상 상태 학생만 조회

    List<Student> searchByName(@Param("name") String name);

    List<Student> searchBySchool(@Param("school") String school);
}
