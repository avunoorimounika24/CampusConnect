package com.campusconnect.service;

import com.campusconnect.dto.request.EventRequest;
import com.campusconnect.dto.response.AdminDashboardStatsResponse;
import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.dto.response.RegistrationResponse;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventCategory;
import com.campusconnect.entity.EventRegistration;
import com.campusconnect.entity.EventStatus;
import com.campusconnect.entity.RegistrationStatus;
import com.campusconnect.entity.Role;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventRegistrationRepository;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;
    private final UserRepository userRepository;

    public AdminService(EventRepository eventRepository,
                        EventRegistrationRepository registrationRepository,
                        UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getDashboardStats() {
        LocalDate today = LocalDate.now();
        long totalEvents = eventRepository.count();
        long upcomingEvents = eventRepository.countUpcomingEvents(today);
        long completedEvents = eventRepository.countCompletedEvents(today);
        long totalRegistrations = registrationRepository.countByRegistrationStatus(RegistrationStatus.CONFIRMED);
        long totalStudents = userRepository.countByRole(Role.ROLE_STUDENT);

        List<EventRegistration> recent = registrationRepository.findRecentRegistrations(PageRequest.of(0, 10));
        List<RegistrationResponse> recentResponses = recent.stream()
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());

        return new AdminDashboardStatsResponse(
                totalEvents,
                upcomingEvents,
                completedEvents,
                totalRegistrations,
                totalStudents,
                recentResponses
        );
    }

    @Transactional(readOnly = true)
    public Page<EventResponse> getAllEvents(
            String search,
            EventCategory category,
            LocalDate eventDate,
            EventStatus status,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("eventDate").descending().and(Sort.by("startTime").descending()));
        Page<Event> eventPage = eventRepository.searchEvents(
                (search != null && !search.trim().isEmpty()) ? search.trim() : null,
                category,
                eventDate,
                status,
                pageable
        );

        return eventPage.map(event -> {
            long confirmedCount = registrationRepository.countByEventIdAndRegistrationStatus(event.getId(), RegistrationStatus.CONFIRMED);
            return EventResponse.fromEntity(event, confirmedCount, false);
        });
    }

    public EventResponse createEvent(EventRequest request) {
        validateEventRequest(request);

        Event event = new Event();
        mapRequestToEntity(request, event);

        Event saved = eventRepository.save(event);
        return EventResponse.fromEntity(saved, 0, false);
    }

    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        validateEventRequest(request);
        mapRequestToEntity(request, event);

        Event updated = eventRepository.save(event);
        long count = registrationRepository.countByEventIdAndRegistrationStatus(id, RegistrationStatus.CONFIRMED);
        return EventResponse.fromEntity(updated, count, false);
    }

    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        // If registrations exist, we safely remove the event and cascade registrations
        eventRepository.delete(event);
    }

    public EventResponse updateEventStatus(Long id, EventStatus newStatus) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        event.setStatus(newStatus);
        Event updated = eventRepository.save(event);
        long count = registrationRepository.countByEventIdAndRegistrationStatus(id, RegistrationStatus.CONFIRMED);
        return EventResponse.fromEntity(updated, count, false);
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getEventRegistrations(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with ID: " + eventId);
        }

        List<EventRegistration> list = registrationRepository.findByEventIdWithUser(eventId);
        return list.stream()
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getAllRegistrations(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<EventRegistration> list = registrationRepository.findRecentRegistrations(pageable);
        return list.stream()
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private void validateEventRequest(EventRequest request) {
        if (request.getStartTime() != null && request.getEndTime() != null &&
                !request.getEndTime().isAfter(request.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        if (request.getRegistrationDeadline() != null && request.getEventDate() != null) {
            LocalDate deadlineDate = request.getRegistrationDeadline().toLocalDate();
            if (deadlineDate.isAfter(request.getEventDate())) {
                throw new BadRequestException("Registration deadline cannot be after the event date");
            }
        }

        if (request.getCapacity() == null || request.getCapacity() <= 0) {
            throw new BadRequestException("Event capacity must be at least 1");
        }
    }

    private void mapRequestToEntity(EventRequest request, Event event) {
        event.setTitle(request.getTitle().trim());
        event.setDescription(request.getDescription().trim());
        event.setCategory(request.getCategory());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setVenue(request.getVenue().trim());
        event.setOrganizer(request.getOrganizer().trim());
        event.setRegistrationDeadline(request.getRegistrationDeadline());
        event.setCapacity(request.getCapacity());
        event.setImageUrl(request.getImageUrl() != null ? request.getImageUrl().trim() : null);
        if (request.getStatus() != null) {
            event.setStatus(request.getStatus());
        }
    }
}
