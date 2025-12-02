package com.admin.pium.mapper;

import com.admin.pium.entity.Admin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface AdminMapper {

    Optional<Admin> findByUsername(@Param("username") String username);

    Admin findById(@Param("id") Long id);

    int updatePassword(@Param("id") Long id, @Param("newPassword") String newPassword);
}
