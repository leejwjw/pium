package com.admin.pium.security;

import com.admin.pium.entity.Admin;
import com.admin.pium.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * 현재 로그인한 관리자 정보를 SecurityContext에서 가져오는 유틸리티 클래스
 */
@Component
public class AdminContext {

    @Autowired
    private AdminMapper adminMapper;

    /**
     * 현재 인증된 관리자의 ID를 반환
     * 
     * @return 관리자 ID
     * @throws RuntimeException 인증되지 않은 경우
     */
    public Long getCurrentAdminId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new RuntimeException("No authenticated admin found");
        }

        String username = auth.getName();
        Admin admin = adminMapper.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + username));

        return admin.getId();
    }

    /**
     * 현재 인증된 관리자 정보를 반환
     * 
     * @return Admin 엔티티
     * @throws RuntimeException 인증되지 않은 경우
     */
    public Admin getCurrentAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new RuntimeException("No authenticated admin found");
        }

        String username = auth.getName();
        return adminMapper.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + username));
    }
}
