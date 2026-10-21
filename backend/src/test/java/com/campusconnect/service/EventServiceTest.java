package com.campusconnect.service;

import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventCategory;
import com.campusconnect.entity.EventStatus;
import com.campusconnect.entity.RegistrationStatus;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventRegistrationRepository;
import com.campusconnect.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventRegistrationRepository registrationRepository;

    @Mock
    private AuthService authService;

    @InjectMocks
    private EventService eventService;

    private Event event;

    @BeforeEach
    void setUp() {
        event = new Event();
        event.setId(1L);
        event.setTitle("Campus Hackathon");
        event.setDescription("36-hour code marathon");
        event.setCategory(EventCategory.HACKATHONS);
        event.setEventDate(LocalDate.now().plusDays(10));
        event.setStartTime(LocalTime.of(9, 0));
        event.setEndTime(LocalTime.of(18, 0));
        event.setVenue("Auditorium");
        event.setOrganizer("Tech Club");
        event.setRegistrationDeadline(LocalDateTime.now().plusDays(8));
        event.setCapacity(100);
        event.setStatus(EventStatus.ACTIVE);
    }

    @Test
    @DisplayName("Should retrieve public paginated event listing")
    void testPublicEventListing() {
        Page<Event> page = new PageImpl<>(Collections.singletonList(event));
        when(eventRepository.searchEvents(any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(page);
        when(registrationRepository.countByEventIdAndRegistrationStatus(1L, RegistrationStatus.CONFIRMED))
                .thenReturn(25L);

        Page<EventResponse> result = eventService.getEvents(null, null, null, null, 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        EventResponse first = result.getContent().get(0);
        assertEquals("Campus Hackathon", first.getTitle());
        assertEquals(25L, first.getRegisteredCount());
        assertEquals(75L, first.getRemainingSeats());
    }

    @Test
    @DisplayName("Should retrieve event details by ID")
    void testEventDetailsRetrieval() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(registrationRepository.countByEventIdAndRegistrationStatus(1L, RegistrationStatus.CONFIRMED))
                .thenReturn(10L);

        EventResponse response = eventService.getEventById(1L);

        assertNotNull(response);
        assertEquals("Campus Hackathon", response.getTitle());
        assertEquals(90L, response.getRemainingSeats());
        assertFalse(response.isFull());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when event ID does not exist")
    void testEventNotFound() {
        when(eventRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> eventService.getEventById(999L));
    }
}
