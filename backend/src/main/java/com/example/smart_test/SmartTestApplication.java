package com.example.smart_test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@Configuration
@EnableTransactionManagement
@ComponentScan(basePackages = {"com.example.smart_test", "com.example.smart_test.security"})
public class SmartTestApplication implements WebMvcConfigurer {

    public static void main(String[] args) {

        SpringApplication.run(SmartTestApplication.class, args);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}
