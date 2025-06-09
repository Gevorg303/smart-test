package com.example.smart_test.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class AuthenticationController {
    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> create(@RequestBody AuthRequest authRequest) {
        try {
            var authentication = new UsernamePasswordAuthenticationToken(
                    authRequest.getUsername(), authRequest.getPassword());

            authenticationManager.authenticate(authentication);
            String accessToken = jwtUtils.generateAccessToken(authRequest.getUsername());
            String refreshToken = jwtUtils.generateRefreshToken(authRequest.getUsername());
            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", accessToken);
            tokens.put("refreshToken", refreshToken);
            //var token = jwtUtils.generateAccessToken(authRequest.getUsername());
            return ResponseEntity.ok(tokens);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }

    @GetMapping("/tokens")
    public ResponseEntity<Map<String, String>> refreshTokens(@CookieValue("accessToken") String accessToken, @CookieValue("refreshToken") String refreshToken) {
        //String accessToken = tokens.get("accessToken");
        //String refreshToken = tokens.get("refreshToken");
        try {
            Jwt expiredAccessToken = jwtUtils.decodeToken(accessToken);
            Jwt expiredRefreshToken = jwtUtils.decodeToken(refreshToken);
            if (Objects.requireNonNull(expiredAccessToken.getExpiresAt()).isBefore(Instant.now())
                    && !Objects.requireNonNull(expiredRefreshToken.getExpiresAt()).isBefore(Instant.now())) {
                Jwt decoderAccessToken = jwtUtils.decodeToken(refreshToken);
                String username = decoderAccessToken.getSubject();

                String newAccessToken = jwtUtils.generateAccessToken(username);
                String newRefreshToken = jwtUtils.generateRefreshToken(username);

                Map<String, String> newTokens = new HashMap<>();
                newTokens.put("accessToken", newAccessToken);
                newTokens.put("refreshToken", newRefreshToken);

                return ResponseEntity.ok(newTokens);
            } else if (Objects.requireNonNull(expiredRefreshToken.getExpiresAt()).isBefore(Instant.now())) {
                return ResponseEntity.internalServerError().body(Map.of("error", "An error occurred"));
            }
            else {
                return ResponseEntity.ok(Map.of("info", "Access token expired"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "An error occurred"));
        }
    }
}
