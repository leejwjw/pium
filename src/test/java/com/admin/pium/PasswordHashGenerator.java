package com.admin.pium;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {

    @Test
    public void generatePasswordHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

        // 테스트할 비밀번호들
        String[] passwords = { "pium2025!", "arte2025!" };

        for (String password : passwords) {
            String hash = encoder.encode(password);
            System.out.println("========================================");
            System.out.println("Password: " + password);
            System.out.println("New Hash: " + hash);
            System.out.println("========================================");
        }

        // DB에 저장된 해시 검증
        String dbHash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu";
        boolean matches = encoder.matches("pium2025!", dbHash);
        System.out.println("\nDB Hash Verification:");
        System.out.println("Password 'pium2025!' matches DB hash: " + matches);
    }
}
