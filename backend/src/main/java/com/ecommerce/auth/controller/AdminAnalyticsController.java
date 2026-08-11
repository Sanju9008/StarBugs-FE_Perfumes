package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.AdminAnalyticsResponse;
import com.ecommerce.auth.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Slf4j
@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminAnalyticsController {

    private final AdminAnalyticsService analyticsService;

    // ─── GET /api/admin/analytics/daily ─────────────────────────────────────
    @GetMapping("/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminAnalyticsResponse> getDailyAnalytics(
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        log.info("Fetching daily analytics for date: {}", date);
        return ResponseEntity.ok(analyticsService.getDailyAnalytics(date));
    }

    // ─── GET /api/admin/analytics/monthly ───────────────────────────────────
    @GetMapping("/monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminAnalyticsResponse> getMonthlyAnalytics(
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "month", required = false) Integer month
    ) {
        if (year == null) year = LocalDate.now().getYear();
        if (month == null) month = LocalDate.now().getMonthValue();

        log.info("Fetching monthly analytics for year: {}, month: {}", year, month);
        return ResponseEntity.ok(analyticsService.getMonthlyAnalytics(year, month));
    }

    // ─── GET /api/admin/analytics/yearly ────────────────────────────────────
    @GetMapping("/yearly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminAnalyticsResponse> getYearlyAnalytics(
            @RequestParam(value = "year", required = false) Integer year
    ) {
        if (year == null) year = LocalDate.now().getYear();

        log.info("Fetching yearly analytics for year: {}", year);
        return ResponseEntity.ok(analyticsService.getYearlyAnalytics(year));
    }

    // ─── GET /api/admin/analytics/overall ───────────────────────────────────
    @GetMapping("/overall")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminAnalyticsResponse> getOverallAnalytics() {
        log.info("Fetching overall cumulative business analytics");
        return ResponseEntity.ok(analyticsService.getOverallAnalytics());
    }
}
