package com.campusconnect.service;

import com.campusconnect.dto.response.RegistrationResponse;
import com.campusconnect.entity.*;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.DuplicateResourceException;
import com.campusconnect.exception.EventFullException;
import com.campusconnect.exception.RegistrationClosedException;
import com.campusconnect.repository.EventRegistrationRepository;
import com.campusconnect.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private EventRegistrationRepository registrationRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private AuthService authService;

    @InjectMocks
    private RegistrationService registrationService;

    private User student1;
    private User student2;
    private Event event;

    @BeforeEach
    void setUp() {
        student1 = new User(1L, "Student One", "student1@campus.edu", "S001", "CSE", "3rd", "hash", Role.ROLE_STUDENT);
        student2 = new User(2L, "Student Two", "student2@campus.edu", "S002", "ECE", "2nd", "hash", Role.ROLE_STUDENT);

        event = new Event();
        event.setId(100L);
        event.setTitle("Full Stack Workshop");
        event.setCapacity(50);
        event.setStatus(EventStatus.ACTIVE);
        event.setEventDate(LocalDate.now().plusDays(5));
        event.setStartTime(LocalTime.of(10, 0));
        event.setEndTime(LocalTime.of(17, 0));
        event.setRegistrationDeadline(LocalDateTime.now().plusDays(4));
    }

    @Test
    @DisplayName("Should successfully register a student for an active event")
    void testStudentRegistration_Success() {
        when(authService.getCurrentAuthenticatedUser()).thenReturn(student1);
        when(eventRepository.findByIdWithLock(100L)).thenReturn(Optional.of(event));
        when(registrationRepository.findByUserIdAndEventId(1L, 100L)).thenReturn(Optional.empty());
        when(registrationRepository.countByEventIdAndRegistrationStatus(100L, RegistrationStatus.CONFIRMED)).thenReturn(10L);

        EventRegistration savedReg = new EventRegistration(student1, event, RegistrationStatus.CONFIRMED);
        savedReg.setId(500L);
        when(registrationRepository.save(any(EventRegistration.class))).thenReturn(savedReg);

        RegistrationResponse response = registrationService.registerForEvent(100L);

        assertNotNull(response);
        assertEquals(500L, response.getId());
        assertEquals(RegistrationStatus.CONFIRMED, response.getStatus());
        assertEquals("Full Stack Workshop", response.getEventTitle());
        verify(registrationRepository, times(1)).save(any(EventRegistration.class));
    }

    @Test
    @DisplayName("Should prevent duplicate registration for the same event")
    void testDuplicateRegistrationPrevention() {
        when(authService.getCurrentAuthenticatedUser()).thenReturn(student1);
        when(eventRepository.findByIdWithLock(100L)).thenReturn(Optional.of(event));

        EventRegistration existing = new EventRegistration(student1, event, RegistrationStatus.CONFIRMED);
        when(registrationRepository.findByUserIdAndEventId(1L, 100L)).thenReturn(Optional.of(existing));

        assertThrows(DuplicateResourceException.class, () -> registrationService.registerForEvent(100L));
        verify(registrationRepository, never()).save(any(EventRegistration.class));
    }

    @Test
    @DisplayName("Should enforce event capacity limit")
    void testCapacityEnforcement() {
        when(authService.getCurrentAuthenticatedUser()).thenReturn(student1);
        when(eventRepository.findByIdWithLock(100L)).thenReturn(Optional.of(event));
        when(registrationRepository.findByUserIdAndEventId(1L, 100L)).thenReturn(Optional.empty());
        // Capacity is 50, and 50 confirmed registrations already exist
        when(registrationRepository.countByEventIdAndRegistrationStatus(100L, RegistrationStatus.CONFIRMED)).thenReturn(50L);

        assertThrows(EventFullException.class, () -> registrationService.registerForEvent(100L));
        verify(registrationRepository, never()).save(any(EventRegistration.class));
    }

    @Test
    @DisplayName("Should reject registration after deadline has passed")
    void testRegistrationDeadlinePassed() {
        event.setRegistrationDeadline(LocalDateTime.now().minusHours(1));
        when(authService.getCurrentAuthenticatedUser()).thenReturn(student1);
        when(eventRepository.findByIdWithLock(100L)).thenReturn(Optional.of(event));

        assertThrows(RegistrationClosedException.class, () -> registrationService.registerForEvent(100L));
    }

    @Test
    @DisplayName("Should enforce student privacy: Student cannot view another student's registration")
    void testStudentRegistrationPrivacy() {
        when(authService.getCurrentAuthenticatedUser()).thenReturn(student1); // Logged in as student 1

        EventRegistration otherStudentReg = new EventRegistration(student2, event, RegistrationStatus.CONFIRMED);
        otherStudentReg.setId(888L);
        when(registrationRepository.findById(888L)).thenReturn(Optional.of(otherStudentReg));

        assertThrows(AccessDeniedException.class, () -> registrationService.getMyRegistrationById(888L));
    }

    @Test
    @DisplayName("Should successfully cancel an active registration")
    void testRegistrationCancellation_Success() {
        when(authService.getCurrentAuthenticatedUser()).thenReturn(student1);

        EventRegistration myReg = new EventRegistration(student1, event, RegistrationStatus.CONFIRMED);
        myReg.setId(555L);
        when(registrationRepository.findById(555L)).thenReturn(Optional.of(myReg));
        when(registrationRepository.save(any(EventRegistration.class))).thenReturn(myReg);

        RegistrationResponse response = registrationService.cancelRegistration(555L);

        assertNotNull(response);
        assertEquals(RegistrationStatus.CANCELLED, response.getStatus());
        verify(registrationRepository, times(1)).save(myReg);
    }
}
