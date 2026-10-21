package com.campusconnect.controller;

import com.campusconnect.dto.response.ApiResponse;
import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.entity.EventCategory;
import com.campusconnect.entity.EventStatus;
import com.campusconnect.service.EventService;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<EventResponse>>> getEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) EventCategory category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        Page<EventResponse> events = eventService.getEvents(search, category, date, status, page, size);
        return ResponseEntity.ok(ApiResponse.success("Events retrieved successfully", events));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(@PathVariable Long id) {
        EventResponse event = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success("Event details retrieved successfully", event));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getFeaturedEvents(
            @RequestParam(defaultValue = "3") int limit
    ) {
        List<EventResponse> featured = eventService.getFeaturedEvents(limit);
        return ResponseEntity.ok(ApiResponse.success("Featured events retrieved successfully", featured));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        List<String> categories = eventService.getCategories();
        return ResponseEntity.ok(ApiResponse.success("Event categories retrieved successfully", categories));
    }
}
