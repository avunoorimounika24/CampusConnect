package com.campusconnect.controller;

import com.campusconnect.dto.request.ContactRequest;
import com.campusconnect.entity.ContactMessage;
import com.campusconnect.security.CustomUserDetailsService;
import com.campusconnect.security.JwtService;
import com.campusconnect.service.ContactService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ContactService contactService;

    @Test
    @DisplayName("Should successfully submit valid contact message")
    void testSubmitContactMessage_Success() throws Exception {
        ContactRequest request = new ContactRequest("John Student", "john@college.edu", "Event query", "Can I bring a guest to the workshop?");

        when(contactService.saveMessage(any(ContactRequest.class))).thenReturn(new ContactMessage());

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("Should reject contact message with invalid email format")
    void testSubmitContactMessage_InvalidEmail() throws Exception {
        ContactRequest request = new ContactRequest("John Student", "invalid-email-format", "Event query", "Message body here");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("Should reject contact message with missing required fields")
    void testSubmitContactMessage_MissingFields() throws Exception {
        ContactRequest request = new ContactRequest("", "", "", "");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
