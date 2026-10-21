package com.campusconnect.service;

import com.campusconnect.dto.request.EventRequest;
import com.campusconnect.dto.response.AdminDashboardStatsResponse;
import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventCategory;
import com.campusconnect.entity.EventStatus;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.repository.EventRegistrationRepository;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventRegistrationRepository registrationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminService adminService;

    private EventRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new EventRequest();
        validRequest.setTitle("Robotics Competition");
        validRequest.setDescription("Annual robotics challenge");
        validRequest.setCategory(EventCategory.TECHNICAL);
        validRequest.setEventDate(LocalDate.now().plusDays(14));
        validRequest.setStartTime(LocalTime.of(10, 0));
        validRequest.setEndTime(LocalTime.of(17, 0));
        validRequest.setVenue("Robotics Lab");
        validRequest.setOrganizer("Robotics Society");
        validRequest.setRegistrationDeadline(LocalDateTime.now().plusDays(12));
        validRequest.setCapacity(80);
        validRequest.setStatus(EventStatus.ACTIVE);
    }

    @Test
    @DisplayName("Should successfully create a new event with valid data")
    void testCreateEvent_Success() {
        Event saved = new Event();
        saved.setId(10L);
        saved.setTitle("Robotics Competition");
        saved.setCategory(EventCategory.TECHNICAL);
        saved.setCapacity(80);
        saved.setStatus(EventStatus.ACTIVE);
        saved.setEventDate(LocalDate.now().plusDays(14));
        saved.setStartTime(LocalTime.of(10, 0));
        saved.setEndTime(LocalTime.of(17, 0));

        when(eventRepository.save(any(Event.class))).thenReturn(saved);

        EventResponse response = adminService.createEvent(validRequest);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Robotics Competition", response.getTitle());
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    @DisplayName("Should reject event creation when end time is before start time")
    void testCreateEvent_InvalidTime() {
        validRequest.setStartTime(LocalTime.of(17, 0));
        validRequest.setEndTime(LocalTime.of(10, 0)); // end before start

        assertThrows(BadRequestException.class, () -> adminService.createEvent(validRequest));
        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    @DisplayName("Should reject event creation when registration deadline is after event date")
    void testCreateEvent_InvalidDeadline() {
        validRequest.setEventDate(LocalDate.now().plusDays(5));
        validRequest.setRegistrationDeadline(LocalDateTime.now().plusDays(10)); // deadline after event

        assertThrows(BadRequestException.class, () -> adminService.createEvent(validRequest));
        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    @DisplayName("Should retrieve correct dashboard statistics")
    void testGetDashboardStats() {
        when(eventRepository.count()).thenReturn(12L);
        when(eventRepository.countUpcomingEvents(any())).thenReturn(8L);
        when(eventRepository.countCompletedEvents(any())).thenReturn(4L);
        when(registrationRepository.countByRegistrationStatus(any())).thenReturn(150L);
        when(userRepository.countByRole(any())).thenReturn(95L);
        when(registrationRepository.findRecentRegistrations(any())).thenReturn(Collections.emptyList());

        AdminDashboardStatsResponse stats = adminService.getDashboardStats();

        assertNotNull(stats);
        assertEquals(12L, stats.getTotalEvents());
        assertEquals(8L, stats.getUpcomingEvents());
        assertEquals(4L, stats.getCompletedEvents());
        assertEquals(150L, stats.getTotalRegistrations());
        assertEquals(95L, stats.getTotalStudents());
    }
}
