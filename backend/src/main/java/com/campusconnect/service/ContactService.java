package com.campusconnect.service;

import com.campusconnect.dto.request.ContactRequest;
import com.campusconnect.entity.ContactMessage;
import com.campusconnect.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public ContactMessage saveMessage(ContactRequest request) {
        ContactMessage message = new ContactMessage(
                request.getName().trim(),
                request.getEmail().trim().toLowerCase(),
                request.getSubject().trim(),
                request.getMessage().trim()
        );
        return contactMessageRepository.save(message);
    }

    @Transactional(readOnly = true)
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }
}
