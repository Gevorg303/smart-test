package com.example.smart_test;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@Configuration
@EnableTransactionManagement
@ComponentScan(basePackages = {"com.example.smart_test", "com.example.smart_test.security"})
@EnableScheduling
public class SmartTestApplication implements WebMvcConfigurer {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        System.setProperty("spring.datasource.url", dotenv.get("DATASOURCE_URL"));
        System.setProperty("spring.datasource.username", dotenv.get("DATASOURCE_USERNAME"));
        System.setProperty("spring.datasource.password", dotenv.get("DATASOURCE_PASSWORD"));
        SpringApplication.run(SmartTestApplication.class, args);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}
