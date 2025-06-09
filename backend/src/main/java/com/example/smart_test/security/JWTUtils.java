package com.example.smart_test.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

@Component
public class JWTUtils {

    @Autowired
    private JwtEncoder encoder;
    @Autowired
    private JwtDecoder decoder;

    protected String generateAccessToken(@NotNull String username) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(30, ChronoUnit.MINUTES))
                .subject(username)
                .claim("type" , "access")
                .build();
        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    protected String generateRefreshToken(@NotNull String username) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(30, ChronoUnit.DAYS))
                .subject(username)
                .claim("type" , "refresh")
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