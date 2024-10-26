package com.example.smart_test.security;//package com.example.smart_test.security;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.oauth2.jwt.JwtException;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestHeader;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/test-smart")
//public class ProtectedController {
//    @Autowired
//    private JWTUtils jwtUtils;
//
//    @GetMapping("/main")
//    public ResponseEntity<?> protectedEndpoint(@RequestHeader("Authorization") String authHeader) {
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            String token = authHeader.substring(7);
//            try {
//                // Декодируйте токен и проверьте его
//                var jwt = jwtUtils.decodeToken(token);
//
//
//
//                // Если токен валиден, продолжите обработку запроса
//                return ResponseEntity.ok().body("Protected resource accessed");
//            } catch (JwtException e) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
//            }
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
//        }
//    }
//}
//
