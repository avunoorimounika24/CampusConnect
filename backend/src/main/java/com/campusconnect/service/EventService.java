package com.campusconnect.service;

import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventCategory;
import com.campusconnect.entity.EventStatus;
import com.campusconnect.entity.RegistrationStatus;
import com.campusconnect.entity.User;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventRegistrationRepository;
import com.campusconnect.repository.EventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;
    private final AuthService authService;

    public EventService(EventRepository eventRepository,
                        EventRegistrationRepository registrationRepository,
                        AuthService authService) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.authService = authService;
    }

    public Page<EventResponse> getEvents(
            String search,
            EventCategory category,
            LocalDate eventDate,
            EventStatus status,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("eventDate").ascending().and(Sort.by("startTime").ascending()));
        Page<Event> eventPage = eventRepository.searchEvents(
                (search != null && !search.trim().isEmpty()) ? search.trim() : null,
                category,
                eventDate,
                status != null ? status : EventStatus.ACTIVE,
                pageable
        );

        User currentUser = authService.getCurrentAuthenticatedUser();
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        return eventPage.map(event -> mapToResponse(event, currentUserId));
    }

    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        User currentUser = authService.getCurrentAuthenticatedUser();
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        return mapToResponse(event, currentUserId);
    }

    public List<EventResponse> getFeaturedEvents(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Event> events = eventRepository.findFeaturedUpcomingEvents(LocalDate.now(), pageable);

        User currentUser = authService.getCurrentAuthenticatedUser();
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        return events.stream()
                .map(event -> mapToResponse(event, currentUserId))
                .collect(Collectors.toList());
    }

    public List<String> getCategories() {
        return Arrays.stream(EventCategory.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    private EventResponse mapToResponse(Event event, Long currentUserId) {
        long confirmedCount = registrationRepository.countByEventIdAndRegistrationStatus(
                event.getId(), RegistrationStatus.CONFIRMED
        );

        boolean isRegistered = false;
        if (currentUserId != null) {
            isRegistered = registrationRepository.existsByUserIdAndEventIdAndRegistrationStatus(
                    currentUserId, event.getId(), RegistrationStatus.CONFIRMED
            );
        }

        return EventResponse.fromEntity(event, confirmedCount, isRegistered);
    }
}
