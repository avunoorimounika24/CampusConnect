package com.campusconnect.controller;

import com.campusconnect.dto.request.ContactRequest;
import com.campusconnect.dto.response.ApiResponse;
import com.campusconnect.entity.ContactMessage;
import com.campusconnect.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> submitMessage(@Valid @RequestBody ContactRequest request) {
        contactService.saveMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thank you for contacting CampusConnect! Your message has been received."));
    }

    @GetMapping("/messages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ContactMessage>>> getMessages() {
        List<ContactMessage> messages = contactService.getAllMessages();
        return ResponseEntity.ok(ApiResponse.success("Contact messages retrieved successfully", messages));
    }
}
