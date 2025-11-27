package com.admin.pium.mapper;

import com.admin.pium.entity.Subject;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SubjectMapper {
    void insert(Subject subject);

    void update(Subject subject);

    void deleteById(@Param("id") Long id);

    Subject findById(@Param("id") Long id);

    List<Subject> findAll();

    Subject findByName(@Param("name") String name);
}
