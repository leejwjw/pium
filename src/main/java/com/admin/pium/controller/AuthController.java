package com.admin.pium.controller;

import com.admin.pium.dto.ChangePasswordRequest;
import com.admin.pium.dto.LoginRequest;
import com.admin.pium.dto.LoginResponse;
import com.admin.pium.entity.Admin;
import com.admin.pium.mapper.AdminMapper;
import com.admin.pium.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 인증 수행
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()));

            // 사용자 정보 조회
            Admin admin = adminMapper.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // JWT 토큰 생성
            String token = jwtUtil.generateToken(admin.getUsername());

            return ResponseEntity.ok(new LoginResponse(token, admin.getUsername(), admin.getName()));

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            // 현재 인증된 사용자 가져오기
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            Admin admin = adminMapper.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 현재 비밀번호 확인
            if (!passwordEncoder.matches(request.getCurrentPassword(), admin.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Current password is incorrect");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // 새 비밀번호 암호화 및 저장
            String encodedPassword = passwordEncoder.encode(request.getNewPassword());
            adminMapper.updatePassword(admin.getId(), encodedPassword);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to change password");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            Admin admin = adminMapper.findByUsername(auth.getName()).orElse(null);
            if (admin != null) {
                Map<String, String> response = new HashMap<>();
                response.put("username", admin.getUsername());
                response.put("name", admin.getName());
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
}
