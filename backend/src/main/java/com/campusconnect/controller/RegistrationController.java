package com.campusconnect.controller;

import com.campusconnect.dto.response.ApiResponse;
import com.campusconnect.dto.response.RegistrationResponse;
import com.campusconnect.service.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/events/{eventId}")
    public ResponseEntity<ApiResponse<RegistrationResponse>> registerForEvent(@PathVariable Long eventId) {
        RegistrationResponse response = registrationService.registerForEvent(eventId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Successfully registered for the event!", response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getMyRegistrations() {
        List<RegistrationResponse> list = registrationService.getMyRegistrations();
        return ResponseEntity.ok(ApiResponse.success("My registrations retrieved successfully", list));
    }

    @GetMapping("/my/{registrationId}")
    public ResponseEntity<ApiResponse<RegistrationResponse>> getMyRegistrationById(@PathVariable Long registrationId) {
        RegistrationResponse response = registrationService.getMyRegistrationById(registrationId);
        return ResponseEntity.ok(ApiResponse.success("Registration retrieved successfully", response));
    }

    @DeleteMapping("/{registrationId}")
    public ResponseEntity<ApiResponse<RegistrationResponse>> cancelRegistration(@PathVariable Long registrationId) {
        RegistrationResponse response = registrationService.cancelRegistration(registrationId);
        return ResponseEntity.ok(ApiResponse.success("Registration successfully cancelled", response));
    }
}
