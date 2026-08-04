package com.ecommerce.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String verificationUrl) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Please Verify Your Email Address");

            String htmlContent = "<div style='font-family: Arial, sans-serif;'>"
                    + "<h2>Email Verification</h2>"
                    + "<p>Thank you for registering. Please click the link below to verify your email address:</p>"
                    + "<p><a href='" + verificationUrl + "' style='padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;'>Verify Email</a></p>"
                    + "<p>If the button doesn't work, copy and paste this link in your browser:</p>"
                    + "<p><a href='" + verificationUrl + "'>" + verificationUrl + "</a></p>"
                    + "<p>This link will expire in 24 hours.</p>"
                    + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Verification email sent to {}", toEmail);

        } catch (MessagingException e) {
            log.error("Failed to send verification email to {}", toEmail, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
