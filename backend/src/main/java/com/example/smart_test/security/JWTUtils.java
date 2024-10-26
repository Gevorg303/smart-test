package com.example.smart_test.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

@Component
public class JWTUtils {

    @Autowired
    private JwtEncoder encoder;
    @Autowired
    private JwtDecoder decoder;

    public String generateToken(String username) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(1, ChronoUnit.HOURS))
                .subject(username)
                .build();
        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public Jwt decodeToken(String token) {
        try {
            return decoder.decode(token);
        } catch (JwtException e) {
            throw new RuntimeException("Invalid token", e);
        }
    }
}