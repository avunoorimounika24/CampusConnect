package com.campusconnect.controller;

import com.campusconnect.dto.request.EventRequest;
import com.campusconnect.dto.response.AdminDashboardStatsResponse;
import com.campusconnect.dto.response.ApiResponse;
import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.dto.response.RegistrationResponse;
import com.campusconnect.entity.EventCategory;
import com.campusconnect.entity.EventStatus;
import com.campusconnect.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<AdminDashboardStatsResponse>> getDashboardStats() {
        AdminDashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved successfully", stats));
    }

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<Page<EventResponse>>> getAllEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) EventCategory category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<EventResponse> events = adminService.getAllEvents(search, category, date, status, page, size);
        return ResponseEntity.ok(ApiResponse.success("Admin events list retrieved successfully", events));
    }

    @PostMapping("/events")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(@Valid @RequestBody EventRequest request) {
        EventResponse created = adminService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully!", created));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request
    ) {
        EventResponse updated = adminService.updateEvent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully!", updated));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        adminService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully!"));
    }

    @PatchMapping("/events/{id}/status")
    public ResponseEntity<ApiResponse<EventResponse>> updateEventStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusBody
    ) {
        String statusStr = statusBody.get("status");
        EventStatus status = EventStatus.valueOf(statusStr.toUpperCase());
        EventResponse updated = adminService.updateEventStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Event status updated to " + status, updated));
    }

    @GetMapping("/events/{eventId}/registrations")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getEventRegistrations(@PathVariable Long eventId) {
        List<RegistrationResponse> list = adminService.getEventRegistrations(eventId);
        return ResponseEntity.ok(ApiResponse.success("Event registrations retrieved successfully", list));
    }

    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getAllRegistrations(
            @RequestParam(defaultValue = "50") int limit
    ) {
        List<RegistrationResponse> list = adminService.getAllRegistrations(limit);
        return ResponseEntity.ok(ApiResponse.success("Registrations retrieved successfully", list));
    }
}
