package com.campusconnect.controller;

import com.campusconnect.dto.request.EventRequest;
import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.entity.EventCategory;
import com.campusconnect.entity.EventStatus;
import com.campusconnect.service.AdminService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AdminService adminService;

    private EventRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new EventRequest();
        validRequest.setTitle("Alumni Meet 2026");
        validRequest.setDescription("Networking and mentorship");
        validRequest.setCategory(EventCategory.CULTURAL);
        validRequest.setEventDate(LocalDate.now().plusDays(20));
        validRequest.setStartTime(LocalTime.of(15, 0));
        validRequest.setEndTime(LocalTime.of(19, 0));
        validRequest.setVenue("Grand Auditorium");
        validRequest.setOrganizer("Alumni Cell");
        validRequest.setRegistrationDeadline(LocalDateTime.now().plusDays(18));
        validRequest.setCapacity(250);
        validRequest.setStatus(EventStatus.ACTIVE);
    }

    @Test
    @DisplayName("Administrator should be authorized to create events (201 Created)")
    @WithMockUser(username = "admin@campusconnect.edu", roles = {"ADMIN"})
    void testAdminCreateEvent_Authorized() throws Exception {
        EventResponse mockResponse = new EventResponse();
        mockResponse.setId(1L);
        mockResponse.setTitle("Alumni Meet 2026");

        when(adminService.createEvent(any(EventRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/admin/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("Student user should be REJECTED with 403 Forbidden when attempting to create events")
    @WithMockUser(username = "student@rgukt.ac.in", roles = {"STUDENT"})
    void testStudentCreateEvent_Forbidden() throws Exception {
        mockMvc.perform(post("/api/admin/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Unauthenticated visitor should be rejected when attempting to access admin endpoints")
    void testUnauthenticatedCreateEvent_Unauthorized() throws Exception {
        mockMvc.perform(post("/api/admin/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isForbidden());
    }
}
