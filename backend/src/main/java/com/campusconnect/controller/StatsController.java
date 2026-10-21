package com.campusconnect.controller;

import com.campusconnect.dto.response.ApiResponse;
import com.campusconnect.entity.RegistrationStatus;
import com.campusconnect.entity.Role;
import com.campusconnect.repository.EventRegistrationRepository;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;
    private final UserRepository userRepository;

    public StatsController(EventRepository eventRepository,
                           EventRegistrationRepository registrationRepository,
                           UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPublicStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalEvents = eventRepository.count();
        long upcomingEvents = eventRepository.countUpcomingEvents(LocalDate.now());
        long totalRegistrations = registrationRepository.countByRegistrationStatus(RegistrationStatus.CONFIRMED);
        long totalStudents = userRepository.countByRole(Role.ROLE_STUDENT);

        stats.put("totalEvents", totalEvents);
        stats.put("upcomingEvents", upcomingEvents);
        stats.put("totalRegistrations", totalRegistrations);
        stats.put("totalStudents", totalStudents);

        return ResponseEntity.ok(ApiResponse.success("Platform statistics retrieved successfully", stats));
    }
}
