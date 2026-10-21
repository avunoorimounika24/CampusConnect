package com.campusconnect.repository;

import com.campusconnect.entity.ContactMessage;
import com.campusconnect.entity.ContactStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findAllByOrderByCreatedAtDesc();

    long countByStatus(ContactStatus status);
}
