package com.campusconnect.service;

import com.campusconnect.dto.response.RegistrationResponse;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventRegistration;
import com.campusconnect.entity.EventStatus;
import com.campusconnect.entity.RegistrationStatus;
import com.campusconnect.entity.Role;
import com.campusconnect.entity.User;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.exception.EventFullException;
import com.campusconnect.exception.RegistrationClosedException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventRegistrationRepository;
import com.campusconnect.repository.EventRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final EventRegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final AuthService authService;

    public RegistrationService(EventRegistrationRepository registrationRepository,
                               EventRepository eventRepository,
                               AuthService authService) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.authService = authService;
    }

    /**
     * Concurrency-safe event registration using pessimistic locking.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public RegistrationResponse registerForEvent(Long eventId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new BadRequestException("You must be logged in to register for an event");
        }

        // Lock event record for update to prevent capacity race conditions
        Event event = eventRepository.findByIdWithLock(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        // 1. Check Event Status
        if (event.getStatus() != EventStatus.ACTIVE) {
            throw new BadRequestException("Registration is closed. This event is " + event.getStatus());
        }

        // 2. Check Registration Deadline
        if (event.getRegistrationDeadline() != null && LocalDateTime.now().isAfter(event.getRegistrationDeadline())) {
            throw new RegistrationClosedException("Registration deadline for this event has passed");
        }

        // 3. Check for existing active registration
        Optional<EventRegistration> existingOpt = registrationRepository.findByUserIdAndEventId(currentUser.getId(), eventId);
        if (existingOpt.isPresent() && existingOpt.get().getRegistrationStatus() == RegistrationStatus.CONFIRMED) {
            throw new DuplicateResourceException("You are already registered for this event");
        }

        // 4. Check available capacity
        long currentConfirmed = registrationRepository.countByEventIdAndRegistrationStatus(eventId, RegistrationStatus.CONFIRMED);
        if (currentConfirmed >= event.getCapacity()) {
            throw new EventFullException("This event has reached its maximum capacity of " + event.getCapacity() + " participants");
        }

        // 5. Persist or reactivate registration
        EventRegistration registration;
        if (existingOpt.isPresent()) {
            registration = existingOpt.get();
            registration.setRegistrationStatus(RegistrationStatus.CONFIRMED);
            registration.setRegistrationDate(LocalDateTime.now());
        } else {
            registration = new EventRegistration(currentUser, event, RegistrationStatus.CONFIRMED);
        }

        EventRegistration saved = registrationRepository.save(registration);
        return RegistrationResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getMyRegistrations() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new BadRequestException("Authentication required");
        }

        List<EventRegistration> list = registrationRepository.findByUserIdWithEvent(currentUser.getId());
        return list.stream()
                .map(RegistrationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RegistrationResponse getMyRegistrationById(Long registrationId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new BadRequestException("Authentication required");
        }

        EventRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        // Ensure student can only view their own registration unless admin
        if (!registration.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Access denied: You cannot view another student's registration");
        }

        return RegistrationResponse.fromEntity(registration);
    }

    @Transactional
    public RegistrationResponse cancelRegistration(Long registrationId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            throw new BadRequestException("Authentication required");
        }

        EventRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        if (!registration.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Access denied: You cannot cancel another student's registration");
        }

        if (registration.getRegistrationStatus() == RegistrationStatus.CANCELLED) {
            throw new BadRequestException("This registration is already cancelled");
        }

        registration.setRegistrationStatus(RegistrationStatus.CANCELLED);
        EventRegistration saved = registrationRepository.save(registration);
        return RegistrationResponse.fromEntity(saved);
    }
}
